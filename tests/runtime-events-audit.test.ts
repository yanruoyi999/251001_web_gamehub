import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseTrustedRuntimeMessage } from '@/lib/analytics/runtime-message';

const frame = {};
const session = '12345678-1234-4321-8765-123456789abc';
const valid = { source: frame, origin: 'null', data: { type: 'luma-game-ready', gameSlug: 'classic-pong-duel', session } };
describe('owned runtime event evidence', () => {
  it.each(['luma-game-ready', 'luma-game-input', 'luma-game-error'])('accepts %s only from the current opaque frame session', (type) => {
    expect(parseTrustedRuntimeMessage({ ...valid, data: { ...valid.data, type } }, frame, 'classic-pong-duel', session)?.type).toBe(type);
  });
  it.each([
    { ...valid, source: {} }, { ...valid, origin: 'https://example.test' },
    { ...valid, data: null }, { ...valid, data: [] },
    { ...valid, data: { ...valid.data, session: 'previous-session' } },
    { ...valid, data: { ...valid.data, gameSlug: 'different-game' } },
    { ...valid, data: { ...valid.data, type: 'anything' } },
  ])('rejects forged, stale or malformed messages', (message) => {
    expect(parseTrustedRuntimeMessage(message, frame, 'classic-pong-duel', session)).toBeNull();
  });
  it('does not accept a detached iframe as a source', () => {
    expect(parseTrustedRuntimeMessage({ ...valid, source: null }, null, 'classic-pong-duel', session)).toBeNull();
  });
  it('never equates a third-party click or load with verified play', () => {
    const source = readFileSync('components/game/game-player-facade.tsx', 'utf8');
    expect(source).toContain("'game_start_attempt'");
    expect(source).toContain("'game_iframe_load'");
    expect(source).not.toContain("trackInteraction('game_play_start'");
    expect(source).not.toContain("trackInteraction('game_load_success'");
  });
});
