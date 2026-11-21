/**
 * Money in this catalog is an integer number of minor units (cents) in
 * BASE_CURRENCY, and BASE_CURRENCY is **LKR**, because that is what the Dodo
 * products are denominated in. The rupee figure on the page is the price: it is
 * the number Dodo charges a Sri Lankan card, to the cent, and the number an
 * overseas card is converted *from* by Adaptive Currency at Dodo's own live rate.
 *
 * It used to be the other way round — dollars stored, rupees derived for display
 * — which meant the site showed a derived number big and the real one small. If
 * you are reverting anything here, revert that direction too, or the page and
 * the checkout will disagree.
 *
 * Consequences worth knowing:
 *
 * - The **dollar** figure is now the approximation. It is derived at LKR_PER_USD
 *   and drifts as the rupee moves, so it is always rendered behind a `≈` and the
 *   terms of service say so in words. Never put it anywhere binding.
 * - `orders.amount_cents` arrives in LKR minor units with `currency = 'LKR'`,
 *   while `settlement_amount_cents` is the USD we are actually paid. Reading
 *   amount_cents as dollars is ~332x wrong, which is the kind of wrong that
 *   looks plausible in a spreadsheet.
 * - Payouts are USD, GBP or EUR only, never LKR, whatever the product is priced
 *   in. The LK bank receives USD and converts at its own rate.
 */
export const BASE_CURRENCY = "LKR" as const;

/**
 * The rate the courtesy dollar figure is derived at. Display only — nothing is
 * ever charged at it, and no stored price depends on it any more, which is the
 * one good thing about this inversion: a stale rate here now makes the small
 * grey approximation wrong instead of the headline price.
 *
 * Last set 2026-11-21 at ~332 (mid-market 332.2-332.6; the rupee is down about
 * 9% over twelve months, which is why the previous 305 had drifted far enough
 * to matter).
 */
export const LKR_PER_USD = 332;

/**
 * "Rs 89,990" when it's whole, "Rs 89,990.50" when it isn't.
 *
 * narrowSymbol only for LKR: it is what turns "LKR 89,990" into "Rs 89,990",
 * which is how a price is written here. Everything else keeps `symbol`, because
 * narrowSymbol renders AUD and CAD as a bare "$" — fine for a price list of one
 * currency, actively misleading in an order email that also shows USD.
 *
 * Assumes `currency` has two decimal places. True of LKR, of USD, and of every
 * currency Adaptive Currency realistically charges our buyers in; a zero-decimal
 * currency (JPY, KRW) would render 100x too small.
 */
export function formatMoney(cents: number, currency: string = BASE_CURRENCY) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: currency === "LKR" ? "narrowSymbol" : "symbol",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/**
 * "≈ $271" — the courtesy conversion for someone reading from outside Sri Lanka.
 *
 * Rounded to whole dollars, because the cents of a figure that moves daily are
 * noise. Always rendered with the `≈` it carries, never on its own.
 */
export function formatUsdApprox(cents: number) {
  const usd = Math.round(cents / 100 / LKR_PER_USD);
  return `≈ ${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd)}`;
}

export const sumCents = (ns: (number | undefined)[]) => ns.reduce<number>((a, b) => a + (b ?? 0), 0);
