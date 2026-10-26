"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { NAV, SERVICES, SITE } from "@/lib/content";
import { MARK_POSES, HEAD_POSES } from "@/components/brand/Mark";
import { useTransitionNav } from "./PageTransition";
import { lockScroll } from "./SmoothScroll";

const VISITED_KEY = "dls-visited";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

function isTyping() {
  const el = document.activeElement as HTMLElement | null;
  return !!el && (el.matches("input, textarea, select") || el.isContentEditable);
}

/** Small checkbox glyph used across the nav. */
function Box({ checked, className = "" }: { checked: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        fill={checked ? "var(--color-accent)" : "transparent"}
        stroke={checked ? "var(--color-accent)" : "currentColor"}
        strokeWidth="1.6"
        style={{ transition: "fill .35s, stroke .35s" }}
      />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={checked ? 0 : 1}
        style={{ transition: "stroke-dashoffset .4s cubic-bezier(.22,1,.36,1) .05s" }}
      />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const { navigate } = useTransitionNav();
  const [open, setOpen] = useState(false);
  const [napping, setNapping] = useState(false);
  const [hover, setHover] = useState(false);
  const [visited, setVisited] = useState<string[]>([]);
  const markRef = useRef<SVGSVGElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstOpen = useRef(true);

  const asleep = napping && !hover && !open;

  // Track visited top-level pages: the site is your to-do list.
  useEffect(() => {
    const top = NAV.find((n) => isActive(pathname, n.href))?.href;
    let list: string[] = [];
    try {
      list = JSON.parse(sessionStorage.getItem(VISITED_KEY) ?? "[]");
    } catch {}
    if (top && !list.includes(top)) list = [...list, top];
    try {
      sessionStorage.setItem(VISITED_KEY, JSON.stringify(list));
    } catch {}
    setVisited(list);
    setOpen(false);
  }, [pathname]);

  // The header lies down when you scroll down and gets up when you scroll back.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const d = y - last;
      if (y < 140) setNapping(false);
      else if (d > 6) setNapping(true);
      else if (d < -6) setNapping(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Morph the mark between reclined (awake) and flat (asleep).
  useEffect(() => {
    const svg = markRef.current;
    if (!svg) return;
    const body = svg.querySelector("[data-mark-body]");
    const head = svg.querySelector("[data-mark-head]");
    const dur = prefersReducedMotion() ? 0 : 0.8;
    gsap.to(body, { attr: { d: asleep ? MARK_POSES.flat : MARK_POSES.reclined }, duration: dur, ease: "elastic.out(1, 0.7)" });
    gsap.to(head, { attr: asleep ? HEAD_POSES.flat : HEAD_POSES.reclined, duration: dur, ease: "elastic.out(1, 0.7)" });
  }, [asleep]);

  // Menu open / close animation.
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    if (firstOpen.current && !open) {
      firstOpen.current = false;
      gsap.set(el, { autoAlpha: 0 });
      return;
    }
    lockScroll(open);
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (open) {
        gsap
          .timeline()
          .set(el, { autoAlpha: 1 })
          .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: reduce ? 0 : 0.8, ease: "expo.inOut" })
          .fromTo(
            "[data-menu-item]",
            { yPercent: 110 },
            { yPercent: 0, duration: reduce ? 0 : 0.8, stagger: 0.06, ease: "expo.out" },
            "-=0.35",
          )
          .fromTo("[data-menu-fade]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 }, "-=0.6")
          .add(() => el.querySelector<HTMLElement>("[data-menu-link]")?.focus({ preventScroll: true }));
      } else {
        gsap
          .timeline()
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: reduce ? 0 : 0.6, ease: "expo.inOut" })
          .set(el, { autoAlpha: 0 });
      }
    }, el);
    return () => ctx.kill();
  }, [open]);

  const go = useCallback(
    (href: string) => {
      navigate(href);
    },
    [navigate],
  );

  // Keyboard: Esc closes, number keys jump to pages (for the truly lazy).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuBtn.current?.focus();
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping()) return;
      const item = NAV.find((n) => n.key === e.key);
      if (item) {
        e.preventDefault();
        go(item.href);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const doneCount = visited.length;
  const allDone = doneCount >= NAV.length;

  return (
    <>
      <a
        href="#main"
        data-no-transition
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <header
        className="fixed inset-x-0 top-0 z-[70] pt-3 sm:pt-4"
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocusCapture={() => setHover(true)}
        onBlurCapture={() => setHover(false)}
      >
        <div className="wrap flex items-center justify-between gap-3">
          {/* The lounger: logo that lies down when you scroll */}
          <Link
            href="/"
            aria-label="Do Less Studios, home"
            className={`group relative flex h-12 items-center rounded-full border border-line bg-ink/70 pl-2 backdrop-blur-xl transition-[padding,background-color] duration-500 ease-[var(--ease-lazy)] sm:h-14 ${
              asleep ? "pr-2" : "pr-4 sm:pr-5"
            }`}
          >
            <span className="relative flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
              <svg ref={markRef} viewBox="0 0 120 120" overflow="visible" className="h-full w-full text-paper" fill="none" aria-hidden="true">
                <path
                  data-mark-body
                  d={MARK_POSES.reclined}
                  stroke="currentColor"
                  strokeWidth={15}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle data-mark-head cx={HEAD_POSES.reclined.cx} cy={HEAD_POSES.reclined.cy} r={10.5} fill="var(--color-accent)" />
              </svg>
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -right-1 -top-2 font-mono text-[10px] font-semibold text-accent transition-opacity duration-500 ${
                  asleep ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="float-slow inline-block">z</span>
                <span className="float-slow inline-block -translate-y-1.5 text-[8px]" style={{ animationDelay: "-2s" }}>
                  z
                </span>
              </span>
            </span>
            <span
              className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-500 ease-[var(--ease-lazy)] ${
                asleep ? "ml-0 max-w-0 opacity-0" : "ml-2 max-w-40 opacity-100"
              }`}
            >
              <span className="display flex gap-[0.22em] text-[22px] sm:text-[24px]">
                <span className="heavy">do</span>
                <span className="light">less</span>
              </span>
            </span>
          </Link>

          {/* Checklist nav: pages are tasks, the current one is ticked off */}
          <nav
            aria-label="Primary"
            className={`absolute left-1/2 top-4 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-ink/70 p-1.5 backdrop-blur-xl transition-[transform,opacity] duration-500 ease-[var(--ease-lazy)] lg:flex ${
              asleep ? "pointer-events-none -translate-y-20 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            {NAV.slice(1, 4).map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group flex h-11 items-center gap-2.5 rounded-full px-4 text-[15px] text-paper/80 transition-colors hover:bg-ink-3 hover:text-paper"
                >
                  <Box checked={active} className="h-4 w-4 text-mist transition-colors group-hover:text-paper" />
                  <span className={`strike strike-on-hover ${active ? "is-struck text-paper" : ""}`}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("dls:palette"))}
              className={`hidden h-14 items-center gap-2 rounded-full border border-line bg-ink/70 px-4 font-mono text-xs text-mist backdrop-blur-xl transition-[opacity,transform] duration-500 hover:text-paper xl:flex ${
                asleep ? "pointer-events-none translate-x-6 opacity-0" : ""
              }`}
              aria-label="Open command palette"
            >
              <kbd className="rounded border border-line px-1.5 py-0.5">⌘K</kbd>
              <span>lazy mode</span>
            </button>
            <Link
              href="/contact"
              className={`btn btn-accent hidden h-14 sm:inline-flex ${asleep ? "pointer-events-none translate-x-6 opacity-0" : ""}`}
              style={{ transitionProperty: "color, opacity, transform", transitionDuration: ".5s" }}
            >
              Start a project
            </Link>
            <button
              ref={menuBtn}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((o) => !o)}
              className="group flex h-12 items-center gap-2.5 rounded-full border border-line bg-ink/70 pl-3 pr-4 backdrop-blur-xl transition-colors hover:border-paper/50 sm:h-14 sm:pl-4 sm:pr-5"
            >
              <Box checked={open} className="h-5 w-5 text-paper" />
              <span className="font-mono text-xs uppercase tracking-[0.14em]">{open ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen to-do list menu */}
      <div
        id="site-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        className="invisible fixed inset-0 z-[65] overflow-y-auto bg-ink-2"
        data-lenis-prevent
      >
        <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="wrap relative grid min-h-full grid-cols-1 gap-10 pb-10 pt-24 sm:pt-32 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div data-menu-fade className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
              <p className="eyebrow">Today&apos;s list · this website</p>
              <p className="font-mono text-xs text-mist" aria-live="polite">
                {allDone ? "all done. go do less." : `${doneCount} of ${NAV.length} done`}
              </p>
            </div>
            <ul className="flex flex-col">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                const done = visited.includes(item.href);
                return (
                  <li key={item.href} className="overflow-hidden border-b border-line/60">
                    <div data-menu-item>
                      <Link
                        href={item.href}
                        data-menu-link
                        tabIndex={open ? 0 : -1}
                        aria-current={active ? "page" : undefined}
                        className="group flex items-center gap-4 py-3 sm:gap-6 sm:py-4"
                      >
                        <Box
                          checked={done}
                          className="h-7 w-7 shrink-0 text-mist transition-transform duration-500 group-hover:scale-110 group-hover:text-paper sm:h-10 sm:w-10"
                        />
                        <span
                          className={`display strike strike-on-hover text-[clamp(2.6rem,9vw,6.5rem)] ${
                            done ? "is-struck text-paper/45" : "text-paper"
                          } heavy transition-colors group-hover:text-paper`}
                        >
                          {item.label}
                        </span>
                        <span className="ml-auto hidden flex-col items-end gap-1 text-right sm:flex">
                          <span className="font-mono text-xs text-mist">{active ? "you are here" : item.note}</span>
                          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-mist">{item.key}</kbd>
                        </span>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="flex flex-col gap-8 lg:col-span-4 lg:pt-14">
            <div data-menu-fade>
              <p className="eyebrow mb-4">Services</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-1">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      tabIndex={open ? 0 : -1}
                      className="group inline-flex items-center gap-2 py-1 text-paper/80 hover:text-paper"
                    >
                      <span className="font-mono text-[11px] text-mist">{s.index}</span>
                      <span className="strike strike-on-hover">{s.short}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div data-menu-fade className="rounded-2xl border border-line bg-ink/60 p-5">
              <p className="mb-2 font-semibold">Too lazy to click?</p>
              <p className="text-sm leading-relaxed text-mist">
                Press <kbd className="rounded border border-line px-1 font-mono text-xs">1</kbd>–
                <kbd className="rounded border border-line px-1 font-mono text-xs">5</kbd> anywhere on the site, or{" "}
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={() => {
                    setOpen(false);
                    window.dispatchEvent(new Event("dls:palette"));
                  }}
                  className="underline decoration-accent underline-offset-4 hover:text-paper"
                >
                  open lazy mode (⌘K)
                </button>
                .
              </p>
            </div>
            {(SITE.email || SITE.socials.length > 0) && (
              <div data-menu-fade className="mt-auto flex flex-col gap-3">
                {SITE.email && (
                  <a href={`mailto:${SITE.email}`} tabIndex={open ? 0 : -1} className="text-lg hover:text-accent">
                    {SITE.email}
                  </a>
                )}
                {SITE.socials.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {SITE.socials.map((s) => (
                      <a key={s.label} href={s.href} tabIndex={open ? 0 : -1} className="chip hover:border-paper/40 hover:text-paper">
                        {s.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
