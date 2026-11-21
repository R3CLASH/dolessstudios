import Link from "next/link";
import { FAQ, GETTING_HERE, INCLUDED, NEARBY, PALM, REVIEWS, ROOMS, SEASONS } from "@/lib/demo/stay";
import { Stars } from "@/components/demo/Stars";

export default function PalmHouseHome() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <span className="flex w-fit items-center gap-2 rounded-full border border-edge bg-surface px-3 py-1.5 text-sm">
              <strong>{PALM.rating.score}</strong>
              <span className="text-muted">from {PALM.rating.count} guest reviews</span>
            </span>

            <h1 className="d-h1 text-brand">
              Six rooms,
              <br />
              inside the walls.
            </h1>

            <p className="max-w-xl text-lg text-muted sm:text-xl">
              A restored merchant&apos;s house on Leyn Baan Street, two minutes from the ramparts. Book with us directly and the
              commission a booking site would take comes off your rate instead.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/demo/stay/enquire" className="d-btn d-btn-primary">
                Check rates &amp; dates →
              </Link>
              <Link href="/demo/stay/rooms" className="d-btn d-btn-ghost">
                See the rooms
              </Link>
            </div>

            <dl className="mt-2 grid gap-5 border-t border-edge pt-6 sm:grid-cols-3">
              {PALM.promise.map((p) => (
                <div key={p.k}>
                  <dt className="d-h3 text-brand">{p.k}</dt>
                  <dd className="text-sm text-muted">{p.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6">
            {/* Stand-in for the hero photograph. */}
            <div
              className="relative flex aspect-[4/3] items-end overflow-hidden rounded-[1rem] p-6"
              style={{ background: "linear-gradient(150deg, var(--d-brand), color-mix(in oklab, var(--d-brand) 45%, #7fa88f))" }}
            >
              <span className="absolute right-5 top-5 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-ink">
                Photo
              </span>
              <p className="max-w-xs text-sm text-white/85">
                The courtyard at four o&apos;clock, when the tea and curd come out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The direct-booking argument, stated plainly ──────────────── */}
      <section className="border-b border-edge bg-brand py-12 text-white">
        <div className="d-wrap grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col gap-3 lg:col-span-7">
            <p className="d-eyebrow !text-white/55">Why book direct</p>
            <h2 className="d-h2">The same room, without the middleman&apos;s cut.</h2>
            <p className="max-w-xl text-white/75">
              Booking sites charge us 15 to 20 percent of what you pay. When you come to us directly, that money is not in the
              price. It is the whole reason this page exists.
            </p>
          </div>
          <ul className="flex flex-col gap-3 lg:col-span-5">
            {[
              "Better rate than the agency price, every time",
              "Talk to the people who actually run the house",
              "Free cancellation up to 7 days before",
              "No card needed to ask",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-white/85">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-ink"
                >
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Rooms ────────────────────────────────────────────────────── */}
      <section id="rooms" className="scroll-mt-24 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <p className="d-eyebrow">The rooms</p>
              <h2 className="d-h2 max-w-2xl text-brand">Four to choose from, six in total.</h2>
            </div>
            <Link href="/demo/stay/rooms" className="d-btn d-btn-ghost">
              All rooms &amp; seasonal rates
            </Link>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2">
            {ROOMS.map((r) => (
              <li key={r.slug} className="d-card flex flex-col overflow-hidden">
                <div
                  className="flex h-44 items-end justify-between p-4"
                  style={{ background: "linear-gradient(135deg, var(--d-brand), color-mix(in oklab, var(--d-brand) 50%, #9ab8a4))" }}
                >
                  <span className="rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold text-brand">{r.size}</span>
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-ink">Photo</span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="d-h3 text-brand">{r.name}</h3>
                    <span className="shrink-0 text-sm text-muted">{r.sleeps}</span>
                  </div>
                  <p className="text-muted">{r.line}</p>
                  <ul className="flex flex-wrap gap-1.5 text-xs">
                    {r.features.map((f) => (
                      <li key={f} className="rounded-full bg-surface-2 px-2.5 py-1 text-muted">
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto border-t border-edge pt-4 text-sm">
                    <strong className="text-brand">{r.rate.low}</strong>
                    <span className="text-muted"> – {r.rate.high} a night, by season</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Included ─────────────────────────────────────────────────── */}
      <section id="included" className="scroll-mt-24 border-y border-edge bg-surface-2 py-16 sm:py-24">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <p className="d-eyebrow">In the rate</p>
            <h2 className="d-h2 text-brand">Things we don&apos;t charge extra for.</h2>
            <p className="text-muted">
              Because a bill with six small additions on it is a bad memory of an otherwise good week.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {INCLUDED.map((i) => (
              <li key={i} className="d-card flex items-start gap-3 p-5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-ink"
                >
                  ✓
                </span>
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Seasons ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">When to come</p>
            <h2 className="d-h2 max-w-2xl text-brand">Three seasons, three prices.</h2>
          </div>
          <ul className="grid gap-5 sm:grid-cols-3">
            {SEASONS.map((s) => (
              <li key={s.name} className="d-card flex flex-col gap-3 p-6">
                <h3 className="d-h3 text-brand">{s.name}</h3>
                <p className="text-muted">{s.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Nearby ───────────────────────────────────────────────────── */}
      <section id="nearby" className="scroll-mt-24 border-y border-edge bg-surface-2 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">What&apos;s nearby</p>
            <h2 className="d-h2 max-w-2xl text-brand">Everything worth seeing is a walk away.</h2>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NEARBY.map((n) => (
              <li key={n.name} className="d-card flex flex-col gap-2 p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="d-h3 text-brand">{n.name}</h3>
                </div>
                <span className="w-fit rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-muted">{n.walk}</span>
                <p className="text-sm text-muted">{n.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Getting here ─────────────────────────────────────────────── */}
      <section id="getting-here" className="scroll-mt-24 py-16 sm:py-24">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <p className="d-eyebrow">Getting here</p>
            <h2 className="d-h2 text-brand">From the airport, in one go.</h2>
            <p className="text-muted">{PALM.address}. Tell us your flight and we&apos;ll have a car waiting with your name on it.</p>
            <Link href="/demo/stay/enquire" className="d-btn d-btn-dark w-fit">
              Arrange a transfer
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-edge lg:col-span-8">
            {GETTING_HERE.map((g) => (
              <li key={g.mode} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:gap-6">
                <span className="shrink-0 sm:w-48">
                  <span className="d-h3 block text-brand">{g.mode}</span>
                  <span className="text-sm text-muted">{g.time}</span>
                </span>
                <p className="text-muted">{g.line}</p>
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
              <p className="d-eyebrow">Guest reviews</p>
              <h2 className="d-h2 text-brand">
                {PALM.rating.score} out of 10, {PALM.rating.count} stays.
              </h2>
            </div>
            <span className="d-card flex items-center gap-3 px-4 py-3">
              <Stars n={5} className="h-4" />
              <span className="text-sm text-muted">From Google and TripAdvisor</span>
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
            <h2 className="d-h2 text-brand">Before you book.</h2>
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
          <h2 className="d-h2 max-w-2xl">Tell us your dates. We&apos;ll beat the booking sites.</h2>
          <p className="max-w-xl text-white/75">
            No card needed to ask, and free cancellation up to a week before you arrive.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/demo/stay/enquire" className="d-btn d-btn-primary">
              Check rates &amp; dates →
            </Link>
            <a
              href={PALM.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="d-btn d-btn-ghost !border-white/30 !bg-transparent !text-white"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
