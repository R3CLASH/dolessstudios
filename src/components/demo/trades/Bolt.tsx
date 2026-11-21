/** Stand-in logo mark for the demo electrician. */
export function Bolt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Volt Electric logo">
      <rect width="40" height="40" rx="11" fill="var(--d-brand)" />
      <path d="M22.5 8 L13 22.5h6.2L17.5 32 27 17.5h-6.2L22.5 8Z" fill="var(--d-accent)" />
    </svg>
  );
}
