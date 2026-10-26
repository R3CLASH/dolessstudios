"use client";

import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";

/** A to-do list that ticks itself off as you scroll past it. */
export function AutoChecklist({ items, via = "automated" }: { items: string[]; via?: string }) {
  const ref = useGsap<HTMLUListElement>((_c, root) => {
    const rows = root.querySelectorAll<HTMLElement>("[data-row]");
    if (prefersReducedMotion()) {
      rows.forEach((r) => r.classList.add("is-done"));
      return;
    }
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 70%", end: "bottom 45%", scrub: 0.6 } });
    rows.forEach((row, i) => {
      const q = gsap.utils.selector(row);
      tl.to(q("[data-fill]"), { opacity: 1, duration: 0.3 }, i)
        .to(q("[data-tick]"), { strokeDashoffset: 0, duration: 0.3 }, i + 0.1)
        .to(q("[data-line]"), { scaleX: 1, duration: 0.5 }, i + 0.15)
        .to(q("[data-label]"), { color: "rgba(239,241,243,0.4)", duration: 0.4 }, i + 0.2)
        .fromTo(q("[data-via]"), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.4 }, i + 0.3);
    });
  });

  return (
    <ul ref={ref} className="flex flex-col">
      {items.map((item) => (
        <li key={item} data-row className="group/row flex items-center gap-4 border-b border-line py-5 sm:gap-6 sm:py-6">
          <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 sm:h-9 sm:w-9" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="#575c64" strokeWidth="1.6" />
            <rect data-fill x="2" y="2" width="20" height="20" rx="5" fill="#ff5a1f" opacity="0" className="group-[.is-done]/row:opacity-100" />
            <path
              data-tick
              d="M7 12.5l3.2 3.2L17 9"
              fill="none"
              stroke="#121316"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1}
            />
          </svg>
          <span className="relative">
            <span data-label className="display text-[clamp(1.4rem,3.2vw,2.6rem)] font-semibold tracking-tight">
              {item}
            </span>
            <span data-line className="absolute left-0 right-0 top-1/2 h-[2px] origin-left scale-x-0 bg-paper/60" aria-hidden="true" />
          </span>
          <span data-via className="ml-auto hidden rounded-md bg-accent/15 px-2 py-1 font-mono text-xs text-accent opacity-0 sm:inline">
            {via}
          </span>
        </li>
      ))}
    </ul>
  );
}
