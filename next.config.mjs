/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  webpack: (config, { isServer }) => {
    config.optimization.splitChunks = {
      chunks: "all",
      maxInitialRequests: 25,
      minSize: 20000,
      maxSize: 24000000,
      cacheGroups: {
        default: false,
        vendors: false,
      },
    };
    return config;
  },
};

export default nextConfig;
