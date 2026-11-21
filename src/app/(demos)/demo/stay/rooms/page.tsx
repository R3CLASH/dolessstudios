import type { Metadata } from "next";
import Link from "next/link";
import { PALM, ROOMS, SEASONS } from "@/lib/demo/stay";

export const metadata: Metadata = {
  title: "Rooms & rates",
  description: `The six rooms at ${PALM.name}, ${PALM.place} Fort, with seasonal rates and what each one includes.`,
};

export default function RoomsPage() {
  return (
    <>
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap flex flex-col gap-5 py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/stay" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Rooms &amp; rates</span>
          </nav>
          <h1 className="d-h1 max-w-3xl text-brand">Rooms &amp; rates.</h1>
          <p className="max-w-2xl text-lg text-muted">
            Rates are per room per night, including breakfast and taxes. Book direct and you pay the lower end of the band a
            booking site would quote.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="d-wrap flex flex-col gap-12">
          {ROOMS.map((r, i) => (
            <article key={r.slug} className="grid gap-8 border-b border-edge pb-12 last:border-0 lg:grid-cols-12">
              <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                {/* Stand-in for the room photograph. */}
                <div
                  className="relative flex aspect-[4/3] items-end overflow-hidden rounded-[1rem] p-5"
                  style={{
                    background: `linear-gradient(${140 + i * 15}deg, var(--d-brand), color-mix(in oklab, var(--d-brand) ${
                      40 + i * 6
                    }%, #a6c2ae))`,
                  }}
                >
                  <span className="absolute right-4 top-4 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-ink">
                    Photo
                  </span>
                  <span className="rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold text-brand">
                    {r.size} · {r.sleeps}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-5 lg:col-span-7">
                <div className="flex flex-col gap-2">
                  <h2 className="d-h2 text-brand">{r.name}</h2>
                  <p className="text-lg text-muted">{r.line}</p>
                </div>

                <ul className="flex flex-wrap gap-2 text-sm">
                  {r.features.map((f) => (
                    <li key={f} className="rounded-full bg-surface-2 px-3 py-1.5 text-muted">
                      {f}
                    </li>
                  ))}
                </ul>

                <dl className="grid gap-4 border-y border-edge py-5 sm:grid-cols-3">
                  <div>
                    <dt className="d-eyebrow">Low season</dt>
                    <dd className="d-h3 text-brand">{r.rate.low}</dd>
                  </div>
                  <div>
                    <dt className="d-eyebrow">High season</dt>
                    <dd className="d-h3 text-brand">{r.rate.high}</dd>
                  </div>
                  <div>
                    <dt className="d-eyebrow">Sleeps</dt>
                    <dd className="d-h3 text-brand">{r.sleeps}</dd>
                  </div>
                </dl>

                <Link href="/demo/stay/enquire" className="d-btn d-btn-primary w-fit">
                  Check this room &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-edge bg-surface-2 py-14 sm:py-20">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <p className="d-eyebrow">Seasons</p>
            <h2 className="d-h2 text-brand">Which rate applies when.</h2>
          </div>
          <ul className="flex flex-col divide-y divide-edge lg:col-span-8">
            {SEASONS.map((s) => (
              <li key={s.name} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="d-h3 shrink-0 text-brand sm:w-56">{s.name}</span>
                <span className="text-muted">{s.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand py-14 text-white sm:py-16">
        <div className="d-wrap flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="d-h2">Not sure which room?</h2>
            <p className="max-w-lg text-white/75">
              Send us your dates and how many of you there are, and we&apos;ll tell you what we&apos;d put you in.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/demo/stay/enquire" className="d-btn d-btn-primary">
              Check rates &amp; dates →
            </Link>
            <a href={PALM.phoneHref} className="d-btn d-btn-ghost !border-white/30 !bg-transparent !text-white">
              {PALM.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
