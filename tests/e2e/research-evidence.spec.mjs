import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function setDeepResearchMethod(page, method) {
  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="research"]').click();
  await page.locator('#deepResearchMethodSelect').selectOption(method);
  await page.locator('#functionPanelModal .function-panel-close[data-action="close-function-panel"]').click();
}
async function chooseSearchMode(page, mode) {
  await page.locator('#searchModeSummary').click();
  await page.locator(`[data-action="select-search-mode"][data-search-mode="${mode}"]`).click();
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
    } else if (system.startsWith('Ты критик того же выбранного model route')) {
      message = { role: 'assistant', content: JSON.stringify({ claims: [], contradictions: [] }) };
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
  await chooseSearchMode(page, 'normal');
  await setDeepResearchMethod(page, 'multi_step_evidence_report');
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


test('research trace explicitly persists source quotes, claims and contradictions to the scoped Gateway ledger', async ({ page }) => {
  const evidencePosts = [];
  const claimPosts = [];
  const contradictionPosts = [];
  const evidenceIdsBySource = new Map();
  await page.route('https://gateway.example.test/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, content-type',
      'access-control-allow-methods': 'GET, POST, OPTIONS' };
    if (request.method() === 'OPTIONS') await route.fulfill({ status: 204, headers: cors });
    else if (url.pathname === '/v1/capabilities') await route.fulfill({ status: 200, headers: cors,
      contentType: 'application/json', body: JSON.stringify({ rag: { enabled: true, evidence_ledger: true } }) });
    else if (url.pathname === '/v1/rag/evidence' && request.method() === 'POST') {
      const payload = request.postDataJSON(); evidencePosts.push(payload);
      const sourceKey = payload.source_id.split('-').at(-1), evidenceId = 'evidence-fixture-' + sourceKey;
      evidenceIdsBySource.set(sourceKey, evidenceId);
      await route.fulfill({ status: 201, headers: cors, contentType: 'application/json',
        body: JSON.stringify({ status: 'recorded', evidence_id: evidenceId }) });
    } else if (url.pathname === '/v1/rag/evidence/claims' && request.method() === 'POST') {
      const payload = request.postDataJSON(); claimPosts.push(payload);
      await route.fulfill({ status: 201, headers: cors, contentType: 'application/json',
        body: JSON.stringify({ status: 'recorded', evidence_id: 'claim-fixture-' + payload.claim_id }) });
    } else if (url.pathname === '/v1/rag/evidence/contradictions' && request.method() === 'POST') {
      const payload = request.postDataJSON(); contradictionPosts.push(payload);
      await route.fulfill({ status: 201, headers: cors, contentType: 'application/json',
        body: JSON.stringify({ status: 'recorded', evidence_id: 'contradiction-fixture-' + payload.contradiction_id }) });
    } else await route.fulfill({ status: 404, headers: cors, contentType: 'application/json', body: '{}' });
  });
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const payload = route.request().postDataJSON();
    const system = payload.messages.find(item => item.role === 'system')?.content || '';
    const hasToolResult = payload.messages.some(item => item.role === 'tool');
    let message;
    if (system.includes('Роль: планировщик исследования')) {
      message = { role: 'assistant', content: 'Plan: capture two sources and compare their dated claims.' };
    } else if (system.includes('Роль: исследователь') && !hasToolResult) {
      message = { role: 'assistant', content: null, tool_calls: [
        { id: 'read-evidence-page-a', type: 'function', function: { name: 'read_webpage', arguments: JSON.stringify({ url: 'https://example.test/research-evidence-a' }) } },
        { id: 'read-evidence-page-b', type: 'function', function: { name: 'read_webpage', arguments: JSON.stringify({ url: 'https://example.test/research-evidence-b' }) } }
      ] };
    } else if (system.includes('Роль: исследователь') && hasToolResult) {
      message = { role: 'assistant', content: 'Draft: source A states 2025 while source B states 2026.' };
    } else if (system.startsWith('Ты критик того же выбранного model route')) {
      message = { role: 'assistant', content: JSON.stringify({
        claims: [
          { claim_id: 'C1', claim_text: 'Source A reports 2025.', assessment: 'supported', confidence: 0.91, evidence: [{ source_id: 'S1', relation: 'supports' }], rationale: 'The first excerpt states 2025.' },
          { claim_id: 'C2', claim_text: 'Source B reports 2026.', assessment: 'supported', confidence: 0.89, evidence: [{ source_id: 'S2', relation: 'supports' }], rationale: 'The second excerpt states 2026.' }
        ],
        contradictions: [
          { contradiction_id: 'X1', claim_ids: ['C1', 'C2'], evidence_source_ids: ['S1', 'S2'], kind: 'temporal',
            explanation: 'The two source claims report different years.', confidence: 0.87, status: 'open' }
        ]
      }) };
    } else if (system.includes('Роль: синтезатор')) {
      message = { role: 'assistant', content: 'Final answer with two source claims and one contradiction.' };
    } else message = { role: 'assistant', content: 'Unexpected test stage.' };
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'e2e-evidence-model', choices: [{ message }] }) });
  });
  await page.route('https://example.test/research-evidence-a', async route => {
    await route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: 'text/html',
      body: '<html><head><title>Source A</title></head><body>Source A reports the reference year 2025 in its dated statement.</body></html>' });
  });
  await page.route('https://example.test/research-evidence-b', async route => {
    await route.fulfill({ status: 200, headers: { 'access-control-allow-origin': '*' }, contentType: 'text/html',
      body: '<html><head><title>Source B</title></head><body>Source B reports the reference year 2026 in its dated statement.</body></html>' });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await page.evaluate(() => {
    document.getElementById('cloudBaseUrl').value = 'https://gateway.example.test/v1';
    document.getElementById('cloudApiKey').value = 'gateway-test-key';
  });
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-evidence-model');
  await page.locator('#apiKey').fill('test-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await chooseSearchMode(page, 'normal');
  await page.locator('#modeDeep').click();
  await setDeepResearchMethod(page, 'multi_step_evidence_report');
  await page.locator('#userInput').fill('Deep research: compare the two dated sources, validate the claims and preserve any contradiction in the selected Gateway.');
  await page.locator('#sendBtn').click();

  await expect(page.locator('#chatBox')).toContainText('Final answer with two source claims and one contradiction.', { timeout: 20000 });
  await page.locator('#chatBox [data-action="open-trace"]').last().click();
  const traceId = await page.locator('#chatBox [data-action="open-trace"]').last().getAttribute('data-trace-id');
  const trace = await page.evaluate(id => JSON.parse(localStorage.getItem('ai_research_trace_' + id) || 'null'), traceId);
  expect(trace.schemaVersion).toBe(4);
  expect(trace.chatId).toBeTruthy();
  expect(trace.sources).toHaveLength(2);
  expect(trace.claims).toHaveLength(2);
  expect(trace.contradictions).toHaveLength(1);
  expect(evidencePosts).toHaveLength(0);
  expect(claimPosts).toHaveLength(0);
  expect(contradictionPosts).toHaveLength(0);

  const save = page.locator('#traceContent [data-action="persist-trace-evidence"]');
  await expect(save).toBeVisible();
  await save.click();
  await expect(page.locator('#traceEvidenceStatus')).toContainText('Сохранено: выдержек 2; утверждений 2; противоречий 1');
  expect(evidencePosts).toHaveLength(2);
  expect(claimPosts).toHaveLength(2);
  expect(contradictionPosts).toHaveLength(1);
  for (const payload of evidencePosts) {
    expect(payload.scope).toBe('conversation');
    expect(payload.scope_id).toBe(trace.chatId);
    expect(payload.start_offset).toBe(0);
    expect(payload.end_offset).toBe(Array.from(payload.source_text).length);
    expect(payload.metadata.trace_id).toBe(trace.id);
    expect(payload.metadata.capture_kind).toBe('tool_excerpt');
  }
  const claimOne = claimPosts.find(item => item.claim_id === 'C1');
  const claimTwo = claimPosts.find(item => item.claim_id === 'C2');
  expect(claimOne.run_id).toBe(trace.id);
  expect(claimOne.reviewer_mode).toBe('same-model');
  expect(claimOne.evidence_ids).toEqual([evidenceIdsBySource.get('S1')]);
  expect(claimOne.relations).toEqual({ [evidenceIdsBySource.get('S1')]: 'supports' });
  expect(claimTwo.evidence_ids).toEqual([evidenceIdsBySource.get('S2')]);
  expect(claimTwo.relations).toEqual({ [evidenceIdsBySource.get('S2')]: 'supports' });
  expect(contradictionPosts[0].claims).toEqual([
    { claim_id: 'C1', text: 'Source A reports 2025.' },
    { claim_id: 'C2', text: 'Source B reports 2026.' }
  ]);
  expect(contradictionPosts[0].evidence_ids).toEqual([evidenceIdsBySource.get('S1'), evidenceIdsBySource.get('S2')]);
  expect(contradictionPosts[0].reviewer_mode).toBe('same-model');
  const savedTrace = await page.evaluate(id => JSON.parse(localStorage.getItem('ai_research_trace_' + id) || 'null'), traceId);
  expect(savedTrace.evidenceLedger.status).toBe('saved');
  expect(savedTrace.evidenceLedger.saved).toBe(2);
  expect(savedTrace.evidenceLedger.savedClaims).toBe(2);
  expect(savedTrace.evidenceLedger.savedContradictions).toBe(1);
  expect(savedTrace.evidenceLedger.claimRecordIdsById.C1).toBe('claim-fixture-C1');
  expect(savedTrace.evidenceLedger.contradictionRecordIdsById.X1).toBe('contradiction-fixture-X1');
});

