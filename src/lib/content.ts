/**
 * All site copy and data lives here so it can be edited in one place.
 * Anything in [square brackets] is a placeholder to replace before launch.
 */

export const SITE = {
  name: "Do Less Studios",
  short: "do less",
  tagline: "We automate. You do less.",
  description:
    "Do Less Studios designs and builds websites, Shopify and WordPress, web apps, and automations that take the repetitive work off your plate.",
  /** Public contact email, shown in the footer, menu, contact page and ⌘K. Empty hides it everywhere. */
  email: "thavisha@dolessstudios.com",
  location: "Sri Lanka",
  timezone: "Asia/Colombo",
  // `||`, not `??`: the first AWS deploy builds with it set but empty (deploy.yml).
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  /** Social links, e.g. { label: "LinkedIn", href: "https://…" }. Hidden everywhere while empty. */
  socials: [] as { label: string; href: string }[],
};

export type NavItem = { href: string; label: string; note: string; key: string };

export const NAV: NavItem[] = [
  { href: "/", label: "Home", note: "start over", key: "1" },
  { href: "/services", label: "Services", note: "the stuff we build", key: "2" },
  { href: "/off-the-shelf", label: "Off the shelf", note: "sites that already exist", key: "3" },
  { href: "/work", label: "Work", note: "proof we do the work", key: "4" },
  { href: "/about", label: "About", note: "why lazy is a method", key: "5" },
  { href: "/contact", label: "Contact", note: "hand us something boring", key: "6" },
];

export type ServiceSlug = "web" | "shopify" | "wordpress" | "web-apps" | "automation";

export type Service = {
  slug: ServiceSlug;
  index: string;
  title: string;
  short: string;
  line: string;
  intro: string;
  deliverables: string[];
  offYourPlate: string[];
  stack: string[];
  faq: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "web",
    index: "01",
    title: "Web design & development",
    short: "Websites",
    line: "Sites that load fast, look sharp and update themselves.",
    intro:
      "We design the site, write the code and wire it to whatever you already use, so publishing a page or updating a price never needs a developer again.",
    deliverables: [
      "UX, wireframes and visual design",
      "Next.js or headless CMS builds",
      "Animation and interaction design",
      "Technical SEO and Core Web Vitals work",
      "CMS setup your team can actually use",
      "Hosting, analytics and launch",
    ],
    offYourPlate: [
      "Emailing a developer to change one sentence",
      "Copying the same content into three places",
      "Guessing why the site is slow",
      "Rebuilding forms every campaign",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "PostgreSQL", "Strapi", "Sanity", "Vercel"],
    faq: [
      { q: "Can I edit the site myself?", a: "Yes. Every site ships with a CMS set up around your content, plus a short walkthrough video." },
      { q: "Do you redesign existing sites?", a: "Often. We audit what works first, keep it, and rebuild the rest." },
    ],
  },
  {
    slug: "shopify",
    index: "02",
    title: "Shopify apps & themes",
    short: "Shopify",
    line: "Custom themes, private apps and the glue between them.",
    intro:
      "Custom Online Store 2.0 themes, public and private Shopify apps, and the integrations that keep orders, stock and customers in sync without anyone copying rows into a spreadsheet.",
    deliverables: [
      "Custom theme design and development",
      "Theme performance and app clean-up",
      "Public and custom Shopify apps",
      "Checkout and Shopify Functions extensions",
      "ERP, 3PL and marketplace integrations",
      "Flow and webhook automations",
    ],
    offYourPlate: [
      "Updating stock by hand across channels",
      "Tagging orders one by one",
      "Paying for five apps that do one job",
      "Merging theme edits by copy and paste",
    ],
    stack: ["Liquid", "Shopify CLI", "Admin GraphQL API", "Polaris", "React Router", "Shopify Functions", "Node.js"],
    faq: [
      { q: "Do you build public apps or private ones?", a: "Both. We build and ship our own Shopify apps too, so we know the review process." },
      { q: "Can you speed up my store?", a: "Usually. Most slow stores carry leftover scripts from apps that were removed months ago." },
    ],
  },
  {
    slug: "wordpress",
    index: "03",
    title: "WordPress plugins & themes",
    short: "WordPress",
    line: "Block themes and plugins written properly, not stacked.",
    intro:
      "Custom block themes, Gutenberg blocks and plugins built to WordPress standards, plus the unglamorous fixes: checkout bugs, form flows and conflicts between plugins that were never meant to meet.",
    deliverables: [
      "Custom block and hybrid themes",
      "Gutenberg block development",
      "Custom plugins and REST endpoints",
      "WooCommerce and Gravity Forms work",
      "Plugin conflict and performance fixes",
      "Migrations and hardening",
    ],
    offYourPlate: [
      "Re-entering form submissions into a CRM",
      "Fighting a page builder for every edit",
      "Updating plugins and hoping",
      "Manually resending failed orders",
    ],
    stack: ["PHP", "Gutenberg", "React", "WooCommerce", "Gravity Forms", "WP-CLI", "ACF"],
    faq: [
      { q: "Can you fix a site someone else built?", a: "Yes. We start with an audit so you know what you have before anything changes." },
      { q: "Do you use page builders?", a: "Only when the client insists. Native blocks are faster and easier to maintain." },
    ],
  },
  {
    slug: "web-apps",
    index: "04",
    title: "Web apps & SaaS",
    short: "Web apps",
    line: "Dashboards, portals and SaaS products, end to end.",
    intro:
      "From a client portal to a full SaaS product: data model, auth, billing, admin and the background jobs that do the heavy lifting while nobody watches.",
    deliverables: [
      "Product and UX design",
      "Full-stack builds with auth and billing",
      "Admin panels and internal tools",
      "Background jobs and queues",
      "Third-party API integrations",
      "Cloud infrastructure and monitoring",
    ],
    offYourPlate: [
      "Running the business from spreadsheets",
      "Exporting CSVs to send to clients",
      "Manual onboarding for every user",
      "Watching long jobs to see if they failed",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Drizzle", "Stripe", "Google Cloud", "AWS"],
    faq: [
      { q: "Can you build an MVP?", a: "Yes, and we scope it hard so the first version ships while it still matters." },
      { q: "Who owns the code?", a: "You do, from the first commit, in your own repository." },
    ],
  },
  {
    slug: "automation",
    index: "05",
    title: "Automation",
    short: "Automation",
    line: "If you do it twice, it should do itself the third time.",
    intro:
      "We find the work your team repeats every week and replace it with scripts, integrations and scheduled jobs. Small wins first, then the big ones.",
    deliverables: [
      "Automation audit of your week",
      "Integrations between the tools you use",
      "Scheduled jobs, scrapers and reports",
      "Document and email processing",
      "AI steps where they actually help",
      "Monitoring so nothing fails silently",
    ],
    offYourPlate: [
      "Copying orders into a spreadsheet",
      "Chasing invoices on Friday afternoon",
      "Building the same report every Monday",
      "Answering 'where is my order?'",
    ],
    stack: ["Node.js", "Python", "Playwright", "n8n", "Make", "Zapier", "Webhooks", "Cron", "OpenAI API"],
    faq: [
      { q: "What can you automate?", a: "Anything with a pattern: data entry, reports, emails, syncing tools, file handling. Tell us the boring part." },
      { q: "What if a tool has no API?", a: "There's usually a way in: webhooks, exports, email parsing, or a browser that clicks for you." },
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

/* ── Off the shelf ──────────────────────────────────────────────────────────
   Prebuilt websites per vertical, sold at a fixed price and built done-for-you.
   Money is always integer minor units of USD — see src/lib/money.ts.
   Anything in [square brackets] is a placeholder to replace before launch. */

export type SolutionSlug = "trades" | "restaurant" | "clinic" | "startup";

/** What a solution does. Drives the catalog filter pills, not the verticals. */
export type SolutionTag = "leads" | "bookings" | "payments" | "menu" | "ai";

export const SOLUTION_TAGS: { id: SolutionTag; label: string }[] = [
  { id: "leads", label: "Catches leads" },
  { id: "bookings", label: "Takes bookings" },
  { id: "payments", label: "Takes payments" },
  { id: "menu", label: "Menu / price list" },
  { id: "ai", label: "AI add-ons ready" },
];

export type Solution = {
  slug: SolutionSlug;
  index: string;
  /** Market label, used in chips, nav and metadata. */
  vertical: string;
  /** Product name. */
  title: string;
  /** One line for the card. */
  tagline: string;
  /** Two sentences for the hero and the meta description. */
  intro: string;
  forWho: string[];
  tags: SolutionTag[];
  /** Pages you get, in order. */
  pages: string[];
  /** Functional features, rendered in the numbered grid. */
  features: string[];
  /** Fed to <AutoChecklist>, same shape as Service.offYourPlate. */
  offYourPlate: string[];
  turnaround: string;
  /** As-is price in minor units of BASE_CURRENCY. */
  priceCents: number;
  /** Dodo dashboard product per environment: test and live ids differ. null = checkout off. */
  dodoProductId: { test: string | null; live: string | null };
  /**
   * The live, clickable demo. null until one is built, in which case the page
   * falls back to placeholder art.
   * `path` is a route in this app (see src/app/(demos)); `host` is the fake
   * domain shown in the browser frame's URL bar.
   */
  demo: { path: string; host: string } | null;
  accent: string;
  /** Which bespoke services this maps to, for cross-links and lead tagging. */
  services: ServiceSlug[];
  stack: string[];
  faq: { q: string; a: string }[];
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "trades",
    index: "01",
    vertical: "Trades & services",
    title: "The Callout",
    tagline: "Turns a phone search into a booked job.",
    intro:
      "Built for people who are up a ladder when the phone rings. Services, the areas you cover, proof you turn up, and a quote form that lands in your inbox instead of getting lost in WhatsApp.",
    forWho: ["Electricians", "Plumbers", "Cleaners", "Landscapers", "AC & repair", "Movers"],
    tags: ["leads", "ai"],
    pages: ["Home", "Services", "Service areas", "About & the team", "Reviews", "Get a quote", "Thanks"],
    features: [
      "Quote form that emails you and saves every lead",
      "Click-to-call and WhatsApp on every screen",
      "Service-area list built for local search",
      "Before and after gallery",
      "Google Reviews on the page",
      "Fast on 3G, because your customers are outside",
    ],
    offYourPlate: [
      "Typing the same quote into WhatsApp ten times",
      "Losing a job because you missed one call",
      "Explaining which areas you cover",
      "Paying a directory to list you",
    ],
    turnaround: "Live in 5 working days",
    priceCents: 24_900,
    dodoProductId: { test: null, live: null },
    demo: { path: "/demo/trades", host: "voltelectric.lk" },
    accent: "#ff5a1f",
    services: ["web", "automation"],
    stack: ["Next.js", "Tailwind", "WhatsApp", "Google Business", "Resend"],
    faq: [
      {
        q: "I work alone. Is this overkill?",
        a: "It's the opposite. One person with no office needs the site to answer the questions you'd otherwise answer by phone at 7pm.",
      },
      {
        q: "Can it stop the time-wasters?",
        a: "Partly. The quote form asks for the job, the address and a photo, so you can price it before you drive anywhere.",
      },
    ],
  },
  {
    slug: "restaurant",
    index: "02",
    vertical: "Food & salons",
    title: "The Table",
    tagline: "The menu, the hours and the address, found in one tap.",
    intro:
      "Most people check your page for three things: are you open, where are you, and what does it cost. This puts all three above the fold and keeps the menu editable without a developer.",
    forWho: ["Restaurants", "Cafes", "Bakeries", "Salons", "Barbers", "Spas"],
    tags: ["menu", "bookings", "leads"],
    pages: ["Home", "Menu or price list", "Gallery", "About", "Find us & hours", "Book a table", "Thanks"],
    features: [
      "Menu or price list you can edit yourself",
      "Opening hours that show open or closed right now",
      "Map, directions and one-tap calling",
      "Photo gallery that stays fast",
      "Reservation or booking request form",
      "Links out to delivery apps you already use",
    ],
    offYourPlate: [
      "Re-uploading a PDF menu every price change",
      "Answering \"are you open?\" on Instagram",
      "Paying commission on every delivery order",
      "Explaining where to park",
    ],
    turnaround: "Live in 5 working days",
    priceCents: 24_900,
    dodoProductId: { test: null, live: null },
    demo: { path: "/demo/restaurant", host: "kolambakitchen.lk" },
    accent: "#c8f04a",
    services: ["web"],
    stack: ["Next.js", "Tailwind", "Sanity", "Google Maps", "Resend"],
    faq: [
      {
        q: "Can I change prices myself?",
        a: "Yes. The menu lives in a simple editor built around your items, not a page builder you have to learn.",
      },
      {
        q: "Do you do online ordering?",
        a: "As an add-on. Menu to cart to kitchen, on your own site, so you stop paying commission per order.",
      },
    ],
  },
  {
    slug: "clinic",
    index: "03",
    vertical: "Clinics & practices",
    title: "The Practice",
    tagline: "Credibility first, appointment second.",
    intro:
      "For the practices where people check you out before they trust you. Treatments and what they cost, the people who do them, your policies in plain language, and an appointment request that reaches the front desk.",
    forWho: ["Dentists", "Physios", "Clinics", "Law firms", "Accountants", "Consultants"],
    tags: ["bookings", "leads", "ai"],
    pages: ["Home", "Treatments or services", "The team", "Fees & insurance", "Policies", "Request an appointment", "Thanks"],
    features: [
      "One page per treatment, written for patients not peers",
      "Team profiles with credentials and registrations",
      "Fees and what insurance covers, stated openly",
      "Appointment request with the details you need up front",
      "Policy and consent pages that are easy to keep current",
      "Accessible to WCAG AA, because your audience needs it",
    ],
    offYourPlate: [
      "Reading out the same fees on every call",
      "Taking appointment details by phone, twice",
      "Explaining what the insurance covers",
      "Chasing a web developer to fix one date",
    ],
    turnaround: "Live in 7 working days",
    priceCents: 34_900,
    dodoProductId: { test: null, live: null },
    demo: { path: "/demo/clinic", host: "serendibdental.lk" },
    accent: "#2fb5a0",
    services: ["web", "automation"],
    stack: ["Next.js", "Tailwind", "Sanity", "Cal.com", "Resend"],
    faq: [
      {
        q: "Is it compliant?",
        a: "The structure is: accessible markup, a policy and consent page, no tracking without consent. The wording of your own policies has to come from you or your regulator.",
      },
      {
        q: "Can patients book directly?",
        a: "The as-is build takes an appointment request your desk confirms. Real calendar booking with live slots is an add-on.",
      },
    ],
  },
  {
    slug: "startup",
    index: "04",
    vertical: "Startups & SaaS",
    title: "The Launch",
    tagline: "One page that explains it and collects the email.",
    intro:
      "For the week you need to be live and have nothing to show but a clear idea. Hero, the problem, how you solve it, pricing, and a signup that works before the product does.",
    forWho: ["Pre-launch SaaS", "Side projects", "Agencies", "Indie apps", "Waitlists", "Pitch pages"],
    tags: ["leads", "payments", "ai"],
    pages: ["Hero & problem", "How it works", "Features", "Pricing", "FAQ", "Waitlist or signup", "Thanks"],
    features: [
      "Pricing table built from your plans",
      "Waitlist capture that stores every signup",
      "Open Graph cards so links look right when shared",
      "Analytics and conversion goals wired up",
      "Scores green on Core Web Vitals out of the box",
      "Ready for a payment link the day you have something to sell",
    ],
    offYourPlate: [
      "Wrestling a page builder at 1am",
      "Paying monthly for a landing-page tool",
      "Wondering why the link preview is blank",
      "Rebuilding the page when the pitch changes",
    ],
    turnaround: "Live in 3 working days",
    priceCents: 19_900,
    dodoProductId: { test: null, live: null },
    demo: { path: "/demo/startup", host: "sheetfast.io" },
    accent: "#7b6cf6",
    services: ["web", "web-apps"],
    stack: ["Next.js", "Tailwind", "TypeScript", "Resend", "Vercel"],
    faq: [
      {
        q: "Can it grow into the real product?",
        a: "Yes. It's a normal Next.js codebase in your repository, so the app can be built on top of it rather than beside it.",
      },
      {
        q: "I don't have the copy yet.",
        a: "Add the copywriting pack. You answer a short set of questions and we write the page.",
      },
    ],
  },
];

/**
 * The three things we need from a buyer before we can build, whichever solution
 * they bought. Shown on every detail page and again on the thanks page, which is
 * the start of delivery rather than just a receipt.
 */
export const SOLUTION_WE_NEED = [
  "Your logo, or the branding pack",
  "A few photos of the real thing",
  "Access to your domain",
];

export const getSolution = (slug: string) => SOLUTIONS.find((s) => s.slug === slug);
export const SOLUTION_SLUGS = SOLUTIONS.map((s) => s.slug) as [SolutionSlug, ...SolutionSlug[]];

export type AddOnGroup = "brand" | "pages" | "integrations" | "ai";

export const ADDON_GROUPS: { id: AddOnGroup; label: string; line: string }[] = [
  { id: "brand", label: "Branding & words", line: "If you don't have a logo or the copy yet." },
  { id: "pages", label: "Extra pages", line: "More of the site, same build." },
  { id: "integrations", label: "Integrations", line: "Wire it to the tools you already pay for." },
  { id: "ai", label: "AI add-ons", line: "The bits that answer for you." },
];

export type AddOn = {
  /** Stable id, stored on the lead row. Don't rename these once they're in the database. */
  id: string;
  group: AddOnGroup;
  name: string;
  line: string;
  /** One-off price in minor units of BASE_CURRENCY. */
  priceCents: number;
  /** Monthly price in minor units, for the add-ons that keep running. */
  monthlyCents?: number;
  /** Caveat shown under the name. */
  note?: string;
  /** When set, only offered on these solutions. Absent = offered on all of them. */
  only?: SolutionSlug[];
};

export const ADD_ONS: AddOn[] = [
  { id: "brand-logo", group: "brand", name: "Logo & brand kit", line: "Logo, colours, type, and the files to use them anywhere.", priceCents: 12_000 },
  { id: "brand-copy", group: "brand", name: "Copywriting", line: "We write every page. You answer a few questions.", priceCents: 9_500 },
  { id: "brand-photos", group: "brand", name: "Photo sourcing", line: "Licensed photos chosen and cut to fit your site.", priceCents: 4_500 },

  { id: "pages-extra", group: "pages", name: "Extra page", line: "Any page beyond the ones included. Priced per page.", priceCents: 4_500 },
  { id: "pages-blog", group: "pages", name: "Blog or news section", line: "Listing, post template, and a CMS to post from.", priceCents: 9_000 },
  { id: "pages-multilang", group: "pages", name: "Second language", line: "Sinhala, Tamil or anything else, fully switchable.", priceCents: 11_000 },

  { id: "int-booking", group: "integrations", name: "Online booking", line: "Real calendar, real slots, confirmations by email.", priceCents: 14_000 },
  { id: "int-payments", group: "integrations", name: "Take payments", line: "Deposits or full payment, on your own site.", priceCents: 13_000, note: "Gateway fees are the provider's, not ours." },
  { id: "int-whatsapp", group: "integrations", name: "WhatsApp handoff", line: "Forms and buttons that open a pre-filled chat.", priceCents: 3_500 },
  { id: "int-crm", group: "integrations", name: "CRM or sheet sync", line: "Every lead lands where your team already works.", priceCents: 6_000 },
  { id: "int-reviews", group: "integrations", name: "Google Reviews", line: "Live reviews on the page, no copy and paste.", priceCents: 3_500, note: "Needs a Google Business profile." },
  { id: "int-analytics", group: "integrations", name: "Analytics & goals", line: "GA4, plus the three numbers that actually matter.", priceCents: 3_000 },
  { id: "int-ordering", group: "integrations", name: "Online ordering", line: "Menu to cart to kitchen, no commission.", priceCents: 19_000, only: ["restaurant"] },

  { id: "ai-chatbot", group: "ai", name: "AI site chatbot", line: "Answers from your own pages, around the clock.", priceCents: 16_000, monthlyCents: 2_500 },
  { id: "ai-receptionist", group: "ai", name: "AI receptionist", line: "Picks up when you can't, books the job, texts you.", priceCents: 29_000, monthlyCents: 5_900 },
  { id: "ai-quoting", group: "ai", name: "AI quoting assistant", line: "Turns a description into a priced quote for you to approve.", priceCents: 24_000, monthlyCents: 4_500 },
];

export const getAddOn = (id: string) => ADD_ONS.find((a) => a.id === id);
export const addOnsFor = (slug: SolutionSlug) => ADD_ONS.filter((a) => !a.only || a.only.includes(slug));
export const ADD_ON_IDS = ADD_ONS.map((a) => a.id) as [string, ...string[]];

/** Pay, send us the bits, we build, keys over. Same shape as PROCESS. */
export const SOLUTION_STEPS = [
  {
    n: "01",
    title: "Pick & pay",
    body: "Buy it as-is online, or tick the changes you want and we send a fixed quote first. No call needed either way.",
  },
  {
    n: "02",
    title: "Send the bits",
    body: "One short form: your logo, a few photos, your words, and access to your domain. Missing some? Add the branding pack.",
  },
  {
    n: "03",
    title: "We build it",
    body: "Your content, your colours, your domain. You get a preview link to pick at before anything goes live.",
  },
  {
    n: "04",
    title: "Keys over",
    body: "It goes live in your accounts, with a walkthrough video and 14 days of fixes. After that it's yours, with or without us.",
  },
];

/** Every build includes these, whichever one you pick. */
export const SOLUTION_INCLUDED = [
  "Your domain, connected properly",
  "Your logo and colours through the whole site",
  "Analytics and a form that actually delivers",
  "A walkthrough video, so you can edit it yourself",
  "14 days of fixes after launch",
  "Every account in your name, not ours",
];

/** Shared questions, merged with each solution's own on the detail page. */
export const SOLUTION_FAQ = [
  {
    q: "Is this a template everyone else has?",
    a: "The structure is prebuilt. The brand, the words and the content are yours. We don't sell a template as custom work, which is exactly why this page has prices on it.",
  },
  {
    q: "What do you need from me?",
    a: "Your logo, a few photos, your words, and access to your domain. If you don't have the logo or the words yet, add the branding pack and we'll make them.",
  },
  {
    q: "Who owns it at the end?",
    a: "You do. It's built in your accounts, on your domain, in a repository you own, and handed over with everything you need to run it without us.",
  },
  {
    q: "What if I want something that isn't listed?",
    a: "Then it's a bespoke project, not an off-the-shelf one. Tell us what you need and we'll quote it properly instead of pretending it fits.",
  },
  {
    q: "Are there monthly fees?",
    a: "Not from us on the as-is build. A few add-ons cost monthly because something has to keep running; where that's true, the monthly price is shown next to it.",
  },
];

export type Project = {
  slug: string;
  title: string;
  kind: string;
  tags: ServiceSlug[];
  year: string;
  summary: string;
  boringPart: string;
  built: string[];
  stack: string[];
  status: string;
  accent: string;
  /** Real screenshot in /public; projects without one fall back to the illustrated cover. */
  image?: string;
  /** Pixel size of `image` when it isn't the default 16:10 (2400×1500). */
  imageSize?: [number, number];
  /** Short feature tags shown on the showcase. */
  highlights?: string[];
  /** Shown in the homepage "Selected work" list; keep it to one or two per category. */
  featured?: boolean;
};

/** Studio work. Check the details before launch; add client projects as they ship. */
export const PROJECTS: Project[] = [
  {
    slug: "checklist",
    featured: true,
    title: "Checklist",
    kind: "Platform · Website",
    tags: ["web"],
    year: "2025",
    summary: "One platform to find trusted vendors and plan anything, from a dinner out to a wedding.",
    boringPart:
      "Planning a wedding, a trip or a renovation means a dozen vendors, a dozen WhatsApp threads and a spreadsheet nobody keeps up to date.",
    built: [
      "Spaces for food, wellness, fitness, weddings, travel and events, each with verified vendors",
      "Projects that keep tasks, saved vendors, quotes, budgets and bookings for one goal in one place",
      "Quote requests that land side by side in the dashboard for comparison",
      "A vendor side where businesses run their listings, deals and bookings end to end",
    ],
    stack: ["Next.js", "React", "PostgreSQL", "DynamoDB", "Amazon S3", "NextAuth", "GSAP"],
    status: "Active / pre-release",
    accent: "#C9A15B",
    image: "/work/checklist-hero.webp",
    highlights: ["Verified vendors", "Project planning", "Quotes & bookings"],
  },
  {
    slug: "thememerge",
    featured: true,
    title: "ThemeMerge",
    kind: "Shopify app",
    tags: ["shopify", "automation"],
    year: "2026",
    summary: "Merge two Shopify themes and keep every edit, instead of redoing changes by hand.",
    boringPart:
      "A developer works on a theme copy while the client keeps editing the live theme. At launch, someone has to find and redo every change twice.",
    built: [
      "A three-way merge of the live theme and a working copy, file by file and setting by setting",
      "Theme-editor aware: section and block settings in JSON merge cleanly, not just the Liquid",
      "Only real conflicts need a decision; everything else merges automatically",
      "Apply the result straight to the working copy, or download the merged files",
    ],
    stack: ["Shopify Admin API", "Liquid", "React Router", "Polaris", "Node.js"],
    status: "Shipped",
    accent: "#FF7A1A",
    image: "/work/thememerge.webp",
    highlights: ["Three-way merge", "Theme-editor aware", "Apply or download"],
  },
  {
    slug: "deconflict",
    title: "Deconflict",
    kind: "Shopify app",
    tags: ["shopify"],
    year: "2026",
    summary: "Finds the apps fighting over your storefront, and what each fight costs in load time.",
    boringPart:
      "Every app adds its own scripts. Over time a store loads jQuery three times, opens two cart drawers on add-to-cart and fires the same pixel twice, and nobody can say which app is to blame.",
    built: [
      "A full browser scan of the storefront that maps every script back to the app that added it",
      "A storefront health score with the load time lost to conflicts",
      "Plain-English issues ranked by impact: duplicate libraries, competing cart drawers, double pixels, render-blocking scripts",
      "Detection of leftover code from apps that were removed months ago",
    ],
    stack: ["Shopify Admin API", "Polaris", "React Router", "Playwright", "Node.js"],
    status: "Shipped",
    accent: "#3D6BF5",
    image: "/work/deconflict.webp",
    highlights: ["Storefront health score", "Duplicate scripts", "Heaviest apps"],
  },
  {
    slug: "scopewatch",
    title: "Scopewatch",
    kind: "Shopify app",
    tags: ["shopify", "automation"],
    year: "2026",
    summary: "App and access security for Shopify stores: who can touch your data, and who still should.",
    boringPart:
      "Stores pile up apps, staff and agency collaborators. Months later, an unused app can still change customer data and an old agency account still has full access.",
    built: [
      "An audit of every app's permissions, flagging unused apps that still hold sensitive scopes",
      "Staff and collaborator access reviews, with reminders when a review is overdue",
      "Weekly scans with alerts through Shopify Flow when something new appears",
      "A security score that tracks how the store improves over time",
    ],
    stack: ["Shopify Admin GraphQL API", "Polaris", "React Router", "Shopify Flow", "Node.js"],
    status: "Shipped",
    accent: "#F5A524",
    image: "/work/scopewatch.webp",
    highlights: ["App permission audit", "Unused app detection", "Collaborator reviews"],
  },
  {
    slug: "frostbyte",
    title: "FrostByte",
    kind: "Product website",
    tags: ["web"],
    year: "[Year]",
    summary: "A launch site for a thermoelectric neck cooler, built to feel as cold as the product.",
    boringPart:
      "Hardware launches live or die on the product page. A spec sheet and a stock template don't sell a gadget nobody has seen before.",
    built: [
      "A scroll-driven story that takes you from skin temperature to −12°C in three seconds",
      "A 3D teardown that pulls the unit apart to show each part as you read about it",
      "Pre-order flow and spec ticker built into the hero",
    ],
    stack: ["Next.js", "React", "Three.js", "Lenis"],
    status: "Under development",
    accent: "#3BA3E8",
    image: "/work/frostbyte.webp",
    highlights: ["Scroll storytelling", "3D teardown", "Pre-orders"],
  },
  {
    slug: "back2fit",
    title: "Back2Fit",
    kind: "Website",
    tags: ["web"],
    year: "[Year]",
    summary: "A bold site for a Sri Lankan boxing academy, with programmes, prices and schedules in one place.",
    boringPart:
      "Every new member asked the same questions on Instagram: what classes, what times, how much. The answers lived in old posts and voice notes.",
    built: [
      "Programmes, class times and package pricing laid out so people can choose without messaging",
      "Separate adult, kids and junior packages",
      "Schedule, team and achievements pages the academy can point people to",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    status: "Live at back2fit.lk",
    accent: "#E10600",
    image: "/work/back2fit-hero.webp",
    highlights: ["Programmes & pricing", "Class schedule", "Join online"],
  },
  {
    slug: "autopress-ai",
    title: "AutoPress AI",
    kind: "WordPress plugin",
    tags: ["wordpress", "automation"],
    year: "2025",
    summary: "Give it a niche, and it plans the keywords and writes the articles, right inside WordPress.",
    boringPart:
      "Content sites live on volume. Someone has to research keywords, group them, brief each article, write it, add images and publish, fifty times over.",
    built: [
      "AI keyword research from one niche or master keyword: 50 primary keywords, each with secondary keywords",
      "A keyword plan that tracks every article from queued to written to published",
      "Article generation with images, a meta description, an FAQ and internal links",
      "Publishes straight to the WordPress site it runs on",
    ],
    stack: ["WordPress", "PHP", "OpenAI API"],
    status: "Active",
    accent: "#F5B82E",
    image: "/work/autopress-ai.webp",
    imageSize: [1600, 900],
    highlights: ["AI keyword research", "Article generation", "Auto-publish"],
  },
  {
    slug: "partystore",
    title: "Party Store",
    kind: "WooCommerce store",
    tags: ["wordpress"],
    year: "[Year]",
    summary: "A one-stop online party shop, from balloon arches to ready-made party-in-a-box kits.",
    boringPart:
      "Hundreds of small party items across dozens of themes. Customers wanted a full look for a birthday, not a hunt through balloons, plates and banners one by one.",
    built: [
      "A WooCommerce catalogue organised by item and by occasion: birthdays, themes, baby celebrations",
      "Party-in-a-box theme kits sold as one product",
      "Sale campaigns and promo codes in a rotating hero",
      "A slide-out cart and WhatsApp chat for quick questions",
    ],
    stack: ["WordPress", "WooCommerce", "Elementor", "Custom theme"],
    status: "Live at partystore.lk",
    accent: "#F472B6",
    image: "/work/partystore.webp",
    highlights: ["WooCommerce", "Party-in-a-box kits", "Shop by occasion"],
  },
  {
    slug: "nileka-jewellery",
    title: "Nileka Jewellery",
    kind: "WooCommerce store",
    tags: ["wordpress"],
    year: "[Year]",
    summary: "An online home for a jewellery house with roots back to 1984, collections and custom pieces included.",
    boringPart:
      "A family jeweller with four decades of work and no proper way to show it online. Every enquiry about a necklace or a custom piece started from scratch on the phone.",
    built: [
      "Collections for bangles, bracelets, chains, necklaces, pendants and rings",
      "A custom-jewellery enquiry flow for one-of-a-kind pieces",
      "Legacy, journal and promotions pages the team updates themselves",
    ],
    stack: ["WordPress", "WooCommerce", "Divi", "WPForms"],
    status: "Live at nilekajewellery.lk",
    accent: "#D4AF37",
    image: "/work/nileka.webp",
    highlights: ["Collections", "Custom jewellery", "Heritage story"],
  },
  {
    slug: "fragrance-vault",
    featured: true,
    title: "Fragrance Vault",
    kind: "WooCommerce store",
    tags: ["wordpress"],
    year: "[Year]",
    summary: "A dark, luxurious perfume store with instalment payments and a monthly fragrance subscription.",
    boringPart:
      "Designer perfume is an expensive, impulse-sensitive buy. Without instalments or a way to try before committing to a full bottle, most visitors just left.",
    built: [
      "A shop split by For Him, For Her and Unisex, with full bottles and 10ml decants",
      "Instalment pricing shown on every product, paid through Payzy",
      "The Monthly Ritual: a subscription that sends two travel-size scents each month",
      "A bank-transfer discount built into checkout",
    ],
    stack: ["WordPress", "WooCommerce", "Elementor", "Payzy", "Custom theme"],
    status: "Live at fragrancevault.lk",
    accent: "#C9A646",
    image: "/work/fragrancevault-hero.webp",
    highlights: ["Instalment payments", "Monthly subscription", "Decants & full bottles"],
  },
  {
    slug: "aito-auto",
    title: "Aito Auto",
    kind: "Website",
    tags: ["web"],
    year: "2026",
    summary: "A Finnish-language website for a used-car dealership, with listings the team manages themselves.",
    boringPart:
      "Car listings change every day. Without a proper CMS, every new car or price drop means a developer request.",
    built: [
      "A fast, Finnish-language site built around the car listings",
      "A headless CMS so the team adds and edits cars themselves",
      "PostgreSQL behind the scenes for listings and enquiries",
    ],
    stack: ["Next.js", "PostgreSQL", "Strapi"],
    status: "Pre-release",
    accent: "#3C7EB9",
    image: "/work/aito-auto-hero.webp",
    highlights: ["Finnish-language", "Self-managed listings", "Monthly price up front"],
  },
  {
    slug: "webcopyrightchecker",
    featured: true,
    title: "WebCopyrightChecker",
    kind: "Web app",
    tags: ["web-apps"],
    year: "[Year]",
    summary: "Scan any website for images that could get you a copyright claim, before someone else finds them.",
    boringPart:
      "Sites collect images over years from stock libraries, agencies and Google searches. Nobody remembers which ones are licensed until a DMCA notice arrives.",
    built: [
      "Paste a URL and every image on the site gets scanned",
      "Watermark, stock-photo and licence detection with AI image analysis",
      "A compliance report with a risk rating and what to do about each image",
    ],
    stack: ["Next.js", "React"],
    status: "Live at webcopyrightchecker.com",
    accent: "#2563EB",
    image: "/work/webcopyrightchecker.webp",
    highlights: ["AI image scan", "Watermark detection", "Compliance report"],
  },
  {
    slug: "workflow-cloner",
    title: "Workflow Cloner",
    kind: "Internal tool · HubSpot",
    tags: ["web-apps", "automation"],
    year: "[Year]",
    summary: "Clones HubSpot workflows by the hundred, swapping each client's fields and emails, instead of rebuilding them by hand.",
    boringPart:
      "Each new client or region needed the same HubSpot workflows with different conditions, fields and email templates. Someone rebuilt them by hand, click by click, hundreds of times.",
    built: [
      "Exports every published workflow as full JSON through the HubSpot Workflows API",
      "One job file per client describes what to swap: fields, values, IDs and cloned email templates",
      "A dry run shows every change before anything is created",
      "Sandbox-first, safe to re-run without duplicates, new workflows created switched off, every change logged",
    ],
    stack: ["Python", "HubSpot Workflows API", "Railway"],
    status: "Internal tool",
    accent: "#2DD4BF",
    image: "/work/workflow-cloner.webp",
    imageSize: [1600, 900],
    highlights: ["Job files", "Dry run", "Sandbox-first"],
  },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);

export type ShowcaseSite = {
  title: string;
  url: string;
  kind: string;
  accent: string;
  /** Hero screenshot saved in /public/work (static file, 16:10 works best, e.g. 2400×1500). */
  image: string;
  imageSize?: [number, number];
  /** Slug of the matching case study in PROJECTS, if there is one. */
  project?: string;
};

/** Sites on the homepage wheel, in spin order. Each shows a static hero screenshot from /public/work. */
export const SHOWCASE: ShowcaseSite[] = [
  {
    title: "Aito Auto",
    url: "https://www.aitoautooy.fi",
    kind: "Car dealership · Finland",
    accent: "#3C7EB9",
    image: "/work/aito-auto-hero.webp",
    project: "aito-auto",
  },
  {
    title: "Creative Works Co.",
    url: "https://web-production-828036a0.up.railway.app/",
    kind: "Video & photo studio · NZ",
    accent: "#22B8CF",
    image: "/work/creative-works.webp",
  },
  {
    title: "Checklist.lk",
    url: "https://ckqfwhcrievgrv.checklist.lk/",
    kind: "Planning platform",
    accent: "#C9A15B",
    image: "/work/checklist-hero.webp",
    project: "checklist",
  },
  {
    title: "Fragrance Vault",
    url: "https://fragrance-vault.up.railway.app/",
    kind: "Perfume store",
    accent: "#C9A646",
    image: "/work/fragrancevault-hero.webp",
    project: "fragrance-vault",
  },
  {
    title: "Back2Fit",
    url: "https://www.back2fit.lk",
    kind: "Boxing academy",
    accent: "#E10600",
    image: "/work/back2fit-hero.webp",
    project: "back2fit",
  },
  {
    title: "Fintra Finance",
    url: "https://fintrafinance.com.au",
    kind: "Finance broker · Australia",
    accent: "#F5C431",
    image: "/work/fintra-finance.webp",
  },
  {
    title: "ThemeMerge",
    url: "https://thememerge.com",
    kind: "Shopify app · Marketing site",
    accent: "#FF7A1A",
    image: "/work/thememerge-site.webp",
    project: "thememerge",
  },
];

export const PROCESS = [
  {
    n: "01",
    title: "Spot",
    body: "We look at how your week actually runs and list everything that repeats. That list is usually longer than anyone expects.",
  },
  {
    n: "02",
    title: "Plan",
    body: "We pick what to build first, agree a fixed scope and a fixed price, and write it down in plain language.",
  },
  {
    n: "03",
    title: "Build",
    body: "Design, code and test in short weekly loops. You see real progress every week, not a big reveal at the end.",
  },
  {
    n: "04",
    title: "Hand off",
    body: "It goes live and starts doing the work. You get docs, access to everything, and us on call if anything breaks.",
  },
];

export const HERO_TASKS = [
  { label: "Copy new orders into the sheet", via: "webhook" },
  { label: "Chase three unpaid invoices", via: "cron · 9am" },
  { label: "Update stock on 40 products", via: "API sync" },
  { label: "Resize photos for the blog", via: "script" },
  { label: "Reply to 'where's my order?'", via: "auto-reply" },
  { label: "Fix the contact form again", via: "rebuilt" },
  { label: "Post the sale on socials", via: "scheduled" },
  { label: "Back up the website", via: "nightly job" },
  { label: "Build the Monday report", via: "dashboard" },
  { label: "Change the price in 3 places", via: "CMS" },
  { label: "Approve 12 client photos", via: "plugin" },
  { label: "Book the follow-up call", via: "calendar link" },
  { label: "Export leads to the CRM", via: "integration" },
  { label: "Update the app before review", via: "CI pipeline" },
];

export const STACK_ROW_A = ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Drizzle", "Tailwind", "Strapi", "Sanity", "Stripe", "Google Cloud"];
export const STACK_ROW_B = ["Shopify", "Liquid", "Polaris", "WordPress", "PHP", "Gutenberg", "WooCommerce", "Python", "Playwright", "n8n"];

export const FAQ = [
  {
    q: "What does Do Less Studios actually do?",
    a: "We design and build websites, Shopify and WordPress themes and plugins, web apps and automations. Most projects end up being a mix of a few of those.",
  },
  {
    q: "How much does a project cost?",
    a: "It depends on scope, so we quote a fixed price after a short call. Projects start from 50,000 LKR. No hourly meter running in the background.",
  },
  {
    q: "How long does it take?",
    a: "Small automations can be live in days. Websites usually take a few weeks, apps longer. You'll get a timeline with the quote.",
  },
  {
    q: "Do you work with clients outside Sri Lanka?",
    a: "Yes. We work remotely, so where you are matters less than how clearly we talk. Calls are scheduled around your timezone.",
  },
  {
    q: "Who owns the code and accounts?",
    a: "You do. Everything is built in your accounts and repositories from day one, so you're never locked in.",
  },
  {
    q: "What happens after launch?",
    a: "You can take it from there with the docs we hand over, or keep us on a monthly plan for fixes, updates and new automations.",
  },
];

export const BEFORE_WEEK = [
  { day: 0, start: 0, len: 2, label: "Copy orders to sheet" },
  { day: 0, start: 2, len: 1, label: "Inbox: order status" },
  { day: 0, start: 4, len: 2, label: "Monday report" },
  { day: 1, start: 0, len: 1, label: "Update stock" },
  { day: 1, start: 1, len: 2, label: "Resize product photos" },
  { day: 1, start: 4, len: 1, label: "Fix plugin conflict" },
  { day: 1, start: 5, len: 1, label: "Inbox: order status" },
  { day: 2, start: 0, len: 2, label: "Copy orders to sheet" },
  { day: 2, start: 3, len: 2, label: "Post to socials" },
  { day: 3, start: 0, len: 1, label: "Update stock" },
  { day: 3, start: 1, len: 1, label: "Export leads to CRM" },
  { day: 3, start: 2, len: 2, label: "Chase invoices" },
  { day: 3, start: 5, len: 1, label: "Manual backup" },
  { day: 4, start: 0, len: 2, label: "Copy orders to sheet" },
  { day: 4, start: 2, len: 1, label: "Inbox: order status" },
  { day: 4, start: 3, len: 3, label: "Chase invoices (again)" },
];

export const AFTER_WEEK = [
  { day: 0, start: 0, len: 3, label: "Plan the new collection" },
  { day: 1, start: 1, len: 2, label: "Talk to customers" },
  { day: 2, start: 0, len: 2, label: "Product shoot" },
  { day: 2, start: 3, len: 3, label: "Long lunch" },
  { day: 3, start: 1, len: 3, label: "Actual strategy" },
  { day: 4, start: 0, len: 2, label: "Ship the new feature" },
  { day: 4, start: 3, len: 3, label: "Leave early" },
];

export const PRINCIPLES = [
  { n: "I", title: "Never do it twice", body: "The second time a task shows up, we start writing the thing that does it.", note: "Why Workflow Cloner exists" },
  { n: "II", title: "Boring tech wins", body: "Proven tools, good defaults, fewer surprises at 2am.", note: "Next.js, Postgres, Shopify, WordPress" },
  { n: "III", title: "Less code, fewer problems", body: "The best feature is the one you didn't need to build.", note: "Deleted code has zero bugs" },
  { n: "IV", title: "Nothing to babysit", body: "If it needs someone watching it, it isn't finished.", note: "Done means you forget it's there" },
];

export const WONT_DO = ["Endless status meetings", "Hourly billing surprises", "Locking you into our accounts", "Templates sold as custom", "Ten tools where one will do"];
