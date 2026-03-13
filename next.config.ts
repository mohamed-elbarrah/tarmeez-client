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
      {
protocol: 'https',
hostname: 'dcsa.com.au'
      },
      {
        protocol: 'https',
        hostname: 'placehold.co'
      },
      {
        protocol: 'http',
        hostname: 'localhost:8000'
      }
    ],
  },
};

export default nextConfig;
