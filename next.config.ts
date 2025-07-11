import { NextConfig } from 'next';

const prod = process.env.NODE_ENV === 'production';
// const prod = 0;

const nextConfig: NextConfig = {
  output: prod ? 'standalone' : undefined,
  typescript: {
    ignoreBuildErrors: !!prod,
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
    optimizePackageImports: prod
      ? ['@mantine/core', '@mantine/hooks', '@mantine/form', '@mantine/dates']
      : [],
  },
  async redirects() {
    return prod
      ? [
          {
            source: '/course/:slug*',
            destination: '/soon',
            permanent: false,
          },
          {
            source: '/courses',
            destination: '/soon',
            permanent: false,
          },
        ]
      : [];
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
        source: '/courses',
        destination: `/course/list`,
      },
      {
        source: '/api/image/:slug*', // No credentials!
        destination: `${process.env.API_ENDPOINT}/api/image/:slug*`,
      },
    ];
  },
};

export default nextConfig;
