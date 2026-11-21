/** Stand-in logo mark for the demo dental practice. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Serendib Dental logo">
      <rect width="40" height="40" rx="12" fill="var(--d-brand)" />
      <path
        d="M20 11c-2.6-1.9-6-2.1-7.8-.2-1.9 2-1.6 5.6-.8 9 .7 3 1.6 6.6 3 7.9 1.5 1.4 2.6-.6 3-2.5.4-1.8.7-3.4 2.6-3.4s2.2 1.6 2.6 3.4c.4 1.9 1.5 3.9 3 2.5 1.4-1.3 2.3-4.9 3-7.9.8-3.4 1.1-7-.8-9-1.8-1.9-5.2-1.7-7.8.2Z"
        fill="var(--d-accent)"
      />
    </svg>
  );
}
