import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

async function configureCustomProvider(page) {
  await page.locator('[data-action="toggle-settings"]').click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(element => element.open))) {
    await page.locator('#legacyProviderSettings > summary').click();
  }
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('studio-settings-model');
  await page.locator('#apiKey').fill('e2e-studio-settings-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').first().click();
}

async function readCurrentChatSettings(page) {
  return page.evaluate(() => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    const current = localStorage.getItem('ai_current_chat_v87');
    const chat = chats.find(item => item.id === current);
    return {
      processingMode: chat?.processingMode,
      searchMode: chat?.searchMode,
      multiAgentEnabled: chat?.multiAgentEnabled,
      skillPreset: chat?.skillPreset
    };
  });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('Research Studio is a settings-only mode panel and keeps the task in the main composer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const draft = 'Compare official sources about browser security and cite the evidence.';
  await page.locator('#userInput').fill(draft);
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#sidebar [data-action="open-research-studio"]').click();

  const studio = page.getByRole('dialog', { name: 'Студия исследования' });
  await expect(studio).toBeVisible();
  await expect(page.locator('#researchStudioPrompt')).toHaveCount(0);
  await expect(page.locator('#researchStudioEffort')).toHaveValue('fast');
  await expect(page.locator('#researchStudioSearchMode')).toHaveValue('normal');
  await expect(page.locator('#researchStudioStructured')).not.toBeChecked();
  await expect(page.locator('#researchStudioSettingsSummary')).toContainText('Быстро · Веб: обычный · Прямой · Авто');
  await expect(page.locator('#userInput')).toHaveValue(draft);

  const studioBox = await studio.boundingBox();
  expect(studioBox).not.toBeNull();
  expect(studioBox.width).toBeLessThanOrEqual(390);
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(390);
  await expect(page.locator('#researchStudioModal [data-action="close-research-studio"]')).toHaveCount(2);

  await page.locator('#researchStudioModal header [data-action="close-research-studio"]').click();
  await expect(studio).toBeHidden();
  await expect(page.locator('#userInput')).toHaveValue(draft);
  expect(await readCurrentChatSettings(page)).toEqual({
    processingMode: 'fast', searchMode: 'normal', multiAgentEnabled: false, skillPreset: 'auto'
  });
});

test('Research Studio applies selected settings without sending or replacing the composer draft', async ({ page }) => {
  let modelCalls = 0;
  await page.route('https://api.example.test/v1/models', async route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'studio-settings-model' }] })
  }));
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    modelCalls++;
    return route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'studio-settings-model', choices: [{ message: { role: 'assistant', content: 'Unexpected request.' } }] })
    });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await configureCustomProvider(page);
  const draft = 'Compare three primary sources and identify conflicting evidence.';
  await page.locator('#userInput').fill(draft);
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#sidebar [data-action="open-research-studio"]').click();

  const studio = page.getByRole('dialog', { name: 'Студия исследования' });
  await expect(studio).toBeVisible();
  await page.locator('#researchStudioEffort').selectOption('deep');
  await page.locator('#researchStudioSearchMode').selectOption('normal');
  await page.locator('#researchStudioStructured').check();
  await page.locator('#researchStudioModal [data-action="start-research-studio"]').click();

  await expect(studio).toBeHidden();
  await expect(page.locator('#userInput')).toHaveValue(draft);
  await expect(page.locator('#modeDeep')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#searchModeSummary')).toContainText('Обычный');
  await expect(page.locator('#toggleMultiAgent')).toBeChecked();
  await expect(page.locator('#modeHint')).toContainText('Конвейер');
  expect(await readCurrentChatSettings(page)).toEqual({
    processingMode: 'deep', searchMode: 'normal', multiAgentEnabled: true, skillPreset: 'research'
  });
  expect(modelCalls).toBe(0);
});

test('Research Studio closes on Escape without applying a mode or starting a request', async ({ page }) => {
  let modelCalls = 0;
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    modelCalls++;
    return route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Unexpected request.' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const draft = 'Do not submit this draft.';
  await page.locator('#userInput').fill(draft);
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#sidebar [data-action="open-research-studio"]').click();
  const studio = page.getByRole('dialog', { name: 'Студия исследования' });
  await expect(studio).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(studio).toBeHidden();
  await expect(page.locator('#userInput')).toHaveValue(draft);
  expect(await readCurrentChatSettings(page)).toEqual({
    processingMode: 'fast', searchMode: 'normal', multiAgentEnabled: false, skillPreset: 'auto'
  });
  expect(modelCalls).toBe(0);
});
