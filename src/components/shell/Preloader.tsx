"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { MARK_POSES, HEAD_POSES } from "@/components/brand/Mark";

export const READY_EVENT = "dls:ready";

export function markReady() {
  document.documentElement.dataset.ready = "1";
  window.dispatchEvent(new Event(READY_EVENT));
}

/** Calls cb once the preloader has finished (or immediately if it already has). */
export function onReady(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if (document.documentElement.dataset.ready === "1") {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(READY_EVENT, handler, { once: true });
  return () => window.removeEventListener(READY_EVENT, handler);
}

/** First-visit loader: the mark stands up, gives up, and lies down. Skipped on repeat visits. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("dls-loaded");
    if (seen || prefersReducedMotion() || !root.current) {
      setDone(true);
      markReady();
      return;
    }
    sessionStorage.setItem("dls-loaded", "1");
    const el = root.current;
    const body = el.querySelector("[data-pre-body]");
    const head = el.querySelector("[data-pre-head]");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setDone(true);
        },
      });
      tl.set(body, { attr: { d: MARK_POSES.upright } })
        .fromTo(body, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" })
        .fromTo(head, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.35, ease: "back.out(3)" }, "-=0.15")
        .to("[data-pre-line='a']", { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.2")
        .to({}, { duration: 0.35 })
        .to("[data-pre-line='a']", { autoAlpha: 0, y: -12, duration: 0.25 })
        .to("[data-pre-line='b']", { autoAlpha: 1, y: 0, duration: 0.35 })
        .to(body, { attr: { d: MARK_POSES.reclined }, duration: 0.7, ease: "elastic.out(1, 0.6)" }, "<")
        .to(head, { attr: HEAD_POSES.reclined, duration: 0.7, ease: "elastic.out(1, 0.6)" }, "<")
        .add(markReady, "+=0.15")
        .to(el, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "<");
    }, el);
    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[95] flex flex-col items-center justify-center gap-8 bg-ink"
      role="status"
      aria-label="Loading"
    >
      <svg width="120" height="120" viewBox="0 0 120 120" overflow="visible" fill="none" aria-hidden="true">
        <path
          data-pre-body
          d={MARK_POSES.upright}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1}
          stroke="var(--color-paper)"
          strokeWidth={15}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle data-pre-head cx={HEAD_POSES.upright.cx} cy={HEAD_POSES.upright.cy} r={10.5} fill="var(--color-accent)" />
      </svg>
      <div className="relative h-6 w-72 text-center font-mono text-sm text-mist">
        <p data-pre-line="a" className="invisible absolute inset-0 translate-y-3 opacity-0">
          loading…
        </p>
        <p data-pre-line="b" className="invisible absolute inset-0 translate-y-3 opacity-0">
          nah. it&apos;s already done.
        </p>
      </div>
    </div>
  );
}
