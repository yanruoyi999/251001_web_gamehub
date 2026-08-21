import { access, readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const homeSource = await readFile(
  new URL('../app/[locale]/page.tsx', import.meta.url),
  'utf8'
);

const featuredScreenshots = [
  'google-snake.png',
  'drive-mad.png',
  'tunnel-rush.png',
  'big-tower-tiny-square.png',
  'g-switch-2.png',
  'solitaire.png',
];

describe('homepage curation', () => {
  it('separates popular guides from more games to play', () => {
    expect(homeSource).toContain('popularGuideEntries');
    expect(homeSource).toContain('moreGameEntries');
    expect(homeSource).toContain('<DailyRecommendation');
    expect(homeSource).toContain('id="popular-guides"');
    expect(homeSource).toContain('id="more-games"');
    expect(homeSource).toContain('More games to play');
    expect(homeSource).toContain('更多值得玩的游戏');
    expect(homeSource).toContain('Platform challenge');
    expect(homeSource).toContain('Gravity runner');
    expect(homeSource).not.toContain('Keyword test');
    expect(homeSource).not.toContain('关键词测试');
    expect(homeSource).not.toContain('Test the big tall small intent');
    expect(homeSource).not.toContain('测试 gravity run 相关需求');
    expect(homeSource).toContain('/guides/google-snake-mods');
    expect(homeSource).toContain('/guides/drive-mad-walkthrough');
    expect(homeSource).toContain('/guides/quick-play-guide');
    expect(homeSource).toContain('/games/big-tower-tiny-square');
    expect(homeSource).toContain('/games/g-switch-2');
    expect(homeSource).toContain('/games/solitaire');
    expect(homeSource).not.toContain('curatedEntries');
    expect(homeSource).not.toContain('homepage-spend-bill-gates-money');
    expect(homeSource).not.toContain('Spend $100 billion online');
    expect(homeSource).not.toContain('/guides/ovo-walkthrough');
    expect(homeSource).not.toContain('/guides/drive-mad-level-tips');
    expect(homeSource).toContain('priorityFirstImages');
    expect(homeSource).not.toContain('<FeatureCard');
  });

  it('removes numbered SEO-facing advantage headings', () => {
    expect(homeSource).not.toContain('seoPointHeading');
    expect(homeSource).not.toContain('${seoPointHeading} ${index + 1}');
  });

  it('uses checked-in gameplay screenshots for every featured card', async () => {
    await Promise.all(
      featuredScreenshots.map(name =>
        access(new URL(`../public/game-screenshots/${name}`, import.meta.url))
      )
    );
  });

  it('uses an accessible green for homepage text and primary actions', () => {
    expect(homeSource).toContain('bg-emerald-700');
    expect(homeSource).toContain('text-emerald-700');
    expect(homeSource).toContain('dark:text-emerald-400');
    expect(homeSource).not.toContain('bg-primary px-7');
  });
});
