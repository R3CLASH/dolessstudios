import type { Metadata } from "next";
import Link from "next/link";
import { CEYLON, PRODUCTS } from "@/lib/demo/supplier";

export const metadata: Metadata = {
  title: "What we make",
  description: `Grades, specifications, pack sizes and minimum order quantities from ${CEYLON.name}.`,
};

export default function ProductsPage() {
  return (
    <>
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap flex flex-col gap-5 py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/supplier" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">What we make</span>
          </nav>
          <h1 className="d-h1 max-w-3xl text-brand">What we make.</h1>
          <p className="max-w-2xl text-lg text-muted">
            Six lines, with the specification on the page rather than in an attachment you have to ask for. Everything is
            available for private label.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/demo/supplier/quote" className="d-btn d-btn-primary !text-white">
              Request a quote →
            </Link>
            <a href={`mailto:${CEYLON.email}`} className="d-btn d-btn-ghost">
              Ask for the line card
            </a>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="d-wrap flex flex-col gap-12">
          {PRODUCTS.map((p) => (
            <article key={p.slug} id={p.slug} className="scroll-mt-24 grid gap-8 border-b border-edge pb-12 last:border-0 lg:grid-cols-12">
              <div className="flex flex-col gap-4 lg:col-span-5">
                <div className="flex flex-col gap-2">
                  <span className="d-eyebrow">{p.grade}</span>
                  <h2 className="d-h2 text-brand">{p.name}</h2>
                </div>
                <p className="text-lg text-muted">{p.line}</p>
                <dl className="flex flex-col divide-y divide-edge border-y border-edge">
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-muted">Origin</dt>
                    <dd className="text-right font-semibold">{p.origin}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-muted">Minimum order</dt>
                    <dd className="text-right font-semibold">{p.moq}</dd>
                  </div>
                </dl>
                <Link href="/demo/supplier/quote" className="d-btn d-btn-dark w-fit">
                  Quote this grade &rarr;
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
                <div className="d-card flex flex-col gap-3 p-6">
                  <h3 className="d-eyebrow">Specification</h3>
                  <dl className="flex flex-col divide-y divide-edge">
                    {p.specs.map((s) => (
                      <div key={s.k} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                        <dt className="text-muted">{s.k}</dt>
                        <dd className="text-right font-semibold">{s.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="d-card flex flex-col gap-3 p-6">
                  <h3 className="d-eyebrow">Packing</h3>
                  <ul className="flex flex-col gap-2.5 text-sm">
                    {p.packing.map((k) => (
                      <li key={k} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: "var(--d-accent)" }}
                        />
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-edge bg-brand py-14 text-white sm:py-16">
        <div className="d-wrap flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="d-h2">Need something not on this list?</h2>
            <p className="max-w-lg text-white/75">
              Send us the cup profile and the target price and we will tell you honestly whether we can build it.
            </p>
          </div>
          <Link href="/demo/supplier/quote" className="d-btn d-btn-primary !text-white">
            Request a quote →
          </Link>
        </div>
      </section>
    </>
  );
}
