import type { Metadata } from "next";
import Link from "next/link";
import { HOURS, TABLE } from "@/lib/demo/restaurant";
import { BookingFormDemo } from "@/components/demo/restaurant/BookingFormDemo";

export const metadata: Metadata = {
  title: "Book a table",
  description: `Reserve a table at ${TABLE.name}, ${TABLE.address}.`,
};

export default function BookPage() {
  return (
    <section className="bg-surface-2 py-14 sm:py-20">
      <div className="d-wrap grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/restaurant" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Book a table</span>
          </nav>

          <h1 className="d-h1 text-brand">Keep us a table.</h1>
          <p className="text-lg text-muted">
            Confirmed by email within a few minutes during service. For eight or more, or to book the whole room, give us a ring.
          </p>

          <div className="d-card flex flex-col gap-2 p-5">
            <p className="d-eyebrow">Hours</p>
            {HOURS.map((h) => (
              <p key={h.day} className="flex justify-between gap-4 text-sm">
                <span>{h.day}</span>
                <span className={h.open ? "text-ink" : "text-muted"}>{h.open ? `${h.open}–${h.close}` : "Closed"}</span>
              </p>
            ))}
          </div>

          <div className="d-card flex flex-col gap-2 p-5">
            <p className="d-eyebrow">Find us</p>
            <p>{TABLE.address}</p>
            <a href={TABLE.phoneHref} className="d-h3 text-brand hover:text-accent">
              {TABLE.phone}
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <BookingFormDemo />
        </div>
      </div>
    </section>
  );
}
