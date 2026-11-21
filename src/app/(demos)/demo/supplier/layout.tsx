import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { getSolution } from "@/lib/content";
import { DemoBar } from "@/components/demo/DemoBar";
import { CEYLON } from "@/lib/demo/supplier";
import { Mark } from "@/components/demo/supplier/Mark";

export const metadata: Metadata = {
  title: { default: `${CEYLON.name} · Ceylon tea exporter`, template: `%s · ${CEYLON.name}` },
  description: CEYLON.tagline,
};

const NAV = [
  { href: "/demo/supplier", label: "Home" },
  { href: "/demo/supplier/products", label: "What we make" },
  { href: "/demo/supplier#certifications", label: "Certifications" },
  { href: "/demo/supplier#capacity", label: "Capacity" },
];

export default function SupplierDemoLayout({ children }: { children: React.ReactNode }) {
  const price = formatMoney(getSolution("supplier")!.priceCents);

  return (
    <div data-demo="supplier" className="flex min-h-svh flex-col bg-surface">
      <DemoBar solutionSlug="supplier" price={price} name={CEYLON.name} />

      <header className="sticky top-0 z-40 border-b border-edge bg-surface/95 backdrop-blur">
        <div className="d-wrap flex items-center justify-between gap-4 py-3">
          <Link href="/demo/supplier" className="flex items-center gap-2.5">
            <Mark className="h-9 w-9" />
            <span className="flex flex-col leading-none">
              <span className="d-h3 text-brand">{CEYLON.name}</span>
              <span className="text-xs tracking-wide text-muted">Est. {CEYLON.established} · Colombo</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className="rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-ink/75 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={`mailto:${CEYLON.email}`} className="hidden text-[0.95rem] font-semibold text-brand hover:text-accent lg:block">
              {CEYLON.email}
            </a>
            <Link href="/demo/supplier/quote" className="d-btn d-btn-dark !min-h-10 !px-4 !text-[0.95rem]">
              Request a quote
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-auto border-t border-edge bg-brand text-white">
        <div className="d-wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Mark className="h-8 w-8" />
              <span className="d-h3 leading-none">{CEYLON.name}</span>
            </div>
            <p className="text-sm text-white/70">{CEYLON.tagline}.</p>
            <p className="text-sm text-white/55">{CEYLON.legal}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">Products</p>
            {[
              { l: "All grades", h: "/demo/supplier/products" },
              { l: "Certifications", h: "/demo/supplier#certifications" },
              { l: "Capacity & process", h: "/demo/supplier#capacity" },
              { l: "Markets we ship to", h: "/demo/supplier#markets" },
            ].map((s) => (
              <Link key={s.l} href={s.h} className="text-sm text-white/80 hover:text-white">
                {s.l}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">Facility</p>
            <p className="text-sm text-white/80">{CEYLON.address}</p>
            <p className="text-sm text-white/55">{CEYLON.hours}</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="d-eyebrow !text-white/55">Sales desk</p>
            <a href={`mailto:${CEYLON.email}`} className="text-base font-semibold break-all hover:text-accent">
              {CEYLON.email}
            </a>
            <a href={CEYLON.phoneHref} className="text-sm text-white/80 hover:text-white">
              {CEYLON.phone}
            </a>
            <Link href="/demo/supplier/quote" className="d-btn d-btn-primary !min-h-10 w-fit !px-4 !text-sm !text-white">
              Request a quote
            </Link>
          </div>
        </div>

        <div className="border-t border-white/12">
          <div className="d-wrap flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/45">
            <p>
              © {new Date().getFullYear()} {CEYLON.legal}. A fictional business, for demonstration.
            </p>
            <a href="/off-the-shelf/supplier" className="hover:text-white/80">
              Built by Do Less Studios
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
