"use client";

/** Form bits shared by the contact brief and the off-the-shelf quote form. */

/** Underlined inline input, sized to sit inside running prose. */
export const field =
  "mx-1 inline-block min-w-[6ch] max-w-full border-b-2 border-line bg-transparent px-1 align-baseline text-accent placeholder:text-paper/25 transition-colors focus:border-accent focus:outline-none";

/** A pill checkbox or radio. Font size is relative, so it scales with the prose it sits in. */
export function Chip({ name, value, label, type }: { name: string; value: string; label: string; type: "checkbox" | "radio" }) {
  return (
    <label className="group relative mx-0.5 my-1 inline-flex cursor-pointer align-middle">
      <input type={type} name={name} value={value} className="peer sr-only" />
      <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 font-sans text-[0.5em] font-semibold tracking-normal text-paper/80 transition-all duration-300 group-hover:border-paper/50 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
        {label}
      </span>
    </label>
  );
}

/** Per-field error line, wired to the input through aria-describedby. */
export function Err({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <span id={`err-${id}`} className="mt-1 block font-mono text-xs tracking-normal text-accent">
      ↳ {msg}
    </span>
  );
}
