const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const isDevelopment = process.env.NODE_ENV !== 'production';

function toHttpsSource(hostname) {
  if (!hostname || !/^[a-z0-9.-]+(?::\d+)?$/i.test(hostname)) return null;
  return `https://${hostname}`;
}

const runtimeAssetSources = [
  "'self'",
  'http://localhost:*',
  'http://127.0.0.1:*',
  'https://lumagamehub.com',
  'https://www.lumagamehub.com',
  toHttpsSource(process.env.VERCEL_URL),
  toHttpsSource(process.env.VERCEL_PROJECT_PRODUCTION_URL),
].filter(Boolean);

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
      // Static App Router output contains Next bootstrap/RSC inline script
      // elements, so script-src still needs unsafe-inline until the app adopts
      // request nonces. Inline event-handler attributes are not required and
      // are denied separately.
      `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''} https://*.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms`,
      "script-src-attr 'none'",
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self' https://res.cloudinary.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.google.com https://*.clarity.ms",
      // sda.4399.com / sxiao.4399.com only backed retired Temple Run
      // entries, and friv2018 only backed manual-review Raft Wars entries.
      "frame-src 'self' https://yanruoyi999.github.io https://dj-dk.github.io https://sudoku.tn1ck.com https://playpager.com https://cloud.onlinegames.io https://szhong.4399.com",
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
 * Game runtimes are sandboxed by the parent iframe without allow-same-origin.
 * WebKit therefore treats the child document as an opaque origin and does not
 * reliably match external relative CSS/JS against CSP 'self'. We list only
 * the known Luma/local build origins (plus the exact Vercel host injected at
 * build time) so Safari can load the self-hosted files without enabling broad
 * network access or unsafe-inline execution.
 */
const gameRuntimeSecurityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'none'",
      "base-uri 'none'",
      "object-src 'none'",
      "form-action 'none'",
      `script-src ${runtimeAssetSources.join(' ')}`,
      `style-src ${runtimeAssetSources.join(' ')}`,
      `img-src ${runtimeAssetSources.join(' ')} data:`,
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
        source: '/guides/game-opportunity-radar',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/en/guides/game-opportunity-radar',
        destination: '/en/guides',
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
