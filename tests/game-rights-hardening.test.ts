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

const read = (file: string) => readFileSync(path.join(process.cwd(), file), 'utf8');

describe('game rights hardening regressions', () => {
  it('fails closed unless embed permission is explicitly verified', () => {
    const verified = {
      slug: 'google-snake',
      embedPermissionStatus: 'verified' as const,
    };
    const unknown = {
      slug: 'google-snake',
      embedPermissionStatus: 'unknown' as const,
    };
    const missing = {
      slug: 'google-snake',
      embedPermissionStatus: null,
    };

    expect(canRenderGameIframe(verified)).toBe(true);
    expect(shouldIncludeGameInSitemap(verified)).toBe(true);
    expect(shouldPromoteGameInCollections(verified)).toBe(true);
    expect(shouldNoIndexGame(verified)).toBe(false);

    for (const unverified of [unknown, missing]) {
      expect(canRenderGameIframe(unverified)).toBe(false);
      expect(shouldIncludeGameInSitemap(unverified)).toBe(false);
      expect(shouldPromoteGameInCollections(unverified)).toBe(false);
      expect(shouldNoIndexGame(unverified)).toBe(true);
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
    expect(game?.categories.map((category) => category.slug)).not.toContain('racing');
  });

  it('keeps the known bad blumgi-slime source row from regenerating Monkey Mart', () => {
    const lines = read('game_iframes.tsv').split(/\r?\n/);
    const badRow = lines.find((line) => line.startsWith('4399/blumgi-slime.html\t'));

    expect(badRow).not.toMatch(/\tMonkey Mart(?:\s+-|\t)/i);
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
