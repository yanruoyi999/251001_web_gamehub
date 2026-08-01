import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const guideIndexPath = path.join(process.cwd(), 'app/[locale]/guides/page.tsx');
const sitemapPath = path.join(process.cwd(), 'app/sitemap.ts');

const radarPath = '/guides/game-opportunity-radar';

describe('Game Opportunity Radar discovery', () => {
  it('links the creator tool from the guides index', () => {
    const source = readFileSync(guideIndexPath, 'utf8');

    expect(source).toContain(radarPath);
    expect(source).toContain('Game Opportunity Radar');
    expect(source).toContain('游戏机会雷达');
  });

  it('includes the creator tool in the localized sitemap source', () => {
    const source = readFileSync(sitemapPath, 'utf8');

    expect(source).toContain(`path: '${radarPath}'`);
  });
});
