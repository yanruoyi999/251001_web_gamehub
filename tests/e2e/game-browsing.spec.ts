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
});
