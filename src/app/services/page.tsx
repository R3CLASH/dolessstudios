import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceArt } from "@/components/services/ServiceArt";
import { Reveal, Eyebrow } from "@/components/ui/motion";
import { BigCta } from "@/components/sections/BigCta";
import { AutoChecklist } from "@/components/sections/AutoChecklist";

export const metadata: Metadata = {
  title: "Services",
  description: "Web design and development, Shopify apps and themes, WordPress plugins and themes, web apps and automation.",
};

const ENGAGEMENTS = [
  {
    name: "Project",
    line: "A fixed scope, a fixed price, a launch date.",
    points: ["Best for new sites, stores and apps", "Scope agreed in writing up front", "Weekly progress you can click on"],
  },
  {
    name: "Monthly plan",
    line: "A set number of days every month, rolling.",
    points: ["Best for ongoing improvements", "Fixes, updates and new automations", "Cancel with a month's notice"],
  },
  {
    name: "Automation audit",
    line: "We map your week and list what can go.",
    points: ["Best if you're not sure where to start", "A ranked list of what to automate first", "Yours to keep, whoever builds it"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        heavy="Five ways"
        light="to do less."
        intro="Design, code and automation under one roof. Most projects mix two or three of these, so you only have to explain your business once."
        aside={
          <ul className="flex flex-col gap-2 font-mono text-sm text-mist">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <a href={`#${s.slug}`} data-no-transition className="hover:text-paper">
                  <span className="text-accent">{s.index}</span> {s.short}
                </a>
              </li>
            ))}
          </ul>
        }
      />

      <section className="pb-24 sm:pb-36" aria-label="All services">
        <div className="wrap grid grid-cols-1 gap-5 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} className={i % 2 === 1 ? "md:mt-24" : ""}>
              <article
                id={s.slug}
                className="group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[28px] border border-line bg-ink-2 transition-colors duration-500 hover:border-paper/30"
              >
                <div className="overflow-hidden p-4 pb-0 sm:p-6 sm:pb-0">
                  <ServiceArt slug={s.slug} className="h-auto w-full transition-transform duration-700 ease-[var(--ease-lazy)] group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-accent">{s.index}</span>
                    <span className="chip">{s.short}</span>
                  </div>
                  <h2 className="display heavy text-[clamp(2rem,3.6vw,3.4rem)]">{s.title}</h2>
                  <p className="text-lg text-paper/70">{s.line}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                    {s.stack.slice(0, 5).map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${s.slug}`}
                    data-cursor="Open"
                    className="inline-flex items-center gap-3 font-semibold after:absolute after:inset-0 after:content-['']"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                      ↗
                    </span>
                    More on {s.short.toLowerCase()}
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-ink-2 py-24 sm:py-36" aria-labelledby="engage-title">
        <div className="wrap flex flex-col gap-14">
          <div className="flex flex-col gap-6">
            <Eyebrow index="→">Working together</Eyebrow>
            <h2 id="engage-title" className="display text-[clamp(2.6rem,6vw,6rem)]">
              <span className="heavy">Three ways</span> <span className="light">to start.</span>
            </h2>
          </div>
          <Reveal className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {ENGAGEMENTS.map((e, i) => (
              <div key={e.name} data-reveal className="flex flex-col gap-6 rounded-[24px] border border-line bg-ink p-7 sm:p-8">
                <span className="font-mono text-xs text-mist">0{i + 1}</span>
                <h3 className="display heavy text-4xl">{e.name}</h3>
                <p className="text-lg text-paper/75">{e.line}</p>
                <ul className="mt-auto flex flex-col gap-3 border-t border-line pt-6">
                  {e.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-paper/80">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-24 sm:py-36" aria-labelledby="every-title">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Eyebrow index="✓">Every project</Eyebrow>
            <h2 id="every-title" className="display heavy text-[clamp(2.4rem,4.6vw,4.4rem)]">
              Things you won&apos;t have to chase.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <AutoChecklist
              via="included"
              items={["Code in your own repository", "Docs a human can read", "Analytics and uptime alerts", "A walkthrough video", "Thirty days of fixes after launch"]}
            />
          </div>
        </div>
      </section>

      <BigCta />
    </>
  );
}
