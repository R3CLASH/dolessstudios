"use client";

import { PRINCIPLES } from "@/lib/content";
import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { Eyebrow } from "@/components/ui/motion";

// One colour per law, so the deck still reads as separate cards when they're stacked.
const THEMES = [
  { card: "bg-accent text-ink", muted: "text-ink/60" },
  { card: "bg-paper text-ink", muted: "text-ink/55" },
  { card: "bg-ink-3 text-paper ring-1 ring-inset ring-paper/10", muted: "text-paper/55" },
  { card: "bg-lime text-ink", muted: "text-ink/60" },
];

/**
 * The laws of lazy as a pinned deck: each law slides up over the last, and the one underneath leans back and
 * dozes off, the way the logo does in the header. The checklist on the left ticks along. Without motion it's a list.
 */
export function LazyLaws() {
  const ref = useGsap<HTMLElement>((_c, root) => {
    if (prefersReducedMotion()) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-law]", root);
    const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root);
    const count = root.querySelector<HTMLElement>("[data-count]");
    const n = cards.length;

    let active = -1;
    const setActive = (i: number) => {
      if (i === active) return;
      active = i;
      steps.forEach((s, j) => s.toggleAttribute("data-on", j <= i));
      if (count) count.textContent = String(i + 1).padStart(2, "0");
    };
    setActive(0);

    gsap.set(cards, { transformOrigin: "50% 100%" });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${(n - 1) * window.innerHeight * 0.9}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.05, ease: "power2.inOut" },
        onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
      },
    });

    cards.forEach((card, i) => {
      if (i === 0) return;
      const at = i - 1;
      // Waits a full screen below its slot, so no corner peeks into the pinned section.
      tl.fromTo(card, { y: () => window.innerHeight, rotate: 5 }, { y: 0, rotate: 0, duration: 1 }, at);
      // Everything underneath sinks one step further back.
      cards.slice(0, i).forEach((under, j) => {
        const depth = i - j;
        tl.to(under, { yPercent: -15 * depth, scale: 1 - 0.04 * depth, rotationX: 14, duration: 1 }, at);
        tl.to(under.querySelector("[data-dim]"), { opacity: Math.min(0.25 * depth, 0.6), duration: 1 }, at);
      });
      tl.to(cards[i - 1].querySelector("[data-zz]"), { autoAlpha: 1, y: -6, duration: 0.6 }, at + 0.4);
    });

    return () => setActive(0);
  });

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-line bg-ink-2 motion-safe:h-[100svh]" aria-labelledby="laws-title">
      <div className="wrap grid h-full grid-cols-1 content-center gap-8 py-24 motion-safe:pb-8 motion-safe:pt-[calc(var(--header-h)+1rem)] lg:grid-cols-12 lg:gap-12 motion-safe:lg:py-[var(--header-h)]">
        <div className="flex flex-col gap-5 lg:col-span-4 lg:justify-center">
          <Eyebrow index="02">Principles</Eyebrow>
          <h2 id="laws-title" className="display text-[clamp(2.4rem,5vw,5rem)]">
            <span className="heavy">The laws</span> <span className="light">of lazy.</span>
          </h2>
          <p className="hidden max-w-sm text-lg text-paper/70 lg:block">
            Four rules every project answers to. Break one and somebody ends up doing it by hand.
          </p>
          <ol className="mt-4 hidden flex-col border-t border-line lg:flex motion-reduce:lg:hidden" aria-hidden="true">
            {PRINCIPLES.map((p) => (
              <li
                key={p.n}
                data-step
                className="group flex items-center gap-4 border-b border-line py-3 font-mono text-sm text-paper/35 transition-colors duration-500 data-[on]:text-paper"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border border-current transition-colors duration-500 group-data-[on]:border-accent group-data-[on]:bg-accent group-data-[on]:text-ink">
                  <span className="text-[11px] leading-none opacity-0 transition-opacity duration-300 group-data-[on]:opacity-100">✓</span>
                </span>
                <span className="w-8 text-accent">{p.n}</span>
                <span>{p.title}</span>
              </li>
            ))}
          </ol>
          <p className="font-mono text-sm text-mist lg:hidden motion-reduce:hidden" aria-hidden="true">
            Law <span data-count className="text-paper">01</span> / {String(PRINCIPLES.length).padStart(2, "0")}
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="grid gap-5 [perspective:1400px] motion-safe:gap-0 motion-safe:pt-8">
            {PRINCIPLES.map((p, i) => {
              const t = THEMES[i % THEMES.length];
              return (
                <article
                  key={p.n}
                  data-law
                  className={`relative flex flex-col justify-between gap-6 overflow-hidden rounded-[28px] p-7 shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.6)] sm:p-10 motion-safe:h-[min(52svh,500px)] motion-safe:[grid-area:1/1] lg:motion-safe:h-[min(62svh,540px)] ${t.card}`}
                >
                  <div className={`flex items-start justify-between font-mono text-xs uppercase tracking-[0.2em] ${t.muted}`}>
                    <span>
                      Law {p.n} of {PRINCIPLES[PRINCIPLES.length - 1].n}
                    </span>
                    <span data-zz aria-hidden="true" className="invisible text-sm normal-case tracking-[0.3em] opacity-0">
                      z z z
                    </span>
                  </div>
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-10">
                    <span className="display heavy text-[clamp(4.5rem,13vw,10rem)] leading-[0.8]" aria-hidden="true">
                      {p.n}
                    </span>
                    <div className="flex flex-col gap-3">
                      <h3 className="display heavy text-[clamp(1.9rem,4vw,3.6rem)] leading-[0.95]">{p.title}</h3>
                      <p className="max-w-md text-lg opacity-80">{p.body}</p>
                    </div>
                  </div>
                  <p className={`border-t border-current/15 pt-4 font-mono text-xs uppercase tracking-[0.15em] ${t.muted}`}>→ {p.note}</p>
                  <div data-dim className="pointer-events-none absolute inset-0 bg-ink opacity-0" aria-hidden="true" />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
