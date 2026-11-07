import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test('removed Research Studio has no visible entry point', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#sidebar [data-action="open-research-studio"]')).toHaveCount(0);
  await expect(page.locator('[data-action="open-research-studio"]')).toHaveCount(0);
  await expect(page.locator('#researchStudioModal')).toHaveCount(0);
  await expect(page.locator('#functionsMenu')).toHaveCount(0);
  await expect(page.locator('#searchModeSummary')).toBeVisible();
});
