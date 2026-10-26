"use client";

import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";

/** Things we refuse to do, crossed out one by one as you scroll. */
export function StrikeList({ items }: { items: string[] }) {
  const ref = useGsap<HTMLUListElement>((_c, root) => {
    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll("[data-x]"), { scaleX: 1 });
      return;
    }
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 70%", end: "bottom 50%", scrub: 0.6 } });
    root.querySelectorAll<HTMLElement>("li").forEach((li, i) => {
      tl.to(li.querySelector("[data-x]"), { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, i * 0.5)
        .to(li.querySelector("[data-t]"), { opacity: 0.3, duration: 0.4 }, i * 0.5 + 0.2)
        .fromTo(li.querySelector("[data-no]"), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, i * 0.5 + 0.3);
    });
  });
  return (
    <ul ref={ref} className="flex flex-col">
      {items.map((t) => (
        <li key={t} className="flex items-center justify-between gap-6 border-b border-line py-5 sm:py-7">
          <span className="relative">
            <span data-t className="display heavy text-[clamp(1.8rem,5vw,4.4rem)]">
              {t}
            </span>
            <span data-x aria-hidden="true" className="absolute left-[-2%] right-[-2%] top-[52%] h-[0.09em] origin-left scale-x-0 -rotate-1 rounded-full bg-accent" />
          </span>
          <span data-no aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-ink opacity-0 sm:h-12 sm:w-12">
            ✕
          </span>
        </li>
      ))}
    </ul>
  );
}
