import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // dev runs on 127.0.0.1 (Spotify OAuth requirement) but Next considers its
  // origin "localhost" — without this, client JS is blocked as cross-origin
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
