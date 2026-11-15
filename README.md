# Do Less Studios

Marketing site for Do Less Studios. Next.js 16 (App Router, TypeScript), Tailwind CSS 4, GSAP + ScrollTrigger + Lenis for motion, PostgreSQL via Drizzle ORM for contact briefs and newsletter sign-ups.

## Run it

```bash
npm install
cp .env.example .env          # set DATABASE_URL
docker compose up -d          # optional: local Postgres on :5432
npm run db:migrate            # creates the tables
npm run dev                   # http://localhost:3000
```

The site runs without a database. Newsletter sign-ups are emailed to `CONTACT_TO_EMAIL` like briefs, and also saved to Postgres when `DATABASE_URL` is set.

Contact form briefs are emailed to `CONTACT_TO_EMAIL` over SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`; see `.env.example`) and also saved to Postgres when `DATABASE_URL` is set. A brief counts as received if either works; if neither does, the visitor is told it didn't send. The form is validated in the browser for instant feedback and again on the server with the same zod schema (`src/lib/inquiry.ts`).

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run build:aws` | OpenNext build for AWS (`.open-next/`, used by `infra/`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:generate` | New migration from `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations in `drizzle/` |
| `npm run db:studio` | Browse the data (Drizzle Studio) |

## Where things live

```
src/
  app/(site)/             the marketing site: /, /services[/slug], /off-the-shelf[/slug], /work[/slug], /about, /contact, 404
  app/(demos)/            the live demo sites (own root layout, own stylesheet) — see "Demos" below
  app/globals.css         the site's theme. app/demo.css is the demos' separate theme.
  lib/content.ts          ALL copy and data (services, off-the-shelf solutions + add-ons, projects, FAQ...). Edit here.
  lib/actions.ts          server actions: submitInquiry, submitSolutionInquiry, subscribe (zod, honeypot, rate limit)
  lib/inquiry.ts          contact form options + zod schema, shared by the form and the server action
  lib/solutionInquiry.ts  off-the-shelf quote schema, built from inquirySchema so the rules stay in one place
  lib/money.ts            USD minor units + the one price formatter (and the display-only LKR rate)
  lib/solutions.ts        whether instant checkout is available; returns null until Dodo Payments is wired up
  lib/mail.ts             SMTP transport (nodemailer) that emails each brief
  lib/gsap.ts             GSAP plugin registration + useGsap hook (scoped context, auto-cleanup)
  lib/demo/               fixture content for each demo's fake business (Volt Electric, etc.)
  db/                     Drizzle schema + lazy connection
  components/
    shell/                header + to-do menu, command palette, page transition, cursor, preloader, footer, Lenis
    home/                 homepage sections (Hero is the scroll story)
    services/ solutions/ demo/ work/ about/ contact/ sections/ ui/
  app/fonts/              self-hosted Bricolage Grotesque (variable) + JetBrains Mono
drizzle/                  SQL migrations
```

## The concept, by section

- **Hero:** "The to-do list that does itself". 14 tasks pile up (8 on phones). As you scroll, each one is ticked, tagged with what automates it, shrinks into an orange dot and flies into the head of the logo mark. The mark draws itself, leans back, and the name lands.
- **Header:** the logo pill lies down (mark goes flat, little z's) when you scroll down and sits back up when you scroll up or hover. The centre nav is a checklist; the current page is ticked off.
- **Menu:** a full-screen to-do list of the site. Pages you've visited this session are checked off ("3 of 6 done"). Press `1`–`6` anywhere to jump to a page, or `⌘K` / `Ctrl+K` for "lazy mode", a command palette.
- **Page transitions:** a curtain with the destination name ("→ Work") on every internal link.
- **Cursor:** the orange head of the mark, lagging lazily; grows with a label over links.
- Homepage also has a scroll-lit manifesto, a pinned horizontal services rail, a draggable before/after week, a process section where the mark reclines step by step, a hover-preview work list, a tools marquee, FAQ and a big CTA.

## Off the shelf

Four prebuilt sites sold at a fixed price, as a second way in alongside bespoke work: `/off-the-shelf` lists them,
`/off-the-shelf/[slug]` sells one. Everything is data in `lib/content.ts` — `SOLUTIONS` (the four) and `ADD_ONS` (the
paid customisations, one global list with an optional `only` whitelist per solution).

The delivery model is done-for-you: the client pays, sends their logo/photos/domain, and we launch it for them. So the
money is a build slot, not a download.

**The hybrid rule**, which lives in `components/solutions/SolutionConfigurator.tsx`: tick no add-ons and you can buy the
site as-is; tick any and it routes to a quote form instead, because add-on prices are estimates until we've seen your
material. The configurator's running total is display only — `submitSolutionInquiry` recomputes every figure from the
catalog and never trusts what the browser sent.

Prices are integer **USD** cents in `content.ts` (`lib/money.ts` formats them). The rupee figure beside them is marked
approximate on purpose: Dodo Payments converts at checkout via Adaptive Currency, so no advertised LKR number would
match what the card is actually charged.

Instant checkout is **not wired up yet**. `lib/solutions.ts` returns `null`, so the buy button doesn't render and both
CTAs go to the quote form — no dead ends. Turning payments on means filling in that one function plus the
`dodoProductId` values in `content.ts`; the UI already handles both states.

New solutions need an entry in `SOLUTIONS` plus art and a label in `components/solutions/SolutionArt.tsx` — both are
`Record<SolutionSlug, …>`, so TypeScript won't let you forget. Real demos need `demoUrl` set and a screenshot at
`public/off-the-shelf/<slug>.webp`.

Everything respects `prefers-reduced-motion` (animations off, final states shown). Pinned sections fall back to stacked layouts below 1024px.

## Demos

Every off-the-shelf solution has a real, clickable demo site — three pages each, with a working form:

| Solution | Demo | Fictional business | Pages |
|---|---|---|---|
| The Callout | `/demo/trades` | Volt Electric, an electrician | home · service areas · quote form |
| The Table | `/demo/restaurant` | Kolamba Kitchen, a Sri Lankan restaurant | home · menu · table booking |
| The Practice | `/demo/clinic` | Serendib Dental, a dental practice | home · treatments & fees · appointment request |
| The Launch | `/demo/startup` | Sheetfast, a pre-launch SaaS | home · pricing · waitlist |

Every form validates, shows the success state a real one would, and then stops: **no demo form sends data anywhere**,
and each says so in its confirmation. The clinic's form asks for an appointment *request* rather than confirming a
slot, because live calendar booking is a paid add-on — a demo shouldn't promise what the as-is price doesn't include.

**Why there are two root layouts.** A demo is pretending to be someone else's website, so it must not inherit this
site's dark theme, header, footer, cursor or Lenis smooth scrolling. Next.js only allows that with multiple root
layouts, so the marketing site lives in `app/(site)/` and demos in `app/(demos)/`. Route groups don't appear in URLs,
so nothing about the public paths changed. Two consequences worth knowing:

- Navigating between a demo and the site is a **full page load**. That's inherent to multiple root layouts, and fine.
- There is no top-level `app/layout.tsx`. `not-found.tsx` lives in `(site)`, and metadata files (`icon.svg`,
  `robots.ts`, `sitemap.ts`) stay at the `app/` root where they apply to both groups.

**Styling.** Demos import `app/demo.css`, never `globals.css`. Palettes are per-demo custom properties
(`--d-brand`, `--d-accent`, …) selected by `data-demo="<slug>"` on the wrapper, so a new vertical gets its own colours
without another stylesheet — utility navy for the electrician, warm cream for the restaurant, calm teal for the
clinic, near-black and indigo for the SaaS. Tailwind utilities like `bg-brand` resolve through those variables.

**Anything time-dependent is client-only.** The restaurant's "open now" badge (`OpenStatus`) renders nothing until
mounted, because the server has no idea what time it is where the visitor is. That is a genuine hydration mismatch, and
not the kind `suppressHydrationWarning` should hide. The `suppressHydrationWarning` on `<html>` in both root layouts is
for browser extensions that inject attributes before React hydrates; it covers that element's own attributes only.

**How a demo reaches the sales page.** Set `demo: { path, host }` on the solution in `content.ts` and
`components/solutions/SolutionDemo.tsx` swaps the placeholder art for `DemoFrame` — the live site in an iframe, with a
phone/desktop toggle and an "open full screen" link. Leave `demo: null` and you get the placeholder instead. That's the
only change needed per demo.

Demos are `noindex` (set in the `(demos)` layout) and disallowed in `robots.ts`: they are sales material, and four
near-identical small-business sites would be thin duplicate content competing with the pages that sell them.

Fixture content for each lives in `lib/demo/<slug>.ts`. It is deliberately not in `content.ts`: it is a stand-in
business, not site copy.

> **If you ever add security headers**, `X-Frame-Options` must be `SAMEORIGIN`, not `DENY` — `DENY` would break the
> embedded preview on every sales page. There are currently no such headers in `next.config.ts` or `infra/`.

## Before launch

Search the code for `[` to find placeholders:

- Project years (`PROJECTS` in `src/lib/content.ts`)
- `SITE.socials` in `src/lib/content.ts` (empty for now, so they are hidden in the footer, menu, contact page and ⌘K)

## Deploying to AWS

`main` deploys itself through GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) with
Terraform ([`infra/`](infra/)), into account `349631302124`, region `us-east-1`. [OpenNext](https://opennext.js.org)
(`open-next.config.ts`) turns the Next.js build into Lambda bundles:

```
CloudFront ─┬─ /_next/static/*, /work/* (public/)  → S3 "_assets/"
            ├─ /_next/image                         → API Gateway → Lambda "doless-image" (sharp)
            └─ everything else                      → API Gateway → Lambda "doless-server"
                                                        └─ prerendered pages from S3 "_cache/"
```

Pages are prerendered at build time and cached at the edge until the next deploy, which invalidates CloudFront.
The site URL (`NEXT_PUBLIC_SITE_URL`) is baked into the build: the custom domain if set, otherwise the CloudFront
domain, so the very first deploy builds twice.

One-time setup:

1. `AWS_PROFILE=thavisha infra/bootstrap.sh` creates the Terraform state bucket and the `doless-gha-deploy` role
   (trusts this repo's `main` branch and `production` environment through the account's GitHub OIDC provider).
2. In GitHub → Settings → Environments, create `production` (limit it to the `main` branch), then add:
   - variable `AWS_ROLE_ARN` = the role ARN the script printed
   - variable `SMTP_USER` and secret `SMTP_PASS` (the Gmail address and its App Password). The deploy runs without
     them, with a warning, but briefs and newsletter sign-ups can't reach you until they're set.
   - optional: variable `CONTACT_FROM_EMAIL`; secret `DATABASE_URL` (Neon, Supabase or any Postgres; migrations run
     on deploy; without it briefs and sign-ups are only emailed); variables `DOMAIN_NAME` +
     `ACM_CERTIFICATE_ARN` (a us-east-1 certificate) for a custom domain.
3. Push to `main` (or run the workflow by hand). The run summary shows the site URL.

Local plan: `npm run build:aws && AWS_PROFILE=thavisha terraform -chdir=infra init && AWS_PROFILE=thavisha terraform -chdir=infra plan`
(with `TF_VAR_smtp_user` / `TF_VAR_smtp_pass` set). Builds pick up a local `.env`, so deploy from CI rather than from a
machine that has one.

The rate limiter in `lib/actions.ts` is in-memory per Lambda instance; swap for Upstash or similar if you need it to be
global.

New briefs land in the `inquiries` table with `status = 'new'`. There's no admin UI yet; Drizzle Studio works for now.
Off-the-shelf quote requests land in the same table, with `source = 'off-the-shelf:<slug>'`, the picked add-on ids in
`addons`, and the computed estimate in `budget`. To see just those:

```sql
select created_at, name, email, solution, addons, budget, timeline
from inquiries where source like 'off-the-shelf:%' order by created_at desc;
```
