"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CheckoutBreakdownData, CheckoutEvent } from "dodopayments-checkout";
import { SITE } from "@/lib/content";

/**
 * Dodo's payment frame, embedded in our own page.
 *
 * Dodo are the Merchant of Record, so the card fields have to be theirs — there
 * is no version of this where we collect a card number. What the inline SDK
 * gives us is the next best thing: their frame injected into a <div> we lay out,
 * themed with our tokens (see BRAND_THEME in lib/dodo.ts), inside our shell. The
 * buyer stays on dolessstudios.com from the catalog to the receipt.
 *
 * Three things this deliberately does NOT do:
 *
 *  1. **Treat any client event as proof of payment.** Dodo publish no
 *     `checkout.completed` and no client-side payment id, and say so: payment
 *     truth comes from the webhook. Completion stays a redirect to return_url,
 *     and /off-the-shelf/thanks re-verifies server-side exactly as before.
 *  2. **Send a product id.** The POST carries a slug; the server resolves it
 *     against the catalog.
 *  3. **Hide any part of the frame.** Dodo require the whole thing, footer
 *     included — so no clipping, no overflow-hidden, no cropping container.
 */

type Breakdown = { subTotal?: number; tax?: number; total?: number; currency?: string };
type Phase = "loading" | "ready" | "unavailable" | "error" | "expired";

const CONTAINER_ID = "dodo-inline-checkout";

export function InlineCheckout({
  slug,
  onBreakdown,
}: {
  slug: string;
  /** Lifts Dodo's real figures into the order summary beside us, tax included. */
  onBreakdown?: (b: Breakdown) => void;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [attempt, setAttempt] = useState(0);
  const closeRef = useRef<(() => void) | null>(null);

  const handleEvent = useCallback(
    (event: CheckoutEvent) => {
      switch (event.event_type) {
        case "checkout.opened":
        case "checkout.form_ready":
          setPhase("ready");
          break;

        case "checkout.breakdown": {
          // Dodo adds tax at checkout that our price pages never mention — the
          // gap that made a Rs 89,990 site arrive as £248.14. Surfacing their
          // figures here is what keeps our summary honest.
          const d = event.data as CheckoutBreakdownData | undefined;
          if (d) {
            onBreakdown?.({
              subTotal: d.subTotal,
              tax: d.tax,
              // finalTotal is the source of truth per Dodo's own docs.
              total: d.finalTotal ?? d.total,
              currency: d.finalTotalCurrency ?? d.currency,
            });
          }
          break;
        }

        case "checkout.link_expired":
          setPhase("expired");
          break;

        case "checkout.error":
          // Log it, don't render it: the message is for us, and an upstream
          // string in our UI is how you leak internals to a stranger.
          console.error("[checkout] frame reported an error", event.data?.message);
          setPhase("error");
          break;
      }
    },
    [onBreakdown],
  );

  useEffect(() => {
    /*
      reactStrictMode is on, so in dev this effect runs, tears down, and runs
      again. `cancelled` is what makes that safe, and it has to be the *only*
      guard: a ref that survives the teardown would make the second run bail out
      after the first run's frame had already been closed, leaving an empty box.

      So the first run's async continuation checks `cancelled` before it touches
      the SDK and quietly drops out, and exactly one frame is ever opened. The
      cost is a second session POST in dev, which is free and short-lived.
    */
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        if (!res.ok) {
          // 503 is the honest "payments aren't switched on", which is a
          // different thing from a failure and gets different copy.
          if (!cancelled) setPhase(res.status === 503 ? "unavailable" : "error");
          return;
        }
        const { checkoutUrl, mode } = (await res.json()) as { checkoutUrl: string; mode: "test" | "live" };
        if (cancelled) return;

        // Imported here, not at module scope, so the SDK stays out of the
        // bundle for every page that isn't this one.
        const { DodoPayments } = await import("dodopayments-checkout");
        if (cancelled) return;

        DodoPayments.Initialize({ mode, displayType: "inline", onEvent: handleEvent });
        DodoPayments.Checkout.open({
          checkoutUrl,
          elementId: CONTAINER_ID,
          options: { showSecurityBadge: true, fontSize: "md", fontWeight: "medium" },
        });
        closeRef.current = () => DodoPayments.Checkout.close();
      } catch (err) {
        console.error("[checkout] could not start the embedded checkout", err);
        if (!cancelled) setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
      try {
        closeRef.current?.();
      } catch {
        // Tearing down a frame that never opened is not worth a console entry.
      }
      closeRef.current = null;
    };
  }, [slug, handleEvent, attempt]);

  // Bumping the attempt re-runs the effect, whose cleanup tears the old frame
  // down first. Nothing else needs resetting.
  const restart = () => {
    setPhase("loading");
    setAttempt((n) => n + 1);
  };

  return (
    <div className="flex flex-col gap-5">
      {phase === "loading" && <Skeleton />}

      {(phase === "unavailable" || phase === "error") && (
        <Fallback
          slug={slug}
          heading={phase === "unavailable" ? "Card payment isn't on yet" : "That didn't load"}
          body={
            phase === "unavailable"
              ? "Paying by card for this one isn't switched on at the moment. Tell us which site you want and we'll send an invoice the same day — same price, same turnaround."
              : "The payment form didn't come up. Nothing has been charged and nothing is lost. Try again, or just tell us what you want and we'll invoice you."
          }
          onRetry={phase === "error" ? restart : undefined}
        />
      )}

      {phase === "expired" && (
        <Fallback
          slug={slug}
          heading="That checkout timed out"
          body="Payment forms expire after a while for security. Nothing was charged — start a fresh one and pick up where you left off."
          onRetry={restart}
        />
      )}

      {/*
        Always mounted, never conditionally rendered: the SDK looks this element
        up by id the moment the session resolves, so it has to already be in the
        DOM. Hidden rather than unmounted while the skeleton shows.

        min-h is a floor, not a height — the SDK runs iframe-resizer internally
        and grows the wrapper to fit its content.
      */}
      <div
        id={CONTAINER_ID}
        className={`w-full ${phase === "ready" ? "min-h-[560px]" : "sr-only"}`}
        aria-busy={phase === "loading"}
      />

      {phase === "ready" && (
        <p className="text-sm text-mist">
          Payment is handled by Dodo Payments, our Merchant of Record. Your card details go straight to them — they
          never touch our servers.
        </p>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-4" aria-live="polite">
      <span className="sr-only">Loading the payment form</span>
      <div className="h-12 animate-pulse rounded-2xl border border-line bg-ink-2" />
      <div className="h-12 animate-pulse rounded-2xl border border-line bg-ink-2" />
      <div className="h-32 animate-pulse rounded-2xl border border-line bg-ink-2" />
      <div className="h-14 animate-pulse rounded-full bg-ink-3" />
    </div>
  );
}

function Fallback({
  slug,
  heading,
  body,
  onRetry,
}: {
  slug: string;
  heading: string;
  body: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-line bg-ink-2 p-6 sm:p-8">
      <h2 className="display heavy text-[clamp(1.6rem,3vw,2.2rem)]">{heading}</h2>
      <p className="max-w-[48ch] text-paper/70">{body}</p>
      <div className="flex flex-wrap gap-3">
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn btn-accent">
            Try again
          </button>
        )}
        <Link href={`/off-the-shelf/${slug}#build`} className={onRetry ? "btn btn-ghost" : "btn btn-accent"}>
          Get it by invoice →
        </Link>
      </div>
      {SITE.email && (
        <p className="text-sm text-mist">
          Or email{" "}
          <a className="underline hover:text-paper" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
          .
        </p>
      )}
    </div>
  );
}
