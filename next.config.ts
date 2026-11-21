import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /**
   * "The Launch" (the startups/SaaS prebuilt) was retired when the catalog was
   * refocused on verticals that are buildable and sellable in Sri Lanka. Both
   * its sales page and its demo were live and prerendered, so they are redirected
   * rather than left to 404 for anything already indexed or linked.
   */
  async redirects() {
    return [
      { source: "/off-the-shelf/startup", destination: "/off-the-shelf", permanent: true },
      { source: "/demo/startup", destination: "/off-the-shelf", permanent: true },
      { source: "/demo/startup/:path*", destination: "/off-the-shelf", permanent: true },
    ];
  },
  /**
   * /admin must never be cached, and the reason is infrastructure, not taste.
   *
   * infra/cdn.tf's default cache behavior uses a cache policy whose
   * cookies_config is `cookie_behavior = "none"`, so the session cookie is NOT
   * part of the CloudFront cache key — while cookies ARE forwarded to the
   * origin and GET is in cached_methods. A cacheable /admin response would
   * therefore be stored by the CDN and handed to the next visitor, cookie or
   * no cookie. This header is what prevents that, and it is declared here
   * rather than per page so a new admin route cannot forget it.
   *
   * Two more layers back it up: `force-dynamic` on every admin route, and a
   * dedicated `/admin*` behavior in infra/cdn.tf on the managed
   * CachingDisabled policy.
   */
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          /**
           * Nothing under /admin should ever be framed, including by us.
           *
           * frame-ancestors rather than X-Frame-Options on purpose: this repo
           * has no security headers today, and trap #11 warns that an
           * X-Frame-Options of DENY blanks the embedded demo on every sales
           * page. Introducing that header here invites someone to "finish the
           * job" by applying it globally. A path-scoped CSP is stricter than
           * SAMEORIGIN, cannot reach the demos, and leaves X-Frame-Options
           * absent everywhere — so trap #11 is never entered.
           */
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        // `/admin` itself, which `/admin/:path*` does not match.
        source: "/admin",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  experimental: {
    // Next 16.4.3's agent upgrade nudge stops `next build` with exit 1 on the
    // first invocation whenever a coding agent is detected. Disabling the
    // reminder keeps agent-driven builds deterministic.
    agentUpgrade: false,
  },
};

export default nextConfig;
