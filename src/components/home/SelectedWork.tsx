"use client";

import Link from "next/link";
import { useState } from "react";
import { PROJECTS, SERVICES } from "@/lib/content";
import { gsap, useGsap, prefersReducedMotion } from "@/lib/gsap";
import { Eyebrow, SplitReveal } from "@/components/ui/motion";
import { ProjectCover } from "@/components/work/ProjectCover";

const FEATURED = PROJECTS.filter((p) => p.featured);
const category = (tag: string) => SERVICES.find((s) => s.slug === tag)?.short ?? tag;

export function SelectedWork() {
  const [hovered, setHovered] = useState<number | null>(null);

  const ref = useGsap<HTMLElement>((_c, root) => {
    const preview = root.querySelector<HTMLElement>("[data-preview]");
    if (!preview) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!prefersReducedMotion()) {
      gsap.from(root.querySelectorAll("[data-row]"), {
        y: 60,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: root.querySelector("[data-rows]"), start: "top 80%", once: true },
      });
    }
    if (!fine) return;
    const xTo = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3" });
    const rTo = gsap.quickTo(preview, "rotation", { duration: 0.8, ease: "power3" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
      rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4));
      lastX = e.clientX;
    };
    root.addEventListener("pointermove", move);
    return () => root.removeEventListener("pointermove", move);
  });

  return (
    <section ref={ref} className="relative py-28 sm:py-40" aria-labelledby="work-title">
      <div className="wrap flex flex-col gap-14">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-6">
            <Eyebrow index="05">Selected work</Eyebrow>
            <SplitReveal as="h2" className="display text-[clamp(2.6rem,6vw,6rem)]">
              <span id="work-title" className="heavy">
                Proof we do
              </span>{" "}
              <span className="light">the work.</span>
            </SplitReveal>
          </div>
          <Link href="/work" className="btn btn-ghost">
            All {PROJECTS.length} projects →
          </Link>
        </div>

        <ul data-rows className="flex flex-col" onPointerLeave={() => setHovered(null)}>
          {FEATURED.map((p, i) => (
            <li key={p.slug} data-row className="border-t border-line last:border-b">
              <Link
                href={`/work/${p.slug}`}
                data-cursor="View"
                onPointerEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                className="group grid grid-cols-1 gap-5 py-7 sm:py-9 md:grid-cols-12 md:items-center md:gap-6"
              >
                <div className="overflow-hidden rounded-2xl md:hidden">
                  <ProjectCover slug={p.slug} className="aspect-[10/7] h-auto w-full" />
                </div>
                <span className="font-mono text-xs text-mist md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <h3
                  className={`display heavy text-[clamp(2.4rem,6vw,5.5rem)] transition-[color,transform] duration-500 ease-[var(--ease-lazy)] md:col-span-6 md:group-hover:translate-x-4 ${
                    hovered !== null && hovered !== i ? "md:text-paper/25" : "text-paper"
                  }`}
                >
                  {p.title}
                </h3>
                <p className="text-paper/70 md:col-span-3">{p.summary}</p>
                <div className="flex items-center justify-between gap-3 md:col-span-2 md:flex-col md:items-end">
                  <span className="chip">{category(p.tags[0])}</span>
                  <span className="text-2xl transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating preview that follows the cursor on desktop */}
      <div
        data-preview
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
        style={{ width: 0, height: 0 }}
      >
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl transition-[opacity,transform] duration-500 ease-[var(--ease-lazy)] ${
            hovered === null ? "scale-50 opacity-0" : "scale-100 opacity-100"
          }`}
          style={{ width: "min(30vw, 420px)", aspectRatio: "10 / 7" }}
        >
          {FEATURED.map((p, i) => (
            <div
              key={p.slug}
              className="absolute inset-0 transition-[clip-path] duration-700 ease-[var(--ease-lazy)]"
              style={{ clipPath: hovered === i ? "inset(0 0 0 0)" : "inset(100% 0 0 0)" }}
            >
              <ProjectCover slug={p.slug} className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
