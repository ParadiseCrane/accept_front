const { API_ENDPOINT, WEBSOCKET_API } = process.env;

console.info('Config', { API_ENDPOINT });

/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    WEBSOCKET_API,
  },
  modularizeImports: {
    '@tabler/icons': {
      transform: '@tabler/icons/{{member}}',
    },
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
        destination: `${API_ENDPOINT}/api/image/:slug*`,
      },
    ];
  },
};
