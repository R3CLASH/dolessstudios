/** Stand-in logo mark for the demo SaaS product. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Sheetfast logo">
      <rect width="40" height="40" rx="11" fill="var(--d-accent)" />
      <rect x="9" y="22" width="5" height="9" rx="1.5" fill="#fff" opacity=".65" />
      <rect x="17" y="16" width="5" height="15" rx="1.5" fill="#fff" opacity=".85" />
      <rect x="25" y="9" width="5" height="22" rx="1.5" fill="#fff" />
    </svg>
  );
}
