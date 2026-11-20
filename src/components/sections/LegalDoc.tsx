import { PageHero } from "@/components/sections/PageHero";
import { Eyebrow, Reveal } from "@/components/ui/motion";
import type { LegalPage } from "@/lib/content";

/**
 * One legal document, rendered from its entry in LEGAL. All three pages share
 * this, so they cannot drift apart in layout — only in words.
 *
 * Numbered sections on purpose: it makes a clause easy to point at in an email.
 */
export function LegalDoc({ page }: { page: LegalPage }) {
  return (
    <>
      <PageHero
        eyebrow={page.title}
        heavy={page.heavy}
        light={page.light}
        intro={
          <>
            <p className="max-w-[52ch]">{page.intro}</p>
            <p className="mt-4 font-mono text-xs text-mist">Last updated {page.updated}</p>
          </>
        }
      />

      <section className="border-t border-line py-24 sm:py-36" aria-label={page.title}>
        <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Jump list. Hidden on small screens, where scrolling is simply faster. */}
          <nav aria-label="On this page" className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28">
              <Eyebrow>On this page</Eyebrow>
              <ol className="mt-5 flex flex-col gap-2 font-mono text-xs text-mist">
                {page.sections.map((s, i) => (
                  <li key={s.heading}>
                    <a href={`#s${i + 1}`} className="inline-flex gap-2 hover:text-paper">
                      <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <span>{s.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="flex flex-col gap-12 lg:col-span-8">
            {page.sections.map((s, i) => (
              // The id lives on the article, not on Reveal: Reveal forwards only
              // ref, className and style, so an id prop would be dropped.
              <article key={s.heading} id={`s${i + 1}`} className="scroll-mt-28">
                <Reveal>
                  <h2
                    data-reveal
                    className="display flex items-baseline gap-3 text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold tracking-[-0.02em]"
                  >
                    <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {s.heading}
                  </h2>
                  <div className="mt-4 flex flex-col gap-4 text-lg leading-relaxed text-paper/75">
                    {s.body.map((p, n) => (
                      <p key={n} data-reveal>
                        {p}
                      </p>
                    ))}
                  </div>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
