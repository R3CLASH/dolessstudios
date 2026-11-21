import type { Metadata } from "next";
import Link from "next/link";
import { getSolution } from "@/lib/content";
import { BASE_CURRENCY, formatMoney } from "@/lib/money";
import { requireAdmin } from "@/lib/adminSession";
import {
  ORDER_STATUSES,
  databaseConfigured,
  listOrders,
  newLeadCount,
  orderStatusCounts,
  type OrderStatus,
} from "@/lib/adminData";
import { AdminShell, NoDatabase, StatusPill } from "@/components/admin/AdminShell";

/** The build queue. Newest first, filterable by status through a plain query param. */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

function isOrderStatus(v: string | undefined): v is OrderStatus {
  return !!v && (ORDER_STATUSES as readonly string[]).includes(v);
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();

  const { status } = await searchParams;
  const filter = isOrderStatus(status) ? status : undefined;

  const [orders, counts, leads] = await Promise.all([listOrders(filter), orderStatusCounts(), newLeadCount()]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  /**
   * Refunded and cancelled orders are excluded: emailed is a worklist flag for
   * "did the buyer hear from us about their build", and chasing someone whose
   * payment was reversed about a confirmation email is the wrong action.
   */
  const unemailed = orders.filter((o) => !o.emailed && o.status !== "refunded" && o.status !== "cancelled").length;

  return (
    <AdminShell current="orders" badges={{ leads }}>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="display heavy text-[clamp(1.8rem,5vw,2.6rem)]">Orders</h1>
        <p className="font-mono text-sm text-mist">
          {total} {total === 1 ? "order" : "orders"}
        </p>
      </div>

      {/* Filter chips. Plain links, so this needs no client JS and no state. */}
      <nav className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`inline-flex min-h-9 items-center rounded-full border px-3 font-mono text-xs transition-colors ${
            filter ? "border-line text-mist hover:text-paper" : "border-accent bg-accent text-ink"
          }`}
        >
          all {total}
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`inline-flex min-h-9 items-center rounded-full border px-3 font-mono text-xs transition-colors ${
              filter === s ? "border-accent bg-accent text-ink" : "border-line text-mist hover:text-paper"
            }`}
          >
            {s} {counts[s] ?? 0}
          </Link>
        ))}
      </nav>

      {!databaseConfigured() ? (
        <div className="mt-8">
          <NoDatabase />
        </div>
      ) : orders.length === 0 ? (
        <p className="mt-8 border border-line bg-ink-2 p-5 text-mist">
          {filter ? `No orders with status "${filter}".` : "No orders yet."}
        </p>
      ) : (
        <>
          {unemailed > 0 && (
            <p className="mt-8 border border-accent/40 bg-accent/5 p-4 text-sm">
              <strong className="font-semibold">{unemailed}</strong>{" "}
              {unemailed === 1 ? "order" : "orders"} below did not get both confirmation emails out. Worth checking
              the buyer actually heard from us.
            </p>
          )}

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[56rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line font-mono text-xs uppercase tracking-[0.1em] text-mist">
                  <th scope="col" className="py-3 pr-4 font-normal">Placed</th>
                  <th scope="col" className="py-3 pr-4 font-normal">Reference</th>
                  <th scope="col" className="py-3 pr-4 font-normal">Product</th>
                  <th scope="col" className="py-3 pr-4 font-normal">Buyer</th>
                  <th scope="col" className="py-3 pr-4 font-normal">Paid</th>
                  <th scope="col" className="py-3 pr-4 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const solution = o.solution ? getSolution(o.solution) : undefined;
                  return (
                    <tr key={o.id} className="border-b border-line align-top hover:bg-ink-2">
                      <td className="py-4 pr-4 font-mono text-sm text-mist">{dateFormat.format(o.createdAt)}</td>
                      <td className="py-4 pr-4">
                        {o.reference ? (
                          <Link href={`/admin/orders/${o.reference}`} className="font-mono text-accent underline-offset-4 hover:underline">
                            {o.reference}
                          </Link>
                        ) : (
                          // Rows written before the reference column existed.
                          <span className="font-mono text-sm text-mist">—</span>
                        )}
                        {!o.emailed && o.status !== "refunded" && o.status !== "cancelled" && (
                          <span className="ml-2 font-mono text-xs text-accent" title="One or both confirmation emails did not go out">
                            ⚠ email
                          </span>
                        )}
                      </td>
                      <td className="py-4 pr-4">{solution?.title ?? o.solution ?? "—"}</td>
                      <td className="py-4 pr-4">
                        <span className="block">{o.name ?? "—"}</span>
                        {o.email && <span className="block font-mono text-sm text-mist">{o.email}</span>}
                      </td>
                      {/* Always what Dodo charged, never priceCents — an edited catalog price must not rewrite history. */}
                      <td className="py-4 pr-4 font-mono text-sm">
                        {o.amountCents === null ? "—" : formatMoney(o.amountCents, o.currency ?? BASE_CURRENCY)}
                      </td>
                      <td className="py-4 pr-4">
                        <StatusPill status={o.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}
