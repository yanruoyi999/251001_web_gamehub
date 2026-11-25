import { expect, test } from './fixtures';

const path = '/games/gaming-era-quiz';
const started = 'game_era_quiz_started';
const completed = 'game_era_quiz_completed';

test('guide entry, language changes and replays count only deliberate rounds', async ({
  page,
  request,
}) => {
  const events: string[] = [];
  await page.exposeFunction('captureEraEvent', (name: string) =>
    events.push(name)
  );
  await page.addInitScript(() => {
    const w = window as typeof window & {
      clarity?: (command: string, name: string) => void;
      captureEraEvent(name: string): Promise<void>;
    };
    w.clarity = (command, name) => {
      if (
        command === 'event' && typeof name === 'string' &&
        (name.startsWith('game_era_quiz_') || name === 'guide_intent_click')
      )
        void w.captureEraEvent(name);
    };
  });
  const button = (name: string) =>
    page.getByRole('button', { name, exact: true });
  await page.goto('/en/guides/quick-play-guide');
  await page
    .locator('a[data-guide-intent-action="open_gaming_era_quiz"]')
    .click();
  await expect(page).toHaveURL(new RegExp('/en' + path + '$'));
  await expect(page.locator('meta[name=robots]')).toHaveAttribute(
    'content',
    'noindex, follow'
  );
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
    'href',
    new RegExp('/en' + path + '$')
  );
  await expect(page.getByText(/never estimates your real age/)).toBeVisible();
  await expect(button('Start quiz')).toBeEnabled();
  await expect.poll(() => events).toEqual(['guide_intent_click']);
  await button('Start quiz').click();
  await button('One more credit to beat the local high score').click();
  await page.goto(path);
  await expect(
    page.getByRole('heading', { name: '一位朋友想加入，你把什么递给对方？' })
  ).toBeVisible();
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
    'href',
    new RegExp('(?<!/en)' + path + '$')
  );
  await expect(page.locator('meta[name=robots]')).toHaveAttribute(
    'content',
    'noindex, follow'
  );
  for (const name of [
    '排下一局用的代币',
    '翻开折角的攻略，找手绘地图',
    '圈出通关地图，夹进游戏盒',
  ])
    await button(name).click();
  await expect.poll(() => events).toEqual(['guide_intent_click', started]);
  await button('几座城市的队友同步开一场合作挑战').click();
  await expect(
    page.getByRole('heading', { name: '街机厅 + 客厅主机' })
  ).toBeVisible();
  await page.reload();
  await expect(button('再玩一局')).toBeVisible();
  await expect
    .poll(() => events)
    .toEqual(['guide_intent_click', started, completed]);
  await button('再玩一局').click();
  for (const name of [
    '进好友房，看看今晚还有谁在线',
    '能直接加入的房间码',
    '请联机队友标出下一个目标',
    '把全队逆转的十秒剪给朋友',
    '几座城市的队友同步开一场合作挑战',
  ])
    await button(name).click();
  await expect(
    page.getByRole('heading', { name: '在线联机', exact: true })
  ).toBeVisible();
  await expect
    .poll(() => events)
    .toEqual(['guide_intent_click', started, completed, started, completed]);
  const xml = await request.get('/sitemap.xml');
  expect(xml.ok()).toBeTruthy();
  expect(await xml.text()).not.toContain(path);
});
