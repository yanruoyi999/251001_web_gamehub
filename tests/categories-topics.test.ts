import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { getSeoLandingPage, getSeoLandingPages } from '@/lib/seo-landing-content';

describe('Categories topics task page', () => {
  it('adds one bilingual guide without taking over an existing game intent', () => {
    const page = getSeoLandingPage('categories-game-topics');
    expect(page).toBeDefined();
    expect(getSeoLandingPages().filter(p => p.slug === 'categories-game-topics')).toHaveLength(1);
    expect(page!.interactiveWidget).toBe('categories-topics');
    expect(page!.indexable).not.toBe(false);
    expect(page!.embedGame).toBeUndefined();
    for (const locale of ['en', 'zh'] as const) {
      expect(page!.locales[locale].sections.length).toBeGreaterThanOrEqual(5);
      expect(page!.locales[locale].externalLinks!.length).toBeGreaterThanOrEqual(2);
    }
    expect(page!.relatedSlugs.length).toBeGreaterThanOrEqual(2);
  });
  it('provides 48 unique bilingual topics and deterministic, nonduplicated rounds', async () => {
    expect(existsSync(new URL('../lib/games/categories-topics.ts', import.meta.url))).toBe(true);
    const { CATEGORY_TOPICS, chooseCategoryTopics } = await import('@/lib/games/categories-topics');
    expect(CATEGORY_TOPICS).toHaveLength(48);
    expect(new Set(CATEGORY_TOPICS.map(t => t.id)).size).toBe(48);
    for (const group of ['warmup', 'everyday', 'creative'] as const) {
      expect(CATEGORY_TOPICS.filter(t => t.group === group)).toHaveLength(16);
      const round = chooseCategoryTopics(group, 12, () => 0.5);
      expect(round).toHaveLength(12);
      expect(new Set(round.map(t => t.id)).size).toBe(12);
      expect(round.every(t => t.group === group)).toBe(true);
      for (const topic of round) for (const locale of ['en', 'zh'] as const) {
        expect(topic.label[locale].length).toBeGreaterThan(0);
        expect(topic.example[locale].length).toBeGreaterThan(0);
      }
    }
    const before = JSON.stringify(CATEGORY_TOPICS);
    expect(chooseCategoryTopics('all', 6, () => 0)).toHaveLength(6);
    expect(JSON.stringify(CATEGORY_TOPICS)).toBe(before);
    for (const count of [0, -1, 7, Infinity, NaN, 100]) expect(() => chooseCategoryTopics('all', count)).toThrow();
    expect(() => chooseCategoryTopics('unknown', 6)).toThrow();
    for (const random of [() => -1, () => 1, () => NaN]) expect(() => chooseCategoryTopics('all', 6, random)).toThrow();
  });
});
