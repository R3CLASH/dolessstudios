"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { HERO_TASKS } from "@/lib/content";
import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { MARK_POSES, HEAD_POSES } from "@/components/brand/Mark";
import { onReady } from "@/components/shell/Preloader";

/** [desktop x%, desktop y%, mobile x%, mobile y%]. Mobile shows the first 8 only. */
const POS: [number, number, number, number][] = [
  [15, 21, 42, 15],
  [38, 14, 58, 21],
  [63, 17, 42, 27],
  [85, 24, 58, 33],
  [14, 42, 42, 68],
  [86, 44, 58, 74],
  [27, 32, 42, 80],
  [73, 34, 58, 86],
  [15, 63, 0, 0],
  [85, 64, 0, 0],
  [22, 80, 0, 0],
  [45, 87, 0, 0],
  [67, 81, 0, 0],
  [85, 74, 0, 0],
];
const ROT = [-3, 2, -1.5, 3, 2.5, -2, 1, -3, 2, -1, 3, -2.5, 1.5, -1.5];
/** The order tasks get automated in, so it feels organic rather than left-to-right. */
const ORDER = [2, 5, 0, 7, 3, 9, 1, 11, 4, 13, 6, 10, 8, 12];

export function Hero() {
  const ref = useGsap<HTMLElement>((ctx, root) => {
    const q = gsap.utils.selector(root);
    const svg = root.querySelector<SVGSVGElement>("[data-hero-mark]")!;
    const body = q("[data-hero-body]");
    const head = q("[data-hero-head]");
    const countEls = q("[data-count]");
    const setCount = (n: number) => countEls.forEach((el) => (el.textContent = String(n)));

    const finalState = () => {
      gsap.set(q("[data-card]"), { autoAlpha: 0 });
      gsap.set(q("[data-intro]"), { autoAlpha: 0 });
      gsap.set(body, { strokeDashoffset: 0, attr: { d: MARK_POSES.reclined } });
      gsap.set(head, { scale: 1, autoAlpha: 1, attr: HEAD_POSES.reclined });
      gsap.set(q("[data-final-word], [data-final-fade]"), { autoAlpha: 1, yPercent: 0, y: 0 });
      setCount(0);
    };

    if (prefersReducedMotion()) {
      finalState();
      return;
    }

    // Initial states (set before first paint so nothing flashes).
    q("[data-card]").forEach((c) => gsap.set(c, { rotation: ROT[Number(c.dataset.card)] ?? 0 }));
    gsap.set(q("[data-intro-line]"), { yPercent: 110 });
    gsap.set(q("[data-final-word]"), { yPercent: 110 });
    gsap.set(q("[data-final-fade]"), { y: 16, autoAlpha: 0 });
    gsap.set(head, { scale: 0, autoAlpha: 1, transformOrigin: "50% 50%" });

    // Entrance after the preloader: the list piles up.
    const offReady = onReady(() => {
      ctx.add(() => {
        gsap.fromTo(
          q("[data-card-float]"),
          { autoAlpha: 0, scale: 0.6, y: 40 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.9, ease: "back.out(1.6)", stagger: { each: 0.05, from: "random" } },
        );
        gsap.fromTo(q("[data-intro-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, delay: 0.2 });
        gsap.fromTo(q("[data-hud]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, delay: 0.6 });
      });
    });

    const mm = gsap.matchMedia();
    mm.add({ isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" }, (c) => {
      const { isMobile } = c.conditions as { isMobile: boolean };
      const cards = q("[data-card]").filter((el) => getComputedStyle(el).display !== "none");
      const ordered = ORDER.map((i) => cards.find((c) => c.dataset.card === String(i))).filter(Boolean) as HTMLElement[];
      const total = ordered.length;
      setCount(total);

      const headTarget = () => {
        const s = svg.getBoundingClientRect();
        const r = root.getBoundingClientRect();
        const scale = s.width / 120;
        return { x: s.left - r.left + HEAD_POSES.upright.cx * scale, y: s.top - r.top + HEAD_POSES.upright.cy * scale };
      };

      const counter = { n: total };
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerHeight * (isMobile ? 4 : 5)}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. The intro headline steps aside.
      tl.to(q("[data-intro]"), { autoAlpha: 0, scale: 0.92, filter: "blur(10px)", duration: 1 }, 0);
      tl.to(q("[data-scroll-hint]"), { autoAlpha: 0, duration: 0.5 }, 0);

      // 2. Tasks get automated one at a time and fly into the mark's head.
      const step = 0.55;
      const start = 0.8;
      ordered.forEach((card, i) => {
        const at = start + i * step;
        const cq = gsap.utils.selector(card);
        const cardBody = cq("[data-card-body]");
        tl.to(cq("[data-box-fill]"), { opacity: 1, duration: 0.2 }, at)
          .to(cq("[data-box-check]"), { strokeDashoffset: 0, duration: 0.25 }, at + 0.05)
          .to(cq("[data-strike]"), { scaleX: 1, duration: 0.3, ease: "power2.out" }, at + 0.1)
          .fromTo(cq("[data-via]"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.25 }, at + 0.2)
          .to(cq("[data-card-content]"), { autoAlpha: 0, duration: 0.2 }, at + 0.6)
          .to(
            cardBody,
            {
              width: isMobile ? 12 : 18,
              height: isMobile ? 12 : 18,
              paddingLeft: 0,
              paddingRight: 0,
              borderRadius: 999,
              backgroundColor: "#ff5a1f",
              borderColor: "#ff5a1f",
              duration: 0.4,
            },
            at + 0.62,
          )
          .to(card, { rotation: 0, duration: 0.4 }, at + 0.62)
          .to(
            card,
            {
              x: () => headTarget().x - card.offsetLeft,
              duration: 0.7,
              ease: "power1.inOut",
            },
            at + 1.0,
          )
          .to(
            card,
            {
              y: () => headTarget().y - card.offsetTop,
              duration: 0.7,
              ease: "power3.in",
            },
            at + 1.0,
          )
          .to(card, { autoAlpha: 0, duration: 0.08 }, at + 1.66);
      });
      const firstArrival = start + 1.7;
      const lastArrival = start + (total - 1) * step + 1.7;
      tl.to(counter, { n: 0, duration: lastArrival - start - 1, ease: "none", onUpdate: () => setCount(Math.round(counter.n)) }, start + 0.3);
      tl.fromTo(head, { scale: 0 }, { scale: 1, duration: lastArrival - firstArrival + 0.1, ease: "none" }, firstArrival - 0.1);

      // 3. The mark draws itself, then leans back.
      tl.to(body, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, lastArrival + 0.1)
        .to(q("[data-glow]"), { opacity: 1, scale: 1, duration: 1.6 }, "<")
        .to(body, { attr: { d: MARK_POSES.reclined }, duration: 1, ease: "back.out(1.4)" }, ">-0.1")
        .to(head, { attr: HEAD_POSES.reclined, duration: 1, ease: "back.out(1.4)" }, "<")
        .to(q("[data-hud-done]"), { autoAlpha: 1, duration: 0.4 }, "<");

      // 4. The name lands.
      tl.to(q("[data-final-word]"), { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: "expo.out" }, ">-0.5")
        .to(q("[data-final-fade]"), { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" }, ">-0.4")
        .to({}, { duration: 0.8 });

      return () => setCount(total);
    });

    return () => {
      offReady();
      mm.revert();
    };
  });

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink" aria-labelledby="hero-title">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        data-glow
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 scale-75 rounded-full opacity-0"
        style={{ background: "radial-gradient(circle, rgba(255,90,31,0.18), rgba(255,90,31,0) 65%)" }}
      />

      {/* Intro: the to-do list problem */}
      <div data-intro className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="display text-[clamp(2.4rem,7.4vw,7rem)]">
          <span className="split-line">
            <span data-intro-line className="inline-block">
              <span className="light">You have </span>
              <span className="heavy text-accent" data-count>
                14
              </span>
            </span>
          </span>
          <span className="split-line">
            <span data-intro-line className="heavy inline-block">
              things to do today.
            </span>
          </span>
        </p>
        <p className="mt-6 overflow-hidden font-mono text-xs text-mist sm:text-sm">
          <span data-intro-line className="inline-block">
            (keep scrolling. we&apos;ll handle it.)
          </span>
        </p>
      </div>

      {/* The task cards */}
      <ul aria-hidden="true" className="absolute inset-0">
        {HERO_TASKS.map((t, i) => {
          const [x, y, mx, my] = POS[i];
          return (
            <li
              key={t.label}
              data-card={i}
              className={`absolute left-[var(--mx)] top-[var(--my)] h-0 w-0 md:left-[var(--x)] md:top-[var(--y)] ${i >= 8 ? "hidden md:block" : ""}`}
              style={
                {
                  "--x": `${x}%`,
                  "--y": `${y}%`,
                  "--mx": `${mx}%`,
                  "--my": `${my}%`,
                } as CSSProperties
              }
            >
              <div data-card-float className="opacity-0">
                <div className="float-slow" style={{ animationDelay: `${-i * 0.7}s` }}>
                  <div
                    data-card-body
                    className="absolute left-0 top-0 flex h-[44px] -translate-x-1/2 -translate-y-1/2 items-center overflow-hidden whitespace-nowrap rounded-xl border border-line bg-ink-2/95 px-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] sm:h-[54px] sm:px-4"
                  >
                    <div data-card-content className="flex items-center gap-2.5 sm:gap-3">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden="true">
                        <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="#575c64" strokeWidth="1.8" />
                        <rect data-box-fill x="2" y="2" width="20" height="20" rx="5" fill="#ff5a1f" opacity="0" />
                        <path
                          data-box-check
                          d="M7 12.5l3.2 3.2L17 9"
                          fill="none"
                          stroke="#121316"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          pathLength={1}
                          strokeDasharray="1 1"
                          strokeDashoffset={1}
                        />
                      </svg>
                      <span className="relative text-[12px] text-paper/90 sm:text-[15px]">
                        {t.label}
                        <span data-strike className="absolute left-0 right-0 top-1/2 h-px origin-left scale-x-0 bg-paper" />
                      </span>
                      <span data-via className="invisible rounded-md bg-accent/15 px-1.5 py-0.5 font-mono text-[9px] text-accent opacity-0 sm:text-[11px]">
                        {t.via}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* The final lockup: mark + name */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 pb-[30vh] md:flex-row md:gap-[3vw] md:pb-[8vh]">
        <svg
          data-hero-mark
          viewBox="0 0 120 120"
          overflow="visible"
          fill="none"
          className="h-[34vw] w-[34vw] max-h-[260px] max-w-[260px] shrink-0 md:h-[19vw] md:w-[19vw] md:max-h-[300px] md:max-w-[300px]"
          aria-hidden="true"
        >
          <path
            data-hero-body
            d={MARK_POSES.upright}
            stroke="#eff1f3"
            strokeWidth={15}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1}
          />
          <circle data-hero-head cx={HEAD_POSES.upright.cx} cy={HEAD_POSES.upright.cy} r={10.5} fill="#ff5a1f" className="opacity-0" />
        </svg>
        <div className="flex flex-col items-center md:items-start">
          <h1 id="hero-title" className="display flex gap-[0.16em] text-[clamp(4.4rem,24vw,8rem)] md:text-[clamp(5rem,13.5vw,13rem)]">
            <span className="sr-only">Do Less Studios. Websites, apps and automations that do the work, so you do less.</span>
            <span aria-hidden="true" className="split-line">
              <span data-final-word className="heavy inline-block opacity-0">
                do
              </span>
            </span>
            <span aria-hidden="true" className="split-line">
              <span data-final-word className="light inline-block opacity-0">
                less
              </span>
            </span>
          </h1>
          <p
            data-final-fade
            className="mt-1 pl-[0.3em] font-mono text-[11px] font-semibold tracking-[0.62em] opacity-0 sm:text-sm"
          >
            STUDIOS
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[12vh] flex justify-center px-6 md:bottom-[9vh]">
        <div className="flex max-w-xl flex-col items-center gap-5 text-center">
          <p data-final-fade className="text-sm leading-relaxed text-paper/75 opacity-0 sm:text-lg">
            We design and build websites, Shopify and WordPress, web apps, and the automations that quietly do your busywork.
          </p>
          <div data-final-fade className="flex flex-wrap justify-center gap-3 opacity-0">
            <Link href="/contact" className="btn btn-accent">
              Start a project
            </Link>
            <Link href="/work" className="btn btn-ghost">
              See the work
            </Link>
          </div>
        </div>
      </div>

      {/* HUD */}
      <div data-hud className="wrap pointer-events-none absolute inset-x-0 bottom-5 flex items-end justify-between font-mono text-[11px] text-mist opacity-0 sm:text-xs">
        <p>
          <span className="text-paper" data-count>
            14
          </span>{" "}
          things left
          <span data-hud-done className="invisible text-accent opacity-0">
            {" "}
            · that&apos;s the idea
          </span>
        </p>
        <p data-scroll-hint className="hidden items-center gap-2 sm:flex">
          scroll to automate <span className="art-blink">↓</span>
        </p>
        <p>monday, 9:02am</p>
      </div>
    </section>
  );
}
