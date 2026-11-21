"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { SOLUTIONS, SOLUTION_TAGS, type SolutionTag } from "@/lib/content";
import { formatMoney, formatUsdApprox } from "@/lib/money";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import { SolutionArt } from "./SolutionArt";

/**
 * Filtered by what a solution does, not by vertical: with four verticals the
 * pills would be one per card and tell you nothing. Tags keep working as the
 * catalog grows.
 */
const FILTERS: { id: "all" | SolutionTag; label: string }[] = [
  { id: "all", label: "Everything" },
  ...SOLUTION_TAGS.filter((t) => SOLUTIONS.some((s) => s.tags.includes(t.id))).map((t) => ({ id: t.id, label: t.label })),
];

export function SolutionGrid() {
  const [filter, setFilter] = useState<"all" | SolutionTag>("all");
  const grid = useRef<HTMLUListElement>(null);
  const list = useMemo(
    () => (filter === "all" ? SOLUTIONS : SOLUTIONS.filter((s) => s.tags.includes(filter))),
    [filter],
  );

  useIsoLayoutEffect(() => {
    if (!grid.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-card]", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, ease: "expo.out" });
    }, grid);
    return () => ctx.revert();
  }, [filter]);

  return (
    <div className="flex flex-col gap-10">
      <div role="group" aria-label="Filter by what it does" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = f.id === "all" ? SOLUTIONS.length : SOLUTIONS.filter((s) => s.tags.includes(f.id as SolutionTag)).length;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.id)}
              className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300 ${
                active ? "border-accent bg-accent text-ink" : "border-line text-paper/80 hover:border-paper/50 hover:text-paper"
              }`}
            >
              {f.label}
              <span className={`font-mono text-[11px] ${active ? "text-ink/70" : "text-mist"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <ul ref={grid} className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-start">
        {list.map((s, i) => (
          <li key={s.slug} data-card className={i % 2 === 1 ? "md:mt-24" : ""}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-ink-2 transition-colors duration-500 hover:border-paper/30">
              <div className="relative overflow-hidden p-4 pb-0 sm:p-6 sm:pb-0">
                <SolutionArt
                  slug={s.slug}
                  className="h-auto w-full transition-transform duration-700 ease-[var(--ease-lazy)] group-hover:scale-[1.03]"
                />
                <span
                  className="absolute left-7 top-7 rounded-full px-3 py-1 font-mono text-[11px] text-ink sm:left-9 sm:top-9"
                  style={{ backgroundColor: s.accent }}
                >
                  {s.demo ? "try the demo" : "built, no demo yet"}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-accent">{s.index}</span>
                  <span className="chip">{s.vertical}</span>
                </div>

                <h2 className="display heavy text-[clamp(2rem,3.6vw,3.4rem)]">{s.title}</h2>
                <p className="text-lg text-paper/70">{s.tagline}</p>

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-5">
                  <span className="display heavy text-3xl tabular-nums">{formatMoney(s.priceCents)}</span>
                  <span className="font-mono text-xs text-mist">{formatUsdApprox(s.priceCents)}</span>
                  <span className="chip ml-auto">{s.turnaround}</span>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {s.pages.slice(0, 4).map((p) => (
                    <li key={p} className="chip">
                      {p}
                    </li>
                  ))}
                  {s.pages.length > 4 && <li className="chip">+{s.pages.length - 4} more</li>}
                </ul>

                <Link
                  href={`/off-the-shelf/${s.slug}`}
                  data-cursor="Open"
                  className="mt-auto inline-flex items-center gap-3 pt-2 font-semibold after:absolute after:inset-0 after:content-['']"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                    ↗
                  </span>
                  See what&apos;s in it
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
