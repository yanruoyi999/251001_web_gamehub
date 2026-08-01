import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const pagePath = path.join(
  process.cwd(),
  'app/[locale]/guides/game-opportunity-radar/page.tsx',
);

describe('Game Opportunity Radar guide page', () => {
  it('provides a bilingual static page with the evaluator and trust boundary', () => {
    expect(existsSync(pagePath)).toBe(true);
    if (!existsSync(pagePath)) return;

    const source = readFileSync(pagePath, 'utf8');

    expect(source).toContain('generateStaticParams');
    expect(source).toContain('GameOpportunityRadarForm');
    expect(source).toContain("'WebApplication'");
    expect(source).toContain("'FAQPage'");
    expect(source).toContain("'BreadcrumbList'");
    expect(source).toContain('不是收入预测');
    expect(source).toContain('not a revenue forecast');
    expect(source).toContain('mailto:dev@lumagamehub.com');
  });
});
