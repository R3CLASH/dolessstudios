import Link from "next/link";
import { FAQ, INSURERS, PRACTICE, TEAM, TREATMENTS } from "@/lib/demo/clinic";
import { Stars } from "@/components/demo/trades/Stars";

export default function SerendibHome() {
  return (
    <>
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <span className="flex items-center gap-2 rounded-full border border-edge bg-surface px-3 py-1.5 text-sm">
              <Stars n={5} className="h-4" />
              <strong>{PRACTICE.rating.score}</strong>
              <span className="text-muted">· {PRACTICE.rating.count} reviews</span>
            </span>

            <h1 className="d-h1 text-brand">
              Dentistry without
              <br />
              the rush.
            </h1>

            <p className="max-w-xl text-lg text-muted sm:text-xl">
              Longer appointments, written estimates before anything starts, and a team that explains what it&apos;s seeing. In
              Colombo 07 since {PRACTICE.established}.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/demo/clinic/appointment" className="d-btn d-btn-primary !text-white">
                Request an appointment →
              </Link>
              <Link href="/demo/clinic/treatments" className="d-btn d-btn-ghost">
                See treatments &amp; fees
              </Link>
            </div>

            <p className="text-sm text-muted">
              In pain today?{" "}
              <a href={PRACTICE.phoneHref} className="font-semibold text-ink hover:text-accent">
                Call {PRACTICE.phone}
              </a>{" "}
              — we keep slots free each morning.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="d-card flex flex-col gap-4 p-6 sm:p-8">
              <p className="d-eyebrow">New patients</p>
              <h2 className="d-h2 text-brand">Haven&apos;t been in years?</h2>
              <p className="text-muted">
                That describes a lot of the people who walk in here. Nobody will make you feel bad about it. The first visit is a
                look and a conversation — nothing more unless you want it.
              </p>
              <ul className="flex flex-col gap-2">
                {["Check-up and clean, Rs 6,500", "Written estimate before treatment", "We stop if a plan changes"].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                      ✓
                    </span>
                    <span className="text-sm">{t}</span>
                  </li>
                ))}
              </ul>
              <Link href="/demo/clinic/appointment" className="d-btn d-btn-dark mt-2">
                Book a first visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Treatments ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <p className="d-eyebrow">What we do</p>
              <h2 className="d-h2 max-w-2xl text-brand">Treatments, with the prices next to them.</h2>
            </div>
            <Link href="/demo/clinic/treatments" className="d-btn d-btn-ghost">
              Full fee list →
            </Link>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TREATMENTS.map((t) => (
              <li key={t.slug} className="d-card flex flex-col gap-3 p-6">
                <h3 className="d-h3 text-brand">{t.title}</h3>
                <p className="text-muted">{t.line}</p>
                <div className="mt-auto flex items-baseline justify-between gap-3 border-t border-edge pt-4 text-sm">
                  <span className="font-semibold text-accent">From {t.from}</span>
                  <span className="text-muted">{t.duration}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section id="team" className="scroll-mt-24 border-y border-edge bg-surface-2 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">The team</p>
            <h2 className="d-h2 max-w-2xl text-brand">The people who&apos;ll actually see you.</h2>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <li key={m.name} className="d-card flex flex-col gap-3 overflow-hidden">
                <div
                  className="flex h-40 items-end justify-end p-3"
                  style={{ background: "linear-gradient(145deg, var(--d-brand-soft), color-mix(in oklab, var(--d-accent) 28%, white))" }}
                >
                  <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-brand">Photo</span>
                </div>
                <div className="flex flex-col gap-1.5 p-5 pt-0">
                  <h3 className="d-h3 text-brand">{m.name}</h3>
                  <p className="text-sm font-semibold text-accent">{m.role}</p>
                  {m.reg && <p className="font-mono text-xs text-muted">Reg. {m.reg}</p>}
                  <p className="mt-1 text-sm text-muted">{m.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Insurance ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <p className="d-eyebrow">Paying</p>
            <h2 className="d-h2 text-brand">Insurance and fees.</h2>
            <p className="text-muted">
              We can bill several insurers directly. Bring your card to the first appointment and reception will check what&apos;s
              covered before any treatment starts.
            </p>
            <Link href="/demo/clinic/treatments" className="d-btn d-btn-ghost w-fit">
              See the full fee list
            </Link>
          </div>
          <ul className="flex flex-wrap content-start gap-3 lg:col-span-7">
            {INSURERS.map((i) => (
              <li key={i} className="d-card px-4 py-3 font-medium">
                {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-24 border-t border-edge py-16 sm:py-24">
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

      <section className="bg-brand py-16 text-white sm:py-20">
        <div className="d-wrap flex flex-col items-start gap-6">
          <h2 className="d-h2 max-w-2xl">Book a first visit.</h2>
          <p className="max-w-xl text-white/75">
            Reception will call you back within one working day. Nothing is confirmed until you&apos;ve spoken to a person.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/demo/clinic/appointment" className="d-btn d-btn-primary !text-white">
              Request an appointment →
            </Link>
            <a href={PRACTICE.phoneHref} className="d-btn d-btn-ghost !border-white/30 !bg-transparent !text-white">
              📞 {PRACTICE.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
