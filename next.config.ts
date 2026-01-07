import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  // pdfjs-dist precisa rodar no ambiente Node nativo, fora do bundle
  serverExternalPackages: ["pdfjs-dist"],
};

export default nextConfig;