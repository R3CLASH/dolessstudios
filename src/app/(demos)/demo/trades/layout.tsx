import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { getSolution } from "@/lib/content";
import { DemoBar } from "@/components/demo/DemoBar";
import { VOLT } from "@/lib/demo/trades";
import { Bolt } from "@/components/demo/trades/Bolt";

export const metadata: Metadata = {
  title: { default: `${VOLT.name} · Colombo electricians`, template: `%s · ${VOLT.name}` },
  description: VOLT.tagline,
};

const NAV = [
  { href: "/demo/trades", label: "Home" },
  { href: "/demo/trades#services", label: "Services" },
  { href: "/demo/trades/areas", label: "Areas we cover" },
  { href: "/demo/trades#reviews", label: "Reviews" },
];

export default function TradesDemoLayout({ children }: { children: React.ReactNode }) {
  const price = formatMoney(getSolution("trades")!.priceCents);

  return (
    <div data-demo="trades" className="flex min-h-svh flex-col bg-surface">
      <DemoBar solutionSlug="trades" price={price} name={VOLT.name} />

      <header className="sticky top-0 z-40 border-b border-edge bg-surface/95 backdrop-blur">
        <div className="d-wrap flex items-center justify-between gap-4 py-3">
          <Link href="/demo/trades" className="flex items-center gap-2.5">
            <Bolt className="h-9 w-9" />
            <span className="d-h3 leading-none text-brand">{VOLT.name}</span>
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
            {/* The two things a trades site exists to do, on every screen. */}
            <a href={VOLT.phoneHref} className="d-btn d-btn-dark !min-h-10 !px-4 !text-[0.95rem]">
              <span aria-hidden="true">📞</span>
              <span className="hidden sm:inline">{VOLT.phone}</span>
              <span className="sm:hidden">Call</span>
            </a>
            <Link href="/demo/trades/quote" className="d-btn d-btn-primary !min-h-10 !px-4 !text-[0.95rem]">
              Get a quote
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-auto border-t border-edge bg-brand text-white">
        <div className="d-wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Bolt className="h-8 w-8" />
              <span className="d-h3 leading-none">{VOLT.name}</span>
            </div>
            <p className="text-sm text-white/70">{VOLT.tagline}.</p>
            <p className="text-sm text-white/55">Licensed &amp; insured since {VOLT.established}.</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">Services</p>
            {["Fault finding", "Rewiring", "Solar & inverters", "Lights & sockets", "Safety certificates"].map((s) => (
              <Link key={s} href="/demo/trades#services" className="text-sm text-white/80 hover:text-white">
                {s}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">Where we work</p>
            {["Colombo 1–15", "Dehiwala", "Nugegoda", "Rajagiriya", "Moratuwa"].map((s) => (
              <Link key={s} href="/demo/trades/areas" className="text-sm text-white/80 hover:text-white">
                {s}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="d-eyebrow !text-white/55">Get in touch</p>
            <a href={VOLT.phoneHref} className="text-lg font-semibold hover:text-accent">
              {VOLT.phone}
            </a>
            <a href={`mailto:${VOLT.email}`} className="text-sm text-white/80 hover:text-white">
              {VOLT.email}
            </a>
            <p className="text-sm text-white/55">{VOLT.hours}</p>
            <a
              href={VOLT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="d-btn !min-h-10 w-fit !px-4 !text-sm"
              style={{ background: "#25D366", color: "#07321b" }}
            >
              WhatsApp us
            </a>
          </div>
        </div>

        <div className="border-t border-white/12">
          <div className="d-wrap flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/45">
            <p>
              © {new Date().getFullYear()} {VOLT.name} (Pvt) Ltd. A fictional business, for demonstration.
            </p>
            <a href="/off-the-shelf/trades" className="hover:text-white/80">
              Built by Do Less Studios
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile sticky actions: the whole point of a trades site on a phone. */}
      <div className="sticky bottom-0 z-40 grid grid-cols-2 gap-px border-t border-edge bg-edge md:hidden">
        <a href={VOLT.phoneHref} className="flex min-h-14 items-center justify-center gap-2 bg-brand font-semibold text-white">
          📞 Call now
        </a>
        <a
          href={VOLT.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-14 items-center justify-center gap-2 font-semibold"
          style={{ background: "#25D366", color: "#07321b" }}
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
