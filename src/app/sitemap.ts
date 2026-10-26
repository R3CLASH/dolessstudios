import type { MetadataRoute } from "next";
import { NAV, PROJECTS, SERVICES, SITE } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();
  return [
    ...NAV.map((n) => ({ url: `${base}${n.href}`, lastModified: now, priority: n.href === "/" ? 1 : 0.8 })),
    ...SERVICES.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: now, priority: 0.7 })),
    ...PROJECTS.map((p) => ({ url: `${base}/work/${p.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
