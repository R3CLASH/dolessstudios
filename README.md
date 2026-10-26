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

The site renders without a database. The newsletter needs `DATABASE_URL`; without it it shows a friendly "offline" message and logs a server error.

Contact form briefs are emailed to `CONTACT_TO_EMAIL` over SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`; see `.env.example`) and also saved to Postgres when `DATABASE_URL` is set. A brief counts as received if either works; if neither does, the visitor is told it didn't send. The form is validated in the browser for instant feedback and again on the server with the same zod schema (`src/lib/inquiry.ts`).

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
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

- `SITE.email` and `SITE.socials` in `src/lib/content.ts` (empty for now, so they are hidden in the footer, menu, contact page and ⌘K)
- Project years and the Aito Auto status (`PROJECTS`)
- Reply time on the contact success screen (`[two working days]`)
- Optional starting price in the FAQ
- Budget ranges in `src/components/contact/BriefForm.tsx` are examples
- Project covers are illustrated SVGs (`ProjectCover.tsx`); swap in real screenshots with `next/image` when you have them

## Deploying

Any Node host works. On Vercel: add `DATABASE_URL` (Neon, Supabase or any Postgres), `NEXT_PUBLIC_SITE_URL` and the `SMTP_*` / `CONTACT_*` email settings, then run `npm run db:migrate` once against that database. The rate limiter in `lib/actions.ts` is in-memory per instance; swap for Upstash or similar if you need it to be global.

New briefs land in the `inquiries` table with `status = 'new'`. There's no admin UI yet; Drizzle Studio works for now.
