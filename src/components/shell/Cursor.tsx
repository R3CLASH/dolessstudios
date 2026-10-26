"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * The cursor is the orange head of the mark. It lags behind the pointer a little (lazily),
 * grows into a ring over interactive elements, and shows a label from data-cursor="…".
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(mq.matches && !reduce.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.<HTMLElement>("a, button, [data-cursor], input, textarea, label, select, [role='slider']");
      if (!el) {
        setLabel("");
        gsap.to(ring.current, { scale: 1, backgroundColor: "rgba(255,90,31,0)", borderColor: "rgba(239,241,243,0.35)", duration: 0.35 });
        gsap.to(dot.current, { scale: 1, duration: 0.3 });
        return;
      }
      const isText = el.matches("input:not([type=range]), textarea, select");
      const text = el.dataset.cursor ?? "";
      setLabel(text);
      if (isText) {
        gsap.to(ring.current, { scale: 0.5, duration: 0.3 });
        gsap.to(dot.current, { scale: 0.6, duration: 0.3 });
      } else if (text) {
        gsap.to(ring.current, { scale: 2.6, backgroundColor: "rgba(255,90,31,1)", borderColor: "rgba(255,90,31,1)", duration: 0.4 });
        gsap.to(dot.current, { scale: 0, duration: 0.3 });
      } else {
        gsap.to(ring.current, { scale: 1.7, backgroundColor: "rgba(255,90,31,0.12)", borderColor: "rgba(255,90,31,0.9)", duration: 0.4 });
        gsap.to(dot.current, { scale: 0.5, duration: 0.3 });
      }
    };
    const leave = () => gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3, onComplete: () => void (shown = false) });
    const down = () => gsap.to(ring.current, { scale: "-=0.3", duration: 0.15, yoyo: true, repeat: 1 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] flex h-10 w-10 items-center justify-center rounded-full border border-paper/35 opacity-0 invisible"
        style={{ marginLeft: -20, marginTop: -20 }}
      >
        <span className="font-mono text-[5px] font-semibold uppercase tracking-[0.12em] text-ink">{label}</span>
      </div>
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[101] h-2.5 w-2.5 rounded-full bg-accent opacity-0 invisible"
        style={{ marginLeft: -5, marginTop: -5 }}
      />
    </>
  );
}
