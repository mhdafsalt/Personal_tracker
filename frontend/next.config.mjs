import path from 'path';
import { fileURLToPath } from 'url';

const frontendDir = path.dirname(fileURLToPath(import.meta.url));
const backendUrl = process.env.BACKEND_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: frontendDir,
  turbopack: {
    root: frontendDir,
  },
  // If BACKEND_URL is set (e.g. during local dev with separate node backend), proxy /api calls to it.
  // Otherwise, Next.js handles /api calls with its built-in serverless route handlers (ideal for Vercel deployment).
  async rewrites() {
    if (backendUrl) {
      return [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
