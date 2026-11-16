import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test('the only public product route is the current aLandi app at root', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#sidebar')).toBeAttached();
  await expect(page.locator('#chatBox')).toBeVisible();
  await expect(page.locator('meta[name="alandi-build-revision"]')).toHaveAttribute('content', /^[0-9a-f]{40}$/);
  await expect(page.locator('a[href*="/landing/"]')).toHaveCount(0);

  const landingUrl = new URL('landing/', page.url()).toString();
  const landingResponse = await page.request.get(landingUrl);
  expect(landingResponse.status()).toBe(404);

  const landingCssUrl = new URL('assets/css/landing.css', page.url()).toString();
  const landingCssResponse = await page.request.get(landingCssUrl);
  expect(landingCssResponse.status()).toBe(404);
});

test('root application has no horizontal overflow at common mobile, tablet and desktop widths', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth
    }));
    expect(dimensions.document, 'horizontal overflow at ' + width + 'px').toBeLessThanOrEqual(dimensions.viewport);
  }
});
