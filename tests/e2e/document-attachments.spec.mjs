import { test, expect } from '@playwright/test';

async function chooseSearchMode(page, mode) {
  await page.locator('#searchModeSummary').click();
  await page.locator(`[data-action="select-search-mode"][data-search-mode="${mode}"]`).click();
}


test('PDF attachment is extracted only by the configured aLandi gateway before model submission', async ({ page }) => {
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [{ id: 'e2e-local-model' }] })
  }));

  let extractionRequest = null;
  let submittedUserContent = '';
  await page.route('https://api.example.test/v1/capabilities', async route => {
    expect(route.request().headers().authorization).toBe('Bearer ' + 'd'.repeat(64));
    await route.fulfill({
      status: 200, contentType: 'application/json',
      headers: { 'Cache-Control': 'no-store' },
      body: JSON.stringify({ search: { searxng: false }, audio: { transcription: false, speech: false }, documents: { extraction: true } })
    });
  });
  await page.route(/https:\/\/api\.example\.test\/v1\/documents\/extract\?filename=brief\.pdf$/, async route => {
    extractionRequest = {
      authorization: route.request().headers().authorization,
      contentType: route.request().headers()['content-type'],
      body: (await route.request().postDataBuffer()).toString()
    };
    await route.fulfill({
      status: 200, contentType: 'application/json',
      headers: { 'Cache-Control': 'no-store' },
      body: JSON.stringify({ filename: 'brief.pdf', parser: 'local-pypdf', characters: 31, text: 'Extracted private report content.' })
    });
  });
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const payload = route.request().postDataJSON();
    submittedUserContent = payload.messages.filter(message => message.role === 'user').map(message => message.content).join('\n');
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Document summary ready.' }, finish_reason: 'stop' }] })
    });
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) {
    await page.locator('#legacyProviderSettings > summary').click();
  }
  await page.locator('#cloudBaseUrl').fill('https://api.example.test/v1');
  await page.locator('#cloudModel').fill('e2e-local-model');
  await page.locator('#cloudApiKey').fill('d'.repeat(64));
  await page.locator('[data-action="select-alandi-primary"]').click();
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await chooseSearchMode(page, 'offline');

  await page.locator('[data-action="attach-text-file"]').click();
  await page.locator('[data-action="choose-any-file"]').click();
  await page.locator('#textAttachmentInput').setInputFiles({
    name: 'brief.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-test fixture')
  });
  await expect(page.locator('#draftAttachments')).toContainText('brief.pdf');
  await page.locator('#userInput').fill('Summarize the attached report.');
  await page.locator('#sendBtn').click();

  await expect.poll(() => submittedUserContent).toContain('Extracted private report content.');
  expect(extractionRequest).toEqual({
    authorization: 'Bearer ' + 'd'.repeat(64),
    contentType: 'application/pdf',
    body: '%PDF-test fixture'
  });
  expect(submittedUserContent).toContain('недоверенные справочные данные');
  expect(submittedUserContent).toContain('Summarize the attached report.');
  await expect(page.locator('#chatBox')).toContainText('Document summary ready.');
});
