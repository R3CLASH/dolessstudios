import type { Metadata } from "next";
import Link from "next/link";
import { SOLUTION_WE_NEED, SITE, getSolution, type Solution } from "@/lib/content";
import { BASE_CURRENCY, formatMoney } from "@/lib/money";
import { fetchPayment } from "@/lib/dodo";
import { findOrderByPaymentId, solutionFromPayment } from "@/lib/orders";
import type { Order } from "@/db/schema";
import { orderLink, orderReference } from "@/lib/orderRef";
import { OrderTimeline } from "@/components/solutions/OrderTimeline";
import { PageHero } from "@/components/sections/PageHero";
import { Eyebrow, Reveal } from "@/components/ui/motion";

/**
 * Where Dodo sends a buyer after checkout. Also the start of delivery, which is
 * why it carries the "send us your bits" list rather than just saying thanks.
 *
 * Deliberately not indexed, and `robots.ts` disallows it too.
 */
export const metadata: Metadata = {
  title: "Thank you",
  description: "Your build slot is booked.",
  robots: { index: false, follow: false },
};

/**
 * What we are willing to tell the visitor, in descending order of confidence.
 * `paid` is only ever reached from a server-side check — never from a query param.
 */
type Outcome = "paid" | "not-paid" | "pending" | "unsure";

type Resolved = {
  outcome: Outcome;
  solution: Solution | undefined;
  amountCents: number | null;
  currency: string | null;
  /**
   * Who the receipt went to. Always from Dodo or from our own row — never from
   * the `email=` query param Dodo appends to the return URL, for the same
   * reason `status` is declared below and deliberately never read.
   */
  email: string | null;
  /** Null until the webhook has landed; the reference itself doesn't need it. */
  status: Order["status"] | null;
};

/**
 * Query parameters are not proof of payment — anyone can type one. So we confirm
 * in three tiers: ask Dodo directly, fall back to our own orders row, and
 * otherwise commit to nothing.
 */
async function resolve(paymentId: string | undefined): Promise<Resolved> {
  const unsure: Resolved = {
    outcome: "unsure",
    solution: undefined,
    amountCents: null,
    currency: null,
    email: null,
    status: null,
  };
  if (!paymentId) return unsure;

  // Tier 1: authoritative. Also dodges the race where the buyer gets back here
  // before the webhook has landed, since Dodo knows before we do.
  const payment = await fetchPayment(paymentId);
  if (payment) {
    const status = payment.status ?? null;
    const outcome: Outcome =
      status === "succeeded"
        ? "paid"
        : status === "cancelled" || status === "failed" || status === "requires_payment_method"
          ? "not-paid"
          : "pending";
    return {
      outcome,
      solution: solutionFromPayment(payment),
      amountCents: payment.total_amount ?? null,
      currency: payment.currency ?? null,
      email: payment.customer?.email ?? null,
      // Dodo knows the payment succeeded; only our own row knows whether we
      // have started building. Tier 1 therefore can't fill this in.
      status: null,
    };
  }

  // Tier 2: our own record, written by the webhook.
  const order = await findOrderByPaymentId(paymentId);
  if (order) {
    return {
      outcome: order.status === "cancelled" ? "not-paid" : "paid",
      solution: order.solution ? getSolution(order.solution) : undefined,
      amountCents: order.amountCents,
      currency: order.currency,
      email: order.email,
      status: order.status,
    };
  }

  // Tier 3: say nothing we can't stand behind.
  return unsure;
}

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string | string[]; status?: string | string[] }>;
}) {
  const sp = await searchParams;
  const paymentId = typeof sp.payment_id === "string" ? sp.payment_id : undefined;
  const { outcome, solution, amountCents, currency, email, status } = await resolve(paymentId);

  // Derived from the payment id, so it survives the race this page was built
  // around: the buyer is very often back here before Dodo's webhook has landed,
  // and a reference that lived on the orders row would be blank in exactly the
  // moment they most want a number to hold on to.
  const reference = paymentId ? orderReference(paymentId) : null;
  const trackHref = reference ? orderLink(reference) : null;

  const paid = outcome === "paid";
  const heavy = paid ? "You're booked" : outcome === "not-paid" ? "Not paid" : "Thank you";
  const light = paid ? "that's the hard part done" : outcome === "not-paid" ? "nothing was charged" : "hang on a moment";

  const intro = paid
    ? solution
      ? `Your ${solution.title} is paid for and your build slot is reserved. ${solution.turnaround}, from the moment we have your bits.`
      : "Your site is paid for and your build slot is reserved."
    : outcome === "not-paid"
      ? "That payment didn't complete, so you haven't been charged. Nothing is lost — you can pick the site up again whenever you like."
      : "If the payment went through, a confirmation email is already on its way. Nothing within ten minutes? Reply to us and we'll sort it out.";

  return (
    <>
      <PageHero
        eyebrow="Off the shelf"
        heavy={heavy}
        light={light}
        intro={<p className="max-w-[48ch]">{intro}</p>}
      />

      <section className="py-24 sm:py-36">
        <div className="wrap">
          {paid && (
            <Reveal className="grid gap-10 border-t border-line pt-10 md:grid-cols-[1fr_1.2fr]">
              <div>
                <Eyebrow index="01">What you bought</Eyebrow>
                <p className="display mt-4 text-[clamp(1.8rem,4vw,2.8rem)]">
                  <span className="heavy">{solution?.title ?? "Your site"}</span>
                </p>
                {amountCents !== null && (
                  // The amount Dodo actually charged, never priceCents — so a later
                  // price edit can't rewrite what this buyer paid.
                  <p className="mt-2 text-mist">Paid {formatMoney(amountCents, currency ?? BASE_CURRENCY)}</p>
                )}
                {solution && <p className="mt-1 text-mist">{solution.turnaround}</p>}

                {reference && (
                  <div className="mt-6 rounded-2xl border border-line bg-ink-2 p-5">
                    <span className="eyebrow">Your order</span>
                    <p className="mt-2 select-all font-mono text-[clamp(1.3rem,3vw,1.7rem)] tracking-tight text-accent">
                      {reference}
                    </p>
                    <p className="mt-2 text-sm text-mist">
                      Quote this if you need to ask us anything about the build.
                    </p>
                  </div>
                )}

                {email && (
                  <p className="mt-4 text-sm text-mist">
                    Confirmation sent to <span className="text-paper">{email}</span>.
                  </p>
                )}
              </div>

              <div>
                <Eyebrow index="02">What we need from you</Eyebrow>
                <ul className="mt-4 space-y-3">
                  {SOLUTION_WE_NEED.map((n) => (
                    <li key={n} className="flex gap-3 border-b border-line pb-3 text-lg">
                      <span className="text-accent" aria-hidden="true">
                        →
                      </span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-mist">
                  Just reply to the confirmation email with them
                  {SITE.email ? (
                    <>
                      , or send them to{" "}
                      <a className="underline hover:text-paper" href={`mailto:${SITE.email}`}>
                        {SITE.email}
                      </a>
                    </>
                  ) : null}
                  .
                </p>
              </div>
            </Reveal>
          )}

          {paid && (
            <Reveal className="mt-16 border-t border-line pt-10">
              <Eyebrow index="03">Where it&apos;s at</Eyebrow>
              <div className="mt-6 max-w-2xl">
                <OrderTimeline status={status ?? "paid"} />
              </div>
            </Reveal>
          )}

          <Reveal className={paid ? "mt-16" : ""}>
            <div className="flex flex-wrap gap-4">
              {paid && trackHref && (
                <a href={trackHref} className="btn btn-accent">
                  View your order →
                </a>
              )}
              {outcome === "not-paid" && solution && (
                <Link href={`/off-the-shelf/${solution.slug}`} className="btn btn-accent">
                  Back to {solution.title} →
                </Link>
              )}
              <Link
                href="/off-the-shelf"
                className={outcome === "not-paid" || (paid && trackHref) ? "btn btn-ghost" : "btn btn-accent"}
              >
                {outcome === "not-paid" ? "See all four" : "Browse the others →"}
              </Link>
            </div>
            {paid && (
              <p className="mt-8 max-w-[60ch] text-sm text-mist">
                Your receipt comes from Dodo Payments, who handle the payment — this page isn&apos;t a tax invoice.
              </p>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
