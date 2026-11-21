"use client";

import { useRef, useState, type FormEvent } from "react";
import { PRACTICE, REASONS, TIMES } from "@/lib/demo/clinic";

/**
 * The demo's appointment request form. Validates, shows the confirmation a real
 * one would, and sends nothing anywhere.
 *
 * Note it asks for a *request*, not a confirmed slot: that matches what the
 * as-is build actually does. Live calendar booking is a paid add-on, and the
 * demo shouldn't promise what the price doesn't include.
 */
export function AppointmentFormDemo() {
  const [sent, setSent] = useState(false);
  const [reason, setReason] = useState("");
  const [time, setTime] = useState("");
  const [existing, setExisting] = useState<"new" | "existing">("new");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const done = useRef<HTMLDivElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (String(data.get("name") ?? "").trim().length < 2) next.name = "We need a name for the appointment.";
    if (String(data.get("phone") ?? "").trim().length < 7) next.phone = "Reception will call this number to confirm.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email") ?? "").trim())) next.email = "Check that email address.";
    if (!reason) next.reason = "Pick the closest one.";
    if (!time) next.time = "When suits you?";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
    requestAnimationFrame(() => done.current?.scrollIntoView({ block: "center", behavior: "smooth" }));
  };

  if (sent) {
    return (
      <div ref={done} className="d-card flex flex-col items-start gap-5 p-7 sm:p-10" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl text-white">✓</span>
        <h2 className="d-h2 text-brand">Request received.</h2>
        <p className="max-w-md text-lg text-muted">
          Reception would call you back within one working day to confirm a time. Nothing is booked until you&apos;ve spoken to
          someone — that&apos;s deliberate.
        </p>
        <p className="rounded-lg bg-surface-2 p-4 text-sm text-muted">
          <strong className="text-ink">This is a demo</strong>, so no request was actually sent.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setSent(false)} className="d-btn d-btn-ghost">
            ← Try again
          </button>
          <a href="/off-the-shelf/clinic" className="d-btn d-btn-primary !text-white">
            I want this site
          </a>
        </div>
      </div>
    );
  }

  const Err = ({ field }: { field: string }) =>
    errors[field] ? (
      <span className="mt-1 block text-sm font-medium" style={{ color: "#a33" }}>
        {errors[field]}
      </span>
    ) : null;

  const pill = (on: boolean) =>
    `min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
      on ? "border-brand bg-brand text-white" : "border-edge bg-surface hover:border-brand"
    }`;

  return (
    <form onSubmit={onSubmit} noValidate className="d-card flex flex-col gap-6 p-7 sm:p-9">
      <div className="flex flex-col gap-1">
        <h2 className="d-h2 text-brand">Request an appointment.</h2>
        <p className="text-muted">Reception will call you back within one working day to confirm a time.</p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-semibold">Have you been here before?</legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["new", "I'm a new patient"],
              ["existing", "I'm already a patient"],
            ] as const
          ).map(([v, l]) => (
            <button key={v} type="button" aria-pressed={existing === v} onClick={() => setExisting(v)} className={pill(existing === v)}>
              {l}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Full name</span>
          <input name="name" className="d-field" autoComplete="name" placeholder="Anusha Perera" aria-invalid={Boolean(errors.name)} />
          <Err field="name" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Phone</span>
          <input name="phone" type="tel" className="d-field" autoComplete="tel" placeholder="07X XXX XXXX" aria-invalid={Boolean(errors.phone)} />
          <Err field="phone" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Email</span>
          <input name="email" type="email" className="d-field" autoComplete="email" placeholder="you@example.com" aria-invalid={Boolean(errors.email)} />
          <Err field="email" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">
            Insurer <span className="font-normal text-muted">(optional)</span>
          </span>
          <input name="insurer" className="d-field" placeholder="e.g. Ceylinco Healthcare" />
        </label>
      </div>

      <fieldset className="flex flex-col gap-3" aria-invalid={Boolean(errors.reason)}>
        <legend className="font-semibold">What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={reason === r}
              onClick={() => {
                setReason(r);
                setErrors(({ reason: _drop, ...rest }) => rest);
              }}
              className={pill(reason === r)}
            >
              {r}
            </button>
          ))}
        </div>
        <Err field="reason" />
      </fieldset>

      <fieldset className="flex flex-col gap-3" aria-invalid={Boolean(errors.time)}>
        <legend className="font-semibold">When suits you?</legend>
        <div className="flex flex-wrap gap-2">
          {TIMES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={time === t}
              onClick={() => {
                setTime(t);
                setErrors(({ time: _drop, ...rest }) => rest);
              }}
              className={pill(time === t)}
            >
              {t}
            </button>
          ))}
        </div>
        <Err field="time" />
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">
          Anything you&apos;d like us to know? <span className="font-normal text-muted">(optional)</span>
        </span>
        <textarea name="notes" rows={3} className="d-field resize-y" placeholder="Nervous patient, wheelchair access, a tooth that's been bothering you…" />
      </label>

      <p className="rounded-lg bg-surface-2 p-4 text-sm text-muted">
        Please don&apos;t send detailed medical history through this form. We&apos;ll take it properly at your appointment.
      </p>

      <div className="flex flex-col items-start gap-3 border-t border-edge pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">In pain today? Call {PRACTICE.phone}.</p>
        <button type="submit" className="d-btn d-btn-primary !text-white">
          Send the request →
        </button>
      </div>
    </form>
  );
}
