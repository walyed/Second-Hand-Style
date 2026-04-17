import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(import.meta.dirname, "../../"),
  allowedDevOrigins: ["192.168.100.173"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "xentebyoozahwxtckcrd.supabase.co",
      },
    ],
  },
};

export default nextConfig;
