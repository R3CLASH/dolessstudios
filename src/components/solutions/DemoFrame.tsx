"use client";

import { useState } from "react";

type Size = "desktop" | "phone";

/**
 * The live demo, in a browser mock, with a phone/desktop toggle.
 *
 * The iframe is same-origin but the demo is a separate root layout, so it loads
 * none of this page's shell. It is kept lazy so four of these on a catalog page
 * would still be cheap, and the whole frame is scrollable inside itself.
 */
export function DemoFrame({ path, host, accent, title }: { path: string; host: string; accent: string; title: string }) {
  const [size, setSize] = useState<Size>("desktop");
  const [loaded, setLoaded] = useState(false);
  const phone = size === "phone";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Preview size">
          {(["desktop", "phone"] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              onClick={() => setSize(s)}
              className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm capitalize transition-colors duration-300 ${
                size === s ? "border-accent bg-accent text-ink" : "border-line text-paper/80 hover:border-paper/50 hover:text-paper"
              }`}
            >
              <span aria-hidden="true">{s === "phone" ? "▯" : "▭"}</span>
              {s}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs text-mist">
          {phone ? "390px wide" : "full width"} · scrolls inside the frame
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-line bg-ink-2">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: accent }} />
          <span className="h-3 w-3 rounded-full bg-line" />
          <span className="h-3 w-3 rounded-full bg-line" />
          <span className="ml-3 flex min-w-0 items-center gap-2 truncate rounded-full bg-ink px-4 py-1.5 font-mono text-xs text-mist">
            <span aria-hidden="true">🔒</span>
            {host}
          </span>
        </div>

        <div className={`relative bg-white ${phone ? "flex justify-center bg-ink-3 p-5 sm:p-8" : ""}`}>
          {!loaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink-2">
              <span className="font-mono text-sm text-mist">loading the demo…</span>
            </div>
          )}
          <iframe
            src={path}
            title={`${title} demo site`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`block border-0 bg-white ${phone ? "h-[680px] w-[390px] rounded-[28px] shadow-2xl" : "h-[72vh] min-h-[520px] w-full"}`}
          />
        </div>
      </div>
    </div>
  );
}
