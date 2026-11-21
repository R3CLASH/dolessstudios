import type { Order } from "@/db/schema";

/**
 * Where a build has got to: paid → building → delivered.
 *
 * Reads the order_status enum that already exists. The studio advances it from
 * /admin (setOrderStatus), which is also what gives this component something to
 * show: before that dashboard existed, `building` and `delivered` sat in the
 * enum with nothing ever setting them.
 *
 * Refunded and cancelled are terminal and get their own line rather than a
 * position on the track, because they aren't progress. `refunded` in particular
 * is never set by a human — it comes from Dodo's refund.succeeded webhook via
 * markOrderRefunded(), and /admin deliberately cannot set it.
 */

const STEPS = [
  { key: "paid", label: "Paid", note: "Your slot is reserved" },
  { key: "building", label: "Building", note: "We're putting it together" },
  { key: "delivered", label: "Live", note: "Handed over on your domain" },
] as const;

export function OrderTimeline({ status }: { status: Order["status"] }) {
  if (status === "refunded" || status === "cancelled") {
    return (
      <p className="font-mono text-sm text-mist">
        This order was {status}. Nothing is being built — reply to your confirmation email if that&apos;s a surprise.
      </p>
    );
  }

  const current = STEPS.findIndex((s) => s.key === status);
  const at = current === -1 ? 0 : current;

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:gap-0">
      {STEPS.map((step, i) => {
        const done = i <= at;
        return (
          <li key={step.key} className="flex flex-1 gap-4 sm:flex-col sm:gap-3">
            {/* The track: a dot plus the line reaching the next step. */}
            <div className="flex flex-col items-center sm:w-full sm:flex-row" aria-hidden="true">
              <span
                className={`h-3 w-3 shrink-0 rounded-full ${done ? "bg-accent" : "border border-line bg-ink"}`}
              />
              {i < STEPS.length - 1 && (
                <span className={`w-px flex-1 sm:h-px sm:w-full ${i < at ? "bg-accent" : "bg-line"}`} />
              )}
            </div>
            <div className="pb-6 sm:pb-0">
              <p className={`font-mono text-sm ${done ? "text-paper" : "text-mist"}`}>
                {step.label}
                {i === at && <span className="ml-2 text-accent">←</span>}
              </p>
              <p className="mt-1 text-sm text-mist">{step.note}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
