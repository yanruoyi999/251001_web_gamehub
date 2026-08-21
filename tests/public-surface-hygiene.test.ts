import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getSeoLandingPage, getSeoLandingPages } from '@/lib/seo-landing-content';

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');

describe('public surface hygiene', () => {
  it('does not expose owner-only research labels in public templates', () => {
    const publicSources = [
      read('app/[locale]/page.tsx'),
      read('app/[locale]/guides/page.tsx'),
      read('app/[locale]/guides/[slug]/page.tsx'),
      read('components/layout/Footer.tsx'),
      read('app/sitemap.ts'),
    ].join('\n');

    for (const phrase of [
      'Game Opportunity Radar',
      '游戏机会雷达',
      'MVP Feasibility',
      '关键词测试',
      'Keyword test',
      'Demo Data',
      'testing-games',
      'page.primaryKeyword',
      'ai_hook_view',
      'ai_hook_click',
    ]) {
      expect(publicSources).not.toContain(phrase);
    }
  });

  it('removes the owner-only route and evaluator modules', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'app/[locale]/guides/game-opportunity-radar/page.tsx'))).toBe(false);
    expect(fs.existsSync(path.join(process.cwd(), 'components/creator/game-opportunity-radar-form.tsx'))).toBe(false);
    expect(fs.existsSync(path.join(process.cwd(), 'lib/game-opportunity-radar.ts'))).toBe(false);
    expect(read('next.config.js')).toContain("source: '/guides/game-opportunity-radar'");
  });

  it('keeps the FNF page player-facing while preserving noindex', () => {
    const page = getSeoLandingPage('friday-night-funkin-loading-guide');
    expect(page?.indexable).toBe(false);
    expect(JSON.stringify(page)).not.toMatch(
      /original_rhythm_avatar|ai_hook_view|ai_hook_click|interest test|owner-only/i,
    );
  });

  it('keeps published guide content free of site-owner growth strategy', () => {
    const publishedContent = JSON.stringify(
      getSeoLandingPages().map((page) => page.locales),
    );

    expect(publishedContent).not.toMatch(
      /low-competition|低竞争|adsense review|adsense 审核|seo and geo|seo 和 geo|search signal|搜索信号|guide-first|机会清单|7-14 days|7-14 天|luma should|luma 目前把|worth building|最值得先做|watchlist|观察清单|候选仍需|candidate still/i,
    );
  });
});
