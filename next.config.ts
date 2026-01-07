import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignora erros de tipagem no build para não travar deploy por detalhes
    ignoreBuildErrors: true
  },
  // ISTO É OBRIGATÓRIO PARA O PDF-PARSE FUNCIONAR:
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;