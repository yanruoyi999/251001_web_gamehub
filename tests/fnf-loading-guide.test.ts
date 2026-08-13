import { describe, expect, it } from 'vitest';
import { generateMetadata } from '@/app/[locale]/guides/[slug]/page';
import { getSeoLandingPage } from '@/lib/seo-landing-content';
import sitemap from '@/app/sitemap';

const slug = 'friday-night-funkin-loading-guide';

describe('Friday Night Funkin loading experiment', () => {
  it('keeps the experiment noindex with a canonical page URL', async () => {
    const page = getSeoLandingPage(slug);
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en', slug }),
    });

    expect(page?.indexable).toBe(false);
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: true,
    });
    expect(metadata.alternates?.canonical).toBe('/en/guides/' + slug);
  });

  it('does not publish the noindex experiment in sitemap', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).not.toContain('https://251001.com/en/guides/' + slug);
    expect(urls).not.toContain('https://251001.com/guides/' + slug);
  });

  it('has source-backed troubleshooting content and anonymous CTA events', () => {
    const page = getSeoLandingPage(slug);
    const english = page?.locales.en;

    expect(english?.sections.length).toBeGreaterThanOrEqual(7);
    expect(english?.quickAnswerLink?.href).toBe('https://ninja-muffin24.itch.io/funkin');
    expect(page?.intentCta).toMatchObject({
      hookId: 'original_rhythm_avatar',
      viewEvent: 'ai_hook_view',
      clickEvent: 'ai_hook_click',
    });
    expect(english?.ctaDescription).toContain('anonymous');
    expect(english?.ctaDescription).toMatch(/No sign-up, upload/i);
  });
});
