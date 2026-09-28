import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  output: "standalone",
  images: {
    remotePatterns: [new URL("https://bulukgskywmxunsbaxzq.supabase.co/storage/v1/object/public/**")],
  },
  async redirects() {
    return [{ source: "/", destination: "/ar", permanent: false }];
  },
};

export default nextConfig;
