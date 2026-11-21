"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { ADMIN_SETTABLE_STATUSES, type AdminSettableStatus } from "@/lib/adminData";
import {
  ADMIN_COOKIE,
  checkPassword,
  createSession,
  requireAdmin,
  requireConfigured,
  sessionCookieOptions,
} from "@/lib/adminSession";
import { clientIp, limited } from "@/lib/ratelimit";

/**
 * Everything /admin can change.
 *
 * Two shapes to keep:
 *
 * - **requireAdmin() first, always.** The check lives next to the write, not in
 *   a proxy matcher that a new route could miss.
 * - **No revalidatePath/revalidateTag** (trap #5): open-next.config.ts runs
 *   tagCache "dummy" with disableTagCache, so the cache those APIs drive isn't
 *   there. Every mutation ends in redirect() instead, and because the admin
 *   pages are force-dynamic and no-store, that redirect re-reads Postgres.
 *   There is no cache to invalidate in the first place.
 *
 * redirect() signals by throwing, so no redirect may sit inside a try block —
 * the catch would swallow it. Writes happen in the small helpers below, which
 * return a boolean, and the redirect is always the last statement.
 */

const referenceSchema = z.string().regex(/^DLS-[0-9A-HJKMNP-TV-Z]{8}$/);

/** Narrowed to what /admin may set: the webhook owns `refunded`. See adminData.ts. */
const orderStatusSchema = z.enum(ADMIN_SETTABLE_STATUSES);
const inquiryStatusSchema = z.enum(schema.inquiryStatus.enumValues);
const idSchema = z.string().uuid();
/** Long enough for a real handover note, short enough not to be a text dump. */
const noteSchema = z.string().trim().max(2000);

type OrderStatusValue = AdminSettableStatus;
type InquiryStatusValue = (typeof schema.inquiryStatus.enumValues)[number];

async function patchOrder(reference: string, patch: { status?: OrderStatusValue; notes?: string | null }) {
  try {
    const db = getDb();
    if (!db) return false;
    await db.update(schema.orders).set(patch).where(eq(schema.orders.reference, reference));
    return true;
  } catch (err) {
    console.error("[admin] order write failed", reference, err);
    return false;
  }
}

/**
 * A refunded order is settled history: Dodo reversed the payment, so there is
 * no build to move along. Guarding the status write here as well as narrowing
 * the enum above means a refunded row can't be quietly walked back to `paid`
 * and re-entered into the queue.
 *
 * Returns the blocking status, or null when the write may proceed.
 */
async function refundedGuard(reference: string): Promise<OrderStatusValue | "refunded" | null> {
  try {
    const db = getDb();
    if (!db) return null;
    const rows = await db
      .select({ status: schema.orders.status })
      .from(schema.orders)
      .where(eq(schema.orders.reference, reference))
      .limit(1);
    return rows[0]?.status === "refunded" ? "refunded" : null;
  } catch (err) {
    // Can't tell: let the write attempt decide rather than refusing on a read error.
    console.error("[admin] could not read status before writing", reference, err);
    return null;
  }
}

async function patchInquiry(id: string, patch: { status?: InquiryStatusValue; notes?: string | null }) {
  try {
    const db = getDb();
    if (!db) return false;
    await db.update(schema.inquiries).set(patch).where(eq(schema.inquiries.id, id));
    return true;
  } catch (err) {
    console.error("[admin] lead write failed", id, err);
    return false;
  }
}

// ── auth ─────────────────────────────────────────────────────────────────────

export async function login(formData: FormData) {
  requireConfigured();

  // Per-IP and in-memory, so it forgets on a cold start and counts two warm
  // Lambda instances separately — it blunts a script, it is not brute-force
  // protection. A 24-byte random ADMIN_PASSWORD is what actually protects this.
  const ip = await clientIp();
  if (limited(`admin:${ip}`, 5, 10 * 60 * 1000)) redirect("/admin/login?e=rate");

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) redirect("/admin/login?e=bad");

  const session = createSession();
  if (!session) redirect("/admin/login?e=bad");

  (await cookies()).set(ADMIN_COOKIE, session, sessionCookieOptions());
  redirect("/admin/orders");
}

export async function logout() {
  // The path must match the one it was set with, or the delete misses.
  (await cookies()).delete({ name: ADMIN_COOKIE, path: sessionCookieOptions().path });
  redirect("/admin/login");
}

// ── orders ───────────────────────────────────────────────────────────────────

export async function setOrderStatus(formData: FormData) {
  await requireAdmin();

  const reference = referenceSchema.safeParse(formData.get("reference"));
  const status = orderStatusSchema.safeParse(formData.get("status"));
  if (!reference.success || !status.success) redirect("/admin/orders?e=bad");

  if (await refundedGuard(reference.data)) redirect(`/admin/orders/${reference.data}?e=refunded`);

  const ok = await patchOrder(reference.data, { status: status.data });
  redirect(`/admin/orders/${reference.data}${ok ? "" : "?e=write"}`);
}

export async function setOrderNote(formData: FormData) {
  await requireAdmin();

  const reference = referenceSchema.safeParse(formData.get("reference"));
  const note = noteSchema.safeParse(formData.get("notes") ?? "");
  if (!reference.success || !note.success) redirect("/admin/orders?e=bad");

  // Empty means no note, not an empty string.
  const ok = await patchOrder(reference.data, { notes: note.data || null });
  redirect(`/admin/orders/${reference.data}${ok ? "" : "?e=write"}`);
}

// ── leads ────────────────────────────────────────────────────────────────────

export async function setLeadStatus(formData: FormData) {
  await requireAdmin();

  const id = idSchema.safeParse(formData.get("id"));
  const status = inquiryStatusSchema.safeParse(formData.get("status"));
  if (!id.success || !status.success) redirect("/admin/leads?e=bad");

  const ok = await patchInquiry(id.data, { status: status.data });
  redirect(`/admin/leads${ok ? "" : "?e=write"}`);
}

export async function setLeadNote(formData: FormData) {
  await requireAdmin();

  const id = idSchema.safeParse(formData.get("id"));
  const note = noteSchema.safeParse(formData.get("notes") ?? "");
  if (!id.success || !note.success) redirect("/admin/leads?e=bad");

  const ok = await patchInquiry(id.data, { notes: note.data || null });
  redirect(`/admin/leads${ok ? "" : "?e=write"}`);
}
