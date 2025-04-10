import type { NextConfig } from "next/types";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ["tsx", "ts", "js"],
  experimental: {
    scrollRestoration: true,
    inlineCss: true,
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "a4mvnoigij.ufs.sh", // Added this line
      },
    ],
  },
  webpack: (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        extensionAlias: {
          ".js": [".js", ".ts"],
          ".jsx": [".jsx", ".tsx"],
        },
      },
    };
  },
  rewrites: async () => [
    {
      source: "/stats/:match*",
      destination: "https://eu.umami.is/:match*",
    },
  ],
};

export default nextConfig;
