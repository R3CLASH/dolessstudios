"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import type Lenis from "lenis";
import { SHOWCASE, type ShowcaseSite } from "@/lib/content";
import { gsap, ScrollTrigger, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { Eyebrow, SplitReveal } from "@/components/ui/motion";

/** Degrees between sites on the wheel. */
const STEP = 30;
const N = SHOWCASE.length;
/** Viewport heights of scroll per site while the section is pinned. */
const SCROLL_PER_SITE = 0.85;

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");
const pad = (n: number) => String(n).padStart(2, "0");
const RING_TEXT = "DO LESS STUDIOS ✦ SHOWCASE ✦ ".repeat(8);

/**
 * Pinned showcase. Scrolling spins a dial of site names; each step wipes the next site's hero
 * into the browser frame with a circular reveal that grows out of the wheel's pointer.
 */
export function SiteWheel() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const stRef = useRef<ScrollTrigger | null>(null);

  const select = (i: number) => {
    if (i === activeRef.current) return;
    activeRef.current = i;
    setActive(i);
  };

  const ref = useGsap<HTMLElement>((_c, root) => {
    if (prefersReducedMotion()) return;
    const stage = root.querySelector<HTMLElement>("[data-stage]");
    const spin = root.querySelector("[data-spin]");
    const ring = root.querySelector("[data-ring]");
    const bar = root.querySelector("[data-bar]");
    const shots = gsap.utils.toArray<HTMLElement>("[data-shot]", root);
    if (!stage || !spin || !shots.length) return;

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    // Constant drift on the outer ring so the wheel never feels parked.
    tl.to(ring, { rotation: -140, duration: N - 1 }, 0);
    tl.fromTo(bar, { scaleX: 1 / N }, { scaleX: 1, duration: N - 1 }, 0);
    for (let i = 1; i < N; i++) {
      // Each step changes over the middle of its scroll segment, leaving a dwell either side.
      const at = i - 0.8;
      const d = 0.6;
      tl.to(spin, { rotation: -i * STEP, duration: d, ease: "power2.inOut" }, at);
      tl.fromTo(shots[i], { "--r": "0%" }, { "--r": "160%", duration: d, ease: "power2.inOut" }, at);
      tl.fromTo(shots[i].querySelector("[data-img]"), { scale: 1.35, rotation: -10 }, { scale: 1, rotation: 0, duration: d, ease: "power3.out" }, at);
      tl.to(shots[i - 1].querySelector("[data-img]"), { scale: 0.86, rotation: 4, duration: d, ease: "power2.inOut" }, at);
      tl.to(shots[i - 1].querySelector("[data-dim]"), { opacity: 0.75, duration: d }, at);
    }

    stRef.current = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: () => `+=${window.innerHeight * (N - 1) * SCROLL_PER_SITE}`,
      pin: true,
      scrub: 0.6,
      animation: tl,
      invalidateOnRefresh: true,
      onUpdate: (self) => select(Math.min(N - 1, Math.round(self.progress * (N - 1)))),
    });
    return () => {
      stRef.current = null;
    };
  });

  /** Click a name on the wheel: scroll to its spot, or (reduced motion) just swap it in. */
  const goTo = (i: number) => {
    const st = stRef.current;
    if (st) {
      const y = st.start + ((st.end - st.start) * i) / (N - 1);
      const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }
    const root = ref.current;
    if (!root) return;
    gsap.set(root.querySelector("[data-spin]"), { rotation: -i * STEP });
    gsap.set(root.querySelector("[data-bar]"), { scaleX: (i + 1) / N });
    root.querySelectorAll<HTMLElement>("[data-shot]").forEach((el, j) => gsap.set(el, { "--r": j <= i ? "160%" : "0%" }));
    select(i);
  };

  const site = SHOWCASE[active];

  return (
    <section ref={ref} className="site-wheel relative" aria-labelledby="wheel-title">
      <div data-stage className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink">
        {/* Accent wash that follows the active site */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-[background] duration-1000"
          style={{ background: `radial-gradient(60% 55% at 72% 55%, ${site.accent}26 0%, transparent 70%)` }}
        />

        <Wheel active={active} onPick={goTo} />

        <div className="wrap pointer-events-none relative flex h-full flex-col gap-4 pb-[calc(var(--arc)+0.75rem)] pt-[calc(var(--header-h)+0.75rem)] sm:gap-6 lg:gap-8 lg:pb-10 lg:pt-[calc(var(--header-h)+2rem)]">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div className="pointer-events-auto flex flex-col gap-3 lg:gap-5">
              <Eyebrow index="02">Showcase</Eyebrow>
              <SplitReveal as="h2" className="display text-[clamp(2.2rem,5vw,5rem)]">
                <span id="wheel-title" className="heavy">
                  Sites we&apos;ve
                </span>{" "}
                <span className="light">shipped.</span>
              </SplitReveal>
            </div>
            <p className="pointer-events-auto hidden max-w-sm text-paper/70 md:block">
              Car dealers to perfume stores to boxing gyms. Keep scrolling to spin through sites we designed and built.
            </p>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-12">
            <div className="pointer-events-auto flex min-h-0 flex-col justify-center gap-4 sm:gap-5 lg:col-span-7 lg:col-start-6">
              <BrowserFrame active={active} />
              <SiteInfo site={site} active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Wheel({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <div className="wheel-layer pointer-events-none absolute inset-0">
      <div className="wheel-pos">
        <div className="wheel-orient absolute inset-0">
          {/* Outer text ring: drifts on its own */}
          <svg data-ring aria-hidden="true" viewBox="-500 -500 1000 1000" className="absolute inset-0 h-full w-full">
            <defs>
              <path id="wheel-ring-path" d="M 0 -482 A 482 482 0 1 1 0 482 A 482 482 0 1 1 0 -482" />
            </defs>
            <text fontFamily="var(--font-mono)" fontSize="13" letterSpacing="2" fill="#575c64">
              <textPath href="#wheel-ring-path" textLength="3020" lengthAdjust="spacing">
                {RING_TEXT}
              </textPath>
            </text>
          </svg>

          {/* The dial: ticks, accent marks and site names spin together */}
          <div data-spin className="absolute inset-0">
            <svg aria-hidden="true" viewBox="-500 -500 1000 1000" className="absolute inset-0 h-full w-full">
              <circle r="466" fill="#16171b" stroke="#2c2f36" strokeWidth="1.5" />
              <circle r="300" fill="none" stroke="#2c2f36" strokeDasharray="2 8" />
              {Array.from({ length: 120 }, (_, t) => {
                const major = t % 5 === 0;
                return (
                  <line
                    key={t}
                    x1={major ? 432 : 446}
                    x2="460"
                    transform={`rotate(${t * 3})`}
                    stroke={major ? "#575c64" : "#2c2f36"}
                    strokeWidth={major ? 2 : 1.5}
                  />
                );
              })}
              {SHOWCASE.map((s, i) => (
                <line
                  key={s.title}
                  x1="418"
                  x2="460"
                  transform={`rotate(${i * STEP})`}
                  stroke={s.accent}
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity={i === active ? 1 : 0.45}
                />
              ))}
              <circle r="56" fill="#121316" stroke="#2c2f36" />
              <circle r="8" fill="#ff5a1f" />
            </svg>

            {SHOWCASE.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => onPick(i)}
                aria-label={`Show ${s.title}`}
                aria-current={i === active ? "true" : undefined}
                className={`wheel-label display heavy pointer-events-auto transition-colors duration-500 ${
                  i === active ? "text-paper" : "text-paper/20 hover:text-paper/50"
                }`}
                style={{ "--a": `${i * STEP}deg` } as CSSProperties}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <span aria-hidden="true" className="wheel-pointer" />
    </div>
  );
}

function BrowserFrame({ active }: { active: number }) {
  const site = SHOWCASE[active];
  return (
    <div
      className="wheel-frame relative overflow-hidden rounded-[14px] border border-paper/15 bg-ink-2 transition-shadow duration-700 sm:rounded-[18px]"
      style={{ boxShadow: `0 40px 100px -40px ${site.accent}99, 0 30px 60px -30px rgba(0,0,0,0.8)` }}
    >
      <div className="flex h-8 items-center gap-3 border-b border-line px-3 sm:h-9 sm:px-4" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-3" />
        </span>
        <span className="mx-auto flex h-5 min-w-0 max-w-[75%] items-center gap-2 overflow-hidden rounded-full bg-ink px-3 font-mono text-[10px] text-mist sm:h-6 sm:text-[11px]">
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="2" y="5.5" width="8" height="5.5" rx="1" />
            <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
          </svg>
          <span key={active} className="swap-in truncate">
            {host(site.url)}
          </span>
        </span>
        <span className="w-[42px]" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-ink">
        {SHOWCASE.map((s, i) => (
          <div
            key={s.title}
            data-shot
            className="wheel-shot absolute inset-0 overflow-hidden"
            style={{ "--r": i === 0 ? "160%" : "0%" } as CSSProperties}
          >
            <div data-img className="wheel-shot-img absolute inset-0">
              <Image
                src={s.image}
                alt={`${s.title} homepage hero, designed and built by Do Less Studios`}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-top"
              />
            </div>
            <div data-dim aria-hidden="true" className="absolute inset-0 bg-ink opacity-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SiteInfo({ site, active }: { site: ShowcaseSite; active: number }) {
  return (
    <div className="wheel-frame flex items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-3 font-mono text-xs text-mist">
          <span style={{ color: site.accent }}>{pad(active + 1)}</span>
          <span className="relative h-px w-12 overflow-hidden bg-line sm:w-16" aria-hidden="true">
            <span data-bar className="absolute inset-0 origin-left bg-paper" style={{ transform: `scaleX(${1 / N})` }} />
          </span>
          <span>{pad(N)}</span>
          <span key={active} className="swap-in hidden truncate sm:inline">
            · {site.kind}
          </span>
        </div>
        <h3 className="display heavy mt-2 overflow-hidden pb-[0.08em] text-[clamp(1.7rem,3.2vw,3rem)]">
          <span key={active} className="swap-in block truncate">
            {site.title}
          </span>
        </h3>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {site.project && (
          <Link href={`/work/${site.project}`} data-cursor="View" className="btn btn-ghost hidden sm:inline-flex">
            Case study
          </Link>
        )}
        <a href={site.url} target="_blank" rel="noopener" data-cursor="Visit" className="btn btn-accent">
          <span>
            Visit<span className="hidden xs:inline"> site</span> ↗
          </span>
        </a>
      </div>
    </div>
  );
}
