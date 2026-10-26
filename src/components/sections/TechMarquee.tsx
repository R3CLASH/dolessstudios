"use client";

import { Marquee } from "@/components/ui/motion";

export function TechMarquee({ items, duration = 30 }: { items: string[]; duration?: number }) {
  return (
    <div className="border-y border-line bg-ink-2 py-5">
      <Marquee
        items={items.length < 6 ? [...items, ...items, ...items] : items}
        duration={duration}
        renderItem={(t) => (
          <span className="mx-6 flex items-center gap-6 font-mono text-sm text-mist">
            {t} <span className="text-accent">✦</span>
          </span>
        )}
      />
    </div>
  );
}
