"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { NAV, SERVICES, PROJECTS } from "@/lib/content";
import { Mark } from "@/components/brand/Mark";
import { scrollToTop } from "./SmoothScroll";

type Ctx = { navigate: (href: string) => void; transitioning: boolean };
const TransitionContext = createContext<Ctx>({ navigate: () => {}, transitioning: false });
export const useTransitionNav = () => useContext(TransitionContext);

function labelFor(pathname: string) {
  const nav = NAV.find((n) => n.href === pathname);
  if (nav) return nav.label;
  const [, section, slug] = pathname.split("/");
  if (section === "services") return SERVICES.find((s) => s.slug === slug)?.short ?? "Services";
  if (section === "work") return PROJECTS.find((p) => p.slug === slug)?.title ?? "Work";
  return "Somewhere";
}

const LINES = ["on it", "doing the walking", "this is the only effort", "be right there", "fetching it lazily"];

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const safety = useRef<number | null>(null);
  const [label, setLabel] = useState("");
  const [line, setLine] = useState(LINES[0]);
  const [transitioning, setTransitioning] = useState(false);

  const uncover = useCallback(() => {
    if (!overlay.current || !panel.current) return;
    if (safety.current) window.clearTimeout(safety.current);
    scrollToTop(true);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay.current, { autoAlpha: 0 });
          setTransitioning(false);
        },
      });
      tl.to(panel.current!.querySelectorAll("[data-t-fade]"), { autoAlpha: 0, y: -16, duration: 0.3, stagger: 0.04, ease: "power2.in" })
        .to(panel.current, { yPercent: -100, duration: 0.75, ease: "expo.inOut" }, "-=0.05");
    });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        if (url.hash) router.push(href);
        else scrollToTop();
        return;
      }
      if (prefersReducedMotion() || !overlay.current || !panel.current) {
        router.push(href);
        return;
      }
      pending.current = url.pathname;
      setLabel(labelFor(url.pathname));
      setLine(LINES[Math.floor(Math.random() * LINES.length)]);
      setTransitioning(true);
      router.prefetch(href);
      const tl = gsap.timeline();
      tl.set(overlay.current, { autoAlpha: 1 })
        .fromTo(panel.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: "expo.inOut" })
        .fromTo(
          panel.current.querySelectorAll("[data-t-fade]"),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06 },
          "-=0.25",
        )
        .add(() => {
          router.push(href, { scroll: false });
          safety.current = window.setTimeout(() => {
            pending.current = null;
            uncover();
          }, 5000);
        });
    },
    [router, uncover],
  );

  // Park the curtain below the viewport (GSAP owns this transform).
  useEffect(() => {
    if (panel.current) gsap.set(panel.current, { yPercent: 100 });
  }, []);

  // When the new route has rendered, lift the curtain.
  useEffect(() => {
    if (pending.current && pending.current === pathname) {
      pending.current = null;
      const id = window.setTimeout(uncover, 120);
      return () => window.clearTimeout(id);
    }
  }, [pathname, uncover]);

  // Intercept internal link clicks globally so every <a> gets the transition.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || a.hasAttribute("download") || a.target === "_blank" || a.dataset.noTransition !== undefined) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      e.preventDefault();
      e.stopPropagation();
      navigate(url.pathname + url.search + url.hash);
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [navigate]);

  return (
    <TransitionContext.Provider value={{ navigate, transitioning }}>
      {children}
      <div ref={overlay} className="pointer-events-none fixed inset-0 z-[80] invisible opacity-0" aria-hidden="true">
        <div
          ref={panel}
          className="grid-bg absolute inset-0 flex flex-col items-center justify-center gap-6 bg-ink-2"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <div data-t-fade>
            <Mark size={96} className="text-paper" />
          </div>
          <p data-t-fade className="display text-[clamp(2.5rem,9vw,7rem)]">
            <span className="light">→ </span>
            <span className="heavy">{label}</span>
          </p>
          <p data-t-fade className="eyebrow">
            {line}
            <span className="art-blink">_</span>
          </p>
        </div>
      </div>
      <span className="sr-only" aria-live="polite">
        {transitioning ? `Loading ${label}` : ""}
      </span>
    </TransitionContext.Provider>
  );
}
