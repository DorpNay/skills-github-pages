import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function setAgentMode(page, enabled) {
  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="agents"]').click();
  const control = page.locator('#agentModeControl');
  if (enabled && !(await control.isChecked())) await control.check();
  if (!enabled && await control.isChecked()) await control.uncheck();
  await page.locator('#functionPanelModal [data-action="close-function-panel"]').first().click();
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
  expect(trace.schemaVersion).toBe(2);
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
