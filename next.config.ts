import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude pg and related packages from bundling to avoid Windows junction point issues
  serverExternalPackages: ["pg", "pg-native", "@prisma/client"],
};

export default nextConfig;
