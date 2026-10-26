"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { NAV, SERVICES, SITE } from "@/lib/content";
import { subscribe, type FormState } from "@/lib/actions";
import { Mark } from "@/components/brand/Mark";
import { scrollToTop } from "./SmoothScroll";

function studioStatus(hour: number) {
  if (hour < 7) return "We're asleep. Obviously.";
  if (hour < 9) return "Coffee first.";
  if (hour < 13) return "Working. Lazily.";
  if (hour < 14) return "Lunch. A long one.";
  if (hour < 18) return "Automating something.";
  if (hour < 22) return "Done for the day.";
  return "Should be asleep.";
}

function LocalClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  if (!now) return <span className="font-mono text-sm text-mist">--:--</span>;
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: SITE.timezone }).format(now);
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: SITE.timezone }).format(now));
  return (
    <span className="flex flex-wrap items-center gap-2 font-mono text-sm text-mist">
      <span className="relative flex h-2 w-2">
        <span className="art-pulse absolute inset-0 rounded-full bg-accent" />
      </span>
      <span className="text-paper">{time}</span> in {SITE.location} · {studioStatus(hour)}
    </span>
  );
}

function Newsletter() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, { ok: false, message: "" });
  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="footer-email" className="font-semibold">
        The Lazy Letter
      </label>
      <p className="text-sm text-mist">One useful automation idea, whenever we have a good one. No schedule, no spam.</p>
      <div className="flex h-14 items-center rounded-full border border-line bg-ink-2 p-1.5 focus-within:border-paper/50">
        <input
          id="footer-email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          autoComplete="email"
          className="h-full min-w-0 flex-1 bg-transparent px-4 text-paper placeholder:text-mist/60 focus:outline-none"
        />
        <button type="submit" disabled={pending} className="btn btn-accent h-full min-h-0 px-5 text-sm disabled:opacity-60">
          {pending ? "…" : "Subscribe"}
        </button>
      </div>
      <p aria-live="polite" className={`min-h-5 text-sm ${state.ok ? "text-lime" : "text-accent"}`}>
        {state.message}
      </p>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink pt-16 sm:pt-24">
      <div className="wrap grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-4">
          <Mark size={56} className="text-paper" />
          <p className="max-w-xs text-lg leading-snug text-paper/85">{SITE.tagline}</p>
          <LocalClock />
        </div>
        <nav aria-label="Footer pages" className="lg:col-span-2">
          <p className="eyebrow mb-4">Pages</p>
          <ul className="flex flex-col gap-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="group inline-flex text-paper/80 hover:text-paper">
                  <span className="strike strike-on-hover">{n.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer services" className="lg:col-span-2">
          <p className="eyebrow mb-4">Services</p>
          <ul className="flex flex-col gap-2">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="group inline-flex text-paper/80 hover:text-paper">
                  <span className="strike strike-on-hover">{s.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sm:col-span-2 lg:col-span-4">
          <Newsletter />
          {SITE.socials.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {SITE.socials.map((s) => (
                <a key={s.label} href={s.href} className="chip hover:border-paper/40 hover:text-paper">
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="wrap mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 font-mono text-xs text-mist">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        {SITE.email && (
          <a href={`mailto:${SITE.email}`} className="hover:text-paper">
            {SITE.email}
          </a>
        )}
        <button type="button" onClick={() => scrollToTop()} className="group flex min-h-11 items-center gap-2 hover:text-paper">
          Too lazy to scroll?
          <span className="inline-block transition-transform duration-500 group-hover:-translate-y-1">↑</span>
        </button>
      </div>

      {/* Giant wordmark; the letters of "less" slump when you hover. */}
      <div className="group/word wrap select-none pb-2" aria-hidden="true">
        <p className="display flex items-end text-[clamp(5rem,23vw,21rem)] leading-[0.78] text-paper/[0.07] transition-colors duration-700 group-hover/word:text-paper/15">
          {"do".split("").map((c, i) => (
            <span key={`d${i}`} className="heavy inline-block">
              {c}
            </span>
          ))}
          <span className="w-[0.12em]" />
          {"less".split("").map((c, i) => (
            <span
              key={`l${i}`}
              className="light inline-block origin-bottom-left transition-transform duration-700 ease-[var(--ease-lazy)]"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="inline-block transition-transform duration-700 ease-[var(--ease-lazy)] group-hover/word:rotate-[8deg] group-hover/word:translate-y-[0.04em]" style={{ transitionDelay: `${i * 70}ms` }}>
                {c}
              </span>
            </span>
          ))}
          <span className="heavy inline-block text-accent/40">.</span>
        </p>
      </div>
    </footer>
  );
}
