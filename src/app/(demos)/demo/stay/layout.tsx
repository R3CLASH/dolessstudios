import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { getSolution } from "@/lib/content";
import { DemoBar } from "@/components/demo/DemoBar";
import { PALM } from "@/lib/demo/stay";
import { Mark } from "@/components/demo/stay/Mark";

export const metadata: Metadata = {
  title: { default: `${PALM.name} · ${PALM.place} Fort`, template: `%s · ${PALM.name}` },
  description: PALM.tagline,
};

const NAV = [
  { href: "/demo/stay", label: "Home" },
  { href: "/demo/stay/rooms", label: "Rooms & rates" },
  { href: "/demo/stay#nearby", label: "What's nearby" },
  { href: "/demo/stay#getting-here", label: "Getting here" },
];

export default function StayDemoLayout({ children }: { children: React.ReactNode }) {
  const price = formatMoney(getSolution("stay")!.priceCents);

  return (
    <div data-demo="stay" className="flex min-h-svh flex-col bg-surface">
      <DemoBar solutionSlug="stay" price={price} name={PALM.name} />

      <header className="sticky top-0 z-40 border-b border-edge bg-surface/95 backdrop-blur">
        <div className="d-wrap flex items-center justify-between gap-4 py-3">
          <Link href="/demo/stay" className="flex items-center gap-2.5">
            <Mark className="h-9 w-9" />
            <span className="flex flex-col leading-none">
              <span className="d-h3 text-brand">{PALM.name}</span>
              <span className="text-xs tracking-wide text-muted">{PALM.place} Fort</span>
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
            <a href={PALM.phoneHref} className="hidden text-[0.95rem] font-semibold text-brand hover:text-accent sm:block">
              {PALM.phone}
            </a>
            <Link href="/demo/stay/enquire" className="d-btn d-btn-primary !min-h-10 !px-4 !text-[0.95rem]">
              Check rates
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
              <span className="d-h3 leading-none">{PALM.name}</span>
            </div>
            <p className="text-sm text-white/70">{PALM.tagline}.</p>
            <p className="text-sm text-white/55">Taking guests since {PALM.established}.</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">The house</p>
            {[
              { l: "Rooms & rates", h: "/demo/stay/rooms" },
              { l: "What's included", h: "/demo/stay#included" },
              { l: "What's nearby", h: "/demo/stay#nearby" },
              { l: "Getting here", h: "/demo/stay#getting-here" },
            ].map((s) => (
              <Link key={s.l} href={s.h} className="text-sm text-white/80 hover:text-white">
                {s.l}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">Find us</p>
            <p className="text-sm text-white/80">{PALM.address}</p>
            <p className="text-sm text-white/55">{PALM.checkIn}</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="d-eyebrow !text-white/55">Book direct</p>
            <a href={PALM.phoneHref} className="text-lg font-semibold hover:text-accent">
              {PALM.phone}
            </a>
            <a href={`mailto:${PALM.email}`} className="text-sm text-white/80 hover:text-white">
              {PALM.email}
            </a>
            <a
              href={PALM.whatsapp}
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
              © {new Date().getFullYear()} {PALM.name}, {PALM.place}. A fictional business, for demonstration.
            </p>
            <a href="/off-the-shelf/stay" className="hover:text-white/80">
              Built by Do Less Studios
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile sticky actions. A guest deciding at 11pm wants one tap. */}
      <div className="sticky bottom-0 z-40 grid grid-cols-2 gap-px border-t border-edge bg-edge md:hidden">
        <Link href="/demo/stay/enquire" className="flex min-h-14 items-center justify-center gap-2 bg-brand font-semibold text-white">
          Check rates
        </Link>
        <a
          href={PALM.whatsapp}
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
