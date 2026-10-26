"use client";

import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { MARK_POSES, HEAD_POSES } from "@/components/brand/Mark";

/** A big mark whose head looks toward the pointer, and lies down if you leave it alone. */
export function LazyMark() {
  const ref = useGsap<HTMLDivElement>((_c, root) => {
    const svg = root.querySelector("svg")!;
    const body = svg.querySelector("[data-b]");
    const head = svg.querySelector("[data-h]");
    if (prefersReducedMotion()) return;
    let idle: number | undefined;
    let asleep = false;
    const sleep = () => {
      asleep = true;
      gsap.to(body, { attr: { d: MARK_POSES.flat }, duration: 1.4, ease: "elastic.out(1, 0.5)" });
      gsap.to(head, { attr: HEAD_POSES.flat, x: 0, y: 0, duration: 1.4, ease: "elastic.out(1, 0.5)" });
      gsap.to(root.querySelector("[data-z]"), { autoAlpha: 1, duration: 0.6 });
    };
    const wake = () => {
      if (asleep) {
        asleep = false;
        gsap.to(body, { attr: { d: MARK_POSES.reclined }, duration: 0.9, ease: "back.out(2)" });
        gsap.to(head, { attr: HEAD_POSES.reclined, duration: 0.9, ease: "back.out(2)" });
        gsap.to(root.querySelector("[data-z]"), { autoAlpha: 0, duration: 0.3 });
      }
      window.clearTimeout(idle);
      idle = window.setTimeout(sleep, 4000);
    };
    const move = (e: PointerEvent) => {
      wake();
      if (asleep) return;
      const r = svg.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      gsap.to(head, { x: dx * 14, y: dy * 14, duration: 0.6, ease: "power3" });
      gsap.to(svg, { rotate: dx * 6, duration: 1, ease: "power3" });
    };
    window.addEventListener("pointermove", move, { passive: true });
    idle = window.setTimeout(sleep, 4000);
    return () => {
      window.removeEventListener("pointermove", move);
      window.clearTimeout(idle);
    };
  });

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[420px]">
      <svg viewBox="0 0 120 120" overflow="visible" className="h-auto w-full text-paper" fill="none" aria-hidden="true">
        <path data-b d={MARK_POSES.reclined} stroke="currentColor" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
        <circle data-h cx={HEAD_POSES.reclined.cx} cy={HEAD_POSES.reclined.cy} r={10.5} fill="var(--color-accent)" />
      </svg>
      <span data-z className="invisible absolute right-[6%] top-[22%] font-mono text-2xl font-bold text-accent opacity-0" aria-hidden="true">
        <span className="float-slow inline-block">z</span>
        <span className="float-slow inline-block -translate-y-4 text-lg" style={{ animationDelay: "-2s" }}>
          z
        </span>
      </span>
      <p className="mt-4 text-center font-mono text-xs text-mist">move your mouse. or don&apos;t.</p>
    </div>
  );
}
