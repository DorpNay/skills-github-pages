import { test, expect } from '@playwright/test';

const LANDING_PATH = process.env.LIVE_SITE_URL ? 'landing/' : '/landing/';

test('standalone landing explains the product and its real deployment boundaries', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(LANDING_PATH, { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle(/aLandi.*собственным gateway/i);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Сохраняй контроль');
  await expect(page.getByRole('link', { name: /Открыть рабочую среду/ })).toHaveAttribute('href', /\/skills-github-pages\/$/);
  await expect(page.getByRole('heading', { name: /Прозрачная архитектура первого контура/ })).toBeVisible();
  await expect(page.getByText(/не является достаточной системой multi-user auth/i)).toBeVisible();

  const layout = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    scripts: document.scripts.length,
    canonical: document.querySelector('link[rel="canonical"]')?.href
  }));
  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
  expect(layout.scripts).toBe(0);
  expect(layout.canonical).toContain('/skills-github-pages/landing/');
});
