# Off the shelf — handoff

**As of 2026-11-15.** Everything below lives on branch `feat/off-the-shelf`, cut from `main` and not
merged. **Phases 1, 2 and 3 are built** — catalog, demos, Dodo checkout, orders and webhooks. What is
left is configuration (a Dodo account, product ids, keys) and §3.4 polish. Read this before touching
the off-the-shelf feature; the "Traps" section exists because each one cost real time to find.

**Commit on the branch, never on `main`.** A push to `main` runs `deploy.yml` — terraform apply to
production. Every other branch runs `ci.yml` (`npm ci && typecheck && build`, no secrets set) and
deploys nothing. The branch is pushed to `origin` and its CI is green.

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
- Two columns on `inquiries` — `solution text` (nullable) and `addons text[] NOT NULL DEFAULT '{}'`
  (empty array, never null) — migration `drizzle/0001_off_the_shelf.sql`
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

**Phase 2 — Dodo checkout.** Built. `src/lib/dodo.ts` (all config read inside functions, null when
unset), `checkoutHrefFor()` filled in, `/checkout` as a static GET, and `/off-the-shelf/thanks` with
three-tier confirmation.

**Phase 3 — orders and webhooks.** Built. `orders` table (migration `drizzle/0002_orders.sql`),
`/api/webhook/dodo-payments`, `src/lib/orders.ts`, and the two order emails in `src/lib/mail.ts`.

Verified locally: clean `npm run typecheck`; clean unkeyed `npm run build` with no `DODO_*`,
`DATABASE_URL` or SMTP set; unkeyed `/checkout` → 303 to the catalog, unkeyed webhook → 503, and the
thanks page refusing to call a forged `status=succeeded` a sale. Then, with a self-signed webhook key
and a throwaway product id: the buy button baked into the prerendered HTML for the configured
solution only, a signed `payment.succeeded` → 200 and one row, **the same payment replayed under a
different `webhook-id` → 200 and still one row**, bad signature → 401, `refund.succeeded` →
`status = 'refunded'`, `payment.failed` → 200 and no row, and Postgres stopped mid-event → 200 plus
an unrecorded-payment alert rather than a retry storm.

**What is NOT done: configuration.** All eight `dodoProductId` values in `content.ts` are still
`null` and no keys are set, so the feature is dormant exactly as before — buy buttons hidden, every
CTA routing to the quote form. See §3.1 and "What is left" below.

---

## 3. Pending work

### 3.1 Prerequisite — confirm Dodo can actually pay Sri Lanka (blocks going live, not the code)

Dodo's seller-eligibility list for Sri Lanka **is not publicly documented**. Checkout is built, but
nothing can be sold through it until this is answered. Confirm with Dodo directly:

- Can a Sri Lankan entity onboard and pass KYC?
- Payout currency and destination (sources say USD/GBP/EUR; needs confirming for an LKR-settling bank)
- Fees against a $199 ticket: roughly 4% + $0.40, +1.5% international, +$5 per payout under $1,000 —
  about **$10–12 on a $199 sale**. Worth sanity-checking against the margin.

If Dodo can't serve Sri Lanka, Phase 1 still works (quote and invoice) and the payment provider can be
swapped — the capability flag in `src/lib/solutions.ts` is the only integration point in the UI.

### 3.2 / 3.3 — BUILT. What is left is configuration

The code is in place and dormant. To switch it on:

1. **Create 4 products per mode (8 total)** in the Dodo dashboard, USD, Adaptive Currency on, and
   paste the ids into the `dodoProductId` slots in `src/lib/content.ts` (lines ~277, 320, 363, 406).
2. **Register the webhook** at `https://<site>/api/webhook/dodo-payments`, **separately in test and
   live**, each with its own signing key. Subscribe to **only** `payment.succeeded`,
   `payment.failed` and `refund.succeeded` — the adaptor validates against a closed schema and
   answers **400** for an event type it doesn't know, so subscribing to everything manufactures
   errors.
3. **Local**: set `DODO_PAYMENTS_*` in `.env` (see `.env.example`).
   **Production**: GitHub `production` environment — secrets `DODO_API_KEY`, `DODO_WEBHOOK_KEY`,
   variable `DODO_ENVIRONMENT`.
4. **Redeploy.** Not optional — see trap #13.
5. **Do not deploy `CustomerPortal`** — the adaptor's portal handler does not authenticate callers
   and there are no user accounts here.

#### What the original plan got wrong, found while building it

- **The adaptor's `Checkout` GET returns JSON**, `NextResponse.json({ checkout_url })`, not a
  redirect. A plain `<a href="/checkout">` straight at it would land the buyer on raw JSON. Our
  route unwraps it and issues the 303 itself, which is what preserves the plain-link design.
- **`checkoutHrefFor()` runs at build time** (trap #13), so the *build* needs the key and the mode.
  `deploy.yml` passes them to the build step; without that the buy button is absent from the
  deployed HTML however correctly Terraform sets the Lambda's environment.
- **Two packages, not one.** `@dodopayments/nextjs` depends on `@dodopayments/core`, not on
  `dodopayments`; the REST SDK used by `fetchPayment()` is a separate explicit dependency.
- **The payload shape no longer needs guessing.** The adaptor Zod-validates before our handlers
  run, so `data` is typed: the envelope is `{ business_id, type, timestamp, data }` and the payment
  carries `payment_id`, `total_amount`, `currency`, `settlement_amount`, `settlement_currency`,
  `customer.{name,email}`, `metadata` and `product_cart[]`. There is **no top-level `product_id`** —
  it is `product_cart[0].product_id`.
- **Webhook status codes, measured:** bad signature → **401**; valid JSON that doesn't match the
  schema, including an unknown event type → **400**; **unparseable JSON → 500, not 400** (the
  verifier JSON-parses internally, and a `SyntaxError` isn't a verification error). The old §6
  expectation of 400 for malformed JSON was wrong. Dodo never sends malformed JSON, so this is a
  documentation fix rather than a problem.
- **`force-dynamic` is belt-and-braces.** Route handlers aren't cached by default in Next 16, and
  `dynamic`/`revalidate` are only removed when Cache Components is enabled, which `next.config.ts`
  does not do. What actually keeps CloudFront off `/checkout` is the `no-store` header, because the
  default cache behaviour does list GET in `cached_methods`.

### 3.4 Phase 4 — polish

- **Real demo screenshots** are no longer needed for the preview (the demos are live and embedded), but
  OG images still are. No `opengraph-image.tsx` exists anywhere; `summary_large_image` is declared and no
  image is served. Caveat: `next/og` on the arm64 Lambda needs a bundled font and adds weight.
- Homepage band after `ServicesRail`: "Or take one that already exists →"
- `scripts/check-dodo-prices.ts` + `npm run check:prices`: fail if a dashboard price disagrees with
  `priceCents`. Add to `deploy.yml` as a **non-blocking** warning, not to `ci.yml` (no key there).
- `webhook_events` table — only if events stop being 1:1 with a payment. `orders.payment_id` is enough today,
  and the replay test confirms it.
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

13. **`checkoutHrefFor()` runs at BUILD time, not per request.** The detail pages are prerendered via
    `generateStaticParams`, so whether the buy button exists is baked into the HTML. Consequences:
    the *build* needs `DODO_PAYMENTS_API_KEY` and `DODO_PAYMENTS_ENVIRONMENT` (deploy.yml passes
    both to the build step), the mode chosen at build decides whether test or live product ids get
    baked, and **turning payments on or off requires a redeploy** — changing the Lambda's
    environment alone does nothing to the button. The `/checkout` route and the webhook *are*
    per-request, so they pick up env changes immediately; only the button is baked.

14. **Subscribe the webhook to only the three events we handle.** The adaptor validates against a
    closed schema and answers 400 for an unrecognised event type, so a "send me everything"
    subscription produces a stream of 400s and Dodo retries on them.


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

**Webhook behaviour was already verified without a Dodo account**, by signing events with a key we
chose ourselves — the harness is 60 lines of Node (HMAC-SHA256 over `{webhook-id}.{timestamp}.{body}`,
base64, sent as `webhook-signature: v1,<sig>`; the secret is the key with `whsec_` stripped and
base64-decoded). Worth rebuilding if this path ever changes, because it tests the thing most likely
to be wrong without waiting on anyone.

Measured status codes, so there's no need to re-derive them:

| Case | Answer |
|---|---|
| Valid signed `payment.succeeded` | **200**, one row, two emails attempted |
| Same payment replayed, any `webhook-id` | **200**, no second row, no second email |
| Bogus `webhook-signature` | **401** |
| Valid JSON, wrong shape — including an unknown event type | **400** |
| Unparseable JSON | **500** (not 400 — the verifier JSON-parses internally) |
| Postgres down | **200** + unrecorded-payment alert, no retry storm |
| `refund.succeeded` | **200**, `status = 'refunded'` |
| `payment.failed` | **200**, no row |

**A real end-to-end purchase still needs a public HTTPS URL.** Tunnel it
(`cloudflared tunnel --url http://localhost:3001`), register the tunnel as the **test-mode** endpoint,
and set `DODO_PAYMENTS_RETURN_URL` to the tunnel so the thanks page is reachable. Then: a full test
purchase, and a refund of it. That is the part no amount of local signing can stand in for — it is
also the one chance to confirm the real payload matches the schema the adaptor expects.

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
src/lib/solutions.ts                    checkoutHrefFor() — the capability flag (runs at BUILD time)
src/lib/dodo.ts                         Dodo config, all read inside functions; fetchPayment()
src/lib/orders.ts                       webhook -> orders row, the idempotency gate, never throws
src/lib/solutionInquiry.ts              quote schema, built from inquirySchema
src/lib/actions.ts                      submitSolutionInquiry + the honeypot/rate-limit/clientIp helpers
src/lib/mail.ts                         rowsTable(), sendSolutionInquiryEmail — order emails go here
src/lib/demo/<slug>.ts                  fixture content for each demo's fake business

src/app/(site)/off-the-shelf/           catalog + detail pages + thanks/
src/app/(site)/checkout/route.ts        static GET -> unwraps the adaptor's JSON -> 303 to Dodo
src/app/(site)/api/webhook/dodo-payments/route.ts   signature verify -> orders.ts
src/app/(demos)/                        demo root layout; demo/<slug>/ per vertical
src/app/demo.css                        demos' theme + per-demo palettes (data-demo="<slug>")

src/components/solutions/               SolutionGrid, SolutionConfigurator, SolutionQuoteForm,
                                        SolutionDemo, DemoFrame, SolutionArt
src/components/demo/                    DemoBar + per-vertical marks and forms
src/components/ui/form.tsx              Chip/Err/field, shared with BriefForm

drizzle/0001_off_the_shelf.sql          inquiries.solution (nullable) + inquiries.addons (not null)
drizzle/0002_orders.sql                 orders table; payment_id UNIQUE is the idempotency key
infra/cdn.tf, infra/lambda.tf           routing (already fine) and server_env (needs Dodo vars)
```

Also read the **Off the shelf** and **Demos** sections of `README.md`, which document the architecture
for anyone touching it later.
