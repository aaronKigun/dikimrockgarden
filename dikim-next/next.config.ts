import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Prevents Next.js from trying to load the 'sharp' module during build
    unoptimized: true,
  },
};

export default nextConfig;