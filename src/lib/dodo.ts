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
