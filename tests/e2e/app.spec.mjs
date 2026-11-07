import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';


async function ensureSidebarOpen(page) {
  const sidebar = page.locator('#sidebar');
  if (await sidebar.evaluate(element => element.classList.contains('-translate-x-full'))) {
    await page.locator('[data-action="toggle-sidebar"]').click();
  }
  await expect(sidebar).not.toHaveClass(/-translate-x-full/);
}

async function ensureSidebarClosed(page) {
  const sidebar = page.locator('#sidebar');
  if (!(await sidebar.evaluate(element => element.classList.contains('-translate-x-full')))) {
    await sidebar.evaluate(element => { element.scrollTop = 0; });
    await sidebar.locator('[data-action="close-sidebar"]').click();
  }
  await expect(sidebar).toHaveClass(/-translate-x-full/);
}

async function openProjectSettingsForId(page, projectId) {
  const sidebar = page.locator('#sidebar');
  if (await sidebar.evaluate(element => element.classList.contains('-translate-x-full'))) {
    await page.locator('[data-action="toggle-sidebar"]').click();
  }
  await expect(page.locator('#projectPanel [data-action="open-project-settings"]:not([data-project-id])')).toHaveCount(0);
  const navigation = page.locator('#projectNavigationList');
  if (await navigation.evaluate(element => element.classList.contains('hidden'))) {
    await page.locator('#projectNavToggle').click();
  }
  const group = page.locator('#projectNavigationList details[data-project-id="' + projectId + '"]');
  if (!(await group.evaluate(element => element.open))) await group.locator(':scope > summary').click();
  await group.locator('[data-action="open-project-settings"]').click();
  await expect(page.locator('#projectSettingsModal')).toBeVisible();
  await expect(page.locator('#currentProjectSelect')).toHaveValue(projectId);
}

async function chooseSearchMode(page, mode) {
  await page.locator('#searchModeSummary').click();
  await page.locator(`[data-action="select-search-mode"][data-search-mode="${mode}"]`).click();
}
async function setAgentMode(page, enabled) {
  await page.locator('#agentModeControl').evaluate((control, value) => {
    control.checked = value;
    control.dispatchEvent(new Event('change', { bubbles: true }));
  }, enabled);
}
async function setSkillPreset(page, preset) {
  await page.locator('#skillPresetSelect').evaluate((control, value) => {
    control.value = value;
    control.dispatchEvent(new Event('change', { bubbles: true }));
  }, preset);
}
async function selectLanguage(page, language) {
  await page.locator('#uiLanguage').selectOption(language);
}

async function openAdditionalSettings(page) {
  const section = page.locator('#additionalSettings');
  if (!(await section.evaluate(element => element.open))) await section.locator(':scope > summary').click();
}

async function configureCustomProvider(page, modelName) {
  await page.locator('[data-action="toggle-settings"]').click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(element => element.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill(modelName);
  await page.locator('#apiKey').fill('e2e-settings-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
}


async function dismissComposerPopoverWithOutsideTap(page, targetSelector) {
  const target = page.locator(targetSelector);
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('#composerPopoverScrim')).toBeHidden();
}

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


test('touch selection is disabled on controls but preserved for message text and inputs', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });

  const styles = await page.evaluate(() => {
    const button = document.querySelector('[data-action="toggle-settings"]');
    const input = document.querySelector('#userInput');
    const message = document.createElement('div');
    message.className = 'assistant-content chat-bubble';
    message.textContent = 'Selectable assistant message';
    document.querySelector('#chatBox').append(message);
    return {
      button: { userSelect: getComputedStyle(button).userSelect, touchAction: getComputedStyle(button).touchAction },
      input: getComputedStyle(input).userSelect,
      message: getComputedStyle(message).userSelect
    };
  });
  expect(styles.button.userSelect).toBe('none');
  expect(styles.button.touchAction).toBe('manipulation');
  expect(styles.input).toBe('text');
  expect(styles.message).toBe('text');
});

test('global system prompt is empty by default and obsolete Gemini reset is absent', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#systemPromptInput')).toHaveValue('');
  await expect(page.locator('[data-action="restore-defaults"]')).toHaveCount(0);
});

test('sidebar order keeps memory above projects and omits the removed Research Studio shortcut', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  const positions = await page.locator('#sidebar').evaluate(sidebar => [
    sidebar.querySelector('#memoryPanel'),
    sidebar.querySelector('#projectPanel'),
    sidebar.querySelector('#projectStatusLine'),
    sidebar.querySelector('#chatSection'),
    sidebar.querySelector('#sidebarPreferences')
  ].map(el => Array.prototype.indexOf.call(sidebar.children, el)));
  expect(positions.every(Number.isInteger)).toBe(true);
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
  await expect(page.locator('#sidebar [data-action="open-research-studio"]')).toHaveCount(0);
  await expect(page.locator('#projectPanel [data-action="open-project-create"]')).toBeVisible();
  const memoryOrder = await page.locator('#memoryPanel').evaluate(panel => [
    Array.prototype.indexOf.call(panel.children, panel.querySelector('#memoryStatusLine')),
    Array.prototype.indexOf.call(panel.children, panel.querySelector('#memoryToolsDetails'))
  ]);
  expect(memoryOrder[0]).toBeLessThan(memoryOrder[1]);
  await expect(page.locator('#projectPanel')).toContainText('Проект');
  await expect(page.locator('#chatSection')).toContainText('Новый личный чат');
  await expect(page.locator('#memoryStatusLine')).toContainText('общая в контексте выкл.');
  await page.locator('#memoryToolsDetails > summary').click();
  await page.locator('#globalMemoryToggle').check();
  await expect(page.locator('#memoryStatusLine')).toContainText('общая в контексте вкл.');
  await expect(page.locator('#projectStatusLine')).toContainText('Личный чат');
});

test('project settings closes on Escape and restores focus to a visible control', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await expect(page.locator('#projectSettingsModal')).toBeVisible();
  await expect(page.locator('#projectNameInput')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(page.locator('#projectSettingsModal')).toBeHidden();
  await expect(page.locator('#appSidebarToggle')).toBeFocused();
});

test('mobile sidebar and modal close controls meet the 44px touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });

  await page.locator('[data-action="toggle-sidebar"]').click();
  const sidebarClose = await page.locator('#sidebar [data-action="close-sidebar"]').boundingBox();
  expect(sidebarClose?.width || 0).toBeGreaterThanOrEqual(44);
  expect(sidebarClose?.height || 0).toBeGreaterThanOrEqual(44);
  await page.locator('#sidebar [data-action="close-sidebar"]').click();

  await page.locator('[data-action="toggle-settings"]').click();
  const settingsClose = await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').boundingBox();
  expect(settingsClose?.width || 0).toBeGreaterThanOrEqual(44);
  expect(settingsClose?.height || 0).toBeGreaterThanOrEqual(44);
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  const projectClose = await page.locator('#projectSettingsModal [data-action="close-project-settings"]').boundingBox();
  expect(projectClose?.width || 0).toBeGreaterThanOrEqual(44);
  expect(projectClose?.height || 0).toBeGreaterThanOrEqual(44);
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();
});

test('theme and language are grouped in compact header controls', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const preferences = page.locator('.header-preferences');
  await expect(preferences).toBeVisible();
  await expect(preferences.locator('#homeThemeToggle')).toBeVisible();
  await expect(preferences.locator('#uiLanguage')).toBeVisible();
  await expect(page.locator('#sidebarThemeToggle')).toHaveCount(0);
  await expect(page.locator('#languageMenu')).toHaveCount(0);
  await expect(page.locator('#languageMenuSidebar')).toHaveCount(0);

  await preferences.locator('#homeThemeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('#uiTheme')).toHaveValue('light');
  await selectLanguage(page, 'en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#userInput')).toHaveAttribute('placeholder', 'Write a message...');
  await expect(preferences.locator('#uiLanguage')).toHaveValue('en');

  await preferences.locator('#homeThemeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await selectLanguage(page, 'ru');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(preferences.locator('#uiLanguage')).toHaveValue('ru');
});

test('aServi and third-party settings are separate mutually exclusive modes', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#aserviSettingsGroup')).toHaveAttribute('open', '');
  await expect(page.locator('#legacyProviderSettings')).not.toHaveAttribute('open');
  await expect(page.locator('#additionalSettings')).not.toHaveAttribute('open');
  await expect(page.locator('#providerPreset option[value="alandi"]')).toHaveCount(0);
  await expect(page.locator('#providerExternalGroup')).not.toHaveAttribute('hidden', '');

  await page.locator('#legacyProviderSettings > summary').click();
  await expect(page.locator('#aserviSettingsGroup')).not.toHaveAttribute('open');
  await expect(page.locator('#legacyProviderSettings')).toHaveAttribute('open', '');
  await expect(page.locator('#providerPreset option[value="gemini"]')).toBeEnabled();

  await page.locator('#additionalSettings > summary').click();
  await expect(page.locator('#aserviSettingsGroup')).not.toHaveAttribute('open');
  await expect(page.locator('#legacyProviderSettings')).toHaveAttribute('open', '');
  await expect(page.locator('#additionalSettings')).toHaveAttribute('open', '');
  await expect(page.locator('#composerPosition')).toHaveValue('bottom');

  await page.locator('#aserviSettingsGroup > summary').click();
  await expect(page.locator('#aserviSettingsGroup')).toHaveAttribute('open', '');
  await expect(page.locator('#legacyProviderSettings')).not.toHaveAttribute('open');
  await expect(page.locator('#additionalSettings')).not.toHaveAttribute('open');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_api_provider'))).toBe('alandi');
});

test('project quick actions open a real create form and persist the chosen memory scope', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await expect(page.locator('#projectPanel > div').first()).toContainText('Создать проект');
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await expect(page.locator('#projectSettingsModal')).toBeVisible();
  await expect(page.locator('#projectManagerDetails')).toHaveAttribute('open', '');
  await expect(page.locator('#projectNameInput')).toHaveValue('');
  await expect(page.locator('#projectMemoryScopeSelect')).toBeEnabled();
  await expect(page.locator('#createProjectSubmit')).toBeVisible();
  await expect(page.locator('#saveProjectSubmit')).toBeHidden();

  await page.locator('#projectNameInput').fill('Shared scope project');
  await page.locator('#projectInstructionsInput').fill('A scoped project instruction');
  await page.locator('#projectMemoryScopeSelect').selectOption('project-and-global');
  await page.locator('#createProjectSubmit').click();
  await expect(page.locator('#projectSettingsStatus')).toContainText('Shared scope project');
  await expect.poll(() => page.evaluate(() => {
    const projects = JSON.parse(localStorage.getItem('ai_projects_v1') || '[]');
    return projects.find(project => project.name === 'Shared scope project')?.memoryScope;
  })).toBe('project-and-global');
  await expect(page.locator('#saveProjectSubmit')).toBeVisible();
  await expect(page.locator('#createProjectSubmit')).toBeHidden();
});

test('language switch localizes provider controls without exposing the internal route', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await selectLanguage(page, 'en');
  await expect(page.locator('#legacyProviderSettings > summary')).toContainText('Third-party providers');
  await expect(page.locator('#providerExternalGroup')).toHaveAttribute('label', 'Third-party providers');
  await expect(page.locator('#providerPreset option[value="alandi"]')).toHaveCount(0);
  await expect(page.locator('#aserviSettingsGroup > summary')).toContainText('aLandi aServi');
  await expect(page.locator('#providerPreset option[value="gemini"]')).toHaveCount(1);
  await expect(page.locator('#providerPreset option[value="custom"]')).toHaveCount(1);
  await selectLanguage(page, 'ru');
});

test('request context stays project-only', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('#contextPickerButton').click();
  await expect(page.locator('#requestContextMenu')).toBeVisible();
  await expect(page.locator('#requestContextMenu')).not.toContainText(/connectors|коннектор|scheduler|планировщик/i);
  await page.locator('#composerPopoverScrim').click({ position: { x: 5, y: 5 } });
  await expect(page.locator('#requestContextMenu')).toBeHidden();
});

test('composer popover dims the page and the first outside tap only dismisses it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('#userInput').fill('SCRIM_FIRST_TAP_SENTINEL');
  await page.locator('#attachTextButton').click();
  await expect(page.locator('#attachmentMenu')).toBeVisible();
  await expect(page.locator('#composerPopoverScrim')).toBeVisible();

  const send = await page.locator('#sendBtn').boundingBox();
  expect(send).not.toBeNull();
  await page.mouse.click(send.x + send.width / 2, send.y + send.height / 2);
  await expect(page.locator('#attachmentMenu')).toBeHidden();
  await expect(page.locator('#composerPopoverScrim')).toBeHidden();
  await expect(page.locator('#userInput')).toHaveValue('SCRIM_FIRST_TAP_SENTINEL');
  await expect(page.locator('#chatBox')).not.toContainText('SCRIM_FIRST_TAP_SENTINEL');
});

test('first outside tap dismisses an open chat row menu without activating the control underneath', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  const menu = page.locator('#sidebar .chat-row-menu').first();
  await expect(menu).toBeVisible();
  await menu.locator('summary').click();
  await expect(menu).toHaveAttribute('open', '');
  await expect(page.locator('#chatRowMenuSidebarScrim')).toBeVisible();
  await page.locator('#chatRowMenuSidebarScrim').click({ position: { x: 12, y: 12 } });
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(page.locator('#projectNavToggle')).toHaveAttribute('aria-expanded', 'false');

  await menu.locator('summary').click();
  await expect(menu).toHaveAttribute('open', '');
  await expect(page.locator('#chatRowMenuPageScrim')).toBeVisible();
  await page.locator('#chatRowMenuPageScrim').click({ position: { x: 350, y: 40 } });
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(page.locator('#sidebarOverlay')).toBeVisible();
});

test('published app boots with aServi selected and concise navigation', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/AI Mobile Agent/);
  await expect(page.locator('#chatBox')).toBeVisible();
  await expect(page.locator('#userInput')).toBeEditable();
  await expect(page.locator('#searchModeSummary')).toBeVisible();
  await expect(page.locator('#searchModeSummary')).toContainText('Обычный');
  await expect(page.locator('#toggleSearch')).toBeChecked();
  await expect(page.locator('#functionsMenu')).toHaveCount(0);
  await expect(page.locator('#aserviSettingsGroup')).toHaveAttribute('open', '');
  await expect(page.locator('#legacyProviderSettings')).not.toHaveAttribute('open');
  await expect(page.locator('#additionalSettings')).not.toHaveAttribute('open');

  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await expect(page.locator('#settingsModal')).toBeVisible();
  await expect(page.locator('#providerPreset')).toHaveValue('');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_api_provider'))).toBe('alandi');
  await expect(page.locator('#providerPreset option[value="alandi"]')).toHaveCount(0);
  await expect(page.locator('#apiKey')).toHaveAttribute('type', 'password');
  await expect(page.locator('#baseUrl')).not.toBeFocused();
  await page.locator('#additionalSettings > summary').click();
  await expect(page.locator('#systemPromptInput')).toHaveAttribute('readonly', '');
  await page.locator('#editSystemPrompt').click();
  await expect(page.locator('#systemPromptInput')).not.toHaveAttribute('readonly', '');
  await page.locator('#editSystemPrompt').click();
  await expect(page.locator('#systemPromptInput')).toHaveAttribute('readonly', '');
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('gemini');
  await page.locator('#modelPreset').selectOption('gemini-3.6-flash');
  await expect(page.locator('#modelName')).toHaveValue('gemini-3.6-flash');
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await chooseSearchMode(page, 'offline');
  await expect(page.locator('#searchModeSummary')).toContainText(/выкл./i);
  await page.reload();
  await expect(page.locator('#searchModeSummary')).toContainText(/выкл./i);
  await chooseSearchMode(page, 'normal');
  await expect(page.locator('#searchModeSummary')).toContainText(/обычный/i);
  await page.locator('#modeDeep').click();
  await expect(page.locator('#modeDeep')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('#modeDeep')).toHaveAttribute('aria-pressed', 'true');
  expect(pageErrors, 'Unexpected uncaught browser errors').toEqual([]);
});

test('provider keys, Tavily key, and model settings remain isolated across switching and reload', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  if (!(await page.locator('#additionalSettings').evaluate(el => el.open))) await page.locator('#additionalSettings > summary').click();
  await openAdditionalSettings(page);
  if (!(await page.locator('#searchToolsSettings').evaluate(el => el.open))) await page.locator('#searchToolsSettings > summary').click();

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
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

  await page.reload();
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
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
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-test-model');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

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
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-model');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await expect(page.locator('#apiKeyShell')).toHaveAttribute('data-state', 'pending');
  await page.locator('[data-action="test-connection"]').click();
  await expect(page.locator('#apiKeyShell')).toHaveAttribute('data-state', 'connected');
  await expect(page.locator('#apiKeyShell')).toHaveAttribute('data-state', 'connected');
  await expect(page.locator('#apiKeyStatus')).toBeHidden();
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

test('switching providers explains an empty API key field inline', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(element => element.open))) {
    await page.locator('#legacyProviderSettings > summary').click();
  }
  await expect(page.locator('#modelCatalogStatus')).toHaveText('Встроенные модели · каталог не обновлён.');
  await expect(page.getByText('Выбери провайдера. Ключ и соединение проверяются автоматически.')).toHaveCount(0);
  await page.locator('#providerPreset').selectOption('custom');
  await expect(page.locator('#apiKey')).toHaveValue('');
  await expect(page.locator('#apiKeyStatus')).toBeVisible();
  await expect(page.locator('#apiKeyStatus')).toHaveText('Ключ не сохранён для выбранного провайдера.');
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
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
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
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
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
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await openAdditionalSettings(page);
  if (!(await page.locator('#searchToolsSettings').evaluate(el => el.open))) await page.locator('#searchToolsSettings > summary').click();
  await page.locator('#providerPreset').selectOption('groq');
  await page.locator('#modelName').fill('openai/gpt-oss-120b');
  await page.locator('#apiKey').fill('e2e-private-provider-secret-value');
  await page.locator('#tavilyKey').fill('e2e-private-search-secret-value');
  await page.locator('#allowCrossProviderFallback').check();
  await page.locator('#readingFontSize').evaluate(element => { element.value = '18'; element.dispatchEvent(new Event('input', { bubbles: true })); element.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.locator('#readingLineHeight').evaluate(element => { element.value = '1.8'; element.dispatchEvent(new Event('input', { bubbles: true })); element.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.locator('#readingContrast').selectOption('high');
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
  expect(profile.settings.readability).toEqual({ fontSize:18, lineHeight:1.8, contrast:'high' });
  expect(json).not.toContain('e2e-private-provider-secret-value');
  expect(json).not.toContain('e2e-private-search-secret-value');
  expect(json).not.toContain('ai_api_key_');
  expect(json).not.toContain('apiKey');
});

test('settings profile import restores preferences while preserving existing provider and search keys', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await openAdditionalSettings(page);
  if (!(await page.locator('#searchToolsSettings').evaluate(el => el.open))) await page.locator('#searchToolsSettings > summary').click();
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
      crossProviderFallback: false,
      readability: { fontSize:19, lineHeight:1.7, contrast:'high' }
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
  await expect(page.locator('#offlineToggle')).toContainText('Веб-поиск выключен');
  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#readingFontSize')).toHaveValue('19');
  await expect(page.locator('#readingLineHeight')).toHaveValue('1.7');
  await expect(page.locator('#readingContrast')).toHaveValue('high');
  await expect(page.locator('#apiKey')).toHaveValue('e2e-preserved-provider-secret');
  await expect(page.locator('#tavilyKey')).toHaveValue('e2e-preserved-tavily-secret');
  expect(await page.evaluate(() => localStorage.getItem('ai_api_key_custom'))).toBe('e2e-preserved-provider-secret');
  expect(await page.evaluate(() => localStorage.getItem('ai_tavily_key'))).toBe('e2e-preserved-tavily-secret');
});

test('research trace supports a structured JSON download', async ({ page }) => {
  const trace = {
    schemaVersion: 2, id: 'e2e-json-trace', createdAt: '2026-10-15T00:00:00.000Z',
    provider: 'Groq', model: 'openai/gpt-oss-120b',
    run: { configuredPromptFingerprint: 'a'.repeat(64), configuredPromptFingerprintAlgorithm: 'sha-256' },
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
  await expect(page.locator('#traceContent')).toContainText('Источники из инструментов');
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
  expect(exportData.trace.sources[0].url).toBe('https://example.test/docs');
});

test('research trace records prompt fingerprint, run settings, timings, and model attempts without storing prompt text', async ({ page }) => {
  const responses = [
    '1. Найти проверяемые утверждения.\n2. Сопоставить их с источниками.\n3. Проверить итог.',
    'Черновик: утверждения следует сопоставлять с источниками.',
    'Существенных замечаний нет.',
    'Итог: факты необходимо связывать с проверяемыми источниками.'
  ];
  const requests = [];
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const payload = route.request().postDataJSON();
    const lastMessage = payload.messages?.at(-1)?.content;
    // Provider save triggers a model-connectivity probe; it is not research stage 1.
    if (lastMessage === 'Reply with exactly OK. No other words.') {
      return route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ model: payload.model, choices: [{ message: { role: 'assistant', content: 'OK' } }] })
      });
    }
    requests.push(payload);
    const content = responses[Math.min(requests.length - 1, responses.length - 1)];
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        model: payload.model,
        choices: [{ message: { role: 'assistant', content } }]
      })
    });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-trace-model');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await chooseSearchMode(page, 'offline');
  await setAgentMode(page, true);
  await page.locator('#userInput').fill('Deep research: исследуй и проверь процесс проверки фактов по источникам; составь доказательный отчёт с планом, сравнением и итоговой проверкой.');
  await page.locator('#sendBtn').click();

  await expect(page.locator('#chatBox')).toContainText('Итог: факты необходимо связывать', { timeout: 20000 });
  await expect.poll(() => requests.length).toBe(4);
  const traceButton = page.locator('#chatBox [data-action="open-trace"]').last();
  await expect(traceButton).toBeVisible();
  const traceId = await traceButton.getAttribute('data-trace-id');
  const trace = await page.evaluate(id => JSON.parse(localStorage.getItem('ai_research_trace_' + id) || 'null'), traceId);
  expect(trace.schemaVersion).toBe(2);
  expect(trace.run.workflow).toBe('research');
  expect(trace.run.mode).toBe('fast');
  expect(trace.run.webSearchEnabled).toBe(false);
  expect(trace.run.multiAgentEnabled).toBe(true);
  expect(trace.run.crossProviderFallbackEnabled).toBe(false);
  expect(trace.run.startedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  expect(trace.run.durationMs).toBeGreaterThanOrEqual(0);
  expect(trace.systemPromptCharCount).toBeGreaterThan(0);
  if (trace.run.configuredPromptFingerprintAlgorithm === 'sha-256') {
    expect(trace.run.configuredPromptFingerprint).toMatch(/^[a-f0-9]{64}$/);
  } else {
    expect(trace.run.configuredPromptFingerprintAlgorithm).toBe('fnv1a-fallback');
    expect(trace.run.configuredPromptFingerprint).toMatch(/^fnv-[a-f0-9]+-\d+$/);
  }
  expect(trace.attempts).toHaveLength(4);
  expect(trace.attempts.every(attempt => attempt.success === true && attempt.elapsedMs >= 0)).toBe(true);
  expect(trace.routes).toHaveLength(4);
  expect(trace.routes.every(route => route.elapsedMs >= 0 && route.attemptIndex === 1)).toBe(true);
  expect(JSON.stringify(trace)).not.toContain('not-a-real-key');
  expect(JSON.stringify(trace)).not.toContain('apiKey');
});

test('multi-agent preference skips a greeting and shows the actual route', async ({ page }) => {
  let calls = 0;
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const payload = route.request().postDataJSON();
    const lastMessage = payload.messages?.at(-1)?.content;
    // Saving a custom provider performs a connectivity probe, not a chat completion.
    if (lastMessage === 'Reply with exactly OK. No other words.') {
      return route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ model: payload.model, choices: [{ message: { role: 'assistant', content: 'OK' } }] })
      });
    }
    calls++;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'e2e-actual-model', choices: [{ message: { role: 'assistant', content: 'Привет! Рад помочь.' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-model');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await setAgentMode(page, true);
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
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('groq');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
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
    const payload = route.request().postDataJSON();
    if (payload.messages?.at(-1)?.content === 'Check transient server error handling') attemptedModels.push(payload.model);
    await route.fulfill({
      status: 503,
      headers: { 'Retry-After': '0' },
      contentType: 'application/json',
      body: JSON.stringify({ error: { message: 'temporarily unavailable' } })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('groq');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
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
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('groq');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Check same-provider model fallback');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Fallback worked.');
  await expect(page.locator('#chatBox')).toContainText('Groq · qwen/qwen3.8-27b');
  await expect.poll(() => attemptedModels.length).toBe(2);
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await expect(page.locator('#providerPreset')).toHaveValue('groq');
  await expect(page.locator('#modelName')).toHaveValue('qwen/qwen3.8-27b');
  await expect(page.locator('#modelPreset')).toHaveValue('qwen/qwen3.8-27b');
  await expect(page.locator('#apiKeyShell')).toHaveAttribute('data-state', 'connected');
  expect(attemptedModels[0]).toBe('openai/gpt-oss-120b');
  expect(attemptedModels[1]).toBe('qwen/qwen3.8-27b');
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
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-primary-model');
  await page.locator('#apiKey').fill('e2e-dynamic-catalog-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="refresh-model-catalog"]').click();
  await expect(page.locator('#modelPreset option[value="e2e-dynamic-fallback"]')).toHaveCount(1);
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
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
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
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
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('pollinations');
  await page.locator('#apiKey').fill('pk_e2e-public-app-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.evaluate(() => {
    sessionStorage.setItem('ai_pollinations_access_token_v1', 'sk_e2e_temporary_access_token');
    sessionStorage.setItem('ai_pollinations_access_expires_at_v1', String(Date.now() + 3600000));
  });
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
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
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('cloudflare');
  await page.locator('#cloudflareAccountId').fill(cloudflareId);
  await expect(page.locator('#baseUrl')).toHaveValue('https://api.cloudflare.com/client/v4/accounts/' + cloudflareId + '/ai/v1');
  await page.locator('#apiKey').fill('not-a-real-cloudflare-token');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
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
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('huggingface');
  await page.locator('#apiKey').fill('not-a-real-huggingface-token');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Hugging Face routing test');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Hugging Face route worked.');
  await expect.poll(() => hfModel).toBe('openai/gpt-oss-120b:fastest');
});


test('Obsidian Studio and Clean Light preferences persist and respect motion controls', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#homeThemeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_ui_theme_v2'))).toBe('light');

  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await openAdditionalSettings(page);
  await page.locator('#uiMotion').selectOption('off');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_ui_motion_v2'))).toBe('off');
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');

  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await page.locator('#additionalSettings > summary').click();
  await page.locator('#uiMotion').selectOption('auto');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'auto');
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await page.locator('#homeThemeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_ui_theme_v2'))).toBe('dark');
});


test('agent systems skill is routed on demand and its safety contract stays available', async () => {
  const source = await readFile('./index.md', 'utf8');
  const skill = await readFile('./skills/agent-systems.txt', 'utf8');
  expect(source).toContain("isAgentSystemsTask ? 'agent-systems'");
  expect(source).toContain("new URL('skills/' + selectedSkill + '.txt', document.baseURI)");
  expect(skill).toContain('The 64-role catalog is 64 logical roles');
  expect(skill).toContain('Chat memory is isolated by default');
  expect(skill).toContain('Google Drive requires backend OAuth callback');
  expect(skill).toContain('candidate lesson');
});


test('aServi status only turns green after a real model response, and core UX controls work', async ({ page }) => {
  const cloudRequests = [];
  await page.route('https://cloud.example.test/healthz', async route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' })
  }));
  await page.route('https://cloud.example.test/v1/chat/completions', async route => {
    cloudRequests.push(route.request().postDataJSON());
    return route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'qwen3.5:4b', choices: [{ message: { role: 'assistant', content: 'OK' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#clockDigital')).toHaveText(/^\d{2}:\d{2}$/);
  await expect(page.locator('#cloudStatusDot')).toHaveAttribute('data-state', 'disconnected');
  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#legacyProviderSettings')).not.toHaveAttribute('open');
  await expect(page.locator('#cloudStatusDot')).toHaveAttribute('data-state', 'disconnected');
  await page.locator('#cloudBaseUrl').fill('https://cloud.example.test/v1');
  await page.locator('#cloudModel').fill('qwen3.5:4b');
  await page.locator('#cloudApiKey').fill('e2e-cloud-placeholder-key');
  await expect(page.locator('#cloudStatusDot')).toHaveAttribute('data-state', 'disconnected');
  await expect(page.locator('#cloudStatusDot')).toHaveAttribute('data-state', 'connected', { timeout: 15000 });
  await expect(page.locator('#cloudStatus')).toContainText('Подключено');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_api_provider'))).toBe('alandi');
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Verify the primary chat uses my aLandi cloud.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('OK', { timeout: 15000 });
  expect(cloudRequests).toHaveLength(2);
  expect(cloudRequests[1].messages.at(-1).content).toBe('Verify the primary chat uses my aLandi cloud.');
  expect(cloudRequests.every(request => request.model === 'qwen3.5:4b')).toBe(true);
  await selectLanguage(page, 'en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#userInput')).toHaveAttribute('placeholder', 'Write a message...');
  await page.locator('#homeThemeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator('#homeThemeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('Kilo Auto Free is an ordinary provider, loads the no-key catalog, and routes anonymously', async ({ page }) => {
  let authorization = 'not-checked';
  await page.route('https://api.kilo.ai/api/gateway/models', async route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [
      { id: 'kilo-auto/free', name: 'Auto Free' },
      { id: 'minimaxai/minimax-m2.7:free', name: 'MiniMax free test option', architecture: { output_modalities: ['text'] } }
    ] })
  }));
  await page.route('https://api.kilo.ai/api/gateway/chat/completions', async route => {
    authorization = route.request().headers().authorization || '';
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'kilo-auto/free', choices: [{ message: { role: 'assistant', content: 'Kilo route worked.' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#cloudSettingsCard')).not.toContainText('Kilo Auto Free');
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('kilo');
  await expect(page.locator('#kiloPrivacyWarning')).toHaveCount(0);
  await expect(page.locator('#providerHint')).toBeHidden();
  await expect(page.locator('#modelPreset option[value="minimaxai/minimax-m2.7:free"]')).toHaveCount(1, { timeout: 10000 });
  await expect(page.locator('[data-action="use-kilo-free"]')).toHaveCount(0);
  await expect(page.locator('#apiKey')).toHaveValue('');
  await page.locator('[data-action="test-connection"]').click();
  await expect(page.locator('#apiKeyShell')).toHaveAttribute('data-state', 'connected');
  expect(authorization).toBe('');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_cross_provider_fallback'))).not.toBe('true');
});

test('pasting a provider key starts one bounded model-catalog and connection check', async ({ page }) => {
  let probes = 0;
  await page.route('https://api.example.test/v1/models', async route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'e2e-paste-model' }, { id: 'e2e-paste-model-2' }] })
  }));
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    probes++;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'e2e-paste-model', choices: [{ message: { role: 'assistant', content: 'OK' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-paste-model');
  await page.locator('#apiKey').evaluate(el => {
    el.value = 'e2e-pasted-key';
    el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste' }));
  });
  await expect(page.locator('#apiKeyShell')).toHaveAttribute('data-state', 'connected', { timeout: 15000 });
  expect(probes).toBeGreaterThanOrEqual(1);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_api_key_custom'))).toBe('e2e-pasted-key');
});


test('project instructions, project memory, and project bundles stay scoped to the current project', async ({ page }) => {
  let capturedBody = null;
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    capturedBody = route.request().postDataJSON();
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'e2e-project-model', choices: [{ message: { role: 'assistant', content: 'Project scope verified.' } }] })
    });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await page.locator('#projectNameInput').fill('Alpha Project');
  await page.locator('#projectInstructionsInput').fill('ALPHA_PROJECT_INSTRUCTION_SENTINEL');
  await page.locator('[data-action="create-project"]').click();
  const alphaId = await page.locator('#currentProjectSelect').inputValue();
  expect(alphaId).not.toBe('');
  await page.locator('#projectMemoryInput').fill('ALPHA_PROJECT_MEMORY_SENTINEL');
  await page.locator('[data-action="add-project-memory"]').click();
  await expect(page.locator('#projectMemoryBox')).toContainText('ALPHA_PROJECT_MEMORY_SENTINEL');
  await page.locator('#projectMemoryToggle').check();

  const alphaDownloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="export-project"]').click();
  const alphaDownload = await alphaDownloadPromise;
  expect(alphaDownload.suggestedFilename()).toMatch(/^alandi-project-.*\.json$/);
  const alphaPath = await alphaDownload.path();
  const alphaBundle = JSON.parse(await readFile(alphaPath, 'utf8'));
  expect(alphaBundle.format).toBe('alandi-project-bundle');
  expect(alphaBundle.project.instructions).toContain('ALPHA_PROJECT_INSTRUCTION_SENTINEL');
  expect(alphaBundle.project.memory.some(item => item.text === 'ALPHA_PROJECT_MEMORY_SENTINEL')).toBe(true);
  expect(JSON.stringify(alphaBundle)).not.toContain('apiKey');
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();

  // Project settings close the sidebar. Reopen it before selecting a personal chat.
  await page.locator('[data-action="toggle-sidebar"]').click();
  // A new chat from the top-level Chats section is personal unless created inside a project group.
  await page.locator('#sidebar [data-action="new-chat"]').click();
  await page.locator('[data-action="toggle-sidebar"]').click();
  await expect(page.locator('#currentProjectSelect')).toHaveValue('');
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await page.locator('#projectNameInput').fill('Beta Project');
  await page.locator('#projectInstructionsInput').fill('BETA_PROJECT_INSTRUCTION_SENTINEL');
  await page.locator('[data-action="create-project"]').click();
  await page.locator('#projectMemoryInput').fill('BETA_PROJECT_MEMORY_SENTINEL');
  await page.locator('[data-action="add-project-memory"]').click();
  await page.locator('#projectMemoryToggle').check();
  const betaId = await page.locator('#currentProjectSelect').inputValue();
  expect(betaId).not.toBe(alphaId);
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();

  const sidebar=page.locator('#sidebar');
  if(await sidebar.evaluate(el=>el.classList.contains('-translate-x-full')))await page.locator('[data-action="toggle-sidebar"]').click();
  if(await page.locator('#projectNavigationList').evaluate(el=>el.classList.contains('hidden')))await page.locator('#projectNavToggle').click();
  const betaGroup=page.locator('#projectNavigationList details[data-project-id="'+betaId+'"]');
  await betaGroup.locator(':scope > summary').click();
  let chatRow=betaGroup.locator('.chat-row').first();
  await chatRow.locator('summary[aria-label="Действия чата"]').click();
  await chatRow.locator('[data-action="chat-project"]').click();
  await expect(page.locator('#chatActionModal')).toBeVisible();
  await page.locator('#chatActionProject').selectOption(alphaId);
  await page.locator('[data-action="chat-action-save"]').click();
  await expect(page.locator('#currentProjectSelect')).toHaveValue(alphaId);
  const alphaGroup=page.locator('#projectNavigationList details[data-project-id="'+alphaId+'"]');
  await alphaGroup.locator(':scope > summary').click();
  chatRow=alphaGroup.locator('.chat-row').first();
  await chatRow.locator('summary[aria-label="Действия чата"]').click();
  await chatRow.locator('[data-action="chat-project"]').click();
  await page.locator('#chatActionProject').selectOption(betaId);
  await page.locator('[data-action="chat-action-save"]').click();
  await expect(page.locator('#currentProjectSelect')).toHaveValue(betaId);
  // Moving projects deliberately clears scoped memory consent; re-enable Beta explicitly.
  await openProjectSettingsForId(page, betaId);
  await page.locator('#projectMemoryToggle').check();
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();

  await ensureSidebarClosed(page);
  await page.locator('[data-action="toggle-settings"]').first().click();
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-project-model');
  await page.locator('#apiKey').fill('e2e-project-placeholder-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

  await page.locator('#userInput').fill('Check which project context is included.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Project scope verified.');
  expect(capturedBody).not.toBeNull();
  const prompt = capturedBody.messages[0].content;
  expect(prompt).toContain('BETA_PROJECT_INSTRUCTION_SENTINEL');
  expect(prompt).toContain('BETA_PROJECT_MEMORY_SENTINEL');
  expect(prompt).not.toContain('ALPHA_PROJECT_INSTRUCTION_SENTINEL');
  expect(prompt).not.toContain('ALPHA_PROJECT_MEMORY_SENTINEL');

  // Import controls live inside the project settings dialog, not in the sidebar.
  // Reopen the dialog with Beta selected before importing a separate Alpha bundle.
  await openProjectSettingsForId(page, betaId);
  await page.locator('#projectSettingsModal [data-action="import-project"]').click();
  await page.locator('#importProjectFile').setInputFiles(alphaPath);
  await expect(page.locator('#projectNameInput')).toHaveValue('Alpha Project (импорт)');
  const importedId = await page.locator('#currentProjectSelect').inputValue();
  expect(importedId).not.toBe(alphaId);
  expect(importedId).not.toBe(betaId);
  await expect(page.locator('#projectInstructionsInput')).toHaveValue('ALPHA_PROJECT_INSTRUCTION_SENTINEL');
  await expect(page.locator('#projectMemoryBox')).toContainText('ALPHA_PROJECT_MEMORY_SENTINEL');
  const allProjects = await page.evaluate(() => JSON.parse(localStorage.getItem('ai_projects_v1') || '[]'));
  expect(allProjects.some(project => project.id === betaId && project.instructions.includes('BETA_PROJECT_INSTRUCTION_SENTINEL'))).toBe(true);
  expect(allProjects.some(project => project.id === importedId && project.instructions.includes('ALPHA_PROJECT_INSTRUCTION_SENTINEL'))).toBe(true);
});

test('deleting a project removes its chats but preserves other projects and chats', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await page.locator('#projectNameInput').fill('Disposable Project');
  await page.locator('[data-action="create-project"]').click();
  const disposableId = await page.locator('#currentProjectSelect').inputValue();
  expect(disposableId).not.toBe('');
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();
  const disposableChatId = await page.evaluate(() => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    return chats.find(chat => chat.projectId)?.id || '';
  });
  expect(disposableChatId).not.toBe('');

  // Project creation closes the sidebar; reopen it to detach the current chat.
  await ensureSidebarOpen(page);
  // Detach the current chat before creating a separate project. The original chat
  // remains in Disposable Project and must be deleted with that project.
  await page.locator('#sidebar [data-action="new-chat"]').click();
  await ensureSidebarOpen(page);
  // createNewChat() already creates an unassigned personal chat; the project selector
  // belongs to the closed Project Settings modal and must not be used here.
  const personalChatProjectId = await page.evaluate(() => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    const current = localStorage.getItem('ai_current_chat_v87');
    return chats.find(chat => chat.id === current)?.projectId || '';
  });
  expect(personalChatProjectId).toBe('');
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await page.locator('#projectNameInput').fill('Keep Project');
  await page.locator('[data-action="create-project"]').click();
  const keepId = await page.locator('#currentProjectSelect').inputValue();
  expect(keepId).not.toBe(disposableId);
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();
  const keepChatId = await page.evaluate((id) => {
    const chats=JSON.parse(localStorage.getItem('ai_chats_v87')||'[]');
    return chats.find(chat=>chat.projectId===id)?.id||'';
  }, keepId);
  expect(keepChatId).not.toBe('');
  await ensureSidebarOpen(page);
  await page.locator('#sidebar [data-action="new-chat"]').click();
  // Project settings selection is independent from the active chat. Select the target
  // while the sidebar is settled, then switch to its chat (which closes the mobile sidebar).
  await ensureSidebarOpen(page);
  if(await page.locator('#projectNavigationList').evaluate(el=>el.classList.contains('hidden')))await page.locator('#projectNavToggle').click();
  const disposableGroup=page.locator('#projectNavigationList details[data-project-id="'+disposableId+'"]');
  await disposableGroup.locator(':scope > summary').click();
  await disposableGroup.locator('[data-action="open-project-settings"]').click();
  await expect(page.locator('#projectSettingsStatus')).toContainText('Disposable Project');
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();
  // Closing project settings leaves the mobile sidebar closed; reopen it before selecting the chat.
  await ensureSidebarOpen(page);
  await disposableGroup.locator(`[data-action="switch-chat"][data-chat-id="${disposableChatId}"]`).click();
  await openProjectSettingsForId(page, disposableId);
  await expect(page.locator('#projectSettingsStatus')).toContainText('Disposable Project');

  page.on('dialog', dialog => dialog.accept());
  await page.locator('#projectSettingsModal [data-action="delete-project"]').click();
  await expect(page.locator('#currentProjectSelect')).not.toHaveValue(disposableId);
  const storedProjects = await page.evaluate(() => JSON.parse(localStorage.getItem('ai_projects_v1') || '[]'));
  expect(storedProjects.some(project => project.id === disposableId)).toBe(false);
  expect(storedProjects.some(project => project.id === keepId)).toBe(true);
  const storedChats = await page.evaluate(() => JSON.parse(localStorage.getItem('ai_chats_v87') || '[]'));
  expect(storedChats.some(chat => chat.id === disposableChatId)).toBe(false);
  expect(storedChats.some(chat => chat.id === keepChatId && chat.projectId === keepId)).toBe(true);
});


test('xAI accepts structured text response envelopes and authenticates with the selected key', async ({ page }) => {
  let requestHeaders = {};
  await page.route('https://api.x.ai/v1/language-models', async route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ models: [
      { id: 'grok-4.7', input_modalities: ['text'], output_modalities: ['text'] },
      { id: 'grok-e2e-alternative', input_modalities: ['text'], output_modalities: ['text'] }
    ] })
  }));
  await page.route('https://api.x.ai/v1/chat/completions', async route => {
    requestHeaders = route.request().headers();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        model: 'grok-4.7',
        choices: [{ message: { role: 'assistant', content: [{ type: 'text', text: 'OK' }] } }]
      })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('xai');
  await page.locator('#apiKey').fill('e2e-xai-placeholder-key');
  await page.locator('#modelName').fill('grok-4.7');
  await page.locator('[data-action="test-connection"]').click();
  await expect(page.locator('#apiKeyShell')).toHaveAttribute('data-state', 'connected');
  expect(requestHeaders.authorization).toBe('Bearer e2e-xai-placeholder-key');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ai_provider_connection_xai') || 'null')?.ok)).toBe(true);
});


test('Deep mode caps tool fan-out, suppresses repeated calls, and still returns a final answer', async ({ page }) => {
  let modelCalls = 0;
  let pageReads = 0;
  let maxModelToolCalls = 0;
  await page.route('https://api.example.test/v1/models', async route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [{ id: 'tool-budget-model' }] })
  }));
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const body = route.request().postDataJSON();
    const lastMessage = body.messages?.at(-1)?.content;
    // Exclude the settings-time provider probe from the user-run execution budget.
    if (lastMessage === 'Reply with exactly OK. No other words.') {
      return route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ model: 'tool-budget-model', choices: [{ message: { role: 'assistant', content: 'OK' } }] })
      });
    }
    modelCalls++;
    const toolsEnabled = Array.isArray(body.tools) && body.tools.length > 0;
    maxModelToolCalls = Math.max(maxModelToolCalls, toolsEnabled ? body.tools.length : 0);
    if (toolsEnabled) {
      const calls = Array.from({ length: 5 }, (_, i) => ({
        id: 'read-page-' + modelCalls + '-' + i,
        type: 'function',
        function: {
          name: 'read_webpage',
          arguments: JSON.stringify({ url: 'https://example.com/page-' + (modelCalls===2&&i<3?1:modelCalls) + '-' + i })
        }
      }));
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          model: 'tool-budget-model',
          choices: [{ message: { role: 'assistant', content: null, tool_calls: calls }, finish_reason: 'tool_calls' }]
        })
      });
      return;
    }
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'tool-budget-model', choices: [{ message: { role: 'assistant', content: 'Completed within the tool budget.' } }] })
    });
  });
  await page.route('https://example.com/**', async route => {
    pageReads++;
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET' },
      body: '<html><body><main>Sample public page content for bounded-tool testing.</main></body></html>'
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('tool-budget-model');
  await page.locator('#apiKey').fill('e2e-tool-budget-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await page.locator('#modeDeep').click();
  await chooseSearchMode(page, 'normal');
  await page.locator('#userInput').fill('Read several public pages and summarize the useful evidence.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Completed within the tool budget.', { timeout: 30000 });
  expect(pageReads).toBe(8);
  expect(modelCalls).toBeLessThanOrEqual(5);
  expect(maxModelToolCalls).toBe(3);
});



test('expanded web search does not expand the quick execution budget', async ({ page }) => {
  let modelCalls = 0;
  const toolAvailability = [];
  let tavilyMaxResults = 0;
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const body = route.request().postDataJSON();
    modelCalls++;
    toolAvailability.push(Array.isArray(body.tools) && body.tools.length > 0);
    if (modelCalls === 1) {
      expect(body.tools?.some(tool => tool.function?.name === 'web_search')).toBe(true);
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
        model: 'effort-search-model',
        choices: [{ message: { role: 'assistant', content: null, tool_calls: [{
          id: 'expanded-search-call', type: 'function',
          function: { name: 'web_search', arguments: JSON.stringify({ query: 'expanded search fixture' }) }
        }] }, finish_reason: 'tool_calls' }]
      }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      model: 'effort-search-model', choices: [{ message: { role: 'assistant', content: 'Expanded search completed in quick mode.' } }]
    }) });
  });
  await page.route('https://api.tavily.com/search', async route => {
    tavilyMaxResults = route.request().postDataJSON().max_results;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      results: Array.from({ length: 6 }, (_, index) => ({
        title: 'Expanded result ' + index,
        url: 'https://example.com/expanded-' + index,
        content: 'Expanded search evidence ' + index
      }))
    }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await configureCustomProvider(page, 'effort-search-model');
  await page.evaluate(() => localStorage.setItem('ai_tavily_key', 'e2e-tavily-key'));
  await chooseSearchMode(page, 'more');
  await expect(page.locator('#modeFast')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#userInput').fill('Find evidence using expanded web search.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Expanded search completed in quick mode.', { timeout: 20000 });
  expect(tavilyMaxResults).toBe(6);
  expect(toolAvailability).toEqual([true, false]);
  expect(modelCalls).toBe(2);
});

test('thorough processing keeps standard web-search breadth', async ({ page }) => {
  let modelCalls = 0;
  const toolAvailability = [];
  let tavilyMaxResults = 0;
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const body = route.request().postDataJSON();
    modelCalls++;
    toolAvailability.push(Array.isArray(body.tools) && body.tools.length > 0);
    if (modelCalls === 1) {
      expect(body.tools?.some(tool => tool.function?.name === 'web_search')).toBe(true);
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
        model: 'effort-search-model',
        choices: [{ message: { role: 'assistant', content: null, tool_calls: [{
          id: 'standard-search-call', type: 'function',
          function: { name: 'web_search', arguments: JSON.stringify({ query: 'standard search fixture' }) }
        }] }, finish_reason: 'tool_calls' }]
      }) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      model: 'effort-search-model', choices: [{ message: { role: 'assistant', content: 'Standard search completed in thorough mode.' } }]
    }) });
  });
  await page.route('https://api.tavily.com/search', async route => {
    tavilyMaxResults = route.request().postDataJSON().max_results;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      results: Array.from({ length: 3 }, (_, index) => ({
        title: 'Standard result ' + index,
        url: 'https://example.com/standard-' + index,
        content: 'Standard search evidence ' + index
      }))
    }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await configureCustomProvider(page, 'effort-search-model');
  // saveSettings() persists the provider form and may overwrite localStorage; seed Tavily afterwards.
  await page.evaluate(() => localStorage.setItem('ai_tavily_key', 'e2e-tavily-key'));
  expect(await page.evaluate(() => localStorage.getItem('ai_tavily_key'))).toBe('e2e-tavily-key');
  await page.locator('#modeDeep').click();
  await chooseSearchMode(page, 'normal');
  await page.locator('#userInput').fill('Find evidence using standard web search carefully.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Standard search completed in thorough mode.', { timeout: 20000 });
  expect(tavilyMaxResults).toBe(3);
  expect(toolAvailability).toEqual([true, true]);
  expect(modelCalls).toBe(2);
});

test('task profiles add instructions without granting web tools or structured workflow', async ({ page }) => {
  let webToolsAvailable = null;
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const body = route.request().postDataJSON();
    webToolsAvailable = Array.isArray(body.tools) && body.tools.some(tool => ['web_search', 'public_knowledge_search', 'read_webpage'].includes(tool.function?.name));
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      model: 'effort-search-model', choices: [{ message: { role: 'assistant', content: 'Task-profile response completed.' } }]
    }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await configureCustomProvider(page, 'effort-search-model');
  await chooseSearchMode(page, 'offline');
  await setSkillPreset(page, 'code-review');
  await page.locator('#userInput').fill('Review this small snippet: const value = 1;');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Task-profile response completed.', { timeout: 20000 });
  expect(webToolsAvailable).toBe(false);
  const settings = await page.evaluate(() => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    const current = localStorage.getItem('ai_current_chat_v87');
    const chat = chats.find(item => item.id === current);
    return { skillPreset: chat?.skillPreset, multiAgentEnabled: chat?.multiAgentEnabled };
  });
  expect(settings).toEqual({ skillPreset: 'code-review', multiAgentEnabled: false });
});

test('thorough mode with web search off does not expose web tools', async ({ page }) => {
  let toolsAvailable = null;
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const body = route.request().postDataJSON();
    toolsAvailable = Array.isArray(body.tools) && body.tools.length > 0;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      model: 'effort-search-model', choices: [{ message: { role: 'assistant', content: 'Offline thorough analysis completed.' } }]
    }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await configureCustomProvider(page, 'effort-search-model');
  await page.locator('#modeDeep').click();
  await chooseSearchMode(page, 'offline');
  await page.locator('#userInput').fill('Analyze the supplied context without web access.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Offline thorough analysis completed.', { timeout: 20000 });
  expect(toolsAvailable).toBe(false);
});

test('web_search falls back to public sources when Tavily is not configured', async ({ page }) => {
  let modelCalls = 0, tavilyCalls = 0, publicSourceCalls = 0;
  await page.route('https://api.example.test/v1/models', async route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'open-search-model' }] })
  }));
  await page.route('https://api.tavily.com/**', async route => {
    tavilyCalls++;
    return route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'should not be called without a key' }) });
  });
  await page.route('https://en.wikipedia.org/**', async route => {
    publicSourceCalls++;
    return route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ query: { search: [{ title: 'Open Search Evidence', snippet: 'A public source confirms the fallback works.' }] } }) });
  });
  await page.route('https://api.github.com/search/repositories**', async route => {
    publicSourceCalls++;
    return route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ items: [{ full_name: 'example/open-search', html_url: 'https://github.com/example/open-search', stargazers_count: 7, updated_at: '2026-10-01T00:00:00Z', description: 'Public search fallback fixture' }] }) });
  });
  await page.route('https://hn.algolia.com/**', async route => {
    publicSourceCalls++;
    return route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ hits: [{ title: 'Fallback source result', url: 'https://news.example.test/fallback', points: 3, created_at: '2026-10-01T00:00:00Z', story_text: 'A fallback fixture result.' }] }) });
  });
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    modelCalls++;
    const body = route.request().postDataJSON();
    if (Array.isArray(body.tools) && body.tools.length) {
      const webSearchTool = body.tools.find(tool => tool.function?.name === 'web_search');
      expect(webSearchTool).toBeTruthy();
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
        model: 'open-search-model',
        choices: [{ message: { role: 'assistant', content: null, tool_calls: [{
          id: 'open-search-fallback-call', type: 'function',
          function: { name: 'web_search', arguments: JSON.stringify({ query: 'open search fallback fixture' }) }
        }] }, finish_reason: 'tool_calls' }]
      }) });
    }
    expect(body.messages.some(message => message.role === 'tool' && String(message.content).includes('Open Search Evidence'))).toBe(true);
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      model: 'open-search-model', choices: [{ message: { role: 'assistant', content: 'Open-source fallback completed.' } }]
    }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('open-search-model');
  await page.locator('#apiKey').fill('e2e-open-search-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await chooseSearchMode(page, 'normal');
  await page.locator('#userInput').fill('Find evidence using the keyless open-search fallback.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Open-source fallback completed.', { timeout: 20000 });
  expect(modelCalls).toBe(2);
  expect(publicSourceCalls).toBeGreaterThan(0);
  expect(tavilyCalls).toBe(0);
});


test('Thai public-knowledge search uses Thai Wikipedia and returns a matching source URL', async ({ page }) => {
  let modelCalls = 0;
  let wikipediaRequest = null;
  await page.route('https://api.example.test/v1/models', async route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ data: [{ id: 'thai-search-model' }] })
  }));
  await page.route('https://th.wikipedia.org/w/api.php**', async route => {
    wikipediaRequest = new URL(route.request().url());
    return route.fulfill({
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      contentType: 'application/json',
      body: JSON.stringify({ query: { search: [{
        title: 'ประเทศไทย',
        snippet: 'แหล่งข้อมูลสาธารณะภาษาไทยสำหรับตรวจสอบผลการค้นหา'
      }] } })
    });
  });
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const body = route.request().postDataJSON();
    const lastMessage = body.messages?.at(-1)?.content;
    if (lastMessage === 'Reply with exactly OK. No other words.') {
      return route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ model: 'thai-search-model', choices: [{ message: { role: 'assistant', content: 'OK' } }] })
      });
    }
    modelCalls++;
    if (Array.isArray(body.tools) && body.tools.length) {
      expect(body.tools.some(tool => tool.function?.name === 'public_knowledge_search')).toBe(true);
      return route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ model: 'thai-search-model', choices: [{
          message: { role: 'assistant', content: null, tool_calls: [{
            id: 'thai-wikipedia-call', type: 'function',
            function: { name: 'public_knowledge_search', arguments: JSON.stringify({ source: 'wikipedia', query: 'ประเทศไทย' }) }
          }] }, finish_reason: 'tool_calls'
        }] })
      });
    }
    const toolMessage = body.messages.find(message =>
      message.role === 'tool' && String(message.content).includes('https://th.wikipedia.org/wiki/')
    );
    expect(toolMessage).toBeTruthy();
    const sourceLine = String(toolMessage.content).split(/\r?\n/).find(line => line.startsWith('URL: '));
    expect(sourceLine).toBeTruthy();
    const sourceUrl = new URL(sourceLine.slice(5));
    expect(sourceUrl.hostname).toBe('th.wikipedia.org');
    expect(decodeURIComponent(sourceUrl.pathname)).toBe('/wiki/ประเทศไทย');
    return route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'thai-search-model', choices: [{ message: { role: 'assistant', content: 'Thai Wikipedia source confirmed.' } }] })
    });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('thai-search-model');
  await page.locator('#apiKey').fill('e2e-thai-search-key');
  await page.locator('[data-action="save-settings"]').click();
  await expect(page.locator('#apiKeyShell')).toHaveAttribute('data-state', 'connected', { timeout: 15000 });
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

  await chooseSearchMode(page, 'normal');
  await page.locator('#userInput').fill('ค้นหาข้อมูลเกี่ยวกับประเทศไทย');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Thai Wikipedia source confirmed.', { timeout: 20000 });

  expect(modelCalls).toBe(2);
  expect(wikipediaRequest?.hostname).toBe('th.wikipedia.org');
  expect(wikipediaRequest?.searchParams.get('action')).toBe('query');
  expect(wikipediaRequest?.searchParams.get('origin')).toBe('*');
  expect(wikipediaRequest?.searchParams.get('srsearch')).toBe('ประเทศไทย');
});

test('aLandi cloud probe rejects HTTP 200 proxy text as proof of a model connection', async ({ page }) => {
  await page.route('https://cloud.example.test/v1/chat/completions', async route => route.fulfill({
    status: 200, contentType: 'text/plain; charset=utf-8',
    body: 'upstream unavailable: invalid route'
  }));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#cloudBaseUrl').fill('https://cloud.example.test/v1');
  await page.locator('#cloudModel').fill('qwen3.5:4b');
  await page.locator('#cloudApiKey').fill('e2e-cloud-placeholder-key');
  await expect(page.locator('#cloudStatusDot')).toHaveAttribute('data-state', 'disconnected', { timeout: 15000 });
  await expect(page.locator('#cloudApiKeyError')).toContainText('Не удалось подтвердить соединение');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_alandi_cloud_connection_v1'))).toBe('');
});



test('voice mode menu closes after selecting voice dialogue and keeps gateway setup explicit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const trigger = page.locator('#voiceUnavailableButton');
  await expect(trigger).toBeVisible();

  // Locator.click waits for the element to finish CSS movement before pressing. The composer
  // transitions from its centered welcome state to the mobile bottom dock after page startup.
  await trigger.click({ delay: 100 });
  await expect(page.locator('#voiceMenu')).toBeHidden();
  await trigger.click({ delay: 500 });
  await expect(page.locator('#voiceMenu')).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#voiceMenu')).toContainText('ГОЛОСОВОЙ ДИАЛОГ');
  await expect(page.locator('#voiceMenu')).toContainText('ГОЛОСОВОЕ СООБЩЕНИЕ');
  await page.locator('[data-action="voice-chat-preview"]').click();
  await expect(page.locator('#voiceMenu')).toBeHidden();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#toast')).toContainText('Сначала настрой адрес и ключ собственного gateway.');
});


test('aLandi cloud remains disconnected when the model answers but gateway health check fails', async ({ page }) => {
  await page.route('https://unhealthy-cloud.example.test/healthz', async route => route.fulfill({
    status: 503, contentType: 'application/json', body: JSON.stringify({ status: 'unavailable' })
  }));
  await page.route('https://unhealthy-cloud.example.test/v1/chat/completions', async route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ model: 'qwen3.5:4b', choices: [{ message: { role: 'assistant', content: 'OK' } }] })
  }));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#cloudBaseUrl').fill('https://unhealthy-cloud.example.test/v1');
  await page.locator('#cloudModel').fill('qwen3.5:4b');
  await page.locator('#cloudApiKey').fill('e2e-cloud-placeholder-key');
  await expect(page.locator('#cloudStatusDot')).toHaveAttribute('data-state', 'disconnected', { timeout: 15000 });
  await expect(page.locator('#cloudApiKeyError')).toContainText('Не удалось подтвердить соединение');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_alandi_cloud_connection_v1'))).toBe('');
});

test('provider probe cannot mark changed credentials connected after an in-flight response', async ({ page }) => {
  let beginProbe, releaseProbe;
  const probeStarted = new Promise(resolve => { beginProbe = resolve; });
  const probeGate = new Promise(resolve => { releaseProbe = resolve; });
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'race-model' }] })
  }));
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    beginProbe();
    await probeGate;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'race-model', choices: [{ message: { role: 'assistant', content: 'OK' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('race-model');
  await page.locator('#apiKey').fill('first-race-key');
  await page.locator('[data-action="test-connection"]').click();
  await probeStarted;
  await page.locator('#apiKey').fill('second-race-key');
  releaseProbe();
  await expect(page.locator('#toast')).toContainText('Результат не сохранён', { timeout: 15000 });
  await expect(page.locator('#apiKey')).toHaveValue('second-race-key');
  await expect(page.locator('#apiKeyShell')).not.toHaveAttribute('data-state', 'connected');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_provider_connection_custom'))).toBe('');
});


test('aLandi cloud probe cannot overwrite settings changed while its request is in flight', async ({ page }) => {
  let beginProbe, releaseProbe;
  const probeStarted = new Promise(resolve => { beginProbe = resolve; });
  const probeGate = new Promise(resolve => { releaseProbe = resolve; });
  await page.route('https://race-cloud.example.test/v1/chat/completions', async route => {
    beginProbe();
    await probeGate;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'race-cloud-model', choices: [{ message: { role: 'assistant', content: 'OK' } }] })
    });
  });
  await page.route('https://race-cloud.example.test/healthz', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' })
  }));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#cloudBaseUrl').fill('https://race-cloud.example.test/v1');
  await page.locator('#cloudModel').fill('race-cloud-model');
  await page.locator('#cloudApiKey').fill('first-cloud-race-key');
  await probeStarted;
  await page.locator('#cloudModel').fill('');
  releaseProbe();
  await expect(page.locator('#cloudStatusDot')).toHaveAttribute('data-state', 'disconnected');
  await expect(page.locator('#cloudModel')).toHaveValue('');
  await expect(page.locator('#cloudApiKey')).toHaveValue('first-cloud-race-key');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_alandi_cloud_connection_v1'))).toBe('');
});


test('aServi settings remain separate from legacy provider configuration', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#aserviSettingsGroup')).toHaveAttribute('open', '');
  await expect(page.locator('#cloudBaseUrl')).toBeVisible();
  await expect(page.locator('#providerPreset option[value="alandi"]')).toHaveCount(0);
  await expect(page.locator('#legacyProviderSettings')).not.toHaveAttribute('open');
});

test('local helper suggests compact project-memory facts without saving them automatically', async ({ page }) => {
  const helperRequests = [];
  const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Content-Type': 'application/json' };
  await page.route('https://gateway.example.test/v1/helpers/project-memory-suggestions', async route => {
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: corsHeaders });
    helperRequests.push(route.request().postDataJSON());
    return route.fulfill({ status: 200, headers: corsHeaders, body: JSON.stringify({
      model: 'qwen3.5:0.8b', source_fact_count: 1, candidates: ['Project work must be verified with tests.'], count: 1
    }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('ai_alandi_cloud_base_url', 'https://gateway.example.test/v1');
    localStorage.setItem('ai_api_key_alandi', 'e2e-gateway-placeholder-key');
    localStorage.setItem('ai_base_url', 'https://gateway.example.test/v1');
    localStorage.setItem('ai_api_provider', 'alandi');
    localStorage.setItem('ai_model_name', 'qwen3.5:4b');
    localStorage.setItem('ai_alandi_cloud_model', 'qwen3.5:4b');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await page.locator('#projectNameInput').fill('Helper suggestion project');
  await page.locator('[data-action="create-project"]').click();
  await page.locator('#projectMemoryInput').fill('Keep the main model for synthesis and use small helpers for bounded extraction.');
  await page.locator('[data-action="add-project-memory"]').click();
  await page.locator('#serverMemoryDetails > summary').click();
  await page.locator('[data-action="suggest-helper-memory"]').click();
  await expect.poll(() => helperRequests.length).toBe(1);
  expect(helperRequests[0].facts).toEqual(['Keep the main model for synthesis and use small helpers for bounded extraction.']);
  await expect(page.locator('#helperMemorySuggestionsBox')).toContainText('Project work must be verified with tests.');
  await expect(page.locator('#projectMemoryBox')).not.toContainText('Project work must be verified with tests.');
  await page.locator('[data-action="add-helper-memory-suggestion"]').click();
  await expect(page.locator('#projectMemoryBox')).toContainText('Project work must be verified with tests.');
  expect(helperRequests).toHaveLength(1);
});

test('server project memory bridge is manual and requires both chat opt-ins', async ({ page }) => {
  const serverNodes = [];
  const capturedBodies = [];
  let searchCalls = 0;
  const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Content-Type': 'application/json' };

  await page.route('https://gateway.example.test/v1/memory/graph/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();
    const scopeId = url.searchParams.get('scope_id');
    if (method === 'OPTIONS') return route.fulfill({ status: 204, headers: corsHeaders });
    if (url.pathname.endsWith('/nodes') && method === 'GET') {
      return route.fulfill({ status: 200, headers: corsHeaders,
        body: JSON.stringify({ nodes: serverNodes.filter(node => node.scope_id === scopeId), count: serverNodes.length }) });
    }
    if (url.pathname.endsWith('/nodes') && method === 'POST') {
      const body = request.postDataJSON();
      const node = { id: 'server-node-' + (serverNodes.length + 1), status: 'candidate', ...body };
      serverNodes.push(node);
      return route.fulfill({ status: 201, headers: corsHeaders, body: JSON.stringify({ node }) });
    }
    if (url.pathname.endsWith('/search') && method === 'POST') {
      searchCalls++;
      const body = request.postDataJSON();
      const nodes = serverNodes.filter(node => node.scope === body.scope && node.scope_id === body.scope_id &&
        node.status === 'confirmed' && node.content.includes('SERVER_MEMORY_SENTINEL'));
      return route.fulfill({ status: 200, headers: corsHeaders, body: JSON.stringify({ nodes, count: nodes.length }) });
    }
    if (url.pathname.endsWith('/review') && method === 'POST') {
      const id = url.pathname.split('/').slice(-2)[0];
      const body = request.postDataJSON();
      const node = serverNodes.find(item => item.id === id);
      if (node) node.status = body.status;
      return route.fulfill({ status: 200, headers: corsHeaders, body: JSON.stringify({ node }) });
    }
    return route.fulfill({ status: 404, headers: corsHeaders, body: JSON.stringify({ detail: 'Unmocked graph route' }) });
  });
  await page.route('https://gateway.example.test/v1/chat/completions', async route => {
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: corsHeaders });
    const body = route.request().postDataJSON();
    const requestText = body.messages?.at(-1)?.content;
    if ([
      'Summarize this project.',
      'Use only local project memory.',
      'Server memory is opted in but project memory is not.',
      'Use the approved server project memory.'
    ].includes(requestText)) capturedBodies.push(body);
    return route.fulfill({ status: 200, headers: corsHeaders, body: JSON.stringify({
      model: 'qwen3.5:4b', choices: [{ message: { role: 'assistant', content: 'Bridge response.' }, finish_reason: 'stop' }]
    }) });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('ai_alandi_cloud_base_url', 'https://gateway.example.test/v1');
    localStorage.setItem('ai_api_key_alandi', 'e2e-gateway-placeholder-key');
    localStorage.setItem('ai_base_url', 'https://gateway.example.test/v1');
    localStorage.setItem('ai_api_provider', 'alandi');
    localStorage.setItem('ai_model_name', 'qwen3.5:4b');
    localStorage.setItem('ai_alandi_cloud_model', 'qwen3.5:4b');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await chooseSearchMode(page, 'offline');
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await page.locator('#projectNameInput').fill('Server bridge project');
  await page.locator('[data-action="create-project"]').click();
  const serverMemoryProjectId = await page.locator('#currentProjectSelect').inputValue();
  expect(serverMemoryProjectId).not.toBe('');
  await page.locator('#projectMemoryInput').fill('SERVER_MEMORY_SENTINEL is a local project fact.');
  await page.locator('[data-action="add-project-memory"]').click();
  await expect(page.locator('#projectMemoryBox')).toContainText('SERVER_MEMORY_SENTINEL');
  await expect(page.locator('#serverProjectMemoryToggle')).not.toBeChecked();
  expect(serverNodes).toHaveLength(0); // Local facts are never uploaded automatically.

  await page.locator('#serverMemoryDetails > summary').click();
  await page.locator('[data-action="upload-server-memory"]').click();
  await expect.poll(() => serverNodes.length).toBe(1);
  await expect(page.locator('#serverMemoryBox')).toContainText(/Кандидат|Candidate/);
  await page.locator('[data-action="review-server-memory"][data-review-status="confirmed"]').click();
  await expect.poll(() => serverNodes[0]?.status).toBe('confirmed');
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();

  // Opening project settings already closes the sidebar.
  await expect(page.locator('#sidebar')).toHaveClass(/-translate-x-full/);
  await page.locator('#userInput').fill('Summarize this project.');
  await page.locator('#sendBtn').click();
  await expect.poll(() => capturedBodies.length).toBe(1);
  expect(searchCalls).toBe(0);
  expect(capturedBodies[0].messages[0].content).not.toContain('SERVER_MEMORY_SENTINEL');

  // Project-memory opt-in alone must not invoke the server graph.
  await openProjectSettingsForId(page, serverMemoryProjectId);
  await page.locator('#projectMemoryToggle').check();
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();
  await page.locator('#userInput').fill('Use only local project memory.');
  await page.locator('#sendBtn').click();
  await expect.poll(() => capturedBodies.length).toBe(2);
  expect(searchCalls).toBe(0);
  expect(capturedBodies[1].messages[0].content).toContain('SERVER_MEMORY_SENTINEL');

  // Server-memory opt-in alone must not retrieve server context or bypass project opt-in.
  await openProjectSettingsForId(page, serverMemoryProjectId);
  await page.locator('#projectMemoryToggle').uncheck();
  await page.locator('#serverProjectMemoryToggle').check();
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();
  await page.locator('#userInput').fill('Server memory is opted in but project memory is not.');
  await page.locator('#sendBtn').click();
  await expect.poll(() => capturedBodies.length).toBe(3);
  expect(searchCalls).toBe(0);
  expect(capturedBodies[2].messages[0].content).not.toContain('SERVER_MEMORY_SENTINEL');

  // Only both opt-ins together allow retrieval of confirmed server facts.
  await openProjectSettingsForId(page, serverMemoryProjectId);
  await page.locator('#projectMemoryToggle').check();
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();
  await page.locator('#userInput').fill('Use the approved server project memory.');
  await page.locator('#sendBtn').click();
  await expect.poll(() => capturedBodies.length).toBe(4);
  expect(searchCalls).toBe(1);
  expect(capturedBodies[3].messages[0].content).toContain('SERVER_MEMORY_SENTINEL');
});

test('Markdown fallback preserves tables and escapes HTML when renderer CDNs are unavailable', async ({ page }) => {
  await page.route('https://cdn.jsdelivr.net/npm/marked@18.0.14/marked.min.js', route => route.abort());
  await page.route('https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.4.16/purify.min.js', route => route.abort());
  await page.route('https://api.example.test/v1/chat/completions', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      model: 'e2e-markdown-model',
      choices: [{ message: { role: 'assistant', content: '# Fallback check\n\n| Feature | Status |\n| --- | --- |\n| **Tables** | `readable` |\n\n<img src=x onerror=alert(1)>' } }]
    })
  }));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-markdown-model');
  await page.locator('#apiKey').fill('not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Show the fallback formatting');
  await page.locator('#sendBtn').click();

  const assistantMessage = page.locator('#chatBox .assistant-content').filter({ hasText: 'Fallback check' }).last();
  await expect(assistantMessage.locator('h1')).toHaveText('Fallback check');
  await expect(assistantMessage.locator('table th')).toHaveCount(2);
  await expect(assistantMessage.locator('table td strong')).toHaveText('Tables');
  await expect(assistantMessage.locator('table td code')).toHaveText('readable');
  await expect(assistantMessage.locator('img')).toHaveCount(0);
  await expect(assistantMessage).toContainText('<img src=x onerror=alert(1)>');
});

test('chat row actions are grouped in the right-side menu and rename/clone work', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  const row = page.locator('#chatList .chat-row').first();
  await expect(row.locator('details.chat-row-menu')).toBeVisible();
  await expect(row.locator('button[data-action="delete-chat"]')).toBeHidden();
  await row.locator('summary[aria-label="Действия чата"]').click();
  await expect(row.locator('.chat-row-menu-panel button')).toHaveCount(7);

  await row.locator('[data-action="chat-rename"]').click();
  await expect(page.locator('#chatActionModal')).toBeVisible();
  await page.locator('#chatActionName').fill('Renamed from menu');
  await page.locator('[data-action="chat-action-save"]').click();
  await expect(row.locator('button[data-action="switch-chat"]')).toHaveText('Renamed from menu');

  await row.locator('summary[aria-label="Действия чата"]').click();
  await row.locator('[data-action="chat-clone"]').click();
  await expect(page.locator('#chatList .chat-row')).toHaveCount(2);
  await expect(page.locator('#chatList button[data-action="switch-chat"]').first()).toContainText('Renamed from menu — копия');
  await expect(page.locator('#userInput')).toHaveCSS('font-size', '16px');
});

test('chat menu export is scoped and chat import merges without replacing history', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('#userInput').fill('Keep this existing chat');
  await page.locator('[data-action="toggle-sidebar"]').click();
  const row = page.locator('#chatList .chat-row').first();
  await row.locator('summary[aria-label="Действия чата"]').click();

  const downloadPromise = page.waitForEvent('download');
  await row.locator('[data-action="export-chat"]').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('alandi-chat-');

  await page.locator('#importFile').setInputFiles({
    name: 'imported-chats.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify([{
      id: 'imported-chat-test',
      title: 'Imported chat',
      messages: [{ role: 'user', content: 'Imported content' }],
      processingMode: 'deep',
      searchMode: 'more',
      multiAgentEnabled: true,
      skillPreset: 'research'
    }]))
  });
  await expect(page.locator('#chatList [data-action="switch-chat"]')).toHaveCount(2);
  await expect(page.locator('#chatList')).toContainText('Imported chat');
  await expect(page.locator('#chatBox')).toContainText('Imported content');
  await expect(page.locator('#userInput')).toHaveValue('Keep this existing chat');
});

test('sidebar separates projects from personal chats and keeps navigation collapsible', async ({ page }) => {
  await page.addInitScript(() => {
    const project = (id, name) => ({ id, name, description: '', instructions: '', memoryScope: 'project-only', memory: [], createdAt: '', updatedAt: '' });
    const chat = (id, title, projectId) => ({ id, title, projectId, projectMemoryEnabled: false, serverProjectMemoryEnabled: false, messages: [] });
    localStorage.setItem('ai_projects_v1', JSON.stringify([project('project-alpha','Alpha project'), project('project-beta','Beta project')]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([chat('chat-personal','Personal chat',null),chat('chat-alpha','Alpha project chat','project-alpha'),chat('chat-beta','Beta project chat','project-beta')]));
    localStorage.setItem('ai_current_chat_v87','chat-alpha');
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await expect(page.locator('#projectNavToggle')).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('#projectNavigationList')).toBeHidden();
  await expect(page.locator('#chatSection')).toHaveAttribute('open','');
  await expect(page.locator('#chatList [data-action="switch-chat"]')).toHaveCount(1);
  await expect(page.locator('#chatList [data-action="switch-chat"]')).toContainText('Personal chat');
  await expect(page.locator('#chatList')).not.toContainText('Alpha project chat');
  await expect(page.locator('#memoryToolsDetails')).toBeVisible();
  await expect(page.locator('#memoryToolsDetails')).not.toHaveAttribute('open', '');

  await page.locator('#projectNavToggle').click();
  await expect(page.locator('#projectNavigationList')).toBeVisible();
  const alpha=page.locator('#projectNavigationList details[data-project-id="project-alpha"]');
  await alpha.locator(':scope > summary').click();
  await expect(alpha.locator('[data-action="switch-chat"]')).toHaveCount(1);
  await expect(alpha.locator('[data-action="switch-chat"]')).toContainText('Alpha project chat');
  await expect(page.locator('#chatList [data-action="switch-chat"]')).toHaveCount(1);
});

test('sidebar closes on a horizontal touch swipe without consuming vertical scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await ensureSidebarOpen(page);
  await page.locator('#memoryToolsDetails > summary').click();
  await page.locator('#projectNavToggle').click();
  await expect(page.locator('#projectNavigationList')).toBeVisible();
  await expect(page.locator('#chatSection')).toHaveAttribute('open', '');

  const dispatchSwipe = (start, end, cancelled = false) => page.locator('#sidebar').evaluate((sidebar, points) => {
    const dispatch = (type, point, property) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, property, { value: [{ clientX: point.x, clientY: point.y }] });
      sidebar.dispatchEvent(event);
    };
    dispatch('touchstart', points.start, 'touches');
    if (points.cancelled) {
      dispatch('touchcancel', points.end, 'changedTouches');
      dispatch('touchend', points.end, 'changedTouches');
    } else {
      dispatch('touchend', points.end, 'changedTouches');
    }
  }, { start, end, cancelled });

  await dispatchSwipe({ x: 300, y: 420 }, { x: 285, y: 510 });
  await expect(page.locator('#sidebar')).not.toHaveClass(/-translate-x-full/);
  await dispatchSwipe({ x: 300, y: 420 }, { x: 190, y: 425 }, true);
  await expect(page.locator('#sidebar')).not.toHaveClass(/-translate-x-full/);
  await page.locator('#sidebar').evaluate(sidebar => {
    const dispatch = (type, property, point) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      if (property) Object.defineProperty(event, property, { value: [point] });
      sidebar.dispatchEvent(event);
    };
    const start = { clientX: 300, clientY: 420 };
    const end = { clientX: 190, clientY: 425 };
    dispatch('touchstart', 'touches', start);
    dispatch('pointercancel');
    dispatch('touchend', 'changedTouches', end);
  });
  await expect(page.locator('#sidebar')).not.toHaveClass(/-translate-x-full/);
  await dispatchSwipe({ x: 300, y: 420 }, { x: 190, y: 425 });
  await expect(page.locator('#sidebar')).toHaveClass(/-translate-x-full/);
  await expect(page.locator('#sidebarOverlay')).toBeHidden();
  await expect(page.locator('#memoryToolsDetails')).not.toHaveAttribute('open', '');
  await expect(page.locator('#projectNavigationList')).toBeVisible();
  await expect(page.locator('#chatSection')).toHaveAttribute('open', '');

  await ensureSidebarOpen(page);
  await expect(page.locator('#projectNavigationList')).toBeVisible();
  await expect(page.locator('#chatSection')).toHaveAttribute('open', '');
});

test('composer offers unrestricted file picking but blocks unsupported formats until removed', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#textAttachmentInput')).not.toHaveAttribute('accept', /.+/);
  await expect(page.locator('#textAttachmentInput')).toHaveAttribute('multiple','');
  await page.locator('#attachTextButton').click();
  await expect(page.locator('#attachmentMenu')).toBeVisible();
  await page.locator('[data-action="choose-any-file"]').click();
  await page.locator('#textAttachmentInput').setInputFiles({
    name:'sample.bin',mimeType:'application/octet-stream',buffer:Buffer.from('unsupported binary fixture')
  });
  await expect(page.locator('#draftAttachments')).toContainText('sample.bin');
  await expect(page.locator('#draftAttachments')).toContainText('не распознаётся');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#toast')).toContainText('неподдерживаемые файлы');
  await page.locator('#draftAttachments [data-action="remove-draft-attachment"]').click();
  await page.locator('#attachTextButton').click();
  await page.locator('[data-action="choose-any-file"]').click();
  await page.locator('#textAttachmentInput').setInputFiles({
    name:'notes.md',mimeType:'text/markdown',buffer:Buffer.from('Readable attachment sentinel')
  });
  await expect(page.locator('#userInput')).toHaveValue(/Readable attachment sentinel/);
});

test('request-only project context is sent once and does not change the active chat project', async ({ page }) => {
  const captured=[];
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const body = route.request().postDataJSON();
    const requestText = body.messages?.at(-1)?.content;
    if (['Use Beta context for this one request.', 'Do not include the one-shot project this time.'].includes(requestText)) captured.push(body);
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({model:'context-e2e',choices:[{message:{role:'assistant',content:'Request context verified.'}}]})});
  });
  await page.addInitScript(() => {
    const project=(id,name,instructions)=>({id,name,description:'',instructions,memoryScope:'project-only',memory:[{id:id+'-memory',text:name+' memory sentinel',createdAt:''}],createdAt:'',updatedAt:''});
    const chat=(id,title,projectId)=>({id,title,projectId,projectMemoryEnabled:true,serverProjectMemoryEnabled:false,messages:[]});
    localStorage.setItem('ai_projects_v1',JSON.stringify([project('project-alpha','Alpha project','ALPHA_ONLY_INSTRUCTION'),project('project-beta','Beta project','BETA_ONE_SHOT_INSTRUCTION')]));
    localStorage.setItem('ai_chats_v87',JSON.stringify([chat('chat-alpha','Alpha chat','project-alpha'),chat('chat-beta','Beta chat','project-beta')]));
    localStorage.setItem('ai_current_chat_v87','chat-alpha');
  });
  await page.goto(APP_PATH,{waitUntil:'domcontentloaded'});
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('context-e2e');
  await page.locator('#apiKey').fill('e2e-context-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await expect(page.locator('#currentProjectSelect')).toHaveValue('project-alpha');
  await page.locator('#contextPickerButton').click();
  await page.locator('#requestProjectChecks input[data-request-project-id="project-beta"]').check();
  // The first tap outside the context popover only dismisses it; a second tap opens the sidebar.
  const sidebarToggle=page.locator('[data-action="toggle-sidebar"]');
  const sidebarToggleBox=await sidebarToggle.boundingBox();
  expect(sidebarToggleBox).not.toBeNull();
  await page.mouse.click(sidebarToggleBox.x+sidebarToggleBox.width/2,sidebarToggleBox.y+sidebarToggleBox.height/2);
  await expect(page.locator('#composerPopoverScrim')).toBeHidden();
  await sidebarToggle.click();
  // Selecting one-shot context in Alpha must not leak into Beta if the user switches chats before sending.
  if(await page.locator('#projectNavigationList').evaluate(el=>el.classList.contains('hidden')))await page.locator('#projectNavToggle').click();
  const betaGroup=page.locator('#projectNavigationList details[data-project-id="project-beta"]');
  await betaGroup.locator(':scope > summary').click();
  await betaGroup.locator('[data-action="switch-chat"][data-chat-id="chat-beta"]').click();
  await page.locator('#contextPickerButton').click();
  await expect(page.locator('#requestProjectChecks input[data-request-project-id="project-beta"]')).not.toBeChecked();
  await dismissComposerPopoverWithOutsideTap(page, '#contextPickerButton');
  await page.locator('[data-action="toggle-sidebar"]').click();
  if(await page.locator('#projectNavigationList').evaluate(el=>el.classList.contains('hidden')))await page.locator('#projectNavToggle').click();
  const alphaGroup=page.locator('#projectNavigationList details[data-project-id="project-alpha"]');
  await alphaGroup.locator(':scope > summary').click();
  await alphaGroup.locator('[data-action="switch-chat"][data-chat-id="chat-alpha"]').click();
  await page.locator('#contextPickerButton').click();
  await expect(page.locator('#requestProjectChecks input[data-request-project-id="project-beta"]')).toBeChecked();
  await dismissComposerPopoverWithOutsideTap(page, '#contextPickerButton');
  await page.locator('#userInput').fill('Use Beta context for this one request.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Request context verified.');
  expect(captured).toHaveLength(1);
  expect(captured[0].messages[0].content).toContain('BETA_ONE_SHOT_INSTRUCTION');
  expect(captured[0].messages[0].content).toContain('ALPHA_ONLY_INSTRUCTION');
  await expect(page.locator('#currentProjectSelect')).toHaveValue('project-alpha');

  await page.locator('#userInput').fill('Do not include the one-shot project this time.');
  await page.locator('#sendBtn').click();
  await expect.poll(() => captured.length).toBe(2);
  await expect(page.locator('#chatBox')).toContainText('Request context verified.');
  expect(captured[1].messages[0].content).toContain('ALPHA_ONLY_INSTRUCTION');
  expect(captured[1].messages[0].content).not.toContain('BETA_ONE_SHOT_INSTRUCTION');
  await expect(page.locator('#contextPickerButton')).toHaveAttribute('aria-expanded','false');
});

test('image attachment is sent as multimodal content without persisting image bytes in chat history', async ({ page }) => {
  let captured=null;
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    captured=route.request().postDataJSON();
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({model:'vision-e2e',choices:[{message:{role:'assistant',content:'Image received.'}}]})});
  });
  await page.goto(APP_PATH,{waitUntil:'domcontentloaded'});
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#legacyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('vision-e2e');
  await page.locator('#apiKey').fill('e2e-vision-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await page.locator('#attachTextButton').click();
  await page.locator('[data-action="choose-media"]').click();
  await page.locator('#mediaAttachmentInput').setInputFiles({name:'pixel.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC','base64')});
  await expect(page.locator('#draftAttachments')).toContainText('pixel.png');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Image received.');
  const user=captured.messages.find(message=>message.role==='user');
  expect(Array.isArray(user.content)).toBe(true);
  expect(user.content.some(part=>part.type==='image_url'&&part.image_url.url.startsWith('data:image/png;base64,'))).toBe(true);
  const stored=await page.evaluate(()=>localStorage.getItem('ai_chats_v87')||'');
  expect(stored).not.toContain('data:image/png;base64,');
});


test('warns before browser storage reaches the critical quota threshold', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, 'storage', {
      configurable: true,
      value: { estimate: async () => ({ usage: 80, quota: 100 }) }
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#toast')).toContainText('Хранилище сайта заполнено на 80%');
  await expect(page.locator('#toast')).toContainText('экспортировать чаты');
});

test('gives urgent export guidance at 95% storage use', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, 'storage', {
      configurable: true,
      value: { estimate: async () => ({ usage: 96, quota: 100 }) }
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#toast')).toContainText('Хранилище сайта почти заполнено (96%)');
  await expect(page.locator('#toast')).toContainText('Не очищай данные сайта до экспорта');
});

test('storage estimate failures do not block app startup or persistence', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, 'storage', {
      configurable: true,
      value: { estimate: async () => { throw new Error('estimate unavailable'); } }
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#chatBox')).toBeVisible();
  await expect(page.locator('#userInput')).toBeEditable();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_chats_v87'))).toBeTruthy();
  await expect(page.locator('#toast')).not.toContainText('Хранилище сайта');
});

test('project memory scope edits the selected project, not the active chat project, and persists after reload', async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('seed-project-memory-scope-test') === '1') return;
    sessionStorage.setItem('seed-project-memory-scope-test', '1');
    const project = (id, name) => ({
      id, name, description: '', instructions: '', memoryScope: 'project-only',
      memory: [], createdAt: '', updatedAt: ''
    });
    const chat = (id, title, projectId) => ({
      id, title, projectId, projectMemoryEnabled: false,
      serverProjectMemoryEnabled: false, messages: []
    });
    localStorage.setItem('ai_projects_v1', JSON.stringify([
      project('project-alpha', 'Alpha project'),
      project('project-beta', 'Beta project')
    ]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([
      chat('chat-alpha', 'Alpha chat', 'project-alpha'),
      chat('chat-beta', 'Beta chat', 'project-beta')
    ]));
    localStorage.setItem('ai_current_chat_v87', 'chat-alpha');
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  if (await page.locator('#projectNavigationList').evaluate(el => el.classList.contains('hidden'))) {
    await page.locator('#projectNavToggle').click();
  }

  const betaGroup = page.locator('#projectNavigationList details[data-project-id="project-beta"]');
  await betaGroup.locator(':scope > summary').click();
  await betaGroup.locator('[data-action="open-project-settings"]').click();
  await expect(page.locator('#projectSettingsStatus')).toContainText('Beta project');
  await expect(page.locator('#currentProjectSelect')).toHaveValue('project-alpha');

  await page.locator('#projectMemoryScopeSelect').selectOption('project-and-global');
  await expect.poll(() => page.evaluate(() => {
    const projects = JSON.parse(localStorage.getItem('ai_projects_v1') || '[]');
    return Object.fromEntries(projects.map(project => [project.id, project.memoryScope]));
  })).toEqual({
    'project-alpha': 'project-only',
    'project-beta': 'project-and-global'
  });

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  if (await page.locator('#projectNavigationList').evaluate(el => el.classList.contains('hidden'))) {
    await page.locator('#projectNavToggle').click();
  }
  const reloadedBeta = page.locator('#projectNavigationList details[data-project-id="project-beta"]');
  await reloadedBeta.locator(':scope > summary').click();
  await reloadedBeta.locator('[data-action="open-project-settings"]').click();
  await expect(page.locator('#projectSettingsStatus')).toContainText('Beta project');
  await expect(page.locator('#projectMemoryScopeSelect')).toHaveValue('project-and-global');
  await expect(page.locator('#currentProjectSelect')).toHaveValue('project-alpha');
});

test('clear history preserves the chat and other project data', async ({ page }) => {
  await page.addInitScript(() => {
    const project = (id, name) => ({
      id, name, description: '', instructions: '', memoryScope: 'project-only',
      memory: [], createdAt: '', updatedAt: ''
    });
    const chat = (id, title, projectId, sentinel) => ({
      id, title, projectId, projectMemoryEnabled: false,
      serverProjectMemoryEnabled: false,
      messages: [{ role: 'user', content: sentinel }]
    });
    localStorage.setItem('ai_projects_v1', JSON.stringify([
      project('project-alpha', 'Alpha project'),
      project('project-beta', 'Beta project')
    ]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([
      chat('chat-alpha', 'Alpha chat', 'project-alpha', 'ALPHA_HISTORY_TO_CLEAR'),
      chat('chat-beta', 'Beta chat', 'project-beta', 'BETA_HISTORY_TO_KEEP')
    ]));
    localStorage.setItem('ai_current_chat_v87', 'chat-alpha');
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  if (await page.locator('#projectNavigationList').evaluate(el => el.classList.contains('hidden'))) {
    await page.locator('#projectNavToggle').click();
  }

  const alphaGroup = page.locator('#projectNavigationList details[data-project-id="project-alpha"]');
  await alphaGroup.locator(':scope > summary').click();
  const alphaRow = alphaGroup.locator('.chat-row').filter({ hasText: 'Alpha chat' });
  await alphaRow.locator('summary[aria-label="Действия чата"]').click();

  page.on('dialog', dialog => dialog.accept());
  await alphaRow.locator('[data-action="chat-clear"][data-chat-id="chat-alpha"]').click();
  await expect(page.locator('#chatBox')).not.toContainText('ALPHA_HISTORY_TO_CLEAR');
  await expect(page.locator('#projectNavigationList [data-action="switch-chat"][data-chat-id="chat-alpha"]')).toHaveText('Новый чат');

  const persisted = await page.evaluate(() => ({
    chats: JSON.parse(localStorage.getItem('ai_chats_v87') || '[]'),
    projects: JSON.parse(localStorage.getItem('ai_projects_v1') || '[]')
  }));
  const alpha = persisted.chats.find(chat => chat.id === 'chat-alpha');
  const beta = persisted.chats.find(chat => chat.id === 'chat-beta');
  expect(alpha).toBeTruthy();
  expect(alpha.messages, 'Clear history must leave this chat with no messages').toEqual([]);
  expect(alpha.projectId).toBe('project-alpha');
  expect(beta.messages[0].content).toBe('BETA_HISTORY_TO_KEEP');
  expect(persisted.projects.map(project => project.id).sort()).toEqual(['project-alpha', 'project-beta']);
});

test('clearing a non-active project chat preserves the active chat and both project associations', async ({ page }) => {
  await page.addInitScript(() => {
    const project = (id, name) => ({
      id, name, description: '', instructions: '', memoryScope: 'project-only',
      memory: [], createdAt: '', updatedAt: ''
    });
    const chat = (id, title, projectId, sentinel) => ({
      id, title, projectId, projectMemoryEnabled: false,
      serverProjectMemoryEnabled: false,
      messages: [{ role: 'user', content: sentinel }]
    });
    localStorage.setItem('ai_projects_v1', JSON.stringify([
      project('project-alpha', 'Alpha project'),
      project('project-beta', 'Beta project')
    ]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([
      chat('chat-alpha', 'Alpha chat', 'project-alpha', 'ACTIVE_ALPHA_HISTORY_TO_KEEP'),
      chat('chat-beta', 'Beta chat', 'project-beta', 'BETA_HISTORY_TO_CLEAR')
    ]));
    localStorage.setItem('ai_current_chat_v87', 'chat-alpha');
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  if (await page.locator('#projectNavigationList').evaluate(el => el.classList.contains('hidden'))) {
    await page.locator('#projectNavToggle').click();
  }

  const betaGroup = page.locator('#projectNavigationList details[data-project-id="project-beta"]');
  await betaGroup.locator(':scope > summary').click();
  const betaRow = betaGroup.locator('.chat-row').filter({ hasText: 'Beta chat' });
  await betaRow.locator('summary[aria-label="Действия чата"]').click();

  page.on('dialog', dialog => dialog.accept());
  await betaRow.locator('[data-action="chat-clear"][data-chat-id="chat-beta"]').click();

  await expect(page.locator('#chatBox')).toContainText('ACTIVE_ALPHA_HISTORY_TO_KEEP');
  await expect(page.locator('#chatBox')).not.toContainText('BETA_HISTORY_TO_CLEAR');

  const persisted = await page.evaluate(() => ({
    currentChatId: localStorage.getItem('ai_current_chat_v87'),
    chats: JSON.parse(localStorage.getItem('ai_chats_v87') || '[]'),
    projects: JSON.parse(localStorage.getItem('ai_projects_v1') || '[]')
  }));
  const alpha = persisted.chats.find(chat => chat.id === 'chat-alpha');
  const beta = persisted.chats.find(chat => chat.id === 'chat-beta');
  expect(persisted.currentChatId, 'Clearing a background chat must not switch the active chat').toBe('chat-alpha');
  expect(alpha.messages[0].content).toBe('ACTIVE_ALPHA_HISTORY_TO_KEEP');
  expect(alpha.projectId).toBe('project-alpha');
  expect(beta.messages, 'The selected background chat must be cleared').toEqual([]);
  expect(beta.projectId).toBe('project-beta');
  expect(persisted.projects.map(project => project.id).sort()).toEqual(['project-alpha', 'project-beta']);
});

test('mobile messages expose full text and retain a jump-to-latest control', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => { throw new DOMException('permission denied', 'NotAllowedError'); } }
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) {
    await page.locator('#legacyProviderSettings > summary').click();
  }
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('message-viewer-model');
  await page.locator('#apiKey').fill('e2e-message-viewer-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

  const longAnswer = Array.from({ length: 70 }, (_, index) => 'MESSAGE_VIEWER_LINE_' + index).join('\\n') +
    '\\n\\n<button type="button" data-action="clear-chat">CLEAR_HISTORY_INJECTION</button>';
  await page.route('https://api.example.test/v1/chat/completions', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ model: 'message-viewer-model', choices: [{ message: { role: 'assistant', content: longAnswer } }] })
  }));
  await page.locator('#userInput').fill('Show a full message.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('MESSAGE_VIEWER_LINE_69', { timeout: 15000 });
  await expect(page.locator('#chatBox [data-action="clear-chat"]')).toHaveCount(0);
  await expect(page.locator('#chatBox [data-action="copy-message"]')).toHaveCount(2);
  await expect(page.locator('#chatBox [data-action="view-message"]')).toHaveCount(2);
  await expect(page.locator('#chatBox [data-action="speak-message"]')).toHaveCount(1);
  await expect(page.locator('#chatBox [data-action="copy-message"]').last()).toHaveAccessibleName('Скопировать сообщение');
  await expect(page.locator('#chatBox [data-action="view-message"]').last()).toHaveAccessibleName('Открыть полный текст сообщения');
  await expect(page.locator('#chatBox [data-action="speak-message"]').last()).toHaveAccessibleName('Озвучить сообщение');
  const iconTargets = await page.locator('#chatBox [data-action="copy-message"]').last().evaluate(el => {
    const rect = el.getBoundingClientRect();
    return { width: rect.width, height: rect.height, text: el.textContent.trim() };
  });
  expect(iconTargets.width).toBeGreaterThanOrEqual(44);
  expect(iconTargets.height).toBeGreaterThanOrEqual(44);
  expect(iconTargets.text).toBe('⧉');

  await page.locator('#chatBox [data-action="view-message"]').last().click();
  await expect(page.locator('#messageViewerModal')).toBeVisible();
  await expect(page.locator('#messageViewerContent')).toContainText('MESSAGE_VIEWER_LINE_69');
  await expect(page.locator('#messageViewerContent [data-action="clear-chat"]')).toHaveCount(0);
  await expect(page.locator('#messageViewerActions [data-action="copy-viewer-message"]')).toHaveAccessibleName('Скопировать сообщение');
  await expect(page.locator('#messageViewerActions [data-action="speak-viewer-message"]')).toHaveAccessibleName('Озвучить сообщение');
  await page.locator('#messageViewerActions [data-action="copy-viewer-message"]').click();
  await expect(page.locator('#toast')).toContainText('Сообщение скопировано');
  await page.locator('#messageViewerModal [data-action="close-message-viewer"]').click();
  await expect(page.locator('#messageViewerModal')).toBeHidden();

  await page.locator('#chatBox [data-action="view-message"]').first().click();
  await expect(page.locator('#messageViewerContent')).toContainText('Show a full message.');
  await expect(page.locator('#messageViewerActions [data-action="copy-viewer-message"]')).toBeVisible();
  await expect(page.locator('#messageViewerActions [data-action="speak-viewer-message"]')).toBeHidden();
  await page.locator('#messageViewerModal [data-action="close-message-viewer"]').click();

  await page.locator('#chatBox [data-action="copy-message"]').last().click();
  await expect(page.locator('#toast')).toContainText('Сообщение скопировано');

  await page.locator('#chatBox').evaluate(el => { el.scrollTop = 0; el.dispatchEvent(new Event('scroll')); });
  await expect(page.locator('#jumpToLatest')).toBeVisible();
  await page.locator('#jumpToLatest').click();
  await expect.poll(() => page.locator('#chatBox').evaluate(el => el.scrollHeight - el.scrollTop - el.clientHeight), { timeout: 8000 }).toBeLessThan(8);
  await expect(page.locator('#jumpToLatest')).toBeHidden();
});

test('mobile composer stays visible at the bottom in new chats across viewport resizes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });

  const input = page.locator('#userInput');
  const footer = page.locator('#composerFooter');
  await expect(input).toBeVisible();
  const measureDock = () => footer.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return {
      position: getComputedStyle(element).position,
      top: rect.top,
      bottom: rect.bottom,
      viewportHeight: window.innerHeight,
      centered: document.body.classList.contains('composer-centered')
    };
  });
  const assertDocked = async () => {
    // Let resize/visualViewport handlers settle before asserting final geometry.
    await expect.poll(async () => {
      const metrics = await measureDock();
      return metrics.bottom - metrics.viewportHeight;
    }, { timeout: 3000 }).toBeGreaterThan(-5);
    const metrics = await measureDock();
    expect(metrics.position).not.toBe('fixed');
    expect(metrics.centered).toBe(false);
    expect(metrics.bottom).toBeGreaterThan(metrics.viewportHeight - 5);
    expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewportHeight + 2);
  };
  await assertDocked();

  const sidebar = page.locator('#sidebar');
  if (await sidebar.evaluate(element => element.classList.contains('-translate-x-full'))) {
    await page.locator('[data-action="toggle-sidebar"]').click();
  }
  await page.locator('#sidebar [data-action="new-chat"]').click();
  await expect(input).toBeVisible();
  await expect(input).toHaveValue('');
  await assertDocked();

  await input.fill(Array.from({ length: 8 }, (_, index) => 'Draft line ' + index).join('\n'));
  await page.setViewportSize({ width: 390, height: 440 });
  await expect(input).toBeVisible();
  await expect(input).toHaveValue(/Draft line 7/);
  await assertDocked();

  await page.setViewportSize({ width: 390, height: 844 });
  await assertDocked();
});

test('search presets fit one line, localize, and persist per chat', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });

  const searchRect = await page.locator('#searchModeMenu').boundingBox();
  expect(searchRect).not.toBeNull();
  for (const selector of ['#modeFast', '#modeDeep', '#searchModeSummary']) {
    const box = await page.locator(selector).boundingBox();
    expect(box?.height || 0, selector + ' should have a 44px mobile hit target').toBeGreaterThanOrEqual(44);
  }
  const headerTargetHeights = await page.locator('.app-header .header-icon, .header-language-select').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height));
  expect(headerTargetHeights.length).toBeGreaterThanOrEqual(3);
  expect(headerTargetHeights.every(height => height >= 40)).toBe(true);
  for (const selector of ['#contextPickerButton', '#attachTextButton', '#voiceUnavailableButton', '#sendBtn', '#userInput']) {
    const box = await page.locator(selector).boundingBox();
    expect(box?.height || 0, selector + ' should have a 44px mobile hit target').toBeGreaterThanOrEqual(44);
  }
  await page.locator('#searchModeSummary').click();
  const menuOptionBox = await page.locator('#searchModeMenu .toolbar-menu-option').first().boundingBox();
  expect(menuOptionBox?.height || 0, 'Search menu options should have a 44px mobile hit target').toBeGreaterThanOrEqual(44);
  await page.locator('#searchModeSummary').click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await chooseSearchMode(page, 'more');
  await expect(page.locator('#searchModeSummary')).toContainText('Расширенный');
  await expect(page.locator('#modeHint')).toContainText('Веб: расширенный');
  await expect(page.locator('#modeFast')).toHaveAttribute('aria-pressed', 'true');
  await chooseSearchMode(page, 'offline');
  await expect(page.locator('#toggleSearch')).not.toBeChecked();
  await expect(page.locator('#modeHint')).toContainText('Веб: выкл.');
  await chooseSearchMode(page, 'normal');

  await setAgentMode(page, true);
  await expect(page.locator('#toggleMultiAgent')).toBeChecked();
  await expect(page.locator('#modeHint')).toContainText('Конвейер');
  await setSkillPreset(page, 'code-review');
  await expect(page.locator('#toggleMultiAgent')).toBeChecked();
  await expect(page.locator('#modeHint')).toContainText('Код');
  await expect.poll(() => page.evaluate(() => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    const current = localStorage.getItem('ai_current_chat_v87');
    return chats.find(chat => chat.id === current)?.skillPreset;
  })).toBe('code-review');

  const sidebar = page.locator('#sidebar');
  if (await sidebar.evaluate(element => element.classList.contains('-translate-x-full'))) {
    await page.locator('[data-action="toggle-sidebar"]').click();
  }
  await page.locator('#sidebar [data-action="new-chat"]').click();
  await expect(page.locator('#modeFast')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#toggleSearch')).toBeChecked();
  await expect(page.locator('#toggleMultiAgent')).not.toBeChecked();
  await expect(page.locator('#searchModeSummary')).toContainText(/обычный/i);

  await selectLanguage(page, 'en');
  await expect(page.locator('#modeDeep')).toContainText('Thorough');
  await expect(page.locator('#modeToolbar [role="group"]')).toHaveAttribute('aria-label', 'Effort');
  await expect(page.locator('#functionsMenu')).toHaveCount(0);
  await expect(page.locator('#searchModeSummary')).toContainText('Web');
  await expect(page.locator('#modeHint')).toContainText('Quick · Web: standard · Direct · Auto');
});

test('unrequested Functions and Research Studio entrypoints are absent', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#functionsMenu')).toHaveCount(0);
  await expect(page.locator('#functionsMenuSummary')).toHaveCount(0);
  await expect(page.locator('[data-action="open-research-studio"]')).toHaveCount(0);
  await expect(page.locator('#researchStudioModal')).toBeHidden();
  await expect(page.locator('#searchModeSummary')).toBeVisible();
});

test('browser Python snippets cannot access page globals through Pyodide js module', async ({ page }) => {
  await page.addInitScript(() => {
    window.loadPyodide = async options => ({
      setStdout() {},
      setStderr() {},
      runPythonAsync: async () => JSON.stringify({
        nullPrototype: Object.getPrototypeOf(options.jsglobals) === null,
        exposesSensitiveGlobals: ['window', 'document', 'localStorage', 'fetch', 'globalThis']
          .some(name => name in options.jsglobals)
      })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const block = document.createElement('div');
    block.className = 'code-block';
    const code = document.createElement('code');
    code.textContent = 'print("safe namespace")';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-action';
    button.dataset.action = 'run-python';
    button.textContent = 'Run Python';
    const output = document.createElement('pre');
    output.dataset.codeOutput = '';
    output.classList.add('hidden');
    block.append(code, button, output);
    document.querySelector('#chatBox').append(block);
  });

  await page.locator('#chatBox [data-action="run-python"]').click();
  const output = page.locator('#chatBox [data-code-output]');
  await expect(output).toContainText('"nullPrototype":true');
  await expect(output).toContainText('"exposesSensitiveGlobals":false');
  await expect(page.locator('#pyStatus')).toContainText('Py: готов');
});


test('settings profile import rolls back all earlier keys when a later storage write fails', async ({ page }) => {
  await page.addInitScript(() => {
    window.__failProfileKey = null;
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (window.__failProfileKey === key) {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const keys = [
    'ai_api_provider', 'ai_base_url', 'ai_model_name', 'ai_processing_mode',
    'ai_web_search', 'ai_multi_agent_research', 'ai_offline_mode',
    'ai_cross_provider_fallback', 'ai_system_prompt', 'ai_web_search_preset_v1'
  ];
  const before = await page.evaluate(storageKeys => {
    const values = {};
    for (const key of storageKeys) values[key] = localStorage.getItem(key);
    return values;
  }, keys);
  await page.evaluate(() => { window.__failProfileKey = 'ai_system_prompt'; });
  const profile = {
    format: 'ai-mobile-agent-settings',
    version: 1,
    settings: {
      provider: 'groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      model: 'openai/gpt-oss-20b',
      systemPrompt: 'Imported profile prompt',
      mode: 'deep',
      search: false,
      multiAgent: true,
      offline: true,
      crossProviderFallback: false
    }
  };
  await page.locator('#settingsProfileFile').setInputFiles({
    name: 'settings-profile.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(profile))
  });
  await expect(page.locator('#toast')).toContainText('Импорт профиля не выполнен');
  const after = await page.evaluate(storageKeys => {
    const values = {};
    for (const key of storageKeys) values[key] = localStorage.getItem(key);
    return values;
  }, keys);
  expect(after).toEqual(before);
});

test('settings profile import rolls back provider keys when chat persistence fails', async ({ page }) => {
  await page.addInitScript(() => {
    window.__failCurrentWrite = false;
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (window.__failCurrentWrite && key === 'ai_current_chat_v87') {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const keys = [
    'ai_api_provider', 'ai_base_url', 'ai_model_name', 'ai_processing_mode',
    'ai_web_search', 'ai_multi_agent_research', 'ai_offline_mode',
    'ai_cross_provider_fallback', 'ai_system_prompt', 'ai_web_search_preset_v1',
    'ai_chats_v87', 'ai_current_chat_v87'
  ];
  const before = await page.evaluate(storageKeys => {
    const values = {};
    for (const key of storageKeys) values[key] = localStorage.getItem(key);
    return values;
  }, keys);
  await page.evaluate(() => { window.__failCurrentWrite = true; });
  const profile = {
    format: 'ai-mobile-agent-settings',
    version: 1,
    settings: {
      provider: 'groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      model: 'openai/gpt-oss-20b',
      systemPrompt: 'Imported profile prompt',
      mode: 'deep',
      search: false,
      multiAgent: true,
      offline: true,
      crossProviderFallback: false
    }
  };
  await page.locator('#settingsProfileFile').setInputFiles({
    name: 'settings-profile.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(profile))
  });
  await expect(page.locator('#toast')).toContainText('Импорт профиля не выполнен');
  const after = await page.evaluate(storageKeys => {
    const values = {};
    for (const key of storageKeys) values[key] = localStorage.getItem(key);
    return values;
  }, keys);
  expect(after).toEqual(before);
});

test('chat mode setters restore chat and mirrored storage when quota blocks persistence', async ({ page }) => {
  await page.addInitScript(() => {
    window.__failChatWrites = false;
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (window.__failChatWrites && key === 'ai_chats_v87') {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const keys = [
    'ai_chats_v87', 'ai_processing_mode', 'ai_web_search_preset_v1',
    'ai_web_search', 'ai_offline_mode', 'ai_multi_agent_research'
  ];
  const before = await page.evaluate(storageKeys => {
    const values = {};
    for (const key of storageKeys) values[key] = localStorage.getItem(key);
    return values;
  }, keys);
  await page.evaluate(() => { window.__failChatWrites = true; });
  await page.locator('#modeDeep').click();
  await page.evaluate(() => {
    const search = document.querySelector('#toggleSearch');
    search.checked = !search.checked;
    search.dispatchEvent(new Event('change', { bubbles: true }));
    const multi = document.querySelector('#toggleMultiAgent');
    multi.checked = !multi.checked;
    multi.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.locator('#toast')).toContainText('История не подтверждена');
  const after = await page.evaluate(storageKeys => {
    const values = {};
    for (const key of storageKeys) values[key] = localStorage.getItem(key);
    return values;
  }, keys);
  expect(after).toEqual(before);
  await expect(page.locator('#modeFast')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#modeDeep')).toHaveAttribute('aria-pressed', 'false');
});

test('skill and agent configuration setters restore unsaved values when chat storage fails', async ({ page }) => {
  await page.addInitScript(() => {
    window.__failChatWrites = false;
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (window.__failChatWrites && key === 'ai_chats_v87') {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const before = await page.evaluate(() => localStorage.getItem('ai_chats_v87'));
  await page.evaluate(() => { window.__failChatWrites = true; });
  await page.evaluate(() => {
    const goal = document.querySelector('#skillGoalSelect');
    const option = [...goal.options].find(item => item.value && item.value !== goal.value);
    if (option) {
      goal.value = option.value;
      goal.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const preset = document.querySelector('#skillPresetSelect');
    const nextPreset = [...preset.options].find(item => item.value && item.value !== preset.value);
    if (nextPreset) {
      preset.value = nextPreset.value;
      preset.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const nextGoal = [...goal.options].find(item => item.value && item.value !== goal.value);
    if (nextGoal) {
      goal.value = nextGoal.value;
      goal.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const customName = document.querySelector('#customSkillName');
    customName.value = 'Unsaved skill name';
    customName.dispatchEvent(new Event('change', { bubbles: true }));
    const size = document.querySelector('#agentTeamSize');
    size.value = '7';
    size.dispatchEvent(new Event('input', { bubbles: true }));
    const scenario = document.querySelector('#agentTeamScenario');
    const nextScenario = [...scenario.options].find(item => item.value && item.value !== scenario.value);
    if (nextScenario) {
      scenario.value = nextScenario.value;
      scenario.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  const after = await page.evaluate(() => localStorage.getItem('ai_chats_v87'));
  expect(after).toBe(before);
  const activeChat = await page.evaluate(() => {
    const raw = localStorage.getItem('ai_chats_v87');
    const parsed = JSON.parse(raw);
    return parsed.find(chat => chat.id === localStorage.getItem('ai_current_chat_v87')) || parsed[0];
  });
  await expect(page.locator('#skillPresetSelect')).toHaveValue(activeChat.skillPreset);
  await expect(page.locator('#skillGoalSelect')).toHaveValue(activeChat.skillGoal);
  await expect(page.locator('#customSkillName')).toHaveValue(activeChat.customSkillName);
  await expect(page.locator('#agentTeamSize')).toHaveValue(String(activeChat.agentTeamSize));
  await expect(page.locator('#agentTeamScenario')).toHaveValue(activeChat.agentTeamScenario);
});

test('corrupt project storage is preserved and exposes a downloadable recovery backup', async ({ page }) => {
  const raw = '{"projects":';
  await page.addInitScript(value => localStorage.setItem('ai_projects_v1', value), raw);
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#projectRecoveryBackupButton')).not.toHaveClass(/hidden/);
  const values = await page.evaluate(() => ({
    original: localStorage.getItem('ai_projects_v1'),
    backup: localStorage.getItem('ai_projects_recovery_backup')
  }));
  expect(values).toEqual({ original: raw, backup: raw });
  await page.locator('#appSidebarToggle').click();
  await expect(page.locator('#projectRecoveryBackupButton')).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#projectRecoveryBackupButton').click()
  ]);
  expect(download.suggestedFilename()).toBe('ai-projects-recovery-backup.json');
});

test('partially invalid chat history is backed up before valid records are persisted', async ({ page }) => {
  const raw = JSON.stringify([
    { id: 'valid-chat', title: 'Valid', messages: [{ role: 'user', content: 'keep me' }] },
    { id: 'invalid-chat', title: 'Invalid', messages: 'not-an-array' }
  ]);
  await page.addInitScript(value => localStorage.setItem('ai_chats_v87', value), raw);
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_chats_recovery_backup'))).toBe(raw);
  const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem('ai_chats_v87') || '[]'));
  expect(persisted).toHaveLength(1);
  expect(persisted[0].id).toBe('valid-chat');
});

test('project import rolls back project and chat writes when current-chat persistence fails', async ({ page }) => {
  await page.addInitScript(() => {
    window.__failCurrentWrite = false;
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (window.__failCurrentWrite && key === 'ai_current_chat_v87') {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_chats_v87'))).not.toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_current_chat_v87'))).not.toBeNull();
  const before = await page.evaluate(() => ({
    projects: localStorage.getItem('ai_projects_v1'),
    chats: localStorage.getItem('ai_chats_v87'),
    current: localStorage.getItem('ai_current_chat_v87')
  }));
  await page.evaluate(() => { window.__failCurrentWrite = true; });
  const bundle = {
    format: 'alandi-project-bundle',
    version: 1,
    project: { name: 'Quota rollback test', memory: [] },
    chats: [{ id: 'imported-chat', messages: [{ role: 'user', content: 'must not persist' }] }]
  };
  await page.locator('#importProjectFile').setInputFiles({
    name: 'project-bundle.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(bundle))
  });
  await expect(page.locator('#toast')).toContainText('Импорт проекта не выполнен');
  const after = await page.evaluate(() => ({
    projects: localStorage.getItem('ai_projects_v1'),
    chats: localStorage.getItem('ai_chats_v87'),
    current: localStorage.getItem('ai_current_chat_v87')
  }));
  expect(after).toEqual(before);
});

test('project writes fail closed when malformed source data cannot be backed up', async ({ page }) => {
  const raw = '{"broken":';
  await page.addInitScript(value => {
    localStorage.setItem('ai_projects_v1', value);
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, nextValue) {
      if (key.startsWith('ai_projects_recovery_backup')) {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      }
      return originalSetItem.call(this, key, nextValue);
    };
  }, raw);
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_chats_v87'))).not.toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_current_chat_v87'))).not.toBeNull();
  const before = await page.evaluate(() => ({
    projects: localStorage.getItem('ai_projects_v1'),
    chats: localStorage.getItem('ai_chats_v87'),
    current: localStorage.getItem('ai_current_chat_v87')
  }));
  const bundle = {
    format: 'alandi-project-bundle',
    version: 1,
    project: { name: 'Must not overwrite corrupt data', memory: [] },
    chats: [{ id: 'new-chat', messages: [{ role: 'user', content: 'test' }] }]
  };
  await page.locator('#importProjectFile').setInputFiles({
    name: 'project-bundle.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(bundle))
  });
  await expect(page.locator('#toast')).toContainText('Импорт проекта не выполнен');
  const after = await page.evaluate(() => ({
    projects: localStorage.getItem('ai_projects_v1'),
    chats: localStorage.getItem('ai_chats_v87'),
    current: localStorage.getItem('ai_current_chat_v87')
  }));
  expect(after).toEqual(before);
  await page.locator('#appSidebarToggle').click();
  await expect(page.locator('#projectRecoveryBackupButton')).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#projectRecoveryBackupButton').click()
  ]);
  expect(download.suggestedFilename()).toBe('ai-projects-recovery-backup.json');
  const stream = await download.createReadStream();
  let downloaded = '';
  for await (const chunk of stream) downloaded += chunk.toString();
  expect(downloaded).toBe(raw);
});


test('partially corrupt chat history remains downloadable when recovery backup write fails', async ({ page }) => {
  const raw = JSON.stringify([
    { id: 'valid-chat', title: 'Valid', messages: [{ role: 'user', content: 'keep me' }] },
    { id: 'invalid-chat', title: 'Invalid', messages: 'not-an-array' }
  ]);
  await page.addInitScript(value => {
    localStorage.setItem('ai_chats_v87', value);
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, nextValue) {
      if (key.startsWith('ai_chats_recovery_backup')) {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      }
      return originalSetItem.call(this, key, nextValue);
    };
  }, raw);
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#recoveryBackupButton')).not.toHaveClass(/hidden/);
  expect(await page.evaluate(() => localStorage.getItem('ai_chats_v87'))).toBe(raw);
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#recoveryBackupButton').click()
  ]);
  expect(download.suggestedFilename()).toBe('ai-chat-recovery-backup.json');
  const stream = await download.createReadStream();
  let downloaded = '';
  for await (const chunk of stream) downloaded += chunk.toString();
  expect(downloaded).toBe(raw);
});

test('status text and roadmap tickers stay centered, including reduced-motion mode', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });

  const alignment = await page.evaluate(() => {
    const status = document.querySelector('#searchStatus');
    const ticker = document.createElement('div');
    ticker.className = 'roadmap-ticker';
    ticker.innerHTML = '<span class="roadmap-ticker-track">Roadmap status</span>';
    document.body.append(ticker);
    return {
      statusJustify: getComputedStyle(status).justifyContent,
      statusWrap: getComputedStyle(status).flexWrap,
      statusTextAlign: getComputedStyle(document.querySelector('#statusText')).textAlign,
      timeMarginLeft: getComputedStyle(document.querySelector('#thinkingTime')).marginLeft,
      tickerJustify: getComputedStyle(ticker).justifyContent,
      tickerTextAlign: getComputedStyle(ticker.querySelector('.roadmap-ticker-track')).textAlign,
      tickerAnimation: getComputedStyle(ticker.querySelector('.roadmap-ticker-track')).animationName
    };
  });
  expect(alignment.statusJustify).toBe('center');
  expect(alignment.statusWrap).toBe('wrap');
  expect(alignment.statusTextAlign).toBe('center');
  expect(alignment.timeMarginLeft).toBe('0px');
  expect(alignment.tickerJustify).toBe('center');
  expect(alignment.tickerTextAlign).toBe('center');
  expect(alignment.tickerAnimation).toBe('none');
});


test('status tone semantics remain distinct and readable in both themes', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });

  for (const theme of ['dark', 'light']) {
    await page.evaluate(value => {
      document.documentElement.dataset.theme = value;
    }, theme);
    const colors = [];
    for (const tone of ['neutral', 'info', 'success', 'warning', 'error']) {
      const state = await page.evaluate(value => {
        const row = document.querySelector('#searchStatus');
        const label = document.querySelector('#statusText');
        row.dataset.tone = value;
        label.textContent = 'Status tone regression';
        return {
          tone: row.dataset.tone,
          color: getComputedStyle(label).color,
          background: getComputedStyle(row).backgroundColor,
          animation: getComputedStyle(label).animationName
        };
      }, tone);
      expect(state.tone).toBe(tone);
      expect(state.animation).toBe('none');
      const channel = value => {
        const normalized = value / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      };
      const luminance = color => {
        const [red, green, blue] = color.match(/\d+(?=,|\))/g).slice(0, 3).map(Number).map(channel);
        return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      };
      const foreground = luminance(state.color);
      const background = luminance(state.background);
      expect((Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)).toBeGreaterThanOrEqual(4.5);
      colors.push(state.color);
    }
    expect(new Set(colors).size).toBe(5);
  }
});


test('readability preferences persist and maintain semantic text contrast in both themes', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').first().click();
  await openAdditionalSettings(page);
  await expect(page.locator('#readingSettings')).toBeVisible();

  await page.locator('#readingFontSize').evaluate(element => {
    element.value = '20';
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#readingLineHeight').evaluate(element => {
    element.value = '1.9';
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.locator('#readingContrast').selectOption('high');
  await expect(page.locator('#readingFontSizeValue')).toHaveText('20 px');
  await expect(page.locator('#readingLineHeightValue')).toHaveText('1.9');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ai_ui_readability_v1') || '{}'))).toEqual({
    fontSize: 20, lineHeight: 1.9, contrast: 'high'
  });

  const ratios = await page.evaluate(() => {
    const parse = value => {
      const match = value.match(/^#([0-9a-f]{6})$/i);
      if (!match) throw new Error('Unexpected computed color token: ' + value);
      return [0,2,4].map(offset => parseInt(match[1].slice(offset, offset + 2), 16));
    };
    const luminance = color => {
      const channels = parse(color).map(value => {
        const normalized = value / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const ratio = (foreground, background) => {
      const a = luminance(foreground), b = luminance(background);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    };
    const results = {};
    for (const theme of ['dark', 'light']) {
      document.documentElement.dataset.theme = theme;
      for (const contrast of ['standard', 'high']) {
        document.documentElement.dataset.readingContrast = contrast;
        const styles = getComputedStyle(document.documentElement);
        const background = styles.getPropertyValue('--ui-surface').trim();
        const tokens = ['--ui-text','--ui-text-muted','--ui-success','--ui-danger','--ui-info','--ui-warning','--ui-link'];
        results[theme + '-' + contrast] = Object.fromEntries(tokens.map(token => [token, ratio(styles.getPropertyValue(token).trim(), background)]));
      }
    }
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.dataset.readingContrast = 'high';
    return results;
  });
  for (const [scheme, tokens] of Object.entries(ratios)) {
    for (const [token, value] of Object.entries(tokens)) {
      expect(value, scheme + ' ' + token).toBeGreaterThanOrEqual(4.5);
    }
  }

  const semanticRoles = await page.evaluate(async () => {
    const sample = document.createElement('div');
    sample.className = 'assistant-content';
    sample.style.backgroundColor = 'var(--ui-surface)';
    sample.innerHTML = '<span id="secondary" class="text-gray-500">Secondary</span><button id="disabled" disabled>Disabled</button><a id="link" href="#">Link</a><p id="error" class="field-error">Error</p>';
    document.body.appendChild(sample);
    const colorFor = token => {
      const probe = document.createElement('span');
      probe.style.color = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
      sample.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    };
    const cloudStatus = document.createElement('p');
    cloudStatus.className = 'cloud-status-copy';
    cloudStatus.dataset.state = 'checking';
    cloudStatus.textContent = 'Checking';
    document.querySelector('#settingsModal').appendChild(cloudStatus);
    const settingsError = document.querySelector('#cloudBaseUrlError');
    const statusRow = document.querySelector('#searchStatus');
    const statusText = document.querySelector('#statusText');
    const actual = () => ({
      secondary:getComputedStyle(sample.querySelector('#secondary')).color,
      disabled:getComputedStyle(sample.querySelector('#disabled')).color,
      link:getComputedStyle(sample.querySelector('#link')).color,
      error:getComputedStyle(sample.querySelector('#error')).color,
      settingsError:getComputedStyle(settingsError).color,
      cloudChecking:getComputedStyle(cloudStatus).color,
      statusInfo:getComputedStyle(statusText).color
    });
    const results = {};
    for (const theme of ['dark','light']) {
      document.documentElement.dataset.theme = theme;
      for (const contrast of ['standard','high']) {
        document.documentElement.dataset.readingContrast = contrast;
        cloudStatus.dataset.state = 'checking';
        statusRow.dataset.tone = 'info';
        // Resolve descendant styles first so the 140ms color transitions start before waiting.
        getComputedStyle(document.documentElement).getPropertyValue('--ui-text-muted');
        getComputedStyle(sample.querySelector('#link')).color;
        getComputedStyle(sample.querySelector('#disabled')).color;
        getComputedStyle(sample.querySelector('#secondary')).color;
        // Sample only after the final cascade settles.
        await new Promise(resolve => setTimeout(resolve, 320));

        results[theme + '-' + contrast] = {
          actual:actual(),
          expected:{
            secondary:colorFor('--ui-text-muted'),
            disabled:colorFor('--ui-text-muted'),
            link:colorFor('--ui-link'),
            error:colorFor('--ui-danger'),
            settingsError:colorFor('--ui-danger'),
            cloudChecking:colorFor('--ui-warning'),
            statusInfo:colorFor('--ui-info')
          }
        };
      }
    }
    sample.remove();
    cloudStatus.remove();
    return results;
  });
  for (const [scheme, roles] of Object.entries(semanticRoles)) {
    expect(roles.actual, scheme).toEqual(roles.expected);
  }

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#readingFontSize')).toHaveValue('20');
  await expect(page.locator('#readingLineHeight')).toHaveValue('1.9');
  await expect(page.locator('#readingContrast')).toHaveValue('high');
  const applied = await page.evaluate(() => {
    const sample = document.createElement('div');
    sample.className = 'assistant-content';
    sample.innerHTML = '<p>Assistant readability sample</p>';
    document.body.appendChild(sample);
    const userSample = document.createElement('div');
    userSample.className = 'chat-bubble';
    userSample.textContent = 'User readability sample';
    document.body.appendChild(userSample);
    return {
      fontSize: getComputedStyle(sample).fontSize,
      lineHeight: getComputedStyle(sample).lineHeight,
      userFontSize: getComputedStyle(userSample).fontSize,
      userLineHeight: getComputedStyle(userSample).lineHeight,
      contrast: document.documentElement.dataset.readingContrast
    };
  });
  expect(applied.fontSize).toBe('20px');
  expect(applied.lineHeight).toBe('38px');
  expect(applied.userFontSize).toBe('20px');
  expect(applied.userLineHeight).toBe('38px');
  expect(applied.contrast).toBe('high');
});
