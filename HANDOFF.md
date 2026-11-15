# Off the shelf — handoff

**As of 2026-11-15.** Everything below lives on branch `feat/off-the-shelf`, cut from `main` and not
merged. Payments are still unbuilt (see §3.2). Read this before touching the off-the-shelf feature;
the "Traps" section exists because each one cost real time to find.

---

## 1. What this feature is

Do Less Studios previously sold bespoke work only: a client arrives with requirements, we scope and
quote. Revenue was gated on inbound enquiries and every sale started from zero.

**Off the shelf** adds a second way to buy: four prebuilt websites with public fixed prices, a live
clickable demo each, and an itemised list of paid customisations. Tick no add-ons and you can buy the
site as-is; tick any and it routes to a quote form.

Decisions already made (do not re-litigate — the user chose these):

| | |
|---|---|
| Route | `/off-the-shelf`, `/off-the-shelf/[slug]` |
| Verticals | trades · restaurant/salon · clinic · startup/SaaS |
| Delivery | **done-for-you** — we deploy on their domain and hand over. Payment buys a build slot, not a download |
| Prices | $249 / $249 / $349 / $199, USD, paid in full up front |
| Buy flow | **hybrid** — 0 add-ons → instant checkout; 1+ → quote form |
| Payments | **Dodo Payments**, not Stripe |
| Currency | USD base; LKR appears at checkout via Dodo Adaptive Currency |
| Hosting/domain | deliberately off the public page; settled in conversation |

The original plan is at `~/.claude/plans/we-built-doless-recently-dreamy-tiger.md`.

---

## 2. What is DONE and verified

**Phase 1 — the catalog.** Complete and sellable by quote-and-invoice today.

- `SOLUTIONS` + `ADD_ONS` (16 add-ons, 4 groups) in `src/lib/content.ts`
- `/off-the-shelf` catalog with tag filtering; `/off-the-shelf/[slug]` detail pages
- `SolutionConfigurator` — add-on picker with running total and the hybrid CTA switch
- `SolutionQuoteForm` + `submitSolutionInquiry` + `sendSolutionInquiryEmail`
- Two nullable columns on `inquiries` (`solution`, `addons`), migration `drizzle/0001_off_the_shelf.sql`
- Nav, footer, ⌘K, page transitions, sitemap, robots, JSON-LD (`Service` + `Offer`)
- `src/components/ui/form.tsx` — `Chip`/`Err`/`field` extracted and shared with `BriefForm`

**Demos.** Four live, clickable demo sites, three pages each, embedded on the sales pages.

| Solution | Demo | Business | Pages |
|---|---|---|---|
| The Callout | `/demo/trades` | Volt Electric (electrician) | home · areas · quote |
| The Table | `/demo/restaurant` | Kolamba Kitchen (restaurant) | home · menu · booking |
| The Practice | `/demo/clinic` | Serendib Dental (dentist) | home · treatments & fees · appointment |
| The Launch | `/demo/startup` | Sheetfast (pre-launch SaaS) | home · pricing · waitlist |

Verified: clean `npm run build` with **no** `DODO_*`, `DATABASE_URL` or SMTP set; clean `npm run typecheck`;
all 22 routes 200; 22 schema/validation checks passed (including forged add-on ids rejected and the
email-header-injection guard); a real lead row inserted and read back from Postgres; zero Doless shell
leakage into any demo.

**What is NOT done: payments.** `src/lib/solutions.ts` returns `null`, so the buy button never renders
and both CTAs go to the quote form. No dead ends — this is intentional, not a bug.

---

## 3. Pending work

### 3.1 Prerequisite — confirm Dodo can actually pay Sri Lanka (blocks Phase 2 only)

Dodo's seller-eligibility list for Sri Lanka **is not publicly documented**. Before building checkout,
confirm with Dodo directly:

- Can a Sri Lankan entity onboard and pass KYC?
- Payout currency and destination (sources say USD/GBP/EUR; needs confirming for an LKR-settling bank)
- Fees against a $199 ticket: roughly 4% + $0.40, +1.5% international, +$5 per payout under $1,000 —
  about **$10–12 on a $199 sale**. Worth sanity-checking against the margin.

If Dodo can't serve Sri Lanka, Phase 1 still works (quote and invoice) and the payment provider can be
swapped — the capability flag in `src/lib/solutions.ts` is the only integration point in the UI.

### 3.2 Phase 2 — Dodo checkout

1. `npm i @dodopayments/nextjs` (Zod 4 peer already satisfied).
2. Create `src/lib/dodo.ts` (`import "server-only"`):
   - `dodoEnv()` returning `"live_mode"` only on an exact match — **the SDK defaults to live when unset**
   - `dodoKey()`, `dodoWebhookKey()` returning `null` when empty
   - `dodoReturnUrl()` derived from `SITE.url` (see trap #2)
   - `productIdFor(solution)` picking test/live from `solution.dodoProductId`
   - `fetchPayment(paymentId)` for the thanks page
3. Fill in `checkoutHrefFor()` in `src/lib/solutions.ts` — it already has the intended body in a comment.
   Return `null` unless both the API key and a product id exist. **Nothing else in the UI changes**;
   the configurator already handles both states.
4. Create `src/app/(site)/checkout/route.ts` — static `GET`, `export const dynamic = "force-dynamic"`,
   handler built **lazily inside the function** (trap #3), `cache-control: no-store`, and a 303 redirect
   to `/off-the-shelf?checkout=unavailable` when unkeyed so CI and un-keyed deploys don't 500.

   *Verified:* route handlers work **either** at the `app/` root or inside a route group, even with two
   root layouts — both were probed and both registered. `(site)` is suggested only for tidiness.

   *Static GET over session POST on purpose:* one product, qty 1, no cart or coupon, so sessions buy
   nothing. A GET makes the CTA a plain `<a href>` with no fetch/loading/error path on the one
   interaction that earns money. What's deprecated is the dynamic `/payments` proxy, not static checkout.
5. Create `/off-the-shelf/thanks` — `robots: { index: false }`. **Query params are not proof of payment.**
   Confirm in three tiers: `fetchPayment()` server-side (authoritative, also dodges the webhook race) →
   `orders` row lookup → a neutral "if it went through, the email is on its way" message. Never render a
   cancelled payment as success.
6. Env and infra: `.env.example`, `infra/variables.tf`, `infra/lambda.tf` `local.server_env`,
   `deploy.yml` `TF_VAR_dodo_*`, GitHub secrets. `DODO_PAYMENTS_ENVIRONMENT` goes in the **always-set**
   block (unset = live = dangerous); the keys go in the conditional `if v != ""` block.
7. Dodo dashboard: 4 products **per mode** (8 total) in USD with Adaptive Currency on; paste ids into
   `dodoProductId`. Webhook endpoint registered **separately in test and live**, each with its own key.
   **Do not deploy `CustomerPortal`** — the adaptor's portal handler does not authenticate callers and
   there are no user accounts here.

### 3.3 Phase 3 — orders and webhooks

1. `orders` table in `src/db/schema.ts`: `paymentId` text **NOT NULL UNIQUE** (the idempotency key),
   `solution`, `productId`, `name`, `email`, `amountCents`/`currency`,
   `settlementAmountCents`/`settlementCurrency`, `metadata` jsonb,
   `status` enum `paid|building|delivered|refunded|cancelled`, `emailed` bool, `createdAt`.
   Indexes on `created_at`, `status`, `email`. Generate the migration — see trap #4.
2. `src/app/(site)/api/webhook/dodo-payments/route.ts` — `Webhooks({...})` built lazily, `503` when
   unconfigured (Dodo retries, nothing lost).
3. `src/lib/orders.ts`:
   - Normalise defensively (`payload?.data?.payment_id ?? payload?.payment_id`) — the exact payload shape
     is the one thing that could not be verified offline
   - **Dedupe on `payment_id`** via `.onConflictDoNothing().returning({ id })`; empty array = retry →
     log and return **without emailing**
   - Null-db fallback: a capped module-scope `Set` of seen ids, same spirit as the rate limiter
   - Email studio then client, each in its own try/catch, then `UPDATE orders SET emailed = true`
   - **Always 200** once the signature verified and the row persisted, even if email failed — otherwise
     Dodo retries forever and duplicate-emails the client. If the insert itself throws, alert the studio
     and still return 200
   - **No `revalidatePath`/`revalidateTag`** (trap #5)
4. Two email senders in `src/lib/mail.ts` following the existing `rowsTable`/`esc`/null-on-missing-SMTP
   pattern: studio notification and client confirmation. Both must show **the amount Dodo actually
   charged**, never `priceCents`. The client email is explicitly **not** a tax invoice — Dodo is merchant
   of record and sends its own receipt.
5. README ops section: SQL one-liners for "what's in the build queue", since there is no admin UI.

### 3.4 Phase 4 — polish

- **Real demo screenshots** are no longer needed for the preview (the demos are live and embedded), but
  OG images still are. No `opengraph-image.tsx` exists anywhere; `summary_large_image` is declared and no
  image is served. Caveat: `next/og` on the arm64 Lambda needs a bundled font and adds weight.
- Homepage band after `ServicesRail`: "Or take one that already exists →"
- `scripts/check-dodo-prices.ts` + `npm run check:prices`: fail if a dashboard price disagrees with
  `priceCents`. Add to `deploy.yml` as a **non-blocking** warning, not to `ci.yml` (no key there).
- `webhook_events` table — only if events stop being 1:1 with a payment. `orders.payment_id` is enough today.
- Deeper demos (the sales pages advertise 7 pages; demos have 3). Decide whether the gap matters.

### 3.5 Open questions for the user

- **Hosting and domain ownership** was deferred and is still absent from the public pages. It needs an
  answer before the first real sale, even if only in the handover email.
- **`LKR_PER_USD` in `src/lib/money.ts` is a hardcoded 305**, display-only, last set 2026-11-15. Nothing
  charges at this rate, but it drifts. There is no reminder mechanism.
- **Base price vs margin.** At $199–$349 a done-for-you build is close to break-even once branding and
  content are done; the add-ons carry the margin. The user chose this knowingly. Revisit after ~5 sales.

### 3.6 Needs a human with a browser

Everything below was verified over HTTP, not visually:

- **Header nav at 1024–1200px.** The centre pill nav moved `lg:flex` → `xl:flex` because a fourth item
  collides with the logo and right-hand cluster. Confirm it looks deliberate.
- **"Off the shelf" in the full-screen menu at 320px** — three words, longer than any existing label,
  rendered at `clamp(2.6rem, 9vw, 6.5rem)`. May need a tighter clamp.
- The configurator's add-on toggles, running total and the 0→1 CTA switch.
- `prefers-reduced-motion: reduce` across the catalog and demos.

---

## 4. Traps — read before writing code

1. **`PageTransition` intercepts every same-origin `<a>` click** and does `router.push()`. Any link to a
   route handler (`/checkout`) or across root layouts (`/demo/*`) **must** carry `data-no-transition`,
   or it client-pushes and breaks. The existing buy button and demo links already do.
2. **Do not build `DODO_PAYMENTS_RETURN_URL` from `local.site_url` in `lambda.tf`.** It creates a
   Terraform cycle: distribution → apigw → integration → lambda env → distribution. Derive it in app code
   from `SITE.url` (already baked at build by `deploy.yml`) and treat the env var as a local override.
3. **CI builds with no secrets** (`npm ci && typecheck && build`). Any Dodo handler constructed at module
   scope with `process.env.X!` can throw during `next build`. **Build handlers lazily inside the request
   function**, matching `getDb()` → null and `getTransport()` → null.
4. **Migrations are drizzle-kit generated, not hand-written.** `drizzle/meta/_journal.json` and the
   snapshots must stay in sync. Run `npm run db:generate` (works offline, no DB needed). A hand-written
   `.sql` without a matching snapshot breaks the next generate. Renaming a generated file means editing
   its `tag` in `_journal.json` too.
5. **`tagCache: "dummy"` + `dangerous.disableTagCache`** in `open-next.config.ts`: never call
   `revalidatePath`/`revalidateTag`. Nothing in this feature needs to.
6. **CloudFront already routes `/api/*` and POST to the server Lambda** — verified in `infra/cdn.tf`:
   `default_cache_behavior` → `api` origin, all methods allowed, `Managed-AllViewerExceptHostHeader`
   forwards the webhook signature headers and raw body. **No Terraform routing change is needed.**
   But `local.public_paths` is generated from the build's asset fileset, so **never create `public/api/`
   or a top-level `public/checkout*`** — those would shadow the routes.
7. **There are two root layouts.** `app/(site)/` holds the marketing site, `app/(demos)/` the demos, and
   there is **no** top-level `app/layout.tsx`. A demo must not inherit the Doless shell. Consequences:
   navigating between a demo and the site is a full page load (inherent, fine); `not-found.tsx` lives in
   `(site)`; metadata files (`icon.svg`, `robots.ts`, `sitemap.ts`) stay at the `app/` root.
8. **`.next/dev/types` and `.next/types` can disagree mid-edit.** `tsconfig.json` includes both, so after
   adding or moving a route you may see bogus `validator.ts` errors like
   `Type '"/demo/x"' is not assignable to type 'LayoutRoutes'`. It is stale generated types, not your
   code. Run `npm run build`, or restart `next dev`, then re-check.
9. **A folder whose name starts with `_` is a private folder** and is excluded from routing entirely —
    no error, no route, it simply doesn't exist. Easy to lose half an hour to when a new `route.ts`
    "doesn't work". Same for the opposite confusion: `(name)` is a route group and does **not** appear
    in the URL.
10. **`src/db/index.ts` imports `server-only`**, so throwaway scripts importing it fail outside Next with
   *"This module cannot be imported from a Client Component"*. Use `psql` or a route for DB checks.
11. **If you ever add security headers, `X-Frame-Options` must be `SAMEORIGIN`, not `DENY`** — `DENY`
    blanks the embedded demo on every sales page. There are currently none in `next.config.ts` or `infra/`.
12. **`suppressHydrationWarning` on `<html>`** in both root layouts is for browser extensions injecting
    attributes pre-hydration (e.g. `data-ube-extension`). It covers that element's own attributes only.
    Anything genuinely time- or client-dependent must be client-only instead — see
    `components/demo/restaurant/OpenStatus.tsx`, which renders nothing until mounted because the server
    cannot know the visitor's local time.

---

## 5. Invariants — do not break these

- **The server recomputes every total from the catalog.** `submitSolutionInquiry` never trusts the
  numbers the configurator sent. Keep it that way.
- **Never re-state `priceCents` after payment.** The thanks page and both order emails must show the
  amount Dodo actually charged. This makes price drift a marketing bug, not a billing dispute.
- **Add-ons never touch checkout.** They route to a quote, so their prices carry no payment risk.
- **Everything tolerates `getDb()` returning `null`** and SMTP being unset. "The email reaching us or the
  row landing counts as received" is the existing pattern; follow it.
- **No demo form sends data anywhere**, and each says so in its confirmation. Don't wire them up.
- **All copy and data lives in `src/lib/content.ts`** (README contract). Demo fixtures are the exception:
  they live in `src/lib/demo/<slug>.ts` because they are a stand-in business, not site copy.
- Adding a solution requires an entry in `SOLUTIONS` **and** art + a label in `SolutionArt.tsx` — both are
  `Record<SolutionSlug, …>`, so TypeScript enforces it.

---

## 6. Running and verifying

```sh
npm install
docker compose up -d                                   # local Postgres
DATABASE_URL="postgres://doless:doless@localhost:5432/doless" npm run db:migrate
DATABASE_URL="postgres://doless:doless@localhost:5432/doless" npm run dev
```

Port 3000 is often taken by an unrelated Docker container on this machine; Next falls back to **3001**.
Check the dev server's own output rather than assuming 3000.

```sh
npm run typecheck
env -u DATABASE_URL -u SMTP_HOST -u SMTP_USER -u SMTP_PASS npm run build   # what CI does
npm run db:studio                                                          # read leads
```

Leads from the catalog:

```sql
select created_at, name, email, solution, addons, budget, timeline
from inquiries where source like 'off-the-shelf:%' order by created_at desc;
```

**Webhook testing needs a public HTTPS URL.** Tunnel it (`cloudflared tunnel --url http://localhost:3001`)
and register the tunnel as the **test-mode** endpoint. Then, in order:

1. Dashboard test event → 200, one row, two emails
2. **Resend the same event → 200, no second row, no second email** (the idempotency test; the one most
   likely to be wrong)
3. Bogus `webhook-signature` → **401**
4. Malformed JSON → 400
5. Stop Postgres, replay → 200 + studio alert, no retry storm
6. Full test purchase end-to-end, then refund it → `status = 'refunded'`

**Deployed smoke test — the key infra check:**

```sh
curl -i -X POST https://<site>/api/webhook/dodo-payments -d '{}'
```

A **401** proves CloudFront routed a POST to the server Lambda and the signature verifier ran. HTML, a
403 or a CloudFront error page means the routing assumption is wrong.

There is **no test framework and no linter** in this project. `typecheck` + `build` are the whole
automated safety net.

---

## 7. File map

```
src/lib/content.ts                      SOLUTIONS, ADD_ONS, NAV, SOLUTION_STEPS/FAQ — the data model
src/lib/money.ts                        USD minor units, the one formatter, display-only LKR rate
src/lib/solutions.ts                    checkoutHrefFor() — the capability flag. PHASE 2 STARTS HERE
src/lib/solutionInquiry.ts              quote schema, built from inquirySchema
src/lib/actions.ts                      submitSolutionInquiry + the honeypot/rate-limit/clientIp helpers
src/lib/mail.ts                         rowsTable(), sendSolutionInquiryEmail — order emails go here
src/lib/demo/<slug>.ts                  fixture content for each demo's fake business

src/app/(site)/off-the-shelf/           catalog + detail pages
src/app/(demos)/                        demo root layout; demo/<slug>/ per vertical
src/app/demo.css                        demos' theme + per-demo palettes (data-demo="<slug>")

src/components/solutions/               SolutionGrid, SolutionConfigurator, SolutionQuoteForm,
                                        SolutionDemo, DemoFrame, SolutionArt
src/components/demo/                    DemoBar + per-vertical marks and forms
src/components/ui/form.tsx              Chip/Err/field, shared with BriefForm

drizzle/0001_off_the_shelf.sql          the two nullable inquiries columns
infra/cdn.tf, infra/lambda.tf           routing (already fine) and server_env (needs Dodo vars)
```

Also read the **Off the shelf** and **Demos** sections of `README.md`, which document the architecture
for anyone touching it later.
