"use client";

import { useRef, useState, type FormEvent } from "react";
import { GUEST_COUNTS, PALM, ROOMS, TRIP_REASONS } from "@/lib/demo/stay";

/**
 * The demo's booking enquiry. Deliberately goes nowhere: it validates, shows
 * the success state a real one would, and sends no data anywhere. A prospect
 * clicking through the demo should feel the whole flow without anyone
 * receiving a fake booking.
 *
 * The field order is the pitch: dates and headcount first, because that is
 * what the owner needs before they can answer at all.
 */
export function EnquiryFormDemo() {
  const [sent, setSent] = useState(false);
  const [guests, setGuests] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const done = useRef<HTMLDivElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (String(data.get("name") ?? "").trim().length < 2) next.name = "We need a name for the booking.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email") ?? "").trim())) next.email = "Check that email address.";
    if (!String(data.get("arrive") ?? "")) next.arrive = "Which day are you arriving?";
    if (!String(data.get("nights") ?? "")) next.nights = "How many nights?";
    if (!guests) next.guests = "How many of you?";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = ["name", "email", "arrive", "nights", "guests"].find((f) => next[f]);
      if (first) e.currentTarget.querySelector<HTMLElement>(`[name="${first}"], #s-${first}`)?.focus();
      return;
    }
    setSent(true);
    requestAnimationFrame(() => done.current?.scrollIntoView({ block: "center", behavior: "smooth" }));
  };

  if (sent) {
    return (
      <div ref={done} className="d-card flex flex-col items-start gap-5 p-7 sm:p-10" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl">✓</span>
        <h2 className="d-h2 text-brand">Thank you. We&apos;ll confirm by email.</h2>
        <p className="max-w-md text-lg text-muted">
          A real enquiry would reach the house straight away with your dates and headcount already on it, and you&apos;d have a
          reply the same day — with a better rate than the booking sites, because nobody is taking a cut.
        </p>
        <p className="rounded-lg bg-surface-2 p-4 text-sm text-muted">
          <strong className="text-ink">This is a demo</strong>, so nothing was sent and no room was held.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setSent(false)} className="d-btn d-btn-ghost">
            ← Try the form again
          </button>
          <a href="/off-the-shelf/stay" className="d-btn d-btn-primary">
            I want this site
          </a>
        </div>
      </div>
    );
  }

  const Err = ({ field }: { field: string }) =>
    errors[field] ? (
      <span id={`err-${field}`} className="mt-1 block text-sm font-medium" style={{ color: "#b4452a" }}>
        {errors[field]}
      </span>
    ) : null;

  const aria = (field: string) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `err-${field}` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="d-card flex flex-col gap-6 p-7 sm:p-9">
      <div className="flex flex-col gap-1">
        <h2 className="d-h2 text-brand">Check our rates direct.</h2>
        <p className="text-muted">Dates first. We reply the same day, and we&apos;ll beat the booking sites on the same room.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Arriving</span>
          <input name="arrive" id="s-arrive" type="date" className="d-field" {...aria("arrive")} />
          <Err field="arrive" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Nights</span>
          <input name="nights" id="s-nights" type="number" min={1} max={30} className="d-field" placeholder="3" {...aria("nights")} />
          <Err field="nights" />
        </label>
      </div>

      <fieldset className="flex flex-col gap-3" {...aria("guests")}>
        <legend className="font-semibold">How many guests?</legend>
        <input type="hidden" name="guests" value={guests} />
        <div className="flex flex-wrap gap-2">
          {GUEST_COUNTS.map((g) => (
            <button
              key={g}
              type="button"
              id="s-guests"
              aria-pressed={guests === g}
              onClick={() => {
                setGuests(g);
                setErrors(({ guests: _drop, ...rest }) => rest);
              }}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                guests === g ? "border-brand bg-brand text-white" : "border-edge bg-surface hover:border-brand"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <Err field="guests" />
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">
          Which room? <span className="font-normal text-muted">(optional)</span>
        </span>
        <select name="room" className="d-field" defaultValue="">
          <option value="">No preference — suggest one</option>
          {ROOMS.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name} · from {r.rate.low}
            </option>
          ))}
          <option value="whole-house">The whole house</option>
        </select>
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Your name</span>
          <input name="name" className="d-field" placeholder="Marieke Visser" autoComplete="name" {...aria("name")} />
          <Err field="name" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Email</span>
          <input name="email" type="email" className="d-field" placeholder="you@example.com" autoComplete="email" {...aria("email")} />
          <Err field="email" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">
            Country <span className="font-normal text-muted">(optional)</span>
          </span>
          <input name="country" className="d-field" placeholder="Netherlands" autoComplete="country-name" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">
            Phone or WhatsApp <span className="font-normal text-muted">(optional)</span>
          </span>
          <input name="phone" type="tel" className="d-field" placeholder="+31 6 1234 5678" autoComplete="tel" />
        </label>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-semibold">What brings you?</legend>
        <div className="flex flex-wrap gap-2">
          {TRIP_REASONS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={reason === t}
              onClick={() => setReason(t)}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                reason === t ? "border-brand bg-accent text-ink" : "border-edge bg-surface hover:border-brand"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">
          Anything we should know? <span className="font-normal text-muted">(optional)</span>
        </span>
        <textarea
          name="detail"
          rows={3}
          className="d-field resize-y"
          placeholder="e.g. arriving late from the airport, and one of us doesn't eat fish"
        />
      </label>

      <div className="flex flex-col items-start gap-3 border-t border-edge pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">No deposit to enquire. {PALM.checkIn}.</p>
        <button type="submit" className="d-btn d-btn-primary">
          Send enquiry →
        </button>
      </div>
    </form>
  );
}
