import "server-only";
import { and, count, desc, eq, like, notInArray } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { Inquiry, Order } from "@/db/schema";

/**
 * Every read behind /admin.
 *
 * Same contract as the read helpers in orders.ts: tolerate getDb() returning
 * null, never throw, log and return an empty result instead. A dashboard that
 * 500s because the database blinked is worse than one that says it can't see
 * anything right now.
 */

export type OrderStatus = Order["status"];
export type InquiryStatus = Inquiry["status"];

/** Straight off the pgEnum, so the UI can never offer a status the column rejects. */
export const ORDER_STATUSES = schema.orderStatus.enumValues;
export const INQUIRY_STATUSES = schema.inquiryStatus.enumValues;

/**
 * The statuses /admin is allowed to set, which is NOT the whole enum.
 *
 * **`refunded` is missing on purpose.** It is owned by markOrderRefunded() in
 * lib/orders.ts, driven by Dodo's refund.succeeded webhook. A human setting it
 * by hand would put our row at odds with the payment processor — and it would
 * be invisible, because the row would look exactly like a real refund.
 *
 * `paid` stays so a mis-click is reversible, and `cancelled` is genuinely ours:
 * it means we are not building it, which Dodo knows nothing about.
 *
 * Lives here rather than in the actions module because a "use server" file may
 * only export async functions — exporting an array from one is a runtime error
 * that typecheck does not catch.
 */
export const ADMIN_SETTABLE_STATUSES = ["paid", "building", "delivered", "cancelled"] as const;

export type AdminSettableStatus = (typeof ADMIN_SETTABLE_STATUSES)[number];

/** The prefix actions.ts writes to inquiries.source for every off-the-shelf lead. */
const OFF_THE_SHELF_SOURCE = "off-the-shelf:%";

export async function listOrders(status?: OrderStatus): Promise<Order[]> {
  try {
    const db = getDb();
    if (!db) return [];
    return await db
      .select()
      .from(schema.orders)
      .where(status ? eq(schema.orders.status, status) : undefined)
      .orderBy(desc(schema.orders.createdAt))
      .limit(500);
  } catch (err) {
    console.error("[admin] listing orders failed", err);
    return [];
  }
}

export async function listLeads(status?: InquiryStatus): Promise<Inquiry[]> {
  try {
    const db = getDb();
    if (!db) return [];
    const rows = await db
      .select()
      .from(schema.inquiries)
      .where(like(schema.inquiries.source, OFF_THE_SHELF_SOURCE))
      .orderBy(desc(schema.inquiries.createdAt))
      .limit(500);
    // Filtered here rather than in SQL to keep one `where` and avoid an and()
    // over a LIKE — the row count this page deals with makes it moot.
    return status ? rows.filter((r) => r.status === status) : rows;
  } catch (err) {
    console.error("[admin] listing leads failed", err);
    return [];
  }
}

/** Row counts per status, for the filter chips. Unfiltered on purpose. */
export async function orderStatusCounts(): Promise<Partial<Record<OrderStatus, number>>> {
  try {
    const db = getDb();
    if (!db) return {};
    const rows = await db
      .select({ status: schema.orders.status, n: count() })
      .from(schema.orders)
      .groupBy(schema.orders.status);
    return Object.fromEntries(rows.map((r) => [r.status, Number(r.n)]));
  } catch (err) {
    console.error("[admin] counting orders failed", err);
    return {};
  }
}

/**
 * Orders whose two emails did not both go out. orders.emailed is only set when
 * both really succeeded, so this is a genuine worklist rather than a column
 * that always reads true — worth putting in front of a human.
 */
export async function unemailedOrderCount(): Promise<number> {
  try {
    const db = getDb();
    if (!db) return 0;
    const rows = await db
      .select({ n: count() })
      .from(schema.orders)
      // Same scope as the orders page: a reversed payment is not someone to chase.
      .where(and(eq(schema.orders.emailed, false), notInArray(schema.orders.status, ["refunded", "cancelled"])));
    return Number(rows[0]?.n ?? 0);
  } catch (err) {
    console.error("[admin] counting unemailed orders failed", err);
    return 0;
  }
}

export async function newLeadCount(): Promise<number> {
  try {
    const db = getDb();
    if (!db) return 0;
    const rows = await db
      .select({ n: count() })
      .from(schema.inquiries)
      // Scoped to off-the-shelf: the bespoke contact-form briefs land in the
      // same table with status 'new' too, and this dashboard isn't about them.
      .where(and(eq(schema.inquiries.status, "new"), like(schema.inquiries.source, OFF_THE_SHELF_SOURCE)));
    return Number(rows[0]?.n ?? 0);
  } catch (err) {
    console.error("[admin] counting new leads failed", err);
    return 0;
  }
}

/** True when there is no database configured at all, so pages can say so plainly. */
export function databaseConfigured(): boolean {
  return getDb() !== null;
}
