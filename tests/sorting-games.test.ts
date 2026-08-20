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

  it('keeps the future player local-only and shareable only by challenge code', () => {
    if (!existsSync(sortingPlayerPath)) return;
    const source = readFileSync(sortingPlayerPath, 'utf8');

    expect(source).not.toContain('fetch(');
    expect(source).not.toContain('localStorage');
    expect(source).not.toMatch(/https?:\/\//);
    expect(source).not.toMatch(/searchParams\.set\(['"](?:answer|score|move|tile|time|player)/i);
  });

  it('keeps the future page free from copied third-party game brands', () => {
    if (!existsSync(sortingPagePath)) return;
    const source = readFileSync(sortingPagePath, 'utf8');
    expect(source).not.toMatch(/water sort puzzle|ball sort puzzle|sort it 3d|happy glass/i);
  });
});