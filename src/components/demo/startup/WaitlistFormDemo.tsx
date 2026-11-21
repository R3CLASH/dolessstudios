"use client";

import { useRef, useState, type FormEvent } from "react";
import { LAUNCH, ROLES, SOURCES } from "@/lib/demo/startup";

/**
 * The demo's waitlist form. Validates, shows the confirmation a real one would,
 * and sends nothing anywhere.
 */
export function WaitlistFormDemo({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const [role, setRole] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const done = useRef<HTMLDivElement>(null);

  const toggleSource = (s: string) =>
    setSources((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email") ?? "").trim())) next.email = "That email doesn't look right.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
    requestAnimationFrame(() => done.current?.scrollIntoView({ block: "center", behavior: "smooth" }));
  };

  if (sent) {
    return (
      <div ref={done} className="d-card flex flex-col items-start gap-4 p-6 sm:p-8" role="status">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl text-white">✓</span>
        <h2 className="d-h2 text-brand">You&apos;re on the list.</h2>
        <p className="max-w-md text-muted">
          A real signup would land in the database, trigger a welcome email, and show up on the team&apos;s dashboard the same
          minute.
        </p>
        <p className="rounded-lg bg-surface-2 p-4 text-sm text-muted">
          <strong className="text-ink">This is a demo</strong>, so nothing was stored and no email was sent.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setSent(false)} className="d-btn d-btn-ghost">
            ← Try again
          </button>
          <a href="/off-the-shelf/startup" className="d-btn d-btn-primary !text-white">
            I want this page
          </a>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={onSubmit} noValidate className="flex w-full max-w-lg flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="wl-email-compact" className="sr-only">
            Email
          </label>
          <input
            id="wl-email-compact"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="d-field flex-1"
            aria-invalid={Boolean(errors.email)}
          />
          <button type="submit" className="d-btn d-btn-primary !text-white">
            Join the waitlist
          </button>
        </div>
        {errors.email ? (
          <span className="text-sm font-medium" style={{ color: "#c0392b" }}>
            {errors.email}
          </span>
        ) : (
          <span className="text-sm text-muted">
            {LAUNCH.waitlistCount.toLocaleString("en-US")} people ahead of you. No card, no spam.
          </span>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="d-card flex flex-col gap-6 p-7 sm:p-9">
      <div className="flex flex-col gap-1">
        <h2 className="d-h2 text-brand">Get early access.</h2>
        <p className="text-muted">We let a few teams in each week. Tell us a bit and we&apos;ll put you near the front.</p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">Work email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="d-field"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && (
          <span className="mt-1 block text-sm font-medium" style={{ color: "#c0392b" }}>
            {errors.email}
          </span>
        )}
      </label>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-semibold">What do you do?</legend>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              onClick={() => setRole(r)}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                role === r ? "border-brand bg-brand text-white" : "border-edge bg-surface hover:border-brand"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-semibold">
          Where does your data live? <span className="font-normal text-muted">(pick any)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {SOURCES.map((s) => {
            const on = sources.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => toggleSource(s)}
                className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                  on ? "border-accent bg-accent text-white" : "border-edge bg-surface hover:border-brand"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col items-start gap-3 border-t border-edge pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{LAUNCH.waitlistCount.toLocaleString("en-US")} on the list. No card required.</p>
        <button type="submit" className="d-btn d-btn-primary !text-white">
          Join the waitlist →
        </button>
      </div>
    </form>
  );
}
