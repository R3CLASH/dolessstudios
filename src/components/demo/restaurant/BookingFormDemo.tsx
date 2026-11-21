"use client";

import { useRef, useState, type FormEvent } from "react";
import { OCCASIONS, PARTY_SIZES, SITTINGS, TABLE } from "@/lib/demo/restaurant";

/**
 * The demo's table booking form. Validates and shows the confirmation a real
 * one would, then stops: no data leaves the page and nobody is emailed.
 */
export function BookingFormDemo() {
  const [sent, setSent] = useState(false);
  const [party, setParty] = useState("2");
  const [sitting, setSitting] = useState("");
  const [occasion, setOccasion] = useState("Just dinner");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const done = useRef<HTMLDivElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (String(data.get("name") ?? "").trim().length < 2) next.name = "We need a name for the booking.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email") ?? "").trim())) next.email = "Check that email address.";
    if (String(data.get("phone") ?? "").trim().length < 7) next.phone = "We'll call if anything changes.";
    if (!String(data.get("date") ?? "")) next.date = "Pick a date.";
    if (!sitting) next.sitting = "Pick a sitting.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
    requestAnimationFrame(() => done.current?.scrollIntoView({ block: "center", behavior: "smooth" }));
  };

  if (sent) {
    return (
      <div ref={done} className="d-card flex flex-col items-start gap-5 p-7 sm:p-10" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl text-white">✓</span>
        <h2 className="d-h2 text-brand">Table requested.</h2>
        <p className="max-w-md text-lg text-muted">
          A real booking would be confirmed by email within a few minutes, and land on the host stand&apos;s screen for{" "}
          {party === "7+" ? "a large party" : `${party} people`}.
        </p>
        <p className="rounded-lg bg-surface-2 p-4 text-sm text-muted">
          <strong className="text-ink">This is a demo</strong>, so no table was actually booked.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setSent(false)} className="d-btn d-btn-ghost">
            ← Try again
          </button>
          <a href="/off-the-shelf/restaurant" className="d-btn d-btn-primary !text-white">
            I want this site
          </a>
        </div>
      </div>
    );
  }

  const Err = ({ field }: { field: string }) =>
    errors[field] ? (
      <span className="mt-1 block text-sm font-medium" style={{ color: "#b3401f" }}>
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
        <h2 className="d-h2 text-brand">Book a table.</h2>
        <p className="text-muted">We hold tables for 15 minutes. For 8 or more, call us instead.</p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-semibold">How many?</legend>
        <div className="flex flex-wrap gap-2">
          {PARTY_SIZES.map((n) => (
            <button key={n} type="button" aria-pressed={party === n} onClick={() => setParty(n)} className={pill(party === n)}>
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Date</span>
          <input name="date" type="date" className="d-field" aria-invalid={Boolean(errors.date)} />
          <Err field="date" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Occasion</span>
          <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="d-field">
            {OCCASIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="flex flex-col gap-3" aria-invalid={Boolean(errors.sitting)}>
        <legend className="font-semibold">Sitting</legend>
        <div className="flex flex-wrap gap-2">
          {SITTINGS.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={sitting === s}
              onClick={() => {
                setSitting(s);
                setErrors(({ sitting: _drop, ...rest }) => rest);
              }}
              className={pill(sitting === s)}
            >
              {s}
            </button>
          ))}
        </div>
        <Err field="sitting" />
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Name</span>
          <input name="name" className="d-field" autoComplete="name" placeholder="Tharindu" aria-invalid={Boolean(errors.name)} />
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
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">
          Anything we should know? <span className="font-normal text-muted">(optional)</span>
        </span>
        <textarea name="notes" rows={3} className="d-field resize-y" placeholder="Allergies, high chair, quiet corner…" />
      </label>

      <div className="flex flex-col items-start gap-3 border-t border-edge pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Or call {TABLE.phone}.</p>
        <button type="submit" className="d-btn d-btn-primary !text-white">
          Request the table →
        </button>
      </div>
    </form>
  );
}
