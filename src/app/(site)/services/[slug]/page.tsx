import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, PROJECTS, PROCESS, getService } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceArt } from "@/components/services/ServiceArt";
import { HoursCalculator } from "@/components/services/HoursCalculator";
import { AutoChecklist } from "@/components/sections/AutoChecklist";
import { Faq } from "@/components/sections/Faq";
import { BigCta } from "@/components/sections/BigCta";
import { Eyebrow, Reveal } from "@/components/ui/motion";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { ProjectCover } from "@/components/work/ProjectCover";
import { AppShowcase } from "@/components/sections/AppShowcase";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return { title: s.title, description: s.intro };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const i = SERVICES.findIndex((s) => s.slug === service.slug);
  const next = SERVICES[(i + 1) % SERVICES.length];
  const related = PROJECTS.filter((p) => p.tags.includes(service.slug));
  // Projects with real screenshots get the full showcase; the rest stay in the related grid.
  const showcased = related.filter((p) => p.image);
  const others = related.filter((p) => !p.image);

  return (
    <>
      <PageHero
        eyebrow={service.short}
        index={service.index}
        heavy={service.title}
        intro={service.intro}
        aside={
          <div className="float-slow overflow-hidden rounded-[28px] border border-line">
            <ServiceArt slug={service.slug} className="h-auto w-full" />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-accent">
            Start a {service.short.toLowerCase()} project
          </Link>
          <Link href="/work" className="btn btn-ghost">
            See related work
          </Link>
        </div>
      </PageHero>

      <TechMarquee items={service.stack} />

      <section className="py-24 sm:py-36" aria-labelledby="deliver-title">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Eyebrow index="01">What you get</Eyebrow>
            <h2 id="deliver-title" className="display heavy text-[clamp(2.4rem,4.6vw,4.4rem)]">
              The whole job, done properly.
            </h2>
          </div>
          <Reveal as="ul" className="grid grid-cols-1 gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:col-span-8">
            {service.deliverables.map((d, n) => (
              <li key={d} data-reveal className="group flex min-h-40 flex-col justify-between gap-6 bg-ink p-6 transition-colors duration-500 hover:bg-ink-2 sm:p-8">
                <span className="font-mono text-xs text-mist transition-colors group-hover:text-accent">0{n + 1}</span>
                <span className="text-xl font-semibold tracking-tight sm:text-2xl">{d}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line py-24 sm:py-36" aria-labelledby="plate-title">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Eyebrow index="02">Off your plate</Eyebrow>
            <h2 id="plate-title" className="display heavy text-[clamp(2.4rem,4.6vw,4.4rem)]">
              Things you&apos;ll stop doing.
            </h2>
            <p className="text-lg text-paper/70">Scroll and watch them go.</p>
          </div>
          <div className="lg:col-span-8">
            <AutoChecklist items={service.offYourPlate} />
          </div>
        </div>
      </section>

      {service.slug === "automation" && (
        <section className="pb-24 sm:pb-36" aria-label="Busywork calculator">
          <div className="wrap">
            <HoursCalculator />
          </div>
        </section>
      )}

      <section className="border-y border-line bg-ink-2 py-24 sm:py-32" aria-labelledby="how-title">
        <div className="wrap flex flex-col gap-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-6">
              <Eyebrow index="03">How it runs</Eyebrow>
              <h2 id="how-title" className="display text-[clamp(2.4rem,5vw,4.8rem)]">
                <span className="heavy">Four steps.</span> <span className="light">No surprises.</span>
              </h2>
            </div>
          </div>
          <Reveal as="ol" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p) => (
              <li key={p.n} data-reveal className="flex flex-col gap-4 rounded-[24px] border border-line bg-ink p-6">
                <span className="font-mono text-sm text-accent">{p.n}</span>
                <h3 className="display heavy text-3xl">{p.title}</h3>
                <p className="text-paper/70">{p.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {showcased.length > 0 && (
        <AppShowcase
          projects={showcased}
          index="04"
          eyebrow="Related work"
          title={
            <>
              <span className="heavy">Shipped,</span> <span className="light">not pitched.</span>
            </>
          }
          intro={`${service.short} work that's out in the world. Open one to see the boring part it removes.`}
        />
      )}

      {others.length > 0 && (
        <section className="py-24 sm:py-32" aria-labelledby="related-title">
          <div className="wrap flex flex-col gap-10">
            <Eyebrow index={showcased.length > 0 ? "→" : "04"}>{showcased.length > 0 ? "More related work" : "Related work"}</Eyebrow>
            <h2 id="related-title" className="sr-only">
              Related work
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {others.map((p) => (
                <Link key={p.slug} href={`/work/${p.slug}`} data-cursor="View" className="group flex flex-col gap-4">
                  <div className="overflow-hidden rounded-[24px] border border-line">
                    <ProjectCover slug={p.slug} className="aspect-[10/7] h-auto w-full transition-transform duration-700 ease-[var(--ease-lazy)] group-hover:scale-105" />
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="display heavy text-3xl">{p.title}</h3>
                    <span className="chip">{p.kind}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Faq items={service.faq} index="05" title={`${service.short}, briefly`} />

      <section className="border-t border-line" aria-label="Next service">
        <Link href={`/services/${next.slug}`} data-cursor="Next" className="group wrap flex flex-col gap-4 py-20 sm:py-28">
          <span className="eyebrow">Next service · {next.index}</span>
          <span className="display heavy flex items-center justify-between gap-6 text-[clamp(2.6rem,8vw,8rem)] transition-colors duration-500 group-hover:text-accent">
            {next.title}
            <span className="hidden text-[0.5em] transition-transform duration-500 group-hover:translate-x-3 sm:inline">→</span>
          </span>
        </Link>
      </section>

      <BigCta />
    </>
  );
}
