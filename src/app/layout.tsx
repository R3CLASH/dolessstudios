import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/lib/content";
import { SmoothScroll } from "@/components/shell/SmoothScroll";
import { PageTransition } from "@/components/shell/PageTransition";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Cursor } from "@/components/shell/Cursor";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { Preloader } from "@/components/shell/Preloader";

// Fonts are self-hosted (no build-time request to Google Fonts).
const bricolage = localFont({
  src: [
    { path: "./fonts/bricolage-latin.woff2", weight: "200 800", style: "normal" },
  ],
  variable: "--font-bricolage",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const mono = localFont({
  src: [
    { path: "./fonts/jetbrains-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/jetbrains-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: websites, apps and automation`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
};

export const viewport: Viewport = {
  themeColor: "#121316",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${mono.variable}`}>
      <body>
        <SmoothScroll>
          <PageTransition>
            <Preloader />
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
            <CommandPalette />
            <Cursor />
          </PageTransition>
        </SmoothScroll>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
