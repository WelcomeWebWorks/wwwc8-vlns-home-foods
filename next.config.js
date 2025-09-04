const config = require("./src/config/config.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: config.base_path !== "/" ? config.base_path : "",
  trailingSlash: config.site.trailing_slash,
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  eslint: { ignoreDuringBuilds: true },
  // Enable compression
  compress: true,
  // Optimize for Vercel
  poweredByHeader: false,
  generateEtags: false,
};

module.exports = nextConfig;
