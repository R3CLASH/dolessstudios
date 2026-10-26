"use client";

import type { ReactNode } from "react";
import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { Eyebrow, SplitReveal } from "@/components/ui/motion";
import { onReady } from "@/components/shell/Preloader";

export function PageHero({
  eyebrow,
  index,
  heavy,
  light,
  intro,
  aside,
  children,
}: {
  eyebrow: string;
  index?: string;
  heavy: string;
  light?: string;
  intro?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const ref = useGsap<HTMLElement>((ctx, root) => {
    if (prefersReducedMotion()) return;
    const fades = root.querySelectorAll("[data-hero-fade]");
    gsap.set(fades, { autoAlpha: 0, y: 30 });
    const off = onReady(() => ctx.add(() => gsap.to(fades, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: "expo.out", delay: 0.75 })));
    // Scroll parallax: the title drifts up and fades as you leave.
    gsap.to(root.querySelector("[data-hero-title]"), {
      yPercent: -18,
      autoAlpha: 0.3,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
    });
    return off;
  });

  return (
    <section ref={ref} className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-44">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div className="wrap relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <div data-hero-fade>
            <Eyebrow index={index}>{eyebrow}</Eyebrow>
          </div>
          <div data-hero-title>
            <SplitReveal as="h1" immediate delay={0.7} className="display text-[clamp(3.2rem,10vw,9.5rem)]">
              <span className="heavy">{heavy}</span>
              {light && (
                <>
                  {" "}
                  <span className="light">{light}</span>
                </>
              )}
            </SplitReveal>
          </div>
          {intro && (
            <div data-hero-fade className="max-w-2xl text-lg leading-relaxed text-paper/75 sm:text-xl">
              {intro}
            </div>
          )}
          {children && <div data-hero-fade>{children}</div>}
        </div>
        {aside && (
          <div data-hero-fade className="lg:col-span-4">
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
