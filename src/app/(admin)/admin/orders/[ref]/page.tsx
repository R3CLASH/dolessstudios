import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSolution } from "@/lib/content";
import { BASE_CURRENCY, formatMoney } from "@/lib/money";
import { findOrderByReference } from "@/lib/orders";
import { orderLink } from "@/lib/orderRef";
import { requireAdmin } from "@/lib/adminSession";
import { ADMIN_SETTABLE_STATUSES, databaseConfigured, newLeadCount } from "@/lib/adminData";
import { AdminShell, NoDatabase, StatusPill } from "@/components/admin/AdminShell";
import { OrderTimeline } from "@/components/solutions/OrderTimeline";
import { setOrderNote, setOrderStatus } from "../../actions";

/** One order: everything we know, plus the two things we can change about it. */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short" });

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-3 sm:flex-row sm:gap-6">
      <dt className="font-mono text-xs uppercase tracking-[0.1em] text-mist sm:w-56 sm:shrink-0">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

export default async function AdminOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  await requireAdmin();

  const { ref } = await params;
  const { e } = await searchParams;
  const reference = decodeURIComponent(ref).toUpperCase();
  const leads = await newLeadCount();

  if (!databaseConfigured()) {
    return (
      <AdminShell current="orders" badges={{ leads }}>
        <NoDatabase />
      </AdminShell>
    );
  }

  const order = await findOrderByReference(reference);
  if (!order) notFound();

  const solution = order.solution ? getSolution(order.solution) : undefined;
  // Only non-null once ORDER_LINK_SECRET is set — the same link the buyer got.
  const buyerLink = order.reference ? orderLink(order.reference) : null;

  return (
    <AdminShell current="orders" badges={{ leads }}>
      <Link href="/admin/orders" className="font-mono text-sm text-mist hover:text-paper">
        ← Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-baseline gap-4">
        <h1 className="display heavy text-[clamp(1.8rem,5vw,2.6rem)]">{solution?.title ?? "Order"}</h1>
        <p className="select-all font-mono text-accent">{order.reference ?? "—"}</p>
        <StatusPill status={order.status} />
      </div>

      {e === "write" && (
        <p role="alert" className="mt-6 border border-accent/40 bg-accent/5 p-4 text-sm">
          That change didn&apos;t save — the database refused it or wasn&apos;t reachable. Nothing else was altered.
        </p>
      )}

      {e === "refunded" && (
        <p role="alert" className="mt-6 border border-accent/40 bg-accent/5 p-4 text-sm">
          This order was refunded, so its status is settled history and can&apos;t be moved. Dodo reversed the
          payment; there is no build to advance.
        </p>
      )}

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="eyebrow">The order</h2>
          <dl className="mt-4">
            <Row label="Placed">{dateFormat.format(order.createdAt)}</Row>
            <Row label="Buyer">
              {order.name ?? "—"}
              {order.email && (
                <>
                  {" · "}
                  <a href={`mailto:${order.email}`} className="font-mono text-sm underline hover:text-accent">
                    {order.email}
                  </a>
                </>
              )}
            </Row>
            {/* Charged vs settled are different currencies under Adaptive Currency. Label both; never mix them. */}
            <Row label="Charged">
              {order.amountCents === null ? "—" : formatMoney(order.amountCents, order.currency ?? BASE_CURRENCY)}
            </Row>
            <Row label="Settles to us">
              {order.settlementAmountCents === null
                ? "—"
                : formatMoney(order.settlementAmountCents, order.settlementCurrency ?? BASE_CURRENCY)}
            </Row>
            <Row label="Confirmation emails">
              {order.emailed ? "both sent" : "⚠ incomplete — check the buyer heard from us"}
            </Row>
            <Row label="Payment id">
              <span className="select-all font-mono text-sm text-mist">{order.paymentId}</span>
            </Row>
            <Row label="Dodo product">
              <span className="select-all font-mono text-sm text-mist">{order.productId ?? "—"}</span>
            </Row>
            <Row label="Buyer's own page">
              {buyerLink ? (
                <a href={buyerLink} className="font-mono text-sm underline hover:text-accent" rel="noreferrer">
                  what they see →
                </a>
              ) : (
                <span className="text-sm text-mist">
                  needs <code className="font-mono">ORDER_LINK_SECRET</code>
                </span>
              )}
            </Row>
          </dl>

          {order.metadata != null && (
            <details className="mt-6 border border-line bg-ink-2 p-4">
              <summary className="cursor-pointer font-mono text-sm text-mist">Raw Dodo metadata</summary>
              <pre className="mt-3 overflow-x-auto font-mono text-xs text-mist">
                {JSON.stringify(order.metadata, null, 2)}
              </pre>
            </details>
          )}
        </div>

        <div className="flex flex-col gap-10">
          <section>
            <h2 className="eyebrow">Where it&apos;s at</h2>
            <div className="mt-5">
              <OrderTimeline status={order.status} />
            </div>
          </section>

          <section>
            <h2 className="eyebrow">Move it</h2>
            {/*
              One button per status rather than a dropdown: nothing to mis-read,
              and the list comes from ADMIN_SETTABLE_STATUSES, which is also what
              the action validates against — so the UI can never offer a status
              the server would reject. `refunded` is deliberately absent: the
              webhook owns it.
            */}
            {order.status === "refunded" ? (
              <p className="mt-4 text-sm text-mist">
                Refunded by Dodo. Nothing to move — this status is set by the refund webhook, not from here.
              </p>
            ) : (
              <>
                <form action={setOrderStatus} className="mt-4 flex flex-wrap gap-2">
                  <input type="hidden" name="reference" value={order.reference ?? ""} />
                  {ADMIN_SETTABLE_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="submit"
                      name="status"
                      value={s}
                      disabled={s === order.status}
                      className="inline-flex min-h-11 items-center rounded-full border border-line px-4 font-mono text-sm transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:border-accent disabled:bg-accent disabled:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </form>
                <p className="mt-3 text-sm text-mist">
                  The buyer&apos;s own order page reflects this immediately. Refunds arrive on their own, from
                  Dodo&apos;s webhook.
                </p>
              </>
            )}
          </section>

          <section>
            <h2 className="eyebrow">Internal note</h2>
            <form action={setOrderNote} className="mt-4 flex flex-col gap-3">
              <input type="hidden" name="reference" value={order.reference ?? ""} />
              <textarea
                name="notes"
                rows={6}
                maxLength={2000}
                defaultValue={order.notes ?? ""}
                placeholder="Domain, who has the content, what's blocking it…"
                className="w-full border border-line bg-ink-2 p-3 font-mono text-sm text-paper outline-none transition-colors placeholder:text-paper/25 focus:border-accent"
              />
              <button type="submit" className="btn btn-ghost self-start">
                Save note
              </button>
            </form>
            <p className="mt-3 text-sm text-mist">Only visible here. Never shown to the buyer.</p>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
