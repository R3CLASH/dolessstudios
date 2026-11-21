/**
 * Money in this catalog is an integer number of minor units (cents) in
 * BASE_CURRENCY. Dodo settles and pays out in it — payouts are USD, GBP or EUR
 * only, never LKR, whatever the product is priced in.
 *
 * Read this before touching a price: **the Dodo products are denominated in
 * LKR, not in USD.** The rupee figure is what the buyer is actually charged
 * (Adaptive Currency converts it for an overseas card at Dodo's own live rate),
 * and the dollar figure in SOLUTIONS is derived from it at LKR_PER_USD below.
 * That inverts what this file used to assume, and it has one consequence worth
 * knowing: the USD price on the site can never match the checkout exactly, and
 * drifts as the rupee moves. It is a close approximation, not a guarantee.
 *
 * Also why `orders.amount_cents` now arrives in LKR minor units with
 * `currency = 'LKR'`, while `settlement_amount_cents` is the USD we are paid.
 * Nothing re-states a price after payment, so the emails and the thanks page
 * show both, and reading amount_cents as dollars would be ~332x wrong.
 */
export const BASE_CURRENCY = "USD" as const;

/**
 * The rate the catalog's dollar prices are derived at, and the one
 * formatLkrApprox shows local clients. Keep it near the real mid-market rate:
 * every USD price on the site is priceCents, and priceCents came from dividing
 * the Dodo product's rupee price by this, so a stale rate here silently
 * advertises the wrong dollar amount.
 *
 * Last set 2026-11-21 at ~332 (mid-market was 332.2-332.6; the rupee is down
 * about 9% over twelve months, which is why the previous 305 had drifted far
 * enough to matter). Re-derive the priceCents values whenever you change it.
 */
export const LKR_PER_USD = 332;

/**
 * "$249" when it's whole, "$249.50" when it isn't.
 *
 * Assumes `currency` has two decimal places, which is true of USD and of every
 * currency Adaptive Currency realistically charges our buyers in. A zero-decimal
 * currency (JPY, KRW) would render 100x too small — worth knowing if an order
 * email ever looks absurdly cheap.
 */
export function formatMoney(cents: number, currency: string = BASE_CURRENCY) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** "≈ Rs 76,000" — rounded hard to the nearest thousand, so nobody reads it as a quote. */
export function formatLkrApprox(cents: number) {
  const lkr = Math.round(((cents / 100) * LKR_PER_USD) / 1000) * 1000;
  const n = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
    currencyDisplay: "narrowSymbol",
  }).format(lkr);
  return `≈ ${n}`;
}

export const sumCents = (ns: (number | undefined)[]) => ns.reduce<number>((a, b) => a + (b ?? 0), 0);
