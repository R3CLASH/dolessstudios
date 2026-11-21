import "server-only";
import DodoPayments from "dodopayments";
import { SITE, type Solution } from "@/lib/content";

/**
 * Dodo Payments configuration, read the same way as getDb() and getTransport():
 * every value comes out of process.env *inside* a function, and "not configured"
 * is a null rather than a throw. Nothing is constructed at module scope, because
 * CI runs `next build` with no secrets set at all.
 */

const globalForDodo = globalThis as unknown as { __dlsDodo?: DodoPayments };

export type DodoEnv = "test_mode" | "live_mode";

/**
 * Live only on an exact match, test for anything else — including unset.
 *
 * This deliberately inverts the SDK's own default, which is live_mode when the
 * option is omitted. A half-configured deploy must not be able to charge a real
 * card, so the dangerous value is the one you have to ask for by name.
 */
export function dodoEnv(): DodoEnv {
  return process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode";
}

export function dodoKey(): string | null {
  return process.env.DODO_PAYMENTS_API_KEY || null;
}

export function dodoWebhookKey(): string | null {
  return process.env.DODO_PAYMENTS_WEBHOOK_KEY || null;
}

/**
 * Where Dodo sends the buyer after paying.
 *
 * Derived from SITE.url, never from Terraform: building this in infra/lambda.tf
 * from local.site_url creates a dependency cycle (distribution → apigw →
 * integration → lambda env → distribution). SITE.url works here because
 * NEXT_PUBLIC_SITE_URL is inlined at build time, which deploy.yml sets. The env
 * var stays available as a local override, e.g. for a tunnelled webhook test.
 */
export function dodoReturnUrl(): string {
  return process.env.DODO_PAYMENTS_RETURN_URL || `${SITE.url}/off-the-shelf/thanks`;
}

/** The dashboard product id for the mode we're running in, or null if it isn't filled in yet. */
export function productIdFor(solution: Solution): string | null {
  return solution.dodoProductId[dodoEnv() === "live_mode" ? "live" : "test"] || null;
}

/**
 * One product id outside the catalog that /checkout will still accept.
 *
 * This exists for a single question: can a Sri Lankan account actually receive a
 * payout? Dodo's minimum payout is $50, measured after fees and impossible to
 * lower, so the only way to find out is to put a real sale of more than that
 * through live mode — and none of our four solutions is the right thing to sell
 * to ourselves. So: one deliberately-named product, bought once, by us.
 *
 * Narrow on purpose. It is a single exact id, never a pattern or a bypass of the
 * catalog check, it is unset in every environment that is not running the test,
 * and removing the variable closes it again with no code change. Not a secret —
 * knowing the id only lets you pay us — but absent must read as absent, hence the
 * null rather than an empty string.
 */
export function testProductId(): string | null {
  return process.env.DODO_TEST_PRODUCT_ID || null;
}

/** One client per server process, built on first use so an unkeyed build can't trip over it. */
function client(): DodoPayments | null {
  const bearerToken = dodoKey();
  if (!bearerToken) return null;
  if (!globalForDodo.__dlsDodo) {
    globalForDodo.__dlsDodo = new DodoPayments({ bearerToken, environment: dodoEnv() });
  }
  return globalForDodo.__dlsDodo;
}

/**
 * The authoritative check on whether a payment really happened, used by the
 * thanks page. Returns null when unkeyed, when the id is unknown, or on any
 * network error — it must never throw into a page render, because the fallback
 * (look for the order row, else say nothing definite) is always safe.
 */
export async function fetchPayment(paymentId: string) {
  const c = client();
  if (!c) return null;
  try {
    return await c.payments.retrieve(paymentId);
  } catch (err) {
    console.error("[dodo] could not retrieve payment", paymentId, err);
    return null;
  }
}

/**
 * The checkout frame, wearing our clothes.
 *
 * Dodo's `customization.theme_config` is the only theming channel left in the
 * 2.x SDK — the client-side `themeConfig` option was removed in 2.0.1 — and it
 * applies to the inline embed, the overlay and the hosted page alike. Which is
 * the point of defining it once, here: if the inline embed ever has to fall back
 * to the hosted page, the buyer sees the same thing either way.
 *
 * Every value is copied from the @theme block in globals.css. If a token moves
 * there, move it here too; there is no build-time link between the two, because
 * these have to travel to Dodo as plain JSON over the wire.
 */
const BRAND_THEME = {
  // Served from public/fonts rather than src/app/fonts: next/font/local
  // fingerprints the emitted filename at build, and Dodo needs a stable public
  // https:// URL it can fetch months from now.
  font_primary_url: `${SITE.url.replace(/\/$/, "")}/fonts/bricolage-latin.woff2`,
  font_size: "md",
  font_weight: "medium",
  radius: "16px",
  dark: {
    bg_primary: "#121316", // --color-ink
    bg_secondary: "#1a1c21", // --color-ink-2
    border_primary: "#2c2f36", // --color-line
    border_secondary: "#24272e", // --color-ink-3
    button_primary: "#ff5a1f", // --color-accent
    button_primary_hover: "#eff1f3", // --color-paper, matching .btn-accent's wipe
    button_text_primary: "#121316", // --color-ink
    button_secondary: "#1a1c21",
    button_text_secondary: "#eff1f3",
  },
} as const;

/**
 * Mints a checkout session for one solution, bought as-is.
 *
 * This goes through the REST SDK rather than the @dodopayments/nextjs adaptor
 * because the adaptor's Checkout only builds static and dynamic *links*, and a
 * link cannot carry `customization`. /checkout/route.ts still uses the adaptor
 * and still works — it is the fallback, and the DODO_TEST_PRODUCT_ID payout
 * hatch runs through it.
 *
 * Returns null rather than throwing on every failure path, so an unkeyed build
 * and a Dodo outage look the same to the caller: no session, show the quote form.
 */
export async function createCheckoutSession(
  solution: Solution,
): Promise<{ checkoutUrl: string; sessionId: string } | null> {
  const c = client();
  const productId = productIdFor(solution);
  if (!c || !productId) return null;

  try {
    const session = await c.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      return_url: dodoReturnUrl(),
      // Set here, server-side, from our own catalog — never from the request.
      // solutionFromPayment() trusts this value later, so it has to be ours.
      metadata: { solution: solution.slug },
      feature_flags: {
        // One page: the frame initialises the payment on load and confirms it in
        // place, instead of handing off to a second payment page inside the
        // iframe. An embed that navigates internally reads as broken.
        single_page: true,
      },
      customization: {
        theme: "dark",
        show_order_details: true,
        // Only settable while single_page is true.
        payment_method_layout: "accordion",
        theme_config: BRAND_THEME,
      },
    });

    const checkoutUrl = session.checkout_url;
    if (!checkoutUrl) {
      console.error("[dodo] session created with no checkout_url", session.session_id);
      return null;
    }
    return { checkoutUrl, sessionId: session.session_id };
  } catch (err) {
    console.error("[dodo] could not create a checkout session for", solution.slug, err);
    return null;
  }
}
