import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  experimental: {
    serverActions: {
      // Upload de prints pelo painel (até 10 MB + campos do formulário).
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
