import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test('app shell is available offline after its first successful visit', async ({ page, context }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.offlineShell)).toBe('registered');
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await expect(page.locator('#chatBox')).toBeVisible();
  await page.waitForFunction(() => typeof window.marked?.parse === 'function' && typeof window.DOMPurify?.sanitize === 'function');
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#chatBox')).toBeVisible();
  await expect(page.locator('#sidebar')).toBeAttached();
  await page.waitForFunction(() => typeof window.marked?.parse === 'function' && typeof window.DOMPurify?.sanitize === 'function');
  const offlineState = await page.evaluate(() => ({
    controlled: Boolean(navigator.serviceWorker.controller),
    revision: document.querySelector('meta[name="alandi-build-revision"]')?.content,
    offlineShell: document.documentElement.dataset.offlineShell
  }));
  expect(offlineState.controlled).toBe(true);
  expect(offlineState.revision).toMatch(/^[0-9a-f]{40}$/);
  await context.setOffline(false);
});
