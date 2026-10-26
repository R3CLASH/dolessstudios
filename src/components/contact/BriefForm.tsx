"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitInquiry, type FormState } from "@/lib/actions";
import { BRIEF_SERVICES, BRIEF_TIMELINES, fieldErrors, readInquiry } from "@/lib/inquiry";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Fields in the order they appear, so focus lands on the first one that needs fixing. */
const FIELD_ORDER = ["name", "company", "services", "timeline", "message", "email"];

const field =
  "mx-1 inline-block min-w-[6ch] max-w-full border-b-2 border-line bg-transparent px-1 align-baseline text-accent placeholder:text-paper/25 transition-colors focus:border-accent focus:outline-none";

function Chip({ name, value, label, type }: { name: string; value: string; label: string; type: "checkbox" | "radio" }) {
  return (
    <label className="group relative mx-0.5 my-1 inline-flex cursor-pointer align-middle">
      <input type={type} name={name} value={value} className="peer sr-only" />
      <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 font-sans text-[0.5em] font-semibold tracking-normal text-paper/80 transition-all duration-300 group-hover:border-paper/50 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
        {label}
      </span>
    </label>
  );
}

function Err({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <span id={`err-${id}`} className="mt-1 block font-mono text-xs tracking-normal text-accent">
      ↳ {msg}
    </span>
  );
}

export function BriefForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitInquiry, { ok: false, message: "" });
  const done = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Server errors replace whatever the browser-side check found.
  useEffect(() => setErrors(state.errors ?? {}), [state]);

  const invalid = (field: string) => ({
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? `err-${field}` : undefined,
  });

  // Check in the browser first for instant feedback; the server action validates again either way.
  // Submitting through onSubmit (not the form's action prop) also stops React from clearing the fields.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = readInquiry(data);
    if (!result.success) {
      const errs = fieldErrors(result.error);
      setErrors(errs);
      const first = FIELD_ORDER.find((f) => errs[f]);
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    startTransition(() => action(data));
  };

  // Clear a field's message as soon as it's edited.
  const onChange = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name;
    if (errors[name]) setErrors(({ [name]: _, ...rest }) => rest);
  };

  const hasErrors = Object.keys(errors).length > 0;
  const status = hasErrors ? "A couple of things need a look." : state.ok ? "" : state.message;

  useEffect(() => {
    if (!state.ok || !done.current) return;
    // Bring the confirmation into view (the form above it just collapsed).
    const top = done.current.getBoundingClientRect().top + window.scrollY - 140;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: "smooth" });
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from("[data-done-card]", { y: 60, autoAlpha: 0, rotate: -4, duration: 0.9, ease: "back.out(1.6)" })
        .to("[data-done-fill]", { opacity: 1, duration: 0.3 }, "+=0.3")
        .to("[data-done-tick]", { strokeDashoffset: 0, duration: 0.35 }, "<0.05")
        .from("[data-done-text]", { y: 20, autoAlpha: 0, stagger: 0.1, duration: 0.6 }, "-=0.1");
    }, done);
    return () => ctx.revert();
  }, [state.ok]);

  if (state.ok) {
    return (
      <div ref={done} className="flex flex-col items-start gap-8 py-10" role="status">
        <div data-done-card className="flex items-center gap-4 rounded-2xl border border-line bg-ink-2 px-5 py-4 shadow-2xl sm:px-6 sm:py-5">
          <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="#575c64" strokeWidth="1.6" />
            <rect data-done-fill x="2" y="2" width="20" height="20" rx="5" fill="#ff5a1f" opacity={prefersReducedMotion() ? 1 : 0} />
            <path
              data-done-tick
              d="M7 12.5l3.2 3.2L17 9"
              fill="none"
              stroke="#121316"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={prefersReducedMotion() ? 0 : 1}
            />
          </svg>
          <span className="text-lg font-semibold sm:text-xl">Reply to {state.name ?? "you"}</span>
          <span className="rounded-md bg-accent/15 px-2 py-0.5 font-mono text-xs text-accent">our to-do list</span>
        </div>
        <h2 data-done-text className="display heavy text-[clamp(2.6rem,7vw,6rem)]">
          Done. <span className="light">Now relax.</span>
        </h2>
        <p data-done-text className="max-w-xl text-lg text-paper/75">
          {state.message} We&apos;ll read it properly and reply within a few hours, usually with a few questions and a rough idea of how
          we&apos;d build it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onChange={onChange} noValidate className="flex flex-col gap-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="source" value="contact" />

      <div className="display text-[clamp(1.7rem,4.2vw,3.4rem)] font-semibold leading-[1.5] tracking-[-0.03em] text-paper">
        <p>
          Hi, I&apos;m
          <label htmlFor="f-name" className="sr-only">
            Your name
          </label>
          <input id="f-name" name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="your name" size={10} className={field} {...invalid("name")} />
          from
          <label htmlFor="f-company" className="sr-only">
            Company (optional)
          </label>
          <input id="f-company" name="company" maxLength={160} autoComplete="organization" placeholder="company" size={10} className={field} {...invalid("company")} />.
          <Err id="name" msg={errors.name} />
          <Err id="company" msg={errors.company} />
        </p>

        <fieldset className="mt-2" {...invalid("services")}>
          <legend className="float-left mr-2">I need help with</legend>
          {BRIEF_SERVICES.map((s) => (
            <Chip key={s.v} name="services" value={s.v} label={s.l} type="checkbox" />
          ))}
          <Err id="services" msg={errors.services} />
        </fieldset>

        <fieldset className="mt-2" {...invalid("timeline")}>
          <legend className="float-left mr-2">and I&apos;d like it done</legend>
          {BRIEF_TIMELINES.map((t) => (
            <Chip key={t} name="timeline" value={t} label={t} type="radio" />
          ))}
          <Err id="timeline" msg={errors.timeline} />
        </fieldset>

        <div className="mt-4">
          <label htmlFor="f-message">The boring part I want gone:</label>
          <textarea
            id="f-message"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={3}
            placeholder="e.g. every morning someone copies Shopify orders into a Google Sheet and emails the warehouse…"
            {...invalid("message")}
            className="mt-3 block w-full resize-y rounded-2xl border-2 border-line bg-ink-2 p-5 font-sans text-[0.55em] font-normal leading-relaxed tracking-normal text-paper placeholder:text-paper/30 focus:border-accent focus:outline-none"
          />
          <Err id="message" msg={errors.message} />
        </div>

        <p className="mt-4">
          You can reach me at
          <label htmlFor="f-email" className="sr-only">
            Email
          </label>
          <input
            id="f-email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            size={16}
            className={field}
            {...invalid("email")}
          />
          .
          <Err id="email" msg={errors.email} />
        </p>
      </div>

      <div className="flex flex-col items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={`min-h-6 ${status ? "text-accent" : "text-mist"}`}>
          {status || "Takes about a minute. We reply to every brief."}
        </p>
        <button type="submit" disabled={pending} data-cursor="Send" className="btn btn-accent h-16 px-8 text-lg disabled:opacity-60">
          {pending ? "Adding to our list…" : "Add to your to-do list →"}
        </button>
      </div>
    </form>
  );
}
