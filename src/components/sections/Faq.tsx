"use client";

import { useId, useState } from "react";
import { Eyebrow, Reveal } from "@/components/ui/motion";

export function Faq({
  items,
  index = "07",
  title = "Questions, answered lazily",
}: {
  items: { q: string; a: string }[];
  index?: string;
  title?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <section className="relative py-28 sm:py-36" aria-labelledby={`${id}-title`}>
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-4">
          <Eyebrow index={index}>FAQ</Eyebrow>
          <h2 id={`${id}-title`} className="display heavy text-[clamp(2.4rem,4.6vw,4.4rem)]">
            {title}
          </h2>
        </div>
        <Reveal as="ul" className="flex flex-col lg:col-span-8">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} data-reveal className="border-t border-line last:border-b">
                <h3>
                  <button
                    type="button"
                    id={`${id}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex min-h-16 w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-xl font-semibold tracking-tight sm:text-2xl">{item.q}</span>
                    <span
                      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                        isOpen ? "rotate-45 border-accent bg-accent text-ink" : "border-line group-hover:border-paper/50"
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-a${i}`}
                  role="region"
                  aria-labelledby={`${id}-q${i}`}
                  className="grid transition-[grid-template-rows] duration-500 ease-[var(--ease-lazy)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 text-lg leading-relaxed text-paper/70">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
