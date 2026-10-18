const { test, expect } = require('@playwright/test');
const home = process.env.ZZO_HOME || '/en/';
const article = process.env.ZZO_ARTICLE || '/en/posts/markdown-syntax/';
const query = process.env.ZZO_QUERY || 'Markdown';

test.beforeEach(async ({ page }) => {
  // Third-party tracking, comments and remote media are outside the local theme test.
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});

for (const width of [1440, 390]) {
  test(`article layout and theme switching at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const missing = [];
    page.on('response', response => { if (response.url().startsWith('http://127.0.0.1:4173') && response.status() >= 400) missing.push(response.url()); });
    await page.goto(article);
    await expect(page.locator('.single__contents')).toBeVisible();
    const layout = await page.locator('.wrapper').evaluate(el => ({ columns: getComputedStyle(el).gridTemplateColumns.split(' ').filter(size => parseFloat(size) > 0).length, width: el.getBoundingClientRect().width }));
    expect(layout.columns).toBe(width < 770 ? 1 : 2);
    expect(layout.width).toBeLessThanOrEqual(width);
    if (width < 770) await expect(page.locator('.single__side')).toBeHidden();
    const themes = ['dark', 'light', 'hacker', 'solarized', 'kimbie'];
    for (let i = 0; i < themes.length; i++) {
      const button = page.getByRole('button', { name: 'Select Theme Button', exact: true }).filter({ visible: true });
      await button.click();
      await page.locator('.select-theme:visible .select-theme__item').nth(i).click();
      await expect(page.locator('body')).toHaveClass(new RegExp(`theme__${themes[i]}`));
      const color = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    }
    await page.screenshot({ path: `.build/article-${width}.png`, fullPage: false });
    expect(missing).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('search returns a real article and taxonomy links resolve', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(home);
  await expect(page.locator('#search')).toBeVisible();
  await page.locator('#search').pressSequentially(query, { delay: 100 });
  await expect(page.locator('.search-result__body a, #search-menu a').first()).toBeVisible();
  const href = await page.locator('.search-result__body a, #search-menu a').first().getAttribute('href');
  const response = await page.request.get(href);
  expect(response.ok()).toBeTruthy();
  expect(errors).toEqual([]);
  for (const section of ['tags/', 'categories/', 'index.xml', 'index.json']) {
    expect((await page.request.get(home + section)).ok()).toBeTruthy();
  }
});

test('optional page types and language navigation render', async ({ page }) => {
  const routes = process.env.ZZO_ROUTES ? process.env.ZZO_ROUTES.split(',') : ['/en/gallery/', '/en/about/', '/en/publication/', '/ko/'];
  for (const route of routes) {
    expect((await page.goto(route)).ok()).toBeTruthy();
    await expect(page.locator('body')).toBeVisible();
    expect(await page.locator('main, .reveal').count()).toBeGreaterThan(0);
  }
});


test('mobile search opens and returns results', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const ready = page.waitForResponse(response => response.url().endsWith('/index.json'));
  await page.goto(home);
  await ready;
  await page.locator('.navbar-search:visible').first().click();
  await expect(page.locator('#search-mobile')).toBeVisible();
  await page.locator('#search-mobile').pressSequentially(query, { delay: 100 });
  await expect(page.locator('#search-mobile-results a').first()).toBeVisible();
  expect(errors).toEqual([]);
});
