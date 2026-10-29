import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

async function configureCustomProvider(page) {
  await page.locator('[data-action="toggle-settings"]').click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(element => element.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('studio-settings-model');
  await page.locator('#apiKey').fill('e2e-studio-settings-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
}

async function chooseSearchMode(page, mode) {
  await page.locator('#searchModeSummary').click();
  await page.locator(`[data-action="select-search-mode"][data-search-mode="${mode}"]`).click();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('Search & Research Studio opens on demand and pre-fills the current draft', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('#userInput').fill('Compare official sources about browser security and cite the evidence.');
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#sidebar [data-action="open-research-studio"]').click();

  const studio = page.getByRole('dialog', { name: 'Студия исследования' });
  await expect(studio).toBeVisible();
  await expect(page.locator('#researchStudioPrompt')).toHaveValue('Compare official sources about browser security and cite the evidence.');
  await expect(studio).toContainText('Окно подготовки исследовательского запроса');
  await expect(page.locator('#researchStudioSettingsSummary')).toContainText('Быстро · Веб: обычный · Прямой · Авто');
  const studioBox = await studio.boundingBox();
  expect(studioBox).not.toBeNull();
  expect(studioBox.width).toBeLessThanOrEqual(390);
  const studioActionHeights = await page.locator('#researchStudioModal [data-action="close-research-studio"], #researchStudioModal [data-action="start-research-studio"]').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height));
  expect(studioActionHeights.every(height => height >= 44)).toBe(true);
  const studioHeaderClose = await page.locator('#researchStudioModal header [data-action="close-research-studio"]').boundingBox();
  expect(studioHeaderClose?.width || 0).toBeGreaterThanOrEqual(44);
  const summaryDimensions = await page.locator('#researchStudioSettingsSummary').evaluate(element => ({ clientWidth: element.clientWidth, scrollWidth: element.scrollWidth }));
  expect(summaryDimensions.scrollWidth).toBeLessThanOrEqual(summaryDimensions.clientWidth);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator('#researchStudioDepth')).toHaveCount(0);
  await expect(page.locator('#researchStudioWeb')).toHaveCount(0);

  await page.locator('[data-action="close-research-studio"]').last().click();
  await expect(studio).toBeHidden();
});

test('Research Studio uses current chat settings without mutating them', async ({ page }) => {
  await page.route('https://api.example.test/v1/models', async route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'studio-settings-model' }] })
  }));
  let toolsAvailable = null;
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const body = route.request().postDataJSON();
    toolsAvailable = Array.isArray(body.tools) && body.tools.length > 0;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      model: 'studio-settings-model',
      choices: [{ message: { role: 'assistant', content: 'Studio kept the current chat settings.' } }]
    }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await configureCustomProvider(page);
  await chooseSearchMode(page, 'offline');
  const before = await page.evaluate(() => {
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
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#sidebar [data-action="open-research-studio"]').click();
  const studio = page.getByRole('dialog', { name: 'Студия исследования' });
  await expect(studio).toBeVisible();
  await expect(page.locator('#researchStudioSettingsSummary')).toContainText('Быстро · Веб: выкл. · Прямой · Авто');
  await page.locator('#researchStudioPrompt').fill('Answer using only this message: what is 2 + 2?');
  await page.locator('[data-action="start-research-studio"]').click();
  await expect(page.locator('#chatBox')).toContainText('Studio kept the current chat settings.', { timeout: 20000 });
  const after = await page.evaluate(() => {
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
  expect(after).toEqual(before);
  expect(toolsAvailable).toBe(false);
});

test('Search & Research Studio closes on Escape without starting a request', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#sidebar [data-action="open-research-studio"]').click();
  const studio = page.getByRole('dialog', { name: 'Студия исследования' });
  await expect(studio).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(studio).toBeHidden();
  await expect(page.locator('#searchStatus')).toBeHidden();
});
