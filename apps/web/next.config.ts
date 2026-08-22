import type { NextConfig } from "next";

/** API proxy is handled by App Router route at src/app/eos-api/[...path]/route.ts (reliable POST). */
const nextConfig: NextConfig = {
  transpilePackages: ["@sedmc/kernel"],
  turbopack: {
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
    };
    return config;
  },
};

export default nextConfig;
