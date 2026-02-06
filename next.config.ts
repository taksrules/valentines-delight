import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Exclude pg and related packages from bundling to avoid Windows junction point issues
  serverExternalPackages: ["pg", "pg-native", "@prisma/client", "@aws-sdk/client-s3", "@aws-sdk/s3-request-presigner"],
  
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vbszttesustjohrftklf.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'vbszttesustjohrftklf.supabase.co',
        pathname: '/storage/v1/s3/**', // For signed URLs
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  // @ts-ignore - swcMinify is actually part of Next.js config
  swcMinify: true,
  poweredByHeader: false,
  // @ts-ignore - Turbopack root config for monorepos
  turbopack: {
    root: path.resolve("."),
  },
};

export default nextConfig;
