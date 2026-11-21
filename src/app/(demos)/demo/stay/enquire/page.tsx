import type { Metadata } from "next";
import Link from "next/link";
import { PALM } from "@/lib/demo/stay";
import { EnquiryFormDemo } from "@/components/demo/stay/EnquiryFormDemo";
import { Stars } from "@/components/demo/Stars";

export const metadata: Metadata = {
  title: "Check rates & dates",
  description: `Ask ${PALM.name} directly for rates and availability. Better than the booking sites, because nobody takes a commission.`,
};

export default function EnquirePage() {
  return (
    <section className="bg-surface-2 py-14 sm:py-20">
      <div className="d-wrap grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/stay" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Check rates</span>
          </nav>

          <h1 className="d-h1 text-brand">Book direct, pay less.</h1>
          <p className="text-lg text-muted">
            Send your dates and we&apos;ll come back the same day with the rate and what&apos;s free. No card needed to ask.
          </p>

          <ul className="flex flex-col gap-3">
            {[
              "Better than the agency rate on the same room",
              "Free cancellation up to 7 days before",
              "Airport transfer at a fixed fare, if you want it",
              `Taking guests in the Fort since ${PALM.established}`,
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
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

          <div className="d-card flex flex-col gap-3 p-5">
            <Stars n={5} className="h-4" />
            <p>
              &ldquo;We booked direct after finding them on an agency site and the rate was noticeably better.&rdquo;
            </p>
            <p className="text-sm text-muted">Marieke V. · Utrecht</p>
          </div>

          <div className="d-card flex flex-col gap-3 p-5">
            <p className="d-eyebrow">Rather just ask?</p>
            <a href={PALM.phoneHref} className="d-h3 text-brand hover:text-accent">
              {PALM.phone}
            </a>
            <a href={PALM.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-ink">
              Or message us on WhatsApp →
            </a>
            <p className="text-sm text-muted">{PALM.checkIn}</p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <EnquiryFormDemo />
        </div>
      </div>
    </section>
  );
}
