"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { PROJECTS, SERVICES, type ServiceSlug } from "@/lib/content";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import { ProjectCover } from "./ProjectCover";

const FILTERS: { id: "all" | ServiceSlug; label: string }[] = [
  { id: "all", label: "Everything" },
  ...SERVICES.filter((s) => PROJECTS.some((p) => p.tags.includes(s.slug))).map((s) => ({ id: s.slug, label: s.short })),
];

export function WorkGrid() {
  const [filter, setFilter] = useState<"all" | ServiceSlug>("all");
  const grid = useRef<HTMLUListElement>(null);
  const list = useMemo(() => (filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(filter))), [filter]);

  useIsoLayoutEffect(() => {
    if (!grid.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-card]", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, ease: "expo.out" });
    }, grid);
    return () => ctx.revert();
  }, [filter]);

  return (
    <div className="flex flex-col gap-10">
      <div role="group" aria-label="Filter work" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = f.id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.tags.includes(f.id as ServiceSlug)).length;
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
      <ul ref={grid} className="grid grid-cols-1 gap-x-5 gap-y-14 md:grid-cols-2">
        {list.map((p, i) => (
          <li key={p.slug} data-card className={i % 2 === 1 ? "md:mt-28" : ""}>
            <Link href={`/work/${p.slug}`} data-cursor="View" className="group flex flex-col gap-5">
              <div className="relative overflow-hidden rounded-[28px] border border-line">
                <ProjectCover
                  slug={p.slug}
                  className="aspect-[10/8] h-auto w-full transition-transform duration-[1.2s] ease-[var(--ease-lazy)] group-hover:scale-[1.06]"
                />
                <span
                  className="absolute left-5 top-5 rounded-full px-3 py-1 font-mono text-[11px] text-ink"
                  style={{ backgroundColor: p.accent }}
                >
                  {p.status}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="display heavy text-[clamp(2.2rem,4vw,3.6rem)]">{p.title}</h2>
                  <span className="text-2xl transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                </div>
                <p className="max-w-lg text-lg text-paper/70">{p.summary}</p>
                <span className="chip w-fit">{p.kind}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
