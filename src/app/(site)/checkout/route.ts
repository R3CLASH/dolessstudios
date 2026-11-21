import { NextRequest, NextResponse } from "next/server";
import { Checkout } from "@dodopayments/nextjs";
import { SOLUTIONS } from "@/lib/content";
import { dodoEnv, dodoKey, dodoReturnUrl, productIdFor, testProductId } from "@/lib/dodo";

/**
 * Hands a buyer over to Dodo's hosted checkout for one solution, bought as-is.
 *
 * A GET on purpose: there's one product, quantity 1, no cart, no coupon and no
 * logged-in customer, so a checkout session would buy us nothing. A GET keeps the
 * CTA a plain <a href> — no fetch, no loading state, no client error path on the
 * one interaction that earns money. (What Dodo deprecates is the dynamic /payments
 * proxy, not static checkout.) Upgrade trigger: if we ever want prefilled customer
 * details, multi-item carts or discount codes, add a POST with type: "session".
 *
 * Note the link to this route must carry data-no-transition, or PageTransition
 * intercepts the click and client-pushes into a route handler. It already does.
 */

// Belt and braces. Route handlers aren't cached by default in Next 16, and the
// no-store header below is what actually keeps CloudFront off this response
// (its default behaviour does list GET in cached_methods), but being explicit
// costs nothing and documents the intent.
export const dynamic = "force-dynamic";

/** Never 500 and never leave them staring at an error: send them back to the catalog. */
function bail(req: NextRequest, reason: string) {
  console.error(`[checkout] ${reason}`);
  const res = NextResponse.redirect(new URL("/off-the-shelf?checkout=unavailable", req.url), 303);
  res.headers.set("cache-control", "no-store, max-age=0");
  return res;
}

export async function GET(req: NextRequest) {
  const key = dodoKey();
  // CI builds and un-keyed deploys must not 500 here. In practice the buy button
  // doesn't even render without a key (see checkoutHrefFor), so this is the
  // hand-typed-URL case.
  if (!key) return bail(req, "DODO_PAYMENTS_API_KEY is not set");

  // The query string is public and editable, so we don't forward any of it. We
  // resolve the product id against our own catalog for the current mode and then
  // rebuild the upstream query ourselves. That stops /checkout being used to mint
  // a checkout for an arbitrary product on our account, and means the metadata the
  // webhook later trusts is ours rather than the caller's.
  const productId = req.nextUrl.searchParams.get("productId");

  // The one id outside the catalog we accept: the payout test product, matched
  // exactly and only while DODO_TEST_PRODUCT_ID is set (see testProductId). It is
  // tagged metadata_test rather than metadata_solution, which is what makes
  // solutionFromPayment() correctly find no solution and the order row say so.
  const isTest = productId !== null && productId === testProductId();
  const solution = !isTest && productId ? SOLUTIONS.find((s) => productIdFor(s) === productId) : undefined;
  if (!productId || (!isTest && !solution)) {
    return bail(req, `productId ${JSON.stringify(productId)} is not in the catalog for ${dodoEnv()}`);
  }

  const upstream = new URL(req.nextUrl.origin + req.nextUrl.pathname);
  upstream.searchParams.set("productId", productId);
  if (solution) upstream.searchParams.set("metadata_solution", solution.slug);
  else upstream.searchParams.set("metadata_test", "1");

  const handler = Checkout({
    bearerToken: key,
    returnUrl: dodoReturnUrl(),
    environment: dodoEnv(),
    type: "static",
  });

  let checkoutUrl: string | undefined;
  try {
    // The adaptor replies with JSON — NextResponse.json({ checkout_url }) — not a
    // redirect, so we unwrap it and do the redirecting. That's what keeps the CTA a
    // plain <a>: without this the buyer would land on raw JSON. It validates the
    // product against Dodo on the way through, and answers 400 if that fails.
    const res = await handler(new NextRequest(upstream));
    if (!res.ok) return bail(req, `Dodo rejected the checkout (${res.status}): ${await res.text()}`);
    ({ checkout_url: checkoutUrl } = (await res.json()) as { checkout_url?: string });
  } catch (err) {
    return bail(req, `building the checkout threw: ${String(err)}`);
  }

  if (!checkoutUrl) return bail(req, "Dodo returned no checkout_url");

  const res = NextResponse.redirect(checkoutUrl, 303);
  res.headers.set("cache-control", "no-store, max-age=0");
  return res;
}
