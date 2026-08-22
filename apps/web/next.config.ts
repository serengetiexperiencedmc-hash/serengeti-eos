import type { NextConfig } from "next";

const apiOrigin = process.env.EOS_API_URL ?? "http://127.0.0.1:8080";

const nextConfig: NextConfig = {
  transpilePackages: [],
  async rewrites() {
    return [
      {
        source: "/eos-api/:path*",
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
