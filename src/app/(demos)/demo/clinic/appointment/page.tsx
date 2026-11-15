import type { Metadata } from "next";
import Link from "next/link";
import { PRACTICE } from "@/lib/demo/clinic";
import { AppointmentFormDemo } from "@/components/demo/clinic/AppointmentFormDemo";

export const metadata: Metadata = {
  title: "Request an appointment",
  description: `Request an appointment at ${PRACTICE.name}, ${PRACTICE.address}.`,
};

export default function AppointmentPage() {
  return (
    <section className="bg-surface-2 py-14 sm:py-20">
      <div className="d-wrap grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/clinic" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Request an appointment</span>
          </nav>

          <h1 className="d-h1 text-brand">Book in.</h1>
          <p className="text-lg text-muted">
            Tell us roughly what you need and when you&apos;re free. Reception calls you back within one working day to agree a
            time that works.
          </p>

          <div className="d-card flex flex-col gap-3 p-5">
            <p className="d-eyebrow">In pain today?</p>
            <a href={PRACTICE.phoneHref} className="d-h3 text-brand hover:text-accent">
              {PRACTICE.phone}
            </a>
            <p className="text-sm text-muted">We keep slots free each morning for emergencies. Call as early as you can.</p>
          </div>

          <div className="d-card flex flex-col gap-2 p-5">
            <p className="d-eyebrow">The practice</p>
            <p>{PRACTICE.address}</p>
            <p className="text-sm text-muted">{PRACTICE.hours}</p>
          </div>

          <div className="d-card flex flex-col gap-2 p-5">
            <p className="d-eyebrow">Your information</p>
            <p className="text-sm text-muted">
              What you send here goes to reception and nowhere else. A real practice would link its privacy notice from this box —
              that page is part of the build.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <AppointmentFormDemo />
        </div>
      </div>
    </section>
  );
}
