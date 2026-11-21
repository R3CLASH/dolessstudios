import type { Metadata } from "next";
import Link from "next/link";
import { MENU, TABLE } from "@/lib/demo/restaurant";

export const metadata: Metadata = {
  title: "Menu",
  description: `Short eats, rice and curry, hoppers and kottu at ${TABLE.name}, Colombo 03.`,
};

export default function MenuPage() {
  return (
    <>
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap flex flex-col gap-5 py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/restaurant" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Menu</span>
          </nav>
          <h1 className="d-h1 text-brand">The menu.</h1>
          <p className="max-w-2xl text-lg text-muted">
            Prices include taxes. Crab is market price because it changes with the boats. Tell us about allergies when you book and
            the kitchen will work around them.
          </p>
          {/* Anchor nav: what a printed menu's sections would be. */}
          <div className="flex flex-wrap gap-2">
            {MENU.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="d-btn d-btn-ghost !min-h-10 !px-4 !text-sm">
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="d-wrap flex flex-col gap-14">
          {MENU.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-24 flex flex-col gap-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-edge pb-4">
                <h2 className="d-h2 text-brand">{section.title}</h2>
                {section.note && <p className="text-sm text-muted">{section.note}</p>}
              </div>
              <ul className="flex flex-col divide-y divide-edge">
                {section.dishes.map((d) => (
                  <li key={d.name} className="flex items-baseline justify-between gap-6 py-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="d-h3 flex flex-wrap items-center gap-2 text-ink">
                        {d.name}
                        {d.tags?.map((t) => (
                          <span
                            key={t}
                            className="rounded-full px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide"
                            style={{ background: "var(--d-brand-soft)", color: "var(--d-brand)" }}
                          >
                            {t}
                          </span>
                        ))}
                      </h3>
                      <p className="text-sm text-muted">{d.line}</p>
                    </div>
                    <span className="shrink-0 font-semibold text-accent">{d.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="d-card flex flex-wrap items-center justify-between gap-4 p-6">
            <p className="text-muted">
              Menu changes with what&apos;s good at the market. This page is edited by the kitchen, not a developer.
            </p>
            <Link href="/demo/restaurant/book" className="d-btn d-btn-primary !text-white">
              Book a table →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
