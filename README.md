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
  app/                    routes: /, /services, /services/[slug], /work, /work/[slug], /about, /contact, 404
  lib/content.ts          ALL copy and data (services, projects, FAQ, hero tasks...). Edit here.
  lib/actions.ts          server actions: submitInquiry, subscribe (zod validation, honeypot, rate limit)
  lib/inquiry.ts          contact form options + zod schema, shared by the form and the server action
  lib/mail.ts             SMTP transport (nodemailer) that emails each brief
  lib/gsap.ts             GSAP plugin registration + useGsap hook (scoped context, auto-cleanup)
  db/                     Drizzle schema + lazy connection
  components/
    shell/                header + to-do menu, command palette, page transition, cursor, preloader, footer, Lenis
    home/                 homepage sections (Hero is the scroll story)
    services/ work/ about/ contact/ sections/ ui/
  app/fonts/              self-hosted Bricolage Grotesque (variable) + JetBrains Mono
drizzle/                  SQL migrations
```

## The concept, by section

- **Hero:** "The to-do list that does itself". 14 tasks pile up (8 on phones). As you scroll, each one is ticked, tagged with what automates it, shrinks into an orange dot and flies into the head of the logo mark. The mark draws itself, leans back, and the name lands.
- **Header:** the logo pill lies down (mark goes flat, little z's) when you scroll down and sits back up when you scroll up or hover. The centre nav is a checklist; the current page is ticked off.
- **Menu:** a full-screen to-do list of the site. Pages you've visited this session are checked off ("3 of 5 done"). Press `1`–`5` anywhere to jump to a page, or `⌘K` / `Ctrl+K` for "lazy mode", a command palette.
- **Page transitions:** a curtain with the destination name ("→ Work") on every internal link.
- **Cursor:** the orange head of the mark, lagging lazily; grows with a label over links.
- Homepage also has a scroll-lit manifesto, a pinned horizontal services rail, a draggable before/after week, a process section where the mark reclines step by step, a hover-preview work list, a tools marquee, FAQ and a big CTA.

Everything respects `prefers-reduced-motion` (animations off, final states shown). Pinned sections fall back to stacked layouts below 1024px.

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
