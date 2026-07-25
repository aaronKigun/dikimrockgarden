/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    // Prevents sharp/SIGABRT crash on shared hosting
    unoptimized: true,
  },
};

module.exports = nextConfig;