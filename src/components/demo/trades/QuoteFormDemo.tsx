"use client";

import { useRef, useState, type FormEvent } from "react";
import { JOB_TYPES, URGENCY, VOLT } from "@/lib/demo/trades";

/**
 * The demo's quote form. Deliberately goes nowhere: it validates, shows the
 * success state a real one would, and sends no data anywhere. A prospect
 * clicking through the demo should be able to feel the whole flow without
 * anyone receiving a fake enquiry.
 */
export function QuoteFormDemo() {
  const [sent, setSent] = useState(false);
  const [job, setJob] = useState("");
  const [urgency, setUrgency] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const done = useRef<HTMLDivElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (String(data.get("name") ?? "").trim().length < 2) next.name = "We need a name to put on the quote.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email") ?? "").trim())) next.email = "Check that email address.";
    if (String(data.get("phone") ?? "").trim().length < 7) next.phone = "We'll call this number, so it has to be right.";
    if (!job) next.job = "Pick the closest one.";
    if (String(data.get("detail") ?? "").trim().length < 10) next.detail = "A sentence or two is enough.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = ["name", "email", "phone", "job", "detail"].find((f) => next[f]);
      if (first) e.currentTarget.querySelector<HTMLElement>(`[name="${first}"], #q-${first}`)?.focus();
      return;
    }
    setSent(true);
    requestAnimationFrame(() => done.current?.scrollIntoView({ block: "center", behavior: "smooth" }));
  };

  if (sent) {
    return (
      <div ref={done} className="d-card flex flex-col items-start gap-5 p-7 sm:p-10" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl">✓</span>
        <h2 className="d-h2 text-brand">Got it. We&apos;ll be in touch.</h2>
        <p className="max-w-md text-lg text-muted">
          A real enquiry would land in the inbox and on WhatsApp straight away, and you&apos;d get a price back the same day.
        </p>
        <p className="rounded-lg bg-surface-2 p-4 text-sm text-muted">
          <strong className="text-ink">This is a demo</strong>, so nothing was actually sent and nobody was emailed.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setSent(false)} className="d-btn d-btn-ghost">
            ← Try the form again
          </button>
          <a href="/off-the-shelf/trades" className="d-btn d-btn-primary">
            I want this site
          </a>
        </div>
      </div>
    );
  }

  const Err = ({ field }: { field: string }) =>
    errors[field] ? (
      <span id={`err-${field}`} className="mt-1 block text-sm font-medium" style={{ color: "#c2410c" }}>
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
        <h2 className="d-h2 text-brand">Tell us what&apos;s wrong.</h2>
        <p className="text-muted">Takes a minute. The more you tell us, the more accurate the price.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Your name</span>
          <input name="name" className="d-field" placeholder="Shanika Wijesinghe" autoComplete="name" {...aria("name")} />
          <Err field="name" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Phone</span>
          <input name="phone" type="tel" className="d-field" placeholder="07X XXX XXXX" autoComplete="tel" {...aria("phone")} />
          <Err field="phone" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Email</span>
          <input name="email" type="email" className="d-field" placeholder="you@example.com" autoComplete="email" {...aria("email")} />
          <Err field="email" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">
            Address or area <span className="font-normal text-muted">(optional)</span>
          </span>
          <input name="area" className="d-field" placeholder="Colombo 5" autoComplete="address-level2" />
        </label>
      </div>

      <fieldset className="flex flex-col gap-3" {...aria("job")}>
        <legend className="font-semibold">What do you need?</legend>
        <input type="hidden" name="job" value={job} />
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              id={`q-job`}
              aria-pressed={job === t}
              onClick={() => {
                setJob(t);
                setErrors(({ job: _drop, ...rest }) => rest);
              }}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                job === t ? "border-brand bg-brand text-white" : "border-edge bg-surface hover:border-brand"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <Err field="job" />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-semibold">How soon?</legend>
        <div className="flex flex-wrap gap-2">
          {URGENCY.map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={urgency === u}
              onClick={() => setUrgency(u)}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                urgency === u ? "border-brand bg-accent text-ink" : "border-edge bg-surface hover:border-brand"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">What&apos;s happening?</span>
        <textarea
          name="detail"
          rows={4}
          className="d-field resize-y"
          placeholder="e.g. the kitchen sockets stopped working and the breaker trips whenever I reset it"
          {...aria("detail")}
        />
        <Err field="detail" />
      </label>

      <div className="rounded-lg bg-surface-2 p-4 text-sm text-muted">
        A real site would also let you attach a photo — the fastest way to get an accurate price.
      </div>

      <div className="flex flex-col items-start gap-3 border-t border-edge pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">We reply within a few hours, {VOLT.hours.split("·")[0].trim()}.</p>
        <button type="submit" className="d-btn d-btn-primary">
          Send it →
        </button>
      </div>
    </form>
  );
}
