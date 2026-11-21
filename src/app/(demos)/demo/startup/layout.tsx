import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { getSolution } from "@/lib/content";
import { DemoBar } from "@/components/demo/DemoBar";
import { LAUNCH } from "@/lib/demo/startup";
import { Mark } from "@/components/demo/startup/Mark";

export const metadata: Metadata = {
  title: { default: `${LAUNCH.name} · ${LAUNCH.tagline}`, template: `%s · ${LAUNCH.name}` },
  description: LAUNCH.tagline,
};

const NAV = [
  { href: "/demo/startup#how", label: "How it works" },
  { href: "/demo/startup#features", label: "Features" },
  { href: "/demo/startup/pricing", label: "Pricing" },
  { href: "/demo/startup#faq", label: "FAQ" },
];

export default function StartupDemoLayout({ children }: { children: React.ReactNode }) {
  const price = formatMoney(getSolution("startup")!.priceCents);

  return (
    <div data-demo="startup" className="flex min-h-svh flex-col bg-surface">
      <DemoBar solutionSlug="startup" price={price} name={LAUNCH.name} />

      <header className="sticky top-0 z-40 border-b border-edge bg-surface/90 backdrop-blur">
        <div className="d-wrap flex items-center justify-between gap-4 py-3">
          <Link href="/demo/startup" className="flex items-center gap-2.5">
            <Mark className="h-9 w-9" />
            <span className="d-h3 leading-none text-brand">{LAUNCH.name}</span>
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

          <Link href="/demo/startup/waitlist" className="d-btn d-btn-primary !min-h-10 !px-4 !text-[0.95rem] !text-white">
            Join the waitlist
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-auto border-t border-edge bg-brand text-white">
        <div className="d-wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Mark className="h-8 w-8" />
              <span className="d-h3 leading-none">{LAUNCH.name}</span>
            </div>
            <p className="text-sm text-white/70">{LAUNCH.tagline}.</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">Product</p>
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} className="text-sm text-white/80 hover:text-white">
                {n.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">Company</p>
            {["About", "Changelog", "Privacy", "Terms"].map((s) => (
              <span key={s} className="text-sm text-white/80">
                {s}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="d-eyebrow !text-white/55">Get in early</p>
            <p className="text-sm text-white/70">
              {LAUNCH.waitlistCount.toLocaleString("en-US")} people are already on the list.
            </p>
            <Link href="/demo/startup/waitlist" className="d-btn d-btn-primary w-fit !min-h-10 !px-4 !text-sm !text-white">
              Join the waitlist
            </Link>
            <a href={`mailto:${LAUNCH.email}`} className="text-sm text-white/70 hover:text-white">
              {LAUNCH.email}
            </a>
          </div>
        </div>

        <div className="border-t border-white/12">
          <div className="d-wrap flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/45">
            <p>
              © {new Date().getFullYear()} {LAUNCH.name}. A fictional product, for demonstration.
            </p>
            <a href="/off-the-shelf/startup" className="hover:text-white/80">
              Built by Do Less Studios
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
