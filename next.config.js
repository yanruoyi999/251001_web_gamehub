const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const isDevelopment = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' data: https://res.cloudinary.com https://www.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms https://c.bing.com",
      `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms`,
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self' https://res.cloudinary.com https://www.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms",
      "frame-src 'self' https://*.github.io https://sudoku.tn1ck.com https://playpager.com https://cloud.onlinegames.io https://*.4399.com https://www.friv2018.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'lumagamehub.com',
          },
        ],
        destination: 'https://www.lumagamehub.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
