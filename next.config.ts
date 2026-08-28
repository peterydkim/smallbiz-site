import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photography-grade quality; 75 (the default) visibly softened the project shots.
    qualities: [75, 88],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
