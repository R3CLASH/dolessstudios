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
  { href: "/work", label: "Work", note: "proof we do the work", key: "3" },
  { href: "/about", label: "About", note: "why lazy is a method", key: "4" },
  { href: "/contact", label: "Contact", note: "hand us something boring", key: "5" },
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

/* ── Legal pages ──────────────────────────────────────────────────────────────
 * Terms, privacy and refunds. These exist because a payment processor's business
 * review requires them to be publicly visible alongside public pricing, but they
 * are also just what anyone buying a build is entitled to read first.
 *
 * Written to describe what the code actually does: the contact form really does
 * email over SMTP and write to Postgres, there really is no analytics or tracking
 * of any kind, and the fonts really are self-hosted. If the app's behaviour
 * changes, this copy has to change with it.
 */

export type LegalSection = { heading: string; body: string[] };

export type LegalPage = {
  slug: "terms" | "privacy" | "refund-policy";
  /** Footer link text. Kept short; the bottom bar is a single line. */
  label: string;
  title: string;
  heavy: string;
  light: string;
  intro: string;
  /** Shown on the page so a reader can tell how current it is. */
  updated: string;
  sections: LegalSection[];
};

const LEGAL_UPDATED = "20 November 2026";

export const LEGAL: LegalPage[] = [
  {
    slug: "terms",
    label: "Terms",
    title: "Terms of Service",
    heavy: "Terms",
    light: "in plain language.",
    intro: `The agreement between you and ${SITE.name} when you buy a build or hire us for a project.`,
    updated: LEGAL_UPDATED,
    sections: [
      {
        heading: "Who you are dealing with",
        body: [
          `${SITE.name} is a development and automation studio based in ${SITE.location}. You can reach us at ${SITE.email}, and that address is the right one for anything in these terms.`,
          `"We" and "us" mean ${SITE.name}. "You" means the person or business buying the work. "The work" means whatever we have agreed to build — a website, a store, an app, an automation, or a prebuilt site set up on your domain.`,
        ],
      },
      {
        heading: "How work is agreed",
        body: [
          "Bespoke projects start from a written scope and a fixed price. Nothing begins until you have accepted that scope in writing, and the price we quote covers what is in it — not what is added later.",
          "Fixed-price prebuilt sites are different: the price, the pages and what is included are published on the site before you buy, so buying one is your acceptance of that scope as written. Anything beyond it is a separate quote.",
          "If we think something you have asked for is a bad idea, we will say so and suggest the alternative. The decision is still yours.",
        ],
      },
      {
        heading: "What we need from you",
        body: [
          "Every build needs three things from you: your logo or branding, a few real photographs, and access to your domain. We cannot start until we have them.",
          "If those have not arrived within 30 days of purchase, we will hold your slot and keep chasing, but we cannot guarantee the original turnaround. We will not cancel your order or keep your money without telling you.",
          "You are responsible for the accuracy of the content you send us and for having the right to use it. If you send us a photograph you do not have a licence for, that is on you.",
        ],
      },
      {
        heading: "Turnaround and delivery",
        body: [
          "Turnaround is quoted in working days and is counted from the day we have everything in the section above, not from the day you paid. Sri Lankan public holidays and weekends do not count.",
          "Delivery means the work is live on your domain and handed over to you. For prebuilt sites it also means we have set it up with your brand and content, because these are done-for-you builds and not files you download.",
          "A fixed-price build includes one round of revisions on the content and branding we have put in. Structural changes, extra pages and new features are quoted separately.",
        ],
      },
      {
        heading: "Prices, payment and tax",
        body: [
          "Published prices are in US dollars and are the full price of the work. Any rupee figure shown next to a price is an approximate conversion for your convenience only, and nothing is ever charged at it.",
          "Payments are processed by Dodo Payments, which acts as merchant of record for the sale. Your card details are handled entirely by them and never reach us or our servers. Dodo issues the receipt for your purchase, and that receipt rather than anything on our site is the tax document for it.",
          "Any tax Dodo is required to collect in your country is added at checkout and shown before you pay. Third-party costs — domain registration, paid plugins, app subscriptions, hosting beyond what we set up — are billed to you by those providers and are not included unless the scope says so.",
        ],
      },
      {
        heading: "Who owns what",
        body: [
          "You own your brand, your content and your domain throughout. Nothing you give us becomes ours.",
          "Once the work is paid for in full, the site we built for you is yours to keep, change, move or hand to another developer. We do not hold your site hostage and we do not keep your accounts in our name.",
          "We keep the right to describe the work and show it in our own portfolio, including screenshots of the finished site. If you would rather we did not, tell us and we will not.",
          "Anything we built before your project, and any internal tool we reuse across clients, stays ours.",
        ],
      },
      {
        heading: "Cancellation and refunds",
        body: [
          "Both are covered in the Refund and Cancellation Policy, which forms part of these terms.",
        ],
      },
      {
        heading: "Third-party services",
        body: [
          "Builds usually sit on services neither of us controls — hosting, a domain registrar, a payment processor, an email provider, whatever apps the project needs. We will set them up sensibly and in your name wherever we can, but we cannot be responsible for their outages, price changes or policy decisions.",
        ],
      },
      {
        heading: "What we are responsible for",
        body: [
          "We will do the work with reasonable skill and care, and we will fix our own mistakes. For 30 days after delivery, anything that is broken because of how we built it we fix at no charge.",
          "We are not responsible for losses beyond the work itself: lost revenue, lost data you had no backup of, or the consequences of a third-party service failing. Where we are liable, our total liability is limited to the amount you paid us for the work in question.",
          "Nothing here limits liability that cannot legally be limited.",
        ],
      },
      {
        heading: "Ending the arrangement",
        body: [
          "Either of us can walk away from an ongoing project in writing. If you do, you pay for the work done up to that point. If we do, we refund anything you have paid for work not yet done.",
          "We may decline or stop work on anything illegal, deceptive, or built to harm people. We will tell you why and refund the unstarted part.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          `These terms are governed by the laws of ${SITE.location}, and its courts have jurisdiction over any dispute. If something goes wrong, email us first — almost everything is solvable without lawyers.`,
        ],
      },
      {
        heading: "Changes",
        body: [
          "We may update these terms. The version on this page when you bought is the one that applies to your purchase, so the date above matters. Material changes will not be applied retroactively to work already agreed.",
        ],
      },
    ],
  },

  {
    slug: "privacy",
    label: "Privacy",
    title: "Privacy Policy",
    heavy: "Privacy,",
    light: "the short version.",
    intro:
      "What this site collects, which is very little, and what happens to it. No analytics, no advertising, no tracking cookies.",
    updated: LEGAL_UPDATED,
    sections: [
      {
        heading: "The short version",
        body: [
          "This site has no analytics, no advertising, no tracking pixels and no third-party scripts. We do not profile you, we do not sell anything about you, and nobody is paying us for your attention.",
          "We hold what you type into a form, and what a payment processor tells us about a purchase. That is the whole of it.",
        ],
      },
      {
        heading: "What we collect, and when",
        body: [
          "When you send a brief through the contact page, we receive what you filled in: your name, email address, company if you gave one, your budget and timeline if you selected them, which services you are interested in, and your message. If you configured a prebuilt site, we also receive which site and which add-ons you chose.",
          "When you sign up to the newsletter, we store your email address and nothing else.",
          "When you buy something, Dodo Payments processes the payment and tells us your name, email address, what you bought, the payment reference and the amount charged. We never receive or store your card number, and it never touches our servers.",
          "Our server keeps ordinary request logs, which include your IP address. We also use your IP address in memory, briefly, to rate-limit form submissions so the forms cannot be used to spam us. It is not stored for that purpose and is not linked to your submission.",
        ],
      },
      {
        heading: "Cookies, or the lack of them",
        body: [
          "This site sets no cookies and runs no cookie banner, because there is nothing to consent to.",
          'Two small values are kept in your browser\'s session storage to stop the site being annoying: one records that you have already seen the opening animation, and one remembers which pages you have visited so the menu can mark them. Both are visible only to your own browser, are never sent to us, and are erased when you close the tab.',
          "Our fonts are served from this site rather than from a font network, so loading a page does not tell anyone else that you were here.",
        ],
      },
      {
        heading: "Why we hold it",
        body: [
          "To reply to you and to quote on work, which is the reason you contacted us.",
          "To deliver and support something you bought, which we need in order to perform the agreement.",
          "To send the newsletter, which happens only because you asked for it and stops the moment you say so.",
          "To keep the site from being abused, which is the rate limiting above.",
        ],
      },
      {
        heading: "Who else sees it",
        body: [
          "Only the services we need to run the business, and only what they need:",
          "Amazon Web Services hosts the site, in the United States. Our email provider carries the messages the forms generate. Our database provider stores the briefs and newsletter sign-ups. Dodo Payments processes payments and is the merchant of record for purchases, under its own privacy policy.",
          "Because our hosting and payment processing are outside Sri Lanka, your information is transferred and processed abroad, including in the United States.",
          "We do not sell your information, we do not share it for advertising, and we do not hand it to anyone else unless the law genuinely requires it.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Briefs and enquiries we keep while there is any chance of working together, and then for as long as we need a record of the project. Order records we keep as long as we are required to for tax and accounting. Newsletter addresses we keep until you unsubscribe. Server logs rotate on their own in a matter of weeks.",
        ],
      },
      {
        heading: "What you can ask for",
        body: [
          `Email ${SITE.email} and you can ask us for a copy of what we hold about you, ask us to correct it, ask us to delete it, or tell us to stop emailing you. We will do it, and we will not make you explain why.`,
          "Deleting an order record may be limited by the records we are legally required to keep, and the receipt for a purchase belongs to Dodo Payments rather than to us.",
        ],
      },
      {
        heading: "Children",
        body: [
          "This is a business-to-business studio site. It is not aimed at children and we do not knowingly collect anything from them.",
        ],
      },
      {
        heading: "Changes",
        body: [
          "If this changes, the date above changes with it. If a change is significant and we hold your email address, we will tell you rather than quietly editing the page.",
        ],
      },
    ],
  },

  {
    slug: "refund-policy",
    label: "Refunds",
    title: "Refund & Cancellation Policy",
    heavy: "Refunds",
    light: "and cancellations.",
    intro:
      "When you can get your money back, when you cannot, and exactly how to ask. Written for a service that starts the moment you pay.",
    updated: LEGAL_UPDATED,
    sections: [
      {
        heading: "What this covers",
        body: [
          "Every purchase made through this site, including fixed-price prebuilt sites and deposits on bespoke projects.",
          "These are done-for-you builds, not downloads. You are buying our time and a build slot, which is why the timing of your request matters so much to what we can refund.",
        ],
      },
      {
        heading: "Before we start: a full refund",
        body: [
          "If you change your mind before we have begun work, you get all of it back, no questions and no restocking fee. Just email us.",
          "In practice that means within 48 hours of buying, or any time before we tell you the build has started — whichever is later. We will always confirm by email when work begins, so you are never guessing.",
        ],
      },
      {
        heading: "Once the build is under way: a partial refund",
        body: [
          "After we have started, we refund what we have not yet done. We will tell you plainly what has been built, what that was worth, and what is coming back to you.",
          "If we have barely begun, expect most of it back. If the site is nearly finished, expect little. We would rather finish the work or fix what you dislike, and that option stays open.",
        ],
      },
      {
        heading: "After delivery",
        body: [
          "Once the build is live on your domain and handed over, the work is done and it is not refundable — you have it.",
          "What you do get is 30 days of fixes: anything broken because of how we built it, we repair at no charge. That is a warranty on our work, not a trial period, and it does not cover changes of mind or new features.",
        ],
      },
      {
        heading: "If we are the problem",
        body: [
          "If we cannot deliver what was agreed, or we miss the turnaround by our own fault and you no longer want it, you get a full refund. That holds even after work has started.",
          "If we have to decline a project after taking your money, we refund the part we have not done and say why.",
        ],
      },
      {
        heading: "What we cannot refund",
        body: [
          "Money that has already left for somebody else: domain registrations, paid plugins or themes, app subscriptions, stock photography, and any third-party service bought for your project. Those are the provider's to refund, under their rules, and we will help you ask.",
          "Work you cancelled after it was completed and accepted.",
        ],
      },
      {
        heading: "How to ask",
        body: [
          `Email ${SITE.email} with the email address you used and the payment reference from your receipt. That is all we need to find the order.`,
          "We will reply within two working days with what we can refund and why. If we agree a refund, we submit it straight away.",
        ],
      },
      {
        heading: "How the money comes back",
        body: [
          "Dodo Payments is the merchant of record for your purchase, so the refund is issued by them, to the card or method you originally paid with. We cannot send it anywhere else.",
          "Once submitted it typically takes 5 to 10 working days to appear, depending on your bank. If you paid in a currency other than US dollars, your bank's exchange rate on the day of the refund may differ from the day you paid, and that difference is not something either we or Dodo control.",
        ],
      },
      {
        heading: "Please ask us before your bank",
        body: [
          "If something has gone wrong, email us first. A chargeback takes months, freezes the conversation, and we will almost always have sorted it out by return of email. We have never refused a refund that was fair.",
        ],
      },
    ],
  },
];

export const getLegalPage = (slug: LegalPage["slug"]) => LEGAL.find((p) => p.slug === slug)!;
