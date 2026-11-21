import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { WorkGrid } from "@/components/work/WorkGrid";
import { BigCta } from "@/components/sections/BigCta";
import { PROJECTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Products and sites built by Do Less Studios: Shopify apps, WordPress stores, web apps and websites.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        heavy="Proof we"
        light="do the work."
        intro="Products we've built and shipped. Each one started with someone doing something boring by hand."
        aside={
          <p className="font-mono text-sm text-mist">
            <span className="display heavy block text-7xl text-paper">{String(PROJECTS.length).padStart(2, "0")}</span>
            projects shown · more on request
          </p>
        }
      />
      <section className="pb-24 sm:pb-36" aria-label="Projects">
        <div className="wrap">
          <WorkGrid />
        </div>
      </section>
      <BigCta title="Your project next?" subtitle="Tell us what you're building, or what you're tired of doing. Either is a good start." />
    </>
  );
}
