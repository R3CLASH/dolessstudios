import Link from "next/link";
import { DELIVERY, MENU, REVIEWS, TABLE } from "@/lib/demo/restaurant";
import { OpenStatus } from "@/components/demo/restaurant/OpenStatus";
import { Stars } from "@/components/demo/Stars";

/** A few dishes worth putting on the front page. */
const PICKS = [MENU[1].dishes[2], MENU[2].dishes[1], MENU[2].dishes[4], MENU[3].dishes[3]];

export default function KolambaHome() {
  return (
    <>
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <OpenStatus />
              <span className="flex items-center gap-2 text-sm text-muted">
                <Stars n={5} className="h-4" />
                <strong className="text-ink">{TABLE.rating.score}</strong> · {TABLE.rating.count} reviews
              </span>
            </div>

            <h1 className="d-h1 text-brand">
              Rice and curry,
              <br />
              the way it&apos;s cooked at home.
            </h1>

            <p className="max-w-xl text-lg text-muted sm:text-xl">
              Five curries on every plate, hoppers from six, and lagoon crab when the boats bring it in. Three streets back from
              Galle Face, in Colombo 03.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/demo/restaurant/book" className="d-btn d-btn-primary !text-white">
                Book a table →
              </Link>
              <Link href="/demo/restaurant/menu" className="d-btn d-btn-ghost">
                See the menu
              </Link>
            </div>

            <p className="text-sm text-muted">
              {TABLE.address} · <a href={TABLE.phoneHref} className="font-semibold text-ink hover:text-accent">{TABLE.phone}</a>
            </p>
          </div>

          <div className="lg:col-span-5">
            {/* Stand-in for the hero photograph. */}
            <div
              className="relative flex aspect-[4/5] items-end overflow-hidden rounded-2xl p-6"
              style={{ background: "linear-gradient(150deg, #2d2016, #7a4a2e 55%, #c9603f)" }}
            >
              <span className="absolute right-5 top-5 rounded-full bg-surface px-3 py-1 text-xs font-bold text-brand">Photo</span>
              <p className="text-lg font-medium text-white/90">
                Egg hoppers, lunu miris,
                <br />
                and a pot of tea.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Picks ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <p className="d-eyebrow">What to order</p>
              <h2 className="d-h2 max-w-2xl text-brand">If it&apos;s your first time.</h2>
            </div>
            <Link href="/demo/restaurant/menu" className="d-btn d-btn-ghost">
              Full menu →
            </Link>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PICKS.map((d) => (
              <li key={d.name} className="d-card flex flex-col gap-3 p-6">
                <div
                  className="h-28 rounded-lg"
                  style={{ background: "linear-gradient(140deg, var(--d-brand-soft), color-mix(in oklab, var(--d-accent) 35%, white))" }}
                />
                <h3 className="d-h3 text-brand">{d.name}</h3>
                <p className="text-sm text-muted">{d.line}</p>
                <p className="mt-auto font-semibold text-accent">{d.price}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Order in ─────────────────────────────────────────────────── */}
      <section className="border-y border-edge bg-surface-2 py-16 sm:py-24">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <p className="d-eyebrow">Can&apos;t come in?</p>
            <h2 className="d-h2 text-brand">We deliver across Colombo.</h2>
            <p className="text-muted">
              We&apos;re on the apps, but if you order straight from us it costs you the same and we keep the commission. That&apos;s
              the whole pitch.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
            {DELIVERY.map((d) => (
              <li key={d.name} className="d-card flex flex-col gap-2 p-5">
                <h3 className="d-h3 text-brand">{d.name}</h3>
                <p className="text-sm text-muted">{d.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────── */}
      <section id="reviews" className="scroll-mt-24 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">Reviews</p>
            <h2 className="d-h2 text-brand">
              {TABLE.rating.score} out of 5, {TABLE.rating.count} times.
            </h2>
          </div>
          <ul className="grid gap-5 lg:grid-cols-3">
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

      <section className="bg-brand py-16 text-white sm:py-20">
        <div className="d-wrap flex flex-col items-start gap-6">
          <h2 className="d-h2 max-w-2xl">Hoppers are on from six.</h2>
          <p className="max-w-xl text-white/75">Tables go quickly on Friday and Saturday. Book ahead and we&apos;ll keep one for you.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/demo/restaurant/book" className="d-btn d-btn-primary !text-white">
              Book a table →
            </Link>
            <a href={TABLE.phoneHref} className="d-btn d-btn-ghost !border-white/30 !bg-transparent !text-white">
              📞 {TABLE.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
