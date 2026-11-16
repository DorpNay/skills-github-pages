import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('deep multimodal prompts load specialist skill and preserve the v10 UI', async ({ page }) => {
  let receivedSystem = '';
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const payload = route.request().postDataJSON();
    receivedSystem = String(payload.messages.find(message => message.role === 'system')?.content || '');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        model: 'e2e-multimodal-model',
        choices: [{ message: { role: 'assistant', content: 'Начнём с контролируемого benchmark, а не с параллельной установки всех моделей.' } }]
      })
    });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/AI Mobile Agent/);
  await expect(page.locator('#chatBox')).toBeVisible();

  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-multimodal-model');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();

  await page.locator('#modeDeep').click();
  await page.locator('#userInput').fill('Сравни Qwen3-ASR-0.6B и GLM-OCR для распознавания речи и сложных документов; проверь языки, лицензии и RAM.');
  await page.locator('#sendBtn').click();

  await expect(page.locator('#chatBox')).toContainText('контролируемого benchmark', { timeout: 15000 });
  expect(receivedSystem).toContain('Qwen3-ASR-0.6B');
  expect(receivedSystem).toContain('Current UI has no finished image/PDF upload or microphone capture');
  expect(receivedSystem).toContain('LightOnOCR-3-4B');
});
