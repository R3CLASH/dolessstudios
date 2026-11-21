import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../globals.css";

/**
 * The third root layout, alongside (site) and (demos). /admin deliberately does
 * NOT live under (site):
 *
 * - PageTransition there intercepts every same-origin <a> click and router
 *   .push()es it (trap #1). A dashboard is links and form posts, so being
 *   inside that wrapper would mean scattering data-no-transition everywhere and
 *   finding the ones that were missed later.
 * - Lenis smooth scroll, the GSAP reveals, the ⌘K palette, the custom cursor and
 *   the marketing header and footer are all the wrong furniture for a dense
 *   table, and the reveal animations actively fight a long list.
 *
 * The cost is that moving between the public site and /admin is a full page
 * load. That is inherent to separate root layouts and entirely fine — nobody
 * browses from the homepage into the order queue.
 *
 * Fonts and globals.css are kept so this looks like the studio; everything else
 * from (site)/layout.tsx is gone.
 */

const bricolage = localFont({
  src: [{ path: "../fonts/bricolage-latin.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-bricolage",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const mono = localFont({
  src: [
    { path: "../fonts/jetbrains-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/jetbrains-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/jetbrains-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  // Belt to next.config.ts's X-Robots-Tag braces. /admin is in no sitemap and
  // nothing links to it, so this is the last of three layers rather than the only one.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#121316",
  width: "device-width",
  initialScale: 1,
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning for the same reason as the other two root
    // layouts: extensions inject attributes onto <html> before hydration (trap #12).
    <html lang="en" className={`${bricolage.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="bg-ink text-paper">{children}</body>
    </html>
  );
}
