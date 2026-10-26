import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { BRIEF_SERVICES, type Inquiry } from "@/lib/inquiry";

const globalForMail = globalThis as unknown as { __dlsMail?: Transporter };

/**
 * One SMTP transport per server process. Returns null when SMTP isn't configured,
 * so the form can say so instead of pretending the brief was sent.
 */
function getTransport(): Transporter | null {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (!globalForMail.__dlsMail) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    globalForMail.__dlsMail = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return globalForMail.__dlsMail;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Emails a new brief to the studio inbox. Reply-to is the person who sent it. Returns false if it wasn't sent. */
export async function sendInquiryEmail(d: Inquiry, source: string): Promise<boolean> {
  const transport = getTransport();
  if (!transport) {
    console.error("[inquiry] SMTP_HOST / SMTP_USER / SMTP_PASS not set; brief not emailed", d.email);
    return false;
  }

  const services = d.services.map((v) => BRIEF_SERVICES.find((s) => s.v === v)?.l ?? v).join(", ");
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Company", d.company || "-"],
    ["Help with", services],
    ["Timeline", d.timeline || "-"],
    ["Source", source],
  ];
  const who = d.company ? `${d.name} (${d.company})` : d.name;

  try {
    await transport.sendMail({
      from: process.env.CONTACT_FROM_EMAIL || `Do Less Studios <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO_EMAIL || "thavishamudunkotuwa1998@gmail.com",
      replyTo: { name: d.name, address: d.email },
      subject: `New brief from ${who}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nThe boring part they want gone:\n${d.message}\n`,
      html: `<table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">${rows
        .map(([k, v]) => `<tr><td style="color:#666;vertical-align:top">${k}</td><td><strong>${esc(v)}</strong></td></tr>`)
        .join("")}</table><p style="font-family:system-ui,sans-serif;font-size:14px;color:#666;margin:20px 0 6px">The boring part they want gone:</p><p style="font-family:system-ui,sans-serif;font-size:15px;white-space:pre-wrap;margin:0">${esc(d.message)}</p>`,
    });
    return true;
  } catch (err) {
    console.error("[inquiry] email failed", err);
    return false;
  }
}
