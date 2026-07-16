import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'suzuri.jp',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.suzuri.jp',
        pathname: '/**',
      },
    ],
  },
  // For Vercel deployment
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
