import Link from "next/link";
import { logout } from "@/app/(admin)/admin/actions";

/**
 * The chrome every signed-in admin page sits in. Not in the root layout,
 * because the login page shares that layout and must not show a nav or a
 * sign-out button.
 *
 * Plain <a>/<Link> with no transition wrapper: this is outside (site), so
 * trap #1 does not apply here and no data-no-transition is needed.
 */

export function AdminShell({
  children,
  current,
  badges,
}: {
  children: React.ReactNode;
  current: "orders" | "leads";
  badges?: { orders?: number; leads?: number };
}) {
  const tab = (key: "orders" | "leads", label: string, badge?: number) => (
    <Link
      key={key}
      href={`/admin/${key}`}
      aria-current={current === key ? "page" : undefined}
      className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-1 font-mono text-sm transition-colors ${
        current === key ? "border-accent text-paper" : "border-transparent text-mist hover:text-paper"
      }`}
    >
      {label}
      {badge ? (
        <span className="rounded-full bg-accent px-2 py-0.5 font-sans text-[0.7rem] font-semibold text-ink">
          {badge}
        </span>
      ) : null}
    </Link>
  );

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line">
        <div className="wrap flex flex-wrap items-center gap-x-8 gap-y-3 py-5">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-mist">Do Less · admin</span>
          <nav className="flex items-center gap-6">
            {tab("orders", "Orders", badges?.orders)}
            {tab("leads", "Leads", badges?.leads)}
          </nav>
          <form action={logout} className="ml-auto">
            <button type="submit" className="min-h-11 font-mono text-sm text-mist hover:text-paper">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="wrap py-10">{children}</main>
    </div>
  );
}

/** A status pill. Colour carries meaning, the word carries it too. */
export function StatusPill({ status }: { status: string }) {
  const tone: Record<string, string> = {
    paid: "border-accent text-accent",
    building: "border-lime text-lime",
    delivered: "border-teal text-teal",
    refunded: "border-line text-mist",
    cancelled: "border-line text-mist",
    new: "border-accent text-accent",
    replied: "border-violet text-violet",
    won: "border-teal text-teal",
    lost: "border-line text-mist",
    spam: "border-line text-mist",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs ${
        tone[status] ?? "border-line text-mist"
      }`}
    >
      {status}
    </span>
  );
}

/** Shown wherever a page would otherwise render a confidently empty table. */
export function NoDatabase() {
  return (
    <p className="border border-line bg-ink-2 p-5 text-mist">
      No <code className="font-mono text-paper">DATABASE_URL</code> is set, so there is nothing to read. Orders are
      still being emailed to the studio inbox.
    </p>
  );
}
