import { describe, expect, it } from 'vitest';

import { resolveSpendBillContext } from '@/components/seo/spend-bill-gates-money-context-links';

describe('Spend Bill Gates Money contextual path normalization', () => {
  it('returns the same Chinese homepage context for public and internal locale paths', () => {
    expect(resolveSpendBillContext('/zh')).toEqual(resolveSpendBillContext('/'));
  });

  it('returns the same Chinese guide context for public and internal locale paths', () => {
    expect(resolveSpendBillContext('/zh/guides/google-snake-mods')).toEqual(
      resolveSpendBillContext('/guides/google-snake-mods'),
    );
  });

  it('keeps the English localized path behavior unchanged', () => {
    expect(resolveSpendBillContext('/en/guides/google-snake-mods')?.locale).toBe('en');
  });
});
