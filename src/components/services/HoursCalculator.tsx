"use client";

import { useMemo, useState } from "react";

const TASKS = [
  { id: "data", label: "Copying data between tools", default: 4 },
  { id: "reports", label: "Building reports", default: 2 },
  { id: "email", label: "Answering the same emails", default: 3 },
  { id: "admin", label: "Invoices, reminders and admin", default: 2 },
];

/** Shows what the user's own numbers add up to. No made-up stats: every figure comes from their input. */
export function HoursCalculator() {
  const [hours, setHours] = useState<Record<string, number>>(Object.fromEntries(TASKS.map((t) => [t.id, t.default])));
  const [people, setPeople] = useState(2);

  const weekly = useMemo(() => Object.values(hours).reduce((a, b) => a + b, 0) * people, [hours, people]);
  const yearly = weekly * 46;
  const workWeeks = yearly / 40;

  return (
    <div className="grid grid-cols-1 gap-6 rounded-[28px] border border-line bg-ink-2 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
      <div className="flex flex-col gap-6">
        <div>
          <p className="eyebrow mb-3">Busywork calculator</p>
          <h3 className="display heavy text-[clamp(2rem,4vw,3.4rem)]">What&apos;s your boring part worth?</h3>
        </div>
        {TASKS.map((t) => (
          <div key={t.id} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`calc-${t.id}`} className="text-paper/85">
                {t.label}
              </label>
              <span className="font-mono text-sm text-accent tabular-nums">{hours[t.id]} h/wk</span>
            </div>
            <input
              id={`calc-${t.id}`}
              type="range"
              min={0}
              max={15}
              value={hours[t.id]}
              onChange={(e) => setHours((h) => ({ ...h, [t.id]: Number(e.target.value) }))}
              className="h-11 w-full accent-[var(--color-accent)]"
            />
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="calc-people" className="text-paper/85">
              People doing it
            </label>
            <span className="font-mono text-sm text-accent tabular-nums">{people}</span>
          </div>
          <input
            id="calc-people"
            type="range"
            min={1}
            max={20}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className="h-11 w-full accent-[var(--color-accent)]"
          />
        </div>
      </div>
      <div className="flex flex-col justify-between gap-8 rounded-2xl bg-ink p-6 sm:p-8">
        <div className="flex flex-col gap-2" aria-live="polite">
          <p className="font-mono text-xs text-mist">your team spends</p>
          <p className="display heavy text-[clamp(4rem,10vw,8rem)] text-accent tabular-nums">{yearly.toLocaleString()}</p>
          <p className="text-xl">hours a year on it</p>
          <p className="mt-4 text-paper/70">
            That&apos;s about <span className="font-semibold text-paper">{workWeeks.toFixed(1)} full work weeks</span>, based on {weekly} hours a week
            over 46 working weeks.
          </p>
        </div>
        <p className="text-sm text-mist">
          Not all of it can be automated. Usually a good chunk can. Tell us which line hurts most and we&apos;ll tell you what we&apos;d build.
        </p>
      </div>
    </div>
  );
}
