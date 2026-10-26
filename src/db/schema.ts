import { pgTable, uuid, text, timestamp, pgEnum, index } from "drizzle-orm/pg-core";

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

export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
