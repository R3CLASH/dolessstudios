import type { Metadata } from "next";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { getSolution } from "@/lib/content";
import { DemoBar } from "@/components/demo/DemoBar";
import { PRACTICE } from "@/lib/demo/clinic";
import { Mark } from "@/components/demo/clinic/Mark";

export const metadata: Metadata = {
  title: { default: `${PRACTICE.name} · Dentists in Colombo 07`, template: `%s · ${PRACTICE.name}` },
  description: PRACTICE.tagline,
};

const NAV = [
  { href: "/demo/clinic", label: "Home" },
  { href: "/demo/clinic/treatments", label: "Treatments & fees" },
  { href: "/demo/clinic#team", label: "The team" },
  { href: "/demo/clinic#faq", label: "Questions" },
];

export default function ClinicDemoLayout({ children }: { children: React.ReactNode }) {
  const price = formatMoney(getSolution("clinic")!.priceCents);

  return (
    <div data-demo="clinic" className="flex min-h-svh flex-col bg-surface">
      <DemoBar solutionSlug="clinic" price={price} name={PRACTICE.name} />

      <header className="sticky top-0 z-40 border-b border-edge bg-surface/95 backdrop-blur">
        <div className="d-wrap flex items-center justify-between gap-4 py-3">
          <Link href="/demo/clinic" className="flex items-center gap-2.5">
            <Mark className="h-9 w-9" />
            <span className="d-h3 leading-none text-brand">{PRACTICE.name}</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
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
            <a href={PRACTICE.phoneHref} className="hidden font-semibold text-brand hover:text-accent sm:block">
              {PRACTICE.phone}
            </a>
            <Link href="/demo/clinic/appointment" className="d-btn d-btn-primary !min-h-10 !px-4 !text-[0.95rem] !text-white">
              Book in
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
              <span className="d-h3 leading-none">{PRACTICE.name}</span>
            </div>
            <p className="text-sm text-white/70">{PRACTICE.tagline}.</p>
            <p className="text-sm text-white/55">Caring for Colombo since {PRACTICE.established}.</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">Treatments</p>
            {["Check-up & clean", "Fillings", "Root canal", "Crowns & bridges", "Whitening"].map((s) => (
              <Link key={s} href="/demo/clinic/treatments" className="text-sm text-white/80 hover:text-white">
                {s}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">Practice</p>
            <p className="text-sm text-white/80">{PRACTICE.address}</p>
            <a href={PRACTICE.phoneHref} className="text-lg font-semibold hover:text-accent">
              {PRACTICE.phone}
            </a>
            <a href={`mailto:${PRACTICE.email}`} className="text-sm text-white/80 hover:text-white">
              {PRACTICE.email}
            </a>
            <p className="text-sm text-white/55">{PRACTICE.hours}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="d-eyebrow !text-white/55">Policies</p>
            {["Privacy & your records", "Cancellations", "Complaints", "Accessibility"].map((s) => (
              <span key={s} className="text-sm text-white/80">
                {s}
              </span>
            ))}
            <p className="mt-2 text-xs text-white/45">
              A real practice would link these to full pages. They&apos;re included in the build.
            </p>
          </div>
        </div>

        <div className="border-t border-white/12">
          <div className="d-wrap flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/45">
            <p>
              © {new Date().getFullYear()} {PRACTICE.name}. A fictional practice, for demonstration. Nothing here is medical advice.
            </p>
            <a href="/off-the-shelf/clinic" className="hover:text-white/80">
              Built by Do Less Studios
            </a>
          </div>
        </div>
      </footer>

      <div className="sticky bottom-0 z-40 grid grid-cols-2 gap-px border-t border-edge bg-edge md:hidden">
        <a href={PRACTICE.phoneHref} className="flex min-h-14 items-center justify-center gap-2 bg-brand font-semibold text-white">
          📞 Call
        </a>
        <Link href="/demo/clinic/appointment" className="flex min-h-14 items-center justify-center gap-2 bg-accent font-semibold text-white">
          Book in
        </Link>
      </div>
    </div>
  );
}
