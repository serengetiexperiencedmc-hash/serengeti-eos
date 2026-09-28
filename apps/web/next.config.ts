import type { NextConfig } from "next";

/** API proxy is handled by App Router route at src/app/eos-api/[...path]/route.ts (reliable POST). */
const nextConfig: NextConfig = {
  // Tracked `apps/web/.next` is memory-mapped on Windows (Turbopack/webpack
  // UNKNOWN/-4094 on routes.d.ts). Keep that tree untouched; write the live
  // dev/build output here instead.
  distDir: process.env.EOS_WEB_DIST_DIR ?? ".next-local",
  // Cursor Simple Browser and some HTTP clients do not follow Next's 308
  // `/commercial/` → `/commercial` redirect, so the preview looks blank.
  // `src/proxy.ts` rewrites the trailing-slash URL onto the real page.
  skipTrailingSlashRedirect: true,
  // Next 16 blocks /_next/hmr and other dev assets unless the request
  // hostname is localhost or listed here. The printed preview URL and
  // Simple Browser use 127.0.0.1, which is a different origin.
  allowedDevOrigins: ["127.0.0.1"],
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
