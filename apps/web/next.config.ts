import type { NextConfig } from "next";

/** API proxy is handled by App Router route at src/app/eos-api/[...path]/route.ts (reliable POST). */
const nextConfig: NextConfig = {
  // Tracked `apps/web/.next` is memory-mapped on Windows (Turbopack/webpack
  // UNKNOWN/-4094 on routes.d.ts). Keep that tree untouched; write the live
  // dev/build output here instead.
  distDir: ".next-local",
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
