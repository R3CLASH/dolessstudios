import type { Metadata } from "next";
import Link from "next/link";
import { AREAS, VOLT } from "@/lib/demo/trades";

export const metadata: Metadata = {
  title: "Areas we cover",
  description: `Where ${VOLT.name} works: Colombo 1–15, Dehiwala, Nugegoda, Rajagiriya, Moratuwa and the surrounding suburbs.`,
};

export default function AreasPage() {
  return (
    <>
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap flex flex-col gap-5 py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/trades" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Areas we cover</span>
          </nav>
          <h1 className="d-h1 max-w-3xl text-brand">Where we work.</h1>
          <p className="max-w-2xl text-lg text-muted">
            We&apos;re based in Colombo 5 and most of our work is within half an hour of it. Same-day means you call in the morning
            and we&apos;re there before the end of the day.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <ul className="flex flex-col divide-y divide-edge lg:col-span-7">
            {AREAS.map((a) => (
              <li key={a.name} className="flex items-center justify-between gap-6 py-4">
                <span className="d-h3 text-brand">{a.name}</span>
                <span className="shrink-0 rounded-full bg-surface-2 px-3 py-1.5 text-sm text-muted">{a.note}</span>
              </li>
            ))}
          </ul>

          <aside className="flex flex-col gap-5 lg:col-span-5">
            {/* Stand-in for an embedded map. */}
            <div
              className="d-card relative flex h-64 items-center justify-center overflow-hidden"
              style={{ background: "linear-gradient(140deg, #e8eef5, #cfdbe8)" }}
            >
              <div className="absolute inset-0 opacity-45">
                {[18, 38, 58, 78].map((t) => (
                  <span key={t} className="absolute left-0 right-0 h-px bg-brand/25" style={{ top: `${t}%` }} />
                ))}
                {[22, 46, 70].map((l) => (
                  <span key={l} className="absolute bottom-0 top-0 w-px bg-brand/25" style={{ left: `${l}%` }} />
                ))}
              </div>
              <span className="relative flex flex-col items-center gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-lg">📍</span>
                <span className="rounded-full bg-surface px-3 py-1 text-sm font-semibold text-brand">Colombo 5</span>
              </span>
            </div>

            <div className="d-card flex flex-col gap-4 p-6">
              <h2 className="d-h3 text-brand">Not on the list?</h2>
              <p className="text-muted">
                Call us anyway. For rewires and solar installs we travel further, and we&apos;ll tell you honestly if someone closer
                would be better for a small job.
              </p>
              <a href={VOLT.phoneHref} className="d-btn d-btn-dark">
                📞 {VOLT.phone}
              </a>
              <Link href="/demo/trades/quote" className="d-btn d-btn-ghost">
                Get a quote instead
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
