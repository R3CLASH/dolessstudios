import type { Metadata } from "next";
import Link from "next/link";
import { CAPACITY, CEYLON, CERTIFICATIONS } from "@/lib/demo/supplier";
import { RfqFormDemo } from "@/components/demo/supplier/RfqFormDemo";

export const metadata: Metadata = {
  title: "Request a quote",
  description: `Send ${CEYLON.name} the grade, volume and destination and get a landed price within one working day.`,
};

export default function QuotePage() {
  return (
    <section className="bg-surface-2 py-14 sm:py-20">
      <div className="d-wrap grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/supplier" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Request a quote</span>
          </nav>

          <h1 className="d-h1 text-brand">Request a quote.</h1>
          <p className="text-lg text-muted">
            Tell us the grade, the volume and the destination port. You&apos;ll have a landed price within one working day and
            samples inside five.
          </p>

          <ul className="flex flex-col gap-3">
            {[
              "Reply within one working day, Mon–Fri",
              "Samples by courier inside five working days",
              "Certificates sent with the first quote",
              "No broker in the chain, so one less margin",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--d-accent)" }}
                >
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="d-card flex flex-col gap-3 p-5">
            <p className="d-eyebrow">Terms, for reference</p>
            <dl className="flex flex-col divide-y divide-edge">
              {CAPACITY.slice(3).map((c) => (
                <div key={c.k} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                  <dt className="text-muted">{c.k}</dt>
                  <dd className="text-right font-semibold">{c.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="d-card flex flex-col gap-3 p-5">
            <p className="d-eyebrow">Certified</p>
            <ul className="flex flex-wrap gap-2">
              {CERTIFICATIONS.map((c) => (
                <li key={c.name} className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-muted">
                  {c.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="d-card flex flex-col gap-3 p-5">
            <p className="d-eyebrow">Sales desk</p>
            <a href={`mailto:${CEYLON.email}`} className="d-h3 break-all text-brand hover:text-accent">
              {CEYLON.email}
            </a>
            <a href={CEYLON.phoneHref} className="text-sm text-muted hover:text-ink">
              {CEYLON.phone}
            </a>
            <p className="text-sm text-muted">{CEYLON.hours}</p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <RfqFormDemo />
        </div>
      </div>
    </section>
  );
}
