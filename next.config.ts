import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md is hand-written; stop `next dev` from inserting its own block.
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
