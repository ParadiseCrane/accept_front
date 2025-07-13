import { NextConfig } from 'next';

const prod = process.env.NODE_ENV === 'production';
// const prod = 0;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: prod ? 'standalone' : undefined,
  typescript: {
    ignoreBuildErrors: !!prod,
  },
  expireTime: 1800, // half hour
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 3,
    staticGenerationMinPagesPerWorker: 25,
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

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
