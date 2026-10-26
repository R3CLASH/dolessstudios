import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, SERVICES, getProject } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { CoverParallax } from "@/components/work/CoverParallax";
import { ProjectCover } from "@/components/work/ProjectCover";
import { AutoChecklist } from "@/components/sections/AutoChecklist";
import { BigCta } from "@/components/sections/BigCta";
import { Eyebrow, Reveal } from "@/components/ui/motion";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: p.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const i = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const services = SERVICES.filter((s) => project.tags.includes(s.slug));

  return (
    <>
      <PageHero
        eyebrow={project.kind}
        index={String(i + 1).padStart(2, "0")}
        heavy={project.title}
        intro={project.summary}
        aside={
          <dl className="grid grid-cols-2 gap-6 border-t border-line pt-6 font-mono text-sm lg:grid-cols-1">
            <div>
              <dt className="text-mist">Status</dt>
              <dd className="mt-1 text-paper">{project.status}</dd>
            </div>
            <div>
              <dt className="text-mist">Year</dt>
              <dd className="mt-1 text-paper">{project.year}</dd>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <dt className="text-mist">Services</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {services.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="chip hover:border-paper/40 hover:text-paper">
                    {s.short}
                  </Link>
                ))}
              </dd>
            </div>
          </dl>
        }
      />

      <section className="pb-20 sm:pb-28" aria-label="Project cover">
        <div className="wrap">
          <CoverParallax slug={project.slug} />
        </div>
      </section>

      <section className="py-20 sm:py-28" aria-labelledby="boring-title">
        <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow index="01">The boring part</Eyebrow>
            <h2 id="boring-title" className="sr-only">
              The problem
            </h2>
          </div>
          <Reveal className="lg:col-span-8">
            <p data-reveal className="display text-[clamp(1.8rem,3.8vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
              {project.boringPart}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line py-20 sm:py-28" aria-labelledby="built-title">
        <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Eyebrow index="02">What we built</Eyebrow>
            <h2 id="built-title" className="display heavy text-[clamp(2.4rem,4.6vw,4.4rem)]">
              The fix.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <AutoChecklist items={project.built} via="shipped" />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-ink-2 py-16 sm:py-20" aria-labelledby="stack-title">
        <div className="wrap flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="stack-title" className="eyebrow">
            Built with
          </h2>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <li key={t} className="chip text-sm text-paper/85">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Next project">
        <Link href={`/work/${next.slug}`} data-cursor="Next" className="group wrap grid grid-cols-1 items-center gap-8 py-20 sm:py-28 md:grid-cols-12">
          <div className="flex flex-col gap-4 md:col-span-7">
            <span className="eyebrow">Next project</span>
            <span className="display heavy text-[clamp(3rem,9vw,8.5rem)] transition-colors duration-500 group-hover:text-accent">{next.title}</span>
            <span className="text-lg text-paper/70">{next.summary}</span>
          </div>
          <div className="overflow-hidden rounded-[24px] border border-line md:col-span-5">
            <ProjectCover slug={next.slug} className="aspect-[10/7] h-auto w-full transition-transform duration-700 ease-[var(--ease-lazy)] group-hover:scale-105" />
          </div>
        </Link>
      </section>

      <BigCta />
    </>
  );
}
