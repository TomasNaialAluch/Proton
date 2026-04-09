import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "proton-profile-images.storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
