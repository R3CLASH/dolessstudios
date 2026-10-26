"use client";

import { createElement, useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { gsap, ScrollTrigger, SplitText, useGsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import { onReady } from "@/components/shell/Preloader";

/** Masked line-by-line reveal for headings. */
export function SplitReveal({
  as = "h2",
  children,
  className = "",
  delay = 0,
  immediate = false,
  stagger = 0.08,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line-inner",
        autoSplit: true,
        onSplit(self) {
          const tween = gsap.from(self.lines, {
            yPercent: 115,
            rotate: 2,
            duration: 1.1,
            ease: "expo.out",
            stagger,
            delay,
            paused: immediate,
            scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
          });
          // Page-level headings wait for the preloader (first visit) before playing.
          if (immediate) onReady(() => tween.play());
          return tween;
        },
      });
    }, el);
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [delay, immediate, stagger]);
  return createElement(as, { ref, className }, children);
}

/** Fades children marked [data-reveal] up into place as the container enters the viewport. */
export function Reveal({
  children,
  className = "",
  stagger = 0.08,
  y = 40,
  as = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  as?: ElementType;
  style?: CSSProperties;
}) {
  const ref = useGsap<HTMLElement>(
    (_ctx, root) => {
      if (prefersReducedMotion()) return;
      const targets = root.querySelectorAll("[data-reveal]");
      const items = targets.length ? targets : [root];
      gsap.from(items, {
        y,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: root, start: "top 85%", once: true },
      });
    },
    [stagger, y],
  );
  return createElement(as, { ref, className, style }, children);
}

/** Pulls its child toward the pointer. Pure decoration on fine pointers only. */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useGsap<HTMLSpanElement>(
    (_ctx, root) => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
      const xTo = gsap.quickTo(root, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(root, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const move = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      root.addEventListener("pointermove", move);
      root.addEventListener("pointerleave", leave);
      return () => {
        root.removeEventListener("pointermove", move);
        root.removeEventListener("pointerleave", leave);
      };
    },
    [strength],
  );
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}

export function Marquee({
  items,
  reverse = false,
  duration = 40,
  className = "",
  renderItem,
}: {
  items: string[];
  reverse?: boolean;
  duration?: number;
  className?: string;
  renderItem?: (item: string, i: number) => ReactNode;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-wrap overflow-hidden ${className}`}>
      <div className="marquee" data-reverse={reverse} style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        {doubled.map((item, i) => (
          <span key={i} aria-hidden={i >= items.length ? true : undefined} className="flex shrink-0 items-center">
            {renderItem ? renderItem(item, i) : item}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Section label like "02 — Services". */
export function Eyebrow({ index, children, className = "" }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      {index && <span className="text-accent">{index}</span>}
      <span className="h-px w-8 bg-line" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export { ScrollTrigger };
