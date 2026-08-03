import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const componentPath = path.join(
  process.cwd(),
  'components/game/spend-bill-gates-money-game.tsx',
);
const shareSheetPath = path.join(
  process.cwd(),
  'components/game/spend-bill-gates-money-share-sheet.tsx',
);

describe('SpendBillGatesMoneyGame client component', () => {
  it('implements the bilingual mobile-first game contract', () => {
    expect(existsSync(componentPath)).toBe(true);
    if (!existsSync(componentPath)) return;

    const source = readFileSync(componentPath, 'utf8');

    expect(source).toContain("'use client'");
    expect(source).toContain('SpendBillGatesMoneyGame');
    expect(source).toContain('START SPENDING');
    expect(source).toContain('开始花钱');
    expect(source).toContain('sticky top-16 z-40');
    expect(source).toContain('md:grid-cols-3');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain("product.feedback === 'epic'");
    expect(source).toContain("product.feedback === 'legendary'");
    expect(source).toContain('navigator.share');
    expect(source).toContain('navigator.clipboard.writeText');
    expect(source).toContain("trackInteraction('billionaire_game_start'");
    expect(source).toContain("trackInteraction('billionaire_product_buy'");
    expect(source).toContain("trackInteraction('billionaire_game_finish'");
    expect(source).toContain("trackInteraction('billionaire_share_click'");
    expect(source).toContain("trackInteraction('billionaire_game_restart'");
    expect(source).toContain('PLAY AGAIN');
    expect(source).toContain('再玩一次');
  });

  it('provides an accessible bilingual share sheet with local fallbacks', () => {
    expect(existsSync(shareSheetPath)).toBe(true);
    if (!existsSync(shareSheetPath)) return;

    const source = readFileSync(shareSheetPath, 'utf8');

    expect(source).toContain("'use client'");
    expect(source).toContain('SpendBillGatesMoneyShareSheet');
    expect(source).toContain('role="dialog"');
    expect(source).toContain('aria-modal="true"');
    expect(source).toContain('getShareChannels(locale)');
    expect(source).toContain("event.key === 'Escape'");
    expect(source).toContain('previouslyFocusedRef');
    expect(source).toContain('navigator.share');
    expect(source).toContain('navigator.clipboard.writeText');
    expect(source).toContain('MicroMessenger');
    expect(source).toContain("window.open(externalUrl, '_blank', 'noopener,noreferrer')");
    expect(source).toContain('billionaire-share-dialog');
    expect(source).toContain('billionaire-share-close');
    expect(source).toContain('billionaire-share-manual');
    expect(source).toContain('sm:items-center');
    expect(source).toContain('sm:rounded-3xl');
  });
});
