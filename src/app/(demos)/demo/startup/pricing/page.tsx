import type { Metadata } from "next";
import Link from "next/link";
import { FAQ, LAUNCH, PLANS } from "@/lib/demo/startup";

export const metadata: Metadata = {
  title: "Pricing",
  description: `${LAUNCH.name} pricing: a free plan that stays free, and paid plans from $39 a month.`,
};

/** Rows for the comparison table, in the order they matter. */
const COMPARE: { label: string; values: [string, string, string] }[] = [
  { label: "Scheduled reports", values: ["3", "Unlimited", "Unlimited"] },
  { label: "Connected sources", values: ["2", "10", "Unlimited"] },
  { label: "Seats", values: ["1", "5 included", "Unlimited"] },
  { label: "Delivery", values: ["Email", "Slack + email", "Slack + email"] },
  { label: "Alerts", values: ["—", "Any metric", "Any metric"] },
  { label: "History", values: ["7 days", "12 months", "Custom"] },
  { label: "SSO & audit log", values: ["—", "—", "Yes"] },
  { label: "Support", values: ["Community", "Email, 1 day", "Priority"] },
];

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap flex flex-col items-center gap-5 py-14 text-center sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/startup" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Pricing</span>
          </nav>
          <h1 className="d-h1 max-w-3xl text-brand">Free to start. No card.</h1>
          <p className="max-w-2xl text-lg text-muted">
            The free plan isn&apos;t a trial — it stays free. Paid plans are for when more than one person needs the numbers.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="d-wrap flex flex-col gap-12">
          <ul className="grid gap-5 lg:grid-cols-3">
            {PLANS.map((p) => (
              <li key={p.name} className={`d-card flex flex-col gap-5 p-7 ${p.featured ? "ring-2 ring-accent" : ""}`}>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="d-h3 text-brand">{p.name}</h2>
                  {p.featured && (
                    <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">Most popular</span>
                  )}
                </div>
                <p className="flex items-baseline gap-1.5">
                  <span className="d-h1 !text-[clamp(2.4rem,5vw,3.2rem)] text-brand">{p.price}</span>
                  <span className="text-sm text-muted">{p.per}</span>
                </p>
                <p className="text-muted">{p.line}</p>
                <ul className="flex flex-col gap-2.5 border-t border-edge pt-5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-accent text-[0.65rem] font-bold text-white"
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/demo/startup/waitlist"
                  className={`d-btn mt-auto ${p.featured ? "d-btn-primary !text-white" : "d-btn-ghost"}`}
                >
                  {p.cta}
                </Link>
              </li>
            ))}
          </ul>

          {/* Comparison table — scrolls sideways rather than squashing on phones. */}
          <div className="flex flex-col gap-5">
            <h2 className="d-h2 text-brand">Compare the plans.</h2>
            <div className="d-card overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <caption className="sr-only">Feature comparison across the Solo, Team and Company plans</caption>
                <thead>
                  <tr className="border-b border-edge">
                    <th scope="col" className="p-4 font-semibold">
                      Feature
                    </th>
                    {PLANS.map((p) => (
                      <th key={p.name} scope="col" className="p-4 font-semibold text-brand">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => (
                    <tr key={row.label} className="border-b border-edge last:border-0">
                      <th scope="row" className="p-4 font-medium text-muted">
                        {row.label}
                      </th>
                      {row.values.map((v, i) => (
                        <td key={i} className="p-4">
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h2 className="d-h2 text-brand">Questions about pricing.</h2>
            <div className="flex flex-col">
              {FAQ.map((f) => (
                <details key={f.q} className="group border-b border-edge py-5">
                  <summary className="d-h3 flex cursor-pointer items-center justify-between gap-4 text-brand">
                    {f.q}
                    <span aria-hidden="true" className="text-accent transition-transform group-open:rotate-45">
                      ＋
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
