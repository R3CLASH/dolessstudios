"use client";

import { useState } from "react";
import { AFTER_WEEK, BEFORE_WEEK } from "@/lib/content";
import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { Eyebrow, SplitReveal } from "@/components/ui/motion";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const SLOTS = 6;

type Block = { day: number; start: number; len: number; label: string };

function Week({ blocks, variant, ghosts }: { blocks: Block[]; variant: "before" | "after"; ghosts?: Block[] }) {
  return (
    <div className="grid h-full grid-cols-3 gap-2 p-3 sm:gap-3 sm:p-4 md:grid-cols-5" style={{ gridTemplateRows: `auto repeat(${SLOTS}, minmax(0, 1fr))` }}>
      {DAYS.map((d, i) => (
        <div key={d} className={`pb-1 font-mono text-[11px] text-mist ${i >= 3 ? "hidden md:block" : ""}`} style={{ gridColumn: i + 1, gridRow: 1 }}>
          {d}
        </div>
      ))}
      {ghosts?.map((b, i) => (
        <div
          key={`g${i}`}
          className={`flex items-start rounded-lg border border-dashed border-line/80 p-2 ${b.day >= 3 ? "hidden md:flex" : ""}`}
          style={{ gridColumn: b.day + 1, gridRow: `${b.start + 2} / span ${b.len}` }}
        >
          <span className="font-mono text-[10px] text-mist/70">✓ automated</span>
        </div>
      ))}
      {blocks.map((b, i) => (
        <div
          key={i}
          className={`relative flex flex-col justify-between overflow-hidden rounded-lg p-2 text-[11px] leading-tight sm:p-2.5 sm:text-[13px] ${
            b.day >= 3 ? "hidden md:flex" : "flex"
          } ${variant === "before" ? "border border-accent/30 bg-[#2a1a14] text-paper/90" : "bg-lime text-ink"}`}
          style={{ gridColumn: b.day + 1, gridRow: `${b.start + 2} / span ${b.len}` }}
        >
          <span className="font-semibold">{b.label}</span>
          {variant === "before" && b.len > 1 && <span className="font-mono text-[10px] text-accent/80">manual</span>}
        </div>
      ))}
    </div>
  );
}

export function BeforeAfter() {
  const [pos, setPos] = useState(50);

  const ref = useGsap<HTMLElement>((_c, root) => {
    if (prefersReducedMotion()) return;
    const proxy = { v: 92 };
    gsap.to(proxy, {
      v: 50,
      duration: 1.8,
      ease: "expo.inOut",
      onUpdate: () => setPos(proxy.v),
      scrollTrigger: { trigger: root.querySelector("[data-compare]"), start: "top 75%", once: true },
    });
  });

  return (
    <section ref={ref} className="relative py-28 sm:py-40" aria-labelledby="ba-title">
      <div className="wrap flex flex-col gap-12">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <Eyebrow index="03">Before / after</Eyebrow>
            <SplitReveal as="h2" className="display text-[clamp(2.6rem,6vw,6rem)]">
              <span id="ba-title" className="heavy">
                Same week.
              </span>{" "}
              <span className="light">Less of it.</span>
            </SplitReveal>
          </div>
          <p className="text-lg text-paper/70 lg:col-span-5">
            Drag across a typical week for a small online business. Left is how it usually goes. Right is after we&apos;ve automated the
            repetitive parts.
          </p>
        </div>

        <div data-compare className="relative select-none overflow-hidden rounded-[28px] border border-line bg-ink-2">
          <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-xs sm:px-5">
            <span className="text-accent">● before</span>
            <span className="text-lime">after ●</span>
          </div>
          <div className="relative h-[460px] sm:h-[520px]">
            <div className="absolute inset-0">
              <Week blocks={BEFORE_WEEK} variant="before" />
            </div>
            <div className="absolute inset-0 bg-ink-2" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
              <Week blocks={AFTER_WEEK} variant="after" ghosts={BEFORE_WEEK} />
            </div>
            {/* Handle */}
            <div className="pointer-events-none absolute inset-y-0 z-10 w-px bg-paper" style={{ left: `${pos}%` }} aria-hidden="true">
              <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper font-mono text-sm text-ink shadow-xl">
                ‹ ›
              </div>
            </div>
            <label htmlFor="ba-range" className="sr-only">
              Compare the week before and after automation
            </label>
            <input
              id="ba-range"
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(pos)}
              onChange={(e) => setPos(Number(e.target.value))}
              data-cursor="Drag"
              className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
              style={{ touchAction: "pan-y" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
