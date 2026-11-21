import { NextRequest, NextResponse } from "next/server";
import { getSolution } from "@/lib/content";
import { createCheckoutSession, dodoEnv, dodoKey, productIdFor } from "@/lib/dodo";
import { clientIp, limited } from "@/lib/ratelimit";

/**
 * Mints a Dodo checkout session for the inline embed on /off-the-shelf/[slug]/buy.
 *
 * This exists because the inline SDK needs a *session* URL — a static payment
 * link won't do — and because a session is the only thing that can carry our
 * brand theme. /checkout stays exactly as it was: it is the hosted fallback and
 * the route the DODO_TEST_PRODUCT_ID payout hatch runs through.
 *
 * It keeps /checkout's security posture, for the same reasons:
 *
 *   - the request names a *slug*, never a product id, so this can't be used to
 *     mint a session against an arbitrary product on our account;
 *   - the solution metadata is set server-side from our own catalog, so the
 *     value solutionFromPayment() trusts later is ours and not the caller's.
 */

// Belt and braces, as on /checkout. Route handlers aren't cached by default in
// Next 16, but CloudFront's default behaviour does list GET in cached_methods,
// so the no-store header is what actually does the work.
export const dynamic = "force-dynamic";

const noStore = (res: NextResponse) => {
  res.headers.set("cache-control", "no-store, max-age=0");
  return res;
};

export async function POST(req: NextRequest) {
  // Unkeyed builds and un-configured deploys must not 500. The page reads this
  // and renders the quote-form fallback — which is already better than
  // /checkout, whose ?checkout=unavailable bail nothing has ever read.
  if (!dodoKey()) {
    return noStore(NextResponse.json({ error: "unavailable" }, { status: 503 }));
  }

  // Minting a session is a call to Dodo on our API key, so it is worth a limit
  // even though it costs nothing: 10 in 10 minutes is far more than a real
  // buyer needs and far less than a script would want.
  if (limited(`chk:${await clientIp()}`, 10)) {
    return noStore(NextResponse.json({ error: "slow-down" }, { status: 429 }));
  }

  let slug: unknown;
  try {
    ({ slug } = (await req.json()) as { slug?: unknown });
  } catch {
    return noStore(NextResponse.json({ error: "bad-request" }, { status: 400 }));
  }

  const solution = typeof slug === "string" ? getSolution(slug) : undefined;
  if (!solution) {
    console.error("[checkout/session] unknown slug", JSON.stringify(slug));
    return noStore(NextResponse.json({ error: "unknown-product" }, { status: 400 }));
  }

  // No product id for the mode we're running in means this solution isn't
  // sellable yet — the same condition checkoutHrefFor() hides the button on.
  if (!productIdFor(solution)) {
    console.error(`[checkout/session] ${solution.slug} has no product id for ${dodoEnv()}`);
    return noStore(NextResponse.json({ error: "unavailable" }, { status: 503 }));
  }

  const session = await createCheckoutSession(solution);
  if (!session) {
    return noStore(NextResponse.json({ error: "unavailable" }, { status: 503 }));
  }

  // The mode travels in the response rather than being baked into the
  // prerendered page: it is the one Dodo-derived value the browser needs, and
  // this way switching test/live takes effect here without a redeploy. (The buy
  // *button* on the detail page is still baked at build — HANDOFF trap #13.)
  return noStore(
    NextResponse.json({
      checkoutUrl: session.checkoutUrl,
      mode: dodoEnv() === "live_mode" ? "live" : "test",
    }),
  );
}
