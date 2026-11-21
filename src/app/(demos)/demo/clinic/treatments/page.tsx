import type { Metadata } from "next";
import Link from "next/link";
import { INSURERS, PRACTICE, TREATMENTS } from "@/lib/demo/clinic";

export const metadata: Metadata = {
  title: "Treatments & fees",
  description: `What ${PRACTICE.name} does and what it costs, written down before you come in.`,
};

export default function TreatmentsPage() {
  return (
    <>
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap flex flex-col gap-5 py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/clinic" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Treatments &amp; fees</span>
          </nav>
          <h1 className="d-h1 max-w-3xl text-brand">Treatments &amp; fees.</h1>
          <p className="max-w-2xl text-lg text-muted">
            These are our standard fees. You&apos;ll get a written estimate for your own treatment before anything starts, and if a
            plan changes part-way through we stop and talk to you first.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="d-wrap flex flex-col gap-8">
          {TREATMENTS.map((t) => (
            <article key={t.slug} id={t.slug} className="d-card scroll-mt-24 grid gap-6 p-6 sm:p-8 lg:grid-cols-12">
              <div className="flex flex-col gap-2 lg:col-span-4">
                <h2 className="d-h2 text-brand">{t.title}</h2>
                <p className="font-semibold text-accent">From {t.from}</p>
                <p className="text-sm text-muted">{t.duration}</p>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-8">
                <p className="text-lg">{t.line}</p>
                <p className="text-muted">{t.body}</p>
                <Link href="/demo/clinic/appointment" className="d-btn d-btn-ghost mt-2 w-fit !min-h-10 !px-4 !text-sm">
                  Ask about this →
                </Link>
              </div>
            </article>
          ))}

          <div className="d-card flex flex-col gap-4 p-6 sm:p-8">
            <h2 className="d-h3 text-brand">Insurance</h2>
            <p className="text-muted">
              We can bill these insurers directly. Bring your card to the first appointment and reception will check your cover
              before treatment begins.
            </p>
            <ul className="flex flex-wrap gap-2">
              {INSURERS.map((i) => (
                <li key={i} className="rounded-full border border-edge px-3 py-1.5 text-sm">
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-muted">
            Fees last reviewed January 2026. This is a demonstration site; the practice, people and prices are fictional.
          </p>
        </div>
      </section>
    </>
  );
}
