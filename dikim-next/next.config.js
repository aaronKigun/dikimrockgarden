/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 14 expects an object here (boolean `false` is Next 16+)
  devIndicators: {
    buildActivity: false,
  },
  images: {
    // Prevents sharp/SIGABRT crash on shared hosting
    unoptimized: true,
  },
};

module.exports = nextConfig;
