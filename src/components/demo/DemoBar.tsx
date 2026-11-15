"use client";

import { useEffect, useState } from "react";

/**
 * "This is a demo" bar, with the way back to the page that sells it.
 *
 * Hidden when the page is inside an iframe, because the sales page already
 * frames it in a browser mock — two sets of chrome reads as a mistake. The
 * check only works after mount, so it starts hidden and appears once we know.
 */
export function DemoBar({ solutionSlug, price, name }: { solutionSlug: string; price: string; name: string }) {
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    try {
      setStandalone(window.self === window.top);
    } catch {
      // Cross-origin framing throws; treat it as embedded.
      setStandalone(false);
    }
  }, []);

  if (!standalone) return null;

  return (
    <div className="sticky top-0 z-50 bg-brand text-white">
      <div className="d-wrap flex flex-wrap items-center justify-between gap-3 py-2.5">
        <p className="text-sm">
          <strong className="font-semibold">Demo site.</strong>{" "}
          <span className="text-white/75">
            {name} isn&apos;t a real business — this is what you&apos;d get, with your name on it.
          </span>
        </p>
        <div className="flex items-center gap-2">
          <a href={`/off-the-shelf/${solutionSlug}`} className="d-btn d-btn-primary !min-h-9 !px-4 !text-sm">
            Get this one · {price}
          </a>
          <a
            href="/off-the-shelf"
            className="!min-h-9 rounded-full border border-white/25 px-4 py-2 text-sm text-white/85 transition-colors hover:border-white/60 hover:text-white"
          >
            All four
          </a>
        </div>
      </div>
    </div>
  );
}
