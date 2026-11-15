/**
 * Money is always an integer number of minor units (cents) in BASE_CURRENCY.
 * Dodo Payments settles in this currency; LKR only exists at checkout through
 * Adaptive Currency, which converts there and charges the customer the FX fee.
 */
export const BASE_CURRENCY = "USD" as const;

/**
 * Display-only rupee rate. Nothing is ever charged at this rate — Dodo converts
 * at checkout — it exists so local clients see a number they can think in.
 * Update it when it drifts more than ~5%. Last set 2026-11-15.
 */
export const LKR_PER_USD = 305;

/** "$249" when it's whole, "$249.50" when it isn't. */
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
