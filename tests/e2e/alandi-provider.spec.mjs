import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear(); sessionStorage.clear();
    localStorage.setItem('ai_cross_provider_fallback', 'true');
    localStorage.setItem('ai_api_key_gemini', 'not-a-real-gemini-key');
  });
});

test('aLandi private gateway route works, stays local, and exposes cache status', async ({ page }) => {
  const chatPayloads = [];
  const cloudChatRequests = [];
  await page.route('https://alandi.example.test/**', async route => {
    const request = route.request();
    const origin = request.headers().origin || 'https://dorpnay.github.io';
    const corsHeaders = {
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'authorization,content-type,cache-control,x-ai-cache-bypass',
      'access-control-expose-headers': 'X-AI-Cache',
      'access-control-max-age': '600'
    };
    if (request.method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: corsHeaders, body: '' });
    }
    if (request.url().includes('/v1/models')) {
      return route.fulfill({
        status: 200, headers: corsHeaders, contentType: 'application/json',
        body: JSON.stringify({ data: [{ id: 'qwen3.5:4b', context_length: 4096 }] })
      });
    }
    if (request.url().includes('/v1/chat/completions')) {
      const payload = request.postDataJSON();
      chatPayloads.push(payload);
      return route.fulfill({
        status: 200,
        headers: { ...corsHeaders, 'x-ai-cache': 'MISS', 'cache-control': 'no-store' },
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'local-chatcmpl-test', object: 'chat.completion', model: 'qwen3.5:4b',
          choices: [{ index: 0, message: { role: 'assistant', content: 'aLandi local gateway works.' }, finish_reason: 'stop' }]
        })
      });
    }
    return route.fulfill({ status: 404, headers: corsHeaders, contentType: 'application/json', body: '{}' });
  });
  await page.route('https://generativelanguage.googleapis.com/**', async route => {
    cloudChatRequests.push(route.request().url());
    return route.fulfill({
      status: 503, contentType: 'application/json',
      body: JSON.stringify({ error: { message: 'Cloud fallback must not be used in this test.' } })
    });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('alandi');
  await expect(page.locator('#modelName')).toHaveValue('qwen3.5:4b');
  await page.locator('#baseUrl').fill('https://alandi.example.test/v1');
  await page.locator('#modelName').fill('qwen3.5:4b');
  await page.locator('#apiKey').fill('e2e-alandi-placeholder-key-not-a-secret-0123456789');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#toggleSearch').uncheck();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Проверь локальный маршрут.');
  await page.locator('#sendBtn').click();

  await expect(page.locator('#chatBox')).toContainText('aLandi local gateway works.', { timeout: 15000 });
  await expect(page.locator('#chatBox .message-model-meta').last()).toContainText('кэш MISS');
  expect(chatPayloads).toHaveLength(1);
  expect(chatPayloads[0].model).toBe('qwen3.5:4b');
  expect(chatPayloads[0].temperature).toBe(0);
  expect(cloudChatRequests).toEqual([]);
});
