import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

async function stubSuggestions(page: Page, delay = 0) {
  await page.route('**/api/search?**', async route => {
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
    await route.fulfill({ json: { games: [{ id: 42, title: '贪吃蛇', titleEn: 'Google Snake', slug: 'google-snake' }] } });
  });
}
const menuToggle = (page: Page) => page.locator('#mobile-navigation-toggle');
const openMenu = (page: Page) => page.locator('label[for="mobile-navigation-toggle"]').filter({ hasText: /Open navigation menu|打开导航菜单/ });

test('complementary navigation at the phone, tablet and desktop boundaries', async ({ page }) => {
  for (const locale of ['en', 'zh']) {
    await page.goto(locale === 'en' ? '/en' : '/', { waitUntil: 'domcontentloaded' });
    for (const width of [320, 390, 767, 768, 820, 1023, 1024, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      const primary = page.locator('header nav').first();
      if (width < 1024) {
        await expect(primary).toBeHidden();
        await expect(openMenu(page)).toBeVisible();
        const box = await openMenu(page).boundingBox();
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
        await menuToggle(page).focus();
        await page.keyboard.press('Space');
        await expect(page.locator('#mobile-navigation')).toBeVisible();
        await expect(page.locator('#mobile-navigation input[type="search"]')).toBeVisible();
        await expect(page.locator('#mobile-navigation nav a')).toHaveCount(4);
        await expect(page.locator('#mobile-navigation').getByRole('link', { name: locale === 'en' ? '中文' : 'EN', exact: true })).toBeVisible();
        await menuToggle(page).focus();
        await page.keyboard.press('Space');
        await expect(page.locator('#mobile-navigation')).toBeHidden();
      } else {
        await expect(primary).toBeVisible();
        await expect(openMenu(page)).toBeHidden();
        await expect(page.locator('[data-site-search="header"] input')).toBeVisible();
      }
      const theme = page.locator('header button[aria-label^="Switch to"]:visible');
      await expect(theme).toHaveCount(1);
      const themeBox = await theme.boundingBox();
      expect(themeBox!.width).toBeGreaterThanOrEqual(44);
      expect(themeBox!.height).toBeGreaterThanOrEqual(44);
      await expect(page.locator(`header a[href="${locale === 'en' ? '/en' : ''}/games/saved"]:visible`)).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
    await page.setViewportSize({ width: 820, height: 1000 });
    await openMenu(page).click();
    await page.locator('#mobile-navigation nav a').nth(1).click();
    await expect(page).toHaveURL(locale === 'en' ? /\/en\/games$/ : /\/games$/);
    await expect(menuToggle(page)).not.toBeChecked();
  }
});

test('Tab, Shift+Tab and Escape preserve the native search suggestion focus', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await stubSuggestions(page);
  await page.goto('/en', { waitUntil: 'domcontentloaded' });
  const search = page.locator('[data-site-search="header"]');
  const input = search.locator('input');
  await input.fill('snake');
  const option = search.getByRole('button', { name: 'Google Snake', exact: true });
  await expect(option).toBeVisible();
  await input.press('Tab');
  await expect(option).toBeFocused();
  await page.waitForTimeout(1100);
  await expect(option).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(input).toBeFocused();
  await input.press('Tab');
  await page.keyboard.press('Escape');
  await expect(input).toBeFocused();
  await expect(option).toHaveCount(0);
  await page.waitForTimeout(250);
  await expect(option).toHaveCount(0);
  await input.fill('snak');
  await expect(option).toBeVisible();
  await page.locator('h1').click();
  await expect(option).toHaveCount(0);
});

for (const key of ['Enter', 'Space']) {
  test(`native suggestion ${key} navigates once after a pause`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await stubSuggestions(page);
    await page.goto('/en', { waitUntil: 'domcontentloaded' });
    const input = page.locator('[data-site-search="header"] input');
    await input.fill('snake');
    const option = page.getByRole('button', { name: 'Google Snake', exact: true });
    await expect(option).toBeVisible();
    await input.press('Tab');
    await page.waitForTimeout(1100);
    await expect(option).toBeFocused();
    const navigations: string[] = [];
    page.on('framenavigated', frame => { if (frame === page.mainFrame() && /\/en\/games\/google-snake$/.test(frame.url())) navigations.push(frame.url()); });
    await page.keyboard.press(key);
    await expect(page).toHaveURL(/\/en\/games\/google-snake$/);
    expect(navigations).toHaveLength(1);
  });
}

test('slow suggestions do not reopen after focus leaves; IME does not submit early', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await stubSuggestions(page, 600);
  await page.goto('/en', { waitUntil: 'domcontentloaded' });
  const search = page.locator('[data-site-search="header"]');
  const input = search.locator('input');
  const response = page.waitForResponse('**/api/search?**');
  await input.fill('snake');
  await page.locator('h1').click();
  await response;
  await expect(search.locator('ul')).toHaveCount(0);
  await input.focus();
  await input.dispatchEvent('compositionstart', { data: '贪' });
  await input.fill('贪吃蛇');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/en$/);
  await input.dispatchEvent('compositionend', { data: '贪吃蛇' });
  await input.press('Enter');
  await expect(page).toHaveURL(/\/en\/search\?q=/);
  expect(new URL(page.url()).searchParams.get('q')).toBe('贪吃蛇');
});

test('pointer suggestion selection and empty enhanced submit remain usable', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await stubSuggestions(page);
  await page.goto('/en', { waitUntil: 'domcontentloaded' });
  await openMenu(page).click();
  const input = page.locator('#mobile-navigation input');
  await input.fill('   ');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/en$/);
  await input.fill('snake');
  const option = page.getByRole('button', { name: 'Google Snake', exact: true });
  await expect(option).toBeVisible();
  if (info.project.use.hasTouch) await option.tap(); else await option.click();
  await expect(page).toHaveURL(/\/en\/games\/google-snake$/);
});

test.describe('native GET without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  for (const locale of ['en', 'zh']) test(`${locale} search passes UTF-8 q on the original route`, async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1000 });
    await page.goto(locale === 'en' ? '/en' : '/', { waitUntil: 'domcontentloaded' });
    await openMenu(page).click();
    const input = page.locator('#mobile-navigation input');
    await expect(input).toHaveAccessibleName(locale === 'en' ? 'Search games' : '搜索游戏');
    await input.fill(' 贪吃蛇 & snake ');
    await page.locator('#mobile-navigation button[type="submit"]').click();
    expect(new URL(page.url()).pathname).toBe(locale === 'en' ? '/en/search' : '/search');
    expect(new URL(page.url()).searchParams.get('q')).toBe(' 贪吃蛇 & snake ');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});

test('submit icon uses the input foreground in compact and desktop search', async ({ page }) => {
  await page.goto('/en', { waitUntil: 'domcontentloaded' });
  for (const width of [820, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    if (width < 1024) await openMenu(page).click();
    const search = page.locator('[data-site-search]:visible');
    const foreground = await search.locator('input').evaluate(element => getComputedStyle(element).color);
    await expect(search.locator('button[type="submit"]')).toHaveCSS('color', foreground);
  }
});
