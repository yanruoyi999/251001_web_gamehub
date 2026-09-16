import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { getGuidePublicationDates } from '@/lib/guide-publication-dates';

describe('honest guide publication dates', () => {
  it('keeps a known publication date stable when the guide is revised', () => {
    const original = { publishedAt: '2026-07-20T00:00:00.000Z', updatedAt: '2026-09-15T00:00:00.000Z' };
    const next = getGuidePublicationDates({ ...original, updatedAt: '2026-09-17T00:00:00.000Z' });
    expect(next.datePublished).toBe(original.publishedAt);
    expect(next.dateModified).toBe('2026-09-17T00:00:00.000Z');
  });
  it('omits unknown or invalid publication dates instead of substituting updatedAt', () => {
    for (const publishedAt of [undefined, '', 'invalid', '2027-01-01T00:00:00.000Z']) {
      const result = getGuidePublicationDates({ publishedAt, updatedAt: '2026-09-17T00:00:00.000Z' });
      expect(JSON.parse(JSON.stringify(result))).not.toHaveProperty('datePublished');
      expect(result.dateModified).toBe('2026-09-17T00:00:00.000Z');
    }
  });
  it('uses the same publication semantics for Open Graph and Article metadata', () => {
    const source = readFileSync(new URL('../app/[locale]/guides/[slug]/page.tsx', import.meta.url), 'utf8');
    expect(source).not.toContain('publishedTime: page.updatedAt');
    expect(source).not.toContain('datePublished: page.updatedAt');
    expect(source).toContain('getGuidePublicationDates(page)');
    expect(source).toContain('dateTime={page.updatedAt}');
  });
});
