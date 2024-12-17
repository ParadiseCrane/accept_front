import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // uncomment for docker deployment
  // output: "standalone",
  typescript: {
    // uncomment for docker deployment
    // ignoreBuildErrors: true
  },
  modularizeImports: {
    '@tabler/icons': {
      transform: '@tabler/icons/{{member}}',
    },
  },
  expireTime: 1800, // half hour
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 3,
    staticGenerationMinPagesPerWorker: 25,
    // optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wallpapers.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/profile',
        destination: `/profile/me`,
      },
      {
        source: '/edu',
        destination: `/task/list`,
      },
      {
        source: '/api/image/:slug*', // No credentials!
        destination: `${process.env.API_ENDPOINT}/api/image/:slug*`,
      },
    ];
  },
};

export default nextConfig;
