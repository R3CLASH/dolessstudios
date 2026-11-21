import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SOLUTIONS, SOLUTION_WE_NEED, getSolution } from "@/lib/content";
import { CheckoutPanel } from "@/components/solutions/CheckoutPanel";
import { Eyebrow, Reveal } from "@/components/ui/motion";

/**
 * Buying one solution as-is, on our own page.
 *
 * Prerendered like the detail page next door: everything here is catalog
 * content, so there is nothing per-request to get wrong and nothing to cache
 * badly. The session is minted by the browser against /api/checkout/session,
 * which is force-dynamic and no-store — that is the part that has to be live,
 * and keeping it in a route handler is what lets this page stay static.
 *
 * Deliberately no PageHero: the hero's job is to sell, and this page is for
 * someone who has already decided. The form should be near the top of the fold.
 */

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  return {
    title: solution ? `Buy ${solution.title}` : "Checkout",
    description: "Pay for your build slot.",
    // A checkout has nothing to rank for, and a thin page per product would
    // compete with the detail pages that actually sell them.
    robots: { index: false, follow: false },
  };
}

export default async function BuyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  return (
    <>
      <section className="pb-20 pt-28 sm:pb-24 sm:pt-36">
        <div className="wrap flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <Link
              href={`/off-the-shelf/${solution.slug}`}
              className="inline-flex min-h-11 items-center gap-2 self-start font-mono text-sm text-mist transition-colors hover:text-paper"
            >
              <span aria-hidden="true">←</span> Back to {solution.title}
            </Link>
            <h1 className="display text-[clamp(2.4rem,5.4vw,4.2rem)]">
              <span className="heavy">Checkout.</span>{" "}
              <span className="light">One payment, then we build.</span>
            </h1>
          </div>

          <CheckoutPanel
            slug={solution.slug}
            title={solution.title}
            tagline={solution.tagline}
            priceCents={solution.priceCents}
            turnaround={solution.turnaround}
            pages={solution.pages}
          />
        </div>
      </section>

      <section className="border-t border-line py-20 sm:py-28">
        <div className="wrap">
          <Reveal className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <div>
              <Eyebrow index="01">What happens next</Eyebrow>
              <p className="mt-4 max-w-[42ch] text-lg text-paper/70">
                You pay, we reserve your build slot, and you get an order reference by email the same minute. Then we
                need three things from you — and the clock on {solution.turnaround.toLowerCase()} starts when they land.
              </p>
            </div>
            <div>
              <Eyebrow index="02">What we&apos;ll ask for</Eyebrow>
              <ul className="mt-4 space-y-3">
                {SOLUTION_WE_NEED.map((n) => (
                  <li key={n} className="flex gap-3 border-b border-line pb-3 text-lg">
                    <span className="text-accent" aria-hidden="true">
                      →
                    </span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
