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
  experimental: {
    // Next 16.4.3's agent upgrade nudge stops `next build` with exit 1 on the
    // first invocation whenever a coding agent is detected. Disabling the
    // reminder keeps agent-driven builds deterministic.
    agentUpgrade: false,
  },
};

export default nextConfig;
