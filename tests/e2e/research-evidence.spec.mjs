import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

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
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-evidence-model');
  await page.locator('#apiKey').fill('test-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#toggleMultiAgent').check();
  await page.locator('#userInput').fill('Исследуй подробно публичную страницу и проверь утверждения по источнику.');
  await page.locator('#sendBtn').click();

  await expect(page.locator('#chatBox')).toContainText('Final answer based on the retrieved page.', { timeout: 20000 });
  expect(pageReadCount).toBe(1);
  const traceId = await page.locator('#chatBox [data-action="open-trace"]').last().getAttribute('data-trace-id');
  const trace = await page.evaluate(id => JSON.parse(localStorage.getItem('ai_research_trace_' + id) || 'null'), traceId);
  expect(trace.schemaVersion).toBe(2);
  expect(trace.systemPromptCharCount).toBeGreaterThan(0);
  expect(trace.sources).toHaveLength(1);
  expect(trace.sources[0].url).toBe('https://example.test/research-evidence');
  expect(trace.sources[0].excerpt).toContain('The retrieved page contains a unique evidence sentence');
  await page.locator('[data-action="open-trace"]').last().click();
  await expect(page.locator('#traceContent')).toContainText('Источники из инструментов');
  await expect(page.locator('#traceContent a')).toHaveAttribute('href', 'https://example.test/research-evidence');
  await expect(page.locator('#traceContent')).toContainText('The retrieved page contains a unique evidence sentence');
});
