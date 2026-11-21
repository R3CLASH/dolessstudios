import { pgTable, uuid, text, timestamp, pgEnum, index, integer, boolean, jsonb } from "drizzle-orm/pg-core";

export const inquiryStatus = pgEnum("inquiry_status", ["new", "replied", "won", "lost", "spam"]);

/** Project briefs sent from the contact page. */
export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    services: text("services").array().notNull().default([]),
    budget: text("budget"),
    timeline: text("timeline"),
    message: text("message").notNull(),
    source: text("source"),
    /** Off-the-shelf leads only: which solution they want (a SolutionSlug). */
    solution: text("solution"),
    /** Off-the-shelf leads only: the AddOn ids they picked. */
    addons: text("addons").array().notNull().default([]),
    status: inquiryStatus("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("inquiries_created_at_idx").on(t.createdAt), index("inquiries_status_idx").on(t.status)],
);

/** "Lazy letter" newsletter sign-ups from the footer. */
export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderStatus = pgEnum("order_status", ["paid", "building", "delivered", "refunded", "cancelled"]);

/**
 * One row per paid off-the-shelf site. There is no admin UI: this table plus the
 * studio notification email is the build queue (see README).
 *
 * The money columns record what Dodo actually charged, never what content.ts says
 * the price is. If a price is edited later, old orders keep telling the truth, and
 * price drift stays a marketing problem instead of a billing dispute.
 */
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /**
     * Dodo's payment id, and the idempotency key for the whole webhook path.
     * UNIQUE is what makes a replayed event a no-op instead of a second build
     * slot and a second pair of emails.
     */
    paymentId: text("payment_id").notNull().unique(),
    /** A SolutionSlug. Loose text like inquiries.solution — validated in app code, not the DB. */
    solution: text("solution"),
    productId: text("product_id"),
    name: text("name"),
    email: text("email"),
    /** What the buyer was charged, in minor units of `currency`. */
    amountCents: integer("amount_cents"),
    currency: text("currency"),
    /** What lands in our Dodo balance after conversion — differs under Adaptive Currency. */
    settlementAmountCents: integer("settlement_amount_cents"),
    settlementCurrency: text("settlement_currency"),
    /** The raw metadata Dodo echoed back, kept for reconciliation. */
    metadata: jsonb("metadata"),
    status: orderStatus("status").notNull().default("paid"),
    /** Set once both order emails have been attempted, so a failure is visible in SQL. */
    emailed: boolean("emailed").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("orders_created_at_idx").on(t.createdAt),
    index("orders_status_idx").on(t.status),
    index("orders_email_idx").on(t.email),
  ],
);

export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
