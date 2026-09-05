import { describe, expect, it } from 'vitest';
import { canRenderGameIframe, shouldNoIndexGame, hasVerifiedEmbedPermission } from '@/lib/games/quality-policy';
import { getMockGameBySlug, mockGames } from '@/lib/mock-games';

describe('source provenance gate', () => {
  it('does not accept new unknown sources or a caller-supplied verified flag as evidence', () => {
    for (const status of ['unknown', 'verified'] as const) {
      expect(canRenderGameIframe({ slug: 'new-game', iframeUrl: 'https://example.test/new', embedPermissionStatus: status })).toBe(false);
    }
    expect(hasVerifiedEmbedPermission({ slug: 'new-game', embedPermissionStatus: 'verified' })).toBe(false);
  });
  it('preserves the frozen legacy source but never lets its slug authorize a replacement', () => {
    const game = getMockGameBySlug('google-snake')!;
    expect(canRenderGameIframe(game)).toBe(true);
    expect(canRenderGameIframe({ ...game, iframeUrl: 'https://example.test/replacement' })).toBe(false);
    expect(canRenderGameIframe({ slug: game.slug, embedPermissionStatus: 'unknown' })).toBe(false);
    expect(canRenderGameIframe(game.slug)).toBe(false);
    expect(shouldNoIndexGame({ ...game, iframeUrl: 'https://example.test/replacement' })).toBe(true);
  });
  it('never upgrades existing unknown permissions or overrides an explicit block', () => {
    for (const game of mockGames) {
      expect(game.embedPermissionStatus).toBe('unknown');
      expect(hasVerifiedEmbedPermission(game)).toBe(false);
      expect(canRenderGameIframe({ ...game, embedPermissionStatus: 'blocked' })).toBe(false);
    }
    expect(canRenderGameIframe(getMockGameBySlug('ovo'))).toBe(false);
  });
});
