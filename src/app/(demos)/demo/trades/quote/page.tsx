import type { Metadata } from "next";
import Link from "next/link";
import { VOLT } from "@/lib/demo/trades";
import { QuoteFormDemo } from "@/components/demo/trades/QuoteFormDemo";
import { Stars } from "@/components/demo/trades/Stars";

export const metadata: Metadata = {
  title: "Get a free quote",
  description: `Tell ${VOLT.name} what needs doing and get a fixed price back, usually the same day.`,
};

export default function QuotePage() {
  return (
    <section className="bg-surface-2 py-14 sm:py-20">
      <div className="d-wrap grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/trades" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Get a quote</span>
          </nav>

          <h1 className="d-h1 text-brand">Free quote, fixed price.</h1>
          <p className="text-lg text-muted">
            Tell us what&apos;s going on and we&apos;ll come back with a price, usually the same day. No callout charge if you go
            ahead with the work.
          </p>

          <ul className="flex flex-col gap-3">
            {[
              "We reply within a few hours, Mon–Sat",
              "The price we quote is the price you pay",
              "Licensed and insured since " + VOLT.established,
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-ink">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="d-card flex flex-col gap-3 p-5">
            <Stars n={5} className="h-4" />
            <p>
              &ldquo;Told me the price before he started, and it didn&apos;t change. That&apos;s all I wanted.&rdquo;
            </p>
            <p className="text-sm text-muted">Shanika W. · Colombo 5</p>
          </div>

          <div className="d-card flex flex-col gap-3 p-5">
            <p className="d-eyebrow">In a hurry?</p>
            <a href={VOLT.phoneHref} className="d-h3 text-brand hover:text-accent">
              {VOLT.phone}
            </a>
            <a href={VOLT.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-ink">
              Or send a photo on WhatsApp →
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <QuoteFormDemo />
        </div>
      </div>
    </section>
  );
}
