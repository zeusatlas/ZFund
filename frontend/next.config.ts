import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    agentFeedback: true,
  },
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
};

export default nextConfig;
