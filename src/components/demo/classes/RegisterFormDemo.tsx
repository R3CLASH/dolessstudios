"use client";

import { useRef, useState, type FormEvent } from "react";
import { BRANCHES, GRADES, SUBJECT_CHOICES, VIDURA } from "@/lib/demo/classes";

/**
 * The demo's class registration. Deliberately goes nowhere: it validates,
 * shows the success state a real one would, and sends no data anywhere.
 *
 * Subjects are a multi-select because that is how institutes actually sell —
 * one student, two or three classes, and a discount when it's all three.
 */
export function RegisterFormDemo() {
  const [sent, setSent] = useState(false);
  const [grade, setGrade] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const done = useRef<HTMLDivElement>(null);

  const toggle = (s: string) => {
    setSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    setErrors(({ subjects: _drop, ...rest }) => rest);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (String(data.get("student") ?? "").trim().length < 2) next.student = "The student's name, as it is on the NIC.";
    if (String(data.get("phone") ?? "").trim().length < 7) next.phone = "We send timetable changes to this number.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.get("email") ?? "").trim())) next.email = "Check that email address.";
    if (!grade) next.grade = "Which grade?";
    if (subjects.length === 0) next.subjects = "Pick at least one.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = ["student", "phone", "email", "grade", "subjects"].find((f) => next[f]);
      if (first) e.currentTarget.querySelector<HTMLElement>(`[name="${first}"], #c-${first}`)?.focus();
      return;
    }
    setSent(true);
    requestAnimationFrame(() => done.current?.scrollIntoView({ block: "center", behavior: "smooth" }));
  };

  if (sent) {
    return (
      <div ref={done} className="d-card flex flex-col items-start gap-5 p-7 sm:p-10" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl text-white">✓</span>
        <h2 className="d-h2 text-brand">Registered. We&apos;ll call to confirm the seat.</h2>
        <p className="max-w-md text-lg text-muted">
          A real registration would land in the office inbox with the grade and subjects already on it, and the student would be
          added to the class group — instead of someone writing a name in a book at the door.
        </p>
        <p className="rounded-lg bg-surface-2 p-4 text-sm text-muted">
          <strong className="text-ink">This is a demo</strong>, so nothing was sent and no seat was held.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setSent(false)} className="d-btn d-btn-ghost">
            ← Try the form again
          </button>
          <a href="/off-the-shelf/classes" className="d-btn d-btn-primary !text-white">
            I want this site
          </a>
        </div>
      </div>
    );
  }

  const Err = ({ field }: { field: string }) =>
    errors[field] ? (
      <span id={`err-${field}`} className="mt-1 block text-sm font-medium" style={{ color: "#c2334d" }}>
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
        <h2 className="d-h2 text-brand">Register for a class.</h2>
        <p className="text-muted">Takes a minute. We call back the same day to confirm the seat and the first class date.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Student&apos;s name</span>
          <input name="student" className="d-field" placeholder="Kavindu Perera" autoComplete="name" {...aria("student")} />
          <Err field="student" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">
            School <span className="font-normal text-muted">(optional)</span>
          </span>
          <input name="school" className="d-field" placeholder="Nalanda College" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Phone (parent or student)</span>
          <input name="phone" type="tel" className="d-field" placeholder="07X XXX XXXX" autoComplete="tel" {...aria("phone")} />
          <Err field="phone" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-semibold">Email</span>
          <input name="email" type="email" className="d-field" placeholder="you@example.com" autoComplete="email" {...aria("email")} />
          <Err field="email" />
        </label>
      </div>

      <fieldset className="flex flex-col gap-3" {...aria("grade")}>
        <legend className="font-semibold">Grade</legend>
        <input type="hidden" name="grade" value={grade} />
        <div className="flex flex-wrap gap-2">
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              id="c-grade"
              aria-pressed={grade === g}
              onClick={() => {
                setGrade(g);
                setErrors(({ grade: _drop, ...rest }) => rest);
              }}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                grade === g ? "border-brand bg-brand text-white" : "border-edge bg-surface hover:border-brand"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <Err field="grade" />
      </fieldset>

      <fieldset className="flex flex-col gap-3" {...aria("subjects")}>
        <legend className="font-semibold">
          Subjects <span className="font-normal text-muted">— pick as many as you need</span>
        </legend>
        <input type="hidden" name="subjects" value={subjects.join(", ")} />
        <div className="flex flex-wrap gap-2">
          {SUBJECT_CHOICES.map((s) => (
            <button
              key={s}
              type="button"
              id="c-subjects"
              aria-pressed={subjects.includes(s)}
              onClick={() => toggle(s)}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                subjects.includes(s) ? "border-brand bg-accent text-white" : "border-edge bg-surface hover:border-brand"
              }`}
            >
              {subjects.includes(s) ? "✓ " : ""}
              {s}
            </button>
          ))}
        </div>
        <Err field="subjects" />
        {subjects.length >= 3 && (
          <p className="rounded-lg bg-surface-2 p-3 text-sm text-muted">
            Three subjects qualifies for the all-three rate — Rs 12,000 a month instead of Rs 13,500.
          </p>
        )}
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">Branch</span>
        <select name="branch" className="d-field" defaultValue={BRANCHES[0].name}>
          {BRANCHES.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">
          Anything else? <span className="font-normal text-muted">(optional)</span>
        </span>
        <textarea
          name="detail"
          rows={3}
          className="d-field resize-y"
          placeholder="e.g. repeating Combined Maths, sat the exam last year"
        />
      </label>

      <div className="flex flex-col items-start gap-3 border-t border-edge pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{VIDURA.hours}.</p>
        <button type="submit" className="d-btn d-btn-primary !text-white">
          Register →
        </button>
      </div>
    </form>
  );
}
