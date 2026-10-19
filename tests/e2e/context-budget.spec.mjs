import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('e2e-budget-cleaned') !== '1') {
      localStorage.clear();
      sessionStorage.setItem('e2e-budget-cleaned', '1');
    }
  });
});

test('known model context window bounds retained conversation history', async ({ page }) => {
  let sent = null;
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [{ id: 'small-window-model', context_length: 4096 }] })
  }));
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    sent = route.request().postDataJSON().messages;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'small-window-model', choices: [{ message: { role: 'assistant', content: 'Context trimming verified.' } }] })
    });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const messages = Array.from({ length: 8 }, (_, i) => [
    { role: 'user', content: 'OLD_TURN_' + i + ' ' + 'x'.repeat(650) },
    { role: 'assistant', content: 'OLD_REPLY_' + i + ' ' + 'y'.repeat(200) }
  ]).flat();
  await page.evaluate(items => {
    localStorage.setItem('ai_chats_v87', JSON.stringify([{ id: 'budget-chat', title: 'Budget', messages: items }]));
    localStorage.setItem('ai_current_chat_v87', 'budget-chat');
  }, messages);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('small-window-model');
  await page.locator('#apiKey').fill('test-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="refresh-model-catalog"]').click();
  await expect(page.locator('#modelCatalogStatus')).toContainText('1 текстовых моделей');
  await page.locator('[data-action="close-settings"]').click();

  await page.locator('#userInput').fill('LATEST_TURN');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Context trimming verified.');
  await expect.poll(() => sent).not.toBeNull();
  const combined = sent.filter(m => m.role !== 'system').map(m => String(m.content || '')).join('\n');
  expect(combined).not.toContain('OLD_TURN_0');
  expect(combined).toContain('OLD_TURN_7');
  expect(combined).toContain('LATEST_TURN');
  expect(combined.length).toBeLessThanOrEqual(3500);
});

test('large model context retains history beyond the old global caps', async ({ page }) => {
  let sent = null;
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [{ id: 'large-window-model', context_length: 131072 }] })
  }));
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    sent = route.request().postDataJSON().messages;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'large-window-model', choices: [{ message: { role: 'assistant', content: 'Large context retained.' } }] })
    });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const messages = Array.from({ length: 40 }, (_, i) => [
    { role: 'user', content: 'OLD_TURN_' + i + ' ' + 'x'.repeat(700) },
    { role: 'assistant', content: 'OLD_REPLY_' + i + ' ' + 'y'.repeat(200) }
  ]).flat();
  await page.evaluate(items => {
    localStorage.setItem('ai_chats_v87', JSON.stringify([{ id: 'large-budget-chat', title: 'Large budget', messages: items }]));
    localStorage.setItem('ai_current_chat_v87', 'large-budget-chat');
  }, messages);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки' }).click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('large-window-model');
  await page.locator('#apiKey').fill('test-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="refresh-model-catalog"]').click();
  await expect(page.locator('#modelCatalogStatus')).toContainText('1 текстовых моделей');
  await page.locator('[data-action="close-settings"]').click();

  await page.locator('#userInput').fill('LATEST_TURN');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Large context retained.');
  await expect.poll(() => sent).not.toBeNull();
  const retained = sent.filter(message => message.role !== 'system').map(message => String(message.content || '')).join('\n');
  expect(retained).toContain('OLD_TURN_0');
  expect(retained).toContain('OLD_TURN_39');
  expect(retained).toContain('LATEST_TURN');
  expect(retained.length).toBeGreaterThan(24000);
});
