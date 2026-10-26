"use client";

import Link from "next/link";
import { SERVICES } from "@/lib/content";
import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { Eyebrow } from "@/components/ui/motion";
import { ServiceArt } from "@/components/services/ServiceArt";

/** A pinned horizontal rail at every width; on touch-sized screens each card snaps into the centre. */
export function ServicesRail() {
  const ref = useGsap<HTMLElement>((_c, root) => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add({ isDesktop: "(min-width: 1024px)", isMobile: "(max-width: 1023px)" }, (c) => {
      const { isMobile } = c.conditions as { isMobile: boolean };
      const track = root.querySelector<HTMLElement>("[data-track]")!;
      const panels = root.querySelectorAll<HTMLElement>("[data-panel]");
      const distance = () => track.scrollWidth - window.innerWidth;
      // Scroll progress at which each card sits centred (the intro sits at 0).
      const snapPoints = () => [
        0,
        ...Array.from(panels, (p) => gsap.utils.clamp(0, 1, (p.offsetLeft - (window.innerWidth - p.offsetWidth) / 2) / distance())),
      ];
      let points = snapPoints();
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: isMobile ? 0.4 : 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onRefresh: () => (points = snapPoints()),
          snap: isMobile
            ? { snapTo: (v: number) => gsap.utils.snap(points, v), duration: { min: 0.25, max: 0.6 }, delay: 0.05, ease: "power2.inOut" }
            : undefined,
        },
      });
      // Progress bar + each card's art leaning in as it arrives.
      gsap.to(root.querySelector("[data-progress]"), {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: () => `+=${distance()}`, scrub: true },
      });
      panels.forEach((panel) => {
        gsap.fromTo(
          panel.querySelector("[data-panel-art]"),
          { rotate: 6, scale: 0.85, autoAlpha: 0.4 },
          {
            rotate: 0,
            scale: 1,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 95%", end: isMobile ? "left 20%" : "left 35%", scrub: true },
          },
        );
      });
    });
    return () => mm.revert();
  });

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden border-y border-line bg-ink-2 motion-reduce:overflow-x-auto" aria-labelledby="services-title">
      <div
        data-track
        className="flex h-full w-max flex-row items-center gap-4 px-[var(--gutter)] sm:gap-6 lg:gap-8"
      >
        {/* Intro panel */}
        <div className="flex w-[80vw] shrink-0 flex-col justify-center gap-6 pr-4 sm:w-[60vw] lg:w-[38vw] lg:pr-10">
          <Eyebrow index="02">Services</Eyebrow>
          <h2 id="services-title" className="display text-[clamp(3rem,7vw,7.5rem)]">
            <span className="heavy">Five ways</span>
            <br />
            <span className="light">to do less.</span>
          </h2>
          <p className="max-w-md text-lg text-paper/70">
            Pick one, or let us mix them. Most clients start with a site or a store and end up automating half their week.
          </p>
          <p className="flex items-center gap-3 font-mono text-xs text-mist">
            keep scrolling <span className="inline-block h-px w-16 bg-line" /> →
          </p>
        </div>

        {SERVICES.map((s) => (
          <article
            key={s.slug}
            data-panel
            className="group relative flex h-[min(76svh,640px)] w-[84vw] shrink-0 flex-col overflow-hidden rounded-[28px] border border-line bg-ink transition-colors duration-500 hover:border-paper/30 sm:w-[72vw] lg:h-[76vh] lg:w-[min(64vw,980px)] lg:flex-row"
          >
            <div className="flex shrink-0 flex-col justify-between gap-5 p-6 pt-4 sm:gap-8 sm:p-8 lg:flex-1 lg:p-10">
              <div className="hidden items-start justify-between gap-4 lg:flex">
                <span className="font-mono text-sm text-accent">{s.index}</span>
                <span className="chip">{s.short}</span>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="display heavy text-[clamp(2.2rem,4.4vw,4.2rem)]">{s.title}</h3>
                <p className="max-w-md text-lg text-paper/70">{s.line}</p>
              </div>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {s.deliverables.slice(0, 4).map((d, i) => (
                  <li key={d} className={`items-start gap-2 text-sm text-paper/80 ${i >= 2 ? "hidden sm:flex" : "flex"}`}>
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {d}
                  </li>
                ))}
              </ul>
              <Link
                href={`/services/${s.slug}`}
                data-cursor="Open"
                className="inline-flex w-fit items-center gap-3 font-semibold after:absolute after:inset-0 after:content-['']"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                  ↗
                </span>
                Explore {s.short.toLowerCase()}
              </Link>
            </div>
            <div data-panel-art className="relative order-first flex min-h-0 flex-1 items-center justify-center p-4 pb-0 sm:p-6 sm:pb-0 lg:order-none lg:w-[46%] lg:flex-none lg:p-8 lg:pl-0">
              <ServiceArt slug={s.slug} className="h-full max-h-full w-full max-w-[460px] lg:h-auto" />
              <span className="absolute left-7 top-7 font-mono text-sm text-accent sm:left-9 sm:top-9 lg:hidden">{s.index}</span>
            </div>
          </article>
        ))}
        <div className="hidden w-[10vw] shrink-0 lg:block" aria-hidden="true" />
      </div>
      <div className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-6 h-px bg-line motion-reduce:hidden" aria-hidden="true">
        <div data-progress className="h-full origin-left scale-x-0 bg-accent" />
      </div>
    </section>
  );
}
