import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('e2e-cleaned') !== '1') {
      localStorage.clear();
      sessionStorage.setItem('e2e-cleaned', '1');
    }
  });
});

test('model mode is exclusive and top composer grows down and persists', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();

  await expect(page.locator('#modelModeSelect')).toHaveValue('self-hosted');
  await expect(page.locator('#providerPreset')).toHaveValue('alandi');
  await expect(page.locator('#cloudSettingsCard')).toBeVisible();

  await page.locator('#modelModeSelect').selectOption('free-cloud');
  await expect(page.locator('#modelModeSelect')).toHaveValue('free-cloud');
  await expect(page.locator('#providerPreset')).toHaveValue('kilo');
  await expect(page.locator('#cloudSettingsCard')).toBeHidden();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_model_mode_v1'))).toBe('free-cloud');

  await page.locator('#providerPreset').selectOption('gemini');
  await expect(page.locator('#modelModeSelect')).toHaveValue('free-cloud');
  await expect(page.locator('#providerPreset')).toHaveValue('gemini');

  await page.locator('#modelModeSelect').selectOption('self-hosted');
  await expect(page.locator('#providerPreset')).toHaveValue('alandi');
  await expect(page.locator('#cloudSettingsCard')).toBeVisible();
  await expect(page.locator('#baseUrl')).toBeDisabled();

  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) {
    await page.locator('#legacyProviderSettings > summary').click();
  }
  await page.locator('#composerPositionSelect').selectOption('top');
  await expect.poll(() => page.evaluate(() => document.body.classList.contains('composer-top'))).toBe(true);
  await page.locator('[data-action="close-settings"]').click();

  const textarea = page.locator('#userInput');
  await textarea.fill('First line\nSecond line\nThird line\nFourth line\nFifth line');
  await expect.poll(() => textarea.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(60);
  const footer = await page.locator('#composerFooter').boundingBox();
  const chat = await page.locator('#chatBox').boundingBox();
  expect(footer).not.toBeNull();
  expect(chat).not.toBeNull();
  expect(footer.y).toBeGreaterThan(0);
  expect(footer.y + footer.height).toBeLessThanOrEqual(chat.y + 3);

  await page.reload();
  await expect.poll(() => page.evaluate(() => document.body.classList.contains('composer-top'))).toBe(true);
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) {
    await page.locator('#legacyProviderSettings > summary').click();
  }
  await expect(page.locator('#composerPositionSelect')).toHaveValue('top');
});
