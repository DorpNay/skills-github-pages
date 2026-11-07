import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test('retired Research Studio stays absent while owner-approved Functions menu is present', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#researchStudioModal')).toHaveCount(0);
  await expect(page.locator('[data-action="open-research-studio"]')).toHaveCount(0);

  const menu = page.locator('#functionsMenu');
  await expect(menu).toBeVisible();
  await page.locator('#functionsMenu > summary').click();
  await expect(menu.locator('[data-function="agents"]')).toBeVisible();
  await expect(menu.locator('[data-action="select-processing-mode"][data-processing-mode="deep"]')).toBeVisible();
  await expect(menu.locator('[data-function="skills"]')).toBeVisible();
  await expect(menu.locator('[data-function="connectors"]')).toHaveCount(0);
  await expect(menu.locator('button')).toHaveCount(3);
});

test('Functions menu opens Agents and Skills panels and Deep Research selects Thorough without sending', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const menu = page.locator('#functionsMenu');
  await page.locator('#functionsMenu > summary').click();

  await menu.locator('[data-function="agents"]').click();
  await expect(page.locator('#functionPanelModal')).toBeVisible();
  await expect(page.locator('#agentFunctionSettings')).toBeVisible();
  await expect(page.locator('#skillFunctionSettings')).toBeHidden();
  await page.locator('#functionPanelModal [data-action="close-function-panel"]').first().click();
  await expect(page.locator('#functionPanelModal')).toBeHidden();

  await page.locator('#functionsMenu > summary').click();
  await menu.locator('[data-function="skills"]').click();
  await expect(page.locator('#functionPanelModal')).toBeVisible();
  await expect(page.locator('#skillFunctionSettings')).toBeVisible();
  await expect(page.locator('#agentFunctionSettings')).toBeHidden();
  await page.locator('#functionPanelModal [data-action="close-function-panel"]').first().click();
  await expect(page.locator('#functionPanelModal')).toBeHidden();

  await page.locator('#functionsMenu > summary').click();
  await menu.locator('[data-action="select-processing-mode"][data-processing-mode="deep"]').click();
  await expect(page.locator('#modeDeep')).toHaveAttribute('aria-pressed', 'true');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_processing_mode'))).toBe('deep');
  await expect(page.locator('#userInput')).toHaveValue('');
});
