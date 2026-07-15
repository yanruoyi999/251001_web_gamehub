import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import { GET as getLlmsTxt } from '@/app/llms.txt/route';
import { generateMetadata as generateSearchMetadata } from '@/app/[locale]/search/page';
import { buildAbsoluteUrl } from '@/lib/seo';

describe('SEO surface boundaries', () => {
  it('keeps search and debug sample pages out of sitemap', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).not.toContain(buildAbsoluteUrl('/search'));
    expect(urls).not.toContain(buildAbsoluteUrl('/en/search'));
    expect(urls).not.toContain(buildAbsoluteUrl('/games/4399-sample'));
    expect(urls).not.toContain(buildAbsoluteUrl('/en/games/4399-sample'));
  });

  it('marks search result pages noindex with their own canonical URL', async () => {
    const metadata = await generateSearchMetadata({ params: Promise.resolve({ locale: 'en' }) });

    expect(metadata.alternates?.canonical).toBe('/en/search');
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: true,
    });
  });

  it('does not promote search pages or fabricated ratings in llms.txt', async () => {
    const response = getLlmsTxt();
    const text = await response.text();

    expect(text).not.toContain('/search');
    expect(text).not.toContain('ratings');
  });
});
