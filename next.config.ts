import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m2zbjbc3elpuopjf.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
