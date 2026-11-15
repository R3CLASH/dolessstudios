import Link from "next/link";
import { FAQ, FEATURES, LAUNCH, LOGOS, PLANS, PROBLEM, STEPS } from "@/lib/demo/startup";
import { WaitlistFormDemo } from "@/components/demo/startup/WaitlistFormDemo";

export default function SheetfastHome() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap flex flex-col items-center gap-8 py-16 text-center sm:py-24">
          <span className="rounded-full border border-edge bg-surface px-3.5 py-1.5 text-sm">
            <span className="font-semibold text-accent">Private beta</span>
            <span className="text-muted"> · 40 teams, public launch in Q2</span>
          </span>

          <h1 className="d-h1 max-w-4xl text-brand">
            Stop rebuilding the same report every Monday.
          </h1>

          <p className="max-w-2xl text-lg text-muted sm:text-xl">
            {LAUNCH.name} connects to the tools you already use, builds the report you describe in plain English, and sends it on a
            schedule. You find out when a number moves, not when someone asks.
          </p>

          <WaitlistFormDemo compact />

          {/* Stand-in for the product screenshot. */}
          <div className="mt-6 w-full max-w-4xl overflow-hidden rounded-2xl border border-edge bg-surface shadow-[0_30px_80px_-40px_rgba(20,19,39,0.45)]">
            <div className="flex items-center gap-2 border-b border-edge px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-edge" />
              <span className="h-2.5 w-2.5 rounded-full bg-edge" />
              <span className="h-2.5 w-2.5 rounded-full bg-edge" />
              <span className="ml-2 rounded bg-surface-2 px-2 py-0.5 text-xs text-muted">app.{LAUNCH.host}</span>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-3">
              {[
                { k: "Revenue, this month", v: "$48,210", d: "+12%" },
                { k: "Active teams", v: "1,043", d: "+4%" },
                { k: "Churn", v: "1.8%", d: "−0.3%" },
              ].map((c) => (
                <div key={c.k} className="rounded-xl border border-edge p-4 text-left">
                  <p className="text-xs text-muted">{c.k}</p>
                  <p className="d-h3 mt-1 text-brand">{c.v}</p>
                  <p className="mt-1 text-xs font-semibold text-accent">{c.d}</p>
                </div>
              ))}
              <div className="sm:col-span-3">
                <div className="flex h-28 items-end gap-1.5 rounded-xl border border-edge p-4">
                  {[38, 52, 44, 61, 58, 72, 66, 80, 76, 91, 88, 100].map((h, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{ height: `${h}%`, background: i > 8 ? "var(--d-accent)" : "color-mix(in oklab, var(--d-accent) 35%, white)" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-4">
            <span className="text-sm text-muted">Already used by teams at</span>
            {LOGOS.map((l) => (
              <span key={l} className="text-lg font-semibold lowercase tracking-tight text-muted/60">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">The problem</p>
            <h2 className="d-h2 max-w-2xl text-brand">Someone on your team is a human ETL pipeline.</h2>
          </div>
          <dl className="grid gap-5 sm:grid-cols-3">
            {PROBLEM.map((p) => (
              <div key={p.k} className="d-card flex flex-col gap-2 p-6">
                <dt className="d-h2 text-accent">{p.k}</dt>
                <dd className="text-muted">{p.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── How ──────────────────────────────────────────────────────── */}
      <section id="how" className="scroll-mt-24 border-y border-edge bg-surface-2 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">How it works</p>
            <h2 className="d-h2 max-w-2xl text-brand">Three steps, then it runs itself.</h2>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="d-card flex flex-col gap-3 p-6">
                <span className="font-mono text-sm font-bold text-accent">{s.n}</span>
                <h3 className="d-h3 text-brand">{s.title}</h3>
                <p className="text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section id="features" className="scroll-mt-24 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">Features</p>
            <h2 className="d-h2 max-w-2xl text-brand">What it actually does.</h2>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <li key={f.title} className="d-card flex flex-col gap-2 p-6">
                <h3 className="d-h3 text-brand">{f.title}</h3>
                <p className="text-muted">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Pricing preview ──────────────────────────────────────────── */}
      <section className="border-y border-edge bg-surface-2 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <p className="d-eyebrow">Pricing</p>
              <h2 className="d-h2 max-w-2xl text-brand">Free to start. Properly free.</h2>
            </div>
            <Link href="/demo/startup/pricing" className="d-btn d-btn-ghost">
              Compare plans →
            </Link>
          </div>
          <ul className="grid gap-5 lg:grid-cols-3">
            {PLANS.map((p) => (
              <li
                key={p.name}
                className={`d-card flex flex-col gap-4 p-6 ${p.featured ? "ring-2 ring-accent" : ""}`}
              >
                {p.featured && (
                  <span className="w-fit rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">Most popular</span>
                )}
                <h3 className="d-h3 text-brand">{p.name}</h3>
                <p className="flex items-baseline gap-1.5">
                  <span className="d-h2 text-brand">{p.price}</span>
                  <span className="text-sm text-muted">{p.per}</span>
                </p>
                <p className="text-sm text-muted">{p.line}</p>
                <Link
                  href="/demo/startup/waitlist"
                  className={`d-btn mt-auto ${p.featured ? "d-btn-primary !text-white" : "d-btn-ghost"}`}
                >
                  {p.cta}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-24 py-16 sm:py-24">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <p className="d-eyebrow">Questions</p>
            <h2 className="d-h2 text-brand">Before you sign up.</h2>
          </div>
          <div className="flex flex-col lg:col-span-8">
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
      </section>

      <section className="bg-brand py-16 text-white sm:py-24">
        <div className="d-wrap flex flex-col items-center gap-6 text-center">
          <h2 className="d-h2 max-w-2xl">Get your Mondays back.</h2>
          <p className="max-w-xl text-white/75">
            {LAUNCH.waitlistCount.toLocaleString("en-US")} people are on the list. We let a few teams in every week.
          </p>
          <Link href="/demo/startup/waitlist" className="d-btn d-btn-primary !text-white">
            Join the waitlist →
          </Link>
        </div>
      </section>
    </>
  );
}
