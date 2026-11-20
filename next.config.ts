import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Next 16.4.3's agent upgrade nudge stops `next build` with exit 1 on the
    // first invocation whenever a coding agent is detected. Disabling the
    // reminder keeps agent-driven builds deterministic.
    agentUpgrade: false,
  },
};

export default nextConfig;
