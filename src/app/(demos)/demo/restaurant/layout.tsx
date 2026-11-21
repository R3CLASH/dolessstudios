import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { getSolution } from "@/lib/content";
import { DemoBar } from "@/components/demo/DemoBar";
import { HOURS, TABLE } from "@/lib/demo/restaurant";
import { Mark } from "@/components/demo/restaurant/Mark";
import { OpenStatus } from "@/components/demo/restaurant/OpenStatus";

export const metadata: Metadata = {
  title: { default: `${TABLE.name} · Sri Lankan kitchen, Colombo 03`, template: `%s · ${TABLE.name}` },
  description: TABLE.tagline,
};

const NAV = [
  { href: "/demo/restaurant", label: "Home" },
  { href: "/demo/restaurant/menu", label: "Menu" },
  { href: "/demo/restaurant#find-us", label: "Find us" },
  { href: "/demo/restaurant#reviews", label: "Reviews" },
];

export default function RestaurantDemoLayout({ children }: { children: React.ReactNode }) {
  const price = formatMoney(getSolution("restaurant")!.priceCents);

  return (
    <div data-demo="restaurant" className="flex min-h-svh flex-col bg-surface">
      <DemoBar solutionSlug="restaurant" price={price} name={TABLE.name} />

      <header className="sticky top-0 z-40 border-b border-edge bg-surface/95 backdrop-blur">
        <div className="d-wrap flex items-center justify-between gap-4 py-3">
          <Link href="/demo/restaurant" className="flex items-center gap-2.5">
            <Mark className="h-9 w-9" />
            <span className="d-h3 leading-none text-brand">{TABLE.name}</span>
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
            <OpenStatus className="hidden lg:inline-flex" />
            <Link href="/demo/restaurant/book" className="d-btn d-btn-primary !min-h-10 !px-4 !text-[0.95rem] !text-white">
              Book a table
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer id="find-us" className="mt-auto scroll-mt-24 border-t border-edge bg-brand text-white">
        <div className="d-wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Mark className="h-8 w-8" />
              <span className="d-h3 leading-none">{TABLE.name}</span>
            </div>
            <p className="text-sm text-white/70">{TABLE.tagline}.</p>
            <p className="text-sm text-white/55">Cooking since {TABLE.established}.</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">Find us</p>
            <p className="text-sm text-white/80">{TABLE.address}</p>
            <a href={TABLE.phoneHref} className="text-lg font-semibold hover:text-accent">
              {TABLE.phone}
            </a>
            <a href={`mailto:${TABLE.email}`} className="text-sm text-white/80 hover:text-white">
              {TABLE.email}
            </a>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="d-eyebrow !text-white/55">Hours</p>
            {HOURS.map((h) => (
              <p key={h.day} className="flex justify-between gap-4 text-sm text-white/80">
                <span>{h.day}</span>
                <span className={h.open ? "" : "text-white/45"}>{h.open ? `${h.open}–${h.close}` : "Closed"}</span>
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="d-eyebrow !text-white/55">Order in</p>
            <p className="text-sm text-white/70">
              We&apos;re on the delivery apps, but ordering straight from us costs you the same and us a lot less.
            </p>
            <a href={TABLE.whatsapp} target="_blank" rel="noopener noreferrer" className="d-btn d-btn-primary w-fit !min-h-10 !px-4 !text-sm !text-white">
              Order on WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-white/12">
          <div className="d-wrap flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/45">
            <p>
              © {new Date().getFullYear()} {TABLE.name}. A fictional restaurant, for demonstration.
            </p>
            <a href="/off-the-shelf/restaurant" className="hover:text-white/80">
              Built by Do Less Studios
            </a>
          </div>
        </div>
      </footer>

      <div className="sticky bottom-0 z-40 grid grid-cols-2 gap-px border-t border-edge bg-edge md:hidden">
        <a href={TABLE.phoneHref} className="flex min-h-14 items-center justify-center gap-2 bg-brand font-semibold text-white">
          📞 Call
        </a>
        <Link href="/demo/restaurant/book" className="flex min-h-14 items-center justify-center gap-2 bg-accent font-semibold text-white">
          Book a table
        </Link>
      </div>
    </div>
  );
}
