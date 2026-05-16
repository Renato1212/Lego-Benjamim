import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.rebrickable.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.bricklink.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.brickset.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

export default nextConfig;
