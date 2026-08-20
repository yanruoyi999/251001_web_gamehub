import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const sortingModuleUrl = new URL('../lib/games/sorting-games.ts', import.meta.url);
const sortingModulePath = fileURLToPath(sortingModuleUrl);
const sortingPlayerUrl = new URL('../components/game/sorting-games-player.tsx', import.meta.url);
const sortingPlayerPath = fileURLToPath(sortingPlayerUrl);
const sortingPageUrl = new URL('../app/[locale]/games/sorting-games/page.tsx', import.meta.url);
const sortingPagePath = fileURLToPath(sortingPageUrl);
const sortingModuleImportPath = '../lib/games/sorting-games';

async function loadSortingModule() {
  return await import(sortingModuleImportPath);
}

describe('original sorting games hub', () => {
  it('provides a dedicated pure sorting model before page wiring', () => {
    expect(existsSync(sortingModulePath)).toBe(true);
  });

  it('defines one hub and exactly three Luma-original sorting games', async () => {
    const subject = await loadSortingModule() as Record<string, unknown>;

    expect(subject.SORTING_GAMES_PATH).toBe('/games/sorting-games');
    expect(Array.isArray(subject.SORTING_GAMES)).toBe(true);

    const games = subject.SORTING_GAMES as Array<Record<string, unknown>>;
    expect(games.map((game) => game.slug)).toEqual([
      'color-stack-sort',
      'number-order-sprint',
      'shape-shelf-sort',
    ]);
    expect(games.every((game) => game.creator === 'Luma Game Hub')).toBe(true);
    expect(JSON.stringify(games)).not.toMatch(/https?:\/\/|iframe|licenseUrl|sourceUrl|upstream/i);
  });

  it('normalizes sorting challenge codes without carrying gameplay state', async () => {
    const subject = await loadSortingModule() as Record<string, unknown>;
    expect(typeof subject.normalizeSortingChallengeCode).toBe('function');

    const normalize = subject.normalizeSortingChallengeCode as (value?: string | null) => string;
    expect(normalize(' so-rt 88 ')).toBe('SORT88');
    expect(normalize('')).toMatch(/^[A-Z2-9]{6}$/);
  });

  it('builds deterministic number and color challenges from the same code', async () => {
    const subject = await loadSortingModule() as Record<string, unknown>;
    const buildNumbers = subject.buildNumberSprint as (code: string) => number[];
    const buildColors = subject.buildColorStackPuzzle as (code: string) => string[][];

    expect(typeof buildNumbers).toBe('function');
    expect(typeof buildColors).toBe('function');

    const firstNumbers = buildNumbers('SORT88');
    const repeatedNumbers = buildNumbers('SORT88');
    const differentNumbers = buildNumbers('COLOR9');
    expect(firstNumbers).toEqual(repeatedNumbers);
    expect(firstNumbers).not.toEqual(differentNumbers);
    expect(new Set(firstNumbers).size).toBe(firstNumbers.length);

    const firstColors = buildColors('SORT88');
    const repeatedColors = buildColors('SORT88');
    const differentColors = buildColors('COLOR9');
    expect(firstColors).toEqual(repeatedColors);
    expect(firstColors).not.toEqual(differentColors);
  });

  it('keeps the player local-only, original, and shareable only by challenge code', () => {
    expect(existsSync(sortingPlayerPath)).toBe(true);
    const source = readFileSync(sortingPlayerPath, 'utf8');

    expect(source).toContain("'use client'");
    expect(source).toContain('color-stack-sort');
    expect(source).toContain('number-order-sprint');
    expect(source).toContain('shape-shelf-sort');
    expect(source).toContain("trackInteraction('sorting_collection_view'");
    expect(source).toContain("trackInteraction('sorting_game_switch'");
    expect(source).toContain("trackInteraction('sorting_game_start'");
    expect(source).toContain("trackInteraction('sorting_game_complete'");
    expect(source).toContain("trackInteraction('sorting_challenge_share'");
    expect(source).toContain("searchParams.set('challenge'");
    expect(source).toContain('navigator.clipboard');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain('data-sorting-game');
    expect(source).toContain('data-number-tile');
    expect(source).toContain('data-color-stack');
    expect(source).toContain('data-shape-card');
    expect(source).not.toContain('fetch(');
    expect(source).not.toContain('localStorage');
    expect(source).not.toMatch(/https?:\/\//);
    expect(source).not.toMatch(/searchParams\.set\(['"](?:answer|score|move|tile|time|player)/i);
  });

  it('publishes one indexable sorting hub with original-game schemas and focused keyword intent', () => {
    expect(existsSync(sortingPagePath)).toBe(true);
    const source = readFileSync(sortingPagePath, 'utf8');

    expect(source).toContain('Sorting Games Online');
    expect(source).toContain('sorting games');
    expect(source).toContain('sort games');
    expect(source).toContain('sorting games online');
    expect(source).toContain('color sorting game');
    expect(source).toContain('number sorting game');
    expect(source).toContain('Luma Original');
    expect(source).toContain('SortingGamesPlayer');
    expect(source).toContain("'CollectionPage'");
    expect(source).toContain("'ItemList'");
    expect(source).toContain("'VideoGame'");
    expect(source).toContain("'FAQPage'");
    expect(source).toContain("'BreadcrumbList'");
    expect(source).toContain("'x-default'");
    expect(source).toContain('index: true');
    expect(source).toContain('follow: true');
    expect(source).toContain("getLocalizedPath(locale, '/games')");
    expect(source).toContain("'/games/online-games-for-couples'");
    expect(source).toContain("'/games/2-player-unblocked'");
    expect(source).not.toMatch(/water sort puzzle|ball sort puzzle|sort it 3d|happy glass/i);

    const playerIndex = source.indexOf('<SortingGamesPlayer');
    const guideIndex = source.indexOf('data-sorting-guide-content');
    expect(playerIndex).toBeGreaterThan(0);
    expect(guideIndex).toBeGreaterThan(playerIndex);
  });
});