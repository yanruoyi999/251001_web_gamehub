import type { Page } from '@playwright/test';

import { expect, test } from './fixtures';

async function clickLanguageLinkAndExpect({
  page,
  linkName,
  expectedPathname,
  expectedLang,
}: {
  page: Page;
  linkName: string;
  expectedPathname: string;
  expectedLang: string;
}) {
  const sameOriginResponses: Array<{
    url: string;
    status: number;
    resourceType: string;
    location: string | null;
  }> = [];
  const currentOrigin = new URL(page.url()).origin;
  const recordResponse = (
    response: Awaited<ReturnType<Page['waitForResponse']>>
  ) => {
    const responseUrl = new URL(response.url());
    if (responseUrl.origin !== currentOrigin) return;

    const resourceType = response.request().resourceType();
    if (resourceType !== 'document' && resourceType !== 'fetch') return;

    sameOriginResponses.push({
      url: response.url(),
      status: response.status(),
      resourceType,
      location: response.headers().location ?? null,
    });
  };

  page.on('response', recordResponse);
  try {
    await page.getByRole('link', { name: linkName, exact: true }).click();
    try {
      await expect
        .poll(
          async () => ({
            pathname: new URL(page.url()).pathname,
            lang: await page.locator('html').getAttribute('lang'),
          }),
          { timeout: 10_000 }
        )
        .toEqual({
          pathname: expectedPathname,
          lang: expectedLang,
        });
    } catch (error) {
      const finalState = {
        url: page.url(),
        lang: await page.locator('html').getAttribute('lang'),
        sameOriginResponses,
      };
      throw new Error(
        `Language soft-navigation contract failed: ${JSON.stringify(finalState)}\n${String(error)}`
      );
    }
  } finally {
    page.off('response', recordResponse);
  }
}

async function ensureLanguageSwitcherVisible(page: Page, language: string) {
  const languageLink = page.getByRole('link', { name: language, exact: true });
  if (await languageLink.isVisible()) return;

  const openMenu = page
    .locator('label[for="mobile-navigation-toggle"]')
    .filter({ hasText: /open navigation menu|打开导航菜单/i });
  await openMenu.click();
  await expect(page.locator('#mobile-navigation')).toBeVisible();
  await expect(languageLink).toBeVisible();
}

test.describe('游戏浏览流程', () => {
  test('首页可以正常渲染', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL('/');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('支持切换到英文站点', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL('/');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
    await ensureLanguageSwitcherVisible(page, 'EN');
    await clickLanguageLinkAndExpect({
      page,
      linkName: 'EN',
      expectedPathname: '/en',
      expectedLang: 'en',
    });
  });

  test('默认语言前缀只重定向一次到根路径且可从英文软导航返回', async ({
    page,
  }) => {
    const prefixedResponse = await page.goto('/zh');

    expect(prefixedResponse).not.toBeNull();
    if (!prefixedResponse) {
      throw new Error('Expected /zh navigation to return a final response');
    }

    const canonicalRequest = prefixedResponse.request();
    const redirectRequest = canonicalRequest.redirectedFrom();

    expect(prefixedResponse.ok()).toBe(true);
    expect(new URL(canonicalRequest.url()).pathname).toBe('/');
    expect(redirectRequest).not.toBeNull();
    if (!redirectRequest) {
      throw new Error('Expected /zh navigation to include one redirect');
    }

    const redirectResponse = await redirectRequest.response();

    expect(new URL(redirectRequest.url()).pathname).toBe('/zh');
    expect(redirectRequest.redirectedFrom()).toBeNull();
    expect(redirectResponse?.status()).toBe(307);
    expect(redirectResponse?.headers()['location']).toBe('/');
    await expect(page).toHaveURL('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh');

    const englishResponse = await page.goto('/en');

    expect(englishResponse?.ok()).toBe(true);
    await expect(page).toHaveURL('/en');
    await ensureLanguageSwitcherVisible(page, '中文');
    await clickLanguageLinkAndExpect({
      page,
      linkName: '中文',
      expectedPathname: '/',
      expectedLang: 'zh',
    });
  });

  test('英文攻略页输出正确的文档语言', async ({ page }) => {
    const response = await page.goto('/en/guides/best-free-iphone-games');

    expect(response?.ok()).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('攻略推荐保留有用的游戏详情，移除未经核实的图片', async ({ page }) => {
    await page.goto('/en/guides/google-snake-mods');

    const recommendations = page.locator('#recommendations');
    await expect(recommendations.locator('a[href="/en/games/ovo"]')).toHaveCount(0);

    const tunnelRushCard = recommendations
      .locator('article')
      .filter({ has: page.locator('a[href="/en/games/tunnel-rush"]') });
    const tunnelRushLink = tunnelRushCard.locator('a[href="/en/games/tunnel-rush"]');
    await expect(tunnelRushLink).toHaveCount(1);
    await tunnelRushLink.click();
    await expect(page).toHaveURL(/\/en\/games\/tunnel-rush$/);
    await expect(page.locator('[data-legacy-game-guide]')).toBeVisible();
  });

  test('旧镜像下架、同款攻略跳转与高流量攻略保留', async ({ page, request }) => {
    for (const prefix of ['', '/en']) {
      const redirect = await request.get(`${prefix}/games/drive-mad`, { maxRedirects: 0 });
      expect(redirect.status()).toBe(301);
      expect(redirect.headers().location).toBe(`${prefix}/guides/drive-mad-walkthrough`);

      const retired = await request.get(`${prefix}/games/temple-run-2`, { maxRedirects: 0 });
      expect(retired.status()).toBe(404);
    }
    expect((await request.get('/data/4399-sample.json')).status()).toBe(404);
    expect((await request.get('/game-screenshots/google-snake.png')).status()).toBe(404);

    const response = await page.goto('/en/guides/google-snake-mods');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-security-policy']).not.toMatch(/4399|friv2018/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/guides\/google-snake-mods$/);
    await expect(page.locator('[data-legacy-player-removed]')).toBeVisible();
    await expect(page.locator('main iframe, #play')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Play standard Snake on Google (no mods)' })).toHaveAttribute('href', 'https://www.google.com/fbx?fbx=snake_arcade');
  });

  test('OvO 旧址 301 到同语言攻略并可从攻略前往游玩', async ({ page, request }) => {
    for (const [prefix, target] of [
      ['', '/guides/ovo-walkthrough'],
      ['/en', '/en/guides/ovo-walkthrough'],
      ['/zh', '/guides/ovo-walkthrough'],
    ]) {
      const response = await request.get(`${prefix}/games/ovo`, { maxRedirects: 0 });
      expect(response.status()).toBe(301);
      expect(response.headers().location).toBe(target);
    }

    const savedGames = await request.get('/api/games/saved?slugs=ovo');
    expect(savedGames.ok()).toBe(true);
    expect(await savedGames.json()).toMatchObject({ games: [] });

    for (const [prefix, label] of [
      ['', '去 Coolmath Games 玩 OvO'],
      ['/en', 'Play OvO on Coolmath Games'],
    ]) {
      const route = `${prefix}/guides/ovo-walkthrough`;
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.lumagamehub.com${route}`);
      await expect(page.getByRole('link', { name: label })).toHaveAttribute('href', 'https://www.coolmathgames.com/0-ovo');
      await expect(page.locator('main iframe')).toHaveCount(0);
    }
  });

  test('英文游戏目录的首方图片资源不返回 4xx', async ({ page, request }) => {
    const response = await page.goto('/en/games', { waitUntil: 'domcontentloaded' });

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL('/en/games');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const imageUrls = await page.locator('img[src]').evaluateAll(images =>
      Array.from(
        new Set(
          images
            .map(image => image.getAttribute('src'))
            .filter((src): src is string => Boolean(src))
            .map(src => new URL(src, window.location.href).toString())
            .filter(url => new URL(url).origin === window.location.origin)
        )
      )
    );

    const catalogueImage = page.locator('main img[src^="data:image/svg+xml"]').first();
    await catalogueImage.scrollIntoViewIfNeeded();
    await expect.poll(() => catalogueImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);

    const imageResponses = await Promise.all(
      imageUrls.map(url => request.get(url))
    );
    const failures = imageResponses.flatMap((imageResponse, index) => {
      if (imageResponse.ok()) return [];

      const resourceUrl = new URL(imageUrls[index]);
      const source =
        resourceUrl.searchParams.get('url') ?? resourceUrl.pathname;
      return [`${imageResponse.status()} ${source}`];
    });

    expect(failures).toEqual([]);
  });
});
