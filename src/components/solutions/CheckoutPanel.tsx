"use client";

import { useState } from "react";
import { BASE_CURRENCY, formatMoney, formatUsdApprox } from "@/lib/money";
import { InlineCheckout } from "@/components/solutions/InlineCheckout";

/**
 * The two halves of the checkout page: what you're buying on the left, the
 * payment frame on the right.
 *
 * Client-side purely so the summary can listen to the frame. Dodo add tax at
 * checkout that our price pages never mention — a Rs 89,990 site arriving as
 * £248.14 was the thing that prompted this page — so the summary starts at our
 * catalog price and then defers to whatever the frame reports via
 * `checkout.breakdown`. Our column and their frame always show the same number.
 */

type Breakdown = { subTotal?: number; tax?: number; total?: number; currency?: string };

export function CheckoutPanel({
  slug,
  title,
  tagline,
  priceCents,
  turnaround,
  pages,
}: {
  slug: string;
  title: string;
  tagline: string;
  priceCents: number;
  turnaround: string;
  pages: string[];
}) {
  const [b, setB] = useState<Breakdown | null>(null);

  // Until the frame speaks, the catalog price is the only number we have and
  // it is the honest one to show. Once it does, its figures win outright.
  const currency = b?.currency ?? BASE_CURRENCY;
  const subTotal = b?.subTotal ?? priceCents;
  const total = b?.total ?? priceCents;
  const tax = b?.tax;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
      {/* ── What you're buying ───────────────────────────────────────── */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-6 rounded-2xl border border-line bg-ink-2 p-6 sm:p-8">
          <div className="flex flex-col gap-1">
            <span className="eyebrow">You&apos;re buying</span>
            <h2 className="display heavy text-[clamp(1.9rem,3.6vw,2.6rem)] leading-none">{title}</h2>
            <p className="mt-2 text-paper/70">{tagline}</p>
          </div>

          <ul className="flex flex-col gap-2 border-t border-line pt-5 text-sm">
            <li className="flex items-baseline justify-between gap-4 text-paper/80">
              <span>{title}, done for you</span>
              <span className="font-mono tabular-nums text-mist">{formatMoney(subTotal, currency)}</span>
            </li>
            {tax !== undefined && tax > 0 && (
              <li className="flex items-baseline justify-between gap-4 text-paper/80">
                <span>
                  Tax <span className="text-mist">· worked out by Dodo from your country</span>
                </span>
                <span className="font-mono tabular-nums text-mist">{formatMoney(tax, currency)}</span>
              </li>
            )}
          </ul>

          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-5">
            <span className="eyebrow">Total</span>
            <span aria-live="polite" className="display heavy text-[clamp(1.8rem,3.6vw,2.6rem)] leading-none tabular-nums text-accent">
              {formatMoney(total, currency)}
            </span>
            {currency === BASE_CURRENCY && <span className="font-mono text-sm text-mist">{formatUsdApprox(total)}</span>}
          </div>

          {currency !== BASE_CURRENCY && (
            <p className="-mt-2 text-sm text-mist">
              Priced at {formatMoney(priceCents)}. Your card is charged in {currency}, converted by Dodo at their rate.
            </p>
          )}

          <p className="border-t border-line pt-5 text-sm text-paper/70">
            {turnaround}, from the moment we have your bits.
          </p>

          <ul className="flex flex-wrap gap-2">
            {pages.map((p) => (
              <li key={p} className="chip">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Paying for it ────────────────────────────────────────────── */}
      <div>
        <InlineCheckout slug={slug} onBreakdown={setB} />
      </div>
    </div>
  );
}
