import { test, expect } from '@playwright/test';

async function chooseSearchMode(page, mode) {
  await page.locator('#searchModeSummary').click();
  await page.locator(`[data-action="select-search-mode"][data-search-mode="${mode}"]`).click();
}


const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
});

for (const language of ['ru', 'en']) {
  test('provider probe failure keeps credentials out of diagnostics (' + language + ')', async ({ page }) => {
    let releaseProbe, markProbeStarted;
    const probeStarted = new Promise(resolve => { markProbeStarted = resolve; });
    const probeGate = new Promise(resolve => { releaseProbe = resolve; });
    await page.route('https://api.example.test/v1/chat/completions', async route => {
      markProbeStarted();
      await probeGate;
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'invalid credential e2e-provider-secret' } })
      });
    });
    await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
    await page.locator('#uiLanguage').selectOption(language);
    await page.locator('[data-action="toggle-settings"]').click();
    if (!(await page.locator('#legacyProviderSettings').evaluate(element => element.open))) {
      await page.locator('#legacyProviderSettings > summary').click();
    }
    await page.locator('#providerPreset').selectOption('custom');
    await page.locator('#baseUrl').fill('https://api.example.test/v1');
    await page.locator('#modelName').fill('e2e-provider-model');
    await page.locator('#apiKey').fill('e2e-provider-secret');
    await page.locator('[data-action="save-settings"]').click();

    const button = page.locator('[data-action="test-connection"]');
    await button.click();
    await probeStarted;
    try {
      await expect(button).toBeDisabled();
      await expect(button).toHaveAttribute('aria-busy', 'true');
    } finally {
      releaseProbe();
    }
    await expect(page.locator('#apiKeyStatus')).toContainText(
      language === 'en' ? 'Could not confirm the model (HTTP 401)' : 'Не удалось подтвердить модель (HTTP 401)'
    );
    await expect(page.locator('#apiKeyStatus')).not.toContainText('e2e-provider-secret');
    await expect(page.locator('#toast')).toContainText(
      language === 'en' ? 'Provider/model check failed.' : 'Проверка провайдера не пройдена.'
    );
    await expect(button).toBeEnabled();
    await expect(button).toHaveAttribute('aria-busy', 'false');
    await expect(button).toHaveText(language === 'en' ? 'Test connection and model' : 'Проверить соединение и модель');
  });
}

test('aServi private gateway route works, stays local, and exposes cache status', async ({ page }) => {
  const chatPayloads = [];
  const cloudChatRequests = [];
  await page.route('https://alandi.example.test/healthz', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' })
  }));
  await page.route('https://alandi.example.test/**', async route => {
    const request = route.request();
    const origin = request.headers().origin || 'https://dorpnay.github.io';
    if (request.url().endsWith('/healthz')) return route.fulfill({ status: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'ok' }) });
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
      if (payload.messages?.at(-1)?.content !== 'Reply with exactly OK.') chatPayloads.push(payload);
      return route.fulfill({
        status: 200,
        headers: { ...corsHeaders, 'x-ai-cache': 'MISS', 'cache-control': 'no-store' },
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'local-chatcmpl-test', object: 'chat.completion', model: 'qwen3.5:4b',
          choices: [{ index: 0, message: { role: 'assistant', content: 'aServi local gateway works.' }, finish_reason: 'stop' }]
        })
      });
    }
    return route.fulfill({ status: 404, headers: corsHeaders, contentType: 'application/json', body: '{}' });
  });
  await page.route('https://generativelanguage.googleapis.com/**', async route => {
    if (/\/chat\/completions|\/responses|:generateContent|:streamGenerateContent/.test(route.request().url())) cloudChatRequests.push(route.request().url());
    return route.fulfill({
      status: 503, contentType: 'application/json',
      body: JSON.stringify({ error: { message: 'Cloud fallback must not be used in this test.' } })
    });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await expect(page.locator('#aserviSettingsGroup')).toHaveAttribute('open', '');
  await expect(page.locator('#providerPreset option[value="alandi"]')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_api_provider'))).toBe('alandi');
  await page.locator('#cloudBaseUrl').fill('https://alandi.example.test/v1');
  await page.locator('#cloudModel').fill('qwen3.5:4b');
  await page.locator('#cloudApiKey').fill('e2e-alandi-placeholder-key-not-a-secret-0123456789');
  await page.locator('[data-action="connect-alandi-aservi"]').click();
  await expect(page.locator('#cloudStatusDot')).toHaveAttribute('data-state', 'connected');
  await page.locator('[data-action="close-settings"]').click();
  await chooseSearchMode(page, 'offline');
  // Enable fallback only after startup to avoid triggering unrelated model-catalog probes.
  await page.evaluate(() => {
    localStorage.setItem('ai_cross_provider_fallback', 'true');
    localStorage.setItem('ai_api_key_gemini', 'not-a-real-gemini-key');
  });
  await page.locator('#userInput').fill('Проверь локальный маршрут.');
  await page.locator('#sendBtn').click();

  await expect(page.locator('#chatBox')).toContainText('aServi local gateway works.', { timeout: 15000 });
  await expect(page.locator('#chatBox .message-model-meta').last()).toContainText('кэш MISS');
  expect(chatPayloads).toHaveLength(1);
  expect(chatPayloads[0].model).toBe('qwen3.5:4b');
  expect(chatPayloads[0].temperature).toBe(0);
  expect(cloudChatRequests).toEqual([]);
});

test('third-party provider fallback never switches to aServi', async ({ page }) => {
  const aServiChatRequests = [];
  const geminiChatRequests = [];
  await page.addInitScript(() => {
    localStorage.setItem('ai_api_provider', 'gemini');
    localStorage.setItem('ai_api_key_gemini', 'e2e-gemini-placeholder-key');
    localStorage.setItem('ai_api_key_alandi', 'e2e-aservi-placeholder-key');
    localStorage.setItem('ai_alandi_cloud_base_url', 'https://alandi.example.test/v1');
    localStorage.setItem('ai_alandi_cloud_model', 'qwen3.5:4b');
    localStorage.setItem('ai_cross_provider_fallback', 'true');
  });
  await page.route('https://alandi.example.test/**', async route => {
    const request = route.request();
    if (request.url().includes('/v1/chat/completions')) {
      aServiChatRequests.push(request.url());
      return route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'aServi fallback must not run.' } }] })
      });
    }
    return route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ data: [{ id: 'qwen3.5:4b', context_length: 4096 }] })
    });
  });
  await page.route('https://generativelanguage.googleapis.com/**', async route => {
    const url = route.request().url();
    if (/generateContent|streamGenerateContent|chat\/completions|\/responses/.test(url)) {
      geminiChatRequests.push(url);
      await new Promise(resolve => setTimeout(resolve, 250));
      return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: { message: 'Gemini unavailable for fallback isolation.' } }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ models: [] }) });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#providerPreset')).toHaveValue('gemini');
  await chooseSearchMode(page, 'offline');
  const failedGeminiRequest = page.waitForResponse(response =>
    response.url().includes('generativelanguage.googleapis.com') && /generateContent|streamGenerateContent|chat\/completions/.test(response.url())
  );
  await page.locator('#userInput').fill('Проверь запрет автоматического переключения на aServi.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#stopBtn')).toBeVisible({ timeout: 5000 });
  await failedGeminiRequest;
  await expect(page.locator('#stopBtn')).toBeHidden({ timeout: 15000 });
  expect(geminiChatRequests.length).toBeGreaterThan(0);
  expect(aServiChatRequests).toEqual([]);
});


test('aServi and third-party settings disclosures are mutually exclusive', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();

  const aservi = page.locator('#aserviSettingsGroup');
  const thirdParty = page.locator('#legacyProviderSettings');
  const additional = page.locator('#additionalSettings');

  if (!(await aservi.evaluate(element => element.open))) await aservi.locator(':scope > summary').click();
  await expect(aservi).toHaveAttribute('open', '');
  await thirdParty.locator(':scope > summary').click();
  await expect(thirdParty).toHaveAttribute('open', '');
  await expect(aservi).not.toHaveAttribute('open', '');

  await additional.locator(':scope > summary').click();
  await expect(additional).toHaveAttribute('open', '');
  await expect(thirdParty).not.toHaveAttribute('open', '');
  await expect(aservi).not.toHaveAttribute('open', '');

  await aservi.locator(':scope > summary').click();
  await expect(aservi).toHaveAttribute('open', '');
  await expect(additional).not.toHaveAttribute('open', '');
});

test('aServi web_search tool uses the private SearXNG gateway before external search', async ({ page }) => {
  const chatPayloads = [];
  const searchRequests = [];
  const externalSearchRequests = [];
  await page.route('https://alandi.example.test/**', async route => {
    const request = route.request();
    const origin = request.headers().origin || 'https://dorpnay.github.io';
    const cors = {
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'authorization,content-type',
      'access-control-max-age': '600'
    };
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors, body: '' });
    if (request.url().endsWith('/healthz')) return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: '{"status":"ok"}' });
    if (request.url().includes('/v1/models')) return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'qwen3.5:4b', context_length: 4096 }] }) });
    if (request.url().includes('/v1/search/web')) {
      searchRequests.push({ url: request.url(), authorization: request.headers().authorization });
      return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({
        provider: 'searxng', query: 'current Qwen documentation',
        results: [{ title: 'Official Qwen documentation', url: 'https://qwen.ai/docs', snippet: 'Official documentation result.' }], count: 1
      }) });
    }
    if (request.url().includes('/v1/chat/completions')) {
      const payload = request.postDataJSON();
      chatPayloads.push(payload);
      const isToolResult = payload.messages?.some(message => message.role === 'tool');
      const message = isToolResult
        ? { role: 'assistant', content: 'The official Qwen documentation was found.' }
        : { role: 'assistant', tool_calls: [{ id: 'call-web-1', type: 'function', function: { name: 'web_search', arguments: JSON.stringify({ query: 'current Qwen documentation' }) } }] };
      return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({
        id: 'aServi-search-test', object: 'chat.completion', model: 'qwen3.5:4b',
        choices: [{ index: 0, message, finish_reason: isToolResult ? 'stop' : 'tool_calls' }]
      }) });
    }
    return route.fulfill({ status: 404, headers: cors, contentType: 'application/json', body: '{}' });
  });
  await page.route('https://api.tavily.com/**', route => { externalSearchRequests.push(route.request().url()); return route.abort(); });
  await page.route('https://*.wikipedia.org/**', route => { externalSearchRequests.push(route.request().url()); return route.abort(); });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await page.locator('#cloudBaseUrl').fill('https://alandi.example.test/v1');
  await page.locator('#cloudModel').fill('qwen3.5:4b');
  await page.locator('#cloudApiKey').fill('e2e-alandi-search-placeholder-key-0123456789');
  await page.locator('[data-action="connect-alandi-aservi"]').click();
  await expect(page.locator('#cloudStatusDot')).toHaveAttribute('data-state', 'connected');
  await page.locator('[data-action="close-settings"]').click();
  await chooseSearchMode(page, 'normal');
  await page.locator('#userInput').fill('Найди официальную документацию Qwen.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('The official Qwen documentation was found.', { timeout: 15000 });
  expect(searchRequests).toHaveLength(1);
  expect(searchRequests[0].authorization).toBe('Bearer e2e-alandi-search-placeholder-key-0123456789');
  expect(searchRequests[0].url).toContain('q=current%20Qwen%20documentation');
  expect(chatPayloads.some(payload => payload.tools?.some(tool => tool.function?.name === 'web_search'))).toBe(true);
  expect(externalSearchRequests).toEqual([]);
});
