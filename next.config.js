const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const isDevelopment = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self'",
      "img-src 'self' data: https://res.cloudinary.com https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms https://c.bing.com",
      `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''} https://*.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms`,
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self' https://res.cloudinary.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.google.com https://*.clarity.ms",
      "frame-src 'self' https://yanruoyi999.github.io https://dj-dk.github.io https://sudoku.tn1ck.com https://playpager.com https://cloud.onlinegames.io https://sda.4399.com https://sxiao.4399.com https://szhong.4399.com https://www.friv2018.com",
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

/**
 * Game runtimes are deliberately sandboxed by the parent iframe. They need a
 * narrowly scoped exception to the main site's anti-framing policy so Luma can
 * embed its own static runtime documents. The runtime CSP stays local-only and
 * does not inherit analytics, forms, remote frames, or other application
 * capabilities.
 */
const gameRuntimeSecurityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'none'",
      "base-uri 'none'",
      "object-src 'none'",
      "form-action 'none'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data:",
      "font-src 'none'",
      "media-src 'none'",
      "connect-src 'none'",
      "frame-src 'none'",
      "frame-ancestors 'self'",
    ].join('; '),
  },
  {
    key: 'Referrer-Policy',
    value: 'no-referrer',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
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
      {
        source: '/games-runtime/:path*',
        headers: gameRuntimeSecurityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/guides/ad-free-games',
        destination: '/guides/free-games-no-ads',
        permanent: true,
      },
      {
        source: '/en/guides/ad-free-games',
        destination: '/en/guides/free-games-no-ads',
        permanent: true,
      },
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
