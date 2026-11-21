import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { getSolution } from "@/lib/content";
import { DemoBar } from "@/components/demo/DemoBar";
import { BRANCHES, VIDURA } from "@/lib/demo/classes";
import { Mark } from "@/components/demo/classes/Mark";

export const metadata: Metadata = {
  title: { default: `${VIDURA.name} · A/L classes`, template: `%s · ${VIDURA.name}` },
  description: VIDURA.tagline,
};

const NAV = [
  { href: "/demo/classes", label: "Home" },
  { href: "/demo/classes/timetable", label: "Timetable" },
  { href: "/demo/classes#teachers", label: "Teachers" },
  { href: "/demo/classes#fees", label: "Fees" },
];

export default function ClassesDemoLayout({ children }: { children: React.ReactNode }) {
  const price = formatMoney(getSolution("classes")!.priceCents);

  return (
    <div data-demo="classes" className="flex min-h-svh flex-col bg-surface">
      <DemoBar solutionSlug="classes" price={price} name={VIDURA.name} />

      <header className="sticky top-0 z-40 border-b border-edge bg-surface/95 backdrop-blur">
        <div className="d-wrap flex items-center justify-between gap-4 py-3">
          <Link href="/demo/classes" className="flex items-center gap-2.5">
            <Mark className="h-9 w-9" />
            <span className="flex flex-col leading-none">
              <span className="d-h3 text-brand">{VIDURA.name}</span>
              <span className="text-xs tracking-wide text-muted">Nugegoda &amp; Kandy</span>
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
            <a href={VIDURA.phoneHref} className="hidden text-[0.95rem] font-semibold text-brand hover:text-accent sm:block">
              {VIDURA.phone}
            </a>
            <Link href="/demo/classes/register" className="d-btn d-btn-dark !min-h-10 !px-4 !text-[0.95rem]">
              Register
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
              <span className="d-h3 leading-none">{VIDURA.name}</span>
            </div>
            <p className="text-sm text-white/70">{VIDURA.tagline}.</p>
            <p className="text-sm text-white/55">Teaching A/L since {VIDURA.established}.</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">Classes</p>
            {[
              { l: "Full timetable", h: "/demo/classes/timetable" },
              { l: "The teachers", h: "/demo/classes#teachers" },
              { l: "Fees", h: "/demo/classes#fees" },
              { l: "Results", h: "/demo/classes#results" },
            ].map((s) => (
              <Link key={s.l} href={s.h} className="text-sm text-white/80 hover:text-white">
                {s.l}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="d-eyebrow !text-white/55">Branches</p>
            {BRANCHES.map((b) => (
              <div key={b.name} className="flex flex-col">
                <span className="text-sm font-semibold text-white/90">{b.name}</span>
                <span className="text-sm text-white/60">{b.address}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="d-eyebrow !text-white/55">Office</p>
            <a href={VIDURA.phoneHref} className="text-lg font-semibold hover:text-accent">
              {VIDURA.phone}
            </a>
            <a href={`mailto:${VIDURA.email}`} className="text-sm text-white/80 hover:text-white">
              {VIDURA.email}
            </a>
            <p className="text-sm text-white/55">{VIDURA.hours}</p>
            <a
              href={VIDURA.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="d-btn !min-h-10 w-fit !px-4 !text-sm"
              style={{ background: "#25D366", color: "#07321b" }}
            >
              WhatsApp the office
            </a>
          </div>
        </div>

        <div className="border-t border-white/12">
          <div className="d-wrap flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/45">
            <p>
              © {new Date().getFullYear()} {VIDURA.name}. A fictional business, for demonstration.
            </p>
            <a href="/off-the-shelf/classes" className="hover:text-white/80">
              Built by Do Less Studios
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile sticky actions: a parent checking the timetable on a phone. */}
      <div className="sticky bottom-0 z-40 grid grid-cols-2 gap-px border-t border-edge bg-edge md:hidden">
        <Link
          href="/demo/classes/timetable"
          className="flex min-h-14 items-center justify-center gap-2 bg-brand font-semibold text-white"
        >
          Timetable
        </Link>
        <Link
          href="/demo/classes/register"
          className="flex min-h-14 items-center justify-center gap-2 bg-accent font-semibold text-white"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
