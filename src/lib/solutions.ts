import "server-only";
import type { Solution } from "@/lib/content";
import { dodoEnv, dodoKey, productIdFor } from "@/lib/dodo";

/**
 * Where the "buy it as-is" button points, or null when instant checkout isn't
 * available yet. The detail page passes the result down as a prop, so the button
 * only exists once payments are really configured — and no Dodo environment
 * variable ever has to be exposed to the browser.
 *
 * Both halves matter: without a key the /checkout route can't talk to Dodo, and
 * without a product id for the current mode there's nothing to sell. Either one
 * missing means the configurator routes to the quote form instead — no dead end.
 *
 * Note this runs at BUILD time, not per request: the detail page is prerendered
 * via generateStaticParams. So DODO_PAYMENTS_API_KEY and DODO_PAYMENTS_ENVIRONMENT
 * have to be present during `npm run build:aws` (deploy.yml passes them to the
 * build step), and turning payments on needs a redeploy, not just an env change.
 */
export function checkoutHrefFor(solution: Solution): string | null {
  const id = productIdFor(solution);
  if (!dodoKey() || !id) return null;
  // No metadata_solution here on purpose: /checkout discards the caller's query
  // and re-derives the slug from its own catalog lookup, so passing one only
  // reads as if it mattered.
  return `/checkout?productId=${encodeURIComponent(id)}`;
}

/**
 * Refuses to build a live_mode site whose catalog is only half sellable.
 *
 * `checkoutHrefFor()` returning null is the right behaviour in every other
 * situation — no key, test mode, a product nobody has created yet — because the
 * CTA falls back to the quote form and nothing dead-ends. In **live mode** that
 * same graceful fallback is the problem: the catalog looks finished, the buy
 * buttons are there on five pages, and the sixth quietly sells nothing. That is
 * a silent revenue bug, and the kind you find out about from a customer.
 *
 * So: unkeyed is a no-op (CI builds with no secrets at all and must keep
 * working), test mode warns and carries on, and live mode throws. Same posture
 * as dodoEnv() — the dangerous state is the one you have to ask for by name.
 *
 * Call this from `generateStaticParams()` and nowhere else. That runs once at
 * build and never per request, which matters: the Lambda reads its environment
 * from Terraform while the bundle was built from the workflow's, so a throw at
 * request time could 500 a page that built perfectly well (traps #13 and #15).
 */
export function assertLiveCatalogSellable(solutions: readonly Solution[]): void {
  if (!dodoKey()) return;

  const missing = solutions.filter((s) => !productIdFor(s)).map((s) => s.slug);
  if (missing.length === 0) return;

  if (dodoEnv() !== "live_mode") {
    console.warn(
      `[dodo] test_mode: no product id for ${missing.join(", ")} — ` +
        `${missing.length} of ${solutions.length} solutions will route to the quote form.`,
    );
    return;
  }

  throw new Error(
    `[dodo] live_mode build with no live product id for: ${missing.join(", ")}.\n` +
      `Those pages would show a quote form while the rest take cards, so the build is being ` +
      `stopped instead. Create a live product per solution in the Dodo dashboard (LKR, priced to ` +
      `match priceCents exactly) and paste the ids into dodoProductId.live in src/lib/content.ts. ` +
      `See HANDOFF.md §3.2.`,
  );
}
