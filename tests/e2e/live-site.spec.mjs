import { test, expect } from '@playwright/test';

const LIVE_SITE = process.env.LIVE_SITE_URL || 'https://dorpnay.github.io/skills-github-pages/';

test('live public site serves the app shell and basic chat controls', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  const response = await page.goto(LIVE_SITE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  expect(response, 'The live site should return an HTTP response').not.toBeNull();
  expect(response.status(), 'The published site should return a successful status').toBeLessThan(400);
  await expect(page).toHaveTitle(/AI Mobile Agent/);
  await expect(page.locator('#chatBox')).toBeVisible();
  await expect(page.locator('#userInput')).toBeEditable();
  await expect(page.locator('#sendBtn')).toBeVisible();
  await expect(page.locator('#toggleSearch')).toBeVisible();
  expect(pageErrors, 'No uncaught browser errors should occur on the live site').toEqual([]);
});
