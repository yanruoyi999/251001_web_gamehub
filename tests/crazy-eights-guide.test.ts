import { describe, expect, it } from 'vitest';
import { getGuideIntentProperties } from '@/lib/guide-intent';
import { getSeoLandingPage } from '@/lib/seo-landing-content';
import sitemap from '@/app/sitemap';
import { buildAbsoluteUrl } from '@/lib/seo';

const slug = 'crazy-eights-rules';

describe('Crazy Eights guide', () => {
  it('publishes both canonical versions in the sitemap with two discovery links', async () => {
    const guide = getSeoLandingPage(slug);
    expect(guide?.indexable).toBe(true);
    expect(guide?.locales.en.heading).toBe('Crazy Eights Rules');
    expect(guide?.locales.zh.heading).toContain('疯狂八');
    for (const source of ['gin-rummy-rules', 'spit-card-game-rules']) {
      expect(getSeoLandingPage(source)?.relatedSlugs.filter(target => target === slug)).toHaveLength(1);
    }
    for (const target of guide?.relatedSlugs ?? []) expect(getSeoLandingPage(target)).toBeDefined();
    const urls = (await sitemap()).map(entry => entry.url);
    for (const prefix of ['', '/en']) {
      expect(urls.filter(url => url === buildAbsoluteUrl(`${prefix}/guides/${slug}`))).toHaveLength(1);
    }
    expect(urls).not.toContain(buildAbsoluteUrl(`/zh/guides/${slug}`));
  });

  it('allows only the bounded guide actions and keeps their source and language', () => {
    for (const action of ['view_rules', 'open_round_example', 'print_quick_rules', 'read_related_guide']) {
      expect(getGuideIntentProperties(slug, action, 'zh')).toEqual({
        guide_slug: slug, action, locale: 'zh', schema_version: 2,
      });
    }
    expect(getGuideIntentProperties('spit-card-game-rules', 'open_crazy_eights_rules', 'en')?.guide_slug)
      .toBe('spit-card-game-rules');
    expect(getGuideIntentProperties(slug, 'player@example.com', 'zh')).toBeNull();
    expect(getGuideIntentProperties(slug, 'game_start', 'en')).toBeNull();
  });
});
