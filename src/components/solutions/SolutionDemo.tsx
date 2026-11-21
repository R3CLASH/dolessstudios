import type { Solution } from "@/lib/content";
import { Eyebrow } from "@/components/ui/motion";
import { SolutionArt } from "./SolutionArt";
import { DemoFrame } from "./DemoFrame";

/**
 * A browser frame around either the real, clickable demo or the stand-in art.
 * Adding a demo later is a one-line change in content.ts: set `demo` and the
 * live preview appears here on its own.
 */
export function SolutionDemo({ solution, index = "05" }: { solution: Solution; index?: string }) {
  return (
    <section className="border-t border-line py-24 sm:py-36" aria-labelledby="demo-title">
      <div className="wrap flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-6">
            <Eyebrow index={index}>Have a look</Eyebrow>
            <h2 id="demo-title" className="display text-[clamp(2.4rem,5vw,4.8rem)]">
              <span className="heavy">The whole thing,</span> <span className="light">before you buy it.</span>
            </h2>
            {solution.demo && (
              <p className="max-w-2xl text-lg text-paper/70">
                This is the real site, running right here. Click it, fill in the form, resize it — it all works.{" "}
                <span className="text-mist">{solution.demo.host} is a made-up business; your name goes where theirs is.</span>
              </p>
            )}
          </div>
          {solution.demo && (
            <a
              href={solution.demo.path}
              target="_blank"
              rel="noopener noreferrer"
              /* The demo has its own root layout, so this leaves the site shell
                 entirely; data-no-transition keeps PageTransition out of it. */
              data-no-transition
              className="btn btn-accent"
            >
              Open full screen ↗
            </a>
          )}
        </div>

        {solution.demo ? (
          <DemoFrame path={solution.demo.path} host={solution.demo.host} accent={solution.accent} title={solution.title} />
        ) : (
          <div className="overflow-hidden rounded-[28px] border border-line bg-ink-2">
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: solution.accent }} />
              <span className="h-3 w-3 rounded-full bg-line" />
              <span className="h-3 w-3 rounded-full bg-line" />
              <span className="ml-3 truncate rounded-full bg-ink px-4 py-1.5 font-mono text-xs text-mist">yourbusiness.lk</span>
            </div>
            <div className="relative">
              <SolutionArt slug={solution.slug} className="h-auto w-full" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-4 bg-gradient-to-t from-ink-2 via-ink-2/90 to-transparent p-8 pt-20 text-center">
                <p className="text-lg text-paper/80">
                  We haven&apos;t published this demo yet. Ask and we&apos;ll walk you through the real thing.
                </p>
                <a href="#build" data-no-transition className="btn btn-ghost">
                  Ask for a walkthrough
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
