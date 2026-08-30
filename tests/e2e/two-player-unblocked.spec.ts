import { expect, test } from './fixtures';

const COLLECTION_PATH = '/en/games/2-player-unblocked';

test.describe('2 Player Unblocked collection', () => {
  test('loads one self-hosted runtime only after Play and unloads it on game switch', async ({ page }) => {
    const response = await page.goto(COLLECTION_PATH);

    expect(response?.ok()).toBe(true);
    await expect(page.getByRole('heading', { level: 1, name: '2 Player Unblocked Games' })).toBeVisible();
    await expect(page.locator('iframe[data-two-player-runtime]')).toHaveCount(0);

    await page.locator('[data-two-player-start]').click();
    const pongFrame = page.locator('iframe[data-two-player-runtime="classic-pong-duel"]');
    await expect(pongFrame).toHaveCount(1);
    await expect(page.locator('iframe[data-two-player-runtime]')).toHaveCount(1);
    await expect(page.getByText('Game loaded. Click the game area, then use the keyboard controls.')).toBeVisible();

    await page.locator('[data-game-selector="key-sprint-duel"]').click();
    await expect(page.locator('iframe[data-two-player-runtime]')).toHaveCount(0);

    await page.locator('[data-two-player-start]').click();
    await expect(page.locator('iframe[data-two-player-runtime="key-sprint-duel"]')).toHaveCount(1);
    await expect(page.locator('iframe[data-two-player-runtime]')).toHaveCount(1);
  });

  test('classic pong accepts both player key sets during the same interval', async ({ page }, testInfo) => {
    await page.goto(COLLECTION_PATH);
    await page.locator('[data-two-player-start]').click();
    await expect(page.getByText('Game loaded. Click the game area, then use the keyboard controls.')).toBeVisible();

    const frame = page.frameLocator('iframe[data-two-player-runtime="classic-pong-duel"]');
    const board = frame.locator('#board');
    const paddleOne = frame.locator('#paddle-one');
    const paddleTwo = frame.locator('#paddle-two');

    await page.evaluate(() => {
      const diagnosticWindow = window as typeof window & {
        __lumaPongKeyEvents?: Array<Record<string, unknown>>;
      };
      diagnosticWindow.__lumaPongKeyEvents = [];
      const record = (event: KeyboardEvent) => {
        diagnosticWindow.__lumaPongKeyEvents?.push({
          type: event.type,
          key: event.key,
          code: event.code,
          repeat: event.repeat,
          target: event.target instanceof HTMLElement
            ? `${event.target.tagName.toLowerCase()}#${event.target.id}`
            : null,
        });
      };
      window.addEventListener('keydown', record, true);
      window.addEventListener('keyup', record, true);
    });
    await frame.locator('html').evaluate(() => {
      const diagnosticWindow = window as typeof window & {
        __lumaPongKeyEvents?: Array<Record<string, unknown>>;
      };
      diagnosticWindow.__lumaPongKeyEvents = [];
      const record = (event: KeyboardEvent) => {
        diagnosticWindow.__lumaPongKeyEvents?.push({
          type: event.type,
          key: event.key,
          code: event.code,
          repeat: event.repeat,
          target: event.target instanceof HTMLElement
            ? `${event.target.tagName.toLowerCase()}#${event.target.id}`
            : null,
        });
      };
      window.addEventListener('keydown', record, true);
      window.addEventListener('keyup', record, true);
    });

    const routingDiagnostics: Array<Record<string, unknown>> = [];
    const captureRoutingState = async (stage: string) => {
      const parent = await page.evaluate(() => {
        const diagnosticWindow = window as typeof window & {
          __lumaPongKeyEvents?: Array<Record<string, unknown>>;
        };
        const active = document.activeElement;
        return {
          hasFocus: document.hasFocus(),
          activeElement: active instanceof HTMLElement
            ? `${active.tagName.toLowerCase()}#${active.id}`
            : null,
          events: diagnosticWindow.__lumaPongKeyEvents ?? [],
        };
      });
      const runtime = await frame.locator('html').evaluate(() => {
        const diagnosticWindow = window as typeof window & {
          __lumaPongKeyEvents?: Array<Record<string, unknown>>;
        };
        const active = document.activeElement;
        return {
          hasFocus: document.hasFocus(),
          activeElement: active instanceof HTMLElement
            ? `${active.tagName.toLowerCase()}#${active.id}`
            : null,
          events: diagnosticWindow.__lumaPongKeyEvents ?? [],
          statusHidden: (document.querySelector('#status') as HTMLElement | null)?.hidden ?? null,
          ballStyle: document.querySelector('#ball')?.getAttribute('style') ?? null,
          paddleOneStyle: document.querySelector('#paddle-one')?.getAttribute('style') ?? null,
          paddleTwoStyle: document.querySelector('#paddle-two')?.getAttribute('style') ?? null,
        };
      });
      routingDiagnostics.push({ stage, parent, runtime });
    };

    // Match the real user flow. WebKit only routes subsequent hardware-keyboard
    // input into a sandboxed iframe after a user activation inside that frame.
    await board.click();
    await captureRoutingState('after-board-click');
    await page.keyboard.press('Enter');
    await expect(paddleOne).toHaveAttribute('style', /top:/);
    await expect(paddleTwo).toHaveAttribute('style', /top:/);
    await captureRoutingState('after-enter');

    const beforeOne = await paddleOne.getAttribute('style');
    const beforeTwo = await paddleTwo.getAttribute('style');

    await page.keyboard.down('w');
    await page.keyboard.down('ArrowDown');
    await captureRoutingState('after-movement-keydown');
    await page.waitForTimeout(250);
    await captureRoutingState('after-movement-interval');
    await page.keyboard.up('ArrowDown');
    await page.keyboard.up('w');
    await captureRoutingState('after-movement-keyup');

    await testInfo.attach('pong-keyboard-routing.json', {
      body: Buffer.from(JSON.stringify(routingDiagnostics, null, 2)),
      contentType: 'application/json',
    });

    await expect.poll(() => paddleOne.getAttribute('style')).not.toBe(beforeOne);
    await expect.poll(() => paddleTwo.getAttribute('style')).not.toBe(beforeTwo);
  });

  test('fullscreen control is reversible and mobile limitation is explicit', async ({ page }) => {
    await page.goto(COLLECTION_PATH);

    await expect(
      page.getByText('Browse on mobile; this game requires a physical keyboard'),
    ).toBeVisible();

    const fullscreenButton = page.locator('[data-two-player-fullscreen]');
    await expect(fullscreenButton).toHaveAttribute('aria-pressed', 'false');
    await fullscreenButton.click();
    await expect(fullscreenButton).toHaveAttribute('aria-pressed', 'true');
    await fullscreenButton.click();
    await expect(fullscreenButton).toHaveAttribute('aria-pressed', 'false');
  });
});
