import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('retired Research Studio and unrequested Functions menu stay absent', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('#researchStudioModal')).toHaveCount(0);
  await expect(page.locator('#functionsMenu')).toHaveCount(0);
  await expect(page.locator('[data-action="open-function-panel"]')).toHaveCount(0);
  await expect(page.locator('[data-action="open-research-studio"]')).toHaveCount(0);

  await page.locator('[data-action="toggle-sidebar"]').click();
  await expect(page.locator('#sidebar [data-action="open-research-studio"]')).toHaveCount(0);
  await expect(page.locator('#sidebar')).toBeVisible();

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(390);
});
