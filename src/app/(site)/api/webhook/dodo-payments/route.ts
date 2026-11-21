import { NextResponse, type NextRequest } from "next/server";
import { Webhooks } from "@dodopayments/nextjs";
import { dodoWebhookKey } from "@/lib/dodo";
import { markOrderRefunded, noteFailedPayment, recordPaidOrder } from "@/lib/orders";

/**
 * Dodo's webhook endpoint. This, not the browser redirect, is what makes a sale
 * real: the buyer can close the tab before the return URL ever loads.
 *
 * CloudFront already routes POSTs here (infra/cdn.tf sends the default behaviour
 * to the server Lambda, with AllViewerExceptHostHeader forwarding the signature
 * headers and raw body), so no Terraform change is needed. The deployed smoke test
 * is a POST with a junk body: a 401 proves the request reached this handler and the
 * signature verifier ran.
 *
 * Not rate-limited on purpose — it would see Dodo's IPs, not a buyer's.
 */

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const webhookKey = dodoWebhookKey();
  if (!webhookKey) {
    // 503 rather than 200: Dodo retries, so nothing is lost if the key arrives
    // later. Answering 200 here would silently swallow real sales.
    console.error("[webhook] DODO_PAYMENTS_WEBHOOK_KEY is not set; refusing the event");
    return new NextResponse("Webhooks are not configured", { status: 503 });
  }

  // Built inside the request, not at module scope: Webhooks() constructs its
  // verifier eagerly and CI runs `next build` with no secrets at all.
  const handler = Webhooks({
    webhookKey,
    // The payloads are Zod-validated by the adaptor before these run, so `data` is
    // typed rather than guesswork. None of these may throw — the adaptor lets
    // handler errors bubble up, which would answer 500 and trigger a retry.
    onPaymentSucceeded: async ({ data }) => {
      await recordPaidOrder(data);
    },
    onPaymentFailed: async ({ data }) => {
      noteFailedPayment(data);
    },
    onRefundSucceeded: async ({ data }) => {
      await markOrderRefunded(data);
    },
  });

  return handler(req);
}
