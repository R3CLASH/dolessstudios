import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../demo.css";

/**
 * Root layout for the off-the-shelf demos. A separate root layout (not nested
 * under the site's) is the whole point: a demo must not inherit the Do Less
 * Studios header, footer, dark theme, cursor or smooth scrolling — it is
 * pretending to be a real client's website.
 *
 * Navigating between a demo and the main site is a full page load. That's fine,
 * and expected for multiple root layouts.
 */
const bricolage = localFont({
  src: [{ path: "../fonts/bricolage-latin.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-bricolage",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  // Demos are sales material, not pages we want ranking against the real thing.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function DemoRootLayout({ children }: { children: React.ReactNode }) {
  return (
    // See the note in (site)/layout.tsx: extensions touch <html> pre-hydration.
    <html lang="en" className={bricolage.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
