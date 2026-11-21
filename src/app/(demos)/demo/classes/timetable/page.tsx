import type { Metadata } from "next";
import Link from "next/link";
import { BRANCHES, TIMETABLE, VIDURA } from "@/lib/demo/classes";

export const metadata: Metadata = {
  title: "Timetable",
  description: `Every class at ${VIDURA.name} by day, grade and branch, with fees and seats left.`,
};

/** Grouped by branch, because that is the first thing a parent filters by. */
const BY_BRANCH = BRANCHES.map((b) => ({
  branch: b,
  rows: TIMETABLE.filter((c) => c.branch === b.name),
}));

export default function TimetablePage() {
  return (
    <>
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap flex flex-col gap-5 py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/demo/classes" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink">Timetable</span>
          </nav>
          <h1 className="d-h1 max-w-3xl text-brand">Timetable.</h1>
          <p className="max-w-2xl text-lg text-muted">
            Current as of this week. When a class is full it says so here rather than letting you register and finding out at the
            door. Changes for Poya and public holidays are posted on this page first.
          </p>
        </div>
      </section>

      {BY_BRANCH.map(({ branch, rows }) => (
        <section key={branch.name} className="border-b border-edge py-12 sm:py-16">
          <div className="d-wrap flex flex-col gap-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="d-h2 text-brand">{branch.name}</h2>
                <p className="text-muted">{branch.address}</p>
              </div>
              <span className="rounded-full bg-surface-2 px-3 py-1.5 text-sm text-muted">
                {rows.length} class{rows.length === 1 ? "" : "es"}
              </span>
            </div>

            {/* A real table, because this is tabular data and parents scan it. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] border-collapse text-left">
                <caption className="sr-only">Classes at the {branch.name} branch</caption>
                <thead>
                  <tr className="border-b border-edge">
                    {["Subject", "Grade", "Day & time", "Teacher", "Fee", "Seats"].map((h) => (
                      <th key={h} scope="col" className="d-eyebrow py-3 pr-4 align-bottom">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.slug} className="border-b border-edge last:border-0">
                      <th scope="row" className="py-4 pr-4 font-semibold text-brand">
                        {c.subject}
                      </th>
                      <td className="py-4 pr-4 text-muted">{c.grade}</td>
                      <td className="py-4 pr-4">
                        <span className="block font-medium">{c.day}</span>
                        <span className="text-sm text-muted">{c.time}</span>
                      </td>
                      <td className="py-4 pr-4 text-muted">{c.teacher}</td>
                      <td className="py-4 pr-4 font-medium">{c.fee}</td>
                      <td className="py-4">
                        <span
                          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                            c.seats.startsWith("Full") ? "bg-surface-2 text-muted" : "bg-brand-soft text-brand"
                          }`}
                        >
                          {c.seats}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ))}

      <section className="py-14 sm:py-20">
        <div className="d-wrap grid gap-6 sm:grid-cols-2">
          <div className="d-card flex flex-col gap-4 p-6">
            <h2 className="d-h3 text-brand">A class is full. What now?</h2>
            <p className="text-muted">
              Register anyway and you go on the waiting list. Seats open most months as students drop a subject, and we call in
              the order we received you.
            </p>
            <Link href="/demo/classes/register" className="d-btn d-btn-dark w-fit">
              Join the waiting list
            </Link>
          </div>
          <div className="d-card flex flex-col gap-4 p-6">
            <h2 className="d-h3 text-brand">Is there a class this week?</h2>
            <p className="text-muted">
              This page is the answer. It&apos;s updated before the change happens, not after, and the class WhatsApp group gets
              the same message the week before.
            </p>
            <a href={VIDURA.phoneHref} className="d-btn d-btn-ghost w-fit">
              Or call the office
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
