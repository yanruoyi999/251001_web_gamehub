import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { normalizeEnglishStaticHtml } from '../scripts/static-locale-html';

const read = (path: string) => readFileSync(path, 'utf8');
describe('locale document root and read-only verification', () => {
  it('fails instead of silently rewriting a wrong server language', () => {
    expect(() => normalizeEnglishStaticHtml('<html lang="zh" data-locale="zh"><body></body></html>', 'en/page.html')).toThrow(/locale/);
  });
  it('takes the document locale from the public route params, not request headers', () => {
    const layout = read('app/[locale]/layout.tsx');
    expect(layout).toContain('<DocumentShell locale={typedLocale}>');
    expect(layout).not.toContain('next/headers');
    expect(read('app/admin/layout.tsx')).toContain('<DocumentShell locale="en">');
  });
});
