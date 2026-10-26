"use client";

import { useEffect, useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;
if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  registered = true;
}

export { gsap, ScrollTrigger, SplitText };

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Runs GSAP setup scoped to a container and reverts everything on unmount.
 * The callback receives the context so nested matchMedia etc. clean up together.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: gsap.Context, root: T) => void | (() => void),
  deps: DependencyList = [],
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    let cleanup: void | (() => void);
    const ctx = gsap.context((self) => {
      cleanup = setup(self, root);
    }, root);
    return () => {
      if (typeof cleanup === "function") cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
