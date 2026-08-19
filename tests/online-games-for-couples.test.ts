import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const couplesModuleUrl = new URL('../lib/games/online-games-for-couples.ts', import.meta.url);
const couplesModulePath = fileURLToPath(couplesModuleUrl);
const couplesPlayerUrl = new URL('../components/game/online-games-for-couples-player.tsx', import.meta.url);
const couplesPlayerPath = fileURLToPath(couplesPlayerUrl);
const couplesPageUrl = new URL('../app/[locale]/games/online-games-for-couples/page.tsx', import.meta.url);
const couplesPagePath = fileURLToPath(couplesPageUrl);

async function loadCouplesModule() {
  return await import('../lib/games/online-games-for-couples');
}

describe('online games for couples', () => {
  it('provides a dedicated pure prompt model before page wiring', () => {
    expect(existsSync(couplesModulePath)).toBe(true);
  });

  it('defines one couples hub and exactly three original interactions', async () => {
    const subject = await loadCouplesModule() as Record<string, unknown>;

    expect(subject.COUPLES_GAMES_PATH).toBe('/games/online-games-for-couples');
    expect(Array.isArray(subject.COUPLE_GAMES)).toBe(true);

    const games = subject.COUPLE_GAMES as Array<{ slug: string; prompts: unknown[] }>;
    expect(games.map((game) => game.slug)).toEqual([
      'this-or-that-duo',
      'couple-match-quiz',
      'quick-couple-challenge',
    ]);
    expect(games.every((game) => game.prompts.length >= 6)).toBe(true);
  });

  it('normalizes challenge codes without carrying answer data', async () => {
    const subject = await loadCouplesModule() as Record<string, unknown>;
    expect(typeof subject.normalizeChallengeCode).toBe('function');

    const normalize = subject.normalizeChallengeCode as (value?: string | null) => string;
    expect(normalize(' ab-12 cd ')).toBe('AB12CD');
    expect(normalize('')).toMatch(/^[A-Z2-9]{6}$/);

    const games = subject.COUPLE_GAMES as Array<Record<string, unknown>>;
    expect(JSON.stringify(games)).not.toMatch(/playerAnswer|partnerAnswer|savedAnswer|userName/i);
  });

  it('uses the challenge code to produce a deterministic shared prompt order', async () => {
    const subject = await loadCouplesModule() as Record<string, unknown>;
    expect(typeof subject.buildCouplePromptOrder).toBe('function');

    const buildOrder = subject.buildCouplePromptOrder as (
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

  it('keeps the interactive couples player local-only and shareable by challenge code', () => {
    expect(existsSync(couplesPlayerPath)).toBe(true);
    const source = readFileSync(couplesPlayerPath, 'utf8');

    expect(source).toContain("'use client'");
    expect(source).toContain('this-or-that-duo');
    expect(source).toContain('couple-match-quiz');
    expect(source).toContain('quick-couple-challenge');
    expect(source).toContain("trackInteraction('couples_collection_view'");
    expect(source).toContain("trackInteraction('couple_game_select'");
    expect(source).toContain("trackInteraction('couple_game_start'");
    expect(source).toContain("trackInteraction('couple_game_complete'");
    expect(source).toContain("trackInteraction('couple_share'");
    expect(source).toContain("searchParams.set('challenge'");
    expect(source).toContain('navigator.clipboard');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain('data-clarity-mask="true"');
    expect(source).not.toMatch(/searchParams\.set\(['"](?:answer|player|partner)/);
    expect(source).not.toContain('localStorage');
    expect(source).not.toContain('fetch(');
  });

  it('publishes one indexable couples hub with the approved keyword cluster and schemas', () => {
    expect(existsSync(couplesPagePath)).toBe(true);
    const source = readFileSync(couplesPagePath, 'utf8');

    expect(source).toContain('Online Games for Couples');
    expect(source).toContain('online games for couples');
    expect(source).toContain('couple games online');
    expect(source).toContain('games for couples online');
    expect(source).toContain('online couples games');
    expect(source).toContain('OnlineGamesForCouplesPlayer');
    expect(source).toContain("'CollectionPage'");
    expect(source).toContain("'ItemList'");
    expect(source).toContain("'FAQPage'");
    expect(source).toContain("'BreadcrumbList'");
    expect(source).toContain("'x-default'");
    expect(source).toContain('index: true');
    expect(source).toContain('follow: true');
    expect(source).toContain('same device');
    expect(source).toContain('long-distance');
    expect(source).toContain('stay only in this tab');

    const playerIndex = source.indexOf('<OnlineGamesForCouplesPlayer');
    const longFormIndex = source.indexOf('data-couples-guide-content');
    expect(playerIndex).toBeGreaterThan(0);
    expect(longFormIndex).toBeGreaterThan(playerIndex);
  });
});