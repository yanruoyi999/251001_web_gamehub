import { access, readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const homeSource = await readFile(
  new URL('../app/[locale]/page.tsx', import.meta.url),
  'utf8'
);

describe('homepage curation', () => {
  it('separates popular guides from more games and guides', () => {
    expect(homeSource).toContain('popularGuideEntries');
    expect(homeSource).toContain('moreGameEntries');
    expect(homeSource).toContain('<DailyRecommendation');
    expect(homeSource).toContain('id="popular-guides"');
    expect(homeSource).toContain('id="more-games"');
    expect(homeSource).toContain('More games and guides');
    expect(homeSource).toContain('更多游戏和攻略');
    expect(homeSource).toContain('Platform challenge');
    expect(homeSource).toContain('Gravity runner');
    expect(homeSource).not.toContain('Keyword test');
    expect(homeSource).not.toContain('关键词测试');
    expect(homeSource).not.toContain('Test the big tall small intent');
    expect(homeSource).not.toContain('测试 gravity run 相关需求');
    expect(homeSource).toContain('/guides/google-snake-mods');
    expect(homeSource).toContain('/guides/drive-mad-walkthrough');
    expect(homeSource).toContain('/guides/quick-play-guide');
    expect(homeSource).toContain('/guides/big-tower-tiny-square-walkthrough');
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

  it('keeps the Solitaire image and uses Luma artwork for former mirror entries', async () => {
    await access(new URL('../public/game-screenshots/solitaire.png', import.meta.url));
    await access(new URL('../public/og-gamehub.svg', import.meta.url));
    expect(homeSource.match(/image: '\/game-screenshots\//g)).toHaveLength(2);
  });

  it('uses an accessible green for homepage text and primary actions', () => {
    expect(homeSource).toContain('bg-emerald-700');
    expect(homeSource).toContain('text-emerald-700');
    expect(homeSource).toContain('dark:text-emerald-400');
    expect(homeSource).not.toContain('bg-primary px-7');
  });
});
