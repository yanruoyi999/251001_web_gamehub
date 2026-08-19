import { expect, test } from '../e2e/fixtures';

const COLLECTION_PATH = '/en/games/2-player-unblocked';

test('production Two-Player flow stays playable with telemetry isolated', async ({
  page,
}) => {
  const response = await page.goto(COLLECTION_PATH);
  expect(response?.ok()).toBe(true);

  await expect(
    page.getByRole('heading', { level: 1, name: '2 Player Unblocked Games' }),
  ).toBeVisible();
  await expect(page.locator('iframe[data-two-player-runtime]')).toHaveCount(0);

  await page.locator('[data-two-player-start]').click();
  const pongFrameElement = page.locator(
    'iframe[data-two-player-runtime="classic-pong-duel"]',
  );
  await expect(pongFrameElement).toHaveCount(1);
  await expect(page.locator('iframe[data-two-player-runtime]')).toHaveCount(1);
  await expect(
    page.getByText(
      'Game loaded. Click the game area, then use the keyboard controls.',
    ),
  ).toBeVisible();

  const pongFrame = page.frameLocator(
    'iframe[data-two-player-runtime="classic-pong-duel"]',
  );
  const board = pongFrame.locator('#board');
  const paddleOne = pongFrame.locator('#paddle-one');
  const paddleTwo = pongFrame.locator('#paddle-two');

  await board.click();
  await page.keyboard.press('Enter');
  const beforeOne = await paddleOne.getAttribute('style');
  const beforeTwo = await paddleTwo.getAttribute('style');

  await page.keyboard.down('w');
  await page.keyboard.down('ArrowDown');
  await page.waitForTimeout(250);
  await page.keyboard.up('ArrowDown');
  await page.keyboard.up('w');

  await expect.poll(() => paddleOne.getAttribute('style')).not.toBe(beforeOne);
  await expect.poll(() => paddleTwo.getAttribute('style')).not.toBe(beforeTwo);

  await page.locator('[data-game-selector="key-sprint-duel"]').click();
  await expect(page.locator('iframe[data-two-player-runtime]')).toHaveCount(0);
  await page.locator('[data-two-player-start]').click();
  await expect(
    page.locator('iframe[data-two-player-runtime="key-sprint-duel"]'),
  ).toHaveCount(1);

  const fullscreenButton = page.locator('[data-two-player-fullscreen]');
  await expect(fullscreenButton).toHaveAttribute('aria-pressed', 'false');
  await fullscreenButton.click();
  await expect(fullscreenButton).toHaveAttribute('aria-pressed', 'true');
  await fullscreenButton.click();
  await expect(fullscreenButton).toHaveAttribute('aria-pressed', 'false');
});
