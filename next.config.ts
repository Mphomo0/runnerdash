import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // No next/image usage in this app — disable the /_next/image endpoint
    // so external requests can't generate billable transformations.
    unoptimized: true,
  },
  output: "standalone",
  transpilePackages: ["motion"],
  turbopack: {},
};

export default nextConfig;
