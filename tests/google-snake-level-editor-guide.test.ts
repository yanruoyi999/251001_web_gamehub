import { describe, expect, it } from 'vitest';

import { generateMetadata } from '@/app/[locale]/guides/[slug]/page';
import sitemap from '@/app/sitemap';
import { buildPageQualityRows } from '@/scripts/audit-page-quality';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

const slug = 'google-snake-level-editor';
const sourceUrl = 'https://github.com/DarkSnakeGang/GoogleSnakeLevelEditor';

describe('Google Snake Level Editor guide release', () => {
  it('is indexable with a self-referencing canonical', async () => {
    const page = getSeoLandingPage(slug);
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en', slug }),
    });

    expect(page?.indexable).toBe(true);
    expect(metadata.robots).toBeUndefined();
    expect(metadata.alternates?.canonical).toBe('/en/guides/' + slug);
  });

  it('publishes both localized canonical URLs in the sitemap', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls.some((url) => new URL(url).pathname === '/en/guides/' + slug)).toBe(true);
    expect(urls.some((url) => new URL(url).pathname === '/guides/' + slug)).toBe(true);
  });

  it('covers the source-backed editor workflow without adding another external game iframe', () => {
    const page = getSeoLandingPage(slug);
    const english = page?.locales.en;
    const englishText = [
      ...(english?.overview ?? []),
      ...(english?.sections.flatMap((section) => [
        section.title,
        section.body,
        ...(section.bullets ?? []),
      ]) ?? []),
      ...(english?.faqs.flatMap((faq) => [faq.question, faq.answer]) ?? []),
    ].join(' ');

    expect(page?.primaryKeyword).toBe('google snake level editor');
    expect(page?.keywords).toEqual(
      expect.arrayContaining([
        'google snake level editor mod',
        'google snake mods level editor',
        'google snake level maker',
        'google snake level codes',
      ]),
    );
    expect(page?.embedGame).toBeUndefined();
    expect(english?.quickAnswerLink?.href).toBe(sourceUrl);
    expect(english?.externalLinks).toEqual(
      expect.arrayContaining([expect.objectContaining({ href: sourceUrl })]),
    );
    expect(englishText).toMatch(/work in progress/i);
    expect(englishText).toMatch(/20 increasingly difficult/i);
    expect(englishText).toMatch(/import|export/i);
    expect(englishText).toMatch(/wall mode/i);
    expect(englishText).toMatch(/sokoban mode/i);
    expect(englishText).toMatch(/Random Ham Mode/i);
  });

  it('links the focused guide and the broader Mods guide in both directions', () => {
    const page = getSeoLandingPage(slug);
    const modsPage = getSeoLandingPage('google-snake-mods');

    expect(page?.relatedSlugs).toContain('google-snake-mods');
    expect(modsPage?.relatedSlugs).toContain(slug);
  });

  it('scores at least 80 before it can become indexable', () => {
    const row = buildPageQualityRows().find(
      (candidate) => candidate.path === '/guides/' + slug,
    );

    expect(row?.score).toBeGreaterThanOrEqual(80);
  });
});
