"use client";

import { useEffect, useState } from "react";
import { HOURS } from "@/lib/demo/restaurant";

/**
 * "Open now" / "Closed" badge.
 *
 * Computed on the client only. The server has no idea what time it is where the
 * visitor is, so rendering this during SSR would be a genuine hydration
 * mismatch — exactly the kind suppressHydrationWarning should not paper over.
 * It renders nothing until mounted.
 */
export function OpenStatus({ className = "" }: { className?: string }) {
  const [state, setState] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    const today = HOURS[now.getDay()];
    if (!today.open || !today.close) {
      setState({ open: false, label: `Closed ${today.day}s` });
      return;
    }
    const mins = now.getHours() * 60 + now.getMinutes();
    const toMins = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
    const open = mins >= toMins(today.open) && mins < toMins(today.close);
    setState({ open, label: open ? `Open until ${today.close}` : `Opens ${today.open}` });
  }, []);

  if (!state) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${className}`}
      style={{
        borderColor: state.open ? "#1f9d5a" : "var(--d-edge)",
        color: state.open ? "#15733f" : "var(--d-muted)",
        background: state.open ? "#eaf7ef" : "var(--d-surface-2)",
      }}
    >
      <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: state.open ? "#1f9d5a" : "var(--d-muted)" }} />
      {state.label}
    </span>
  );
}
