import { test, expect } from '@playwright/test';

const ROOT = process.env.LIVE_SITE_URL ? './' : '/';
const NOTEBOOK = process.env.LIVE_SITE_URL ? './notebook/' : '/notebook/';
const CODER = process.env.LIVE_SITE_URL ? './workspace/' : '/workspace/';

test('aCodingi and aNoteBooki are navigable same-origin workspaces', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(ROOT, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#sidebar a[href*="/workspace/"]')).toHaveCount(1);
  await expect(page.locator('#sidebar a[href*="/notebook/"]')).toHaveCount(1);
  await page.goto(CODER, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/aCodingi/);
  await expect(page.getByRole('heading', { name: /aCodingi/ })).toBeVisible();
  await expect(page.locator('#chooseFolder')).toBeVisible();
  await expect(page.locator('#writeChanges')).toBeDisabled();
  await page.goto(NOTEBOOK, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/aNoteBooki/);
  await expect(page.getByRole('heading', { name: 'aNoteBooki' })).toBeVisible();
  expect(errors).toEqual([]);
});
