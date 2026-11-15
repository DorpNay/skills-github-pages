import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function setAgentMode(page, enabled) {
  await page.locator('#agentModeControl').evaluate((control, value) => {
    control.checked = value;
    control.dispatchEvent(new Event('change', { bubbles: true }));
  }, enabled);
}


const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('research trace captures a source returned by the webpage tool', async ({ page }) => {
  let pageReadCount = 0;
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const payload = route.request().postDataJSON();
    const system = payload.messages.find(item => item.role === 'system')?.content || '';
    const hasToolResult = payload.messages.some(item => item.role === 'tool');
    let message;

    if (system.includes('Роль: планировщик исследования')) {
      message = { role: 'assistant', content: 'Plan: read the public page and verify the excerpt.' };
    } else if (system.includes('Роль: исследователь') && !hasToolResult) {
      message = { role: 'assistant', content: null, tool_calls: [{
        id: 'read-evidence-page', type: 'function',
        function: { name: 'read_webpage', arguments: JSON.stringify({ url: 'https://example.test/research-evidence' }) }
      }] };
    } else if (system.includes('Роль: исследователь') && hasToolResult) {
      message = { role: 'assistant', content: 'Draft: the page provided a concrete excerpt for the claim.' };
    } else if (system.startsWith('Ты независимый проверяющий.')) {
      message = { role: 'assistant', content: 'No material factual issue.' };
    } else if (system.includes('Роль: синтезатор')) {
      message = { role: 'assistant', content: 'Final answer based on the retrieved page.' };
    } else {
      message = { role: 'assistant', content: 'Unexpected test stage.' };
    }

    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'e2e-evidence-model', choices: [{ message }] })
    });
  });

  await page.route('https://example.test/research-evidence', async route => {
    pageReadCount++;
    await route.fulfill({
      status: 200,
      headers: { 'access-control-allow-origin': '*' },
      contentType: 'text/html',
      body: '<html><head><title>Evidence Fixture</title></head><body>The retrieved page contains a unique evidence sentence for this regression test.</body></html>'
    });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-evidence-model');
  await page.locator('#apiKey').fill('test-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await setAgentMode(page, true);
  await page.locator('#userInput').fill('Deep research: проверь публичную страницу, проведи исследование источника, сопоставь утверждения и составь короткий доказательный отчёт.');
  await page.locator('#sendBtn').click();

  await expect(page.locator('#chatBox')).toContainText('Final answer based on the retrieved page.', { timeout: 20000 });
  expect(pageReadCount).toBe(1);
  const traceId = await page.locator('#chatBox [data-action="open-trace"]').last().getAttribute('data-trace-id');
  const trace = await page.evaluate(id => JSON.parse(localStorage.getItem('ai_research_trace_' + id) || 'null'), traceId);
  expect(trace.schemaVersion).toBeGreaterThanOrEqual(2);
  expect(trace.systemPromptCharCount).toBeGreaterThan(0);
  expect(trace.sources).toHaveLength(1);
  expect(trace.sources[0].url).toBe('https://example.test/research-evidence');
  expect(trace.sources[0].excerpt).toContain('The retrieved page contains a unique evidence sentence');
  await page.locator('[data-action="open-trace"]').last().click();
  await expect(page.locator('#traceContent')).toContainText('Источники из инструментов');
  await expect(page.locator('#traceContent a')).toHaveAttribute('href', 'https://example.test/research-evidence');
  await expect(page.locator('#traceContent')).toContainText('The retrieved page contains a unique evidence sentence');
  const markdownPromise = page.waitForEvent('download');
  await page.locator('[data-action="download-trace"]').click();
  const markdown = await markdownPromise;
  const markdownText = await readFile(await markdown.path(), 'utf8');
  expect(markdownText).toContain('https://example.test/research-evidence');
  expect(markdownText).toContain('The retrieved page contains a unique evidence sentence');
});


test('research trace explicitly persists captured excerpts to the scoped Gateway evidence ledger', async ({ page }) => {
  const evidencePosts = [];
  await page.route('https://gateway.example.test/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const cors = {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'authorization, content-type',
      'access-control-allow-methods': 'GET, POST, OPTIONS'
    };
    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: cors });
    } else if (url.pathname === '/v1/capabilities') {
      await route.fulfill({ status: 200, headers: cors, contentType: 'application/json',
        body: JSON.stringify({ rag: { enabled: true, evidence_ledger: true } }) });
    } else if (url.pathname === '/v1/rag/evidence' && request.method() === 'POST') {
      evidencePosts.push(request.postDataJSON());
      await route.fulfill({ status: 201, headers: cors, contentType: 'application/json',
        body: JSON.stringify({ status: 'recorded', evidence_id: 'evidence-fixture-1' }) });
    } else {
      await route.fulfill({ status: 404, headers: cors, contentType: 'application/json', body: '{}' });
    }
  });
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const payload = route.request().postDataJSON();
    const system = payload.messages.find(item => item.role === 'system')?.content || '';
    const hasToolResult = payload.messages.some(item => item.role === 'tool');
    let message;
    if (system.includes('Роль: планировщик исследования')) {
      message = { role: 'assistant', content: 'Plan: capture one source excerpt and preserve provenance.' };
    } else if (system.includes('Роль: исследователь') && !hasToolResult) {
      message = { role: 'assistant', content: null, tool_calls: [{
        id: 'read-evidence-page', type: 'function',
        function: { name: 'read_webpage', arguments: JSON.stringify({ url: 'https://example.test/research-evidence' }) }
      }] };
    } else if (system.includes('Роль: исследователь') && hasToolResult) {
      message = { role: 'assistant', content: 'Draft: the captured source contains the exact evidence sentence.' };
    } else if (system.startsWith('Ты независимый проверяющий.')) {
      message = { role: 'assistant', content: 'No material factual issue.' };
    } else if (system.includes('Роль: синтезатор')) {
      message = { role: 'assistant', content: 'Final answer with the captured source evidence.' };
    } else {
      message = { role: 'assistant', content: 'Unexpected test stage.' };
    }
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'e2e-evidence-model', choices: [{ message }] }) });
  });
  await page.route('https://example.test/research-evidence', async route => {
    await route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' },
      contentType: 'text/html',
      body: '<html><head><title>Evidence Fixture</title></head><body>The retrieved page contains a unique evidence sentence for this regression test.</body></html>' });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    document.getElementById('cloudBaseUrl').value = 'https://gateway.example.test/v1';
    document.getElementById('cloudApiKey').value = 'gateway-test-key';
  });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-evidence-model');
  await page.locator('#apiKey').fill('test-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await setAgentMode(page, true);
  await page.locator('#userInput').fill('Deep research: проверь источник и сохрани доказательный фрагмент в выбранный Gateway.');
  await page.locator('#sendBtn').click();

  await expect(page.locator('#chatBox')).toContainText('Final answer with the captured source evidence.', { timeout: 20000 });
  await page.locator('#chatBox [data-action="open-trace"]').last().click();
  const traceId = await page.locator('#chatBox [data-action="open-trace"]').last().getAttribute('data-trace-id');
  const trace = await page.evaluate(id => JSON.parse(localStorage.getItem('ai_research_trace_' + id) || 'null'), traceId);
  expect(trace.schemaVersion).toBe(3);
  expect(trace.chatId).toBeTruthy();
  expect(trace.sources).toHaveLength(1);
  expect(evidencePosts).toHaveLength(0);

  const save = page.locator('#traceContent [data-action="persist-trace-evidence"]');
  await expect(save).toBeVisible();
  await save.click();
  await expect(page.locator('#traceEvidenceStatus')).toContainText('Сохранено');
  expect(evidencePosts).toHaveLength(1);
  expect(evidencePosts[0].scope).toBe('conversation');
  expect(evidencePosts[0].scope_id).toBe(trace.chatId);
  expect(evidencePosts[0].source_uri).toBe('https://example.test/research-evidence');
  expect(evidencePosts[0].source_text).toBe(trace.sources[0].excerpt);
  expect(evidencePosts[0].start_offset).toBe(0);
  expect(evidencePosts[0].end_offset).toBe(evidencePosts[0].source_text.length);
  expect(evidencePosts[0].metadata.trace_id).toBe(trace.id);
  expect(evidencePosts[0].metadata.capture_kind).toBe('tool_excerpt');
});

