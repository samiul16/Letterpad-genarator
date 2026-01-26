import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "flagcdn.com",
    //     port: "",
    //     pathname: "/**",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "images.unsplash.com",
    //     port: "",
    //     pathname: "/**",
    //   },
    // ],
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
