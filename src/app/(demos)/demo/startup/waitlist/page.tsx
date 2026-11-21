import type { Metadata } from "next";
import Link from "next/link";
import { LAUNCH, STEPS } from "@/lib/demo/startup";
import { WaitlistFormDemo } from "@/components/demo/startup/WaitlistFormDemo";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description: `Get early access to ${LAUNCH.name}.`,
};

export default function WaitlistPage() {
  return (
    <section className="bg-surface-2 py-14 sm:py-20">
      <div className="d-wrap grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/startup" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Waitlist</span>
          </nav>

          <h1 className="d-h1 text-brand">Get in early.</h1>
          <p className="text-lg text-muted">
            We let a handful of teams into the beta each week, and we pick the ones whose setup we can support properly. Telling us
            what you use genuinely moves you up.
          </p>

          <div className="d-card flex flex-col gap-4 p-6">
            <p className="d-eyebrow">What happens next</p>
            <ol className="flex flex-col gap-3">
              {STEPS.map((s) => (
                <li key={s.n} className="flex items-start gap-3">
                  <span className="mt-0.5 font-mono text-sm font-bold text-accent">{s.n}</span>
                  <span>
                    <strong className="block">{s.title}</strong>
                    <span className="text-sm text-muted">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <p className="text-sm text-muted">
            {LAUNCH.waitlistCount.toLocaleString("en-US")} people on the list · no card · unsubscribe in one click
          </p>
        </div>

        <div className="lg:col-span-7">
          <WaitlistFormDemo />
        </div>
      </div>
    </section>
  );
}
