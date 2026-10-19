import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test('aLandi preset uses its configured private gateway without cloud fallback', async ({ page }) => {
  const chatRequests = [];
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.route('https://alandi.example.test/v1/models', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ data: [{ id: 'qwen3.5:4b', context_length: 4096 }] })
  }));
  await page.route('https://alandi.example.test/v1/chat/completions', async route => {
    const payload = route.request().postDataJSON();
    chatRequests.push(payload.model);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'local-chatcmpl-test',
        object: 'chat.completion',
        model: 'qwen3.5:4b',
        choices: [{ index: 0, message: { role: 'assistant', content: 'aLandi local gateway works.' }, finish_reason: 'stop' }]
      })
    });
  });
  const cloudChatRequests = [];
  await page.route('https://generativelanguage.googleapis.com/**', async route => {
    if (route.request().url().includes('/chat/completions')) cloudChatRequests.push(route.request().url());
    await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: { message: 'Cloud fallback should not be used in this test.' } }) });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('alandi');
  await expect(page.locator('#modelName')).toHaveValue('qwen3.5:4b');
  await page.locator('#baseUrl').fill('https://alandi.example.test/v1');
  await page.locator('#modelName').fill('qwen3.5:4b');
  await page.locator('#apiKey').fill('e2e-alandi-placeholder-key-not-secret-0123456789');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();

  await page.locator('#userInput').fill('Проверь локальный маршрут.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('aLandi local gateway works.', { timeout: 15000 });
  expect(chatRequests).toEqual(['qwen3.5:4b']);
  expect(cloudChatRequests).toEqual([]);
});
