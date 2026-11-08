import { test, expect } from '@playwright/test';

const LIVE_SITE = process.env.LIVE_SITE_URL || 'https://dorpnay.github.io/skills-github-pages/';

test('live public site serves the app shell and basic chat controls', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  const response = await page.goto(LIVE_SITE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  expect(response, 'The live site should return an HTTP response').not.toBeNull();
  expect(response.status(), 'The published site should return a successful status').toBeLessThan(400);
  await expect(page).toHaveTitle(/(?:AI Mobile Agent|aLandi)/);
  await expect(page.locator('#chatBox')).toBeVisible();
  await expect(page.locator('#userInput')).toBeEditable();
  await expect(page.locator('#sendBtn')).toBeVisible();
  const runtime = page.locator('script[src*="/assets/js/app.js"]');
  if (await runtime.count()) {
    await page.waitForFunction(() => window.__alandiAppReady === true);
    const stylesheet = page.locator('link[rel="stylesheet"][href*="/assets/css/app.css"]');
    await expect(stylesheet).toHaveCount(1);
    const jsUrl = await runtime.getAttribute('src');
    const cssUrl = await stylesheet.getAttribute('href');
    expect(jsUrl).toBeTruthy();
    expect(cssUrl).toBeTruthy();
    const [jsResponse, cssResponse] = await Promise.all([
      page.request.get(new URL(jsUrl, page.url()).toString()),
      page.request.get(new URL(cssUrl, page.url()).toString())
    ]);
    expect(jsResponse.status()).toBe(200);
    expect((jsResponse.headers()['content-type'] || '')).toContain('javascript');
    expect((await jsResponse.body()).length).toBeGreaterThan(0);
    expect(cssResponse.status()).toBe(200);
    expect((cssResponse.headers()['content-type'] || '')).toContain('text/css');
    expect((await cssResponse.body()).length).toBeGreaterThan(0);
  }
  // This test targets the currently published main site, not the unmerged PR preview.
  // Feature-specific menu assertions belong in app.spec.mjs against the built PR artifact.
  expect(pageErrors, 'No uncaught browser errors should occur on the live site').toEqual([]);
});
