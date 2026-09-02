import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const routes = [
  ['daily-solitaire', 'DailySolitaire'],
  ['connect-the-dots', 'ConnectTheDots'],
  ['sorting-games', 'SortingLab'],
  ['mahjong-connect', 'MahjongConnect'],
  ['asmr-games', 'AsmrExperiences'],
  ['draw-a-perfect-circle', 'DrawPerfectCircle'],
  ['chinese-checkers', 'ChineseCheckers'],
  ['stacker-game', 'StackerGame'],
  ['two-player-games', 'TwoPlayerGames'],
] as const;

describe('Luma governed experiment route contract', () => {
  it('declares the admitted governed batches as static bilingual routes with no sitemap mutation', () => {
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
