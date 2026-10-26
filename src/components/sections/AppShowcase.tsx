"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Project } from "@/lib/content";
import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { Eyebrow, SplitReveal } from "@/components/ui/motion";

/**
 * Product screenshots as a deck of sticky cards. Each card tilts its screenshot flat as it arrives,
 * then sinks back and dims while the next one slides over it.
 */
export function AppShowcase({
  projects,
  index,
  eyebrow,
  title,
  intro,
}: {
  projects: Project[];
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro: string;
}) {
  const ref = useGsap<HTMLElement>((_c, root) => {
    if (prefersReducedMotion()) return;
    const cards = root.querySelectorAll<HTMLElement>("[data-card]");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card.querySelector("[data-shot]"),
        { rotateX: 22, y: 80, scale: 0.9 },
        { rotateX: 0, y: 0, scale: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top 25%", scrub: true } },
      );
      gsap.from(card.querySelectorAll("[data-card-fade]"), {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: card, start: "top 70%", once: true },
      });
      const next = cards[i + 1];
      if (!next) return;
      const sink = { trigger: next, start: "top bottom", end: "top 20%", scrub: true };
      gsap.to(card.querySelector("[data-card-inner]"), { scale: 0.92, ease: "none", scrollTrigger: sink });
      gsap.to(card.querySelector("[data-dim]"), { opacity: 0.6, ease: "none", scrollTrigger: sink });
    });
  });

  return (
    <section ref={ref} className="relative py-28 sm:py-40" aria-labelledby="showcase-title">
      <div className="wrap flex flex-col gap-14">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <Eyebrow index={index}>{eyebrow}</Eyebrow>
            <SplitReveal as="h2" className="display text-[clamp(2.6rem,6vw,6rem)]">
              <span id="showcase-title">{title}</span>
            </SplitReveal>
          </div>
          <p className="text-lg text-paper/70 lg:col-span-5">{intro}</p>
        </div>

        <ol className="flex flex-col gap-6 sm:gap-10">
          {projects.map((p, i) => (
            <li
              key={p.slug}
              data-card
              className="sticky"
              style={{ top: `calc(clamp(4.5rem, 10svh, 6.5rem) + ${i * 14}px)`, zIndex: i + 1 }}
            >
              <div
                data-card-inner
                className="relative origin-top overflow-hidden rounded-[28px] border border-line bg-ink sm:rounded-[36px]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: `radial-gradient(70% 60% at 85% 0%, ${p.accent}40 0%, transparent 70%)` }}
                />
                <div className="relative grid grid-cols-1 gap-8 p-5 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:p-12">
                  <div className="flex flex-col gap-5 lg:col-span-4">
                    <div data-card-fade className="flex items-center gap-3 font-mono text-xs text-mist">
                      <span style={{ color: p.accent }}>0{i + 1}</span>
                      <span className="h-px w-8 bg-line" aria-hidden="true" />
                      <span>{p.kind}</span>
                    </div>
                    <h3 data-card-fade className="display heavy text-[clamp(2.4rem,5vw,4.6rem)]">
                      {p.title}
                    </h3>
                    <p data-card-fade className="hidden text-lg text-paper/70 sm:block">
                      {p.summary}
                    </p>
                    {p.highlights && (
                      <ul data-card-fade className="flex flex-wrap gap-2">
                        {p.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-paper/85">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      data-card-fade
                      href={`/work/${p.slug}`}
                      data-cursor="View"
                      className="group/link inline-flex w-fit items-center gap-3 font-semibold"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover/link:rotate-45 group-hover/link:border-accent group-hover/link:bg-accent group-hover/link:text-ink">
                        ↗
                      </span>
                      See how it works
                    </Link>
                  </div>
                  <div className="[perspective:1600px] lg:col-span-8">
                    <div
                      data-shot
                      className="relative origin-bottom overflow-hidden rounded-[14px] border border-paper/15 sm:rounded-[20px]"
                      style={{ boxShadow: `0 40px 100px -40px ${p.accent}80, 0 30px 60px -30px rgba(0,0,0,0.8)` }}
                    >
                      <Image
                        src={p.image!}
                        alt={`${p.title} screenshot`}
                        width={p.imageSize?.[0] ?? 2400}
                        height={p.imageSize?.[1] ?? 1500}
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="h-auto w-full"
                      />
                    </div>
                  </div>
                </div>
                <div data-dim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
