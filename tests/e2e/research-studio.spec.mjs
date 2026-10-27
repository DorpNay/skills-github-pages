import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('Search & Research Studio opens on demand and pre-fills the current draft', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('#userInput').fill('Compare official sources about browser security and cite the evidence.');
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.getByRole('button', { name: /Search & Research Studio/ }).click();

  const studio = page.getByRole('dialog', { name: 'Search & Research' });
  await expect(studio).toBeVisible();
  await expect(page.locator('#researchStudioPrompt')).toHaveValue('Compare official sources about browser security and cite the evidence.');
  await expect(studio).toContainText('Отдельное рабочее окно');
  await expect(page.locator('#researchStudioDepth')).toHaveValue('deep');

  await page.locator('[data-action="close-research-studio"]').last().click();
  await expect(studio).toBeHidden();
});

test('Search & Research Studio closes on Escape without starting a request', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.getByRole('button', { name: /Search & Research Studio/ }).click();
  const studio = page.getByRole('dialog', { name: 'Search & Research' });
  await expect(studio).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(studio).toBeHidden();
  await expect(page.locator('#searchStatus')).toBeHidden();
});
