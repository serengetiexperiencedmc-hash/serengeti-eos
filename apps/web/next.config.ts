import type { NextConfig } from "next";

/** API proxy is handled by App Router route at src/app/eos-api/[...path]/route.ts (reliable POST). */
const nextConfig: NextConfig = {
  transpilePackages: [],
};

export default nextConfig;
