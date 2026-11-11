import { describe, expect, it } from 'vitest';
import { getGuideIntentProperties } from '@/lib/guide-intent';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

const slug = 'crazy-eights-rules';

describe('Crazy Eights pilot', () => {
  it('publishes one bilingual rules guide with two discovery links and excludes it from indexing', () => {
    const guide = getSeoLandingPage(slug);
    expect(guide?.indexable).toBe(false);
    expect(guide?.locales.en.heading).toBe('Crazy Eights Rules');
    expect(guide?.locales.zh.heading).toContain('疯狂八');
    for (const source of ['gin-rummy-rules', 'spit-card-game-rules']) {
      expect(getSeoLandingPage(source)?.relatedSlugs.filter(target => target === slug)).toHaveLength(1);
    }
    for (const target of guide?.relatedSlugs ?? []) expect(getSeoLandingPage(target)).toBeDefined();
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
