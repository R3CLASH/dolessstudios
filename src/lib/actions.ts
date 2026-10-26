"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { fieldErrors, readInquiry } from "@/lib/inquiry";
import { sendInquiryEmail, sendSubscriberEmail } from "@/lib/mail";

export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  name?: string;
};

// Very small in-memory rate limit per IP (per server instance).
const hits = new Map<string, number[]>();
function limited(ip: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > max;
}

async function clientIp() {
  const h = await headers();
  // x-viewer-ip is set by CloudFront (infra/cdn.tf) and can't be spoofed through it; x-forwarded-for can.
  return h.get("x-viewer-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function submitInquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: real people never fill this.
  if (String(formData.get("website") ?? "").length > 0) {
    return { ok: true, message: "Thanks!" };
  }

  const parsed = readInquiry(formData);
  if (!parsed.success) {
    return { ok: false, message: "A couple of things need a look.", errors: fieldErrors(parsed.error) };
  }

  // Counted after validation so fixing a typo doesn't use up an attempt.
  if (limited(await clientIp())) {
    return { ok: false, message: "That's a lot of briefs. Give it a few minutes and try again." };
  }

  const d = parsed.data;
  const source = String(formData.get("source") ?? "contact").slice(0, 60);

  // The email is what reaches us; the database row is a backup copy. Either one landing counts as received.
  let stored = false;
  const db = getDb();
  if (db) {
    try {
      await db.insert(schema.inquiries).values({
        name: d.name,
        email: d.email,
        company: d.company || null,
        services: d.services,
        timeline: d.timeline || null,
        message: d.message,
        source,
      });
      stored = true;
    } catch (err) {
      console.error("[inquiry] insert failed", err);
    }
  }
  const emailed = await sendInquiryEmail(d, source);

  if (!emailed && !stored) {
    return { ok: false, message: "Something broke on our side and your brief didn't send. Please try again in a minute." };
  }
  return { ok: true, message: "Added to our to-do list.", name: d.name.split(" ")[0] };
}

const emailSchema = z.email();

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = emailSchema.safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  if (!parsed.success) return { ok: false, message: "That email doesn't look right." };
  if (limited(`sub:${await clientIp()}`, 5)) return { ok: false, message: "Easy. Try again in a bit." };
  // Same as briefs: the email reaches us, the database row is a backup copy, and either one counts.
  let stored = false;
  const db = getDb();
  if (db) {
    try {
      await db.insert(schema.subscribers).values({ email: parsed.data }).onConflictDoNothing();
      stored = true;
    } catch (err) {
      console.error("[subscribe] insert failed", err);
    }
  }
  const emailed = await sendSubscriberEmail(parsed.data);

  if (!emailed && !stored) return { ok: false, message: "Couldn't save that. Try again later." };
  return { ok: true, message: "You're in. We write rarely, on purpose." };
}
