import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          plotly: {
            test: /[\\/]node_modules[\\/](plotly\.js|react-plotly\.js)[\\/]/,
            name: 'plotly',
            chunks: 'all',
            priority: 30,
          },
          tfjs: {
            test: /[\\/]node_modules[\\/]@tensorflow[\\/]/,
            name: 'tensorflow',
            chunks: 'all',
            priority: 30,
          },
          imgly: {
            test: /[\\/]node_modules[\\/]@imgly[\\/]/,
            name: 'imgly',
            chunks: 'all',
            priority: 30,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
