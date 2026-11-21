import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Checkout redirects, the webhook and the post-payment page: nothing to index.
        // /demo/* are the live demo sites: sales material, and thin duplicate
        // content we don't want ranking against the pages that sell them.
        disallow: ["/checkout", "/api/", "/off-the-shelf/thanks", "/demo/"],
      },
    ],
    sitemap: `${SITE.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}
