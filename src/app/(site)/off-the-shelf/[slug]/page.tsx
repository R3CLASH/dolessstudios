import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE, SOLUTIONS, SOLUTION_FAQ, SOLUTION_WE_NEED, addOnsFor, getSolution } from "@/lib/content";
import { BASE_CURRENCY, formatMoney, formatUsdApprox } from "@/lib/money";
import { assertLiveCatalogSellable, checkoutHrefFor } from "@/lib/solutions";
import { PageHero } from "@/components/sections/PageHero";
import { SolutionArt } from "@/components/solutions/SolutionArt";
import { SolutionDemo } from "@/components/solutions/SolutionDemo";
import { SolutionConfigurator } from "@/components/solutions/SolutionConfigurator";
import { AutoChecklist } from "@/components/sections/AutoChecklist";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { Faq } from "@/components/sections/Faq";
import { BigCta } from "@/components/sections/BigCta";
import { Eyebrow, Reveal } from "@/components/ui/motion";

export function generateStaticParams() {
  // Build-time only, which is the whole reason it lives here: a live_mode build
  // whose catalog is only half sellable is stopped rather than deployed.
  assertLiveCatalogSellable(SOLUTIONS);
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  const title = `${s.vertical} website: ${s.title}`;
  const description = `${s.tagline} ${formatMoney(s.priceCents)} as-is, built on your domain with your brand. ${s.turnaround}.`;
  return {
    title,
    description,
    alternates: { canonical: `/off-the-shelf/${s.slug}` },
    openGraph: { title, description: s.tagline, type: "website", url: `/off-the-shelf/${s.slug}` },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const i = SOLUTIONS.findIndex((s) => s.slug === solution.slug);
  const next = SOLUTIONS[(i + 1) % SOLUTIONS.length];
  const addOns = addOnsFor(solution.slug);
  // null until Dodo is configured; the configurator routes to the quote form instead.
  const checkoutHref = checkoutHrefFor(solution);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${solution.vertical} website (${solution.title})`,
    serviceType: "Website design and build",
    description: solution.tagline,
    provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url, areaServed: "Worldwide" },
    url: `${SITE.url}/off-the-shelf/${solution.slug}`,
    offers: {
      "@type": "Offer",
      // Same source as the number rendered on the page, so the two can't disagree.
      price: (solution.priceCents / 100).toFixed(2),
      priceCurrency: BASE_CURRENCY,
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/off-the-shelf/${solution.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow={solution.vertical}
        index={solution.index}
        heavy={solution.title}
        intro={solution.intro}
        aside={
          <div className="float-slow overflow-hidden rounded-[28px] border border-line">
            <SolutionArt slug={solution.slug} className="h-auto w-full" />
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="display heavy text-[clamp(2rem,4.4vw,3.1rem)] leading-none tabular-nums">
              {formatMoney(solution.priceCents)}
            </span>
            <span className="text-lg text-paper/70">as-is, done for you</span>
            <span className="font-mono text-sm text-mist">{formatUsdApprox(solution.priceCents)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#build" data-no-transition className="btn btn-accent">
              Build this one
            </a>
            <Link href={`/services/${solution.services[0]}`} className="btn btn-ghost">
              Want it bespoke?
            </Link>
            <span className="chip">{solution.turnaround}</span>
          </div>
          <p className="max-w-xl text-sm text-mist">
            Priced and charged in Sri Lankan rupees. An overseas card is converted at checkout at Dodo&apos;s rate,
            shown before you confirm, and any tax due where you live is added there too.
          </p>
        </div>
      </PageHero>

      <TechMarquee items={solution.stack} />

      <section className="py-24 sm:py-36" aria-labelledby="box-title">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Eyebrow index="01">What you get</Eyebrow>
            <h2 id="box-title" className="display heavy text-[clamp(2.4rem,4.6vw,4.4rem)]">
              Everything in the box.
            </h2>
            <div className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-5">
              <span className="eyebrow">The pages</span>
              <ol className="flex flex-col gap-2">
                {solution.pages.map((p, n) => (
                  <li key={p} className="flex items-baseline gap-3 text-paper/80">
                    <span className="font-mono text-xs text-accent">{String(n + 1).padStart(2, "0")}</span>
                    {p}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <Reveal
            as="ul"
            className="grid grid-cols-1 gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:col-span-8"
          >
            {solution.features.map((f, n) => (
              <li
                key={f}
                data-reveal
                className="group flex min-h-40 flex-col justify-between gap-6 bg-ink p-6 transition-colors duration-500 hover:bg-ink-2 sm:p-8"
              >
                <span className="font-mono text-xs text-mist transition-colors group-hover:text-accent">0{n + 1}</span>
                <span className="text-xl font-semibold tracking-tight sm:text-2xl">{f}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line py-24 sm:py-32" aria-labelledby="who-title">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Eyebrow index="02">Who it&apos;s for</Eyebrow>
            <h2 id="who-title" className="display heavy text-[clamp(2.2rem,4.4vw,4rem)]">
              Built for these, specifically.
            </h2>
            <ul className="flex flex-wrap gap-2">
              {solution.forWho.map((w) => (
                <li key={w} className="chip">
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5 lg:col-span-7">
            <div className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-5 sm:p-7">
              <span className="eyebrow">What we need from you</span>
              <ul className="flex flex-col gap-3">
                {SOLUTION_WE_NEED.map((n) => (
                  <li key={n} className="flex items-start gap-3 text-lg text-paper/80">
                    <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {n}
                  </li>
                ))}
              </ul>
              <p className="border-t border-line pt-4 text-sm text-mist">
                Send them over after you order. {solution.turnaround.replace("Live in", "We're done in")} from the day they land.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SolutionDemo solution={solution} index="03" />

      <section className="border-t border-line py-24 sm:py-32" aria-labelledby="plate-title">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Eyebrow index="04">Off your plate</Eyebrow>
            <h2 id="plate-title" className="display heavy text-[clamp(2.4rem,4.6vw,4.4rem)]">
              Things you&apos;ll stop doing.
            </h2>
            <p className="text-lg text-paper/70">Scroll and watch them go.</p>
          </div>
          <div className="lg:col-span-8">
            <AutoChecklist items={solution.offYourPlate} />
          </div>
        </div>
      </section>

      <section id="build" className="scroll-mt-28 border-t border-line py-24 sm:py-36" aria-labelledby="build-title">
        <div className="wrap flex flex-col gap-12">
          <div className="flex flex-col gap-6 lg:max-w-3xl">
            <Eyebrow index="05">Build it</Eyebrow>
            <h2 id="build-title" className="display text-[clamp(2.4rem,5.4vw,5rem)]">
              <span className="heavy">Tick what you need.</span> <span className="light">See the price move.</span>
            </h2>
          </div>
          <SolutionConfigurator
            slug={solution.slug}
            title={solution.title}
            priceCents={solution.priceCents}
            turnaround={solution.turnaround}
            addOns={addOns}
            checkoutHref={checkoutHref}
          />
        </div>
      </section>

      <Faq items={[...solution.faq, ...SOLUTION_FAQ]} index="06" title={`${solution.title}, briefly`} />

      <section className="border-t border-line" aria-label="Next off-the-shelf site">
        <Link href={`/off-the-shelf/${next.slug}`} data-cursor="Next" className="group wrap flex flex-col gap-4 py-20 sm:py-28">
          <span className="eyebrow">Next off the shelf · {next.index}</span>
          <span className="display heavy flex items-center justify-between gap-6 text-[clamp(2.6rem,8vw,8rem)] transition-colors duration-500 group-hover:text-accent">
            {next.title}
            <span className="hidden text-[0.5em] transition-transform duration-500 group-hover:translate-x-3 sm:inline">→</span>
          </span>
        </Link>
      </section>

      <BigCta
        title="Want this one changed?"
        subtitle="Tick the add-ons above for a fixed quote, or tell us what you had in mind and we'll say whether it belongs here or in a bespoke build."
      />
    </>
  );
}
