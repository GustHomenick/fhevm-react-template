/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Enable experimental features for better WASM support
  experimental: {
    // Improve build performance
    optimizePackageImports: ['@fhevm/sdk'],
  },
};

module.exports = nextConfig;
