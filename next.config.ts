import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com' ,
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com' ,
      },
    ],
  },
};

export default nextConfig;
