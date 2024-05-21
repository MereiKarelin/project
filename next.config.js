/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: ['cdn.yourbandy.com', 'test-cdn.yourbandy.com', 'upload.wikimedia.org'],
  },
  publicRuntimeConfig: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    WEBSOCKET_URL: process.env.WEBSOCKET_URL,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
  },
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    WEBSOCKET_URL: process.env.WEBSOCKET_URL,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
  },
  output: 'standalone',
  pageExtensions: ['ts', 'tsx'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

module.exports = nextConfig;
