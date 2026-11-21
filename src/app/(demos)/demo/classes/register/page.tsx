import type { Metadata } from "next";
import Link from "next/link";
import { FEES, VIDURA } from "@/lib/demo/classes";
import { RegisterFormDemo } from "@/components/demo/classes/RegisterFormDemo";
import { Stars } from "@/components/demo/Stars";

export const metadata: Metadata = {
  title: "Register",
  description: `Register for a class at ${VIDURA.name}. We call back the same day to confirm the seat.`,
};

export default function RegisterPage() {
  return (
    <section className="bg-surface-2 py-14 sm:py-20">
      <div className="d-wrap grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/classes" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Register</span>
          </nav>

          <h1 className="d-h1 text-brand">Register for a class.</h1>
          <p className="text-lg text-muted">
            One form instead of a queue at the door. We call back the same day with the seat and the first class date.
          </p>

          <ul className="flex flex-col gap-3">
            {[
              "No payment now — fees are due at the first class",
              "We tell you honestly if a class is too full to join",
              "Timetable changes come by WhatsApp and email",
              `Teaching the A/L syllabus since ${VIDURA.established}`,
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white"
                >
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="d-card flex flex-col gap-3 p-5">
            <p className="d-eyebrow">Fees, for reference</p>
            <ul className="flex flex-col divide-y divide-edge">
              {FEES.slice(0, 4).map((f) => (
                <li key={f.item} className="flex items-baseline justify-between gap-3 py-2 text-sm">
                  <span className="text-muted">{f.item}</span>
                  <span className="shrink-0 font-semibold">{f.price}</span>
                </li>
              ))}
            </ul>
            <Link href="/demo/classes#fees" className="text-sm text-muted hover:text-ink">
              The full fee list →
            </Link>
          </div>

          <div className="d-card flex flex-col gap-3 p-5">
            <Stars n={5} className="h-4" />
            <p>&ldquo;Sir works through the past papers properly instead of just giving the answer.&rdquo;</p>
            <p className="text-sm text-muted">Kavindu · 2025 batch</p>
          </div>

          <div className="d-card flex flex-col gap-3 p-5">
            <p className="d-eyebrow">Rather call?</p>
            <a href={VIDURA.phoneHref} className="d-h3 text-brand hover:text-accent">
              {VIDURA.phone}
            </a>
            <a href={VIDURA.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-ink">
              Or message the office on WhatsApp →
            </a>
            <p className="text-sm text-muted">{VIDURA.hours}</p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <RegisterFormDemo />
        </div>
      </div>
    </section>
  );
}
