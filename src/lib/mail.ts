import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { BRIEF_SERVICES, type Inquiry } from "@/lib/inquiry";
import { SOLUTION_WE_NEED, type AddOn, type Solution } from "@/lib/content";
import type { SolutionInquiry } from "@/lib/solutionInquiry";
import { BASE_CURRENCY, formatMoney } from "@/lib/money";

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

/**
 * What both order emails need. Deliberately *not* a Solution plus a price: the
 * amounts are the ones Dodo actually charged, carried through from the webhook
 * payload, because re-deriving them from content.ts would make a later price edit
 * rewrite history on an old order.
 */
export type OrderEmail = {
  paymentId: string;
  solution: Solution | undefined;
  name: string | null;
  email: string | null;
  amountCents: number | null;
  currency: string | null;
  settlementAmountCents: number | null;
  settlementCurrency: string | null;
};

/** "$249", or "-" when the payload didn't carry an amount. */
const charged = (cents: number | null, currency: string | null) =>
  cents === null ? "-" : formatMoney(cents, currency ?? BASE_CURRENCY);

/** The rows both order emails share, so the two can't disagree about the money. */
function orderRows(o: OrderEmail): [string, string][] {
  const rows: [string, string][] = [
    ["Bought", o.solution ? `${o.solution.title} — ${o.solution.vertical}` : "(unknown solution)"],
    ["Charged", charged(o.amountCents, o.currency)],
  ];
  // Only worth a line when Adaptive Currency actually converted something.
  if (o.settlementAmountCents !== null && o.settlementCurrency && o.settlementCurrency !== o.currency) {
    rows.push(["Settles as", charged(o.settlementAmountCents, o.settlementCurrency)]);
  }
  if (o.solution) rows.push(["Turnaround", o.solution.turnaround]);
  return rows;
}

/**
 * Tells the studio a site has been paid for. This inbox is the build queue —
 * there's no admin UI — so the next steps are in the body.
 *
 * `unrecorded` is the bad day: the payment is real and verified but the row
 * didn't land, so the email is the only trace. It still returns normally,
 * because the webhook must answer 200 either way.
 */
export async function sendOrderNotificationEmail(o: OrderEmail, opts?: { unrecorded?: boolean }): Promise<boolean> {
  const transport = getTransport();
  if (!transport) {
    console.error("[order] SMTP not set; paid order not emailed to the studio", o.paymentId);
    return false;
  }

  const who = o.name || o.email || "someone";
  const rows: [string, string][] = [
    ["Name", o.name || "-"],
    ["Email", o.email || "-"],
    ...orderRows(o),
    ["Payment id", o.paymentId],
  ];
  const next = o.solution
    ? [
        `Ask for: ${SOLUTION_WE_NEED.join("; ")}`,
        `Build the ${o.solution.title} on their domain and hand it over`,
        "Mark the order delivered when it's live",
      ]
    : ["Work out which solution this was from the payment id in the Dodo dashboard"];

  const warning = opts?.unrecorded
    ? "The payment is verified but the orders row did NOT save. Reconcile this by hand from the Dodo dashboard."
    : null;

  try {
    await transport.sendMail({
      from: from(),
      to: to(),
      ...(o.email ? { replyTo: { name: o.name || o.email, address: o.email } } : {}),
      subject: `${opts?.unrecorded ? "PAID (UNRECORDED) · " : "PAID · "}${o.solution?.vertical ?? "Off the shelf"} site — ${who}`,
      text:
        (warning ? `${warning}\n\n` : "") +
        `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nNext:\n${next.map((n) => `  • ${n}`).join("\n")}\n`,
      html:
        (warning
          ? `<p style="font-family:system-ui,sans-serif;font-size:15px;color:#b00;margin:0 0 16px"><strong>${esc(warning)}</strong></p>`
          : "") +
        rowsTable(rows) +
        `<p style="font-family:system-ui,sans-serif;font-size:14px;color:#666;margin:20px 0 6px">Next:</p>` +
        `<ul style="font-family:system-ui,sans-serif;font-size:14px;margin:0;padding-left:18px">${next
          .map((n) => `<li>${esc(n)}</li>`)
          .join("")}</ul>`,
    });
    return true;
  } catch (err) {
    console.error("[order] studio email failed", err);
    return false;
  }
}

/**
 * Confirms the purchase to the buyer. The one sender that writes to someone other
 * than the studio inbox, so it returns early rather than emailing nobody.
 *
 * Explicitly not a tax invoice: Dodo is merchant of record and sends its own
 * receipt. Saying so here stops anyone filing this as one.
 */
export async function sendOrderConfirmationEmail(o: OrderEmail): Promise<boolean> {
  if (!o.email) {
    console.error("[order] no customer email on the payload; confirmation not sent", o.paymentId);
    return false;
  }
  const transport = getTransport();
  if (!transport) {
    console.error("[order] SMTP not set; confirmation not emailed", o.email);
    return false;
  }

  const rows = orderRows(o);
  const intro = `Thanks ${o.name || "very much"} — that's booked, and your build slot is reserved.`;
  const closing =
    "Dodo Payments handles the payment and will email you its own receipt — this note isn't a tax invoice.";

  try {
    await transport.sendMail({
      from: from(),
      to: o.email,
      replyTo: to(),
      subject: `Your ${o.solution?.vertical ?? "new"} site is booked`,
      text:
        `${intro}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n` +
        `To get started we need three things:\n${SOLUTION_WE_NEED.map((n) => `  • ${n}`).join("\n")}\n\n` +
        `Just reply to this email with them.\n\n${closing}\n`,
      html:
        `<p style="font-family:system-ui,sans-serif;font-size:15px;margin:0 0 16px">${esc(intro)}</p>` +
        rowsTable(rows) +
        `<p style="font-family:system-ui,sans-serif;font-size:14px;color:#666;margin:20px 0 6px">To get started we need three things:</p>` +
        `<ul style="font-family:system-ui,sans-serif;font-size:14px;margin:0;padding-left:18px">${SOLUTION_WE_NEED.map(
          (n) => `<li>${esc(n)}</li>`,
        ).join("")}</ul>` +
        `<p style="font-family:system-ui,sans-serif;font-size:15px;margin:16px 0 0">Just reply to this email with them.</p>` +
        `<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;margin:20px 0 0">${esc(closing)}</p>`,
    });
    return true;
  } catch (err) {
    console.error("[order] confirmation email failed", err);
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
