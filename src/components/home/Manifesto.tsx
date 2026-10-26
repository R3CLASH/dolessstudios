"use client";

import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { Eyebrow } from "@/components/ui/motion";

const TEXT: { w: string; tone?: "accent" | "light" | "strike" }[] = [
  ..."We're lazy".split(" ").map((w) => ({ w })),
  { w: "on", tone: "accent" },
  { w: "purpose.", tone: "accent" },
  ..."If a task happens twice, it should happen".split(" ").map((w) => ({ w })),
  { w: "by", tone: "light" },
  { w: "itself", tone: "light" },
  ..."the third time. So we build the site, the store, the app or the automation once, properly, and let it carry the repetitive work from then on. You get your hours back. We get to be".split(" ").map((w) => ({ w })),
  { w: "lazy", tone: "strike" },
  { w: "again.", tone: "accent" },
];

export function Manifesto() {
  const ref = useGsap<HTMLElement>((_c, root) => {
    if (prefersReducedMotion()) return;
    const words = root.querySelectorAll("[data-w]");
    gsap.fromTo(
      words,
      { opacity: 0.12 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.05,
        scrollTrigger: { trigger: root.querySelector("[data-manifesto]"), start: "top 75%", end: "bottom 45%", scrub: true },
      },
    );
    gsap.fromTo(
      root.querySelectorAll("[data-w-strike]"),
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: root.querySelector("[data-manifesto]"), start: "bottom 60%", end: "bottom 40%", scrub: true },
      },
    );
  });

  return (
    <section ref={ref} className="relative py-28 sm:py-40" aria-labelledby="manifesto-title">
      <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Eyebrow index="01">The idea</Eyebrow>
          <h2 id="manifesto-title" className="sr-only">
            Lazy on purpose
          </h2>
        </div>
        <p data-manifesto className="display text-[clamp(1.9rem,4.6vw,4.4rem)] leading-[1.02] tracking-[-0.035em] lg:col-span-9">
          {TEXT.map((t, i) => (
            <span key={i} className="relative inline-block whitespace-pre">
              <span
                data-w
                className={
                  t.tone === "accent" ? "heavy text-accent" : t.tone === "light" ? "light italic" : t.tone === "strike" ? "heavy" : "font-semibold"
                }
              >
                {t.w}
              </span>
              {t.tone === "strike" && (
                <span data-w-strike aria-hidden="true" className="absolute left-0 right-0 top-[98%] h-[0.07em] origin-left rounded-full bg-accent" />
              )}
              {" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
