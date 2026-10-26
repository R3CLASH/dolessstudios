"use client";

import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { ProjectCover } from "./ProjectCover";

/** Big cover image that opens like a window as it scrolls into view. */
export function CoverParallax({ slug }: { slug: string }) {
  const ref = useGsap<HTMLDivElement>((_c, root) => {
    if (prefersReducedMotion()) return;
    const inner = root.querySelector("[data-inner]");
    gsap.fromTo(
      root,
      { clipPath: "inset(8% 6% 8% 6% round 40px)" },
      { clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none", scrollTrigger: { trigger: root, start: "top 90%", end: "top 25%", scrub: true } },
    );
    gsap.fromTo(inner, { scale: 1.2, yPercent: -6 }, { scale: 1, yPercent: 6, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
  });
  return (
    <div ref={ref} className="overflow-hidden rounded-[28px] border border-line">
      <div data-inner>
        <ProjectCover slug={slug} sizes="(min-width: 1280px) 1200px, 100vw" className="aspect-[16/10] h-auto w-full" />
      </div>
    </div>
  );
}
