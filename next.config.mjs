/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  output: "export",
  webpack: (config, { isServer }) => {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 24000000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: "framework",
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            chunks: "all",
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            priority: 30,
            chunks: "all",
          },
        },
      },
    };
    return config;
  },
};

export default nextConfig;
