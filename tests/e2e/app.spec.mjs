import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test.beforeEach(async ({ page }) => {
  // Every test starts with a clean browser profile; no real provider key is used.
  await page.addInitScript(() => {
    if (sessionStorage.getItem('e2e-cleaned') !== '1') {
      localStorage.clear();
      sessionStorage.setItem('e2e-cleaned', '1');
    }
  });
  // Keep every catalog request deterministic: no real provider credentials or network.
  await page.route(/(?:\/models(?:\?.*)?|\/text\/models(?:\?.*)?|\/language-models(?:\?.*)?|\/ai\/models\/search(?:\?.*)?)$/, async route => {
    // Fail closed: only the custom test endpoint or explicit provider mocks may answer.
    if (new URL(route.request().url()).hostname === 'api.example.test') {
      return route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ data: [{ id: 'e2e-default-catalog-model' }] })
      });
    }
    return route.fulfill({
      status: 503, contentType: 'application/json',
      body: JSON.stringify({ error: { message: 'Catalog intentionally unavailable in deterministic E2E.' } })
    });
  });
});

test('published app boots and core controls are interactive', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/AI Mobile Agent/);
  await expect(page.locator('#chatBox')).toBeVisible();
  await expect(page.locator('#userInput')).toBeEditable();
  await expect(page.locator('#toggleSearch')).toBeVisible();
  await expect(page.locator('#toggleSearch')).toBeChecked();
  await expect(page.locator('#offlineToggle')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#toggleMultiAgent')).toBeVisible();

  await page.getByRole('button', { name: 'Настройки' }).click();
  await expect(page.locator('#settingsModal')).toBeVisible();
  await expect(page.locator('#providerPreset')).toHaveValue('gemini');
  await expect(page.locator('#apiKey')).toHaveAttribute('type', 'password');
  await expect(page.locator('#baseUrl')).not.toBeFocused();
  await expect(page.locator('#systemPromptInput')).toHaveAttribute('readonly', '');
  await page.locator('#editSystemPrompt').click();
  await expect(page.locator('#systemPromptInput')).not.toHaveAttribute('readonly', '');
  await page.locator('#editSystemPrompt').click();
  await expect(page.locator('#systemPromptInput')).toHaveAttribute('readonly', '');
  await page.locator('#providerPreset').selectOption('gemini');
  await page.locator('#modelPreset').selectOption('gemini-3.6-flash');
  await expect(page.locator('#modelName')).toHaveValue('gemini-3.6-flash');
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#offlineToggle').click();
  await expect(page.locator('#offlineToggle')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('#offlineToggle')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#offlineToggle').click();
  await expect(page.locator('#offlineToggle')).toHaveAttribute('aria-pressed', 'false');
  await page.locator('#modeDeep').click();
  await expect(page.locator('#modeDeep')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('#modeDeep')).toHaveAttribute('aria-pressed', 'true');
  expect(pageErrors, 'Unexpected uncaught browser errors').toEqual([]);
});

test('provider keys, Tavily key, and model settings remain isolated across switching and reload', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();

  await page.locator('#providerPreset').selectOption('groq');
  await expect(page.locator('#apiKey')).toHaveValue('');
  await page.locator('#apiKey').fill('e2e-groq-placeholder-not-a-real-key');
  await page.locator('#modelName').fill('openai/gpt-oss-120b');
  await page.locator('#tavilyKey').fill('e2e-tavily-placeholder-not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#apiKey').fill('');
  await page.locator('[data-action="save-settings"]').click();
  await expect(page.locator('#apiKey')).toHaveValue('e2e-groq-placeholder-not-a-real-key');

  await page.locator('#providerPreset').selectOption('openrouter');
  await expect(page.locator('#apiKey')).toHaveValue('');
  await page.locator('#apiKey').fill('e2e-openrouter-placeholder-not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();

  await page.locator('#providerPreset').selectOption('groq');
  await expect(page.locator('#apiKey')).toHaveValue('e2e-groq-placeholder-not-a-real-key');
  await expect(page.locator('#tavilyKey')).toHaveValue('e2e-tavily-placeholder-not-a-real-key');
  await page.locator('[data-action="close-settings"]').click();

  await page.reload();
  await page.getByRole('button', { name: 'Настройки' }).click();
  await expect(page.locator('#providerPreset')).toHaveValue('groq');
  await expect(page.locator('#apiKey')).toHaveValue('e2e-groq-placeholder-not-a-real-key');
  await expect(page.locator('#tavilyKey')).toHaveValue('e2e-tavily-placeholder-not-a-real-key');
  await page.locator('#providerPreset').selectOption('openrouter');
  await expect(page.locator('#apiKey')).toHaveValue('e2e-openrouter-placeholder-not-a-real-key');
});

test('chat creation persists after reload without calling a model', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  const chats = page.locator('#chatList button[data-action="switch-chat"]');
  const before = await chats.count();
  await page.locator('#sidebar [data-action="new-chat"]').click();
  await expect(chats).toHaveCount(before + 1);
  await page.reload();
  await page.locator('[data-action="toggle-sidebar"]').click();
  await expect(page.locator('#chatList button[data-action="switch-chat"]')).toHaveCount(before + 1);
});

test('API authentication errors are shown without losing the original user prompt', async ({ page }) => {
  await page.route('https://api.example.test/v1/chat/completions', route => route.fulfill({
    status: 401,
    contentType: 'application/json',
    body: JSON.stringify({ error: { message: 'invalid test credential' } })
  }));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-test-model');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();

  await page.locator('#userInput').fill('E2E auth error preservation check');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('E2E auth error preservation check');
  await expect(page.locator('#chatBox')).toContainText('Запрос не выполнен.', { timeout: 15000 });
  await expect(page.locator('#chatBox')).toContainText('Проверьте API-ключ.');
  await expect.poll(async () => await page.locator('#chatBox').locator('.message-model-meta').count()).toBe(0);
});

test('provider connection loads filtered model catalog into selector and key deletion is explicit', async ({ page }) => {
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [
      { id: 'e2e-model' },
      { id: 'e2e-dynamic-model', name: 'Dynamic Chat Model' },
      { id: 'e2e-text-embedding' },
      { id: 'e2e-image-generation' }
    ] })
  }));
  await page.route('https://api.example.test/v1/chat/completions', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ model: 'e2e-model', choices: [{ message: { role: 'assistant', content: 'OK' } }] })
  }));
  await page.route('https://api.example.test/v1/chat/completions', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'OK' } }] })
  }));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-model');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await expect(page.locator('#apiKeyShell')).toHaveAttribute('data-state', 'pending');
  await page.locator('[data-action="test-connection"]').click();
  await expect(page.locator('#apiKeyShell')).toHaveAttribute('data-state', 'connected');
  await expect(page.locator('#apiKeyStatus')).toContainText('успешно ответила');
  await expect(page.locator('#modelCatalogStatus')).toContainText('2 текстовых моделей');
  await expect(page.locator('#modelPreset option[value="e2e-dynamic-model"]')).toHaveCount(1);
  await expect(page.locator('#modelPreset option[value="e2e-text-embedding"]')).toHaveCount(0);
  await expect(page.locator('#modelPreset option[value="e2e-image-generation"]')).toHaveCount(0);
  const cachedCatalog = await page.evaluate(() => JSON.parse(localStorage.getItem('ai_provider_model_catalog_v1_custom') || 'null'));
  expect(cachedCatalog.keyFingerprint).toMatch(/^[a-f0-9]{64}$/);
  expect(JSON.stringify(cachedCatalog)).not.toContain('not-a-real-key');
  await page.locator('#modelPreset').selectOption('e2e-dynamic-model');
  await expect(page.locator('#modelName')).toHaveValue('e2e-dynamic-model');
  await page.locator('[data-action="clear-provider-key"]').click();
  await expect(page.locator('#apiKey')).toHaveValue('');
  await expect(page.locator('#apiKeyShell')).toHaveAttribute('data-state', 'empty');
});

test('catalog remains usable when the saved model is missing from the live provider list', async ({ page }) => {
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [
      { id: 'e2e-live-model-a', name: 'Live Model A' },
      { id: 'e2e-live-model-b', name: 'Live Model B' }
    ] })
  }));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('retired-saved-model');
  await page.locator('#apiKey').fill('e2e-custom-model-catalog-key');
  await page.locator('[data-action="save-settings"]').click();

  await expect(page.locator('#modelPreset option[value="e2e-live-model-a"]')).toHaveCount(1);
  await expect(page.locator('#modelPreset option[value="e2e-live-model-b"]')).toHaveCount(1);
  await expect(page.locator('#modelPreset')).toHaveValue('__custom__');
  await expect(page.locator('#modelName')).toHaveValue('retired-saved-model');

  await page.locator('#modelPreset').selectOption('e2e-live-model-a');
  await expect(page.locator('#modelName')).toHaveValue('e2e-live-model-a');
});

test('refresh all catalogs updates other configured providers for cross-provider fallback', async ({ page }) => {
  await page.route('https://api.groq.com/openai/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [{ id: 'groq-live-chat-model', name: 'Groq Live Chat' }] })
  }));
  await page.route(/https:\/\/openrouter\.ai\/api\/v1\/models\?.*/, route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [{ id: 'openrouter/vendor-live-model', name: 'OpenRouter Live Model', architecture: { output_modalities: ['text'] } }] })
  }));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.setItem('ai_api_key_openrouter', 'e2e-openrouter-catalog-key'));
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('groq');
  await page.locator('#apiKey').fill('e2e-groq-catalog-key');
  await page.locator('[data-action="save-settings"]').click();

  await page.locator('[data-action="refresh-model-catalog"]').click();
  await expect.poll(() => page.evaluate(() => {
    const groq = JSON.parse(localStorage.getItem('ai_provider_model_catalog_v1_groq') || 'null');
    const openrouter = JSON.parse(localStorage.getItem('ai_provider_model_catalog_v1_openrouter') || 'null');
    return Boolean(groq?.models?.some(model => model.id === 'groq-live-chat-model') &&
      openrouter?.models?.some(model => model.id === 'openrouter/vendor-live-model'));
  })).toBe(true);
  await expect(page.locator('#modelPreset option[value="groq-live-chat-model"]')).toHaveCount(1);
  await expect(page.locator('#modelCatalogStatus')).toContainText('1 текстовых моделей');
});

test('settings profile exports portable preferences but never API secrets', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('groq');
  await page.locator('#modelName').fill('openai/gpt-oss-120b');
  await page.locator('#apiKey').fill('e2e-private-provider-secret-value');
  await page.locator('#tavilyKey').fill('e2e-private-search-secret-value');
  await page.locator('#allowCrossProviderFallback').check();
  await page.locator('[data-action="save-settings"]').click();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="export-settings-profile"]').click();
  const download = await downloadPromise;
  const profile = JSON.parse(await readFile(await download.path(), 'utf8'));
  const json = JSON.stringify(profile);
  expect(profile.format).toBe('ai-mobile-agent-settings');
  expect(profile.version).toBe(1);
  expect(profile.settings.provider).toBe('groq');
  expect(profile.settings.model).toBe('openai/gpt-oss-120b');
  expect(profile.settings.crossProviderFallback).toBe(true);
  expect(json).not.toContain('e2e-private-provider-secret-value');
  expect(json).not.toContain('e2e-private-search-secret-value');
  expect(json).not.toContain('ai_api_key_');
  expect(json).not.toContain('apiKey');
});

test('settings profile import restores preferences while preserving existing provider and search keys', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('before-import');
  await page.locator('#apiKey').fill('e2e-preserved-provider-secret');
  await page.locator('#tavilyKey').fill('e2e-preserved-tavily-secret');
  await page.locator('[data-action="save-settings"]').click();

  const profile = {
    format: 'ai-mobile-agent-settings',
    version: 1,
    settings: {
      provider: 'custom',
      baseUrl: 'https://api.example.test/v1',
      model: 'imported-model-id',
      systemPrompt: 'Профильный системный промпт',
      mode: 'deep',
      search: false,
      multiAgent: true,
      offline: true,
      crossProviderFallback: false
    }
  };
  await page.locator('#settingsProfileFile').setInputFiles({
    name: 'ai-mobile-agent-settings.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(profile))
  });
  await expect(page.locator('#toast')).toContainText('Профиль импортирован');
  await expect(page.locator('#providerPreset')).toHaveValue('custom');
  await expect(page.locator('#baseUrl')).toHaveValue('https://api.example.test/v1');
  await expect(page.locator('#modelName')).toHaveValue('imported-model-id');
  await expect(page.locator('#modeDeep')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#toggleSearch')).not.toBeChecked();
  await expect(page.locator('#toggleMultiAgent')).toBeChecked();
  await expect(page.locator('#offlineToggle')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#apiKey')).toHaveValue('e2e-preserved-provider-secret');
  await expect(page.locator('#tavilyKey')).toHaveValue('e2e-preserved-tavily-secret');
  expect(await page.evaluate(() => localStorage.getItem('ai_api_key_custom'))).toBe('e2e-preserved-provider-secret');
  expect(await page.evaluate(() => localStorage.getItem('ai_tavily_key'))).toBe('e2e-preserved-tavily-secret');
});

test('research trace supports a structured JSON download', async ({ page }) => {
  const trace = {
    schemaVersion: 2, id: 'e2e-json-trace', createdAt: '2026-10-15T00:00:00.000Z',
    provider: 'Groq', model: 'openai/gpt-oss-120b',
    promptFingerprint: 'a'.repeat(64), promptCharCount: 1200,
    plan: 'Plan', draft: 'Draft with evidence URL https://example.test/', critique: 'Critique',
    finalText: 'Final result',
    sources: [{ id: 'S1', title: 'Public API project', url: 'https://example.test/docs', source: 'github', tool: 'public_knowledge_search', excerpt: 'Short source excerpt.' }],
    routes: [{ provider: 'groq', model: 'openai/gpt-oss-120b', stage: 'answer' }]
  };
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.evaluate((traceData) => {
    localStorage.setItem('ai_chats_v87', JSON.stringify([{
      id: 'e2e-trace-chat', title: 'Trace test',
      messages: [{ role: 'assistant', content: traceData.finalText, researchTrace: { id: traceData.id } }]
    }]));
    localStorage.setItem('ai_current_chat_v87', 'e2e-trace-chat');
    localStorage.setItem('ai_research_trace_' + traceData.id, JSON.stringify(traceData));
  }, trace);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="open-trace"][data-trace-id="e2e-json-trace"]').click();
  await expect(page.locator('#traceContent')).toContainText('Метаданные промпта');
  await expect(page.locator('#traceContent a')).toHaveAttribute('href', 'https://example.test/docs');
  await expect(page.locator('#traceContent')).toContainText('Short source excerpt.');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="download-trace-json"]').click();
  const download = await downloadPromise;
  const exportData = JSON.parse(await readFile(await download.path(), 'utf8'));
  expect(exportData.format).toBe('ai-mobile-agent-research-trace');
  expect(exportData.version).toBe(1);
  expect(exportData.trace.id).toBe('e2e-json-trace');
  expect(exportData.trace.routes[0].provider).toBe('groq');
  expect(exportData.trace.finalText).toBe('Final result');
  expect(exportData.trace.promptFingerprint).toBe('a'.repeat(64));
  expect(exportData.trace.promptCharCount).toBe(1200);
  expect(exportData.trace.sources[0].url).toBe('https://example.test/docs');
});


test('research trace captures retrieved source evidence and prompt fingerprint', async ({ page }) => {
  await page.route(/^https:\/\/api\.example\.test\/v1\/chat\/completions$/, async route => {
    const body = route.request().postDataJSON();
    const system = body.messages.find(message => message.role === 'system')?.content || '';
    const hasToolResult = body.messages.some(message => message.role === 'tool');
    let message;
    if (system.includes('Роль: планировщик исследования')) {
      message = { role: 'assistant', content: 'Plan: query a public repository and verify its description.' };
    } else if (system.includes('Роль: исследователь') && !hasToolResult) {
      message = {
        role: 'assistant', content: null,
        tool_calls: [{
          id: 'call-research-source', type: 'function',
          function: { name: 'public_knowledge_search', arguments: JSON.stringify({ source: 'github', query: 'source-demo' }) }
        }]
      };
    } else if (system.includes('Роль: исследователь') && hasToolResult) {
      message = { role: 'assistant', content: 'Draft: the retrieved GitHub repository description supports the claim.' };
    } else if (system.startsWith('Ты независимый проверяющий.')) {
      message = { role: 'assistant', content: 'The draft is limited to what the retrieved description supports.' };
    } else if (system.includes('Роль: синтезатор')) {
      message = { role: 'assistant', content: 'Final answer from source-backed research.' };
    } else {
      message = { role: 'assistant', content: 'Unexpected test stage.' };
    }
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'e2e-research-model', choices: [{ message }] })
    });
  });
  await page.route(/^https:\/\/api\.github\.com\/search\/repositories\?/, route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ items: [{
      full_name: 'demo/source-demo', html_url: 'https://github.com/demo/source-demo',
      stargazers_count: 11, updated_at: '2026-10-15T00:00:00Z',
      description: 'The source excerpt confirms a deterministic test result.'
    }] })
  }));

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-research-model');
  await page.locator('#apiKey').fill('e2e-research-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#toggleMultiAgent').check();
  await page.locator('#userInput').fill('Исследуй репозиторий и приведи источники для проверки.');
  await page.locator('#sendBtn').click();

  await expect(page.locator('#chatBox')).toContainText('Final answer from source-backed research.', { timeout: 20000 });
  const savedTrace = await page.evaluate(() => {
    const key = Object.keys(localStorage).find(name => name.startsWith('ai_research_trace_'));
    return key ? JSON.parse(localStorage.getItem(key)) : null;
  });
  expect(savedTrace).not.toBeNull();
  expect(savedTrace.schemaVersion).toBe(2);
  expect(savedTrace.promptFingerprint).toMatch(/^[a-f0-9]{64}$/);
  expect(savedTrace.promptCharCount).toBeGreaterThan(0);
  expect(savedTrace.sources).toHaveLength(1);
  expect(savedTrace.sources[0].url).toBe('https://github.com/demo/source-demo');
  expect(savedTrace.sources[0].title).toBe('demo/source-demo');
  expect(savedTrace.sources[0].source).toBe('github');
  expect(savedTrace.sources[0].excerpt).toContain('The source excerpt confirms');
  await page.locator('[data-action="open-trace"]').last().click();
  await expect(page.locator('#traceContent')).toContainText('demo/source-demo');
  await expect(page.locator('#traceContent')).toContainText('The source excerpt confirms');
});

test('multi-agent preference skips a greeting and shows the actual route', async ({ page }) => {
  let calls = 0;
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    calls++;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'e2e-actual-model', choices: [{ message: { role: 'assistant', content: 'Привет! Рад помочь.' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-model');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#toggleMultiAgent').check();
  await page.locator('#userInput').fill('Привет!');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Привет! Рад помочь.');
  await expect(page.locator('#chatBox')).toContainText('Свой API · e2e-actual-model (запрошена e2e-model)');
  await expect.poll(() => calls).toBe(1);
});


test('401 stops after the selected provider rejects credentials', async ({ page }) => {
  let calls = 0;
  await page.route('https://api.groq.com/openai/v1/chat/completions', async route => {
    calls++;
    await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: { message: 'invalid credential' } }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('groq');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Auth error test');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Запрос не выполнен.');
  await expect(page.locator('#chatBox')).toContainText('HTTP 401');
  await expect(page.locator('#chatBox')).toContainText('Проверьте API-ключ.');
  await expect.poll(() => calls).toBe(1);
});

test('transient 503 retries only the same model and never fans out', async ({ page }) => {
  const attemptedModels = [];
  await page.route('https://api.groq.com/openai/v1/chat/completions', async route => {
    attemptedModels.push(route.request().postDataJSON().model);
    await route.fulfill({
      status: 503,
      headers: { 'Retry-After': '0' },
      contentType: 'application/json',
      body: JSON.stringify({ error: { message: 'temporarily unavailable' } })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('groq');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Check transient server error handling');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('HTTP 503');
  await expect.poll(() => attemptedModels.length).toBe(2);
  expect(attemptedModels).toEqual(['openai/gpt-oss-120b', 'openai/gpt-oss-120b']);
});

test('model-specific failure tries another model on the same provider first', async ({ page }) => {
  const attemptedModels = [];
  await page.route('https://api.groq.com/openai/v1/chat/completions', async route => {
    const payload = route.request().postDataJSON();
    attemptedModels.push(payload.model);
    if (attemptedModels.length === 1) {
      await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: { message: 'model not found' } }) });
      return;
    }
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: payload.model, choices: [{ message: { role: 'assistant', content: 'Fallback worked.' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('groq');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Check same-provider model fallback');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Fallback worked.');
  await expect(page.locator('#chatBox')).toContainText('Groq · qwen/qwen3.8-27b');
  await expect.poll(() => attemptedModels.length).toBe(2);
  await page.getByRole('button', { name: 'Настройки' }).click();
  await expect(page.locator('#providerPreset')).toHaveValue('groq');
  await expect(page.locator('#modelName')).toHaveValue('qwen/qwen3.8-27b');
  await expect(page.locator('#modelPreset')).toHaveValue('qwen/qwen3.8-27b');
  await expect(page.locator('#apiKeyShell')).toHaveAttribute('data-state', 'connected');
  expect(attemptedModels[0]).toBe('openai/gpt-oss-120b');
  expect(attemptedModels[1]).toBe('qwen/qwen3.8-27b');
});


test('history budget adapts to a catalogued model context window', async ({ page }) => {
  let capturedMessages = null;
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [{ id: 'e2e-small-context-model', context_length: 4096 }] })
  }));
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    capturedMessages = route.request().postDataJSON().messages;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'e2e-small-context-model', choices: [{ message: { role: 'assistant', content: 'Context budget test response.' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const oldTurns = Array.from({ length: 8 }, (_, i) => [
    { role: 'user', content: 'OLD_CONTEXT_TURN_' + i + ' ' + 'x'.repeat(650) },
    { role: 'assistant', content: 'OLD_CONTEXT_RESPONSE_' + i + ' ' + 'y'.repeat(200) }
  ]).flat();
  await page.evaluate(messages => {
    localStorage.setItem('ai_chats_v87', JSON.stringify([{ id: 'e2e-context-chat', title: 'Context budget test', messages }]));
    localStorage.setItem('ai_current_chat_v87', 'e2e-context-chat');
  }, oldTurns);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-small-context-model');
  await page.locator('#apiKey').fill('e2e-context-budget-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="refresh-model-catalog"]').click();
  await expect(page.locator('#modelCatalogStatus')).toContainText('1 текстовых моделей');
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#userInput').fill('LATEST_CONTEXT_REQUEST');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Context budget test response.');
  await expect.poll(() => capturedMessages).not.toBeNull();
  const sent = capturedMessages.filter(message => message.role !== 'system');
  const contentText = sent.map(message => String(message.content || '')).join('\n');
  expect(contentText).not.toContain('OLD_CONTEXT_TURN_0');
  expect(contentText).toContain('OLD_CONTEXT_TURN_7');
  expect(contentText).toContain('LATEST_CONTEXT_REQUEST');
  expect(sent.reduce((sum, message) => sum + String(message.content || '').length, 0)).toBeLessThanOrEqual(3400);
});

test('dynamic chat catalog is used for bounded same-provider model fallback', async ({ page }) => {
  const attemptedModels = [];
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [
      { id: 'e2e-primary-model' },
      { id: 'e2e-dynamic-fallback' },
      { id: 'e2e-text-embedding' }
    ] })
  }));
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const model = route.request().postDataJSON().model;
    attemptedModels.push(model);
    if (model === 'e2e-primary-model') {
      await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: { message: 'model not found' } }) });
      return;
    }
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model, choices: [{ message: { role: 'assistant', content: 'Dynamic fallback worked.' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-primary-model');
  await page.locator('#apiKey').fill('e2e-dynamic-catalog-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="refresh-model-catalog"]').click();
  await expect(page.locator('#modelPreset option[value="e2e-dynamic-fallback"]')).toHaveCount(1);
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Use the model catalog for fallback');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Dynamic fallback worked.');
  await expect.poll(() => attemptedModels.length).toBe(2);
  expect(attemptedModels).toEqual(['e2e-primary-model', 'e2e-dynamic-fallback']);
});

test('Pollinations catalog discovers text models and aliases without sending a token', async ({ page }) => {
  let authorizationHeader = '';
  await page.route('https://gen.pollinations.ai/text/models', async route => {
    authorizationHeader = route.request().headers()['authorization'] || '';
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ data: [
        { id: 'publisher/available-text-model', name: 'Available Text Model', aliases: ['old-text-model'] },
        { id: 'publisher/image-generation-model', name: 'Image Model' }
      ] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('pollinations');
  await expect(page.locator('#modelPreset option[value="publisher/available-text-model"]')).toHaveCount(1);
  await expect(page.locator('#modelPreset option[value="old-text-model"]')).toHaveCount(1);
  await expect(page.locator('#modelPreset option[value="publisher/image-generation-model"]')).toHaveCount(0);
  await expect(page.locator('#modelCatalogStatus')).toContainText('2 текстовых моделей');
  expect(authorizationHeader).toBe('');
});

test('Pollinations OAuth callback keeps its access token in sessionStorage only', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('ai_api_provider', 'pollinations');
    localStorage.setItem('ai_api_key_pollinations', 'pk_e2e-public-app-key');
    sessionStorage.setItem('ai_pollinations_oauth_state_v1', 'e2e-state');
    sessionStorage.setItem('ai_pollinations_pkce_verifier_v1', 'e2e-verifier');
    sessionStorage.setItem('ai_pollinations_redirect_uri_v1', location.origin + location.pathname);
    sessionStorage.setItem('ai_pollinations_client_id_v1', 'pk_e2e-public-app-key');
  });
  await page.route('https://enter.pollinations.ai/api/oauth/token', async route => {
    const form = new URLSearchParams(route.request().postData() || '');
    expect(form.get('grant_type')).toBe('authorization_code');
    expect(form.get('code_verifier')).toBe('e2e-verifier');
    expect(form.get('client_id')).toBe('pk_e2e-public-app-key');
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ access_token: 'sk_e2e_temporary_access_token', expires_in: 3600, token_type: 'bearer' })
    });
  });
  await page.goto(APP_PATH + '?code=e2e-auth-code&state=e2e-state', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('ai_pollinations_access_token_v1'))).toBe('sk_e2e_temporary_access_token');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_pollinations_access_token_v1'))).toBeNull();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#providerPreset')).toHaveValue('pollinations');
});

test('Pollinations requests use the OAuth token, not the public App Key', async ({ page }) => {
  let authorization = '';
  await page.route('https://gen.pollinations.ai/v1/chat/completions', async route => {
    authorization = route.request().headers()['authorization'] || '';
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'openai/gpt-5.4-nano', choices: [{ message: { role: 'assistant', content: 'Pollinations route worked.' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('pollinations');
  await page.locator('#apiKey').fill('pk_e2e-public-app-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.evaluate(() => {
    sessionStorage.setItem('ai_pollinations_access_token_v1', 'sk_e2e_temporary_access_token');
    sessionStorage.setItem('ai_pollinations_access_expires_at_v1', String(Date.now() + 3600000));
  });
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Pollinations routing test');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Pollinations route worked.');
  await expect.poll(() => authorization).toBe('Bearer sk_e2e_temporary_access_token');
});

test('Cloudflare endpoint is built from Account ID and HF uses the Inference Providers router', async ({ page }) => {
  const cloudflareId = '0123456789abcdef0123456789abcdef';
  await page.route(/\/ai\/models\/search\?/, route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ result: [{ name: '@cf/openai/gpt-oss-120b', task: 'text-generation' }, { name: '@cf/bge/embedding', task: 'text-generation' }] })
  }));
  await page.route('https://router.huggingface.co/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [
      { id: 'openai/gpt-oss-120b:fastest', architecture: { input_modalities: ['text'], output_modalities: ['text'] } },
      { id: 'sentence-transformers/all-MiniLM-L6-v2', architecture: { input_modalities: ['text'], output_modalities: ['embeddings'] } }
    ] })
  }));
  let cloudflareModel = '';
  await page.route('https://api.cloudflare.com/client/v4/accounts/' + cloudflareId + '/ai/v1/chat/completions', async route => {
    cloudflareModel = route.request().postDataJSON().model;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: cloudflareModel, choices: [{ message: { role: 'assistant', content: 'Cloudflare route worked.' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('cloudflare');
  await page.locator('#cloudflareAccountId').fill(cloudflareId);
  await expect(page.locator('#baseUrl')).toHaveValue('https://api.cloudflare.com/client/v4/accounts/' + cloudflareId + '/ai/v1');
  await page.locator('#apiKey').fill('not-a-real-cloudflare-token');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Cloudflare routing test');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Cloudflare route worked.');
  await expect.poll(() => cloudflareModel).toBe('@cf/openai/gpt-oss-120b');

  let hfModel = '';
  await page.route('https://router.huggingface.co/v1/chat/completions', async route => {
    hfModel = route.request().postDataJSON().model;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: hfModel, choices: [{ message: { role: 'assistant', content: 'Hugging Face route worked.' } }] })
    });
  });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('huggingface');
  await page.locator('#apiKey').fill('not-a-real-huggingface-token');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Hugging Face routing test');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Hugging Face route worked.');
  await expect.poll(() => hfModel).toBe('openai/gpt-oss-120b:fastest');
});
