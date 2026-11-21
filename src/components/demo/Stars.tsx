/** Review stars. `n` filled out of five. */
export function Stars({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-full w-auto" aria-hidden="true" style={{ height: "1em" }}>
          <path
            d="M10 1.6l2.47 5.2 5.53.72-4.06 3.85 1.03 5.65L10 14.3l-4.97 2.72 1.03-5.65L2 7.52l5.53-.72L10 1.6Z"
            fill={i <= n ? "var(--d-accent)" : "var(--d-edge)"}
          />
        </svg>
      ))}
    </span>
  );
}
