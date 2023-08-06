const { API_ENDPOINT, WEBSOCKET_API } = process.env;

console.info('Config', { API_ENDPOINT, WEBSOCKET_API });

/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    WEBSOCKET_API,
  },
  async rewrites() {
    return [
      {
        source: '/back/:slug*',
        destination: `${API_ENDPOINT}/api/:slug*`,
      },
      {
        source: '/profile',
        destination: `/profile/me`,
      },
      {
        source: '/edu',
        destination: `/task/list`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/assignment_schema/:slug*',
        destination: '/edu/assignment_schema/:slug*',
        permanent: false,
      },
      {
        source: '/assignment/:slug*',
        destination: '/edu/assignment/:slug*',
        permanent: false,
      },
      {
        source: '/api/image',
        destination: `${API_ENDPOINT}/api/image`,
        permanent: false,
      },
    ];
  },
};
