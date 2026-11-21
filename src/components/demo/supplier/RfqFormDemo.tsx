"use client";

import { useRef, useState, type FormEvent } from "react";
import { CEYLON, INCOTERMS, PRODUCTS, VOLUMES } from "@/lib/demo/supplier";

/**
 * The demo's request-for-quote. Deliberately goes nowhere: it validates, shows
 * the success state a real one would, and sends no data anywhere.
 *
 * The field order is the pitch: volume, destination and incoterm up front, so
 * the exporter can price it without a round trip of emails. That is the single
 * thing a B2B enquiry form is for.
 */
export function RfqFormDemo() {
  const [sent, setSent] = useState(false);
  const [volume, setVolume] = useState("");
  const [terms, setTerms] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const done = useRef<HTMLDivElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (String(data.get("company") ?? "").trim().length < 2) next.company = "Which company is this for?";
    if (String(data.get("name") ?? "").trim().length < 2) next.name = "Who should we reply to?";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email") ?? "").trim())) next.email = "Check that email address.";
    if (String(data.get("country") ?? "").trim().length < 2) next.country = "We price to the destination, so we need it.";
    if (!volume) next.volume = "Roughly how much?";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = ["company", "name", "email", "country", "volume"].find((f) => next[f]);
      if (first) e.currentTarget.querySelector<HTMLElement>(`[name="${first}"], #r-${first}`)?.focus();
      return;
    }
    setSent(true);
    requestAnimationFrame(() => done.current?.scrollIntoView({ block: "center", behavior: "smooth" }));
  };

  if (sent) {
    return (
      <div ref={done} className="d-card flex flex-col items-start gap-5 p-7 sm:p-10" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl text-white">✓</span>
        <h2 className="d-h2 text-brand">Received. You&apos;ll hear from us within one working day.</h2>
        <p className="max-w-md text-lg text-muted">
          A real enquiry would reach the sales desk with the grade, volume, destination and terms already filled in — which is the
          difference between a quote by Thursday and four emails establishing what you actually want.
        </p>
        <p className="rounded-lg bg-surface-2 p-4 text-sm text-muted">
          <strong className="text-ink">This is a demo</strong>, so nothing was sent and nobody was emailed.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setSent(false)} className="d-btn d-btn-ghost">
            ← Try the form again
          </button>
          <a href="/off-the-shelf/supplier" className="d-btn d-btn-primary !text-white">
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
        <h2 className="d-h2 text-brand">Request a quote.</h2>
        <p className="text-muted">
          Tell us the grade, the volume and where it&apos;s going. We reply within one working day, {CEYLON.hours.split(",")[0]}.
        </p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">
          Which product? <span className="font-normal text-muted">(optional)</span>
        </span>
        <select name="product" className="d-field" defaultValue="">
          <option value="">Not sure — advise us</option>
          {PRODUCTS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name} ({p.grade})
            </option>
          ))}
        </select>
      </label>

      <fieldset className="flex flex-col gap-3" {...aria("volume")}>
        <legend className="font-semibold">Volume</legend>
        <input type="hidden" name="volume" value={volume} />
        <div className="flex flex-wrap gap-2">
          {VOLUMES.map((v) => (
            <button
              key={v}
              type="button"
              id="r-volume"
              aria-pressed={volume === v}
              onClick={() => {
                setVolume(v);
                setErrors(({ volume: _drop, ...rest }) => rest);
              }}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                volume === v ? "border-brand bg-brand text-white" : "border-edge bg-surface hover:border-brand"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <Err field="volume" />
        {volume === "Under 500 kg" && (
          <p className="rounded-lg bg-surface-2 p-3 text-sm text-muted">
            Our standard minimum is 500 kg. Speciality grades start at 25 kg — tell us what you need and we&apos;ll say honestly
            whether we can serve it.
          </p>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-semibold">
          Terms <span className="font-normal text-muted">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {INCOTERMS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={terms === t}
              onClick={() => setTerms(t)}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                terms === t ? "border-brand bg-accent text-white" : "border-edge bg-surface hover:border-brand"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Company</span>
          <input name="company" className="d-field" placeholder="Hanseatic Tea GmbH" autoComplete="organization" {...aria("company")} />
          <Err field="company" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Your name</span>
          <input name="name" className="d-field" placeholder="Johanna Brandt" autoComplete="name" {...aria("name")} />
          <Err field="name" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Email</span>
          <input name="email" type="email" className="d-field" placeholder="you@company.com" autoComplete="email" {...aria("email")} />
          <Err field="email" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Destination country</span>
          <input name="country" className="d-field" placeholder="Germany" autoComplete="country-name" {...aria("country")} />
          <Err field="country" />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">
          Specification or questions <span className="font-normal text-muted">(optional)</span>
        </span>
        <textarea
          name="detail"
          rows={4}
          className="d-field resize-y"
          placeholder="e.g. BOPF for tea bags, need the cup profile to match our current supplier, samples to Hamburg please"
        />
      </label>

      <div className="rounded-lg bg-surface-2 p-4 text-sm text-muted">
        A real site would also let you attach your current spec sheet — the fastest way to a matched quote.
      </div>

      <div className="flex flex-col items-start gap-3 border-t border-edge pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Samples ship within five working days of an agreed spec.</p>
        <button type="submit" className="d-btn d-btn-primary !text-white">
          Send request →
        </button>
      </div>
    </form>
  );
}
