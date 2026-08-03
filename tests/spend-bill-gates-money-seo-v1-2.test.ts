import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), 'utf8');

describe('Spend Bill Gates Money SEO v1.2', () => {
  it('adds useful bilingual long-tail content and dedicated social metadata', () => {
    const page = readSource(
      'app/[locale]/games/spend-bill-gates-money/page.tsx',
    );

    expect(page).toContain('spend bill gates money game online');
    expect(page).toContain('money spending game with buy and sell');
    expect(page).toContain('花光比尔盖茨的钱游戏');
    expect(page).toContain('1000亿美元能买什么');
    expect(page).toContain('Can I play Spend Bill Gates Money on mobile?');
    expect(page).toContain('花光比尔·盖茨的钱可以在手机上玩吗？');
    expect(page).toContain('SPEND_BILL_GATES_MONEY_OG_IMAGE');
    expect(page).toContain('dateModified');
    expect(page).toContain('howToTitle');
    expect(page).toContain('mobileTitle');
    expect(page).toContain('buySellTitle');
    expect(page).toContain('whatCanBuyTitle');
    expect(page).toContain('fixedBalanceTitle');

    expect(
      existsSync(
        path.join(
          process.cwd(),
          'public/og/spend-bill-gates-money.png',
        ),
      ),
    ).toBe(true);
  });

  it('adds contextual inbound links without changing catalogue pagination', () => {
    const home = readSource('app/[locale]/page.tsx');
    const guide = readSource('app/[locale]/guides/[slug]/page.tsx');
    const games = readSource('app/[locale]/games/page.tsx');

    expect(home).toContain('SPEND_BILL_GATES_MONEY_PATH');
    expect(home).toContain('Luma Original');
    expect(guide).toContain('SPEND_BILL_GATES_MONEY_GUIDE_LINK_SLUGS');
    expect(guide).toContain('billionaire spending simulator');
    expect(guide).toContain('亿万富翁消费模拟器');
    expect(games).toContain("'/games/spend-bill-gates-money'");
    expect(games).toContain('const { games, total, totalPages');
  });

  it('publishes improved sitemap metadata and keeps robots crawlable', () => {
    const sitemap = readSource('app/sitemap.ts');
    const robots = readSource('app/robots.ts');

    expect(sitemap).toContain('SPEND_BILL_GATES_MONEY_UPDATED_AT');
    expect(sitemap).toContain("changeFrequency: 'weekly'");
    expect(sitemap).toContain('priority: 0.75');
    expect(robots).toContain("allow: '/'");
    expect(robots).toContain("sitemap: [`${siteUrl}/sitemap.xml`]");
  });

  it('creates one legitimate GitHub reference and an execution record', () => {
    const readme = readSource('README.md');

    expect(readme).toContain(
      'https://www.lumagamehub.com/en/games/spend-bill-gates-money',
    );
    expect(
      existsSync(
        path.join(
          process.cwd(),
          'docs/releases/2026-08-04-spend-bill-gates-money-seo-v1-2.md',
        ),
      ),
    ).toBe(true);
  });
});
