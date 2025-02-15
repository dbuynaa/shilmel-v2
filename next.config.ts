import type { NextConfig } from "next/types"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ["tsx", "mdx", "ts", "js"],
  // experimental: {
  //   esmExternals: true,
  //   scrollRestoration: true,
  //   // ppr: true,
  //   cpus: 1,
  //   reactOwnerStack: true,
  //   reactCompiler: true,
  //   mdxRs: true,
  //   inlineCss: true,
  // },
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
    ],
  },
}

export default nextConfig
