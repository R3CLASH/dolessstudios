import Link from "next/link";
import { AREAS, FAQ, REVIEWS, SERVICES, VOLT, WORK } from "@/lib/demo/trades";
import { Stars } from "@/components/demo/Stars";

export default function VoltHome() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <span className="flex w-fit items-center gap-2 rounded-full border border-edge bg-surface px-3 py-1.5 text-sm">
              <Stars n={5} className="h-4" />
              <strong>{VOLT.rating.score}</strong>
              <span className="text-muted">from {VOLT.rating.count} Google reviews</span>
            </span>

            <h1 className="d-h1 text-brand">
              Electricians who
              <br />
              turn up on time.
            </h1>

            <p className="max-w-xl text-lg text-muted sm:text-xl">
              Fault finding, rewiring and solar across Colombo. You get a fixed price before we start, and the person who quotes it
              is the person who does the work.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href={VOLT.phoneHref} className="d-btn d-btn-dark">
                📞 {VOLT.phone}
              </a>
              <Link href="/demo/trades/quote" className="d-btn d-btn-primary">
                Get a free quote →
              </Link>
            </div>

            <dl className="mt-2 grid gap-5 border-t border-edge pt-6 sm:grid-cols-3">
              {VOLT.promise.map((p) => (
                <div key={p.k}>
                  <dt className="d-h3 text-brand">{p.k}</dt>
                  <dd className="text-sm text-muted">{p.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="d-card overflow-hidden p-6 shadow-[0_18px_50px_-24px_rgba(15,39,66,0.35)] sm:p-8">
              <p className="d-eyebrow">Emergency?</p>
              <p className="d-h2 mt-2 text-brand">We answer the phone.</p>
              <p className="mt-3 text-muted">
                Sparking, burning smells, water near wiring, or the whole house dark — call us and we&apos;ll tell you what to switch
                off while we&apos;re on the way.
              </p>
              <a href={VOLT.phoneHref} className="d-btn d-btn-primary mt-6 w-full">
                Call {VOLT.phone}
              </a>
              <a
                href={VOLT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="d-btn d-btn-ghost mt-3 w-full"
              >
                Send a photo on WhatsApp
              </a>
              <p className="mt-4 text-center text-sm text-muted">{VOLT.hours}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────── */}
      <section id="services" className="scroll-mt-24 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">What we do</p>
            <h2 className="d-h2 max-w-2xl text-brand">Six things we get called about most.</h2>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <li key={s.slug} className="d-card flex flex-col gap-4 p-6 transition-shadow hover:shadow-[0_14px_40px_-22px_rgba(15,39,66,0.3)]">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="d-h3 text-brand">{s.title}</h3>
                </div>
                <p className="text-muted">{s.line}</p>
                <ul className="flex flex-col gap-1.5 text-sm">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto border-t border-edge pt-4 text-sm font-semibold text-brand">From {s.from}</p>
              </li>
            ))}
          </ul>

          <Link href="/demo/trades/quote" className="d-btn d-btn-dark w-fit">
            Tell us what&apos;s wrong →
          </Link>
        </div>
      </section>

      {/* ── Recent work ──────────────────────────────────────────────── */}
      <section className="border-y border-edge bg-surface-2 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">Recent jobs</p>
            <h2 className="d-h2 max-w-2xl text-brand">Work from the last few months.</h2>
          </div>
          <ul className="grid gap-5 sm:grid-cols-3">
            {WORK.map((w) => (
              <li key={w.title} className="d-card overflow-hidden">
                {/* Stand-in for a real photo. */}
                <div
                  className="flex h-40 items-end p-4"
                  style={{ background: "linear-gradient(135deg, var(--d-brand), color-mix(in oklab, var(--d-brand) 55%, #4c7fae))" }}
                >
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-ink">Photo</span>
                </div>
                <div className="flex flex-col gap-2 p-5">
                  <h3 className="d-h3 text-brand">{w.title}</h3>
                  <p className="text-sm text-muted">{w.line}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Areas ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <p className="d-eyebrow">Where we work</p>
            <h2 className="d-h2 text-brand">Colombo and the suburbs.</h2>
            <p className="text-muted">
              If you&apos;re on this list we can usually be there the same day. If you&apos;re not, call anyway — we travel for bigger
              jobs.
            </p>
            <Link href="/demo/trades/areas" className="d-btn d-btn-ghost w-fit">
              See the full list
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {AREAS.slice(0, 6).map((a) => (
              <li key={a.name} className="d-card flex items-center justify-between gap-4 p-4">
                <span className="font-semibold">{a.name}</span>
                <span className="text-right text-sm text-muted">{a.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────── */}
      <section id="reviews" className="scroll-mt-24 border-y border-edge bg-surface-2 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <p className="d-eyebrow">Reviews</p>
              <h2 className="d-h2 text-brand">
                {VOLT.rating.score} out of 5, {VOLT.rating.count} times.
              </h2>
            </div>
            <span className="d-card flex items-center gap-3 px-4 py-3">
              <Stars n={5} className="h-4" />
              <span className="text-sm text-muted">Pulled live from Google</span>
            </span>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {REVIEWS.map((r) => (
              <li key={r.name} className="d-card flex flex-col gap-3 p-6">
                <Stars n={r.stars} className="h-4" />
                <p className="text-lg">&ldquo;{r.body}&rdquo;</p>
                <p className="mt-auto text-sm text-muted">
                  <strong className="text-ink">{r.name}</strong> · {r.where}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <p className="d-eyebrow">Questions</p>
            <h2 className="d-h2 text-brand">Before you call.</h2>
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

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <section className="bg-brand py-16 text-white sm:py-20">
        <div className="d-wrap flex flex-col items-start gap-6">
          <h2 className="d-h2 max-w-2xl">Tell us what&apos;s wrong. We&apos;ll tell you what it costs.</h2>
          <p className="max-w-xl text-white/75">
            Free quotes, fixed prices, and no callout charge if you go ahead with the work.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/demo/trades/quote" className="d-btn d-btn-primary">
              Get a free quote →
            </Link>
            <a href={VOLT.phoneHref} className="d-btn d-btn-ghost !border-white/30 !bg-transparent !text-white">
              📞 {VOLT.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
