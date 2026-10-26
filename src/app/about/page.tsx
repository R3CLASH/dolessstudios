import type { Metadata } from "next";
import { PRINCIPLES, WONT_DO, SITE } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { BigCta } from "@/components/sections/BigCta";
import { Eyebrow, Reveal, SplitReveal } from "@/components/ui/motion";
import { StrikeList } from "@/components/about/StrikeList";
import { LazyMark } from "@/components/about/LazyMark";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE.name} is a small development and automation studio in ${SITE.location}. Lazy on purpose.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        heavy="Lazy,"
        light="by design."
        intro={`A small development and automation studio in ${SITE.location}. We think the best work is the work nobody has to do twice.`}
        aside={<LazyMark />}
      />

      <section className="border-t border-line py-24 sm:py-36" aria-labelledby="story-title">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow index="01">Why the name</Eyebrow>
            <h2 id="story-title" className="sr-only">
              Why the name
            </h2>
          </div>
          <div className="flex flex-col gap-10 lg:col-span-8">
            <SplitReveal as="p" className="display text-[clamp(1.9rem,4vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              We build our own products too. When you run your own SaaS, app or store, you learn fast that every manual task becomes your job, forever.
            </SplitReveal>
            <Reveal className="grid grid-cols-1 gap-8 text-lg leading-relaxed text-paper/75 md:grid-cols-2">
              <p data-reveal>
                So we automate anything that repeats. HubSpot workflows that used to be rebuilt by hand in every region. Theme edits that used to
                be redone twice. Reports that used to be built every Monday.
              </p>
              <p data-reveal>
                Do Less Studios takes that habit to client work. You tell us what eats your week. We design and build the site, store, app or
                automation that takes it off your hands, and we keep it simple enough that it stays that way.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-ink-2 py-24 sm:py-36" aria-labelledby="laws-title">
        <div className="wrap flex flex-col gap-14">
          <div className="flex flex-col gap-6">
            <Eyebrow index="02">Principles</Eyebrow>
            <h2 id="laws-title" className="display text-[clamp(2.6rem,6vw,6rem)]">
              <span className="heavy">The laws</span> <span className="light">of lazy.</span>
            </h2>
          </div>
          <Reveal className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => (
              <article
                key={p.n}
                data-reveal
                className="group relative flex min-h-80 flex-col justify-between overflow-hidden rounded-[24px] border border-line bg-ink p-7 transition-all duration-500 ease-[var(--ease-lazy)] hover:-translate-y-2 hover:rotate-[-1deg] hover:border-accent"
              >
                <span className="display heavy text-7xl text-paper/10 transition-colors duration-500 group-hover:text-accent">{p.n}</span>
                <div className="flex flex-col gap-3">
                  <h3 className="display heavy text-3xl">{p.title}</h3>
                  <p className="text-paper/70">{p.body}</p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-24 sm:py-36" aria-labelledby="wont-title">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Eyebrow index="03">Hard nos</Eyebrow>
            <h2 id="wont-title" className="display heavy text-[clamp(2.4rem,4.6vw,4.4rem)]">
              Things we won&apos;t do.
            </h2>
            <p className="text-lg text-paper/70">Even though some studios do. Especially because some studios do.</p>
          </div>
          <div className="lg:col-span-8">
            <StrikeList items={WONT_DO} />
          </div>
        </div>
      </section>

      <section className="border-t border-line py-24 sm:py-32" aria-labelledby="where-title">
        <div className="wrap grid grid-cols-1 items-end gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Eyebrow index="04">Where</Eyebrow>
            <h2 id="where-title" className="display text-[clamp(2.6rem,6vw,6rem)]">
              <span className="heavy">{SITE.location}.</span>
              <br />
              <span className="light">Working anywhere.</span>
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-paper/75">
            We work remotely with clients wherever they are. Calls happen at hours that suit you, and everything else happens in writing, so
            there&apos;s always a record of what was agreed.
          </p>
        </div>
      </section>

      <BigCta />
    </>
  );
}
