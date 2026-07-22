import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');

describe('player-facing trust surfaces', () => {
  it('keeps the source and tips panels readable in dark mode', () => {
    const gamePage = read('app/[locale]/games/[slug]/page.tsx');

    expect(gamePage).toContain('dark:border-green-800');
    expect(gamePage).toContain('dark:bg-green-950/30');
    expect(gamePage).toContain('dark:text-green-300');
    expect(gamePage).toContain('dark:border-yellow-800');
    expect(gamePage).toContain('dark:bg-yellow-950/30');
  });

  it('does not present the current request time as a mock-game publication date', () => {
    const gamePage = read('app/[locale]/games/[slug]/page.tsx');

    expect(gamePage).not.toContain('const now = new Date();');
    expect(gamePage).toContain('publishedAt: null');
    expect(gamePage).toContain('catalogueUi.showPublishedDates && game.publishedAt');
  });

  it('does not expose webmaster jargon as player benefits', () => {
    const homepage = read('app/[locale]/page.tsx');
    const messages = `${read('messages/en.json')}\n${read('messages/zh.json')}`;
    const publicCopy = `${homepage}\n${messages}`;

    for (const phrase of [
      'Popular from search',
      '近期搜索入口',
      'crawlable detail page',
      'structured data',
      'commercial keywords',
      '可收录详情页',
      '结构化数据',
      '商业关键词',
    ]) {
      expect(publicCopy).not.toContain(phrase);
    }
  });

  it('uses first-party trust and support links in the footer', () => {
    const footer = read('components/layout/Footer.tsx');

    expect(footer).not.toContain('developers.google.com/search');
    expect(footer).not.toContain('AdSense Policies');
    expect(footer).not.toContain('opengameart.org');
    expect(footer).toContain("localizedPath('/about')");
    expect(footer).toContain("localizedPath('/contact')");
    expect(footer).toContain("localizedPath('/privacy')");
    expect(footer).toContain('Report a game or request removal');
  });
});
