import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE, SOLUTION_WE_NEED, getSolution } from "@/lib/content";
import { BASE_CURRENCY, formatMoney } from "@/lib/money";
import { findOrderByReference } from "@/lib/orders";
import { verifyReference } from "@/lib/orderRef";
import { OrderTimeline } from "@/components/solutions/OrderTimeline";
import { PageHero } from "@/components/sections/PageHero";
import { Eyebrow, Reveal } from "@/components/ui/motion";

/**
 * One order, looked up by its reference and opened from the link in the
 * confirmation email.
 *
 * **The token is the whole access control.** A reference is ~40 bits and gets
 * printed on the thanks page, read down the phone and quoted in replies — it is
 * an identifier, not a secret, and a determined script could walk the space. So
 * the link carries an HMAC of it and this page renders nothing without a valid
 * one. A bad or missing token is a notFound(), not a 401, so the route can't be
 * used to find out which references exist.
 *
 * No accounts, no passwords, no sessions. For four products bought once each,
 * a signed link does the whole job an account would, and there is no login to
 * forget a year later.
 */

export const metadata: Metadata = {
  title: "Your order",
  description: "Where your build has got to.",
  robots: { index: false, follow: false },
};

// The row is read per request and changes as the studio advances the build.
export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ t?: string | string[] }>;
}) {
  const { ref } = await params;
  const sp = await searchParams;
  const token = typeof sp.t === "string" ? sp.t : undefined;

  const reference = decodeURIComponent(ref).toUpperCase();
  if (!verifyReference(reference, token)) notFound();

  const order = await findOrderByReference(reference);

  // A valid signature for an order we can't read: either the webhook hasn't
  // landed yet, or the database is unreachable. Both are temporary and neither
  // is the buyer's fault, so say so rather than showing them a 404.
  if (!order) {
    return (
      <>
        <PageHero
          eyebrow="Your order"
          heavy="Nearly there"
          light="we can't see this one yet"
          intro={
            <p className="max-w-[48ch]">
              That order reference is valid, but we can&apos;t pull it up at the moment — payment records can take a
              minute to reach us. Try again shortly, and if it still isn&apos;t here, just reply to your confirmation
              email and we&apos;ll sort it out.
            </p>
          }
        />
        <section className="py-24 sm:py-36">
          <div className="wrap">
            <p className="font-mono text-sm text-mist">{reference}</p>
          </div>
        </section>
      </>
    );
  }

  const solution = order.solution ? getSolution(order.solution) : undefined;
  const placed = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(order.createdAt);

  return (
    <>
      <PageHero
        eyebrow="Your order"
        heavy={solution?.title ?? "Your site"}
        light={order.status === "delivered" ? "live and yours" : "in the queue"}
        intro={
          <p className="max-w-[48ch]">
            Ordered {placed}.{" "}
            {solution ? `${solution.turnaround}, from the moment we have your bits.` : "We'll be in touch shortly."}
          </p>
        }
      />

      <section className="py-24 sm:py-36">
        <div className="wrap flex flex-col gap-16">
          <Reveal className="grid gap-10 border-t border-line pt-10 md:grid-cols-[1fr_1.2fr]">
            <div>
              <Eyebrow index="01">The order</Eyebrow>
              <p className="mt-4 select-all font-mono text-[clamp(1.3rem,3vw,1.7rem)] tracking-tight text-accent">
                {order.reference}
              </p>
              {/* The amount actually charged, from our own row — never priceCents. */}
              {order.amountCents !== null && (
                <p className="mt-3 text-mist">
                  Paid {formatMoney(order.amountCents, order.currency ?? BASE_CURRENCY)}
                </p>
              )}
              <p className="mt-1 text-mist">{placed}</p>
            </div>

            <div>
              <Eyebrow index="02">Where it&apos;s at</Eyebrow>
              <div className="mt-6">
                <OrderTimeline status={order.status} />
              </div>
            </div>
          </Reveal>

          {order.status !== "refunded" && order.status !== "cancelled" && (
            <Reveal className="border-t border-line pt-10">
              <Eyebrow index="03">What we need from you</Eyebrow>
              <ul className="mt-4 max-w-2xl space-y-3">
                {SOLUTION_WE_NEED.map((n) => (
                  <li key={n} className="flex gap-3 border-b border-line pb-3 text-lg">
                    <span className="text-accent" aria-hidden="true">
                      →
                    </span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 max-w-[60ch] text-mist">
                Reply to your confirmation email with them
                {SITE.email ? (
                  <>
                    , or send them to{" "}
                    <a className="underline hover:text-paper" href={`mailto:${SITE.email}`}>
                      {SITE.email}
                    </a>
                  </>
                ) : null}
                . Quote {order.reference} and we&apos;ll know exactly which build it is.
              </p>
            </Reveal>
          )}

          <Reveal>
            <Link href="/off-the-shelf" className="btn btn-ghost">
              Browse the others →
            </Link>
            <p className="mt-8 max-w-[60ch] text-sm text-mist">
              Your receipt comes from Dodo Payments, who handle the payment — this page isn&apos;t a tax invoice.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
