import { describe, expect, it } from 'vitest';

import {
  INITIAL_WEALTH,
  PRODUCTS,
  calculateBillionaireStyle,
  calculateRemainingWealth,
  formatCompactUsd,
  formatFullUsd,
  getCategorySpend,
  getSpentBucket,
  upsertPurchase,
} from '@/lib/games/spend-bill-gates-money';
import { decrementPurchase } from '@/lib/games/spend-bill-gates-money-purchases';

describe('Spend Bill Gates Money product data', () => {
  it('defines 15 valid bilingual products with unique ids', () => {
    expect(PRODUCTS).toHaveLength(15);
    expect(new Set(PRODUCTS.map((product) => product.id)).size).toBe(15);
    expect(
      PRODUCTS.every(
        (product) =>
          Number.isInteger(product.price) &&
          product.price > 0 &&
          product.name.zh.length > 0 &&
          product.name.en.length > 0 &&
          product.description.zh.length > 0 &&
          product.description.en.length > 0,
      ),
    ).toBe(true);
  });

  it('uses feedback fields rather than array positions to identify special purchases', () => {
    const epicIds = PRODUCTS.filter((product) => product.feedback === 'epic').map(
      (product) => product.id,
    );
    const legendaryIds = PRODUCTS.filter(
      (product) => product.feedback === 'legendary',
    ).map((product) => product.id);

    expect(epicIds).toEqual([
      'nba-team',
      'football-club',
      'skyscraper',
      'space-program',
      'schools',
      'hospitals',
    ]);
    expect(legendaryIds).toEqual([
      'golden-toilet',
      'personal-chefs',
      'moon-crater',
    ]);
    expect(
      PRODUCTS.filter((product) => product.feedback === 'legendary').every(
        (product) => product.toast?.zh && product.toast.en,
      ),
    ).toBe(true);
  });
});

describe('Spend Bill Gates Money rules', () => {
  it('increments repeated purchases without mutating the input', () => {
    const original = [{ productId: 'private-jet', count: 1 }];
    const updated = upsertPurchase(original, 'private-jet');

    expect(updated).toEqual([{ productId: 'private-jet', count: 2 }]);
    expect(original).toEqual([{ productId: 'private-jet', count: 1 }]);
    expect(upsertPurchase([], 'private-island')).toEqual([
      { productId: 'private-island', count: 1 },
    ]);
  });

  it('decrements repeated purchases, removes zero counts, and never mutates input', () => {
    const original = [
      { productId: 'private-jet', count: 2 },
      { productId: 'super-yacht', count: 1 },
    ];

    const decremented = decrementPurchase(original, 'private-jet');
    expect(decremented).toEqual([
      { productId: 'private-jet', count: 1 },
      { productId: 'super-yacht', count: 1 },
    ]);
    expect(original).toEqual([
      { productId: 'private-jet', count: 2 },
      { productId: 'super-yacht', count: 1 },
    ]);

    expect(decrementPurchase(decremented, 'private-jet')).toEqual([
      { productId: 'super-yacht', count: 1 },
    ]);
    expect(decrementPurchase([], 'private-jet')).toEqual([]);
    expect(decrementPurchase(original, 'unknown-product')).toEqual(original);
  });

  it('restores one product price after a buy-buy-remove sequence', () => {
    const boughtTwice = upsertPurchase(
      upsertPurchase([], 'private-jet'),
      'private-jet',
    );
    expect(calculateRemainingWealth(boughtTwice)).toBe(
      INITIAL_WEALTH - 150_000_000,
    );

    const removedOnce = decrementPurchase(boughtTwice, 'private-jet');
    expect(calculateRemainingWealth(removedOnce)).toBe(
      INITIAL_WEALTH - 75_000_000,
    );
  });

  it('calculates remaining wealth using integer prices and never returns a negative value', () => {
    expect(
      calculateRemainingWealth([{ productId: 'space-program', count: 1 }]),
    ).toBe(90_000_000_000);
    expect(
      calculateRemainingWealth([{ productId: 'space-program', count: 10 }]),
    ).toBe(0);
    expect(
      calculateRemainingWealth([{ productId: 'space-program', count: 11 }]),
    ).toBe(0);
    expect(calculateRemainingWealth([])).toBe(INITIAL_WEALTH);
  });

  it('aggregates spend by category', () => {
    expect(
      getCategorySpend([
        { productId: 'private-jet', count: 2 },
        { productId: 'space-program', count: 1 },
        { productId: 'schools', count: 3 },
      ]),
    ).toEqual({
      luxury: 150_000_000,
      power: 10_000_000_000,
      world: 3_000_000_000,
      viral: 0,
    });
  });

  it('prioritizes the Golden Toilet identity override', () => {
    expect(
      calculateBillionaireStyle([
        { productId: 'golden-toilet', count: 1 },
        { productId: 'space-program', count: 5 },
      ]),
    ).toBe('chaos');
  });

  it('selects identities by category spend and uses visionary for ties or viral dominance', () => {
    expect(
      calculateBillionaireStyle([{ productId: 'luxury-mansion', count: 2 }]),
    ).toBe('luxury');
    expect(
      calculateBillionaireStyle([{ productId: 'space-program', count: 1 }]),
    ).toBe('empire');
    expect(
      calculateBillionaireStyle([{ productId: 'hospitals', count: 2 }]),
    ).toBe('world-changer');
    expect(
      calculateBillionaireStyle([{ productId: 'moon-crater', count: 1 }]),
    ).toBe('visionary');
    expect(
      calculateBillionaireStyle([
        { productId: 'skyscraper', count: 1 },
        { productId: 'schools', count: 1 },
      ]),
    ).toBe('visionary');
    expect(calculateBillionaireStyle([])).toBe('visionary');
  });

  it('formats dollar values and assigns low-cardinality analytics buckets', () => {
    expect(formatFullUsd(1_000_000, 'en')).toContain('1,000,000');
    expect(formatFullUsd(1_000_000, 'zh')).toContain('1,000,000');
    expect(formatCompactUsd(10_000_000_000, 'en')).toMatch(/10B/i);
    expect(getSpentBucket(0)).toBe('0');
    expect(getSpentBucket(999_999_999)).toBe('under_1b');
    expect(getSpentBucket(10_000_000_000)).toBe('10b_to_50b');
    expect(getSpentBucket(75_000_000_000)).toBe('50b_plus');
  });
});
