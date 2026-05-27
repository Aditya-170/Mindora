/** @type {import('next').NextConfig} */
export const runtime = "node";

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // konva and react-konva are browser-only, exclude from server bundle entirely
      config.externals = [
        ...config.externals,
        'konva',
        'react-konva',
        'canvas',
      ];
    }
    return config;
  },
};

export default nextConfig;