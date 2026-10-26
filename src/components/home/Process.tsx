"use client";

import { useState } from "react";
import { PROCESS } from "@/lib/content";
import { gsap, ScrollTrigger, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { Eyebrow } from "@/components/ui/motion";
import { MARK_POSES, HEAD_POSES } from "@/components/brand/Mark";

const POSES = ["upright", "sitting", "reclined", "flat"] as const;
const CAPTIONS = ["paying attention", "getting comfortable", "doing the work", "it runs. we nap."];

export function Process() {
  const [step, setStep] = useState(0);

  const ref = useGsap<HTMLElement>((_c, root) => {
    const body = root.querySelector("[data-p-body]");
    const head = root.querySelector("[data-p-head]");
    const steps = root.querySelectorAll<HTMLElement>("[data-step]");
    const reduce = prefersReducedMotion();

    steps.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (!self.isActive) return;
          setStep(i);
          const pose = POSES[i];
          gsap.to(body, { attr: { d: MARK_POSES[pose] }, duration: reduce ? 0 : 0.9, ease: "elastic.out(1, 0.6)", overwrite: true });
          gsap.to(head, { attr: HEAD_POSES[pose], duration: reduce ? 0 : 0.9, ease: "elastic.out(1, 0.6)", overwrite: true });
        },
      });
      if (!reduce) {
        gsap.from(el.querySelectorAll("[data-step-fade]"), {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        });
      }
    });

    if (!reduce) {
      gsap.fromTo(
        root.querySelector("[data-p-line]"),
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.querySelector("[data-steps]"), start: "top 55%", end: "bottom 55%", scrub: true } },
      );
    }
  });

  return (
    <section ref={ref} className="relative border-t border-line py-28 sm:py-40" aria-labelledby="process-title">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-8 lg:sticky lg:top-28">
            <Eyebrow index="04">How it works</Eyebrow>
            <h2 id="process-title" className="display text-[clamp(2.6rem,5.6vw,5.6rem)]">
              <span className="heavy">The lazy</span> <span className="light">method.</span>
            </h2>
            <div className="hidden items-end gap-6 lg:flex">
              <svg viewBox="0 0 120 120" overflow="visible" className="h-40 w-40 text-paper xl:h-48 xl:w-48" fill="none" aria-hidden="true">
                <path data-p-body d={MARK_POSES.upright} stroke="currentColor" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
                <circle data-p-head cx={HEAD_POSES.upright.cx} cy={HEAD_POSES.upright.cy} r={10.5} fill="var(--color-accent)" />
              </svg>
              <div className="flex flex-col gap-1 pb-2">
                <span className="display heavy text-7xl text-accent tabular-nums">{PROCESS[step].n}</span>
                <span className="font-mono text-xs text-mist">{CAPTIONS[step]}</span>
              </div>
            </div>
          </div>
        </div>

        <ol data-steps className="relative flex flex-col lg:col-span-7">
          <span className="absolute bottom-0 left-[19px] top-0 w-px bg-line sm:left-[23px]" aria-hidden="true" />
          <span data-p-line className="absolute bottom-0 left-[19px] top-0 w-px origin-top bg-accent sm:left-[23px]" aria-hidden="true" />
          {PROCESS.map((p, i) => (
            <li key={p.n} data-step className="relative flex gap-6 pb-20 last:pb-0 sm:gap-10 sm:pb-28">
              <span
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-colors duration-500 sm:h-12 sm:w-12 ${
                  i <= step ? "border-accent bg-accent text-ink" : "border-line bg-ink text-mist"
                }`}
              >
                {p.n}
              </span>
              <div className="flex flex-col gap-4 pt-1">
                <h3 data-step-fade className="display heavy text-[clamp(2.4rem,5vw,4.6rem)]">
                  {p.title}
                </h3>
                <p data-step-fade className="max-w-lg text-lg leading-relaxed text-paper/70 sm:text-xl">
                  {p.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
