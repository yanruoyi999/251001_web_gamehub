import type { MetadataRoute } from 'next';
import { getSiteBaseUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteBaseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/api/', '/admin/*'],
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`],
  };
}
