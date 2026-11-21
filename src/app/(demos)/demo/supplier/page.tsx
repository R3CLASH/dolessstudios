import Link from "next/link";
import { CAPACITY, CEYLON, CERTIFICATIONS, FAQ, MARKETS, PROCESS, PRODUCTS } from "@/lib/demo/supplier";

export default function CeylonLeafHome() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-edge bg-surface-2">
        <div className="d-wrap grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <span className="w-fit rounded-full border border-edge bg-surface px-3 py-1.5 text-sm text-muted">
              Exporting since {CEYLON.established} · ISO 22000 · Sri Lanka Tea Board registered
            </span>

            <h1 className="d-h1 text-brand">
              Orthodox Ceylon tea,
              <br />
              direct from the source.
            </h1>

            <p className="max-w-xl text-lg text-muted sm:text-xl">
              We buy at the Colombo auction and through direct estate contracts, blend and pack at our own ISO 22000 facility,
              and export ourselves. No broker in the chain, which is usually why our price works.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/demo/supplier/quote" className="d-btn d-btn-primary !text-white">
                Request a quote →
              </Link>
              <Link href="/demo/supplier/products" className="d-btn d-btn-ghost">
                See the grades
              </Link>
            </div>

            <dl className="mt-2 grid gap-5 border-t border-edge pt-6 sm:grid-cols-3">
              {CEYLON.stats.map((p) => (
                <div key={p.k}>
                  <dt className="d-h3 text-brand">{p.k}</dt>
                  <dd className="text-sm text-muted">{p.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="d-card flex flex-col gap-5 p-6 sm:p-8">
              <p className="d-eyebrow">For buyers</p>
              <p className="d-h2 text-brand">What you need, up front.</p>
              <dl className="flex flex-col divide-y divide-edge">
                {CAPACITY.slice(0, 4).map((c) => (
                  <div key={c.k} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-muted">{c.k}</dt>
                    <dd className="text-right font-semibold text-brand">{c.v}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/demo/supplier/quote" className="d-btn d-btn-dark mt-auto">
                Ask for a price
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Certifications: the thing a foreign buyer scans for first ── */}
      <section id="certifications" className="scroll-mt-24 border-b border-edge py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">Certifications</p>
            <h2 className="d-h2 max-w-2xl text-brand">Audited, and happy to prove it.</h2>
            <p className="max-w-2xl text-muted">
              Certificates are sent with the first quote. Where a certification covers only part of our range, we say which part
              rather than implying all of it.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATIONS.map((c) => (
              <li key={c.name} className="d-card flex flex-col gap-3 p-6">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ background: "var(--d-accent)" }}
                >
                  ✓
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="d-h3 text-brand">{c.name}</h3>
                  <p className="text-sm font-semibold text-muted">{c.body}</p>
                </div>
                <p className="mt-auto text-sm text-muted">{c.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────────────── */}
      <section className="border-b border-edge bg-surface-2 py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <p className="d-eyebrow">What we make</p>
              <h2 className="d-h2 max-w-2xl text-brand">Six lines, with the specs attached.</h2>
            </div>
            <Link href="/demo/supplier/products" className="d-btn d-btn-ghost">
              Full specifications
            </Link>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => (
              <li key={p.slug} className="d-card flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-1">
                  <span className="d-eyebrow">{p.grade}</span>
                  <h3 className="d-h3 text-brand">{p.name}</h3>
                </div>
                <p className="text-sm text-muted">{p.line}</p>
                <dl className="flex flex-col gap-1.5 border-t border-edge pt-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Origin</dt>
                    <dd className="text-right font-medium">{p.origin}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">MOQ</dt>
                    <dd className="text-right font-medium">{p.moq}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────── */}
      <section className="border-b border-edge py-16 sm:py-24">
        <div className="d-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <p className="d-eyebrow">How an order runs</p>
            <h2 className="d-h2 max-w-2xl text-brand">Sample, approve, produce, ship.</h2>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((s) => (
              <li key={s.n} className="d-card flex flex-col gap-3 p-6">
                <span className="font-mono text-sm text-accent">{s.n}</span>
                <h3 className="d-h3 text-brand">{s.title}</h3>
                <p className="text-sm text-muted">{s.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Capacity ─────────────────────────────────────────────────── */}
      <section id="capacity" className="scroll-mt-24 border-b border-edge bg-brand py-16 text-white sm:py-24">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <p className="d-eyebrow !text-white/55">Capacity &amp; terms</p>
            <h2 className="d-h2">Can you actually supply it?</h2>
            <p className="text-white/70">
              The question every serious buyer asks on the second email. Here it is on the first page.
            </p>
            <Link href="/demo/supplier/quote" className="d-btn d-btn-primary mt-2 w-fit !text-white">
              Request a quote →
            </Link>
          </div>
          <dl className="grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:col-span-8">
            {CAPACITY.map((c) => (
              <div key={c.k} className="flex items-baseline justify-between gap-4 border-b border-white/15 py-4">
                <dt className="text-white/65">{c.k}</dt>
                <dd className="text-right font-semibold">{c.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Markets ──────────────────────────────────────────────────── */}
      <section id="markets" className="scroll-mt-24 border-b border-edge py-16 sm:py-24">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <p className="d-eyebrow">Where it goes</p>
            <h2 className="d-h2 text-brand">Forty-two countries.</h2>
            <p className="text-muted">
              If your market is not on this list it does not mean we cannot ship there — only that we have not yet.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 lg:col-span-8 lg:content-start">
            {MARKETS.map((m) => (
              <li key={m} className="rounded-full border border-edge bg-surface-2 px-4 py-2 text-sm font-medium">
                {m}
              </li>
            ))}
            <li className="rounded-full border border-edge px-4 py-2 text-sm text-muted">+ 30 more</li>
          </ul>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="d-wrap grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <p className="d-eyebrow">Buyer questions</p>
            <h2 className="d-h2 text-brand">Answered before you ask.</h2>
          </div>
          <div className="flex flex-col lg:col-span-8">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-edge py-5">
                <summary className="d-h3 flex cursor-pointer items-center justify-between gap-4 text-brand">
                  {f.q}
                  <span aria-hidden="true" className="text-accent transition-transform group-open:rotate-45">
                    ＋
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <section className="bg-brand py-16 text-white sm:py-20">
        <div className="d-wrap flex flex-col items-start gap-6">
          <h2 className="d-h2 max-w-2xl">Send us the grade, the volume and the port.</h2>
          <p className="max-w-xl text-white/75">
            You&apos;ll have a landed price within one working day, and samples inside five.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/demo/supplier/quote" className="d-btn d-btn-primary !text-white">
              Request a quote →
            </Link>
            <a
              href={`mailto:${CEYLON.email}`}
              className="d-btn d-btn-ghost !border-white/30 !bg-transparent !text-white"
            >
              {CEYLON.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
