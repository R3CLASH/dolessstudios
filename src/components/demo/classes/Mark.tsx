/** Stand-in logo mark for the demo institute: an open book, squared off. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Vidura Institute logo">
      <rect width="40" height="40" rx="11" fill="var(--d-brand)" />
      <path d="M20 13v16" stroke="var(--d-accent)" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M20 13c-2.6-1.8-5.6-2.4-9-1.8v15c3.4-.6 6.4 0 9 1.8Zm0 0c2.6-1.8 5.6-2.4 9-1.8v15c-3.4-.6-6.4 0-9 1.8Z"
        fill="none"
        stroke="var(--d-accent)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
