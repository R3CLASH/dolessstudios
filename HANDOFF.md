# Off the shelf — handoff

**As of 2026-11-21.** **Phases 1, 2, 3 and the custom checkout are built.** Catalog, demos, Dodo
checkout, orders and webhooks are all deployed and all dormant: every `dodoProductId` slot is `null`
and no key is set, so no buy button renders and every CTA routes to the quote form. What is left is
configuration (a Dodo account, product ids, keys) and §3.4 polish. Read this before touching the
off-the-shelf feature; the "Traps" section exists because each one cost real time to find.

**Commit on a branch, never on `main`.** Since `917a13b` the pipeline is two workflows, and the
difference matters for everything below:

| | `deploy.yml` (Deploy) | `infra.yml` (Infra) |
|---|---|---|
| Trigger | automatic on push to `main` | **`workflow_dispatch` only**, main-only |
| Runs Terraform | **never** | validate on PR (no credentials), then plan → apply |
| Targets from | SSM `/doless/deploy-targets`, written by apply | Terraform state |
| Lambda code | `update-function-code`, keyed by `$GITHUB_SHA` | never — `ignore_changes` on the code attributes; functions are created from `infra/placeholder` |

So a push to `main` deploys **code only**. Infra changes need a deliberate manual run. Every other
branch runs `ci.yml` (`npm ci && typecheck && build`, no secrets set) and deploys nothing.

---

## 1. What this feature is

Do Less Studios previously sold bespoke work only: a client arrives with requirements, we scope and
quote. Revenue was gated on inbound enquiries and every sale started from zero.

**Off the shelf** adds a second way to buy: six prebuilt websites with public fixed prices, a live
clickable demo each, and an itemised list of paid customisations. Tick no add-ons and you can buy the
site as-is; tick any and it routes to a quote form.

Decisions already made (do not re-litigate — the user chose these):

| | |
|---|---|
| Route | `/off-the-shelf`, `/off-the-shelf/[slug]` |
| Verticals | trades · restaurant/salon · clinic · hotel/villa · classes/institute · exporter/maker |
| Delivery | **done-for-you** — we deploy on their domain and hand over. Payment buys a build slot, not a download |
| Prices | LKR 89,990 / 89,990 / 119,990 / 129,990 / 79,990 / 139,990, paid in full up front, and that is what the site now shows as the price. The dollar figures beside them are derived at `LKR_PER_USD` and drift with the rate, so they are always rendered behind a `≈` and never used anywhere binding. See the header comment in `src/lib/money.ts`. |
| Buy flow | **hybrid** — 0 add-ons → instant checkout; 1+ → quote form |
| Payments | **Dodo Payments**, not Stripe |
| Currency | **LKR base** — `BASE_CURRENCY`, every `priceCents` in the catalog, and what Dodo charges. An overseas card is converted *from* the rupee price by Adaptive Currency at Dodo's own rate, shown to the buyer before they confirm. Payouts still settle to us in USD. |
| Hosting/domain | deliberately off the public page; settled in conversation |

The original plan is at `~/.claude/plans/we-built-doless-recently-dreamy-tiger.md`.

### 1.1 The catalog was refocused on Sri Lanka (2026-11-21)

The site sells into Sri Lanka, so every prebuilt had to be one we can actually *deliver* here.
Audited against that, three of the original four held and one did not.

**Retired: The Launch** (startups & SaaS, LKR 69,990, `/demo/startup`, demo host `sheetfast.io`).
Its audience was written for Western indie hackers — "pre-launch SaaS", "side projects", Core Web
Vitals, "wrestling a page builder at 1am" — it was the cheapest and thinnest-margin product on the
shelf, and SaaS founders are the segment most likely to build their own landing page. Both its sales
page and its demo were live and prerendered, so `next.config.ts` now 308s `/off-the-shelf/startup`
and `/demo/startup/*` to `/off-the-shelf` rather than letting them 404.

**Added**, each chosen because the whole build is static pages, a form and WhatsApp — no geo-blocked
dependency, nothing needing a TRCSL filing:

| | Why this vertical |
|---|---|
| **The Stay** (LKR 129,990) | Booking sites take 15–20% of the rate. A direct-booking enquiry site pays for itself in one or two bookings, and the buyer earns in USD/EUR, which is why it carries the top price. Enquiry-only on purpose: live inventory is on the honest-limits list. |
| **The Class** (LKR 79,990) | Tuition is one of the largest informal industries in the country, and its timetables and fees currently live in WhatsApp groups. Replaces The Launch as the cheap, fast entry product with a far better-fitting buyer. The Sinhala/Tamil add-on sells itself here. |
| **The Supplier** (LKR 139,990) | Tea, spice, apparel and gem exporters are judged by foreign buyers on a website from 2011. Lowest price sensitivity of the six, and it takes over The Launch's "credibility to an outside audience" slot while actually being a Sri Lankan business. |

One add-on was added with them: `int-catalogue` (Catalogue download, LKR 24,990, `only: ["supplier"]`).

**Copy that hard-coded "four" is now derived** from `SOLUTION_COUNT` / `SOLUTION_COUNT_WORD` in
`src/lib/content.ts`, and the catalog aside's shortest turnaround is computed from `SOLUTIONS`
rather than typed. The count had already drifted once; it should not drift again.

**Still open:** the three new solutions have `dodoProductId: { test: null, live: null }`, so they
route to the quote form in every mode until products exist for them in the Dodo dashboard. See §3.2
step 1.

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

**Demos.** Six live, clickable demo sites, three pages each, embedded on the sales pages.

| Solution | Demo | Business | Pages |
|---|---|---|---|
| The Callout | `/demo/trades` | Volt Electric (electrician) | home · areas · quote |
| The Table | `/demo/restaurant` | Kolamba Kitchen (restaurant) | home · menu · booking |
| The Practice | `/demo/clinic` | Serendib Dental (dentist) | home · treatments & fees · appointment |
| The Stay | `/demo/stay` | Palm House (Galle Fort villa) | home · rooms & rates · enquire |
| The Class | `/demo/classes` | Vidura Institute (A/L tuition) | home · timetable · register |
| The Supplier | `/demo/supplier` | Ceylon Leaf Exports (tea exporter) | home · products · quote |

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

**Researched 2026-11-20 against Dodo's own accepted-countries and payout pages. Half-answered.**

- **Sri Lanka is on the accepted list** (item 150), for merchant accounts *and* payouts. The rule is
  that eligibility keys off **the country that issued the government ID you verify with**, not where
  the company is registered or pays tax. India, Nepal, Maldives and Bhutan are listed too; Pakistan
  and Afghanistan are not, and Bangladesh is only grandfathered. So **onboarding is very likely a
  yes — the payout leg is the real unknown.**
- **Payout currency is USD, GBP or EUR, never LKR.** The LK bank receives USD and converts at its own
  rate. Intermediary bank charges apply on top, plus a possible $5 fee on payouts under $1,000.
- **The minimum payout threshold is $50 and cannot be lowered** (only raised, from Settings →
  Payouts), and it is measured *after* fees. A $1 test product therefore proves nothing: the balance
  sits there forever and no payout is ever initiated.
- **Payout dates are fixed.** The 1st–15th pays out on the 18th; the 16th–end-of-month pays out on
  the **4th** of the following month, then 1–5 business days to arrive. Daily payouts are explicitly
  unavailable, so this question cannot be answered quickly.
- **Live mode requires the site to carry public pricing, Terms, a Privacy Policy, a Refund &
  Cancellation Policy and a contact route.** All five are now deployed — the three policy documents
  landed with this merge, pricing came with the catalog, `/contact` already existed.
- **Verification timing:** identity/business 24–72 working hours, bank info 1–2 working days, and
  payouts additionally need Bank Verification approved **plus** a completed Monitoring Review.

What remains is the empirical test: onboard with an LK ID and LK bank, sell one **$60** product on
production (above the $50 floor after fees — about $56.30 nets through), and confirm the payout
lands. **Do not refund that payment**; a refund reverses it and the payout never happens, which
destroys the only thing being measured. Note the test product is not a catalog solution, so it needs
the `DODO_TEST_PRODUCT_ID` hatch in `/checkout` — the route rejects any product id not in the
catalog, by design.

Stage 3 of that test — onboarding plus bank verification — **costs nothing and answers most of the
question.** Only if it passes is there any reason to spend $60.

If Dodo can't serve Sri Lanka, Phase 1 still works (quote and invoice) and the payment provider can be
swapped — the capability flag in `src/lib/solutions.ts` is the only integration point in the UI.

### 3.2 / 3.3 — BUILT. What is left is configuration

The code is in place and dormant. To switch it on:

1. **Create 6 products per mode (12 total)** in the Dodo dashboard, **LKR**, Adaptive Currency on, and
   paste the ids into the `dodoProductId` slots in `src/lib/content.ts` — one per entry in `SOLUTIONS`.
   The price on the Dodo product must equal `priceCents` **exactly**; the rupee figure on the page is
   the price, and a mismatch means the buyer is charged something the site never quoted.

   | Slug | Product | Price (LKR) | `priceCents` | Test id today |
   |---|---|---|---|---|
   | `trades` | The Callout | 89,990 | `8_999_000` | ✅ exists |
   | `restaurant` | The Table | 89,990 | `8_999_000` | ✅ exists |
   | `clinic` | The Practice | 119,990 | `11_999_000` | ✅ exists |
   | `stay` | The Stay | 129,990 | `12_999_000` | ❌ create |
   | `classes` | The Class | 79,990 | `7_999_000` | ❌ create |
   | `supplier` | The Supplier | 139,990 | `13_999_000` | ❌ create |

   So the outstanding work is **3 new test products and all 6 live products**. A `null` id is not a
   bug in test mode — that solution routes to the quote form while the others can be bought — but in
   **live mode it is now a build failure**, see below.
2. **Register the webhook** at `https://<site>/api/webhook/dodo-payments`, **separately in test and
   live**, each with its own signing key. Subscribe to **only** `payment.succeeded`,
   `payment.failed` and `refund.succeeded` — the adaptor validates against a closed schema and
   answers **400** for an event type it doesn't know, so subscribing to everything manufactures
   errors.
3. **Local**: set `DODO_PAYMENTS_*` in `.env` (see `.env.example`).
   **Production**: GitHub `production` environment — secrets `DODO_API_KEY`, `DODO_WEBHOOK_KEY`,
   variable `DODO_ENVIRONMENT`. **Set the secrets before the mode variable**: both workflows refuse
   a `live_mode` run with an empty key, on purpose.
4. **Run Infra (apply), then Deploy — in that order.** Not optional, and not one step; see traps #13
   and #15. Infra puts the keys on the Lambda; Deploy bakes the button into the HTML.
5. **A live_mode build refuses a half-sellable catalog.** `assertLiveCatalogSellable()` in
   `src/lib/solutions.ts`, called from `generateStaticParams()` in `/off-the-shelf/[slug]`, fails the
   build when `DODO_PAYMENTS_ENVIRONMENT=live_mode` and any solution has no live product id. Unkeyed
   is a no-op, so CI with no secrets still builds; test mode prints which solutions will route to the
   quote form and carries on. It lives in `generateStaticParams` deliberately — that runs only at
   build, so it can never 500 a page at request time when the Lambda's environment differs from the
   one the bundle was built with (traps #13 and #15).

   Measured: unkeyed → exit 0, silent. test_mode with 3 ids missing → exit 0 plus
   `[dodo] test_mode: no product id for stay, classes, supplier`. live_mode with ids missing → exit
   **1**, naming every slug. live_mode with all 6 filled → exit 0, 63 pages.

6. **Do not deploy `CustomerPortal`** — the adaptor's portal handler does not authenticate callers
   and there are no user accounts here.

#### What the original plan got wrong, found while building it

- **The adaptor's `Checkout` GET returns JSON**, `NextResponse.json({ checkout_url })`, not a
  redirect. A plain `<a href="/checkout">` straight at it would land the buyer on raw JSON. Our
  route unwraps it and issues the 303 itself, which is what preserves the plain-link design.
- **`checkoutHrefFor()` runs at build time** (trap #13), so the *build* needs the key and the mode.
  `deploy.yml` passes them to its build step; without that the buy button is absent from the
  deployed HTML however correctly Terraform sets the Lambda's environment. Since the workflow split
  that means the Dodo config is read by **both** workflows, for different reasons — trap #15.
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

### 3.3b BUILT — the custom checkout page, order references and order pages

Added after a test purchase showed two gaps: the buyer was handed to an unstyled Dodo page, and
came back to a thanks page with no number on it.

- **`/off-the-shelf/[slug]/buy`** is now the checkout. Prerendered like the detail page; the
  payment frame is Dodo's, embedded via `dodopayments-checkout` (`displayType: "inline"`) and
  themed from `BRAND_THEME` in `lib/dodo.ts`. `SolutionConfigurator`'s as-is CTA points here and
  **no longer carries `data-no-transition`** — it is a real page now, so the curtain should run.
- **`POST /api/checkout/session`** mints the session. Same posture as `/checkout`: the request
  carries a *slug*, the server resolves the product id from the catalog, and the solution metadata
  is set server-side. `force-dynamic` + `no-store`.
- **`orders.reference`** (`drizzle/0003_*.sql`, nullable + UNIQUE) holds a `DLS-XXXXXXXX` string
  **derived from `payment_id`** by `lib/orderRef.ts`. Deriving rather than randomising is the
  whole trick: the buyer is routinely back on `/thanks` before the webhook lands, and a reference
  that lived only on the row would be blank in exactly that moment. Both sides compute the same
  string, and a replay can't mint a second one.
- **`/orders/[ref]?t=…`** is the buyer's order page, linked from the confirmation email. The `t`
  is an HMAC of the reference under **`ORDER_LINK_SECRET`** — a ~40-bit reference is an identifier,
  not a bearer token, so the page `notFound()`s without a valid signature rather than 401-ing
  (which would confirm the reference exists). Unset secret = link omitted from the email and the
  page 404s; nothing throws.

  **This was dormant in production until the admin work.** `ORDER_LINK_SECRET` was documented in
  `.env.example` but was never added to `infra/lambda.tf` or `infra.yml`, so every confirmation
  email production sent would have omitted the link. It is now plumbed through both (trap #18), and
  needs the `ORDER_LINK_SECRET` secret on the GitHub `production` environment plus one Infra apply.
- **The summary agrees with the frame.** Dodo adds tax at checkout that our price pages never
  mentioned — the thing that made a Rs 89,990 site arrive as £248.14. `CheckoutPanel` listens for
  `checkout.breakdown` and shows Dodo's subtotal/tax/total once they arrive.

Traps found while building it:

- **`reactStrictMode` double-invokes the mount effect.** A `useRef` guard that survives the
  teardown is *wrong* here: the first run's cleanup closes the frame and the second run then bails
  out, leaving an empty box. The `cancelled` flag is the only correct guard — the first run's async
  continuation drops out before it touches the SDK.
- **The SDK runs iframe-resizer internally**, so the inline frame self-sizes. `min-h` is a floor,
  not a height. Dodo also require the whole frame including its footer to be visible, so don't crop it.
- **`font_primary_url` must be a stable public URL.** `next/font/local` fingerprints the emitted
  filename at build, so the Bricolage woff2 is copied to `public/fonts/` for this. **That copy is
  an infra change**: `local.public_paths` in `infra/cdn.tf` is generated from the `public/`
  fileset, so it adds a `/fonts/*.*` CloudFront behavior pointing at S3 — which only exists after
  an **Infra apply**. Deploy alone leaves `/fonts/bricolage-latin.woff2` falling through to the
  default behavior, Dodo's fetch of it fails, and the checkout frame quietly renders in a system
  font. Not fatal, but it is the difference between the embed looking like us and not. Same
  ordering as trap #15: Infra apply, then Deploy. It also means a PR touching `public/**` runs
  `infra.yml`'s Terraform validate, by design.
- **No `checkout.completed` event exists** and the SDK gives no client-side payment id. Completion
  is still the redirect to `return_url`; `/thanks` is still the thing that verifies.
- **The buyer's email must come from Dodo or our row**, never the `email=` query param Dodo appends
  to the return URL — same reasoning as `status`, which has always been declared and never read.

### 3.3c BUILT — the internal admin dashboard (`/admin`)

Built because the `orders` table plus a notification email *was* the build queue, which stops
working the moment two people need the same view of it: `npm run db:studio` wants the production
`DATABASE_URL` on a laptop, shows raw enum values and LKR minor units, and gives a colleague no way
to see what has been dealt with. `order_status` also had `building` and `delivered` with **nothing
in the codebase ever setting them** — states no one could reach.

- **`src/app/(admin)/` is a third root layout**, alongside `(site)` and `(demos)`. Not a subtree of
  `(site)`, and the reason is trap #1: `PageTransition` intercepts every same-origin `<a>` click, so
  a dashboard inside it would need `data-no-transition` on everything. Outside it the problem does
  not exist. It also sheds Lenis, GSAP, the header, footer, ⌘K and the custom cursor, which are all
  wrong furniture for a dense table.
- **Auth is one shared `ADMIN_PASSWORD`** and an HMAC-signed httpOnly cookie, `Path=/admin`, 7 days.
  The signing key is *derived* from the password (`createHmac(password).update("v1")`), so one env
  var is the whole setup and **changing the password signs every browser out** — the only global
  revocation lever, since there is no session table. The expiry is signed and enforced from the
  payload, never from the cookie's `Max-Age`.
- **Unset `ADMIN_PASSWORD` 404s the whole area, login form included.** Same posture as
  `ORDER_LINK_SECRET`. It also makes the rollout self-verifying: `/admin` answering **404** before
  the Infra apply and **307 → /admin/login** after it proves the apply put the variable on the
  Lambda, the same trick the webhook's 503→401 flip gives.
- **Authorization is in the Data Access Layer, not a proxy.** `requireAdmin()` from
  `lib/adminSession.ts` is called at the top of every page and inside every mutation. There is
  deliberately **no `proxy.ts`**: the Next docs say Proxy must not be the only authorization layer,
  and with five routes an explicit call is easier to audit than a matcher.
- **No mutation calls `revalidatePath`** (trap #5). Each ends in `redirect()` back to the page it
  changed; the pages are `force-dynamic` and `no-store`, so that redirect re-reads Postgres. There
  is no cache to invalidate in the first place.
- **Nothing links to `/admin`** — not `NAV`, the footer, ⌘K, the sitemap or `robots.txt`. Adding it
  to `NAV` would put it in six places at once, including the sitemap. The URL is typed.
  `robots.txt` is deliberately left alone too: nothing links to the path, so listing it in a public
  file is the only way a crawler would learn it exists. The `X-Robots-Tag: noindex` header plus the
  per-page `robots` metadata is the real protection.

Measured locally against Postgres: all five routes 404 with no `ADMIN_PASSWORD`; 307 → login once
set; a **correctly signed but expired** cookie rejected (proving the signed-payload expiry), as are
a forged signature, a cookie signed with a different password, and malformed values — all 307, none
500; login sets `Path=/admin; HttpOnly; SameSite=lax`, wrong password sets no cookie; the rate limit
closes after 5 attempts per IP; `status=refunded` forged into a direct POST **rejected** by the
narrowed enum; moving an already-refunded row **refused**; an unauthenticated POST redirected with
**no write**; and advancing an order to `building` from `/admin` showed up as the current step on the
buyer's own `/orders/[ref]?t=…` page, with the internal note **not** present in that HTML.

### 3.4 Phase 4 — polish

- **Real demo screenshots** are no longer needed for the preview (the demos are live and embedded), but
  OG images still are. No `opengraph-image.tsx` exists anywhere; `summary_large_image` is declared and no
  image is served. Caveat: `next/og` on the arm64 Lambda needs a bundled font and adds weight.
- Homepage band after `ServicesRail`: "Or take one that already exists →"
- `scripts/check-dodo-prices.ts` + `npm run check:prices`: fail if a dashboard price disagrees with
  `priceCents`. Now a straight integer comparison, both sides being LKR minor units — no conversion, so
  the check is exact rather than tolerance-based. Add to `deploy.yml` as a **non-blocking** warning, not to `ci.yml` (no key there).
- `webhook_events` table — only if events stop being 1:1 with a payment. `orders.payment_id` is enough today,
  and the replay test confirms it.
- Deeper demos (the sales pages advertise 7 pages; demos have 3). Decide whether the gap matters.

### 3.5 Open questions for the user

- **Hosting and domain ownership** was deferred and is still absent from the public pages. It needs an
  answer before the first real sale, even if only in the handover email.
- **`LKR_PER_USD` in `src/lib/money.ts` is a hardcoded 332**, last set 2026-11-21. Since the catalog went
  LKR-denominated this is display-only in the strict sense: no stored price derives from it any more, so a
  stale rate makes the small grey `≈ $` approximation wrong rather than the headline price. It still drifts,
  and there is still no reminder mechanism.
- **Base price vs margin.** At LKR 69,990–119,990 (roughly $211–$361) a done-for-you build is close to break-even once branding and
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
    the *build* needs `DODO_PAYMENTS_API_KEY` and `DODO_PAYMENTS_ENVIRONMENT` (`deploy.yml` passes
    both to its build step), the mode chosen at build decides whether test or live product ids get
    baked, and **turning payments on or off requires a redeploy** — changing the Lambda's
    environment alone does nothing to the button. The `/checkout` route and the webhook *are*
    per-request, so they pick up env changes immediately; only the button is baked.

14. **Subscribe the webhook to only the three events we handle.** The adaptor validates against a
    closed schema and answers 400 for an unrecognised event type, so a "send me everything"
    subscription produces a stream of 400s and Dodo retries on them.

15. **The Dodo config lives in BOTH workflows, and they are not interchangeable.**
    `infra.yml` carries `TF_VAR_dodo_api_key` / `_webhook_key` / `_environment` in **both** its
    `plan` and `apply` env blocks — a plan that cannot see them is not the apply you get — and that
    is what puts `DODO_PAYMENTS_*` on the server Lambda. `deploy.yml` carries
    `DODO_PAYMENTS_API_KEY` and `DODO_PAYMENTS_ENVIRONMENT` on its build step only, for trap #13.
    Consequences: **going live is two ordered runs, Infra apply then Deploy**; applying infra alone
    gives a configured Lambda with no buy button, and deploying alone gives a button whose
    `/checkout` answers from an unkeyed function. Both workflows refuse a `live_mode` run with an
    empty key rather than half-configuring production.

16. **A `"use server"` file may only EXPORT async functions.** Exporting anything else from one —
    a const, an array, a type's runtime value — fails at *runtime* with
    `A "use server" file can only export async functions, found object`, and **`npm run typecheck`
    does not catch it.** It cost real time: the symptom was every `/admin` route answering 500
    while `/admin` itself correctly 404'd, which reads like a routing problem rather than a module
    one. `ADMIN_SETTABLE_STATUSES` lives in `lib/adminData.ts` for exactly this reason. Shared
    constants go in a plain module and are imported by the actions file.

17. **CloudFront's server cache policy excludes cookies from the cache key while still caching
    GET.** `aws_cloudfront_cache_policy.server` in `infra/cdn.tf` sets `cookie_behavior = "none"`;
    cookies *are* forwarded to the origin (`Managed-AllViewerExceptHostHeader`) and `GET` *is* in
    `cached_methods`. So any cacheable authenticated response is a data leak: CloudFront stores it
    keyed on path+query alone and serves it to the next visitor with no cookie. `/admin` is
    defended three times over — `no-store` from `next.config.ts`'s `headers()`, `force-dynamic` on
    every route, and a `/admin*` behavior on the managed `CachingDisabled` policy. **Never remove
    any of the three**, and never add a cookie-authenticated page outside `/admin` without
    repeating all three.

18. **`ADMIN_PASSWORD` and `ORDER_LINK_SECRET` are request-time only**, so unlike `DODO_PAYMENTS_*`
    (trap #13) they belong in `infra.yml` and **not** on `deploy.yml`'s build step. Consequence,
    and it is the good kind: switching the admin dashboard on or off is an **Infra apply with no
    redeploy**, and trap #15's ordering does not apply to them. Rollback is to unset the secret and
    re-apply — the area 404s again with no code change.

19. **The canonical host is `www`.** `infra/variables.tf` sets `canonical_host = "www"`, so
    `local.site_url` → `NEXT_PUBLIC_SITE_URL` → `SITE.url` → `dodoReturnUrl()` all resolve to
    `https://www.dolessstudios.com`. Register the webhook and open any test checkout on `www.`. The
    apex is a distribution alias with no redirect between the two, so it works either way, but the
    return URL Dodo is handed will be `www` and matching them avoids a needless surprise.


---

## 5. Invariants — do not break these

- **The server recomputes every total from the catalog.** `submitSolutionInquiry` never trusts the
  numbers the configurator sent. Keep it that way.
- **Never re-state `priceCents` after payment.** The thanks page and both order emails must show the
  amount Dodo actually charged. This makes price drift a marketing bug, not a billing dispute.
- **Add-ons never touch checkout.** They route to a quote, so their prices carry no payment risk.
- **The webhook owns `refunded`; `/admin` owns `building`, `delivered` and `cancelled`.** The
  dashboard's status enum (`ADMIN_SETTABLE_STATUSES` in `lib/adminData.ts`) excludes `refunded`,
  the server action validates against that narrowed enum rather than the column's, and a row that
  is already refunded refuses any status write. A hand-set `refunded` would look exactly like a
  real one while disagreeing with Dodo — which is the single thing the money columns exist to
  prevent.
- **`orders.notes` and `inquiries.notes` are internal.** No buyer-facing page may render them,
  including `/orders/[ref]`, where the row is already in scope.
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

Clear `.next` before `npm run typecheck` if the route structure changed — a stale
`.next/types/validator.ts` reports modules at their old paths (trap #8). CI never sees this; it
typechecks a fresh checkout.

Against production, the webhook doubles as a free routing check — no Dodo account, no keys needed:

```sh
curl -i -X POST https://www.dolessstudios.com/api/webhook/dodo-payments -d '{}'
```

**503** while `DODO_PAYMENTS_WEBHOOK_KEY` is unset, **401** once it is set. Either proves CloudFront
routes a POST to the server Lambda and the handler ran. HTML, a 403 or a CloudFront error page means
the routing assumption is wrong. A 503 *after* an Infra apply means the apply did not take.

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

### Verifying /admin

The admin area is checkable almost entirely over HTTP, because the session cookie can be minted
with the same derivation the app uses:

```sh
# 1. the unconfigured state — every route must 404, login form included
env -u ADMIN_PASSWORD npm run dev
curl -s -o /dev/null -w '%{http_code}\n' localhost:3001/admin/login    # 404

# 2. configured: /admin and /admin/orders 307 to the login form
ADMIN_PASSWORD=... ORDER_LINK_SECRET=... npm run dev

# 3. mint a session cookie (expiry is signed, so forge attempts need the password)
node -e 'const{createHmac}=require("node:crypto");const k=createHmac("sha256",process.env.ADMIN_PASSWORD).update("v1").digest();const p="v1."+(Date.now()+36e5);console.log(p+"."+createHmac("sha256",k).update(p).digest("base64url").slice(0,32))'
```

Then confirm, with that cookie: `/admin/orders` 200s; and **without** it, or with a correctly
signed but **expired** payload, a forged signature, a cookie signed with a different password, or
any malformed value, every route 307s to the login form and never 500s.

Headers on every admin response — the trap #17 defence — must read:

```sh
curl -sI localhost:3001/admin/orders | grep -iE 'cache-control|x-robots-tag|content-security'
# Cache-Control: no-store ; X-Robots-Tag: noindex, nofollow ; CSP: frame-ancestors 'none'
```

and a public page must have **none** of them, or the demo embeds are at risk (trap #11).

Driving the mutations by curl needs the action id, which is in the rendered HTML of the no-JS form
(`grep -oE '\$ACTION_ID_[a-f0-9]+'`); the forms are `multipart/form-data`, so post with
`--form-string`. The four worth re-running after any change to the actions: forging
`status=refunded` (must redirect `?e=bad`, row unchanged), moving an already-refunded row (must
redirect `?e=refunded`), an unauthenticated POST (must redirect to login with **no** write), and a
status change showing up on the buyer's `/orders/[ref]?t=…` page.

**The one check that cannot be done locally** is trap #17 itself. After Infra apply and Deploy: sign
in, load `/admin/leads` so a response for that exact path reaches the edge, then immediately, from a
machine with no cookie, `curl -s https://www.dolessstudios.com/admin/leads`. It must be the login
redirect — never a lead's name or email. Repeat `curl -sI` three times and confirm `x-cache` never
reports a Hit.

```sql
-- the build queue, as /admin reads it
select created_at, reference, solution, name, email, amount_cents, currency, status, emailed, notes
from orders order by created_at desc;
```

There is **no test framework and no linter** in this project. `typecheck` + `build` are the whole
automated safety net.

---

## 7. File map

```
src/lib/content.ts                      SOLUTIONS, ADD_ONS, NAV, SOLUTION_STEPS/FAQ, LEGAL — the data model
src/lib/money.ts                        LKR minor units, the one formatter, the display-only USD rate
src/lib/solutions.ts                    checkoutHrefFor() — the capability flag (runs at BUILD time)
src/lib/dodo.ts                         Dodo config, all read inside functions; fetchPayment()
src/lib/orders.ts                       webhook -> orders row, the idempotency gate, never throws
src/lib/orderRef.ts                     DLS-… reference derived from payment_id; signs /orders links
src/lib/ratelimit.ts                    per-IP limiter: actions.ts, /api/checkout/session, /admin login
src/lib/adminSession.ts                 /admin auth: password check, signed cookie, requireAdmin() (the DAL)
src/lib/adminData.ts                    /admin reads + ADMIN_SETTABLE_STATUSES; never throws
src/lib/solutionInquiry.ts              quote schema, built from inquirySchema
src/lib/actions.ts                      submitSolutionInquiry + the honeypot/rate-limit/clientIp helpers
src/lib/mail.ts                         rowsTable(), sendSolutionInquiryEmail — order emails go here
src/lib/demo/<slug>.ts                  fixture content for each demo's fake business

src/app/(site)/off-the-shelf/           catalog + detail pages + thanks/
src/app/(site)/off-the-shelf/[slug]/buy/  OUR checkout page (prerendered)
src/app/(site)/orders/[ref]/            the buyer's order page, HMAC-gated
src/app/(site)/api/checkout/session/    POST -> themed Dodo session (force-dynamic, no-store)
src/app/(site)/checkout/route.ts        static GET -> unwraps the adaptor's JSON -> 303 to Dodo
                                        (kept: hosted fallback + the payout-test hatch)
src/app/(site)/api/webhook/dodo-payments/route.ts   signature verify -> orders.ts
src/app/(admin)/                        THIRD root layout — no PageTransition, Lenis, header or ⌘K
src/app/(admin)/admin/                  orders, orders/[ref], leads, login (all force-dynamic)
src/app/(admin)/admin/actions.ts        "use server": login, logout, status and note writes
src/components/admin/AdminShell.tsx     admin chrome, StatusPill, NoDatabase
src/app/(demos)/                        demo root layout; demo/<slug>/ per vertical
src/app/demo.css                        demos' theme + per-demo palettes (data-demo="<slug>")
src/app/(site)/{terms,privacy,refund-policy}/       the three documents live mode requires
src/components/sections/LegalDoc.tsx    one renderer for all three; they can't drift in layout

src/components/solutions/               SolutionGrid, SolutionConfigurator, SolutionQuoteForm,
                                        SolutionDemo, DemoFrame, SolutionArt,
                                        InlineCheckout, CheckoutPanel, OrderTimeline
src/components/demo/                    DemoBar + per-vertical marks and forms
src/components/ui/form.tsx              Chip/Err/field, shared with BriefForm

drizzle/0001_off_the_shelf.sql          inquiries.solution (nullable) + inquiries.addons (not null)
drizzle/0002_orders.sql                 orders table; payment_id UNIQUE is the idempotency key
drizzle/0004_oval_zarda.sql             notes on orders and inquiries (internal, /admin only)
infra/cdn.tf, infra/lambda.tf           routing (already fine) and server_env (carries DODO_PAYMENTS_*)
.github/workflows/infra.yml             TF_VAR_dodo_* in BOTH plan and apply -> the Lambda's env
.github/workflows/deploy.yml            DODO_PAYMENTS_* on the build step only -> the buy button
```

Also read the **Off the shelf** and **Demos** sections of `README.md`, which document the architecture
for anyone touching it later.
