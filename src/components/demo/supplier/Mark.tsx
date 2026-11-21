/** Stand-in logo mark for the demo exporter: a tea leaf on a shipping square. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Ceylon Leaf Exports logo">
      <rect width="40" height="40" rx="11" fill="var(--d-brand)" />
      <path
        d="M27 11c1.6 8.4-2.2 14.6-9.4 16.4-2.6.6-4.6.2-6-1 1.4-8.6 6.6-13.6 15.4-15.4Z"
        fill="var(--d-accent)"
      />
      <path d="M12 30c3.4-6.8 8-11.4 14-14" stroke="var(--d-brand)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
