import { describe, expect, it } from 'vitest';
import { getSeoLandingPage, getSeoLandingPages } from '@/lib/seo-landing-content';
import sitemap from '@/app/sitemap';
import { CHINESE_CHECKERS_HOP_EXAMPLE } from '@/lib/chinese-checkers-guide-content';

const slug = 'chinese-checkers-rules';

describe('Chinese Checkers published-edition guide', () => {
  it('registers one bilingual guide, not an unimplemented game', () => {
    const guide = getSeoLandingPage(slug);
    expect(guide).toBeDefined();
    expect(getSeoLandingPages().filter((p) => p.slug === slug)).toHaveLength(1);
    expect(guide?.indexable).toBe(true);
    expect(guide?.embedGame).toBeUndefined();
    expect(guide?.interactiveWidget).toBeUndefined();
    expect(guide?.publishedAt).toBeUndefined();
    for (const locale of ['en', 'zh'] as const) {
      const copy = guide!.locales[locale];
      expect(copy.sections.length).toBeGreaterThanOrEqual(7);
      expect(copy.faqs.length).toBeGreaterThanOrEqual(3);
      expect(copy.externalLinks?.some((link) => link.href === 'https://www.winning-moves.com/images/ChineseCheckers_Rules.pdf')).toBe(true);
      const text = JSON.stringify(copy);
      expect(text).toContain('Winning Moves');
      expect(text).toContain('2 / 3 / 4 / 6');
      expect(text).toContain('10');
      expect(text).toContain('(0,0)');
      expect(text).toContain('(2,2)');
    }
  });

  it('does not attribute unstated blocking rules or exclude the documented five-player variant', () => {
    const guide = getSeoLandingPage(slug)!;
    const en = JSON.stringify(guide.locales.en);
    const zh = JSON.stringify(guide.locales.zh);
    expect(en).toContain('five-player');
    expect(en).toContain('beginner');
    expect(en).toContain('does not specify');
    expect(zh).toContain('五人');
    expect(zh).toContain('未规定');
    expect(en).not.toContain('may not leave it');
    expect(en).not.toContain('an exchange for one or two opposing pegs');
    expect(en).not.toContain('does not invent a five-player setup');
  });

  it('validates the actual narrated two-hop example without captures', () => {
    const { start, stops, occupied } = CHINESE_CHECKERS_HOP_EXAMPLE;
    const directions = new Set(['1,0', '0,1', '-1,1', '-1,0', '0,-1', '1,-1']);
    const occupiedKeys = new Set(occupied.map((p) => p.join(',')));
    let from: readonly number[] = start;
    for (const to of stops) {
      const step = [(to[0] - from[0]) / 2, (to[1] - from[1]) / 2];
      expect(directions.has(step.join(','))).toBe(true);
      expect(occupiedKeys.has([from[0] + step[0], from[1] + step[1]].join(','))).toBe(true);
      expect(occupiedKeys.has(to.join(','))).toBe(false);
      from = to;
    }
    expect(stops).toEqual([[2, 0], [2, 2]]);
    expect(occupied).toEqual([[1, 0], [2, 1]]);
    expect(occupiedKeys.size).toBe(2);
  });

  it('has an existing-guide incoming edge and two canonical sitemap URLs', async () => {
    const incoming = getSeoLandingPages().filter((p) => p.slug !== slug && p.indexable && p.relatedSlugs.includes(slug));
    expect(incoming.length).toBeGreaterThanOrEqual(1);
    const entries = await sitemap();
    for (const suffix of [`/guides/${slug}`, `/en/guides/${slug}`]) {
      expect(entries.filter((entry) => new URL(entry.url).pathname === suffix)).toHaveLength(1);
    }
  });
});
