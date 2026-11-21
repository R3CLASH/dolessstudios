import type { Metadata } from "next";
import Link from "next/link";
import { ADDON_GROUPS, ADD_ONS, SITE, SOLUTIONS, SOLUTION_INCLUDED, SOLUTION_STEPS } from "@/lib/content";
import { formatMoney } from "@/lib/money";
import { PageHero } from "@/components/sections/PageHero";
import { SolutionGrid } from "@/components/solutions/SolutionGrid";
import { AutoChecklist } from "@/components/sections/AutoChecklist";
import { BigCta } from "@/components/sections/BigCta";
import { Eyebrow, Reveal } from "@/components/ui/motion";
import { StrikeList } from "@/components/about/StrikeList";

const cheapest = Math.min(...SOLUTIONS.map((s) => s.priceCents));

/** Where a prebuilt site is the wrong answer. Short on purpose: StrikeList renders these huge. */
const OFF_THE_SHELF_LIMITS = [
  "Marketplaces and logins",
  "Dashboards and portals",
  "Stores with live stock",
  "Inventing a brand from zero",
  "Anything where it depends",
];

export const metadata: Metadata = {
  title: "Off the shelf",
  description: `Prebuilt websites for trades, food and salons, clinics and startups. Fixed price from ${formatMoney(
    cheapest,
  )}, built on your domain with your brand, live in a week.`,
  alternates: { canonical: "/off-the-shelf" },
};

/** Four Offers, so the catalog itself is readable as a price list. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Off-the-shelf websites",
  url: `${SITE.url}/off-the-shelf`,
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  itemListElement: SOLUTIONS.map((s, i) => ({
    "@type": "Offer",
    position: i + 1,
    name: `${s.vertical} website (${s.title})`,
    description: s.tagline,
    price: (s.priceCents / 100).toFixed(2),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${SITE.url}/off-the-shelf/${s.slug}`,
  })),
};

export default function OffTheShelfPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="Off the shelf"
        heavy="Off the shelf."
        light="On your domain."
        intro="Four sites we've already built, for the four jobs people ask us for most. You're not buying a zip file to figure out yourself — we put your brand and your words on it, launch it on your domain, and hand you the keys."
        aside={
          <div className="flex flex-col gap-5 font-mono text-sm text-mist">
            <div>
              <span className="display heavy block text-7xl leading-none text-paper">{SOLUTIONS.length}</span>
              <span>ready to go</span>
            </div>
            <div className="flex flex-col gap-1 border-t border-line pt-5">
              <span className="text-paper">from {formatMoney(cheapest)}</span>
              <span>fixed price, no hourly meter</span>
            </div>
            <div className="flex flex-col gap-1 border-t border-line pt-5">
              <span className="text-paper">live in a week</span>
              <span>three days for the simple one</span>
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <a href="#catalog" data-no-transition className="btn btn-accent">
            See the four
          </a>
          <Link href="/services" className="btn btn-ghost">
            Or something bespoke
          </Link>
        </div>
      </PageHero>

      <section id="catalog" className="scroll-mt-28 pb-24 sm:pb-36" aria-label="The four off-the-shelf sites">
        <div className="wrap">
          <SolutionGrid />
        </div>
      </section>

      <section className="border-y border-line bg-ink-2 py-24 sm:py-36" aria-labelledby="how-title">
        <div className="wrap flex flex-col gap-14">
          <div className="flex flex-col gap-6">
            <Eyebrow index="→">How it works</Eyebrow>
            <h2 id="how-title" className="display text-[clamp(2.6rem,6vw,6rem)]">
              <span className="heavy">Pay, send us the bits,</span> <span className="light">get the keys.</span>
            </h2>
          </div>
          <Reveal as="ol" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SOLUTION_STEPS.map((p) => (
              <li key={p.n} data-reveal className="flex flex-col gap-4 rounded-[24px] border border-line bg-ink p-6">
                <span className="font-mono text-sm text-accent">{p.n}</span>
                <h3 className="display heavy text-3xl">{p.title}</h3>
                <p className="text-paper/70">{p.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-24 sm:py-36" aria-labelledby="included-title">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Eyebrow index="✓">Every build</Eyebrow>
            <h2 id="included-title" className="display heavy text-[clamp(2.4rem,4.6vw,4.4rem)]">
              In the price, whichever one you pick.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <AutoChecklist via="included" items={SOLUTION_INCLUDED} />
          </div>
        </div>
      </section>

      <section className="border-t border-line py-24 sm:py-36" aria-labelledby="addons-title">
        <div className="wrap flex flex-col gap-14">
          <div className="flex flex-col gap-6 lg:max-w-3xl">
            <Eyebrow index="→">Make it yours</Eyebrow>
            <h2 id="addons-title" className="display text-[clamp(2.4rem,5.4vw,5rem)]">
              <span className="heavy">Add what you need.</span> <span className="light">Skip what you don&apos;t.</span>
            </h2>
            <p className="text-lg text-paper/70">
              Every site is the same price for everyone. What makes yours different is this list — and you only pay for the lines you
              tick. Prices are on each site&apos;s page, next to a running total.
            </p>
          </div>
          <Reveal className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ADDON_GROUPS.map((g, i) => {
              const items = ADD_ONS.filter((a) => a.group === g.id);
              const from = Math.min(...items.map((a) => a.priceCents));
              return (
                <div key={g.id} data-reveal className="flex flex-col gap-5 rounded-[24px] border border-line bg-ink-2 p-7">
                  <span className="font-mono text-xs text-mist">0{i + 1}</span>
                  <h3 className="display heavy text-3xl">{g.label}</h3>
                  <p className="text-paper/70">{g.line}</p>
                  <div className="mt-auto flex items-baseline justify-between gap-3 border-t border-line pt-5">
                    <span className="font-mono text-sm text-accent">from {formatMoney(from)}</span>
                    <span className="chip">
                      {items.length} option{items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line py-24 sm:py-32" aria-labelledby="limits-title">
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Eyebrow index="!">Being honest</Eyebrow>
            <h2 id="limits-title" className="display heavy text-[clamp(2.4rem,4.6vw,4.4rem)]">
              When one of these is the wrong answer.
            </h2>
            <p className="text-lg text-paper/70">
              We don&apos;t sell a template as custom work. That&apos;s why this page has prices on it — and why we&apos;ll tell you
              when a prebuilt site isn&apos;t what you need.
            </p>
            <Link href="/contact" className="btn btn-ghost w-fit">
              Tell us what you actually need
            </Link>
          </div>
          <div className="lg:col-span-8">
            <StrikeList items={OFF_THE_SHELF_LIMITS} />
          </div>
        </div>
      </section>

      <BigCta
        title="Not sure which one?"
        subtitle="Tell us what you do and we'll point at one of the four. If none of them fit, we'll say that instead of selling you the closest."
      />
    </>
  );
}
