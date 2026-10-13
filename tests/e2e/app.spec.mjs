import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test.beforeEach(async ({ page }) => {
  // Every test starts with a clean browser profile; no real provider key is used.
  await page.addInitScript(() => {
    if (sessionStorage.getItem('e2e-cleaned') !== '1') {
      localStorage.clear();
      sessionStorage.setItem('e2e-cleaned', '1');
    }
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
  await expect(page.locator('#toggleMultiAgent')).toBeVisible();

  await page.getByRole('button', { name: 'Настройки' }).click();
  await expect(page.locator('#settingsModal')).toBeVisible();
  await expect(page.locator('#providerPreset')).toHaveValue('gemini');
  await expect(page.locator('#apiKey')).toHaveAttribute('type', 'password');
  await page.locator('[data-action="close-settings"]').click();

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
  await expect(page.locator('#chatBox')).toContainText('Не удалось выполнить запрос ни через одну сохранённую модель', { timeout: 15000 });
});
