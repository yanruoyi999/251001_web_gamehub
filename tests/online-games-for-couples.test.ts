import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const couplesModuleUrl = new URL('../lib/games/online-games-for-couples.ts', import.meta.url);
const couplesModulePath = fileURLToPath(couplesModuleUrl);

async function loadCouplesModule() {
  return await import('../lib/games/online-games-for-couples');
}

describe('online games for couples', () => {
  it('provides a dedicated pure prompt model before page wiring', () => {
    expect(existsSync(couplesModulePath)).toBe(true);
  });

  it('defines one couples hub and exactly three original interactions', async () => {
    const module = await loadCouplesModule() as Record<string, unknown>;

    expect(module.COUPLES_GAMES_PATH).toBe('/games/online-games-for-couples');
    expect(Array.isArray(module.COUPLE_GAMES)).toBe(true);

    const games = module.COUPLE_GAMES as Array<{ slug: string; prompts: unknown[] }>;
    expect(games.map((game) => game.slug)).toEqual([
      'this-or-that-duo',
      'couple-match-quiz',
      'quick-couple-challenge',
    ]);
    expect(games.every((game) => game.prompts.length >= 6)).toBe(true);
  });

  it('normalizes challenge codes without carrying answer data', async () => {
    const module = await loadCouplesModule() as Record<string, unknown>;
    expect(typeof module.normalizeChallengeCode).toBe('function');

    const normalize = module.normalizeChallengeCode as (value?: string | null) => string;
    expect(normalize(' ab-12 cd ')).toBe('AB12CD');
    expect(normalize('')).toMatch(/^[A-Z2-9]{6}$/);

    const games = module.COUPLE_GAMES as Array<Record<string, unknown>>;
    expect(JSON.stringify(games)).not.toMatch(/playerAnswer|partnerAnswer|savedAnswer|userName/i);
  });

  it('uses the challenge code to produce a deterministic shared prompt order', async () => {
    const module = await loadCouplesModule() as Record<string, unknown>;
    expect(typeof module.buildCouplePromptOrder).toBe('function');

    const buildOrder = module.buildCouplePromptOrder as (
      gameSlug: string,
      challengeCode: string,
    ) => Array<{ id: string }>;

    const first = buildOrder('this-or-that-duo', 'LUMA22').map((prompt) => prompt.id);
    const repeated = buildOrder('this-or-that-duo', 'LUMA22').map((prompt) => prompt.id);
    const different = buildOrder('this-or-that-duo', 'DATE88').map((prompt) => prompt.id);

    expect(first).toEqual(repeated);
    expect(first).not.toEqual(different);
    expect(new Set(first).size).toBe(first.length);
  });
});
