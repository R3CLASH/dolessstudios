import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { BRIEF_SERVICES, type Inquiry } from "@/lib/inquiry";
import type { AddOn, Solution } from "@/lib/content";
import type { SolutionInquiry } from "@/lib/solutionInquiry";
import { formatMoney } from "@/lib/money";

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

const from = () => process.env.CONTACT_FROM_EMAIL || `Do Less Studios <${process.env.SMTP_USER}>`;
const to = () => process.env.CONTACT_TO_EMAIL || "thavishamudunkotuwa1998@gmail.com";

/** The key/value table every studio notification uses. Values are escaped here. */
const rowsTable = (rows: [string, string][]) =>
  `<table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#666;vertical-align:top">${k}</td><td><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table>`;

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
      from: from(),
      to: to(),
      replyTo: { name: d.name, address: d.email },
      subject: `New brief from ${who}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nThe boring part they want gone:\n${d.message}\n`,
      html: `${rowsTable(rows)}<p style="font-family:system-ui,sans-serif;font-size:14px;color:#666;margin:20px 0 6px">The boring part they want gone:</p><p style="font-family:system-ui,sans-serif;font-size:15px;white-space:pre-wrap;margin:0">${esc(d.message)}</p>`,
    });
    return true;
  } catch (err) {
    console.error("[inquiry] email failed", err);
    return false;
  }
}

/**
 * Emails an off-the-shelf quote request to the studio. The totals are passed in
 * already recomputed server-side from the catalog — never from the browser.
 */
export async function sendSolutionInquiryEmail(
  d: SolutionInquiry,
  ctx: { solution: Solution; addOns: AddOn[]; oneOff: number; monthly: number },
): Promise<boolean> {
  const transport = getTransport();
  if (!transport) {
    console.error("[off-the-shelf] SMTP not set; quote request not emailed", d.email);
    return false;
  }

  const { solution, addOns, oneOff, monthly } = ctx;
  const estimate = `${formatMoney(oneOff)} one-off${monthly ? ` + ${formatMoney(monthly)}/mo` : ""}`;
  const who = d.company ? `${d.name} (${d.company})` : d.name;
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Company", d.company || "-"],
    ["Wants", `${solution.title} — ${solution.vertical}`],
    ["As-is price", formatMoney(solution.priceCents)],
    ["Add-ons", addOns.length ? String(addOns.length) : "none (wants it as-is)"],
    ["Estimate", `${estimate} (est.)`],
    ["Turnaround", solution.turnaround],
    ["Timeline", d.timeline || "-"],
  ];

  const addOnLines = addOns.length
    ? addOns
        .map((a) => `  • ${a.name} — ${formatMoney(a.priceCents)}${a.monthlyCents ? ` + ${formatMoney(a.monthlyCents)}/mo` : ""}`)
        .join("\n")
    : "  (none)";

  try {
    await transport.sendMail({
      from: from(),
      to: to(),
      replyTo: { name: d.name, address: d.email },
      subject: addOns.length
        ? `Off the shelf: ${solution.title} + ${addOns.length} add-on${addOns.length === 1 ? "" : "s"} — ${who}`
        : `Off the shelf: ${solution.title} as-is — ${who}`,
      text:
        `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nAdd-ons they picked:\n${addOnLines}\n` +
        (d.message ? `\nWhat they said:\n${d.message}\n` : ""),
      html:
        rowsTable(rows) +
        `<p style="font-family:system-ui,sans-serif;font-size:14px;color:#666;margin:20px 0 6px">Add-ons they picked:</p>` +
        (addOns.length
          ? `<ul style="font-family:system-ui,sans-serif;font-size:14px;margin:0;padding-left:18px">${addOns
              .map(
                (a) =>
                  `<li><strong>${esc(a.name)}</strong> — ${esc(formatMoney(a.priceCents))}${
                    a.monthlyCents ? ` + ${esc(formatMoney(a.monthlyCents))}/mo` : ""
                  }</li>`,
              )
              .join("")}</ul>`
          : `<p style="font-family:system-ui,sans-serif;font-size:15px;margin:0">None — they want it as-is.</p>`) +
        (d.message
          ? `<p style="font-family:system-ui,sans-serif;font-size:14px;color:#666;margin:20px 0 6px">What they said:</p><p style="font-family:system-ui,sans-serif;font-size:15px;white-space:pre-wrap;margin:0">${esc(
              d.message,
            )}</p>`
          : ""),
    });
    return true;
  } catch (err) {
    console.error("[off-the-shelf] email failed", err);
    return false;
  }
}

/** Emails a newsletter sign-up to the studio inbox. Returns false if it wasn't sent. */
export async function sendSubscriberEmail(email: string): Promise<boolean> {
  const transport = getTransport();
  if (!transport) {
    console.error("[subscribe] SMTP_HOST / SMTP_USER / SMTP_PASS not set; sign-up not emailed", email);
    return false;
  }

  try {
    await transport.sendMail({
      from: from(),
      to: to(),
      replyTo: email,
      subject: `New newsletter sign-up: ${email}`,
      text: `${email} signed up for the newsletter.\n`,
      html: `<p style="font-family:system-ui,sans-serif;font-size:14px"><strong>${esc(email)}</strong> signed up for the newsletter.</p>`,
    });
    return true;
  } catch (err) {
    console.error("[subscribe] email failed", err);
    return false;
  }
}
