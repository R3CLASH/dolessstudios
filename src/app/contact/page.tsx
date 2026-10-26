import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { BriefForm } from "@/components/contact/BriefForm";
import { Eyebrow, Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us the boring part of your week. We'll tell you how we'd automate it.",
};

const NEXT = [
  { n: "01", t: "We read it", b: "Properly, not with a template reply." },
  { n: "02", t: "Short call", b: "Twenty minutes to understand the boring part." },
  { n: "03", t: "Fixed quote", b: "Scope, price and timeline in plain language." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        heavy="Hand it"
        light="over."
        intro="Fill in the blanks below. The more specific the boring part, the better our first answer."
        aside={
          SITE.email ? (
            <div className="flex flex-col gap-4 font-mono text-sm">
              <p className="text-mist">Prefer email?</p>
              <a href={`mailto:${SITE.email}`} className="text-lg text-paper underline decoration-accent underline-offset-4 hover:text-accent">
                {SITE.email}
              </a>
            </div>
          ) : undefined
        }
      />

      <section className="pb-24 sm:pb-36" aria-label="Project brief">
        <div className="wrap grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <BriefForm />
          </div>
          <aside className="flex flex-col gap-8 lg:col-span-4 lg:pt-4">
            <Eyebrow index="→">What happens next</Eyebrow>
            <Reveal as="ol" className="flex flex-col gap-4">
              {NEXT.map((s) => (
                <li key={s.n} data-reveal className="flex gap-5 rounded-2xl border border-line bg-ink-2 p-5">
                  <span className="font-mono text-sm text-accent">{s.n}</span>
                  <div>
                    <p className="font-semibold">{s.t}</p>
                    <p className="text-paper/65">{s.b}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
