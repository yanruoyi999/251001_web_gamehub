import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { buildAbsoluteUrl } from '@/lib/seo';
import {
  getSeoLandingPage,
  getSeoLandingPages,
} from '@/lib/seo-landing-content';

const slug = 'word-chain-game-examples';
const expectedChains = [
  ['door', 'bell', 'tower', 'block', 'party', 'hat'],
  ['rain', 'coat', 'pocket', 'watch', 'dog', 'house'],
  ['snow', 'ball', 'room', 'service', 'station', 'master'],
  ['beach', 'ball', 'game', 'night', 'light', 'bulb'],
  ['house', 'plant', 'pot', 'hole', 'punch', 'line'],
  ['school', 'bus', 'stop', 'sign', 'post', 'card'],
  ['foot', 'ball', 'park', 'bench', 'press', 'room'],
  ['moon', 'light', 'house', 'boat', 'yard', 'sale'],
];

describe('word chain examples guide', () => {
  it('registers exactly one bilingual examples route and two reciprocal discovery edges', async () => {
    const page = getSeoLandingPage(slug);
    expect(page).toBeDefined();
    expect(getSeoLandingPages().filter(p => p.slug === slug)).toHaveLength(1);
    expect(page!.primaryKeyword).toBe('word chain game examples');
    expect(page!.publishedAt).toBeUndefined();
    expect(page!.interactiveWidget).toBe('word-chain-examples');
    expect(page!.locales.en.heading).toBe(
      'Word Chain Game Examples: 8 Puzzles with Answers'
    );
    expect(page!.locales.zh.heading).toContain('英语复合词接龙练习');
    const entries = await sitemap();
    for (const prefix of ['/en', '']) {
      const route = entries.filter(
        e => e.url === buildAbsoluteUrl(`${prefix}/guides/${slug}`)
      );
      expect(route).toHaveLength(1);
      expect(route[0].lastModified).toEqual(
        new Date('2026-10-31T00:00:00+08:00')
      );
    }
    for (const source of ['word-games-for-seniors', 'categories-game-topics']) {
      expect(page!.relatedSlugs.filter(s => s === source)).toHaveLength(1);
      expect(
        getSeoLandingPage(source)!.relatedSlugs.filter(s => s === slug)
      ).toHaveLength(1);
      expect(getSeoLandingPage(source)!.updatedAt).toBe(
        '2026-10-31T00:00:00+08:00'
      );
    }
  });

  it('keeps all eight six-word boards and four first-letter/length clues aligned', async () => {
    expect(getSeoLandingPage(slug)).toBeDefined();
    const { WORD_CHAIN_PUZZLES, getWordChainClues } = await import(
      '@/lib/word-chain-guide-content'
    );
    expect(WORD_CHAIN_PUZZLES.map(p => p.words)).toEqual(expectedChains);
    for (const puzzle of WORD_CHAIN_PUZZLES) {
      const clues = getWordChainClues(puzzle.words);
      expect(clues[0]).toBe(puzzle.words[0]);
      expect(clues[5]).toBe(puzzle.words[5]);
      for (let i = 1; i <= 4; i++) {
        expect(clues[i][0]).toBe(puzzle.words[i][0]);
        expect(clues[i]).toHaveLength(puzzle.words[i].length);
        expect(clues[i].slice(1)).toMatch(/^_+$/);
      }
      expect(puzzle.links).toHaveLength(5);
      puzzle.links.forEach((link, i) => {
        expect(link.phrase.replace(/\s/g, '')).toBe(
          puzzle.words[i] + puzzle.words[i + 1]
        );
        for (const locale of ['en', 'zh'] as const)
          expect(link.meaning[locale].trim().length).toBeGreaterThan(2);
      });
    }
  });

  it('server-renders eight native answer controls with every chain and phrase in both locales', async () => {
    expect(getSeoLandingPage(slug)).toBeDefined();
    const { WORD_CHAIN_PUZZLES } = await import(
      '@/lib/word-chain-guide-content'
    );
    const { WordChainExamples } = await import(
      '@/components/seo/word-chain-examples'
    );
    for (const locale of ['en', 'zh'] as const) {
      const html = renderToStaticMarkup(
        createElement(WordChainExamples, { locale })
      );
      expect(html).toContain('id="word-chain-practice"');
      expect(html.match(/<details[\s>]/g)).toHaveLength(8);
      expect(html.match(/<summary[\s>]/g)).toHaveLength(8);
      expect(html).not.toContain('<button');
      for (const puzzle of WORD_CHAIN_PUZZLES) {
        expect(html).toContain(puzzle.words.join(' → '));
        for (const link of puzzle.links) {
          expect(html).toContain(link.phrase);
          expect(html).toContain(link.meaning[locale]);
        }
      }
    }
  });
});
