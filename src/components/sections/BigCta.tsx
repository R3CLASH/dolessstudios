"use client";

import Link from "next/link";
import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { Magnetic } from "@/components/ui/motion";
import { Mark } from "@/components/brand/Mark";

export function BigCta({
  title = "Got something boring?",
  subtitle = "Tell us the part of your week you'd happily never do again. We'll tell you how we'd automate it, for free.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const ref = useGsap<HTMLElement>((_c, root) => {
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 70%", end: "bottom bottom", scrub: 1 } });
    tl.fromTo("[data-cta-word]", { yPercent: 100 }, { yPercent: 0, stagger: 0.12, ease: "none" })
      .fromTo("[data-cta-mark]", { rotate: -40, scale: 0.6 }, { rotate: 0, scale: 1, ease: "none" }, 0)
      .fromTo("[data-cta-btn]", { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: "back.out(2)" }, "-=0.4");
  });

  const words = title.split(" ");

  return (
    <section ref={ref} className="relative overflow-hidden py-24 sm:py-36" aria-labelledby="cta-title">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="wrap relative flex flex-col items-start gap-10">
        <div data-cta-mark className="text-paper">
          <Mark size={72} />
        </div>
        <h2 id="cta-title" className="display heavy max-w-[14ch] text-[clamp(3.2rem,11vw,10rem)]">
          {words.map((w, i) => (
            <span key={i} className="split-line mr-[0.22em] inline-block align-bottom">
              <span data-cta-word className={`inline-block ${i === words.length - 1 ? "light" : ""}`}>
                {w}
              </span>
            </span>
          ))}
        </h2>
        <div className="flex w-full flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <p className="max-w-md text-lg leading-relaxed text-paper/75 sm:text-xl">{subtitle}</p>
          <div data-cta-btn>
            <Magnetic strength={0.4}>
              <Link
                href="/contact"
                data-cursor="Go"
                className="group relative flex h-40 w-40 flex-col items-center justify-center gap-1 rounded-full bg-accent text-ink transition-transform duration-500 hover:scale-105 sm:h-52 sm:w-52"
              >
                <span className="text-lg font-semibold sm:text-xl">Hand it over</span>
                <span className="text-2xl transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
