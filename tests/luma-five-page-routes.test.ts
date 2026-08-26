import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const routes = [
  ['daily-solitaire', 'DailySolitaire'],
  ['connect-the-dots', 'ConnectTheDots'],
  ['sorting-games', 'SortingLab'],
  ['mahjong-connect', 'MahjongConnect'],
  ['asmr-games', 'AsmrExperiences'],
] as const;

describe('Luma five-page route contract', () => {
  it('declares static bilingual routes, direct navigation, and no sitemap mutation', () => {
    for (const [slug, component] of routes) {
      const routePath = path.join(process.cwd(), 'app', '[locale]', 'games', slug, 'page.tsx');
      expect(existsSync(routePath)).toBe(true);

      const source = readFileSync(routePath, 'utf8');
      expect(source).toContain("dynamic = 'force-static'");
      expect(source).toContain('generateStaticParams');
      expect(source).toContain('generateMetadata');
      expect(source).toContain('getOriginalExperimentPage');
      expect(source).toContain('getLocalizedPath(locale, \'/games\')');
      expect(source).toContain(component);
      expect(source).not.toContain('sitemap');
    }
  });
});
