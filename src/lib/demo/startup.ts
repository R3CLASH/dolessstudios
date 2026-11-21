/**
 * Fixture content for the "The Launch" demo — a fictional pre-launch SaaS.
 * Not site copy: this is the stand-in product a prospect clicks around.
 */
export const LAUNCH = {
  name: "Sheetfast",
  tagline: "Stop pasting the same report together every Monday",
  email: "hello@sheetfast.io",
  host: "sheetfast.io",
  waitlistCount: 1_284,
};

export const PROBLEM = [
  { k: "4 hours", v: "a week rebuilding the same spreadsheet" },
  { k: "6 tabs", v: "open just to find three numbers" },
  { k: "1 person", v: "who knows how the formula works" },
];

export const STEPS = [
  { n: "01", title: "Connect", body: "Point Sheetfast at the sheets, databases and tools you already use. Read-only, and you pick exactly what it can see." },
  { n: "02", title: "Describe", body: "Say what the report should show in plain English. No formulas, no query language, no training course." },
  { n: "03", title: "Forget", body: "It rebuilds itself on a schedule and lands in Slack or your inbox. You only hear from it when a number moves." },
];

export const FEATURES = [
  { title: "Plain-English reports", body: "Describe the numbers you want. Sheetfast writes the query and keeps it working when the source changes." },
  { title: "Scheduled delivery", body: "Daily, weekly, or the first working day of the month. Slack, email, or a link that's always current." },
  { title: "Alerts that matter", body: "Set a threshold once. You hear about it when it's crossed, not every time the report runs." },
  { title: "Connects to what you use", body: "Google Sheets, Postgres, Stripe, HubSpot, Xero and a generic CSV drop for everything else." },
  { title: "Version history", body: "Every report keeps its past runs, so you can see what the number was before someone changed the formula." },
  { title: "Read-only by design", body: "Sheetfast can't write back to your systems. The worst it can do is show you a number." },
];

export type Plan = {
  name: string;
  price: string;
  per: string;
  line: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    name: "Solo",
    price: "$0",
    per: "forever",
    line: "For one person with three reports and a grudge against Mondays.",
    features: ["3 scheduled reports", "2 connected sources", "Email delivery", "7 days of history"],
    cta: "Start free",
  },
  {
    name: "Team",
    price: "$39",
    per: "per month",
    line: "For the team that keeps asking one person for the numbers.",
    features: ["Unlimited reports", "10 connected sources", "Slack + email delivery", "Alerts on any metric", "12 months of history", "5 seats included"],
    cta: "Join the waitlist",
    featured: true,
  },
  {
    name: "Company",
    price: "$129",
    per: "per month",
    line: "For when finance, sales and ops all want their own version.",
    features: ["Everything in Team", "Unlimited sources and seats", "SSO and audit log", "Custom data retention", "Priority support"],
    cta: "Talk to us",
  },
];

export const FAQ = [
  { q: "When does it launch?", a: "The private beta is running now with about forty teams. Public launch is planned for Q2 — join the waitlist and you'll get in before then." },
  { q: "Can it write to my data?", a: "No, and that's deliberate. Sheetfast connects read-only. The worst thing it can do is show you a number you didn't expect." },
  { q: "What happens to the free plan at launch?", a: "It stays free. Three reports and two sources, forever, no card. We'd rather you try it than read about it." },
  { q: "Do you support my database?", a: "Postgres, MySQL and BigQuery today. If you're on something else, tell us when you join the waitlist — it genuinely affects what we build next." },
];

export const LOGOS = ["northwind", "acme co", "lumen", "brightly", "parcel", "kanso"];

export const ROLES = ["Founder", "Operations", "Finance", "Sales", "Data / analytics", "Something else"];
export const SOURCES = ["Google Sheets", "Postgres", "Stripe", "HubSpot", "Xero", "BigQuery", "Something else"];
