import type { SVGProps } from "react";

/** Path data for the mark in its three poses. All share the same command structure so GSAP can tween between them. */
export const MARK_POSES = {
  upright: "M84 20 L28 60 L84 100",
  sitting: "M76 22 L26 70 L98 96",
  reclined: "M78 32 L24 76 L102 92",
  flat: "M86 66 L20 88 L110 96",
} as const;

export const HEAD_POSES = {
  upright: { cx: 98, cy: 10 },
  sitting: { cx: 88, cy: 10 },
  reclined: { cx: 93, cy: 18 },
  flat: { cx: 102, cy: 56 },
} as const;

type MarkProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  pose?: keyof typeof MARK_POSES;
  stroke?: string;
  head?: string;
  strokeWidth?: number;
  title?: string;
};

export function Mark({
  size = 40,
  pose = "reclined",
  stroke = "currentColor",
  head = "var(--color-accent)",
  strokeWidth = 15,
  title,
  ...rest
}: MarkProps) {
  const h = HEAD_POSES[pose];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120" overflow="visible"
      fill="none"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      <path
        data-mark-body
        d={MARK_POSES[pose]}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle data-mark-head cx={h.cx} cy={h.cy} r={10.5} fill={head} />
    </svg>
  );
}

export function Wordmark({ className = "", studios = true }: { className?: string; studios?: boolean }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="display flex gap-[0.22em]">
        <span className="heavy">do</span>
        <span className="light">less</span>
      </span>
      {studios && (
        <span className="mt-[0.18em] pl-[0.05em] font-mono text-[0.17em] font-semibold tracking-[0.62em]">STUDIOS</span>
      )}
    </span>
  );
}
