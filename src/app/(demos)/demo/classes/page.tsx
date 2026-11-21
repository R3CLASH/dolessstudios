import Link from "next/link";
import { BRANCHES, FAQ, FEES, RESULTS, REVIEWS, TEACHERS, TIMETABLE, VIDURA } from "@/lib/demo/classes";
import { Stars } from "@/components/demo/Stars";

/** The six classes a parent is most likely to be looking for. */
const FEATURED = TIMETABLE.slice(0, 6);

export default function ViduraHome() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <span className="w-fit rounded-full border border-edge bg-surface px-3 py-1.5 text-sm text-muted">
              2027 A/L batch · registering now
            </span>

            <h1 className="d-h1 text-brand">
              A/L Maths, Physics
              <br />
              and Chemistry.
            </h1>

            <p className="max-w-xl text-lg text-muted sm:text-xl">
              Sixteen years of A/L classes in Nugegoda, and Sundays in Kandy. The timetable, the fees and the teachers are all on
              this page — so you don&apos;t have to ask in a WhatsApp group.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/demo/classes/timetable" className="d-btn d-btn-dark">
                See the timetable →
              </Link>
              <Link href="/demo/classes/register" className="d-btn d-btn-primary !text-white">
                Register for a class
              </Link>
            </div>

            <dl className="mt-2 grid gap-5 border-t border-edge pt-6 sm:grid-cols-3">
              {VIDURA.stats.map((p) => (
                <div key={p.k}>
                  <dt className="d-h3 text-brand">{p.k}</dt>
                  <dd className="text-sm text-muted">{p.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="d-card flex flex-col gap-4 p-6 sm:p-8">
              <p className="d-eyebrow">This week</p>
              <p className="d-h2 text-brand">Classes are running.</p>
              <p className="text-muted">
                No change to the timetable this week. Any change for Poya or a public holiday is posted here first, then sent to
                the class group.
              </p>
              <ul className="flex flex-col divide-y divide-edge border-t border-edge pt-2">
                {FEATURED.slice(0, 3).map((c) => (
                  <li key={c.slug} className="flex items-baseline justify-between gap-3 py-2.5 text-sm">
                    <span className="font-semibold text-brand">{c.subject.split(" — ")[0]}</span>
                    <span className="text-right text-muted">
                      {c.day} · {c.time.split(" – ")[0]}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/demo/classes/timetable" className="d-btn d-btn-ghost mt-auto">
                All classes &amp; times
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Classes ──────────────────────────────────────────────────── */}
      <section id="classes" className="scroll-mt-24 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <p className="d-eyebrow">Classes</p>
              <h2 className="d-h2 max-w-2xl text-brand">What&apos;s running, and when.</h2>
            </div>
            <Link href="/demo/classes/timetable" className="d-btn d-btn-ghost">
              Full timetable
            </Link>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((c) => (
              <li key={c.slug} className="d-card flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-1">
                  <span className="d-eyebrow">{c.grade}</span>
                  <h3 className="d-h3 text-brand">{c.subject}</h3>
                </div>
                <dl className="flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">When</dt>
                    <dd className="text-right font-medium">
                      {c.day}, {c.time}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Teacher</dt>
                    <dd className="text-right font-medium">{c.teacher}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Branch</dt>
                    <dd className="text-right font-medium">{c.branch}</dd>
                  </div>
                </dl>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-edge pt-4">
                  <span className="text-sm font-semibold text-brand">{c.fee}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      c.seats.startsWith("Full") ? "bg-surface-2 text-muted" : "bg-brand-soft text-brand"
                    }`}
                  >
                    {c.seats}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Teachers ─────────────────────────────────────────────────── */}
      <section id="teachers" className="scroll-mt-24 border-y border-edge bg-surface-2 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">The teachers</p>
            <h2 className="d-h2 max-w-2xl text-brand">Three teachers. No substitutes.</h2>
            <p className="max-w-2xl text-muted">
              The person named on the timetable is the person who takes the class. We don&apos;t send a stand-in and we don&apos;t
              run parallel batches under someone else&apos;s name.
            </p>
          </div>
          <ul className="grid gap-5 lg:grid-cols-3">
            {TEACHERS.map((t) => (
              <li key={t.name} className="d-card flex flex-col gap-4 p-6">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
                  style={{ background: "var(--d-brand)" }}
                  aria-hidden="true"
                >
                  {t.name.split(" ").pop()?.[0]}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="d-h3 text-brand">{t.name}</h3>
                  <p className="text-sm font-semibold text-accent">{t.subject}</p>
                  <p className="text-sm text-muted">{t.since}</p>
                </div>
                <p className="text-sm text-muted">{t.credentials}</p>
                <p className="mt-auto border-t border-edge pt-4 text-muted">{t.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Fees ─────────────────────────────────────────────────────── */}
      <section id="fees" className="scroll-mt-24 py-16 sm:py-24">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <p className="d-eyebrow">Fees</p>
            <h2 className="d-h2 text-brand">On the page, not on request.</h2>
            <p className="text-muted">
              Monthly, payable at the first class of the month. Notes and past papers are included and we don&apos;t sell them
              separately.
            </p>
            <Link href="/demo/classes/register" className="d-btn d-btn-dark w-fit">
              Register for a class
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-edge lg:col-span-8">
            {FEES.map((f) => (
              <li key={f.item} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="flex flex-col">
                  <span className="d-h3 text-brand">{f.item}</span>
                  <span className="text-sm text-muted">{f.note}</span>
                </span>
                <span className="shrink-0 font-semibold">{f.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Results ──────────────────────────────────────────────────── */}
      <section id="results" className="scroll-mt-24 border-y border-edge bg-brand py-16 text-white sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow !text-white/55">Results</p>
            <h2 className="d-h2 max-w-2xl">The last three years, as they were.</h2>
            <p className="max-w-2xl text-white/70">
              Every student who sat, not only the ones worth printing. If a year was weaker we say so.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-3">
            {RESULTS.map((r) => (
              <li key={r.year} className="flex flex-col gap-3 rounded-[1rem] border border-white/15 p-6">
                <span className="d-h2">{r.year}</span>
                <p className="text-white/75">{r.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">What parents and students say</p>
            <h2 className="d-h2 max-w-2xl text-brand">Mostly about the timetable, oddly.</h2>
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

      {/* ── Branches ─────────────────────────────────────────────────── */}
      <section className="border-y border-edge bg-surface-2 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">Where we are</p>
            <h2 className="d-h2 max-w-2xl text-brand">Two branches.</h2>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {BRANCHES.map((b) => (
              <li key={b.name} className="d-card flex flex-col gap-3 p-6">
                <h3 className="d-h3 text-brand">{b.name}</h3>
                <p className="font-medium">{b.address}</p>
                <p className="text-sm text-muted">{b.note}</p>
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
            <h2 className="d-h2 text-brand">Asked every term.</h2>
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
          <h2 className="d-h2 max-w-2xl">Seats go by March. Register before they do.</h2>
          <p className="max-w-xl text-white/75">
            Registration takes a minute and we call back the same day to confirm the seat and the first class date.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/demo/classes/register" className="d-btn d-btn-primary !text-white">
              Register for a class →
            </Link>
            <a href={VIDURA.phoneHref} className="d-btn d-btn-ghost !border-white/30 !bg-transparent !text-white">
              {VIDURA.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
