"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitSolutionInquiry, type FormState } from "@/lib/actions";
import { fieldErrors } from "@/lib/inquiry";
import { BRIEF_TIMELINES } from "@/lib/inquiry";
import { readSolutionInquiry } from "@/lib/solutionInquiry";
import type { AddOn, SolutionSlug } from "@/lib/content";
import { formatMoney } from "@/lib/money";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Chip, Err, field } from "@/components/ui/form";

/** Fields in the order they appear, so focus lands on the first one that needs fixing. */
const FIELD_ORDER = ["name", "company", "timeline", "message", "email"];

type Props = {
  slug: SolutionSlug;
  title: string;
  /** The as-is price, so the receipt can show the base line. */
  priceCents: number;
  /** Add-on ids, in catalog order. Empty means they want it as-is. */
  picked: string[];
  chosen: AddOn[];
  oneOff: number;
  monthly: number;
};

export function SolutionQuoteForm({ slug, title, priceCents, picked, chosen, oneOff, monthly }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitSolutionInquiry, { ok: false, message: "" });
  const done = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Server errors replace whatever the browser-side check found.
  useEffect(() => setErrors(state.errors ?? {}), [state]);

  const invalid = (f: string) => ({
    "aria-invalid": !!errors[f],
    "aria-describedby": errors[f] ? `err-${f}` : undefined,
  });

  // Check in the browser first for instant feedback; the action validates again either way.
  // Submitting through onSubmit (not the form's action prop) stops React clearing the fields.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = readSolutionInquiry(data);
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

  const onChange = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name;
    if (errors[name]) setErrors(({ [name]: _, ...rest }) => rest);
  };

  useEffect(() => {
    if (!state.ok || !done.current) return;
    const top = done.current.getBoundingClientRect().top + window.scrollY - 140;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: "smooth" });
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-done-text]", { y: 24, autoAlpha: 0, stagger: 0.1, duration: 0.7, ease: "expo.out" });
    }, done);
    return () => ctx.revert();
  }, [state.ok]);

  if (state.ok) {
    return (
      <div ref={done} className="flex flex-col items-start gap-6 rounded-[24px] border border-line bg-ink p-7 sm:p-10" role="status">
        <span className="rounded-md bg-accent/15 px-2 py-0.5 font-mono text-xs text-accent">quote requested</span>
        <h3 data-done-text className="display heavy text-[clamp(2.2rem,5vw,3.6rem)]">
          Got it, {state.name ?? "you"}.
        </h3>
        <p data-done-text className="max-w-xl text-lg text-paper/75">
          {state.message} It&apos;ll be a fixed number for the {title.toLowerCase()} with everything you ticked — no hourly meter, no
          surprise invoice.
        </p>
      </div>
    );
  }

  const asIs = picked.length === 0;

  return (
    <form onSubmit={onSubmit} onChange={onChange} noValidate className="flex flex-col gap-7 rounded-[24px] border border-line bg-ink p-7 sm:p-10">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="source" value={`off-the-shelf:${slug}`} />
      <input type="hidden" name="solution" value={slug} />
      {picked.map((id) => (
        <input key={id} type="hidden" name="addons" value={id} />
      ))}

      <div className="flex flex-col gap-3">
        <h3 className="display heavy text-3xl">{asIs ? "Talk it through first" : "Get a fixed quote"}</h3>
        <p className="text-paper/70">
          {asIs
            ? `We'll answer your questions about the ${title} and send a price for it as-is.`
            : `For the ${title} with ${picked.length} add-on${picked.length === 1 ? "" : "s"}.`}
        </p>
      </div>

      {/* What they picked, read-only — the selection travels in the hidden inputs above. */}
      <ul className="flex flex-col gap-2 rounded-2xl border border-line bg-ink-2 p-5 text-sm">
        <li className="flex items-baseline justify-between gap-4 text-paper/80">
          <span>{title}, as-is</span>
          <span className="font-mono tabular-nums text-mist">{formatMoney(priceCents)}</span>
        </li>
        {chosen.map((a) => (
          <li key={a.id} className="flex items-baseline justify-between gap-4 text-paper/80">
            <span>+ {a.name}</span>
            <span className="font-mono tabular-nums text-mist">
              {formatMoney(a.priceCents)}
              {a.monthlyCents ? ` + ${formatMoney(a.monthlyCents)}/mo` : ""}
            </span>
          </li>
        ))}
        <li className="mt-1 flex items-baseline justify-between gap-4 border-t border-line pt-3 font-semibold">
          <span>Estimate</span>
          <span className="font-mono tabular-nums text-accent">
            {formatMoney(oneOff)}
            {monthly ? ` + ${formatMoney(monthly)}/mo` : ""}
          </span>
        </li>
      </ul>

      <div className="display text-[clamp(1.4rem,3vw,2.2rem)] font-semibold leading-[1.6] tracking-[-0.03em] text-paper">
        <p>
          I&apos;m
          <label htmlFor={`q-name-${slug}`} className="sr-only">
            Your name
          </label>
          <input
            id={`q-name-${slug}`}
            name="name"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            placeholder="your name"
            size={10}
            className={field}
            {...invalid("name")}
          />
          from
          <label htmlFor={`q-company-${slug}`} className="sr-only">
            Company (optional)
          </label>
          <input
            id={`q-company-${slug}`}
            name="company"
            maxLength={160}
            autoComplete="organization"
            placeholder="company"
            size={10}
            className={field}
            {...invalid("company")}
          />
          .
          <Err id="name" msg={errors.name} />
          <Err id="company" msg={errors.company} />
        </p>

        <fieldset className="mt-2" {...invalid("timeline")}>
          <legend className="float-left mr-2">I need it</legend>
          {BRIEF_TIMELINES.map((t) => (
            <Chip key={t} name="timeline" value={t} label={t} type="radio" />
          ))}
          <Err id="timeline" msg={errors.timeline} />
        </fieldset>

        <p className="mt-3">
          Reach me at
          <label htmlFor={`q-email-${slug}`} className="sr-only">
            Email
          </label>
          <input
            id={`q-email-${slug}`}
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

      <div>
        <label htmlFor={`q-message-${slug}`} className="text-sm text-paper/70">
          Anything else we should know? (optional)
        </label>
        <textarea
          id={`q-message-${slug}`}
          name="message"
          maxLength={5000}
          rows={3}
          placeholder="e.g. we already have a logo, and the domain is with GoDaddy"
          {...invalid("message")}
          className="mt-3 block w-full resize-y rounded-2xl border-2 border-line bg-ink-2 p-5 leading-relaxed text-paper placeholder:text-paper/30 focus:border-accent focus:outline-none"
        />
        <Err id="message" msg={errors.message} />
      </div>

      <div className="flex flex-col items-start gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={`min-h-6 text-sm ${state.message && !state.ok ? "text-accent" : "text-mist"}`}>
          {state.message && !state.ok ? state.message : "No payment yet. You'll get a fixed price first."}
        </p>
        <button type="submit" disabled={pending} data-cursor="Send" className="btn btn-accent h-14 px-7 disabled:opacity-60">
          {pending ? "Sending…" : "Send it →"}
        </button>
      </div>
    </form>
  );
}
