import "server-only";
import type { Solution } from "@/lib/content";

/**
 * Where the "buy it as-is" button points, or null when instant checkout isn't
 * available yet. The detail page passes the result down as a prop, so the button
 * only exists once payments are really configured — and no Dodo environment
 * variable ever has to be exposed to the browser.
 *
 * Phase 2 (Dodo Payments) replaces the body of this function with:
 *   const id = productIdFor(solution);
 *   if (!dodoKey() || !id) return null;
 *   return `/checkout?productId=${id}&metadata_solution=${solution.slug}`;
 * Nothing else needs to change: the configurator already handles both states.
 */
export function checkoutHrefFor(_solution: Solution): string | null {
  return null;
}
