import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { SITE } from "@/lib/content";

/**
 * The human-readable half of an order: "DLS-7F3K2A9".
 *
 * **Derived from the payment id, never random.** That one decision is what makes
 * the reference available everywhere it needs to be:
 *
 * - The buyer very often lands back on /off-the-shelf/thanks *before* Dodo's
 *   webhook has reached us — the race the three-tier resolve() in that page was
 *   written for. A random reference would have to come out of the orders row,
 *   so there would be nothing to show in exactly the moment the buyer most
 *   wants a number. A derived one is computable from the payment id alone, with
 *   no database and no row.
 * - The webhook, the two order emails and the status page all recompute the
 *   same string from the same input, so they cannot disagree.
 * - A replayed webhook event cannot mint a second reference for one payment.
 *
 * Crockford base32 (no I, L, O or U) because this gets read down a phone and
 * written on a notepad. Five bytes is ~40 bits; collisions would need ~1M orders
 * before they were worth thinking about, and orders.reference is UNIQUE anyway,
 * so a real one would surface as a failed insert rather than two buyers quietly
 * sharing a number.
 */
const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function orderReference(paymentId: string): string {
  const bytes = createHash("sha256").update(paymentId).digest();
  let acc = 0n;
  for (let i = 0; i < 5; i++) acc = (acc << 8n) | BigInt(bytes[i]);
  let out = "";
  for (let i = 0; i < 8; i++) {
    out = CROCKFORD[Number(acc & 31n)] + out;
    acc >>= 5n;
  }
  return `DLS-${out}`;
}

/**
 * The secret the /orders/[ref] links are signed with. Absent must read as
 * absent, exactly like getDb(), getTransport() and dodoKey(): with no secret
 * set, mail.ts leaves the link out of the confirmation email and the status
 * page answers notFound(). Nothing throws, and nothing half-works.
 */
function linkSecret(): string | null {
  return process.env.ORDER_LINK_SECRET || null;
}

/**
 * A reference is only ~40 bits, which is too thin to be a bearer token on its
 * own — a determined script could walk the space. So the emailed link carries an
 * HMAC of it, and the page refuses to render without a valid one. That keeps the
 * reference itself safe to print on screen, read aloud and quote in a reply.
 */
export function signReference(reference: string): string | null {
  const secret = linkSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(reference).digest("base64url").slice(0, 32);
}

export function verifyReference(reference: string, token: string | undefined): boolean {
  if (!token) return false;
  const expected = signReference(reference);
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  // timingSafeEqual throws on a length mismatch, so check that first.
  return a.length === b.length && timingSafeEqual(a, b);
}

/** The absolute link that goes in the buyer's confirmation email, or null when unsigned. */
export function orderLink(reference: string): string | null {
  const token = signReference(reference);
  if (!token) return null;
  return `${SITE.url.replace(/\/$/, "")}/orders/${encodeURIComponent(reference)}?t=${token}`;
}
