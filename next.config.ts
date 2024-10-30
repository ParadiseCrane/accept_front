import { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
        source: '/api/image/:slug*',
        destination: `${process.env.API_ENDPOINT}/api/image/:slug*`,
      },
    ];
  },
};

export default nextConfig;
