import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { getSeoLandingPage } from '@/lib/seo-landing-content';
import { getGuideIntentProperties } from '@/lib/guide-intent';

describe('iPhone guide task entry', () => {
  it('has a bounded, bilingual, evidence-labelled quick pick without changing the title', () => {
    const page = getSeoLandingPage('best-free-iphone-games')!;
    expect(page.locales.en.heading).toBe('Best Free iPhone Games With No Download');
    for (const locale of ['en', 'zh'] as const) {
      const picks = page.locales[locale].quickPicks;
      expect(picks?.length).toBeGreaterThanOrEqual(1);
      expect(picks!.length).toBeLessThanOrEqual(3);
      expect(new Set(picks!.map(pick => pick.slug)).size).toBe(picks!.length);
      expect(picks![0].slug).toBe('draw-a-perfect-circle');
      for (const pick of picks!) {
        expect(pick.checkedAt).toBe('2026-09-17');
        expect(pick.environment).toMatch(/WebKit|Chromium/);
        expect(pick.controls.length).toBeGreaterThan(0);
        expect(pick.saving.length).toBeGreaterThan(0);
        expect(pick.sound.length).toBeGreaterThan(0);
      }
    }
  });
  it('accepts only the new guide and finite card action, not target URLs', () => {
    expect(getGuideIntentProperties('best-free-iphone-games', 'play_circle', 'en')).toEqual({ guide_slug: 'best-free-iphone-games', action: 'play_circle', locale: 'en', schema_version: 2 });
    expect(getGuideIntentProperties('best-free-iphone-games', 'https://example.com/private', 'en')).toBeNull();
    expect(getGuideIntentProperties('google-snake-mods', 'play_circle', 'en')).toBeNull();
  });
  it('preserves experimental noindex and existing player runtime boundaries', () => {
    const metadata = readFileSync(new URL('../lib/games/luma-original-experiment-pages.ts', import.meta.url), 'utf8');
    expect(metadata).toContain('index: false');
    const template = readFileSync(new URL('../app/[locale]/guides/[slug]/page.tsx', import.meta.url), 'utf8');
    expect(template).toContain('GuideQuickPicks');
    expect(template).toContain('playLabel={page.embedGame.playLabel?.[locale]}');
  });
});
