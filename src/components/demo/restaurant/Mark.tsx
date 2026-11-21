/** Stand-in logo mark for the demo restaurant. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Kolamba Kitchen logo">
      <circle cx="20" cy="20" r="19" fill="var(--d-brand)" />
      <path d="M13 11v8a3 3 0 0 0 6 0v-8" stroke="var(--d-accent)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M16 19v10" stroke="var(--d-accent)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M26 11c-2 1.8-2.8 4-2.8 6.2 0 1.8.9 2.8 2.8 2.8V29" stroke="var(--d-accent)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
