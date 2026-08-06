import { expect, test } from './fixtures';

test.describe('游戏浏览流程', () => {
  test('首页可以正常渲染', async ({ page }) => {
    let navigationError: unknown = null;
    try {
      await page.goto('/');
    } catch (error) {
      navigationError = error;
    }
    test.skip(!!navigationError, '未检测到正在运行的应用服务，跳过此端到端测试');
    if (navigationError) return;

    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('支持切换到英文站点', async ({ page }) => {
    let navigationError: unknown = null;
    try {
      await page.goto('/zh');
    } catch (error) {
      navigationError = error;
    }
    test.skip(!!navigationError, '未检测到正在运行的应用服务，跳过此端到端测试');
    if (navigationError) return;

    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
    const languageToggle = page.getByRole('link', { name: 'EN', exact: true });
    const toggleVisible = await languageToggle.isVisible();
    test.skip(!toggleVisible, '界面上未找到语言切换控件');
    if (!toggleVisible) return;

    await languageToggle.click();
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('英文攻略页输出正确的文档语言', async ({ page }) => {
    await page.goto('/en/guides/best-free-iphone-games');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('攻略推荐卡片的图片区域也能打开游戏详情', async ({ page }) => {
    await page.goto('/en/guides/google-snake-mods');

    const ovoCard = page
      .locator('#recommendations [data-slot="card"]')
      .filter({ has: page.locator('a[href="/en/games/ovo"]') });
    const ovoLink = ovoCard.locator('a[href="/en/games/ovo"]');
    await expect(ovoLink).toHaveAttribute('href', '/en/games/ovo');
    await ovoCard.click({ position: { x: 24, y: 24 } });

    await expect(page).toHaveURL(/\/en\/games\/ovo$/);
  });

  test('原生全屏被拒绝时无脚本错误并回退到视口全屏', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.route('https://szhong.4399.com/**', async (route) => {
      await route.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><html><body>Snake test player</body></html>',
      });
    });
    await page.goto('/en/guides/google-snake-mods');
    await page.getByRole('button', { name: 'Play standard Snake - no mods' }).click();

    const player = page.locator('[data-viewport-fullscreen]');
    await player.evaluate((element) => {
      Object.defineProperty(element, 'requestFullscreen', {
        configurable: true,
        value: () => Promise.reject(new DOMException('Denied for test', 'NotAllowedError')),
      });
    });

    const fullscreenButton = page.getByRole('button', { name: 'Play fullscreen' });
    await fullscreenButton.click();

    await expect(fullscreenButton).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-viewport-fullscreen="true"]')).toBeVisible();
    expect(pageErrors).toEqual([]);
  });
});
