/** @type {import('next').NextConfig} */
export const runtime = "node";
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
