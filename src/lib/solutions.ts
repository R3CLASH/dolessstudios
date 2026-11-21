import "server-only";
import type { Solution } from "@/lib/content";
import { dodoKey, productIdFor } from "@/lib/dodo";

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
  return `/checkout?productId=${encodeURIComponent(id)}&metadata_solution=${encodeURIComponent(solution.slug)}`;
}
