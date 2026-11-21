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
  lib/dodo.ts             Dodo config, the brand theme sent to checkout, createCheckoutSession()
  lib/orders.ts           webhook -> orders row, idempotent on payment_id, never throws
  lib/orderRef.ts         the "DLS-…" reference (derived from payment_id) + signed /orders links
  lib/ratelimit.ts        per-IP in-memory limiter, shared by the server actions and /api routes
  db/                     Drizzle schema + lazy connection
  components/
    shell/                header + to-do menu, command palette, page transition, cursor, preloader, footer, Lenis
    home/                 homepage sections (Hero is the scroll story)
    services/ work/ about/ contact/ sections/ ui/
  app/fonts/              self-hosted Bricolage Grotesque (variable) + JetBrains Mono
drizzle/                  SQL migrations
```

## Buying off the shelf

Four prebuilt sites with public fixed prices. Tick no add-ons and you can buy one outright; tick
any and it routes to a quote form instead. The money path:

```
/off-the-shelf/[slug]          the sales page; SolutionConfigurator decides buy vs quote
/off-the-shelf/[slug]/buy      OUR checkout page — order summary + Dodo's frame embedded in it
POST /api/checkout/session     mints the themed Dodo session (force-dynamic, no-store)
  -> Dodo takes the payment, then redirects to:
/off-the-shelf/thanks          verifies server-side, shows the order reference
POST /api/webhook/dodo-payments  writes the orders row and sends both emails
/orders/[ref]?t=…              the buyer's order page, opened from the confirmation email
```

Things that look like choices but aren't:

- **Dodo owns the card fields.** They are the Merchant of Record, which is what makes them
  responsible for sales tax in ~70 jurisdictions. Their checkout frame is embedded in our page via
  `dodopayments-checkout` in `displayType: "inline"`, themed from `BRAND_THEME` in `lib/dodo.ts`.
  We never see a card number, and a hand-built payment form is not an option.
- **No client event proves payment.** Dodo publish no `checkout.completed` and no client-side
  payment id. `/off-the-shelf/thanks` re-verifies server-side in three tiers (ask Dodo, then our
  own row, then commit to nothing), and the webhook is the real record.
- **The order reference is derived from the payment id,** not random — see `lib/orderRef.ts`. That
  is what lets the thanks page print it before the webhook has landed.
- **`/orders/[ref]` is gated by an HMAC in the link,** not by a login. There are no user accounts;
  `CustomerPortal` from the Dodo adaptor must not be deployed, because it doesn't authenticate.
- **Order status is advanced by hand** in `npm run db:studio`. The `orders` table is the build
  queue; there is deliberately no admin UI.

`/checkout` (the older static-link route) still exists as the hosted fallback and is the route the
Sri Lanka payout test runs through. See `HANDOFF.md`.

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

Infrastructure and application code deploy through **two separate workflows**, into account
`349631302124`, region `us-east-1`:

| | [`.github/workflows/infra.yml`](.github/workflows/infra.yml) | [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) |
|---|---|---|
| Owns | [`infra/`](infra/) — the AWS shape | the app: assets, Lambda code, DB schema |
| Runs | `fmt`/`validate` on PRs; apply by hand (**Run workflow**) | automatically on every push to `main` |
| Terraform | yes | **never** |

[OpenNext](https://opennext.js.org) (`open-next.config.ts`) turns the Next.js build into Lambda bundles:

```
CloudFront ─┬─ /_next/static/*, /work/* (public/)  → S3 "_assets/"
            ├─ /_next/image                         → API Gateway → Lambda "doless-image" (sharp)
            └─ everything else                      → API Gateway → Lambda "doless-server"
                                                        └─ prerendered pages from S3 "_cache/"
```

Pages are prerendered at build time and cached at the edge until the next deploy, which invalidates CloudFront.
The site URL (`NEXT_PUBLIC_SITE_URL`) is baked into the build.

**Terraform does not own the Lambda code.** It creates both functions from `infra/placeholder/` (which answers 503)
and then ignores the code attributes, so a plan needs no build and a code deploy needs no apply. `deploy.yml` ships
the real bundles with `aws lambda update-function-code`. The consequence: a function that Terraform has just created
or *replaced* serves 503 until `deploy.yml` runs.

**How the workflows talk to each other.** `terraform apply` writes one JSON SSM parameter,
`/doless/deploy-targets` (`aws_ssm_parameter.deploy_targets` in `infra/outputs.tf`), holding the bucket,
distribution id, site URL, function names and the CloudFront `public_paths`. `deploy.yml` reads it instead of
running `terraform output`. If it is missing, the deploy fails with a message telling you to apply infra first.

**Order matters for a commit that changes both.** Infra is applied by hand while code deploys itself, so apply
infra *first*. `deploy.yml` guards the case it can detect — a new top-level folder in `public/` without its
CloudFront behavior — and fails before building. A new Lambda environment variable is **not** guarded; apply infra
before merging code that needs one.

One-time setup:

1. `AWS_PROFILE=thavisha infra/bootstrap.sh` creates the Terraform state bucket and the `doless-gha-deploy` role
   (trusts this repo's `main` branch and `production` environment through the account's GitHub OIDC provider).
2. In GitHub → Settings → Environments, create `production` (limit it to the `main` branch), then add:
   - variable `AWS_ROLE_ARN` = the role ARN the script printed
   - variable `SMTP_USER` and secret `SMTP_PASS` (the Gmail address and its App Password). The deploy runs without
     them, with a warning, but briefs and newsletter sign-ups can't reach you until they're set.
   - optional: variable `CONTACT_FROM_EMAIL`; secret `DATABASE_URL` (Neon, Supabase or any Postgres; migrations run
     on deploy; without it briefs and sign-ups are only emailed).
   - optional, for instant checkout: secrets `DODO_API_KEY` and `DODO_WEBHOOK_KEY`, plus variable
     `DODO_ENVIRONMENT` (`test_mode` or `live_mode`; defaults to `test_mode`). Without the keys both
     workflows still succeed, with a warning, and every CTA routes to the quote form. `live_mode` with
     either key missing fails the run on purpose. Note the keys are read by **both** workflows: Infra
     puts them on the Lambda, Deploy needs the API key at build time because the buy button is baked
     into the prerendered HTML. The `dodoProductId` values in `content.ts` have to be filled in too,
     so switching payments on is a redeploy, not an env change.
3. Run **Infra** → *Run workflow* on `main`. Read the plan in the run summary; the apply follows it.
4. Push to `main` (or run **Deploy** by hand) to put the real code on the Lambdas. The run summary shows the site URL.

Steps 3 and 4 are also the recovery order if a function ever gets replaced.

Infra can only be applied from `main`: the role's trust policy allows `refs/heads/main` and the `production`
environment, nothing else, and the workflow fails fast rather than dying inside the AWS login. PR checks run
`fmt`/`validate` with **no AWS credentials at all** — this repo is public, and anything that can read
`prod/terraform.tfstate` can read `smtp_pass` and `database_url` in plaintext, since Terraform stores variable
values there unencrypted whatever `sensitive = true` says. For the same reason no plan is ever uploaded as an
artifact. If you want a second pair of eyes on infra, do **not** add required reviewers to `production` — that
would gate every code deploy too, because `deploy.yml` needs that environment for `DATABASE_URL`. Create a
separate environment and add `repo:<owner>/<repo>:environment:<name>` to the trust policy in `infra/bootstrap.sh`.

**Rolling back code** needs no rebuild. Bundles are kept at `s3://<site bucket>/_lambda/<commit sha>/` for 30 days,
and `infra/upload.sh` never deletes, so the previous build's `_next/` chunks and `_cache/` entries are still there:

```
aws lambda update-function-code --function-name doless-server \
  --s3-bucket <site bucket> --s3-key _lambda/<old sha>/server.zip
aws lambda update-function-code --function-name doless-image \
  --s3-bucket <site bucket> --s3-key _lambda/<old sha>/image.zip
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

Migrations are **not** covered by that: `drizzle-kit` is forward-only, so a migration must stay
backwards-compatible with the code it may be rolled back to. `deploy.yml` runs migrations *before* updating the
Lambda code for the same reason — old code against the new schema is the safe direction.

The custom domain is **not** a GitHub variable — it lives in `infra/variables.tf`, so it is visible in review:
`domain_name` (the root domain) and `acm_certificate_arn`. The distribution serves the apex and `www`, and
`canonical_host` ("www" or "apex") picks the one baked into `NEXT_PUBLIC_SITE_URL`. The certificate must be in
us-east-1 and cover **both** hostnames: a `*.<domain>` wildcard does not match the bare apex, so a wildcard-only
certificate cannot serve `dolessstudios.com`.

DNS is on Cloudflare and is not managed by Terraform. Both records are DNS-only (grey cloud), pointing at the
distribution from `terraform -chdir=infra output cloudfront_distribution_id`: the apex is a CNAME to
`<id>.cloudfront.net` (Cloudflare flattens it at the root) and `www` is a CNAME to the same name. Proxying either
record through Cloudflare would put a second TLS hop in front of CloudFront and needs SSL mode Full (strict).

Local plan — no build needed, nothing in `infra/` reads the build output any more:
`AWS_PROFILE=thavisha terraform -chdir=infra init && AWS_PROFILE=thavisha terraform -chdir=infra plan`
(with `TF_VAR_smtp_user` / `TF_VAR_smtp_pass` set). Builds pick up a local `.env`, so deploy from CI rather than
from a machine that has one.

The rate limiter in `lib/actions.ts` is in-memory per Lambda instance; swap for Upstash or similar if you need it to be
global.

New briefs land in the `inquiries` table with `status = 'new'`. There's no admin UI yet; Drizzle Studio works for now.
