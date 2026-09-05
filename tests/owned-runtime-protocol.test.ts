import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';

const session = '12345678-1234-4321-8765-123456789abc';
const origin = 'https://luma-test.example';
function loadRuntime(slug: string) {
  const listeners = new Map<string, Array<(event: any) => void>>();
  const messages: Array<{ data: any; origin: string }> = [];
  const element = () => ({ style: {}, hidden: false, textContent: '', dataset: {}, focus() {}, setAttribute() {}, replaceChildren() {}, append() {} });
  const parent = { postMessage: (data: unknown, target: string) => messages.push({ data, origin: target }) };
  const window = { parent, location: { origin }, addEventListener: (name: string, listener: (event: any) => void) => listeners.set(name, [...(listeners.get(name) ?? []), listener]) };
  const context = vm.createContext({ window, document: { getElementById: element, createElement: element }, performance: { now: () => 0 }, requestAnimationFrame() {} });
  vm.runInContext(readFileSync(`public/games-runtime/${slug}/game.js`, 'utf8'), context);
  return { parent, messages, send: (name: string, event: any) => listeners.get(name)?.forEach(listener => listener(event)) };
}

describe.each(['classic-pong-duel', 'grid-claim-duel', 'key-sprint-duel'])('%s protocol', slug => {
  it('waits for the exact parent challenge, rejects spoofing, and reports one trusted effective input', () => {
    const runtime = loadRuntime(slug);
    expect(runtime.messages).toHaveLength(0);
    const challenge = { source: runtime.parent, origin, data: { type: 'luma-parent-ready', gameSlug: slug, session } };
    runtime.send('message', { ...challenge, source: {} });
    runtime.send('message', { ...challenge, origin: 'https://other.example' });
    runtime.send('message', { ...challenge, data: { ...challenge.data, session: '' } });
    expect(runtime.messages).toHaveLength(0);
    runtime.send('message', challenge);
    expect(runtime.messages[0]).toMatchObject({ origin, data: { type: 'luma-game-ready', gameSlug: slug, session } });
    const key = (code: string, trusted: boolean) => runtime.send('keydown', { code, isTrusted: trusted, repeat: false, preventDefault() {} });
    key('Enter', true);
    key('KeyZ', true);
    expect(runtime.messages.filter(m => m.data.type === 'luma-game-input')).toHaveLength(0);
    const codes = slug === 'classic-pong-duel' ? ['KeyW', 'KeyS'] : slug === 'grid-claim-duel' ? ['KeyW', 'KeyS'] : ['KeyA', 'KeyD'];
    key(codes[0], false);
    expect(runtime.messages.filter(m => m.data.type === 'luma-game-input')).toHaveLength(0);
    key(codes[1], true);
    key(codes[0], true);
    expect(runtime.messages.filter(m => m.data.type === 'luma-game-input')).toHaveLength(1);
    runtime.send('message', { ...challenge, data: { ...challenge.data, session: 'different-valid-session' } });
    expect(runtime.messages.every(m => m.data.session === session)).toBe(true);
  });
});
