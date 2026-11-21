/** Stand-in logo mark for the demo villa: a palm over a doorway arch. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Palm House logo">
      <rect width="40" height="40" rx="11" fill="var(--d-brand)" />
      <path d="M12 31h16v-9a8 8 0 0 0-16 0v9Z" fill="none" stroke="var(--d-accent)" strokeWidth="2" />
      <path d="M20 19V9" stroke="var(--d-accent)" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M20 10c-3-2.6-6.4-2.2-8 .4 2.8-.9 5.6-.2 8 1.6Zm0 0c3-2.6 6.4-2.2 8 .4-2.8-.9-5.6-.2-8 1.6Z"
        fill="var(--d-accent)"
      />
    </svg>
  );
}
