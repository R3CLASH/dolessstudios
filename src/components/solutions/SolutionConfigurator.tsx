"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ADDON_GROUPS, type AddOn, type SolutionSlug } from "@/lib/content";
import { formatMoney, formatUsdApprox, sumCents } from "@/lib/money";
import { SolutionQuoteForm } from "./SolutionQuoteForm";

type Props = {
  slug: SolutionSlug;
  title: string;
  priceCents: number;
  turnaround: string;
  /** Already filtered by addOnsFor(). */
  addOns: AddOn[];
  /**
   * Where the as-is buy button goes. null while Dodo isn't configured, in which
   * case buying as-is routes to the quote form too — no dead end.
   */
  checkoutHref: string | null;
};

export function SolutionConfigurator({ slug, title, priceCents, turnaround, addOns, checkoutHref }: Props) {
  /** Add-on ids, always held in catalog order so the receipt and the email read the same. */
  const [picked, setPicked] = useState<string[]>([]);
  const [asking, setAsking] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const chosen = useMemo(() => addOns.filter((a) => picked.includes(a.id)), [addOns, picked]);
  const oneOff = useMemo(() => priceCents + sumCents(chosen.map((a) => a.priceCents)), [chosen, priceCents]);
  const monthly = useMemo(() => sumCents(chosen.map((a) => a.monthlyCents)), [chosen]);
  const asIs = picked.length === 0;

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      // Re-sort into catalog order rather than click order.
      return addOns.filter((a) => next.includes(a.id)).map((a) => a.id);
    });

  // Bring the form into view when it opens, the Lenis-aware way the brief form does it.
  useEffect(() => {
    if (!asking || !formRef.current) return;
    const top = formRef.current.getBoundingClientRect().top + window.scrollY - 120;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: "smooth" });
  }, [asking]);

  const groups = ADDON_GROUPS.map((g) => ({ ...g, items: addOns.filter((a) => a.group === g.id) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-10 rounded-[28px] border border-line bg-ink-2 p-6 sm:p-10 lg:grid-cols-2 lg:gap-14">
        {/* ── Pick the add-ons ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-9">
          <div className="flex flex-col gap-3">
            <h3 className="display heavy text-3xl sm:text-4xl">Make it yours.</h3>
            <p className="text-paper/70">
              The site is built. These are the things we&apos;d otherwise have to guess at. Tick nothing and you buy it as-is.
            </p>
          </div>

          {groups.map((g) => (
            <fieldset key={g.id} className="flex flex-col gap-3">
              <legend className="mb-2 flex flex-col gap-1">
                <span className="font-semibold text-paper">{g.label}</span>
                <span className="text-sm text-mist">{g.line}</span>
              </legend>
              {g.items.map((a) => {
                const on = picked.includes(a.id);
                return (
                  <label
                    key={a.id}
                    className={`group flex min-h-11 cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors duration-300 ${
                      on ? "border-accent bg-accent/8" : "border-line bg-ink hover:border-paper/40"
                    }`}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggle(a.id)} className="peer sr-only" />
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                        on ? "border-accent bg-accent text-ink" : "border-slate"
                      }`}
                    >
                      {on && (
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                          <path d="M6 12.5l3.6 3.6L18 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="flex flex-1 flex-col gap-1">
                      <span className="font-semibold">{a.name}</span>
                      <span className="text-sm text-paper/65">{a.line}</span>
                      {a.note && <span className="font-mono text-xs text-mist">{a.note}</span>}
                    </span>
                    <span className="shrink-0 text-right font-mono text-sm tabular-nums text-accent">
                      {formatMoney(a.priceCents)}
                      {a.monthlyCents ? <span className="block text-xs text-mist">+{formatMoney(a.monthlyCents)}/mo</span> : null}
                    </span>
                  </label>
                );
              })}
            </fieldset>
          ))}
        </div>

        {/* ── Running total and the CTA ────────────────────────────────── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col gap-7 rounded-2xl border border-line bg-ink p-6 sm:p-8">
            <div className="flex flex-col gap-1">
              <span className="eyebrow">{asIs ? "As-is" : `With ${picked.length} add-on${picked.length === 1 ? "" : "s"}`}</span>
              <span
                aria-live="polite"
                className="display heavy text-[clamp(2rem,4.2vw,3rem)] leading-none tabular-nums text-accent"
              >
                {formatMoney(oneOff)}
              </span>
              <span className="font-mono text-sm text-mist">{formatUsdApprox(oneOff)}</span>
              {monthly > 0 && (
                <span className="mt-1 text-sm text-paper/70">
                  plus <strong className="text-paper">{formatMoney(monthly)}/month</strong> for the add-ons that keep running
                </span>
              )}
            </div>

            <ul className="flex flex-col gap-2 border-t border-line pt-5 text-sm">
              <li className="flex items-baseline justify-between gap-4 text-paper/80">
                <span>{title}, done for you</span>
                <span className="font-mono tabular-nums text-mist">{formatMoney(priceCents)}</span>
              </li>
              {chosen.map((a) => (
                <li key={a.id} className="flex items-baseline justify-between gap-3 text-paper/80">
                  <button
                    type="button"
                    onClick={() => toggle(a.id)}
                    className="flex min-h-8 items-center gap-2 text-left hover:text-paper"
                    aria-label={`Remove ${a.name}`}
                  >
                    <span className="text-mist transition-colors hover:text-accent">✕</span>
                    {a.name}
                  </button>
                  <span className="font-mono tabular-nums text-mist">{formatMoney(a.priceCents)}</span>
                </li>
              ))}
            </ul>

            <p className="border-t border-line pt-5 text-sm text-paper/70">
              {turnaround}
              {picked.length > 0 && <span className="text-mist"> · add a day or two per add-on</span>}
            </p>

            {/* The whole hybrid rule lives here: as-is pays now, anything changed gets quoted. */}
            <div className="flex flex-col gap-3">
              {asIs && checkoutHref ? (
                <>
                  {/*
                    A real page now, not the /checkout route handler, so the
                    PageTransition curtain should run — hence no data-no-transition.
                    checkoutHref still decides whether this renders at all: no Dodo
                    key or no product id for the mode means the quote form instead.
                  */}
                  <Link
                    href={`/off-the-shelf/${slug}/buy`}
                    rel="nofollow"
                    data-cursor="Buy"
                    className="btn btn-accent h-16 justify-center px-8 text-lg"
                  >
                    Buy it as-is · {formatMoney(priceCents)} →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setAsking(true)}
                    className="min-h-11 text-sm text-mist underline decoration-line underline-offset-4 transition-colors hover:text-paper"
                  >
                    Rather talk to someone first?
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setAsking(true)}
                    data-cursor="Ask"
                    className="btn btn-accent h-16 justify-center px-8 text-lg"
                  >
                    {asIs
                      ? `Get it as-is · ${formatMoney(priceCents)} →`
                      : `Get a fixed quote · ${picked.length} add-on${picked.length === 1 ? "" : "s"} →`}
                  </button>
                  <p className="text-sm text-mist">
                    {asIs
                      ? "We'll confirm the price and start the same week."
                      : "Anything customised we quote first. No surprise invoices."}
                  </p>
                </>
              )}
            </div>

            {!asIs && (
              <details className="border-t border-line pt-5 text-sm">
                <summary className="min-h-11 cursor-pointer text-paper/80 hover:text-paper">
                  Why can&apos;t I pay for the add-ons online?
                </summary>
                <p className="mt-3 text-paper/65">
                  Because we&apos;d be guessing. Add-on prices are estimates until we&apos;ve seen your logo, your old site or your
                  calendar. You get a fixed number first, then you pay it.
                </p>
              </details>
            )}
          </div>
        </div>
      </div>

      {asking && (
        <div ref={formRef}>
          <SolutionQuoteForm
            slug={slug}
            title={title}
            priceCents={priceCents}
            picked={picked}
            chosen={chosen}
            oneOff={oneOff}
            monthly={monthly}
          />
        </div>
      )}
    </div>
  );
}
