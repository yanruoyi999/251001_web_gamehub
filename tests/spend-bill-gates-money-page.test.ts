import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const pagePath = path.join(
  process.cwd(),
  'app/[locale]/games/spend-bill-gates-money/page.tsx',
);

describe('Spend Bill Gates Money independent route', () => {
  it('provides bilingual SEO, structured data, trust copy, and internal discovery', () => {
    expect(existsSync(pagePath)).toBe(true);
    if (!existsSync(pagePath)) return;

    const source = readFileSync(pagePath, 'utf8');

    expect(source).toContain('generateStaticParams');
    expect(source).toContain('generateMetadata');
    expect(source).toContain('SpendBillGatesMoneyGame');
    expect(source).toContain('Spend Bill Gates Money - Billionaire Life Simulator');
    expect(source).toContain('花光比尔·盖茨的钱 - 亿万富翁模拟器');
    expect(source).toContain('/games/spend-bill-gates-money');
    expect(source).toContain("'@type': 'VideoGame'");
    expect(source).toContain("'@type': 'FAQPage'");
    expect(source).toContain("'@type': 'BreadcrumbList'");
    expect(source).toContain('not affiliated with or endorsed by Bill Gates');
    expect(source).toContain('与比尔·盖茨、微软或任何相关组织无关');
    expect(source).toContain("getLocalizedPath(locale, '/games')");
    expect(source).toContain("getLocalizedPath(locale, '/guides/no-download-games')");
    expect(source).toContain('serializeJsonLd');
  });
});
