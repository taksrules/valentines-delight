import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude pg and related packages from bundling to avoid Windows junction point issues
  serverExternalPackages: ["pg", "pg-native", "@prisma/client"],
  
  images: {
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
    ],
  },
};

export default nextConfig;
