"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { NAV, PROJECTS, SERVICES, SITE } from "@/lib/content";
import { useTransitionNav } from "./PageTransition";
import { lockScroll } from "./SmoothScroll";

type Cmd = { id: string; group: string; label: string; hint: string; run: () => void };

/** ⌘K / Ctrl+K: the laziest way around the site. */
export function CommandPalette() {
  const { navigate } = useTransitionNav();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const navigated = useRef(false);

  const commands = useMemo<Cmd[]>(() => {
    const close = () => {
      navigated.current = true;
      setOpen(false);
    };
    return [
      ...NAV.map((n) => ({ id: n.href, group: "Pages", label: n.label, hint: n.key, run: () => (close(), navigate(n.href)) })),
      ...SERVICES.map((s) => ({
        id: s.slug,
        group: "Services",
        label: s.title,
        hint: s.index,
        run: () => (close(), navigate(`/services/${s.slug}`)),
      })),
      ...PROJECTS.map((p) => ({ id: p.slug, group: "Work", label: p.title, hint: p.kind, run: () => (close(), navigate(`/work/${p.slug}`)) })),
      ...(SITE.email
        ? [
            {
              id: "copy-email",
              group: "Actions",
              label: "Copy email address",
              hint: "↵",
              run: () => {
                navigator.clipboard?.writeText(SITE.email).catch(() => {});
                setToast("Copied. That was easy.");
                window.setTimeout(() => setToast(""), 1800);
              },
            },
          ]
        : []),
      { id: "start", group: "Actions", label: "Start a project", hint: "↵", run: () => (close(), navigate("/contact")) },
    ];
  }, [navigate]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.hint}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("dls:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("dls:palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      navigated.current = false;
      lastFocus.current = document.activeElement as HTMLElement;
      setQuery("");
      lockScroll(true);
      requestAnimationFrame(() => input.current?.focus());
      if (panel.current && !prefersReducedMotion()) {
        gsap.fromTo(panel.current, { y: 24, scale: 0.97, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.45, ease: "expo.out" });
      }
    } else {
      lockScroll(false);
      // Don't hand focus back to the trigger when we're leaving the page anyway.
      if (!navigated.current) lastFocus.current?.focus?.({ preventScroll: true });
    }
  }, [open]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
    }
  };

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div ref={panel} className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-ink-2 shadow-2xl" onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 border-b border-line px-5">
          <span className="font-mono text-accent">›</span>
          <label htmlFor="palette-input" className="sr-only">
            Search pages and actions
          </label>
          <input
            id="palette-input"
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type less. Go anywhere."
            autoComplete="off"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            className="h-16 w-full bg-transparent text-lg text-paper placeholder:text-mist/70 focus:outline-none"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-mist">esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
          {results.length === 0 && <li className="px-4 py-8 text-center text-mist">Nothing here. Which is very on brand.</li>}
          {results.map((c, i) => {
            const header = c.group !== lastGroup;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {header && <p className="eyebrow px-3 pb-1 pt-3">{c.group}</p>}
                <button
                  id={`cmd-${c.id}`}
                  role="option"
                  aria-selected={i === active}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={c.run}
                  className={`flex min-h-12 w-full items-center justify-between gap-4 rounded-xl px-3 text-left transition-colors ${
                    i === active ? "bg-ink-3 text-paper" : "text-paper/75"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`h-1.5 w-1.5 rounded-full ${i === active ? "bg-accent" : "bg-line"}`} />
                    {c.label}
                  </span>
                  <span className="font-mono text-[11px] text-mist">{c.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-between border-t border-line px-5 py-3 font-mono text-[11px] text-mist">
          <span>↑↓ to move · ↵ to go</span>
          <span aria-live="polite" className="text-accent">
            {toast}
          </span>
        </div>
      </div>
    </div>
  );
}
