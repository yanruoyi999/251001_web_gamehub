import { expect, test } from './fixtures';
import {
  createDailySolitaireDeal, canMoveToFoundation, moveWasteToFoundation,
  moveTableauToFoundation, drawFromSolitaireStock, getSolitaireCardLabel,
  type DailySolitaireGameState,
} from '../../lib/games/daily-solitaire';
import type { Page } from '@playwright/test';

const SUITS = { spades: 'Spades', hearts: 'Hearts', diamonds: 'Diamonds', clubs: 'Clubs' };
const FIXED_TIME = new Date('2026-09-05T04:00:00.000Z');

async function captureEvents(page: Page) {
  await page.addInitScript(() => {
    const testWindow = window as typeof window & { auditEvents: string[]; clarity: (...args: string[]) => void };
    testWindow.auditEvents = [];
    testWindow.clarity = (command, event) => { if (command === 'event' && typeof event === 'string') testWindow.auditEvents.push(event); };
  });
}

async function completeSolitaire(page: Page, count: 1 | 3) {
  let state: DailySolitaireGameState = createDailySolitaireDeal('2026-09-05');
  let lastCardLabel = '';
  let lastSuit = 'Spades';
  for (let step = 0; step < 300 && !state.completed; step += 1) {
    const waste = state.waste.at(-1);
    if (waste && canMoveToFoundation(waste, state.foundations[waste.suit])) {
      await page.getByRole('button', { name: `Select ${getSolitaireCardLabel(waste)} from waste`, exact: true }).click();
      await page.getByRole('button', { name: `${SUITS[waste.suit]} foundation`, exact: true }).click();
      state = moveWasteToFoundation(state, waste.suit)!;
      continue;
    }
    const from = state.tableau.findIndex(pile => {
      const top = pile.at(-1);
      return top && canMoveToFoundation(top, state.foundations[top.suit]);
    });
    if (from >= 0) {
      const card = state.tableau[from].at(-1)!;
      lastCardLabel = getSolitaireCardLabel(card);
      lastSuit = SUITS[card.suit];
      await page.getByRole('button', { name: lastCardLabel, exact: true }).click();
      await page.getByRole('button', { name: `${lastSuit} foundation`, exact: true }).click();
      state = moveTableauToFoundation(state, from, card.suit)!;
    } else {
      await page.getByRole('button', { name: 'Draw', exact: true }).click();
      state = drawFromSolitaireStock(state, count);
    }
  }
  expect(state.completed).toBe(true);
  return { lastCardLabel, lastSuit };
}

test.describe('audit regression journeys', () => {
  for (const count of [1, 3] as const) {
    test(`Draw ${count}: complete, freeze clock, undo, redo and replay without duplicating streak`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.clock.install({ time: FIXED_TIME });
      await captureEvents(page);
      await page.addInitScript(() => {
        localStorage.setItem('luma-daily-solitaire:2026-09-05', JSON.stringify({ best: 999, streak: 99 }));
        localStorage.setItem('luma-daily-solitaire:progress:v1', JSON.stringify({ version: 1, completedDates: ['2026-09-04'] }));
      });
      await page.goto('/en/games/daily-solitaire');
      const game = page.locator('[data-daily-solitaire]');
      await expect(game).toHaveAttribute('data-interactive-ready', 'true');
      await expect(page.getByRole('textbox', { name: 'Challenge date' }).or(page.locator('input[type=date]'))).toHaveValue('2026-09-05');
      await page.getByRole('button', { name: `Draw ${count}`, exact: true }).first().click();
      await page.getByRole('button', { name: 'Play today’s deal', exact: true }).click();
      const last = await completeSolitaire(page, count);
      await expect(game).toHaveAttribute('data-completed', 'true');
      const score = game.getByText('Score', { exact: true }).locator('..');
      const time = game.getByText('Time', { exact: true }).locator('..');
      const before = [await score.innerText(), await time.innerText()];
      await page.clock.fastForward(5000);
      expect([await score.innerText(), await time.innerText()]).toEqual(before);
      await expect(game.locator('footer')).toContainText('Local best: 999');
      await expect(game.getByText('Daily streak', { exact: true }).locator('..')).toContainText('2');
      await page.getByRole('button', { name: 'Undo', exact: true }).click();
      await expect(game).toHaveAttribute('data-completed', 'false');
      await page.clock.fastForward(1500);
      await page.getByRole('button', { name: last.lastCardLabel, exact: true }).click();
      await page.getByRole('button', { name: `${last.lastSuit} foundation`, exact: true }).click();
      await expect(game).toHaveAttribute('data-completed', 'true');
      const finished = await page.evaluate(() => (window as typeof window & { auditEvents: string[] }).auditEvents.filter(name => name === 'daily_solitaire_finished').length);
      expect(finished).toBe(1);
      await page.getByRole('button', { name: 'Replay this deal', exact: true }).click();
      await expect(game).toHaveAttribute('data-completed', 'false');
      await expect(time).toContainText('0:00');
      await expect(game.locator('footer')).toContainText('Local best: 999');
      const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('luma-daily-solitaire:progress:v1')!));
      expect(progress.completedDates).toEqual(['2026-09-04', '2026-09-05']);
    });
  }

  test('solitaire remains interactive when persistent storage is blocked', async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error('Storage disabled for test'); };
      Storage.prototype.setItem = () => { throw new Error('Storage disabled for test'); };
    });
    await page.goto('/en/games/daily-solitaire');
    await page.getByRole('button', { name: 'Play today’s deal', exact: true }).click();
    await page.getByRole('button', { name: 'Draw', exact: true }).click();
    await expect(page.getByRole('button', { name: /Select .* from waste/ })).toBeVisible();
  });

  test('stacker draws both axes, stacks upwards and ignores keyboard repeats', async ({ page }) => {
    await page.clock.install({ time: FIXED_TIME });
    await page.goto('/en/games/stacker-game?smoke=42');
    const game = page.locator('[data-stacker-game]');
    await expect(game).toHaveAttribute('data-smoke-mode', 'true');
    await page.clock.pauseAt(new Date(FIXED_TIME.getTime() + 30_000));
    await page.getByRole('button', { name: 'Start run', exact: true }).click();
    await game.focus();
    await page.keyboard.press('Space');
    await expect(game).toHaveAttribute('data-height', '1');
    await game.dispatchEvent('keydown', { code: 'Space', repeat: true });
    await expect(game).toHaveAttribute('data-height', '1');
    await page.clock.runFor(1830);
    await page.keyboard.press('Enter');
    await expect(game).toHaveAttribute('data-height', '2');
    await expect(game).toHaveAttribute('data-ended', 'false');
  });

  test('stacker wall clock survives a long frame and excludes hidden time', async ({ page }) => {
    await page.clock.install({ time: FIXED_TIME });
    await page.goto('/en/games/stacker-game');
    const game = page.locator('[data-stacker-game]');
    await page.getByRole('button', { name: '60s Sprint', exact: true }).click();
    await page.clock.pauseAt(new Date(FIXED_TIME.getTime() + 30_000));
    await page.getByRole('button', { name: 'Start run', exact: true }).click();
    await page.clock.fastForward(20_000);
    await expect(game.getByText('Time', { exact: true }).locator('..')).toContainText('40s');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(game).toHaveAttribute('data-paused', 'true');
    await page.clock.fastForward(90_000);
    await expect(game).toHaveAttribute('data-ended', 'false');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(game).toHaveAttribute('data-paused', 'false');
    await page.clock.fastForward(40_100);
    await expect(game).toHaveAttribute('data-ended', 'true');
    await expect(game).toContainText('Sprint complete');
  });

  test('owned runtime rejects forged messages and records play only after valid input', async ({ page }) => {
    await captureEvents(page);
    await page.goto('/en/games/2-player-unblocked');
    await page.locator('[data-two-player-start]').click();
    const shell = page.locator('[data-two-player-shell]');
    await expect(shell).toHaveAttribute('data-load-state', 'ready');
    await expect(shell).toHaveAttribute('data-play-verified', 'false');
    await page.evaluate(() => window.postMessage({ type: 'luma-game-input', gameSlug: 'classic-pong-duel', session: 'forged-session-0000' }, '*'));
    const frame = page.frameLocator('iframe[data-two-player-runtime]');
    await frame.locator('#board').evaluate(() => parent.postMessage({ type: 'luma-game-input', gameSlug: 'classic-pong-duel', session: 'forged-session-0000' }, '*'));
    await expect(shell).toHaveAttribute('data-play-verified', 'false');
    await frame.locator('#board').click();
    await page.keyboard.press('Enter');
    await expect(shell).toHaveAttribute('data-play-verified', 'false');
    await page.keyboard.press('w');
    await expect(shell).toHaveAttribute('data-play-verified', 'true');
    await page.keyboard.press('s');
    expect(await page.evaluate(() => (window as typeof window & { auditEvents: string[] }).auditEvents.filter(name => name === 'game_play_start').length)).toBe(1);
    await page.locator('[data-two-player-start]').click();
    await expect(shell).toHaveAttribute('data-load-state', 'ready');
    await expect(shell).toHaveAttribute('data-play-verified', 'false');
  });

  test('localized HTML is correct without JavaScript and retains experimental noindex', async ({ request, browser, baseURL }) => {
    for (const [url, locale] of [['/en', 'en'], ['/en/games', 'en'], ['/en/games/stacker-game', 'en'], ['/games/stacker-game', 'zh']]) {
      const response = await request.get(url);
      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toMatch(new RegExp(`<html[^>]*lang="${locale}"[^>]*data-locale="${locale}"`));
      if (url.includes('stacker-game')) expect(html).toMatch(/name="robots"[^>]*content="noindex/);
    }
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto(`${baseURL ?? 'http://localhost:3217'}/en/games/stacker-game`);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Stacker');
    } finally { await context.close(); }
  });
});
