import type { Metadata } from "next";
import Link from "next/link";
import { getAddOn, getSolution } from "@/lib/content";
import { requireAdmin } from "@/lib/adminSession";
import {
  INQUIRY_STATUSES,
  databaseConfigured,
  listLeads,
  newLeadCount,
  unemailedOrderCount,
  type InquiryStatus,
} from "@/lib/adminData";
import { AdminShell, NoDatabase, StatusPill } from "@/components/admin/AdminShell";
import { setLeadNote, setLeadStatus } from "../actions";

/**
 * Off-the-shelf quote submissions — the other half of the funnel.
 *
 * Anyone who ticks an add-on routes to the quote form instead of checkout, so
 * these are the people who wanted something more than the shelf product. Until
 * now they existed only in an inbox, with no way to see which were unanswered.
 *
 * Scoped to source like 'off-the-shelf:%': the bespoke contact-form briefs
 * share the inquiries table and are not what this dashboard is about.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads",
  robots: { index: false, follow: false },
};

function isInquiryStatus(v: string | undefined): v is InquiryStatus {
  return !!v && (INQUIRY_STATUSES as readonly string[]).includes(v);
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; e?: string }>;
}) {
  await requireAdmin();

  const { status, e } = await searchParams;
  const filter = isInquiryStatus(status) ? status : undefined;

  const [leads, newCount, orderFlags] = await Promise.all([
    listLeads(filter),
    newLeadCount(),
    unemailedOrderCount(),
  ]);

  return (
    <AdminShell current="leads" badges={{ leads: newCount, orders: orderFlags }}>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="display heavy text-[clamp(1.8rem,5vw,2.6rem)]">Leads</h1>
        <p className="font-mono text-sm text-mist">quote requests from the catalog</p>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/leads"
          className={`inline-flex min-h-9 items-center rounded-full border px-3 font-mono text-xs transition-colors ${
            filter ? "border-line text-mist hover:text-paper" : "border-accent bg-accent text-ink"
          }`}
        >
          all
        </Link>
        {INQUIRY_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/leads?status=${s}`}
            className={`inline-flex min-h-9 items-center rounded-full border px-3 font-mono text-xs transition-colors ${
              filter === s ? "border-accent bg-accent text-ink" : "border-line text-mist hover:text-paper"
            }`}
          >
            {s}
          </Link>
        ))}
      </nav>

      {e === "write" && (
        <p role="alert" className="mt-6 border border-accent/40 bg-accent/5 p-4 text-sm">
          That change didn&apos;t save — the database refused it or wasn&apos;t reachable.
        </p>
      )}

      {!databaseConfigured() ? (
        <div className="mt-8">
          <NoDatabase />
        </div>
      ) : leads.length === 0 ? (
        <p className="mt-8 border border-line bg-ink-2 p-5 text-mist">
          {filter ? `No leads with status "${filter}".` : "No off-the-shelf quote requests yet."}
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {leads.map((lead) => {
            const solution = lead.solution ? getSolution(lead.solution) : undefined;
            return (
              <li key={lead.id} className="border border-line bg-ink-2 p-5">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <h2 className="text-lg font-semibold">{lead.name}</h2>
                  <a href={`mailto:${lead.email}`} className="font-mono text-sm text-mist underline hover:text-accent">
                    {lead.email}
                  </a>
                  <StatusPill status={lead.status} />
                  <span className="ml-auto font-mono text-xs text-mist">{dateFormat.format(lead.createdAt)}</span>
                </div>

                <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm">
                  <div>
                    <dt className="inline text-mist">Wants: </dt>
                    <dd className="inline">{solution?.title ?? lead.solution ?? "—"}</dd>
                  </div>
                  {lead.company && (
                    <div>
                      <dt className="inline text-mist">Company: </dt>
                      <dd className="inline">{lead.company}</dd>
                    </div>
                  )}
                  {lead.budget && (
                    <div>
                      <dt className="inline text-mist">Budget: </dt>
                      <dd className="inline">{lead.budget}</dd>
                    </div>
                  )}
                  {lead.timeline && (
                    <div>
                      <dt className="inline text-mist">Timeline: </dt>
                      <dd className="inline">{lead.timeline}</dd>
                    </div>
                  )}
                </dl>

                {lead.addons.length > 0 && (
                  <div className="mt-4">
                    <p className="eyebrow">Add-ons picked</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {lead.addons.map((id) => (
                        <li
                          key={id}
                          className="inline-flex items-center rounded-full border border-line px-3 py-0.5 font-mono text-xs text-mist"
                        >
                          {/* Unknown ids can exist if an add-on is ever retired from content.ts. */}
                          {getAddOn(id)?.name ?? id}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lead.message && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-mono text-sm text-mist">What they said</summary>
                    <p className="mt-2 whitespace-pre-wrap text-sm">{lead.message}</p>
                  </details>
                )}

                <div className="mt-5 flex flex-col gap-4 border-t border-line pt-4 lg:flex-row lg:items-start lg:gap-8">
                  <form action={setLeadStatus} className="flex flex-wrap gap-2">
                    <input type="hidden" name="id" value={lead.id} />
                    {INQUIRY_STATUSES.map((s) => (
                      <button
                        key={s}
                        type="submit"
                        name="status"
                        value={s}
                        disabled={s === lead.status}
                        className="inline-flex min-h-11 items-center rounded-full border border-line px-4 font-mono text-xs transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:border-accent disabled:bg-accent disabled:text-ink"
                      >
                        {s}
                      </button>
                    ))}
                  </form>

                  <form action={setLeadNote} className="flex flex-1 flex-col gap-2">
                    <input type="hidden" name="id" value={lead.id} />
                    <textarea
                      name="notes"
                      rows={2}
                      maxLength={2000}
                      defaultValue={lead.notes ?? ""}
                      placeholder="Internal note…"
                      aria-label={`Internal note for ${lead.name}`}
                      className="w-full border border-line bg-ink px-3 py-2 font-mono text-sm text-paper outline-none transition-colors placeholder:text-paper/25 focus:border-accent"
                    />
                    <button type="submit" className="self-start font-mono text-sm text-mist hover:text-accent">
                      Save note
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AdminShell>
  );
}
