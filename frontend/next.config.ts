import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/how-it-works",
        destination: "/#how-it-works",
        permanent: true,
      },
      {
        source: "/for-hosts",
        destination: "/#for-hosts",
        permanent: true,
      },
      {
        source: "/for-organizations",
        destination: "/#for-organizations",
        permanent: true,
      },
      {
        source: "/security",
        destination: "/#security",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: path.join(__dirname, ".."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
