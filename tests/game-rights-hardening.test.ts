import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  canRenderGameIframe,
  shouldIncludeGameInSitemap,
  shouldNoIndexGame,
  shouldPromoteGameInCollections,
} from '@/lib/games/quality-policy';
import { getMockGameBySlug } from '@/lib/mock-games';
import { buildAuditRows, buildDecisionRows } from '@/scripts/audit-game-quality';
import { buildGames, readTsv } from '@/scripts/import-4399-games';

const read = (file: string) =>
  readFileSync(path.join(process.cwd(), file), 'utf8');

describe('game rights hardening regressions', () => {
  it('fails closed unless embed permission is explicitly verified', () => {
    const verified = {
      slug: 'google-snake',
      embedPermissionStatus: 'verified' as const,
    };
    const unverified = [
      { slug: 'google-snake', embedPermissionStatus: 'unknown' as const },
      { slug: 'google-snake', embedPermissionStatus: 'link-only' as const },
      { slug: 'google-snake', embedPermissionStatus: 'blocked' as const },
      { slug: 'google-snake', embedPermissionStatus: 'expired' as const },
      { slug: 'google-snake', embedPermissionStatus: null },
    ];

    expect(canRenderGameIframe(verified)).toBe(true);
    expect(shouldIncludeGameInSitemap(verified)).toBe(true);
    expect(shouldPromoteGameInCollections(verified)).toBe(true);
    expect(shouldNoIndexGame(verified)).toBe(false);

    for (const entry of unverified) {
      expect(canRenderGameIframe(entry)).toBe(false);
      expect(shouldIncludeGameInSitemap(entry)).toBe(false);
      expect(shouldPromoteGameInCollections(entry)).toBe(false);
      expect(shouldNoIndexGame(entry)).toBe(true);
    }

    // A slug allowlist is not evidence of commercial/embed permission.
    expect(canRenderGameIframe('google-snake')).toBe(false);
    expect(shouldIncludeGameInSitemap('google-snake')).toBe(false);
  });

  it('never returns keep for a core game whose embed rights are unverified', () => {
    const rows = buildAuditRows();
    const decisions = buildDecisionRows(rows);
    const googleSnake = decisions.find((row) => row.slug === 'google-snake');

    expect(googleSnake).toBeDefined();
    expect(googleSnake?.decision).toBe('review');
    expect(googleSnake?.reason.toLowerCase()).toContain('permission');
  });

  it('does not manufacture a racing category from catalogue array position', () => {
    const game = getMockGameBySlug('adam-and-eve-5-part-1');

    expect(game).toBeDefined();
    expect(game?.categories.map((category) => category.slug)).not.toContain(
      'racing',
    );
  });

  it('replays the full TSV without known identity mismatches or duplicate slugs', async () => {
    const rows = await readTsv(path.join(process.cwd(), 'game_iframes.tsv'));
    const quarantinedPaths = [
      '4399/blumgi-slime.html',
      '4399/fancy-pants-adventure-world-2.html',
      '4399/truck-loader.html',
      '4399/truck-loader-5.html',
    ];

    for (const sourcePath of quarantinedPaths) {
      expect(rows.some((row) => row.sourcePath === sourcePath)).toBe(false);
    }

    const games = buildGames(rows);
    expect(new Set(games.map((game) => game.slug)).size).toBe(games.length);

    const monkeyMart = games.find((game) => game.slug === 'monkey-mart');
    expect(monkeyMart?.sourcePath).toBe('4399/monkey-mart.html');
    expect(monkeyMart?.iframeUrl).toContain(
      '/ftp41/gamehwq/20221216/09/index.htm',
    );
  });

  it('keeps the quarantined source records commented in the raw TSV', () => {
    const raw = read('game_iframes.tsv');

    expect(raw).toContain(
      '# QUARANTINED identity mismatch: 4399/blumgi-slime.html',
    );
    expect(raw).not.toMatch(/^4399\/blumgi-slime\.html\t/m);
    expect(raw).not.toMatch(/^4399\/truck-loader(?:-5)?\.html\t/m);
  });

  it('keeps remote catalogue rights metadata in the database schema', () => {
    const schema = read('db/schema/games.ts');

    for (const field of [
      'rightsHolder',
      'officialGameUrl',
      'licenseType',
      'licenseUrl',
      'commercialUseAllowed',
      'embedPermissionStatus',
      'adsAllowed',
      'screenshotPermission',
      'thumbnailPermission',
      'verificationEvidence',
      'rightsVerifiedAt',
    ]) {
      expect(schema).toContain(field);
    }
  });

  it('uses verified rights for remote sitemap and public API discovery', () => {
    const sitemap = read('app/sitemap.ts');
    const api = read('app/api/games/route.ts');

    expect(sitemap).toContain("eq(games.embedPermissionStatus, 'verified')");
    expect(api).toContain(
      "embedPermissionStatus: isAdmin ? undefined : 'verified'",
    );
  });

  it('reports iframe-shell rendering separately from real external loading', () => {
    const runtimeAudit = read('scripts/audit-runtime-quality.ts');

    expect(runtimeAudit).toContain('iframeElementVisibleAfterPlay');
    expect(runtimeAudit).toContain('externalFrameLoaded');
    expect(runtimeAudit).toContain('not-verified');
    expect(runtimeAudit).not.toContain("'Playable'");
  });

  it('uses a least-privilege sandbox and exposes a recoverable iframe failure state', () => {
    const player = read('components/game/game-player-facade.tsx');

    expect(player).not.toContain('allow-popups');
    expect(player).toContain('onError=');
    expect(player).toMatch(/retry|重试/i);
  });
});
