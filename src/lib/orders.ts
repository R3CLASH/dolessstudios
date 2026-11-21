import "server-only";
import { eq } from "drizzle-orm";
import type { Payment, Refund } from "@dodopayments/core/schemas";
import { getDb, schema } from "@/db";
import { SOLUTIONS, getSolution, type Solution } from "@/lib/content";
import { productIdFor } from "@/lib/dodo";
import { sendOrderConfirmationEmail, sendOrderNotificationEmail, type OrderEmail } from "@/lib/mail";

/**
 * What a verified Dodo webhook does to our own records.
 *
 * Two rules shape everything here:
 *
 * 1. **Nothing in this module may throw.** The adaptor deliberately lets handler
 *    errors bubble up, which would answer 500 and make Dodo retry — and a retry
 *    after the row already landed means a second confirmation email to the buyer.
 *    So every path is caught and the webhook always answers 200 once the
 *    signature verified.
 * 2. **Dedupe on payment_id.** orders.payment_id is UNIQUE, so a replayed event
 *    inserts nothing and we can tell the difference from the returned rows.
 */

/**
 * Fallback dedupe for when there's no database, in the same spirit as the
 * in-memory rate limiter in actions.ts — and with the same limitation: it's
 * per-instance and forgets on a cold start. Capped so it can't grow without
 * bound on a long-lived Lambda.
 */
const seen = new Set<string>();
const SEEN_CAP = 500;

function firstSighting(paymentId: string): boolean {
  if (seen.has(paymentId)) return false;
  if (seen.size >= SEEN_CAP) {
    // Sets iterate in insertion order, so this drops the oldest id.
    for (const old of seen) {
      seen.delete(old);
      break;
    }
  }
  seen.add(paymentId);
  return true;
}

/**
 * Which solution was bought. The metadata we set on the checkout URL is the
 * primary signal; the product id is the backstop in case an order was created
 * some other way (a payment link, say, or a hand-made checkout).
 *
 * Takes a minimal shape rather than a Payment so the thanks page can reuse it:
 * the webhook sees the adaptor's Zod-parsed payload, the thanks page sees the
 * REST SDK's Payment, and the two types differ in ways we don't care about here.
 */
export function solutionFromPayment(p: {
  metadata?: Record<string, unknown> | null;
  product_cart?: readonly { product_id: string }[] | null;
}): Solution | undefined {
  const fromMetadata = p.metadata?.solution;
  if (typeof fromMetadata === "string") {
    const s = getSolution(fromMetadata);
    if (s) return s;
  }
  const productId = p.product_cart?.[0]?.product_id;
  return productId ? SOLUTIONS.find((s) => productIdFor(s) === productId) : undefined;
}

function toOrderEmail(p: Payment, solution: Solution | undefined): OrderEmail {
  return {
    paymentId: p.payment_id,
    solution,
    name: p.customer?.name ?? null,
    email: p.customer?.email ?? null,
    amountCents: p.total_amount ?? null,
    currency: p.currency ?? null,
    settlementAmountCents: p.settlement_amount ?? null,
    settlementCurrency: p.settlement_currency ?? null,
  };
}

/** Records a paid order and emails both sides, exactly once per payment id. */
export async function recordPaidOrder(p: Payment): Promise<void> {
  const solution = solutionFromPayment(p);
  const mail = toOrderEmail(p, solution);
  let stored = false;

  try {
    const db = getDb();
    if (db) {
      const inserted = await db
        .insert(schema.orders)
        .values({
          paymentId: p.payment_id,
          solution: solution?.slug ?? null,
          productId: p.product_cart?.[0]?.product_id ?? null,
          name: mail.name,
          email: mail.email,
          amountCents: mail.amountCents,
          currency: mail.currency,
          settlementAmountCents: mail.settlementAmountCents,
          settlementCurrency: mail.settlementCurrency,
          metadata: p.metadata ?? null,
        })
        .onConflictDoNothing({ target: schema.orders.paymentId })
        .returning({ id: schema.orders.id });

      // Empty means the UNIQUE constraint caught a replay. Everything downstream
      // has already happened, so stop here rather than emailing twice.
      if (inserted.length === 0) {
        console.log("[order] already recorded, ignoring replay", p.payment_id);
        return;
      }
      stored = true;
    } else if (!firstSighting(p.payment_id)) {
      console.log("[order] already seen this instance, ignoring replay", p.payment_id);
      return;
    }
  } catch (err) {
    // The payment is real and verified but we couldn't write it down. Tell the
    // studio so it can be reconciled by hand, and still return normally — a retry
    // storm would be worse, and Dodo's dashboard has the payment regardless.
    console.error("[order] insert failed; emailing an unrecorded-payment alert", p.payment_id, err);
    try {
      await sendOrderNotificationEmail(mail, { unrecorded: true });
    } catch (alertErr) {
      console.error("[order] even the alert email failed", alertErr);
    }
    return;
  }

  // Past the dedupe gate: this is the one and only time we email for this payment.
  // Each send is independent so a failure on one doesn't cost us the other.
  let studioOk = false;
  let clientOk = false;
  try {
    studioOk = await sendOrderNotificationEmail(mail);
  } catch (err) {
    console.error("[order] studio email threw", err);
  }
  try {
    clientOk = await sendOrderConfirmationEmail(mail);
  } catch (err) {
    console.error("[order] confirmation email threw", err);
  }

  // Only true when both really went out, so `where not emailed` is a worklist of
  // orders a human still has to follow up rather than a column that always reads
  // true. The senders return false rather than throwing when SMTP is unset.
  if (!studioOk || !clientOk) {
    console.error("[order] emails incomplete", p.payment_id, { studioOk, clientOk });
  }
  if (stored && studioOk && clientOk) {
    try {
      const db = getDb();
      if (db) {
        await db.update(schema.orders).set({ emailed: true }).where(eq(schema.orders.paymentId, p.payment_id));
      }
    } catch (err) {
      // Cosmetic only — the emails went out, this just records that they did.
      console.error("[order] could not flag the order as emailed", p.payment_id, err);
    }
  }
}

/**
 * Marks an order refunded. Deliberately quiet: Dodo emails the buyer about the
 * refund itself, and a partial refund still leaves a build to talk about, so this
 * only moves the status for the build queue to reflect.
 */
export async function markOrderRefunded(r: Refund): Promise<void> {
  try {
    const db = getDb();
    if (!db) {
      console.log("[order] no database; refund not recorded", r.payment_id);
      return;
    }
    await db.update(schema.orders).set({ status: "refunded" }).where(eq(schema.orders.paymentId, r.payment_id));
    console.log("[order] marked refunded", r.payment_id, r.is_partial ? "(partial)" : "(full)");
  } catch (err) {
    console.error("[order] could not mark the order refunded", r.payment_id, err);
  }
}

/** Logs a failed payment. No row and no email — nothing was bought. */
export function noteFailedPayment(p: Payment): void {
  console.warn("[order] payment failed", p.payment_id, p.error_code ?? "", p.error_message ?? "");
}

/** The order behind a thanks-page visit, or null. Read-only, and never throws. */
export async function findOrderByPaymentId(paymentId: string) {
  try {
    const db = getDb();
    if (!db) return null;
    const rows = await db.select().from(schema.orders).where(eq(schema.orders.paymentId, paymentId)).limit(1);
    return rows[0] ?? null;
  } catch (err) {
    console.error("[order] lookup failed", paymentId, err);
    return null;
  }
}
