"use client";

import { STACK_ROW_A, STACK_ROW_B } from "@/lib/content";
import { Marquee } from "@/components/ui/motion";

export function StackMarquee() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-ink-2 py-14 sm:py-20" aria-labelledby="stack-title">
      <div className="wrap mb-10 flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="stack-title" className="eyebrow">
          <span className="text-accent">06</span> · Tools we reach for
        </h2>
        <p className="font-mono text-xs text-mist">boring, proven, fast. on purpose.</p>
      </div>
      <div className="flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <Marquee
          items={STACK_ROW_A}
          duration={50}
          renderItem={(t) => (
            <span className="display mx-3 flex items-center gap-6 text-[clamp(2rem,5vw,4.5rem)] sm:mx-5">
              <span className="heavy">{t}</span>
              <span className="h-3 w-3 rounded-full bg-accent" aria-hidden="true" />
            </span>
          )}
        />
        <Marquee
          items={STACK_ROW_B}
          reverse
          duration={55}
          renderItem={(t) => (
            <span className="display mx-3 flex items-center gap-6 text-[clamp(2rem,5vw,4.5rem)] text-paper/35 sm:mx-5">
              <span className="light">{t}</span>
              <span className="h-3 w-3 rounded-full border border-paper/35" aria-hidden="true" />
            </span>
          )}
        />
      </div>
    </section>
  );
}
