import Link from "next/link";
import { Mark } from "@/components/brand/Mark";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="wrap relative flex flex-col items-start gap-8">
        <Mark size={120} pose="flat" className="text-paper" />
        <p className="eyebrow">404 · page not found</p>
        <h1 className="display text-[clamp(3rem,10vw,9rem)]">
          <span className="heavy">This page</span>
          <br />
          <span className="light">did even less.</span>
        </h1>
        <p className="max-w-md text-lg text-paper/70">It either moved, never existed, or decided not to bother. Respect.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn btn-accent">
            Take me home
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Report the slacker
          </Link>
        </div>
      </div>
    </section>
  );
}
