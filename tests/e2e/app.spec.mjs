import { test, expect } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

async function attachVisualReviewScreenshot(page, testInfo, name) {
  const screenshot = await page.screenshot({ animations: 'disabled' });
  const outputPath = testInfo.outputPath('visual-review', `${name}.png`);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, screenshot);
  await testInfo.attach(name, { body: screenshot, contentType: 'image/png' });
}

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';


async function ensureSidebarOpen(page) {
  const sidebar = page.locator('#sidebar');
  if (await sidebar.evaluate(element => element.classList.contains('-translate-x-full'))) {
    await page.locator('[data-action="toggle-sidebar"]').click();
  }
  await expect(sidebar).not.toHaveClass(/-translate-x-full/);
  await expect(sidebar).toBeInViewport();
}

async function ensureSidebarClosed(page) {
  const sidebar = page.locator('#sidebar');
  if (!(await sidebar.evaluate(element => element.classList.contains('-translate-x-full')))) {
    await sidebar.evaluate(element => { element.scrollTop = 0; });
    await sidebar.locator('[data-action="close-sidebar"]').click();
  }
  await expect(sidebar).toHaveClass(/-translate-x-full/);
}

async function createProjectFromUi(page, name, instructions = '') {
  const sidebar = page.locator('#sidebar');
  if (await sidebar.evaluate(element => element.classList.contains('-translate-x-full'))) {
    await page.locator('[data-action="toggle-sidebar"]').click();
  }
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await expect(page.locator('#projectCreateModal')).toBeVisible();
  await page.locator('#projectCreateNameInput').fill(name);
  if (instructions) await page.locator('#projectCreateInstructionsInput').fill(instructions);
  await page.locator('#projectCreateModal [data-action="create-project"]').click();
  await expect(page.locator('#projectCreateModal')).toBeHidden();
  return page.evaluate(projectName => {
    const projects = JSON.parse(localStorage.getItem('ai_projects_v1') || '[]');
    return projects.find(project => project.name === projectName)?.id || '';
  }, name);
}

async function openProjectSettingsForId(page, projectId) {
  const sidebar = page.locator('#sidebar');
  if (await sidebar.evaluate(element => element.classList.contains('-translate-x-full'))) {
    await page.locator('[data-action="toggle-sidebar"]').click();
  }
  const navigation = page.locator('#projectNavigationList');
  if (await navigation.evaluate(element => element.classList.contains('hidden'))) {
    await page.locator('#projectNavToggle').click();
  }
  const group = page.locator('#projectNavigationList details[data-project-id="' + projectId + '"]');
  if (!(await group.evaluate(element => element.open))) await group.locator(':scope > summary').click();
  await page.locator('#projectNavigationList .project-nav-row[data-project-id="' + projectId + '"] [data-action="open-project-settings"]').click();
  await expect(page.locator('#projectSettingsModal')).toBeVisible();
  const projectName = await page.evaluate(id => JSON.parse(localStorage.getItem('ai_projects_v1') || '[]').find(project => project.id === id)?.name || '', projectId);
  await expect(page.locator('#projectNameInput')).toHaveValue(projectName);
}

async function chooseSearchMode(page, mode) {
  await page.locator('#searchModeSummary').click();
  await page.locator(`[data-action="select-search-mode"][data-search-mode="${mode}"]`).click();
}
async function setAgentMode(page, enabled) {
  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="agents"]').click();
  const control = page.locator('#agentModeControl');
  if (enabled && !(await control.isChecked())) await control.check();
  if (!enabled && await control.isChecked()) await control.uncheck();
  await page.locator('#functionPanelModal [data-action="close-function-panel"]').first().click();
}
async function setSkillPreset(page, preset) {
  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="skills"]').click();
  await page.locator('#skillPresetSelect').selectOption(preset);
  await page.locator('#functionPanelModal [data-action="close-function-panel"]').first().click();
}
async function toggleHeaderTheme(page) {
  await page.locator('#headerThemeToggle').click();
}

async function openDisclosure(page, selector) {
  const disclosure = page.locator(selector);
  if (!(await disclosure.evaluate(element => element.open))) {
    await disclosure.locator(':scope > summary').click();
  }
  await expect(disclosure).toHaveAttribute('open', '');
}

async function openSettingsCategory(page, category) {
  await openDisclosure(page, '#additionalSettings');
  await openDisclosure(page, '#additionalSettings details[data-settings-category="' + category + '"]');
}

async function openSearchToolsSettings(page) {
  await openSettingsCategory(page, 'context');
  await openDisclosure(page, '#searchToolsSettings');
}

async function selectLanguage(page, language) {
  const settings = page.locator('#settingsModal');
  const wasOpen = !(await settings.evaluate(element => element.classList.contains('hidden')));
  if (wasOpen) await settings.locator('.settings-header-actions [data-action="close-settings"]').click();
  const menu = page.locator('#languageMenu');
  if (!(await menu.evaluate(element => element.open))) await menu.locator(':scope > summary').click();
  await menu.locator('[data-language="' + language + '"]').click();
  if (wasOpen) await page.locator('[data-action="toggle-settings"]').click();
}

async function configureCustomProvider(page, modelName) {
  await page.locator('[data-action="toggle-settings"]').click();
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(element => element.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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

test('local Pages baseurl serves the app stylesheet and JavaScript', async ({ page }) => {
  const cssResponse = page.waitForResponse(response =>
    new URL(response.url()).pathname.endsWith('/skills-github-pages/assets/css/app.css')
  );
  const jsResponse = page.waitForResponse(response =>
    new URL(response.url()).pathname.endsWith('/skills-github-pages/assets/js/app.js')
  );
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const [css, js] = await Promise.all([cssResponse, jsResponse]);
  expect(css.status()).toBe(200);
  expect(js.status()).toBe(200);
});

test('global system prompt is empty by default and obsolete Gemini reset is absent', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#systemPromptInput')).toHaveValue('');
  await expect(page.locator('[data-action="restore-defaults"]')).toHaveCount(0);
});

test('global system prompt edit control is localized, keyboard-friendly, and returns to read-only', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ai_ui_language_v1', 'en'));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await openSettingsCategory(page, 'context');
  const prompt = page.locator('#systemPromptInput');
  const edit = page.locator('#editSystemPrompt');
  await expect(prompt).toHaveAttribute('readonly', '');
  await expect(edit).toHaveAttribute('aria-label', 'Edit system prompt');
  await edit.focus();
  await expect(edit).toBeFocused();
  await edit.click();
  await expect(prompt).not.toHaveAttribute('readonly', '');
  await expect(prompt).toBeFocused();
  await expect(edit).toHaveAttribute('aria-pressed', 'true');
  await expect(edit).toHaveAttribute('aria-label', 'Finish editing system prompt');
  await edit.click();
  await expect(prompt).toHaveAttribute('readonly', '');
  await expect(edit).toHaveAttribute('aria-pressed', 'false');
  await expect(edit).toHaveAttribute('aria-label', 'Edit system prompt');
});

test('sidebar uses compact memory, collapsed projects, and expanded chats cards', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();

  const sidebar = page.locator('#sidebar');
  await expect(page.locator('#memoryPanel')).not.toHaveAttribute('open', '');
  await expect(page.locator('#memoryStatusLine')).toBeHidden();
  await expect(page.locator('#projectPanel')).toBeVisible();
  await expect(page.locator('#projectNavigationList')).toHaveClass(/hidden/);
  await expect(page.locator('#projectPanel [data-action="open-project-create"]')).toBeVisible();
  await expect(page.locator('#chatSection')).toHaveAttribute('open', '');
  await expect(page.locator('#chatSection [data-action="new-chat"]')).toBeVisible();
  await expect(page.locator('#chatList')).toBeVisible();
  await expect(page.locator('#projectStatusLine')).toContainText('Личный');
  await expect(page.locator('#sidebar [data-action="open-research-studio"]')).toHaveCount(0);
  await expect(page.locator('#functionsMenu [data-action="open-research-studio"]')).toHaveCount(0);
  await expect(page.locator('#deepResearchStudioButton[data-action="open-research-studio"]')).toHaveCount(1);

  const createPositions = await sidebar.evaluate(root => {
    const projectCreate = root.querySelector('#projectPanel [data-action="open-project-create"]');
    const newChat = root.querySelector('#chatSection [data-action="new-chat"]');
    const chatList = root.querySelector('#chatSection #chatList');
    return {
      projectCreateVisible: Boolean(projectCreate),
      newChatBeforeList: Boolean(newChat && chatList && (newChat.compareDocumentPosition(chatList) & Node.DOCUMENT_POSITION_FOLLOWING))
    };
  });
  expect(createPositions.projectCreateVisible).toBe(true);
  expect(createPositions.newChatBeforeList).toBe(true);

  await page.locator('#memoryPanel > summary').click();
  await expect(page.locator('#memoryStatusLine')).toBeVisible();
  await expect(page.locator('#memoryStatusLine')).toContainText('Личная');
  await expect(page.locator('#memoryStatusLine')).toContainText('Общая');
  await page.locator('#memoryToolsDetails > summary').click();
  await expect(page.locator('#privateMemoryHelp')).not.toHaveAttribute('open', '');
  await expect(page.locator('#sharedMemoryHelp')).not.toHaveAttribute('open', '');
  await page.locator('#privateMemoryHelp > summary').click();
  await expect(page.locator('#privateMemoryHelp p')).toBeVisible();
  await page.locator('#sharedMemoryHelp > summary').click();
  await expect(page.locator('#sharedMemoryHelp p')).toBeVisible();
  await page.locator('#globalMemoryToggle').check();
  await expect(page.locator('#memoryStatusLine')).toContainText('Общая Вкл.');
  await expect(page.locator('#projectStatusLine')).toContainText('Личный');

  const memoryOrder = await page.locator('#memoryToolsDetails > div').evaluate(root => [
    root.querySelector('#sharedMemoryTitle')?.closest('section'),
    root.querySelector('#privateMemoryTitle')?.closest('section'),
    root.querySelector('#privateMemoryContextToggle')?.closest('label')
  ].map(element => Array.prototype.indexOf.call(root.children, element)));
  expect(memoryOrder).toEqual([0, 1, 2]);

  await page.locator('#projectNavToggle').click();
  await expect(page.locator('#projectNavigationList')).not.toHaveClass(/hidden/);
  await page.locator('#chatSection > summary').click();
  await expect(page.locator('#chatList')).toBeHidden();
  await expect(page.locator('#projectStatusLine')).toBeHidden();
  await page.locator('#sidebar [data-action="close-sidebar"]').click();
  await expect(page.locator('#sidebar')).toHaveClass(/-translate-x-full/);
  await page.locator('[data-action="toggle-sidebar"]').click();
  await expect(page.locator('#memoryPanel')).toHaveAttribute('open', '');
  await expect(page.locator('#projectNavigationList')).not.toHaveClass(/hidden/);
  await expect(page.locator('#chatSection')).not.toHaveAttribute('open', '');
  await page.locator('#chatSection > summary').click();
  await expect(page.locator('#projectStatusLine')).toBeVisible();
});
test('project rows filter the Chats list without moving the current chat and create chats in the selected project', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  const projectId = await createProjectFromUi(page, 'Filtered project');
  expect(projectId).not.toBe('');
  await expect(page.locator('#currentProjectSelect')).toHaveValue('');
  const originalChatProject = await page.evaluate(() => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    const currentId = localStorage.getItem('ai_current_chat_v87');
    return chats.find(chat => chat.id === currentId)?.projectId || '';
  });
  expect(originalChatProject).toBe('');
  const row = page.locator('#projectNavigationList .project-nav-row[data-project-id="' + projectId + '"]');
  const gear = row.locator('[data-action="open-project-settings"]');
  const gearBox = await gear.boundingBox();
  expect(gearBox?.width || 0).toBeGreaterThanOrEqual(44);
  expect(gearBox?.height || 0).toBeGreaterThanOrEqual(44);
  const projectGroup = row.locator('details.project-nav-item');
  if (!(await projectGroup.evaluate(element => element.open))) await projectGroup.locator(':scope > summary').click();
  await row.locator('[data-action="select-project"]').click();
  await expect(page.locator('#chatSectionTitle')).toContainText('Filtered project');
  await expect(page.locator('#chatListNewButton')).toContainText('в проекте');
  await page.locator('#chatListNewButton').click();
  await expect(page.locator('#currentProjectSelect')).toHaveValue(projectId);
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#chatListBack').click();
  await expect(page.locator('#chatSectionTitle')).toContainText('Без проекта');
  await page.locator('#chatListNewButton').click();
  await expect(page.locator('#currentProjectSelect')).toHaveValue('');
});
test('sidebar search finds project and chat names locally without indexing message contents', async ({ page }) => {
  await page.addInitScript(() => {
    const project=(id,name)=>({id,name,description:'',instructions:'',memoryScope:'project-only',memory:[],createdAt:'',updatedAt:''});
    const chat=(id,title,projectId,messages=[])=>({id,title,projectId,messages});
    localStorage.setItem('ai_projects_v1',JSON.stringify([project('search-alpha','Alpha Research'),project('search-beta','Beta Studio')]));
    localStorage.setItem('ai_chats_v87',JSON.stringify([
      chat('search-chat-alpha','Alpha notes','search-alpha',[{role:'user',content:'PRIVATE_BODY_SENTINEL'}]),
      chat('search-chat-beta','Beta launch plan','search-beta')
    ]));
    localStorage.setItem('ai_current_chat_v87','search-chat-alpha');
  });
  await page.goto(APP_PATH,{waitUntil:'domcontentloaded'});
  await page.locator('[data-action="toggle-sidebar"]').click();
  const search=page.locator('#sidebarSearchInput');
  await expect(search).toBeVisible();
  await search.fill('beta');
  const results=page.locator('#sidebarSearchResults');
  await expect(results).toBeVisible();
  await expect(results).toContainText('Beta Studio');
  await expect(results).toContainText('Beta launch plan');
  await expect(results).not.toContainText('Alpha Research');
  await expect(results).not.toContainText('Alpha notes');
  await results.locator('[data-action="switch-chat"][data-chat-id="search-chat-beta"]').click();
  await expect(page.locator('#sidebar')).toHaveClass(/-translate-x-full/);
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('ai_current_chat_v87'))).toBe('search-chat-beta');
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('ai_ui_language_v1'))).toBeTruthy();
  await page.locator('[data-action="toggle-sidebar"]').click();
  await search.fill('Alpha Research');
  await expect(results).toContainText('Alpha Research');
  await results.locator('[data-action="select-project"][data-project-id="search-alpha"]').click();
  await expect(page.locator('#chatSectionTitle')).toContainText('Alpha Research');
  await search.fill('PRIVATE_BODY_SENTINEL');
  await expect(results).toContainText('Совпадений по названиям проектов и чатов нет.');
  await page.keyboard.press('Escape');
  await expect(results).toBeHidden();
  await expect(search).toHaveValue('');
});

test('chat pinning and activity/creation sort preferences persist with stable ordering', async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('sort-fixture-seeded') === '1') return;
    sessionStorage.setItem('sort-fixture-seeded', '1');
    const chat=(id,title,createdAt,updatedAt)=>({id,title,projectId:null,messages:[],createdAt,updatedAt});
    localStorage.setItem('ai_chats_v87',JSON.stringify([
      chat('sort-zeta','Zeta notes','2026-01-01T00:00:00.000Z','2026-01-03T00:00:00.000Z'),
      chat('sort-alpha','Alpha plan','2026-01-03T00:00:00.000Z','2026-01-01T00:00:00.000Z'),
      chat('sort-middle','Middle research','2026-01-02T00:00:00.000Z','2026-01-02T00:00:00.000Z')
    ]));
    localStorage.setItem('ai_current_chat_v87','sort-alpha');
    localStorage.setItem('ai_pinned_chats_v1',JSON.stringify(['sort-zeta','sort-middle']));
    localStorage.setItem('ai_chat_sort_v1','created');
  });
  await page.goto(APP_PATH,{waitUntil:'domcontentloaded'});
  await page.locator('[data-action="toggle-sidebar"]').click();
  const chatIds=()=>page.locator('#chatList [data-action="switch-chat"]').evaluateAll(nodes=>nodes.map(node=>node.dataset.chatId));
  await expect.poll(chatIds).toEqual(['sort-middle','sort-zeta','sort-alpha']);
  const sort=page.locator('#chatSortSelect');
  await expect(sort).toHaveValue('created');
  await sort.selectOption('activity');
  await expect.poll(chatIds).toEqual(['sort-zeta','sort-middle','sort-alpha']);
  await page.locator('#chatList [data-action="switch-chat"][data-chat-id="sort-alpha"]').locator('..').locator('.chat-row-menu summary').click();
  await page.locator('#chatList [data-action="chat-toggle-pin"][data-chat-id="sort-alpha"]').click();
  await expect.poll(chatIds).toEqual(['sort-zeta','sort-middle','sort-alpha']);
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('ai_pinned_chats_v1')||'[]'))).toContain('sort-alpha');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('[data-action="toggle-sidebar"]').click();
  await expect(page.locator('#chatSortSelect')).toHaveValue('activity');
  await expect.poll(chatIds).toEqual(['sort-zeta','sort-middle','sort-alpha']);
  await expect(page.locator('#chatList [data-chat-id="sort-alpha"]').first()).toHaveAttribute('aria-label',/Закреплённый чат/);
});

test('project creation and project settings close on Escape with focus restoration', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  const createOpener = page.locator('#projectPanel [data-action="open-project-create"]');
  await createOpener.click();
  await expect(page.locator('#projectCreateModal')).toBeVisible();
  await expect(page.locator('#projectCreateNameInput')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#projectCreateModal')).toBeHidden();
  await expect(createOpener).toBeFocused();
  const projectId = await createProjectFromUi(page, 'Focus project');
  await openProjectSettingsForId(page, projectId);
  await page.keyboard.press('Escape');
  await expect(page.locator('#projectSettingsModal')).toBeHidden();
  await expect(page.locator('#appSidebarToggle')).toBeFocused();
});
test('mobile sidebar closes on a deliberate horizontal swipe but not vertical scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await expect(page.locator('#sidebar')).not.toHaveClass(/-translate-x-full/);
  await page.locator('#sidebar').evaluate(sidebar => {
    const dispatch = (type, property, point) => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperty(event, property, { value: [point] });
      sidebar.dispatchEvent(event);
    };
    dispatch('touchstart', 'touches', { clientX: 250, clientY: 220 });
    dispatch('touchend', 'changedTouches', { clientX: 248, clientY: 340 });
  });
  await expect(page.locator('#sidebar')).not.toHaveClass(/-translate-x-full/);
  await page.locator('#sidebar').evaluate(sidebar => {
    const dispatch = (type, property, point) => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperty(event, property, { value: [point] });
      sidebar.dispatchEvent(event);
    };
    dispatch('touchstart', 'touches', { clientX: 250, clientY: 220 });
    dispatch('touchend', 'changedTouches', { clientX: 130, clientY: 228 });
  });
  await expect(page.locator('#sidebar')).toHaveClass(/-translate-x-full/);
});

test('settings modal traps Tab and Shift+Tab inside the visible dialog', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  const modal = page.locator('#settingsModal');
  const visibleCount = await modal.evaluate(element => {
    const selector='button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[contenteditable="true"],audio[controls],video[controls],[tabindex]:not([tabindex="-1"])';
    const nodes=[...element.querySelectorAll(selector)];
    return nodes.filter(node=>{
      if(!node.getClientRects().length||getComputedStyle(node).visibility==='hidden'||node.closest('.hidden,[inert],[aria-hidden="true"]'))return false;
      let closedDetails=null;
      for(let ancestor=node.parentElement;ancestor&&ancestor!==element;ancestor=ancestor.parentElement){
        if(ancestor.tagName==='DETAILS'&&!ancestor.open){if(closedDetails)return false;closedDetails=ancestor;}
      }
      return !closedDetails||node===closedDetails.querySelector(':scope > summary');
    }).length;
  });
  expect(visibleCount).toBeGreaterThan(1);
  await modal.evaluate(element => {
    const selector='button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[contenteditable="true"],audio[controls],video[controls],[tabindex]:not([tabindex="-1"])';
    const nodes=[...element.querySelectorAll(selector)];
    const visible=nodes.filter(node=>{
      if(!node.getClientRects().length||getComputedStyle(node).visibility==='hidden'||node.closest('.hidden,[inert],[aria-hidden="true"]'))return false;
      let closedDetails=null;
      for(let ancestor=node.parentElement;ancestor&&ancestor!==element;ancestor=ancestor.parentElement){
        if(ancestor.tagName==='DETAILS'&&!ancestor.open){if(closedDetails)return false;closedDetails=ancestor;}
      }
      return !closedDetails||node===closedDetails.querySelector(':scope > summary');
    });
    visible[0].focus();
  });
  await page.keyboard.press('Shift+Tab');
  await expect.poll(() => modal.evaluate(element => {
    const selector='button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[contenteditable="true"],audio[controls],video[controls],[tabindex]:not([tabindex="-1"])';
    const nodes=[...element.querySelectorAll(selector)];
    const visible=nodes.filter(node=>{
      if(!node.getClientRects().length||getComputedStyle(node).visibility==='hidden'||node.closest('.hidden,[inert],[aria-hidden="true"]'))return false;
      let closedDetails=null;
      for(let ancestor=node.parentElement;ancestor&&ancestor!==element;ancestor=ancestor.parentElement){
        if(ancestor.tagName==='DETAILS'&&!ancestor.open){if(closedDetails)return false;closedDetails=ancestor;}
      }
      return !closedDetails||node===closedDetails.querySelector(':scope > summary');
    });
    return document.activeElement===visible.at(-1);
  })).toBe(true);
  await page.keyboard.press('Tab');
  await expect.poll(() => modal.evaluate(element => {
    const selector='button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[contenteditable="true"],audio[controls],video[controls],[tabindex]:not([tabindex="-1"])';
    const nodes=[...element.querySelectorAll(selector)];
    const visible=nodes.filter(node=>{
      if(!node.getClientRects().length||getComputedStyle(node).visibility==='hidden'||node.closest('.hidden,[inert],[aria-hidden="true"]'))return false;
      let closedDetails=null;
      for(let ancestor=node.parentElement;ancestor&&ancestor!==element;ancestor=ancestor.parentElement){
        if(ancestor.tagName==='DETAILS'&&!ancestor.open){if(closedDetails)return false;closedDetails=ancestor;}
      }
      return !closedDetails||node===closedDetails.querySelector(':scope > summary');
    });
    return document.activeElement===visible[0];
  })).toBe(true);
  await page.locator('#headerThemeToggle').focus();
  await page.keyboard.press('Tab');
  await expect.poll(() => modal.evaluate(element => element.contains(document.activeElement))).toBe(true);
});

test('settings backdrop closes cleanly and restores focus across repeated cycles', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const opener = page.locator('[data-action="toggle-settings"]').first();
  for (let cycle = 0; cycle < 3; cycle++) {
    await opener.click();
    await expect(page.locator('#settingsModal')).toBeVisible();
    await page.locator('#settingsModal').click({ position: { x: 4, y: 4 } });
    await expect(page.locator('#settingsModal')).toBeHidden();
    await expect(opener).toBeFocused();
  }
});

test('mobile sidebar and modal close controls meet the 44px touch target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });

  await page.locator('[data-action="toggle-sidebar"]').click();
  const sidebarClose = await page.locator('#sidebar [data-action="close-sidebar"]').boundingBox();
  expect(sidebarClose?.width || 0).toBeGreaterThanOrEqual(44);
  expect(sidebarClose?.height || 0).toBeGreaterThanOrEqual(44);

  await page.locator('#chatListNewButton').click();
  await expect(page.locator('#sidebar')).toHaveClass(/-translate-x-full/);
  await page.locator('[data-action="toggle-sidebar"]').click();
  const chatMenuToggle = page.locator('#chatList .chat-row-menu summary').first();
  await expect(chatMenuToggle).toBeVisible();
  const chatMenuBox = await chatMenuToggle.boundingBox();
  expect(chatMenuBox?.width || 0).toBeGreaterThanOrEqual(44);
  expect(chatMenuBox?.height || 0).toBeGreaterThanOrEqual(44);
  await page.locator('#sidebar [data-action="close-sidebar"]').click();
  await expect(page.locator('#sidebar')).toHaveClass(/-translate-x-full/);

  const languageMenu = page.locator('#languageMenu');
  await languageMenu.locator('summary').click();
  const languageOption = await languageMenu.locator('[data-language="en"]').boundingBox();
  expect(languageOption?.width || 0).toBeGreaterThanOrEqual(44);
  expect(languageOption?.height || 0).toBeGreaterThanOrEqual(44);
  await languageMenu.locator('summary').click();

  await page.locator('[data-action="toggle-settings"]').click();
  const settingsClose = await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').boundingBox();
  expect(settingsClose?.width || 0).toBeGreaterThanOrEqual(44);
  expect(settingsClose?.height || 0).toBeGreaterThanOrEqual(44);
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  const createClose = await page.locator('#projectCreateModal [data-action="close-project-create"]').first().boundingBox();
  expect(createClose?.width || 0).toBeGreaterThanOrEqual(44);
  expect(createClose?.height || 0).toBeGreaterThanOrEqual(44);
  await page.locator('#projectCreateModal [data-action="close-project-create"]').first().click();
  const projectId = await createProjectFromUi(page, 'Touch target project');
  await openProjectSettingsForId(page, projectId);
  const projectClose = await page.locator('#projectSettingsModal [data-action="close-project-settings"]').boundingBox();
  expect(projectClose?.width || 0).toBeGreaterThanOrEqual(44);
  expect(projectClose?.height || 0).toBeGreaterThanOrEqual(44);
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();
});

test('theme and language are a compact accessible header group', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#homeThemeToggle')).toHaveCount(0);
  await expect(page.locator('#languageMenu')).toBeVisible();
  await expect(page.locator('#sidebarThemeToggle')).toHaveCount(0);
  await expect(page.locator('#additionalSettings [data-action="toggle-theme-cycle"]')).toHaveCount(0);
  await expect(page.locator('#headerThemeToggle')).toBeVisible();

  const themeTarget = await page.locator('#headerThemeToggle').boundingBox();
  const preferencesTarget = await page.locator('#languageMenu > summary').boundingBox();
  expect(themeTarget?.width || 0).toBeGreaterThanOrEqual(44);
  expect(themeTarget?.height || 0).toBeGreaterThanOrEqual(44);
  expect(preferencesTarget?.width).toBe(themeTarget?.width);
  expect(preferencesTarget?.height).toBe(themeTarget?.height);

  await toggleHeaderTheme(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('#uiTheme')).toHaveValue('light');

  await page.locator('#languageMenu > summary').click();
  await page.locator('#languageMenu [data-language="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#userInput')).toHaveAttribute('placeholder', 'Write a message...');
  await expect(page.locator('#languageMenu [data-language="en"]')).toHaveAttribute('aria-pressed', 'true');

  await toggleHeaderTheme(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#languageMenu > summary').click();
  await page.locator('#languageMenu [data-language="ru"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('#uiLanguage')).toHaveValue('ru');
});

test('header theme and language controls are separate, equally sized, and accessible', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const theme = page.locator('#headerThemeToggle');
  const language = page.locator('#languageSummary');
  const [themeBox, languageBox] = await Promise.all([theme.boundingBox(), language.boundingBox()]);
  expect(themeBox).not.toBeNull();
  expect(languageBox).not.toBeNull();
  expect(themeBox.width).toBeGreaterThanOrEqual(44);
  expect(themeBox.height).toBeGreaterThanOrEqual(44);
  expect(languageBox.width).toBe(themeBox.width);
  expect(languageBox.height).toBe(themeBox.height);
  await expect(theme).toHaveAttribute('aria-label', /theme|тему/i);
  await expect(language).toHaveAttribute('aria-label', /language|язык/i);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await theme.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await language.click();
  await expect(page.locator('#languageMenu')).toHaveAttribute('open', '');
  await expect(page.locator('#languageMenu [data-action="set-language"]')).toHaveCount(2);
  await page.locator('#languageMenu [data-language="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(language).toHaveText('EN');
  await expect(theme).toHaveAttribute('aria-label', 'Switch to dark theme');
  await theme.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('header hierarchy and compact mode controls remain responsive from 320px upward', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const widths = [320, 360, 390, 768, 1024, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 844 });
    const metrics = await page.evaluate(() => {
      const header = document.querySelector('.app-header');
      const title = document.querySelector('.header-chat-title');
      const clock = document.querySelector('#aLandiClock .clock-face');
      const wordmark = document.querySelector('#brandWordmark');
      const fast = document.querySelector('#modeFast');
      const deep = document.querySelector('#modeDeep');
      const rect = element => {
        const box = element.getBoundingClientRect();
        return { width: box.width, height: box.height };
      };
      return {
        header: { clientWidth: header.clientWidth, scrollWidth: header.scrollWidth },
        title: rect(title),
        titleBorder: getComputedStyle(title).borderTopWidth,
        titleRadius: getComputedStyle(title).borderTopLeftRadius,
        clock: rect(clock),
        wordmarkTransform: getComputedStyle(wordmark).transform,
        wordmarkWeight: getComputedStyle(wordmark).fontWeight,
        fast: rect(fast),
        deep: rect(deep),
        fontFamilies: [document.body, document.querySelector('button'), document.querySelector('input'), document.querySelector('textarea'), document.querySelector('select')]
          .map(element => getComputedStyle(element).fontFamily)
      };
    });
    expect(new Set(metrics.fontFamilies).size, 'body and form controls should share one font stack').toBe(1);
    expect(metrics.header.scrollWidth, 'header overflow at ' + width + 'px').toBeLessThanOrEqual(metrics.header.clientWidth + 1);
    expect(metrics.title.width).toBeGreaterThan(0);
    expect(metrics.titleBorder).not.toBe('0px');
    expect(metrics.titleRadius).not.toBe('0px');
    expect(metrics.clock.width).toBeGreaterThanOrEqual(54);
    expect(metrics.wordmarkTransform).not.toBe('none');
    expect(Number(metrics.wordmarkWeight)).toBeGreaterThanOrEqual(800);
    if (width <= 640) {
      expect(metrics.fast.height).toBeGreaterThanOrEqual(44);
      expect(metrics.deep.height).toBeGreaterThanOrEqual(44);
    } else {
      expect(metrics.fast.height).toBeLessThanOrEqual(34);
      expect(metrics.deep.height).toBeLessThanOrEqual(34);
    }
  }
});

test('sidebar closes on a horizontal touch swipe without consuming vertical scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await ensureSidebarOpen(page);
  await page.locator('#projectNavToggle').click();
  await expect(page.locator('#projectNavigationList')).toBeVisible();

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

  await ensureSidebarOpen(page);
  await expect(page.locator('#projectNavigationList')).toBeVisible();
});

test('function menu separates task workflow from integrations in both languages', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const menu = page.locator('#functionsMenu');
  await menu.locator(':scope > summary').click();
  await expect(menu.locator('.toolbar-menu-group-label')).toHaveCount(4);
  await expect(menu.locator('.toolbar-menu-group-label').nth(0)).toContainText('Работа с задачей');
  await expect(menu.locator('.toolbar-menu-group-label').nth(1)).toContainText('Исследование и источники');
  await expect(menu.locator('.toolbar-menu-group-label').nth(2)).toContainText('Создание и преобразование');
  await expect(menu.locator('.toolbar-menu-group-label').nth(3)).toContainText('Подключения');
  await expect(menu.locator('[data-action="open-function-panel"]')).toHaveCount(3);
  await expect(menu.locator('[data-action="open-research-studio"]')).toHaveCount(0);
  await expect(menu.locator('.function-roadmap-items')).toHaveCount(2);
  await expect(menu.locator('.function-roadmap-items').nth(0).locator('.function-roadmap-item')).toHaveCount(1);
  await expect(menu.locator('.function-roadmap-items').nth(0).locator('.function-roadmap-item').first()).toContainText('Глубокое исследование 2.0');
  await expect(menu.locator('.toolbar-menu-group-label').nth(2).locator('xpath=following-sibling::*[1]')).toHaveClass(/function-roadmap-items/);
  await expect(menu.locator('.function-roadmap-items').nth(1).locator('.function-roadmap-item')).toHaveCount(4);
  await expect(menu.locator('.function-roadmap-item')).toHaveCount(5);
  await expect(menu.locator('.function-roadmap-item .roadmap-ticker-track').first()).toContainText('1ИÆИT10И');
  await expect(menu.locator('.function-roadmap-item button')).toHaveCount(0);
  await selectLanguage(page, 'en');
  if (!(await menu.evaluate(element => element.open))) await menu.locator(':scope > summary').click();
  await expect(menu.locator('.toolbar-menu-group-label').nth(0)).toContainText('Task workflow');
  await expect(menu.locator('.toolbar-menu-group-label').nth(1)).toContainText('Research and sources');
  await expect(menu.locator('.toolbar-menu-group-label').nth(2)).toContainText('Create and transform');
  await expect(menu.locator('.toolbar-menu-group-label').nth(3)).toContainText('Connections');
});

test('Skills panel separates the active chat profile from the planned package library', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="skills"]').click();

  const panel = page.locator('#skillFunctionSettings');
  await expect(panel).toBeVisible();
  await expect(panel.locator('#skillTaskProfileTitle')).toContainText('Профиль текущего чата');
  await expect(panel.locator('[data-i18n="skillScopeBadge"]')).toContainText('Работает · только этот чат');
  await expect(panel.locator('#skillPresetSelect')).toBeVisible();
  await expect(panel.locator('#skillGoalSelect')).toBeVisible();
  await expect(panel.locator('#skillOutputSelect')).toBeVisible();

  const library = panel.locator('#skillLibraryDisclosure');
  await expect(library).not.toHaveAttribute('open', '');
  const summary = library.locator(':scope > summary');
  const summaryBox = await summary.boundingBox();
  expect(summaryBox?.height || 0, 'skill library disclosure must be a 44px touch target').toBeGreaterThanOrEqual(44);
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(library).toHaveAttribute('open', '');
  await expect(library).toContainText('проверка происхождения и лицензии');
  await expect(library).toContainText('ручное утверждение');
  await expect(library).toContainText('отдельного runtime');
  await expect(library.locator('button')).toHaveCount(0);
  await expect(library.locator('.roadmap-ticker-track')).toHaveCount(2);
  await expect(library.locator('.roadmap-ticker-track').first()).toContainText('1ИÆИT10И');

  await panel.locator('#skillRoadmapPause').check();
  await expect(library.locator('.roadmap-ticker-track').first()).toHaveCSS('animation-play-state', 'paused');
  await panel.locator('#skillRoadmapPause').uncheck();

  await page.locator('#functionPanelModal [data-action="close-function-panel"]').first().click();
  await selectLanguage(page, 'en');
  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="skills"]').click();
  await expect(panel.locator('#skillTaskProfileTitle')).toContainText('Current chat profile');
  await expect(panel.locator('[data-i18n="skillScopeBadge"]')).toContainText('Available · this chat only');
  await expect(panel.locator('#skillLibraryDisclosure > summary')).toContainText('Skill library · planned');
  await page.locator('#functionPanelModal [data-action="close-function-panel"]').first().click();
});

test('structured workflow panel groups its configuration into clear sections', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="agents"]').click();
  const panel = page.locator('#agentFunctionSettings');
  const groups = panel.locator('.function-config-group');
  await expect(groups).toHaveCount(2);
  await expect(groups.nth(0).locator('h3')).toContainText('Режим выполнения');
  await expect(groups.nth(1).locator('h3')).toContainText('Черновик команды');
  await expect(groups.nth(0).locator('#agentModeControl')).toHaveCount(1);
  await expect(groups.nth(1).locator('#agentTeamSize')).toHaveCount(1);
  await expect(groups.nth(1).locator('#agentTeamScenario')).toHaveCount(1);
  await expect(groups.nth(1).locator('#agentRolePreset')).toHaveCount(1);
  await expect(panel.locator('.agent-future-section')).toHaveCount(5);
  const capabilityGroups = panel.locator('.agent-settings-category');
  await expect(capabilityGroups).toHaveCount(3);
  await expect(capabilityGroups.nth(0).locator(':scope > summary')).toContainText('Применение и роли');
  await expect(capabilityGroups.nth(1).locator(':scope > summary')).toContainText('Оркестрация, модели и ресурсы');
  await expect(capabilityGroups.nth(2).locator(':scope > summary')).toContainText('Инструменты и разрешения');
  for (const group of await capabilityGroups.all()) {
    const summary = group.locator(':scope > summary');
    const box = await summary.boundingBox();
    expect(box?.height || 0, 'agent category summary must be a 44px touch target').toBeGreaterThanOrEqual(44);
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(group).toHaveAttribute('open', '');
    await page.keyboard.press('Space');
    await expect(group).not.toHaveAttribute('open', '');
  }
  await expect(panel.locator('.agent-future-section').nth(0)).toContainText('Способы применения');
  await expect(panel.locator('.agent-future-section').nth(1)).toContainText('64 логические профессии');
  await expect(panel.locator('.agent-future-section').nth(2)).toContainText('fan-out/fan-in');
  await expect(panel.locator('.agent-future-section').nth(3)).toContainText('RU/EN/TH');
  await expect(panel.locator('.agent-future-section').nth(4)).toContainText('capabilities');
  await expect(panel.locator('#agentRoadmapPause')).toBeVisible();
  await capabilityGroups.nth(0).locator(':scope > summary').click();
  await panel.locator('#agentRoadmapPause').check();
  await expect(capabilityGroups.nth(0).locator('.roadmap-ticker-track').first()).toHaveCSS('animation-play-state', 'paused');
  await panel.locator('#agentRoadmapPause').uncheck();
  await page.locator('#functionPanelModal [data-action="close-function-panel"]').first().click();
});

test('advanced settings are grouped by purpose with keyboard-friendly disclosures', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  const advanced = page.locator('#additionalSettings');
  if (!(await advanced.evaluate(element => element.open))) await advanced.locator(':scope > summary').click();

  const categories = advanced.locator('.settings-category');
  await expect(categories).toHaveCount(3);
  await expect(advanced.locator('[data-settings-category="appearance"] > summary')).toContainText('Внешний вид и удобство');
  await expect(advanced.locator('[data-settings-category="context"] > summary')).toContainText('Поиск и инструкции');
  await expect(advanced.locator('[data-settings-category="profile"] > summary')).toContainText('Профиль и резервные копии');
  for (const category of await categories.all()) {
    await expect(category).not.toHaveAttribute('open', '');
    const summary = category.locator(':scope > summary');
    const box = await summary.boundingBox();
    expect(box?.height || 0, 'settings category summary must be a touch target').toBeGreaterThanOrEqual(44);
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(category).toHaveAttribute('open', '');
    await page.keyboard.press('Space');
    await expect(category).not.toHaveAttribute('open', '');
  }

  await expect(advanced.locator('[data-settings-category="appearance"] #readabilitySettings')).toHaveCount(1);
  await expect(advanced.locator('[data-settings-category="context"] #systemPromptInput')).toHaveCount(1);
  await expect(advanced.locator('[data-settings-category="profile"] [data-action="export-settings-profile"]')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'settings should not overflow horizontally on mobile').toBeTruthy();
});

test('aLandi aServi is exclusive while provider and additional settings can remain open together', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH,{waitUntil:'domcontentloaded'});
  await page.locator('[data-action="toggle-settings"]').click();
  const cloud=page.locator('#aserviSettingsGroup'),providers=page.locator('#thirdPartyProviderSettings'),additional=page.locator('#additionalSettings');
  for (const selector of ['#aserviSettingsGroup > summary','#thirdPartyProviderSettings > summary','#additionalSettings > summary']) {
    const box=await page.locator(selector).boundingBox();
    expect(box?.height||0,selector+' should retain a 44px mobile hit target').toBeGreaterThanOrEqual(44);
  }
  if (!(await cloud.evaluate(element => element.open))) await cloud.locator(':scope > summary').click();
  await expect(cloud).toHaveAttribute('open','');
  await providers.locator(':scope > summary').focus();
  await page.keyboard.press('Enter');
  await expect(cloud).not.toHaveAttribute('open','');
  await expect(providers).toHaveAttribute('open','');
  await additional.locator(':scope > summary').focus();
  await page.keyboard.press('Space');
  await expect(providers).toHaveAttribute('open','');
  await expect(additional).toHaveAttribute('open','');
  await cloud.locator(':scope > summary').focus();
  await page.keyboard.press('Space');
  await expect(cloud).toHaveAttribute('open','');
  await expect(providers).not.toHaveAttribute('open','');
  await expect(additional).not.toHaveAttribute('open','');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('text readability preferences persist and apply in both themes', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await openSettingsCategory(page, 'appearance');
  await expect(page.locator('#readabilitySettings')).toBeVisible();
  await page.locator('#uiTextScale').evaluate(element => {
    element.value = '115';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const normalMuted=await page.locator('#memoryStatusLine').evaluate(element=>getComputedStyle(element).color);
  await page.locator('#uiTextContrast').selectOption('high');
  await expect(page.locator('#uiTextScaleValue')).toHaveText('115%');
  const highDark=await page.evaluate(()=>({
    muted:getComputedStyle(document.querySelector('#memoryStatusLine')).color,
    disabled:getComputedStyle(document.querySelector('#projectMemoryScopeSelect')).color,
    info:getComputedStyle(document.documentElement).getPropertyValue('--ui-info').trim()
  }));
  expect(highDark.muted).not.toBe(normalMuted);
  expect(highDark.disabled).not.toBe('');
  expect(highDark.info).not.toBe('');
  await expect(page.locator('html')).toHaveAttribute('data-text-contrast', 'high');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_ui_text_scale_v1'))).toBe('115');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_ui_text_contrast_v1'))).toBe('high');
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

  await toggleHeaderTheme(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-text-contrast', 'high');
  const highLight=await page.evaluate(()=>({
    muted:getComputedStyle(document.querySelector('#memoryStatusLine')).color,
    info:getComputedStyle(document.documentElement).getPropertyValue('--ui-info').trim()
  }));
  expect(highLight.muted).not.toBe('');
  expect(highLight.info).toBe('#174ea6');
  const scaledFontSize = await page.locator('#chatBox').evaluate(element => parseFloat(getComputedStyle(element).fontSize));
  expect(scaledFontSize).toBeGreaterThan(16);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-text-contrast', 'high');
  await expect(page.locator('#uiTextScaleValue')).toHaveText('115%');
  const previewFontSize = await page.locator('#readabilityPreview').evaluate(element => parseFloat(getComputedStyle(element).fontSize));
  expect(previewFontSize).toBeGreaterThan(12);

  await page.locator('[data-action="toggle-settings"]').click();
  await openSettingsCategory(page, 'appearance');
  await page.locator('[data-action="reset-readability"]').click();
  await expect(page.locator('#uiTextScaleValue')).toHaveText('100%');
  await expect(page.locator('html')).toHaveAttribute('data-text-contrast', 'normal');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_ui_text_scale_v1'))).toBe('100');
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-text-contrast', 'normal');
  await expect(page.locator('#uiTextScaleValue')).toHaveText('100%');
});

test('forced-colors mode preserves visible keyboard focus and control borders', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.emulateMedia({ forcedColors: 'active' });
  await expect.poll(() => page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus-visible').first();
  await expect(focused).toBeVisible();
  const focusStyle = await focused.evaluate(element => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: parseFloat(style.outlineWidth), outlineColor: style.outlineColor };
  });
  expect(focusStyle.outlineStyle).toBe('solid');
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(2);
  expect(focusStyle.outlineColor).not.toBe('transparent');
});

test('high-contrast preference updates every important text state in both themes', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await openSettingsCategory(page, 'appearance');
  await page.evaluate(() => {
    const content = document.createElement('div');
    content.className = 'assistant-content';
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = 'Contrast link fixture';
    content.appendChild(link);
    document.querySelector('#chatBox').appendChild(content);
    const error = document.createElement('p');
    error.className = 'field-error';
    error.setAttribute('role', 'alert');
    error.textContent = 'Contrast error fixture';
    document.querySelector('#chatBox').appendChild(error);
    const disabled = document.createElement('button');
    disabled.id = 'contrastDisabledFixture';
    disabled.disabled = true;
    disabled.textContent = 'Contrast disabled fixture';
    document.querySelector('#chatBox').appendChild(disabled);
    document.querySelector('#searchStatus').dataset.state = 'error';
    document.querySelector('#aserviStatus').dataset.state = 'checking';
  });
  const readStates = () => page.evaluate(() => ({
    normal: getComputedStyle(document.querySelector('#chatBox')).color,
    secondary: getComputedStyle(document.querySelector('#memoryStatusLine')).color,
    disabled: (() => { const style=getComputedStyle(document.querySelector('#contrastDisabledFixture')); return style.webkitTextFillColor || style.getPropertyValue('-webkit-text-fill-color') || style.color; })(),
    link: (() => { const style=getComputedStyle(document.querySelector('#chatBox .assistant-content a')); return style.webkitTextFillColor || style.getPropertyValue('-webkit-text-fill-color') || style.color; })(),
    error: getComputedStyle(document.querySelector('#chatBox [role="alert"]')).color,
    status: getComputedStyle(document.querySelector('#statusText')).color,
    aserviWarning: getComputedStyle(document.querySelector('#aserviStatus')).color
  }));
  await page.locator('#uiTextContrast').selectOption('normal');
  await expect(page.locator('html')).toHaveAttribute('data-text-contrast','normal');
  const normalDark = await readStates();
  await page.locator('#uiTextContrast').selectOption('high');
  await expect(page.locator('html')).toHaveAttribute('data-text-contrast','high');
  const highDark = await readStates();
  for (const key of ['secondary','disabled','link','error','status']) {
    expect(highDark[key], key + ' must change in dark theme').not.toBe(normalDark[key]);
    expect(highDark[key]).not.toBe('');
  }
  expect(highDark.normal).toBe(normalDark.normal);

  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await toggleHeaderTheme(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator('[data-action="toggle-settings"]').click();
  const additionalSettings = page.locator('#additionalSettings');
  if (!(await additionalSettings.evaluate(element => element.open))) {
    await openSettingsCategory(page, 'appearance');
  }
  await expect(page.locator('#uiTextContrast')).toBeVisible();
  const highLight = await readStates();
  await page.locator('#uiTextContrast').selectOption('normal');
  const normalLight = await readStates();
  for (const key of ['secondary','disabled','link','error','status']) {
    expect(highLight[key], key + ' must change in light theme').not.toBe(normalLight[key]);
    expect(highLight[key]).not.toBe('');
  }
  expect(highLight.normal).toBe(normalLight.normal);
  expect(highLight.aserviWarning).not.toBe(highDark.aserviWarning);
});

test('readability tokens and actual status surfaces meet AA in both themes', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const metadata = document.createElement('div');
    metadata.id = 'contrastMetadataFixture';
    metadata.className = 'message-model-meta';
    metadata.textContent = 'Model metadata';
    document.body.appendChild(metadata);
    const row = document.createElement('div');
    row.className = 'memory-item';
    const action = document.createElement('button');
    action.id = 'contrastMemoryActionFixture';
    action.type = 'button';
    action.style.transition = 'none';
    action.textContent = '×';
    row.appendChild(action);
    document.body.appendChild(row);
  });
  const measure = (theme, contrastMode) => page.evaluate(({ selectedTheme, selectedContrast }) => {
    const root = document.documentElement;
    root.dataset.theme = selectedTheme;
    root.dataset.textContrast = selectedContrast;
    const css = getComputedStyle(root);
    const rgb = value => {
      const color = value.trim();
      if (color.startsWith('#')) {
        const raw = color.slice(1);
        const full = raw.length === 3 ? raw.split('').map(char => char + char).join('') : raw;
        return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16));
      }
      const parts = color.match(/[\d.]+/g);
      return parts ? parts.slice(0, 3).map(Number) : [0, 0, 0];
    };
    const rgbString = value => 'rgb(' + rgb(value).map(channel => Math.round(channel)).join(', ') + ')';
    const luminance = color => {
      const channels = rgb(color).map(value => value / 255).map(value =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
      );
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const contrast = (foreground, background) => {
      const a = luminance(foreground), b = luminance(background);
      return +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);
    };
    const surface = css.getPropertyValue('--ui-surface').trim();
    const raisedSurface = css.getPropertyValue('--ui-surface-raised').trim();
    const colors = {
      primary: css.getPropertyValue('--ui-text'),
      secondary: css.getPropertyValue('--ui-text-muted'),
      info: css.getPropertyValue('--ui-info'),
      success: css.getPropertyValue('--ui-success'),
      warning: css.getPropertyValue('--ui-warning'),
      error: css.getPropertyValue('--ui-danger')
    };
    if (selectedContrast === 'high') colors.disabled = css.getPropertyValue('--ui-disabled-text');
    const surfaceRatios = Object.fromEntries(Object.entries(colors).map(([name, color]) => [name, contrast(color, surface)]));
    const toastTokens = { info: '--ui-info', warning: '--ui-warning', success: '--ui-success', error: '--ui-danger' };
    const toast = document.querySelector('#toast');
    const toastRatios = {};
    const toastMatches = {};
    for (const [state, token] of Object.entries(toastTokens)) {
      toast.dataset.state = state;
      const actual = getComputedStyle(toast).color;
      toastRatios[state] = contrast(actual, raisedSurface);
      toastMatches[state] = actual === rgbString(css.getPropertyValue(token));
    }
    const metadata = document.querySelector('#contrastMetadataFixture');
    const memoryAction = document.querySelector('#contrastMemoryActionFixture');
    const actualStyles = {
      metadata: getComputedStyle(metadata).color === rgbString(css.getPropertyValue('--ui-text-muted')),
      metadataDot: getComputedStyle(metadata, '::before').color === rgbString(css.getPropertyValue('--ui-success')),
      memoryAction: getComputedStyle(memoryAction).color === rgbString(css.getPropertyValue('--ui-text-muted')),
      toastBackground: getComputedStyle(toast).backgroundColor === rgbString(raisedSurface),
      toastStates: toastMatches
    };
    return { surfaceRatios, toastRatios, actualStyles };
  }, { selectedTheme: theme, selectedContrast: contrastMode });
  for (const theme of ['dark', 'light']) {
    for (const contrastMode of ['normal', 'high']) {
      const result = await measure(theme, contrastMode);
      for (const [name, value] of Object.entries(result.surfaceRatios)) {
        expect(value, theme + ' ' + contrastMode + ' ' + name + ' surface contrast').toBeGreaterThanOrEqual(4.5);
      }
      for (const [name, value] of Object.entries(result.toastRatios)) {
        expect(value, theme + ' ' + contrastMode + ' toast ' + name + ' contrast').toBeGreaterThanOrEqual(4.5);
      }
      for (const [name, value] of Object.entries(result.actualStyles)) {
        if (name === 'toastStates') {
          for (const [state, matches] of Object.entries(value)) expect(matches, theme + ' ' + contrastMode + ' toast ' + state + ' uses semantic token').toBe(true);
        } else {
          expect(value, theme + ' ' + contrastMode + ' ' + name + ' uses theme-aware token').toBe(true);
        }
      }
    }
  }
  await page.locator('#contrastMemoryActionFixture').hover();
  const memoryHoverUsesDanger = await page.evaluate(() => {
    const css = getComputedStyle(document.documentElement);
    const raw = css.getPropertyValue('--ui-danger').trim().slice(1);
    const expected = [0, 2, 4].map(index => parseInt(raw.slice(index, index + 2), 16));
    return getComputedStyle(document.querySelector('#contrastMemoryActionFixture')).color === 'rgb(' + expected.join(', ') + ')';
  });
  expect(memoryHoverUsesDanger).toBe(true);
});

test('interactive controls avoid selection while editable fields and message text remain selectable', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const values = await page.evaluate(() => {
    const message = document.createElement('div');
    message.className = 'assistant-content';
    message.textContent = 'Selectable assistant message fixture';
    document.querySelector('#chatBox').appendChild(message);
    const viewer = document.createElement('div');
    viewer.className = 'message-viewer-content';
    viewer.textContent = 'Selectable expanded message fixture';
    document.body.appendChild(viewer);
    const style = selector => {
      const element = document.querySelector(selector);
      const computed = getComputedStyle(element);
      return { userSelect: computed.userSelect, webkitUserSelect: computed.webkitUserSelect, touchAction: computed.touchAction };
    };
    return {
      button: style('#sendBtn'),
      disclosure: style('#projectNavToggle'),
      input: style('#userInput'),
      message: style('#chatBox .assistant-content'),
      viewer: style('.message-viewer-content')
    };
  });
  expect(values.button.userSelect).toBe('none');
  expect(values.button.webkitUserSelect).toBe('none');
  expect(values.button.touchAction).toBe('manipulation');
  expect(values.disclosure.userSelect).toBe('none');
  expect(values.disclosure.touchAction).toBe('manipulation');
  expect(values.input.userSelect).toBe('text');
  expect(values.input.webkitUserSelect).toBe('text');
  expect(values.message.userSelect).toBe('text');
  expect(values.message.webkitUserSelect).toBe('text');
  expect(values.viewer.userSelect).toBe('text');
  expect(values.viewer.webkitUserSelect).toBe('text');
});

test('composer position persists and aLandi is hidden from third-party provider selection', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await openSettingsCategory(page, 'appearance');
  await expect(page.locator('#composerPosition')).toHaveValue('bottom');
  await expect(page.locator('#providerPreset option[value="alandi"]')).toHaveCount(0);
  await expect(page.locator('#providerExternalGroup')).not.toHaveAttribute('hidden', '');
  await expect.poll(() => page.locator('#providerPreset').evaluate(select => [...select.options].some(option => option.value === 'gemini'))).toBe(true);
  await expect(page.locator('#providerPreset option[value="gemini"]')).toBeEnabled();
  await expect(page.locator('[data-action="select-alandi-primary"]')).toHaveCount(0);

  await page.locator('#composerPosition').selectOption('top');
  await expect(page.locator('body')).toHaveClass(/composer-at-top/);
  const topComposer = await page.locator('#composerFooter').boundingBox();
  const topMessages = await page.locator('#chatBox').boundingBox();
  expect(topComposer.y).toBeLessThan(topMessages.y);
  await page.locator('[data-action="save-settings"]').click();
  await page.reload();
  await page.locator('[data-action="toggle-settings"]').click();
  await openSettingsCategory(page, 'appearance');
  await expect(page.locator('#composerPosition')).toHaveValue('top');
  await expect(page.locator('body')).toHaveClass(/composer-at-top/);

  await page.locator('#composerPosition').selectOption('bottom');
  await page.locator('[data-action="save-settings"]').click();
  await expect(page.locator('body')).not.toHaveClass(/composer-at-top/);
  const bottomComposer = await page.locator('#composerFooter').boundingBox();
  const bottomMessages = await page.locator('#chatBox').boundingBox();
  expect(bottomMessages.y).toBeLessThan(bottomComposer.y);
  await page.reload();
  await page.locator('[data-action="toggle-settings"]').click();
  await openSettingsCategory(page, 'appearance');
  await expect(page.locator('#composerPosition')).toHaveValue('bottom');
});

test('project creation is separate from full settings and project sources expose no fake controls', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await expect(page.locator('#projectPanel > div').first()).toContainText('Создать проект');
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await expect(page.locator('#projectCreateModal')).toBeVisible();
  await expect(page.locator('#projectSettingsModal')).toBeHidden();
  await page.locator('#projectCreateNameInput').fill('Shared scope project');
  await page.locator('#projectCreateInstructionsInput').fill('A scoped project instruction');
  await page.locator('#projectCreateModal [data-action="create-project"]').click();
  await expect(page.locator('#projectCreateModal')).toBeHidden();
  await expect(page.locator('#projectSettingsModal')).toBeHidden();
  await expect(page.locator('#currentProjectSelect')).toHaveValue('');
  const projectId = await page.evaluate(() => JSON.parse(localStorage.getItem('ai_projects_v1') || '[]').find(project => project.name === 'Shared scope project')?.id || '');
  await openProjectSettingsForId(page, projectId);
  await expect(page.locator('#projectManagerDetails')).toHaveAttribute('open', '');
  await expect(page.locator('#projectMemoryScopeSelect')).toBeEnabled();
  await expect(page.locator('#projectSourcesSection')).toBeVisible();
  await expect(page.locator('#projectSourcesSection')).toContainText('API списка источников');
  await expect(page.locator('#projectSourcesSection .roadmap-ticker')).toBeVisible();
  await expect(page.locator('#projectSourcesSection .roadmap-note')).toContainText('никаких действий с источниками не имитируется');
  await expect(page.locator('#projectSourcesSection button')).toHaveCount(0);
  await page.locator('#projectMemoryScopeSelect').selectOption('project-and-global');
  await page.locator('#projectSettingsModal [data-action="save-project"]').click();
  await expect.poll(() => page.evaluate(id => JSON.parse(localStorage.getItem('ai_projects_v1') || '[]').find(project => project.id === id)?.memoryScope, projectId)).toBe('project-and-global');
});
test('language switch localizes provider controls without exposing the internal route', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await selectLanguage(page, 'en');
  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#providerExternalGroup')).toHaveAttribute('label', 'Third-party providers');
  await expect(page.locator('#providerPreset option[value="alandi"]')).toHaveCount(0);
  await expect(page.locator('#aserviSettingsGroup')).toBeVisible();
  await expect(page.locator('#aserviBaseUrl')).toHaveAttribute('aria-label', 'My server URL');
  await expect(page.locator('#aserviModel')).toHaveAttribute('aria-label', 'Gateway model');
  await expect(page.locator('#aserviApiKey')).toHaveAttribute('aria-label', 'Server access key');
  await expect(page.locator('[data-action="paste-aservi-key"]')).toHaveAttribute('aria-label', 'Paste access key');
  await expect(page.locator('#systemPromptInput')).toHaveAttribute('placeholder', 'Your shared instructions (optional)');
  await expect(page.locator('#editSystemPrompt')).toHaveAttribute('aria-label', 'Edit system prompt');
  await expect(page.locator('[data-action="connect-aservi"]')).toHaveText('Verify and connect');
  await expect(page.locator('[data-action="connect-aservi"]')).toHaveCount(1);
  await expect(page.locator('#thirdPartyProviderSettings #aserviSettingsCard, #thirdPartyProviderSettings [data-action="paste-aservi-key"]')).toHaveCount(0);
  await expect(page.locator('#providerPreset option[value="gemini"]')).toHaveCount(1);
  await expect(page.locator('#providerPreset option[value="custom"]')).toHaveCount(1);
  await page.locator('.settings-header-actions [data-action="close-settings"]').click();
  await selectLanguage(page, 'ru');
});

test('request context stays project-only and agent label describes the real pipeline', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('#contextPickerButton').click();
  await expect(page.locator('#requestContextMenu')).toBeVisible();
  await expect(page.locator('#requestContextMenu')).not.toContainText(/connectors|коннектор|scheduler|планировщик/i);
  await page.locator('#composerPopoverScrim').click({ position: { x: 5, y: 5 } });

  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="agents"]').click();
  await expect(page.locator('#functionPanelDescription')).toContainText(/четыре этапа|four stages/i);
  await expect(page.locator('#agentModeControl')).toBeVisible();
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

test('published app boots and core controls are interactive', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('link[rel="stylesheet"][href*="assets/css/app.css"]')).toHaveCount(1);
  await expect(page).toHaveTitle(/aLandi/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'aLandi — личная AI-среда для чатов, проектов и работы с контекстом.');
  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'dark light');
  await expect(page.locator('#chatBox')).toBeVisible();
  await expect(page.locator('#userInput')).toBeEditable();
  await expect(page.locator('#searchModeSummary')).toBeVisible();
  await expect(page.locator('#searchModeSummary')).toContainText('Обычный');
  await expect(page.locator('#toggleSearch')).toBeChecked();
  await expect(page.locator('#functionsMenuSummary')).toBeVisible();
  await expect(page.locator('#toggleMultiAgent')).not.toBeChecked();

  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await expect(page.locator('#thirdPartyProviderSettings')).not.toHaveAttribute('open');
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
  await expect(page.locator('#settingsModal')).toBeVisible();
  await expect(page.locator('#providerPreset')).toHaveValue('');
  await expect(page.locator('#apiKey')).toHaveAttribute('type', 'password');
  await expect(page.locator('#baseUrl')).not.toBeFocused();
  await expect(page.locator('#systemPromptInput')).toHaveAttribute('readonly', '');
  await openSettingsCategory(page, 'context');
  await page.locator('#editSystemPrompt').click();
  await expect(page.locator('#systemPromptInput')).not.toHaveAttribute('readonly', '');
  await page.locator('#editSystemPrompt').click();
  await expect(page.locator('#systemPromptInput')).toHaveAttribute('readonly', '');
  await page.locator('#providerPreset').selectOption('gemini');
  await page.locator('#modelPreset').selectOption('gemini-3.6-flash');
  await expect(page.locator('#modelName')).toHaveValue('gemini-3.6-flash');
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await chooseSearchMode(page, 'offline');
  await expect(page.locator('#searchModeSummary')).toContainText(/выкл\./i);
  await page.reload();
  await expect(page.locator('#searchModeSummary')).toContainText(/выкл\./i);
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
  await page.locator('#thirdPartyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('groq');
  await expect(page.locator('#apiKey')).toHaveValue('');
  await page.locator('#apiKey').fill('e2e-groq-placeholder-not-a-real-key');
  await page.locator('#modelName').fill('openai/gpt-oss-120b');
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

  await openSearchToolsSettings(page);
  await page.locator('#tavilyKey').fill('e2e-tavily-placeholder-not-a-real-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

  await page.reload();
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await page.locator('#thirdPartyProviderSettings > summary').click();
  await expect(page.locator('#providerPreset')).toHaveValue('groq');
  await expect(page.locator('#apiKey')).toHaveValue('e2e-groq-placeholder-not-a-real-key');
  await page.locator('#providerPreset').selectOption('openrouter');
  await expect(page.locator('#apiKey')).toHaveValue('e2e-openrouter-placeholder-not-a-real-key');
  await openSearchToolsSettings(page);
  await expect(page.locator('#tavilyKey')).toHaveValue('e2e-tavily-placeholder-not-a-real-key');
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(element => element.open))) {
    await page.locator('#thirdPartyProviderSettings > summary').click();
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
  await page.locator('#thirdPartyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('groq');
  await page.locator('#modelName').fill('openai/gpt-oss-120b');
  await page.locator('#apiKey').fill('e2e-private-provider-secret-value');
  await openSearchToolsSettings(page);
  await page.locator('#tavilyKey').fill('e2e-private-search-secret-value');
  await page.locator('#allowCrossProviderFallback').check();
  await page.locator('[data-action="save-settings"]').click();
  await openSettingsCategory(page, 'profile');

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
  expect(json).not.toContain('e2e-private-provider-secret-value');
  expect(json).not.toContain('e2e-private-search-secret-value');
  expect(json).not.toContain('ai_api_key_');
  expect(json).not.toContain('apiKey');
});

test('settings profile import restores preferences while preserving existing provider and search keys', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await page.locator('#thirdPartyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('before-import');
  await page.locator('#apiKey').fill('e2e-preserved-provider-secret');
  await openSearchToolsSettings(page);
  await page.locator('#tavilyKey').fill('e2e-preserved-tavily-secret');
  await page.locator('[data-action="save-settings"]').click();
  await openSettingsCategory(page, 'profile');

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
      crossProviderFallback: false
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
  await expect(page.locator('#apiKey')).toHaveValue('e2e-preserved-provider-secret');
  await expect(page.locator('#tavilyKey')).toHaveValue('e2e-preserved-tavily-secret');
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
  await page.addInitScript((traceData) => {
    localStorage.setItem('ai_chats_v87', JSON.stringify([{
      id: 'e2e-trace-chat', title: 'Trace test',
      messages: [{ role: 'assistant', content: traceData.finalText, researchTrace: { id: traceData.id } }]
    }]));
    localStorage.setItem('ai_current_chat_v87', 'e2e-trace-chat');
    localStorage.setItem('ai_research_trace_' + traceData.id, JSON.stringify(traceData));
  }, trace);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#chatBox')).toContainText('Final result', { timeout: 10000 });
  await expect(page.locator('[data-action="open-trace"][data-trace-id="e2e-json-trace"]')).toBeVisible({ timeout: 10000 });
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
    const isProbe = payload.messages?.at(-1)?.content === 'Reply with exactly OK. No other words.';
    if (isProbe) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ model: 'e2e-actual-model', choices: [{ message: { role: 'assistant', content: 'OK' } }] }) });
      return;
    }
    calls++;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'e2e-actual-model', choices: [{ message: { role: 'assistant', content: 'Привет! Рад помочь.' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
    const payload = route.request().postDataJSON();
    if (payload.messages?.at(-1)?.content === 'Reply with exactly OK. No other words.') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ model: payload.model, choices: [{ message: { role: 'assistant', content: 'OK' } }] }) });
      return;
    }
    calls++;
    await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: { message: 'invalid credential' } }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
    if (payload.messages?.at(-1)?.content === 'Reply with exactly OK. No other words.') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ model: payload.model, choices: [{ message: { role: 'assistant', content: 'OK' } }] }) });
      return;
    }
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
    const payload = route.request().postDataJSON();
    const model = payload.model;
    if (payload.messages?.at(-1)?.content === 'Reply with exactly OK. No other words.') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ model, choices: [{ message: { role: 'assistant', content: 'OK' } }] }) });
      return;
    }
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
  await toggleHeaderTheme(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_ui_theme_v2'))).toBe('light');

  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await openSettingsCategory(page, 'appearance');
  await page.locator('#uiMotion').selectOption('off');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_ui_motion_v2'))).toBe('off');
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');

  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await openSettingsCategory(page, 'appearance');
  await page.locator('#uiMotion').selectOption('auto');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'auto');
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await toggleHeaderTheme(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_ui_theme_v2'))).toBe('dark');
});


test('agent systems skill is routed on demand and its safety contract stays available', async () => {
  const source = await readFile('./assets/js/app.js', 'utf8');
  const skill = await readFile('./skills/agent-systems.txt', 'utf8');
  expect(source).toContain("isAgentSystemsTask ? 'agent-systems'");
  expect(source).toContain("new URL('skills/' + selectedSkill + '.txt', document.baseURI)");
  expect(skill).toContain('The 64-role catalog is 64 logical roles');
  expect(skill).toContain('Chat memory is isolated by default');
  expect(skill).toContain('Google Drive requires backend OAuth callback');
  expect(skill).toContain('candidate lesson');
});


test('aLandi aServi status only turns green after a real model response, and core UX controls work', async ({ page }) => {
  const aserviRequests = [];
  await page.route('https://aservi.example.test/healthz', async route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' })
  }));
  await page.route('https://aservi.example.test/v1/chat/completions', async route => {
    aserviRequests.push(route.request().postDataJSON());
    return route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'qwen3.5:4b', choices: [{ message: { role: 'assistant', content: 'OK' } }] })
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#clockDigital')).toHaveText(/^\d{2}:\d{2}$/);
  await expect(page.locator('#aserviStatusDot')).toHaveAttribute('data-state', 'disconnected');
  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#thirdPartyProviderSettings')).not.toHaveAttribute('open');
  await expect(page.locator('#aserviStatusDot')).toHaveAttribute('data-state', 'disconnected');
  await page.locator('#aserviBaseUrl').fill('https://aservi.example.test/v1');
  await page.locator('#aserviModel').fill('qwen3.5:4b');
  await page.locator('#aserviApiKey').fill('e2e-cloud-placeholder-key');
  await expect(page.locator('#aserviStatusDot')).toHaveAttribute('data-state', 'disconnected');
  await expect(page.locator('#aserviStatusDot')).toHaveAttribute('data-state', 'connected', { timeout: 15000 });
  await expect(page.locator('#aserviStatus')).toContainText('Подключено');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_api_provider'))).toBe('alandi');
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Verify the primary chat uses my aLandi aServi.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('OK', { timeout: 15000 });
  expect(aserviRequests).toHaveLength(2);
  expect(aserviRequests[1].messages.at(-1).content).toBe('Verify the primary chat uses my aLandi aServi.');
  expect(aserviRequests.every(request => request.model === 'qwen3.5:4b')).toBe(true);
  await selectLanguage(page, 'en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#userInput')).toHaveAttribute('placeholder', 'Write a message...');
  await toggleHeaderTheme(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await toggleHeaderTheme(page);
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
  await expect(page.locator('#aserviSettingsCard')).not.toContainText('Kilo Auto Free');
  await page.locator('#thirdPartyProviderSettings > summary').click();
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
  await page.locator('#thirdPartyProviderSettings > summary').click();
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
  const capturedBodies = [];
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const payload=route.request().postDataJSON();
    const last=payload.messages?.at(-1)?.content;
    if(last==='Reply with exactly OK.'||last==='Reply with exactly OK. No other words.') return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({model:'e2e-project-model',choices:[{message:{role:'assistant',content:'OK'}}]})});
    capturedBodies.push(payload);
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'e2e-project-model', choices: [{ message: { role: 'assistant', content: 'Project scope verified.' } }] }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  const alphaId = await createProjectFromUi(page, 'Alpha Project', 'ALPHA_PROJECT_INSTRUCTION_SENTINEL');
  await openProjectSettingsForId(page, alphaId);
  await page.locator('#projectMemoryInput').fill('ALPHA_PROJECT_MEMORY_SENTINEL');
  await expect(page.locator('#projectMemoryInput')).toHaveValue('ALPHA_PROJECT_MEMORY_SENTINEL');
  await page.locator('[data-action="add-project-memory"]').click();
  await expect.poll(() => page.evaluate(projectId => {
    const project=JSON.parse(localStorage.getItem('ai_projects_v1')||'[]').find(item=>item.id===projectId);
    return Boolean(project?.memory?.some(item=>item.text==='ALPHA_PROJECT_MEMORY_SENTINEL'));
  }, alphaId)).toBe(true);
  await expect(page.locator('#projectMemoryBox')).toContainText('ALPHA_PROJECT_MEMORY_SENTINEL');
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

  await ensureSidebarOpen(page);
  const alphaGroup = page.locator('#projectNavigationList details[data-project-id="' + alphaId + '"]');
  if (!(await alphaGroup.evaluate(element => element.open))) await alphaGroup.locator(':scope > summary').click();
  await alphaGroup.locator('[data-action="new-chat-in-project"]').click();
  await expect(page.locator('#currentProjectSelect')).toHaveValue(alphaId);
  await ensureSidebarOpen(page);
  const personalGroup=page.locator('#projectlessGroup');
  if(!(await personalGroup.evaluate(element=>element.open))) await personalGroup.locator(':scope > summary').click();
  await personalGroup.locator('[data-action="projectless-nav"]').click();
  await page.locator('#sidebar [data-action="new-chat"]').click();
  await expect(page.locator('#currentProjectSelect')).toHaveValue('');
  const betaId = await createProjectFromUi(page, 'Beta Project', 'BETA_PROJECT_INSTRUCTION_SENTINEL');
  expect(betaId).not.toBe(alphaId);
  await openProjectSettingsForId(page, betaId);
  await page.locator('#projectMemoryInput').fill('BETA_PROJECT_MEMORY_SENTINEL');
  await expect(page.locator('#projectMemoryInput')).toHaveValue('BETA_PROJECT_MEMORY_SENTINEL');
  await page.locator('[data-action="add-project-memory"]').click();
  await expect.poll(() => page.evaluate(projectId => {
    const project=JSON.parse(localStorage.getItem('ai_projects_v1')||'[]').find(item=>item.id===projectId);
    return Boolean(project?.memory?.some(item=>item.text==='BETA_PROJECT_MEMORY_SENTINEL'));
  }, betaId)).toBe(true);
  await expect(page.locator('#projectMemoryBox')).toContainText('BETA_PROJECT_MEMORY_SENTINEL');
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();

  await ensureSidebarOpen(page);
  const betaGroup = page.locator('#projectNavigationList details[data-project-id="' + betaId + '"]');
  if (!(await betaGroup.evaluate(element => element.open))) await betaGroup.locator(':scope > summary').click();
  await betaGroup.locator('[data-action="new-chat-in-project"]').click();
  await ensureSidebarOpen(page);
  const betaChatId = await page.evaluate(() => localStorage.getItem('ai_current_chat_v87'));
  await expect(page.locator('#currentProjectSelect')).toHaveValue(betaId);
  const betaChatRow = page.locator('#projectNavigationList .chat-row').filter({ has: page.locator('[data-action="switch-chat"][data-chat-id="' + betaChatId + '"]') });
  const betaChatMenu = betaChatRow.locator('.chat-row-menu > summary');
  await betaChatMenu.evaluate(element => element.scrollIntoView({ block: 'center', inline: 'nearest' }));
  await expect(betaChatMenu).toBeInViewport();
  await betaChatMenu.click();
  await betaChatRow.locator('[data-action="chat-project"]').click();
  await page.locator('#chatActionProject').selectOption(alphaId);
  await page.locator('[data-action="chat-action-save"]').click();
  await expect(page.locator('#currentProjectSelect')).toHaveValue(alphaId);
  await ensureSidebarOpen(page);
  const movedChatRow = page.locator('#projectNavigationList .chat-row').filter({ has: page.locator('[data-action="switch-chat"][data-chat-id="' + betaChatId + '"]') });
  const movedChatMenu = movedChatRow.locator('.chat-row-menu > summary');
  await movedChatMenu.evaluate(element => element.scrollIntoView({ block: 'center', inline: 'nearest' }));
  await expect(movedChatMenu).toBeInViewport();
  await movedChatMenu.click();
  await movedChatRow.locator('[data-action="chat-project"]').click();
  await page.locator('#chatActionProject').selectOption(betaId);
  await page.locator('[data-action="chat-action-save"]').click();
  await expect(page.locator('#currentProjectSelect')).toHaveValue(betaId);

  await openProjectSettingsForId(page, betaId);
  await expect(page.locator('#projectMemoryToggle')).toHaveCount(0);
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();
  await ensureSidebarClosed(page);
  await page.locator('[data-action="toggle-settings"]').first().click();
  await page.locator('#thirdPartyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-project-model');
  await page.locator('#apiKey').fill('e2e-project-placeholder-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Check which project context is included.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Project scope verified.');
  await expect.poll(() => capturedBodies.length).toBe(1);
  const implicitPrompt = capturedBodies[0].messages[0].content;
  expect(implicitPrompt).toContain('BETA_PROJECT_INSTRUCTION_SENTINEL');
  expect(implicitPrompt).not.toContain('BETA_PROJECT_MEMORY_SENTINEL');
  expect(implicitPrompt).not.toContain('ALPHA_PROJECT_INSTRUCTION_SENTINEL');
  expect(implicitPrompt).not.toContain('ALPHA_PROJECT_MEMORY_SENTINEL');
  await page.locator('#contextPickerButton').click();
  await page.locator('#requestProjectChecks input[data-request-project-id="' + betaId + '"]').check();
  await page.locator('#composerPopoverScrim').click({ position: { x: 8, y: 8 } });
  await page.locator('#userInput').fill('Use the project context explicitly.');
  await page.locator('#sendBtn').click();
  await expect.poll(() => capturedBodies.length).toBe(2);
  const explicitPrompt = capturedBodies[1].messages[0].content;
  expect(explicitPrompt).toContain('BETA_PROJECT_INSTRUCTION_SENTINEL');
  expect(explicitPrompt).toContain('BETA_PROJECT_MEMORY_SENTINEL');
  expect(explicitPrompt).not.toContain('ALPHA_PROJECT_MEMORY_SENTINEL');
  await openProjectSettingsForId(page, betaId);
  await page.locator('#projectSettingsModal [data-action="import-project"]').click();
  await page.locator('#importProjectFile').setInputFiles(alphaPath);
  await expect(page.locator('#projectNameInput')).toHaveValue('Alpha Project (импорт)');
  const importedId = await page.evaluate(() => JSON.parse(localStorage.getItem('ai_projects_v1') || '[]').find(project => project.name === 'Alpha Project (импорт)')?.id || '');
  expect(importedId).not.toBe(alphaId);
  expect(importedId).not.toBe(betaId);
  await expect(page.locator('#projectInstructionsInput')).toHaveValue('ALPHA_PROJECT_INSTRUCTION_SENTINEL');
  await expect(page.locator('#projectMemoryBox')).toContainText('ALPHA_PROJECT_MEMORY_SENTINEL');
  const allProjects = await page.evaluate(() => JSON.parse(localStorage.getItem('ai_projects_v1') || '[]'));
  expect(allProjects.some(project => project.id === betaId && project.instructions.includes('BETA_PROJECT_INSTRUCTION_SENTINEL'))).toBe(true);
  expect(allProjects.some(project => project.id === importedId && project.instructions.includes('ALPHA_PROJECT_INSTRUCTION_SENTINEL'))).toBe(true);
});
test('project context handoff queues exactly one request for an existing chat without moving it', async ({ page }) => {
  const capturedBodies = [];
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const payload=route.request().postDataJSON();
    const last=payload.messages?.at(-1)?.content;
    if(last==='Reply with exactly OK.'||last==='Reply with exactly OK. No other words.') return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({model:'e2e-handoff-model',choices:[{message:{role:'assistant',content:'OK'}}]})});
    capturedBodies.push(payload);
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'e2e-handoff-model', choices: [{ message: { role: 'assistant', content: 'Handoff context verified.' } }] }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await ensureSidebarClosed(page);
  await page.locator('[data-action="toggle-settings"]').first().click();
  await page.locator('#thirdPartyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-handoff-model');
  await page.locator('#apiKey').fill('e2e-handoff-placeholder-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

  const targetChatId = await page.evaluate(() => localStorage.getItem('ai_current_chat_v87'));
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#chatListNewButton').click();
  const originalCurrentChatId = await page.evaluate(() => localStorage.getItem('ai_current_chat_v87'));
  expect(originalCurrentChatId).not.toBe(targetChatId);

  const projectId = await createProjectFromUi(page, 'Handoff project', 'HANDOFF_PROJECT_INSTRUCTION_SENTINEL');
  await openProjectSettingsForId(page, projectId);
  await page.locator('#projectMemoryInput').fill('HANDOFF_PROJECT_MEMORY_SENTINEL');
  await page.locator('[data-action="add-project-memory"]').click();
  await expect(page.locator('#projectMemoryBox')).toContainText('HANDOFF_PROJECT_MEMORY_SENTINEL');
  const target = page.locator('#projectContextTargetChat');
  await expect(target.locator('option[value="' + targetChatId + '"]')).toHaveCount(1);
  await target.selectOption(targetChatId);
  const handoff = page.locator('#projectSettingsModal [data-action="handoff-project-context"]');
  await expect(handoff).toBeEnabled();
  await handoff.click();
  await expect.poll(() => page.evaluate(({ targetChatId, projectId }) => {
    const pending = JSON.parse(sessionStorage.getItem('ai_request_project_context_v1') || '[]');
    return pending.some(([chatId, ids]) => chatId === targetChatId && ids.includes(projectId));
  }, { targetChatId, projectId })).toBe(true);

  const afterHandoff = await page.evaluate(() => ({
    current: localStorage.getItem('ai_current_chat_v87'),
    chats: JSON.parse(localStorage.getItem('ai_chats_v87') || '[]').map(chat => ({ id: chat.id, projectId: chat.projectId || '' }))
  }));
  expect(afterHandoff.current).toBe(originalCurrentChatId);
  expect(afterHandoff.chats).toHaveLength(2);
  expect(afterHandoff.chats.every(chat => chat.projectId === '')).toBe(true);

  // A queued handoff survives a reload in this tab, but remains session-scoped and one-shot.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await ensureSidebarOpen(page);
  const targetRow = page.locator('#chatList .chat-row').filter({ has: page.locator('[data-action="switch-chat"][data-chat-id="' + targetChatId + '"]') });
  await targetRow.locator('[data-action="switch-chat"]').click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_current_chat_v87'))).toBe(targetChatId);
  await expect(page.locator('#currentProjectSelect')).toHaveValue('');

  await page.locator('#userInput').fill('Use the handed-off project context once.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Handoff context verified.');
  await expect.poll(() => capturedBodies.length).toBe(1);
  expect(capturedBodies[0].messages[0].content).toContain('HANDOFF_PROJECT_INSTRUCTION_SENTINEL');
  expect(capturedBodies[0].messages[0].content).toContain('HANDOFF_PROJECT_MEMORY_SENTINEL');

  await page.locator('#userInput').fill('Check that the handoff was consumed.');
  await page.locator('#sendBtn').click();
  await expect.poll(() => capturedBodies.length).toBe(2);
  expect(capturedBodies[1].messages[0].content).not.toContain('HANDOFF_PROJECT_INSTRUCTION_SENTINEL');
  expect(capturedBodies[1].messages[0].content).not.toContain('HANDOFF_PROJECT_MEMORY_SENTINEL');
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('ai_request_project_context_v1'))).toBeNull();
  const finalState = await page.evaluate(() => ({
    current: localStorage.getItem('ai_current_chat_v87'),
    chats: JSON.parse(localStorage.getItem('ai_chats_v87') || '[]').length
  }));
  expect(finalState.current).toBe(targetChatId);
  expect(finalState.chats).toBe(2);

  // Also restore a handoff when the selected target chat itself is active during reload.
  await openProjectSettingsForId(page, projectId);
  await page.locator('#projectContextTargetChat').selectOption(targetChatId);
  await page.locator('#projectSettingsModal [data-action="handoff-project-context"]').click();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#userInput').fill('Use context after reloading the selected chat.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Handoff context verified.');
  await expect.poll(() => capturedBodies.length).toBe(3);
  expect(capturedBodies[2].messages[0].content).toContain('HANDOFF_PROJECT_INSTRUCTION_SENTINEL');
  expect(capturedBodies[2].messages[0].content).toContain('HANDOFF_PROJECT_MEMORY_SENTINEL');
  await page.locator('#userInput').fill('Confirm the reloaded handoff is one-shot.');
  await page.locator('#sendBtn').click();
  await expect.poll(() => capturedBodies.length).toBe(4);
  expect(capturedBodies[3].messages[0].content).not.toContain('HANDOFF_PROJECT_INSTRUCTION_SENTINEL');
  expect(capturedBodies[3].messages[0].content).not.toContain('HANDOFF_PROJECT_MEMORY_SENTINEL');
});

test('deleting a project removes only its chats and preserves other projects and chats', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  const disposableId = await createProjectFromUi(page, 'Disposable Project');
  const disposableGroup = page.locator('#projectNavigationList details[data-project-id="' + disposableId + '"]');
  if (!(await disposableGroup.evaluate(element => element.open))) await disposableGroup.locator(':scope > summary').click();
  await disposableGroup.locator('[data-action="new-chat-in-project"]').click();
  const disposableChatId = await page.evaluate(() => localStorage.getItem('ai_current_chat_v87'));
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#chatListBack').click();
  await page.locator('#chatListNewButton').click();
  const personalChatProjectId = await page.evaluate(() => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    const current = localStorage.getItem('ai_current_chat_v87');
    return chats.find(chat => chat.id === current)?.projectId || '';
  });
  expect(personalChatProjectId).toBe('');
  const keepId = await createProjectFromUi(page, 'Keep Project');
  expect(keepId).not.toBe(disposableId);
  const keepGroup = page.locator('#projectNavigationList details[data-project-id="' + keepId + '"]');
  if (!(await keepGroup.evaluate(element => element.open))) await keepGroup.locator(':scope > summary').click();
  await keepGroup.locator('[data-action="new-chat-in-project"]').click();
  const keepChatId = await page.evaluate(() => localStorage.getItem('ai_current_chat_v87'));
  await openProjectSettingsForId(page, disposableId);
  page.on('dialog', dialog => dialog.accept());
  await page.locator('#projectSettingsModal [data-action="delete-project"]').click();
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
  await page.locator('#thirdPartyProviderSettings > summary').click();
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
  await page.locator('#thirdPartyProviderSettings > summary').click();
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
    if (body.messages?.at(-1)?.content === 'Reply with exactly OK. No other words.') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ model: 'effort-search-model', choices: [{ message: { role: 'assistant', content: 'OK' } }] }) });
    }
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
    if (body.messages?.at(-1)?.content === 'Reply with exactly OK. No other words.') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ model: 'effort-search-model', choices: [{ message: { role: 'assistant', content: 'OK' } }] }) });
    }
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
    const body = route.request().postDataJSON();
    if (body.messages?.at(-1)?.content === 'Reply with exactly OK. No other words.') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ model: 'open-search-model', choices: [{ message: { role: 'assistant', content: 'OK' } }] }) });
    }
    modelCalls++;
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
  await page.locator('#thirdPartyProviderSettings > summary').click();
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
  await page.locator('#thirdPartyProviderSettings > summary').click();
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

test('aServi URL validation follows the selected language and is announced with its field', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ai_ui_language_v1', 'en'));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#aserviBaseUrl').fill('http://remote.example.test/v1');
  await page.locator('#aserviModel').fill('qwen3.5:4b');
  await page.locator('#aserviApiKey').fill('e2e-cloud-placeholder-key');
  await page.locator('[data-action="connect-aservi"]').click();
  await expect(page.locator('#aserviBaseUrlError')).toHaveText('Remote servers must use HTTPS.');
  await expect(page.locator('#aserviBaseUrl')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#aserviBaseUrl')).toHaveAttribute('aria-describedby', 'aserviBaseUrlError');

  await page.addInitScript(() => localStorage.setItem('ai_ui_language_v1', 'ru'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#aserviBaseUrl').fill('');
  await page.locator('#aserviModel').fill('');
  await page.locator('#aserviApiKey').fill('');
  await page.locator('[data-action="connect-aservi"]').click();
  await expect(page.locator('#aserviBaseUrlError')).toHaveText('Укажи URL сервера.');
  await expect(page.locator('#aserviModelError')).toHaveText('Укажи ID модели.');
  await expect(page.locator('#aserviApiKeyError')).toHaveText('Укажи ключ доступа.');
  await page.locator('#aserviBaseUrl').fill('http://remote.example.test/v1');
  await page.locator('#aserviModel').fill('qwen3.5:4b');
  await page.locator('#aserviApiKey').fill('e2e-cloud-placeholder-key');
  await page.locator('[data-action="connect-aservi"]').click();
  await expect(page.locator('#aserviBaseUrlError')).toHaveText('Для удалённого сервера нужен HTTPS.');
  await expect(page.locator('[data-action="connect-aservi"]')).toHaveText('Проверить и подключить');
});

test('aLandi aServi probe rejects HTTP 200 proxy text as proof of a model connection', async ({ page }) => {
  await page.route('https://aservi.example.test/v1/chat/completions', async route => route.fulfill({
    status: 200, contentType: 'text/plain; charset=utf-8',
    body: 'upstream unavailable: invalid route'
  }));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#aserviBaseUrl').fill('https://aservi.example.test/v1');
  await page.locator('#aserviModel').fill('qwen3.5:4b');
  await page.locator('#aserviApiKey').fill('e2e-cloud-placeholder-key');
  await expect(page.locator('#aserviStatusDot')).toHaveAttribute('data-state', 'disconnected', { timeout: 15000 });
  await expect(page.locator('#aserviApiKeyError')).toContainText('Не удалось подтвердить соединение');
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


test('aLandi aServi remains disconnected when the model answers but gateway health check fails', async ({ page }) => {
  await page.route('https://unhealthy-aservi.example.test/healthz', async route => route.fulfill({
    status: 503, contentType: 'application/json', body: JSON.stringify({ status: 'unavailable' })
  }));
  await page.route('https://unhealthy-aservi.example.test/v1/chat/completions', async route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ model: 'qwen3.5:4b', choices: [{ message: { role: 'assistant', content: 'OK' } }] })
  }));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#aserviBaseUrl').fill('https://unhealthy-aservi.example.test/v1');
  await page.locator('#aserviModel').fill('qwen3.5:4b');
  await page.locator('#aserviApiKey').fill('e2e-cloud-placeholder-key');
  await expect(page.locator('#aserviStatusDot')).toHaveAttribute('data-state', 'disconnected', { timeout: 15000 });
  await expect(page.locator('#aserviApiKeyError')).toContainText('Не удалось подтвердить соединение');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_alandi_cloud_connection_v1'))).toBe('');
});

test('stale aServi health response cannot reconnect settings changed while it is in flight', async ({ page }) => {
  const key = 'e2e-cloud-stale-health-key';
  await page.addInitScript(async accessKey => {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(accessKey));
    const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    localStorage.setItem('ai_alandi_cloud_base_url', 'https://race-aservi.example.test/v1');
    localStorage.setItem('ai_alandi_cloud_model', 'initial-model');
    localStorage.setItem('ai_api_key_alandi', accessKey);
    localStorage.setItem('ai_alandi_cloud_connection_v1', JSON.stringify({
      ok: true, baseUrl: 'https://race-aservi.example.test/v1', model: 'initial-model',
      keyFingerprint: fingerprint, testedAt: new Date().toISOString()
    }));
  }, key);

  let beginHealth, releaseHealth;
  const healthStarted = new Promise(resolve => { beginHealth = resolve; });
  const healthGate = new Promise(resolve => { releaseHealth = resolve; });
  await page.route('https://race-aservi.example.test/healthz', async route => {
    beginHealth();
    await healthGate;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await healthStarted;
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#aserviModel').fill('updated-model');
  releaseHealth();
  await expect(page.locator('#aserviStatusDot')).not.toHaveAttribute('data-state', 'connected');
  await expect(page.locator('#aserviModel')).not.toHaveAttribute('data-state', 'connected');
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
  await page.locator('#thirdPartyProviderSettings > summary').click();
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


test('aLandi aServi probe cannot overwrite settings changed while its request is in flight', async ({ page }) => {
  let beginProbe, releaseProbe;
  const probeStarted = new Promise(resolve => { beginProbe = resolve; });
  const probeGate = new Promise(resolve => { releaseProbe = resolve; });
  await page.route('https://race-aservi.example.test/v1/chat/completions', async route => {
    beginProbe();
    await probeGate;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'race-cloud-model', choices: [{ message: { role: 'assistant', content: 'OK' } }] })
    });
  });
  await page.route('https://race-aservi.example.test/healthz', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' })
  }));
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#aserviBaseUrl').fill('https://race-aservi.example.test/v1');
  await page.locator('#aserviModel').fill('race-cloud-model');
  await page.locator('#aserviApiKey').fill('first-cloud-race-key');
  await probeStarted;
  await page.locator('#aserviModel').fill('');
  releaseProbe();
  await expect(page.locator('#aserviStatusDot')).toHaveAttribute('data-state', 'disconnected');
  await expect(page.locator('#aserviModel')).toHaveValue('');
  await expect(page.locator('#aserviApiKey')).toHaveValue('first-cloud-race-key');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_alandi_cloud_connection_v1'))).toBe('');
});


test('settings keep aServi, third-party providers and additional options in exclusive groups', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').click();
  const cloud = page.locator('#aserviSettingsGroup');
  const providers = page.locator('#thirdPartyProviderSettings');
  const additional = page.locator('#additionalSettings');
  await expect(cloud).toHaveAttribute('open', '');
  await expect(providers).not.toHaveAttribute('open');
  await expect(additional).not.toHaveAttribute('open');
  await expect(page.locator('#providerPreset option[value="alandi"]')).toHaveCount(0);
  await expect(page.locator('#aserviSettingsCard')).not.toContainText('Kilo');
  await providers.locator(':scope > summary').click();
  await expect(providers).toHaveAttribute('open', '');
  await expect(cloud).not.toHaveAttribute('open');
  await additional.locator(':scope > summary').click();
  await expect(additional).toHaveAttribute('open', '');
  await expect(providers).toHaveAttribute('open', '');
  await cloud.locator(':scope > summary').click();
  await expect(cloud).toHaveAttribute('open', '');
  await expect(additional).not.toHaveAttribute('open');
});

test('retired server-memory bridge is absent and project facts remain local', async ({ page }) => {
  const graphRequests = [];
  const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Content-Type': 'application/json' };
  await page.route('https://gateway.example.test/v1/memory/graph/**', async route => {
    graphRequests.push({ method: route.request().method(), url: route.request().url() });
    return route.fulfill({ status: 404, headers: corsHeaders, body: JSON.stringify({ detail: 'No client route expected' }) });
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
  const localProjectId = await createProjectFromUi(page, 'Local-only project');
  await openProjectSettingsForId(page, localProjectId);
  await page.locator('#projectMemoryInput').fill('LOCAL_PROJECT_MEMORY_SENTINEL');
  await expect(page.locator('#projectMemoryInput')).toHaveValue('LOCAL_PROJECT_MEMORY_SENTINEL');
  await page.locator('[data-action="add-project-memory"]').click();
  await expect.poll(() => page.evaluate(projectId => {
    const project=JSON.parse(localStorage.getItem('ai_projects_v1')||'[]').find(item=>item.id===projectId);
    return Boolean(project?.memory?.some(item=>item.text==='LOCAL_PROJECT_MEMORY_SENTINEL'));
  }, localProjectId)).toBe(true);
  await expect(page.locator('#projectMemoryBox')).toContainText('LOCAL_PROJECT_MEMORY_SENTINEL');
  await expect(page.locator('#serverMemoryDetails')).toHaveCount(0);
  await expect(page.locator('#serverProjectMemoryToggle')).toHaveCount(0);
  await expect(page.locator('#projectMemoryToggle')).toHaveCount(0);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ai_projects_v1') || '[]'));
  expect(stored.some(project => project.name === 'Local-only project' && project.memory.some(item => item.text === 'LOCAL_PROJECT_MEMORY_SENTINEL'))).toBe(true);
  expect(graphRequests).toHaveLength(0);
});

test('private memory is local by default and enters context only after explicit opt-in', async ({ page }) => {
  const prompts = [];
  await page.route('https://gateway.example.test/v1/chat/completions', async route => {
    const payload=route.request().postDataJSON();
    const last=payload.messages?.at(-1)?.content;
    if(last==='Reply with exactly OK.'||last==='Reply with exactly OK. No other words.') return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({model:'qwen3.5:4b',choices:[{message:{role:'assistant',content:'OK'}}]})});
    prompts.push(payload);
    return route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'qwen3.5:4b', choices: [{ message: { role: 'assistant', content: 'Private memory check.' }, finish_reason: 'stop' }] }) });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  const memoryPanel = page.locator('#memoryPanel');
  if (!(await memoryPanel.evaluate(element => element.open))) await memoryPanel.locator(':scope > summary').click();
  const memoryTools = page.locator('#memoryToolsDetails');
  if (!(await memoryTools.evaluate(element => element.open))) await memoryTools.locator(':scope > summary').click();
  await page.locator('#memoryInput').fill('PRIVATE_MEMORY_SENTINEL');
  await page.locator('[data-action="save-memory"]').click();
  await expect(page.locator('#memoryBox')).toContainText('PRIVATE_MEMORY_SENTINEL');
  await expect(page.locator('#privateMemoryContextToggle')).not.toBeChecked();
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
  await page.locator('#userInput').fill('What private facts are available?');
  await page.locator('#sendBtn').click();
  await expect.poll(() => prompts.length).toBe(1);
  expect(prompts[0].messages[0].content).not.toContain('PRIVATE_MEMORY_SENTINEL');

  await page.locator('[data-action="toggle-sidebar"]').click();
  if (!(await memoryPanel.evaluate(element => element.open))) await memoryPanel.locator(':scope > summary').click();
  if (!(await memoryTools.evaluate(element => element.open))) await memoryTools.locator(':scope > summary').click();
  await page.locator('#privateMemoryContextToggle').check();
  await page.locator('#sidebar [data-action="close-sidebar"]').click();
  await page.locator('#userInput').fill('Use my explicitly enabled private notes.');
  await page.locator('#sendBtn').click();
  await expect.poll(() => prompts.length).toBe(2);
  expect(prompts[1].messages[0].content).toContain('PRIVATE_MEMORY_SENTINEL');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_private_memory_enabled_v1'))).toBe('true');
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) await page.locator('#thirdPartyProviderSettings > summary').click();
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
  await row.locator('.chat-row-menu > summary').click();
  await expect(row.locator('.chat-row-menu-panel button')).toHaveCount(8);

  await row.locator('[data-action="chat-rename"]').click();
  await expect(page.locator('#chatActionModal')).toBeVisible();
  await page.locator('#chatActionName').fill('Renamed from menu');
  await page.locator('[data-action="chat-action-save"]').click();
  await expect(row.locator('button[data-action="switch-chat"]')).toHaveText('Renamed from menu');

  await row.locator('.chat-row-menu > summary').click();
  await row.locator('[data-action="chat-clone"]').click();
  await expect(page.locator('#chatList .chat-row')).toHaveCount(2);
  await expect(page.locator('#chatList button[data-action="switch-chat"]').first()).toContainText('Renamed from menu — копия');
  await expect(page.locator('#userInput')).toHaveCSS('font-size', '16px');
});

test('chat menu export is scoped and chat import merges without replacing history', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_current_chat_v87')), { timeout: 10000 }).toBeTruthy();
  const originalChatId = await page.evaluate(() => localStorage.getItem('ai_current_chat_v87'));
  await page.locator('#userInput').fill('Keep this existing chat');
  await expect.poll(() => page.evaluate(id => JSON.parse(localStorage.getItem('ai_chat_drafts_v1') || '{}')[id], originalChatId)).toBe('Keep this existing chat');
  await page.locator('[data-action="toggle-sidebar"]').click();
  const row = page.locator('#chatList .chat-row').first();
  await row.locator('.chat-row-menu > summary').click();

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
  await expect(page.locator('#userInput')).toHaveValue('');
  await expect.poll(() => page.evaluate(id => JSON.parse(localStorage.getItem('ai_chat_drafts_v1') || '{}')[id], originalChatId)).toBe('Keep this existing chat');
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#chatList [data-action="switch-chat"][data-chat-id="' + originalChatId + '"]').click();
  await expect(page.locator('#userInput')).toHaveValue('Keep this existing chat');
});

test('last closed chat can be restored from local storage after reload', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#chatListNewButton').click();
  const deletedChatId = await page.evaluate(() => localStorage.getItem('ai_current_chat_v87'));
  expect(deletedChatId).not.toBe('');
  await page.locator('[data-action="toggle-sidebar"]').click();
  const row = page.locator('#chatList .chat-row').filter({ has: page.locator('[data-action="switch-chat"][data-chat-id="' + deletedChatId + '"]') });
  await row.locator('.chat-row-menu > summary').click();
  page.on('dialog', dialog => dialog.accept());
  await row.locator('[data-action="delete-chat"]').click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ai_chats_v87') || '[]').length)).toBe(1);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await expect(page.locator('#restoreLastClosedChat')).toBeVisible();
  await page.locator('#restoreLastClosedChat').click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_current_chat_v87'))).toBe(deletedChatId);
  await expect.poll(() => page.evaluate(id => JSON.parse(localStorage.getItem('ai_chats_v87') || '[]').some(chat => chat.id === id), deletedChatId)).toBe(true);
  await expect(page.locator('#restoreLastClosedChat')).toBeHidden();
});

test('sidebar separates projects from personal chats and keeps navigation collapsible', async ({ page }) => {
  await page.addInitScript(() => {
    const project = (id, name) => ({ id, name, description: '', instructions: '', memoryScope: 'project-only', memory: [], createdAt: '', updatedAt: '' });
    const chat = (id, title, projectId) => ({ id, title, projectId, messages: [] });
    localStorage.setItem('ai_projects_v1', JSON.stringify([project('project-alpha','Alpha project'), project('project-beta','Beta project')]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([chat('chat-personal','Personal chat',null),chat('chat-alpha','Alpha project chat','project-alpha'),chat('chat-beta','Beta project chat','project-beta')]));
    localStorage.setItem('ai_current_chat_v87','chat-alpha');
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#chatListBack').click();
  await expect(page.locator('#projectNavToggle')).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('#projectNavigationList')).toBeHidden();
  await expect(page.locator('#chatSection')).toHaveAttribute('open','');
  await expect(page.locator('#chatList [data-action="switch-chat"]')).toHaveCount(1);
  await expect(page.locator('#chatList [data-action="switch-chat"]')).toContainText('Personal chat');
  await expect(page.locator('#chatList')).not.toContainText('Alpha project chat');
  const memoryPanel = page.locator('#memoryPanel');
  await expect(memoryPanel).toBeVisible();
  await expect(memoryPanel).not.toHaveAttribute('open', '');
  await memoryPanel.locator(':scope > summary').click();
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
    const chat=(id,title,projectId)=>({id,title,projectId,messages:[]});
    localStorage.setItem('ai_projects_v1',JSON.stringify([project('project-alpha','Alpha project','ALPHA_ONLY_INSTRUCTION'),project('project-beta','Beta project','BETA_ONE_SHOT_INSTRUCTION')]));
    localStorage.setItem('ai_chats_v87',JSON.stringify([chat('chat-alpha','Alpha chat','project-alpha'),chat('chat-beta','Beta chat','project-beta')]));
    localStorage.setItem('ai_current_chat_v87','chat-alpha');
  });
  await page.goto(APP_PATH,{waitUntil:'domcontentloaded'});
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#thirdPartyProviderSettings > summary').click();
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
  await page.locator('#thirdPartyProviderSettings > summary').click();
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
      id, title, projectId, messages: []
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
  await page.locator('#projectNavigationList .project-nav-row[data-project-id="project-beta"] [data-action="open-project-settings"]').click();
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
  await page.locator('#projectNavigationList .project-nav-row[data-project-id="project-beta"] [data-action="open-project-settings"]').click();
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
      id, title, projectId,
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
  await alphaRow.locator('.chat-row-menu > summary').click();

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
      id, title, projectId,
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
  await betaRow.locator('.chat-row-menu > summary').click();

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

test('shared control sizing uses standard desktop and touch-sized mobile variants', async ({ page }) => {
  const measureHeights = async selector => page.locator(selector).evaluateAll(nodes =>
    nodes.filter(node => node.getClientRects().length).map(node => node.getBoundingClientRect().height)
  );
  const assertMinimum = async (selector, minimum, description) => {
    const heights = await measureHeights(selector);
    expect(heights.length, selector + ' should expose visible controls').toBeGreaterThan(0);
    expect(heights.every(height => height >= minimum), description).toBe(true);
  };
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await assertMinimum('#chatListNewButton', 40, 'new-chat action should use the standard desktop size');
  await page.locator('#sidebar [data-action="close-sidebar"]').click();
  await assertMinimum('#inputArea .composer-tool', 40, 'composer tools should use the standard desktop size');

  await page.locator('#searchModeSummary').click();
  await assertMinimum('#searchModeMenu .toolbar-menu-option', 40, 'search options should use the standard desktop size');
  await page.locator('#searchModeSummary').click();
  await page.locator('#languageSummary').click();
  await assertMinimum('#languageMenu .language-menu-panel button', 40, 'language options should use the standard desktop size');
  await page.locator('#languageSummary').click();

  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#settingsModal')).toBeVisible();
  await assertMinimum('#settingsModal .settings-header-actions button', 40, 'settings actions should use the standard desktop size');

  await page.setViewportSize({ width: 390, height: 844 });
  await assertMinimum('#settingsModal .settings-header-actions button', 44, 'settings actions should retain 44px mobile targets');
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await page.locator('[data-action="toggle-sidebar"]').click();
  await assertMinimum('#chatListNewButton', 44, 'new-chat action should retain a 44px mobile target');
  await page.locator('#sidebar [data-action="close-sidebar"]').click();
  await assertMinimum('#inputArea .composer-tool', 44, 'composer tools should retain 44px mobile targets');

  await page.locator('#searchModeSummary').click();
  await assertMinimum('#searchModeMenu .toolbar-menu-option', 44, 'search options should retain 44px mobile targets');
  await page.locator('#searchModeSummary').click();
  await page.locator('#languageSummary').click();
  await assertMinimum('#languageMenu .language-menu-panel button', 44, 'language options should retain 44px mobile targets');
  await page.locator('#languageSummary').click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('icon-first controls keep an accessible name across header, sidebar and messages', async ({ page }) => {
  await page.addInitScript(() => {
    const project = { id: 'icon-project', name: 'Icon project', description: '', instructions: '', memoryScope: 'project-only', memory: [], createdAt: '', updatedAt: '' };
    const chat = {
      id: 'icon-chat', title: 'Icon chat', projectId: 'icon-project',
      messages: [
        { role: 'user', content: 'Icon accessibility fixture' },
        { role: 'assistant', content: 'Icon controls must remain named.' }
      ]
    };
    localStorage.setItem('ai_projects_v1', JSON.stringify([project]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([chat]));
    localStorage.setItem('ai_current_chat_v87', 'icon-chat');
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await ensureSidebarOpen(page);
  const projectNavigation = page.locator('#projectNavigationList');
  if (!(await projectNavigation.isVisible())) await page.locator('#projectNavToggle').click();
  await expect(projectNavigation).toBeVisible();
  const projectGroup = page.locator('#projectNavigationList details[data-project-id="icon-project"]');
  await expect(projectGroup).toBeVisible();
  if (!(await projectGroup.evaluate(element => element.open))) await projectGroup.locator(':scope > summary').click();

  const unnamedIconButtons = await page.locator('button:visible').evaluateAll(nodes => nodes
    .filter(node => {
      const text = (node.textContent || '').trim();
      const symbolOnly = !text || /^[\p{Extended_Pictographic}\p{S}\p{P}\s]+$/u.test(text);
      return symbolOnly && !node.getAttribute('aria-label') && !node.getAttribute('aria-labelledby') && !node.title;
    })
    .map(node => ({ action: node.dataset.action || '', text: (node.textContent || '').trim() })));
  expect(unnamedIconButtons).toEqual([]);
  await expect(page.locator('#chatBox .message-actions button')).toHaveCount(5);
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
  if (!(await page.locator('#thirdPartyProviderSettings').evaluate(el => el.open))) {
    await page.locator('#thirdPartyProviderSettings > summary').click();
  }
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('message-viewer-model');
  await page.locator('#apiKey').fill('e2e-message-viewer-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();

  const longAnswer = Array.from({ length: 70 }, (_, index) => 'MESSAGE_VIEWER_LINE_' + index).join('\\n');
  await page.route('https://api.example.test/v1/chat/completions', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ model: 'message-viewer-model', choices: [{ message: { role: 'assistant', content: longAnswer } }] })
  }));
  await page.locator('#userInput').fill('Show a full message.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('MESSAGE_VIEWER_LINE_69', { timeout: 15000 });
  await expect(page.locator('#chatBox [data-action="copy-message"]')).toHaveCount(2);
  await expect(page.locator('#chatBox [data-action="view-message"]')).toHaveCount(2);
  const inlineActionMeta = await page.locator('#chatBox .message-actions button').evaluateAll(nodes => nodes.map(node => {
    const rect = node.getBoundingClientRect();
    return { title: node.title, label: node.getAttribute('aria-label'), width: rect.width, height: rect.height };
  }));
  expect(inlineActionMeta.length).toBe(5);
  expect(inlineActionMeta.every(item => item.title && item.title === item.label && item.width >= 44 && item.height >= 44)).toBe(true);

  const viewAction = page.locator('#chatBox [data-action="view-message"]').last();
  const viewTarget = await viewAction.boundingBox();
  expect(viewTarget?.width || 0).toBeGreaterThanOrEqual(44);
  expect(viewTarget?.height || 0).toBeGreaterThanOrEqual(44);
  await expect(viewAction).toHaveAttribute('aria-label', /Открыть сообщение целиком|Open full message/);
  await viewAction.click();
  await expect(page.locator('#messageViewerModal')).toBeVisible();
  await expect(page.locator('#messageViewerContent')).toContainText('MESSAGE_VIEWER_LINE_69');
  await expect(page.locator('#messageViewerCopy')).toBeVisible();
  await expect(page.locator('#messageViewerSpeak')).toBeVisible();
  await expect(page.locator('#messageViewerCopy')).toHaveAttribute('aria-label',/Copy message|Скопировать сообщение/);
  await expect(page.locator('#messageViewerSpeak')).toHaveAttribute('aria-label',/Generate speech|Создать речь/);
  const viewerActionLabels = await page.locator('#messageViewerModal .message-actions button').evaluateAll(nodes => nodes.map(node => ({ title: node.title, label: node.getAttribute('aria-label') })));
  expect(viewerActionLabels.every(item => item.title && item.title === item.label)).toBe(true);
  const viewerActionBoxes=await page.locator('#messageViewerModal .message-actions button').evaluateAll(nodes=>nodes.map(node=>{const rect=node.getBoundingClientRect();return {width:rect.width,height:rect.height};}));
  expect(viewerActionBoxes.length).toBe(2);
  expect(viewerActionBoxes.every(box=>box.width>=44&&box.height>=44)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('#messageViewerModal')).toBeHidden();
  await expect(viewAction).toBeFocused();

  await page.locator('#chatBox [data-action="view-message"]').first().click();
  await expect(page.locator('#messageViewerContent')).toContainText('Show a full message.');
  await expect(page.locator('#messageViewerCopy')).toBeVisible();
  await expect(page.locator('#messageViewerSpeak')).toBeHidden();
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

  const chatBox = page.locator('#chatBox');
  await chatBox.evaluate(element => {
    element.replaceChildren(...Array.from({ length: 36 }, (_, index) => {
      const row = document.createElement('div');
      row.textContent = 'Scroll preservation fixture ' + index + ' · ' + 'content '.repeat(18);
      row.style.minHeight = '48px';
      return row;
    }));
    element.scrollTop = 0;
    element.dispatchEvent(new Event('scroll'));
  });
  await page.setViewportSize({ width: 390, height: 440 });
  await expect.poll(() => chatBox.evaluate(element => element.scrollTop)).toBeLessThan(5);
  await chatBox.evaluate(element => {
    element.scrollTop = element.scrollHeight;
    element.dispatchEvent(new Event('scroll'));
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => chatBox.evaluate(element => element.scrollHeight - element.scrollTop - element.clientHeight)).toBeLessThan(8);
});

test('search presets and function settings fit one line, localize, and persist per chat', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });

  const searchRect = await page.locator('#searchModeMenu').boundingBox();
  const functionsRect = await page.locator('#functionsMenu').boundingBox();
  expect(searchRect).not.toBeNull();
  expect(functionsRect).not.toBeNull();
  expect(Math.abs(searchRect.y - functionsRect.y)).toBeLessThan(5);
  expect(searchRect.x + searchRect.width).toBeLessThanOrEqual(functionsRect.x + 3);
  for (const selector of ['#modeFast', '#modeDeep', '#searchModeSummary', '#functionsMenuSummary']) {
    const box = await page.locator(selector).boundingBox();
    expect(box?.height || 0, selector + ' should have a 44px mobile hit target').toBeGreaterThanOrEqual(44);
  }
  const headerTargetHeights = await page.locator('.app-header .header-icon').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height));
  expect(headerTargetHeights.length).toBeGreaterThan(0);
  expect(headerTargetHeights.every(height => height >= 44)).toBe(true);
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
  await expect(page.locator('#modeFast')).toHaveAttribute('aria-pressed', 'true');
  await chooseSearchMode(page, 'normal');

  await page.locator('#functionsMenuSummary').click();
  await expect(page.locator('#functionsMenu [data-function="research"]')).toHaveCount(0);
  await expect(page.locator('#functionsMenu .toolbar-menu-option')).toHaveCount(3);
  await page.locator('#functionsMenuSummary').click();

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

  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="connectors"]').click();
  await expect(page.locator('#functionPanelModal')).toBeVisible();
  await expect(page.locator('#functionPanelDescription')).toContainText('интеграции');
  await expect(page.locator('#functionPanelDescription')).toContainText('не подключены');
  await page.locator('#functionPanelModal [data-action="close-function-panel"]').first().click();

  const sidebar = page.locator('#sidebar');
  if (await sidebar.evaluate(element => element.classList.contains('-translate-x-full'))) {
    await page.locator('[data-action="toggle-sidebar"]').click();
  }
  await page.locator('#sidebar [data-action="new-chat"]').click();
  await expect(page.locator('#modeFast')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#toggleSearch')).toBeChecked();
  await expect(page.locator('#toggleMultiAgent')).not.toBeChecked();
  await expect(page.locator('#searchModeSummary')).toContainText(/обычный/i);
  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="skills"]').click();
  await expect(page.locator('#skillPresetSelect')).toHaveValue('auto');
  await expect(page.locator('#functionPanelTitle')).toContainText('Профиль задачи');
  await page.locator('#functionPanelModal [data-action="close-function-panel"]').first().click();

  await selectLanguage(page, 'en');
  await expect(page.locator('#modeDeep')).toContainText('Thorough');
  await expect(page.locator('#modeToolbar [role="group"]')).toHaveAttribute('aria-label', 'Effort');
  await expect(page.locator('#functionsMenuSummary')).toContainText('Functions');
  await expect(page.locator('#searchModeSummary')).toContainText('Web');
  await expect(page.locator('#modeHint')).toContainText('Quick · Web: standard · Direct · Auto');
  // Language selection is a standalone header control; the settings dialog is not open here.

  // The first tap outside an open toolbar menu must only close it.
  await page.locator('#functionsMenuSummary').click();
  await page.locator('#modeFast').click();
  await expect(page.locator('#functionsMenu')).not.toHaveAttribute('open', '');
  await expect(page.locator('#modeFast')).toHaveAttribute('aria-pressed', 'true');
});


test('planned agent and connector directions show a clearly non-runtime innovation cue', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#functionPanelModal')).toBeHidden();

  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="agents"]').click();
  const agentPanel = page.locator('#agentFunctionSettings');
  await expect(agentPanel).toBeVisible();
  await openDisclosure(page, '#agentFunctionSettings .agent-future-groups > details:first-child');
  const agentTicker = agentPanel.locator('.roadmap-ticker-track').first();
  await expect(agentTicker).toBeVisible();
  await expect(agentTicker).toContainText('1ИÆИT10И');
  await expect(agentTicker).toHaveAttribute('aria-hidden', 'true');
  await expect(agentPanel.locator('.roadmap-note')).toContainText('не фоновые процессы');
  await page.locator('#functionPanelModal [data-action="close-function-panel"]').first().click();
  await expect(agentTicker).toBeHidden();

  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="connectors"]').click();
  const connectorPanel = page.locator('#connectorFunctionStatus');
  await expect(connectorPanel).toBeVisible();
  const connectorTicker = connectorPanel.locator('.roadmap-ticker-track');
  await expect(connectorTicker).toBeVisible();
  await expect(connectorTicker).toContainText('1ИÆИT10И');
  await expect(connectorPanel.locator('.roadmap-note')).toContainText('не означает, что сервис уже выполняет работу');
  await page.locator('#functionPanelModal [data-action="close-function-panel"]').first().click();
  await expect(connectorTicker).toBeHidden();
});

test('application innovation ticker is static when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="agents"]').click();
  await openDisclosure(page, '#agentFunctionSettings .agent-future-groups > details:first-child');
  const ticker = page.locator('#agentFunctionSettings .roadmap-ticker-track').first();
  await expect(ticker).toBeVisible();
  expect(await ticker.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await expect(page.locator('#agentFunctionSettings .roadmap-note')).toBeVisible();
  await page.locator('#agentRoadmapPause').check();
  await expect(page.locator('#agentRoadmapPause')).toBeChecked();
  expect(await ticker.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});


test('browser Back returns through nested project filters instead of leaving the app', async ({ page }) => {
  await page.addInitScript(() => {
    const project=(id,name)=>({id,name,description:'',instructions:'',memoryScope:'project-only',memory:[],createdAt:'',updatedAt:''});
    localStorage.setItem('ai_projects_v1',JSON.stringify([project('nav-alpha','Navigation Alpha'),project('nav-beta','Navigation Beta')]));
  });
  await page.goto(APP_PATH,{waitUntil:'domcontentloaded'});
  await ensureSidebarOpen(page);
  if(await page.locator('#projectNavigationList').evaluate(el=>el.classList.contains('hidden')))await page.locator('#projectNavToggle').click();
  const alpha=page.locator('#projectNavigationList .project-nav-row[data-project-id="nav-alpha"]');
  const beta=page.locator('#projectNavigationList .project-nav-row[data-project-id="nav-beta"]');
  if(!(await alpha.locator('details.project-nav-item').evaluate(el=>el.open)))await alpha.locator('details.project-nav-item > summary').click();
  await alpha.locator('[data-action="select-project"]').click();
  await expect(page.locator('#chatSectionTitle')).toContainText('Navigation Alpha');
  if(!(await beta.locator('details.project-nav-item').evaluate(el=>el.open)))await beta.locator('details.project-nav-item > summary').click();
  await beta.locator('[data-action="select-project"]').click();
  await expect(page.locator('#chatSectionTitle')).toContainText('Navigation Beta');
  await page.goBack();
  await expect(page.locator('#chatSectionTitle')).toContainText('Navigation Alpha');
  await page.goForward();
  await expect(page.locator('#chatSectionTitle')).toContainText('Navigation Beta');
  await page.goBack();
  await expect(page.locator('#chatSectionTitle')).toContainText('Navigation Alpha');
  await page.goBack();
  await expect(page.locator('#chatSectionTitle')).toContainText('Без проекта');
  await expect(page.locator('#userInput')).toBeVisible();
});

test('browser Back closes a project settings modal without leaving the app', async ({ page }) => {
  await page.addInitScript(()=>localStorage.setItem('ai_projects_v1',JSON.stringify([{id:'back-project',name:'Back project',description:'',instructions:'',memoryScope:'project-only',memory:[],createdAt:'',updatedAt:''}])));
  await page.goto(APP_PATH,{waitUntil:'domcontentloaded'});
  await ensureSidebarOpen(page);
  if(await page.locator('#projectNavigationList').evaluate(el=>el.classList.contains('hidden')))await page.locator('#projectNavToggle').click();
  const row=page.locator('#projectNavigationList .project-nav-row[data-project-id="back-project"]');
  if(!(await row.locator('details.project-nav-item').evaluate(el=>el.open)))await row.locator('details.project-nav-item > summary').click();
  await row.locator('[data-action="open-project-settings"]').click();
  await expect(page.locator('#projectSettingsModal')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/ui-modal-open/);
  await page.goBack();
  await expect(page.locator('#projectSettingsModal')).toBeHidden();
  await expect(page.locator('#userInput')).toBeVisible();
  await expect(page.locator('body')).not.toHaveClass(/ui-modal-open/);
  await page.goForward();
  await expect(page.locator('#projectSettingsModal')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/ui-modal-open/);
  await page.goBack();
  await expect(page.locator('#projectSettingsModal')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/ui-modal-open/);
});

test('modal backdrop and focus lifecycle remain clean over repeated open and close cycles', async ({ page }) => {
  await page.goto(APP_PATH,{waitUntil:'domcontentloaded'});
  for(let i=0;i<3;i++){
    await page.locator('[data-action="toggle-settings"]').click();
    await expect(page.locator('#settingsModal')).toBeVisible();
    await expect(page.locator('body')).toHaveClass(/ui-modal-open/);
    await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
    await expect(page.locator('#settingsModal')).toBeHidden();
    await expect(page.locator('body')).not.toHaveClass(/ui-modal-open/);
  }
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await expect(page.locator('#projectCreateModal')).toBeVisible();
  await page.locator('#projectCreateModal [data-action="close-project-create"]').first().click();
  await expect(page.locator('#projectCreateModal')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/ui-modal-open/);
});

test('request status and notifications expose semantic state and centered alignment', async ({ page }) => {
  let release;
  await page.route('https://api.example.test/v1/chat/completions',async route=>{
    const payload = route.request().postDataJSON();
    const lastMessage = payload.messages?.at(-1)?.content;
    if (lastMessage === 'Reply with exactly OK. No other words.') {
      await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({model:'status-e2e',choices:[{message:{role:'assistant',content:'OK'}}]})});
      return;
    }
    await new Promise(resolve=>{release=resolve;});
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({model:'status-e2e',choices:[{message:{role:'assistant',content:'Status complete.'}}]})});
  });
  await page.goto(APP_PATH,{waitUntil:'domcontentloaded'});
  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#thirdPartyProviderSettings > summary').click();
  await page.locator('#providerPreset').selectOption('custom');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('status-e2e');
  await page.locator('#apiKey').fill('e2e-status-key');
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('#settingsModal .settings-header-actions [data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Show a semantic request status.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#searchStatus')).toBeVisible();
  await expect(page.locator('#searchStatus')).toHaveAttribute('data-state','info');
  await expect.poll(()=>typeof release).toBe('function');
  const statusStyle=await page.locator('#searchStatus').evaluate(element=>({align:getComputedStyle(element).textAlign,color:getComputedStyle(element.querySelector('#statusText')).color}));
  expect(statusStyle.align).toBe('center');
  expect(statusStyle.color).not.toBe('');
  release();
  await expect(page.locator('#chatBox')).toContainText('Status complete.');
  await ensureSidebarOpen(page);
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await page.locator('#projectCreateNameInput').fill('Semantic status project');
  await page.locator('[data-action="create-project"]').click();
  await expect(page.locator('#toast')).toHaveAttribute('data-state','success');
  await expect(page.locator('#toast')).toHaveAttribute('role','status');
  await expect(page.locator('#toast')).toHaveAttribute('aria-live','polite');
  await page.mouse.move(0, 0);
  await expect(page.locator('#toast')).toBeHidden({ timeout: 10000 });
  await ensureSidebarOpen(page);
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await page.locator('[data-action="create-project"]').click();
  await page.mouse.move(0, 0);
  await expect(page.locator('#toast')).toHaveAttribute('data-state','error', { timeout: 10000 });
  await expect(page.locator('#toast')).toHaveAttribute('role','alert');
  await expect(page.locator('#toast')).toHaveAttribute('aria-live','assertive');
  await expect(page.locator('#toast')).toHaveAttribute('data-persistent','true');
  const dismiss = page.getByRole('button', { name: 'Закрыть уведомление' });
  await expect(dismiss).toBeVisible();
  await dismiss.click();
  await expect(page.locator('#toast')).toBeHidden();
});


test('all semantic status states are distinct, centered and reduced-motion safe', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const states = await page.evaluate(() => {
    const status = document.querySelector('#searchStatus');
    const statusText = status.querySelector('#statusText');
    const toast = document.querySelector('#toast');
    const statusColors = ['neutral','info','success','warning','error'].map(state => {
      status.dataset.state = state;
      return getComputedStyle(statusText).color;
    });
    const toastColors = ['info','success','warning','error'].map(state => {
      toast.dataset.state = state;
      return { color: getComputedStyle(toast).color, border: getComputedStyle(toast).borderTopColor };
    });
    return {
      statusColors,
      toastColors,
      statusAlign: getComputedStyle(status).textAlign,
      tickerAlign: getComputedStyle(document.querySelector('.roadmap-ticker')).textAlign,
      tickerTrackAlign: getComputedStyle(document.querySelector('.roadmap-ticker-track')).textAlign
    };
  });
  expect(new Set(states.statusColors).size).toBe(5);
  expect(states.toastColors.every(item => item.color && item.border)).toBe(true);
  expect(states.statusAlign).toBe('center');
  expect(states.tickerAlign).toBe('center');
  expect(states.tickerTrackAlign).toBe('center');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  const tickerAnimation = await page.locator('.roadmap-ticker-track').first().evaluate(element => getComputedStyle(element).animationName);
  expect(tickerAnimation).toBe('none');
});

test('browser Forward restores a chat-action dialog with its original target', async ({ page }) => {
  await page.addInitScript(()=>{
    const project={id:'action-project',name:'Action project',description:'',instructions:'',memoryScope:'project-only',memory:[],createdAt:'',updatedAt:''};
    const chat={id:'action-chat',title:'Action chat',projectId:'action-project',messages:[]};
    localStorage.setItem('ai_projects_v1',JSON.stringify([project]));
    localStorage.setItem('ai_chats_v87',JSON.stringify([chat]));
    localStorage.setItem('ai_current_chat_v87','action-chat');
  });
  await page.goto(APP_PATH,{waitUntil:'domcontentloaded'});
  await ensureSidebarOpen(page);
  if(await page.locator('#projectNavigationList').evaluate(el=>el.classList.contains('hidden')))await page.locator('#projectNavToggle').click();
  const group=page.locator('#projectNavigationList details[data-project-id="action-project"]');
  if(!(await group.evaluate(el=>el.open)))await group.locator(':scope > summary').click();
  const row=group.locator('.chat-row').filter({hasText:'Action chat'});
  await row.locator('.chat-row-menu > summary').click();
  await row.locator('[data-action="chat-project"]').click();
  await expect(page.locator('#chatActionModal')).toBeVisible();
  await expect(page.locator('#chatActionModal')).toHaveAttribute('data-chat-id','action-chat');
  await page.goBack();
  await expect(page.locator('#chatActionModal')).toBeHidden();
  await page.goForward();
  await expect(page.locator('#chatActionModal')).toBeVisible();
  await expect(page.locator('#chatActionModal')).toHaveAttribute('data-chat-id','action-chat');
  await expect(page.locator('#chatActionModal')).toHaveAttribute('data-mode','project');
  await page.goBack();
  await expect(page.locator('#chatActionModal')).toBeHidden();
});

test('modal backdrop dismissal leaves no click-blocking layer across core dialogs', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const assertBackdropCleared = async modal => {
    await expect(page.locator(modal)).toBeHidden();
    await expect(page.locator('body')).not.toHaveClass(/ui-modal-open/);
    await expect.poll(() => page.locator('[role="dialog"]:visible').count()).toBe(0);
    const sidebar = page.locator('#sidebar');
    if (!(await sidebar.evaluate(element => element.classList.contains('-translate-x-full')))) {
      await page.locator('#sidebar [data-action="close-sidebar"]').click();
    }
    await page.locator('[data-action="toggle-sidebar"]').click();
    await expect(sidebar).not.toHaveClass(/-translate-x-full/);
    await page.locator('#sidebar [data-action="close-sidebar"]').click();
    await expect(sidebar).toHaveClass(/-translate-x-full/);
  };

  await page.locator('[data-action="toggle-settings"]').click();
  await page.locator('#settingsModal').click({ position: { x: 4, y: 4 } });
  await assertBackdropCleared('#settingsModal');

  await ensureSidebarOpen(page);
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await page.locator('#projectCreateModal').click({ position: { x: 4, y: 4 } });
  await assertBackdropCleared('#projectCreateModal');

  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="agents"]').click();
  await page.locator('#functionPanelModal').click({ position: { x: 4, y: 4 } });
  await assertBackdropCleared('#functionPanelModal');

  await page.locator('#deepResearchStudioButton').click();
  await page.locator('#researchStudioModal').click({ position: { x: 4, y: 4 } });
  await assertBackdropCleared('#researchStudioModal');
});

test('modal lifecycle keeps keyboard focus and page scroll isolated across core dialogs', async ({ page }) => {
  const assertModalLifecycle = async (modalId) => {
    const modal = page.locator('#' + modalId);
    await expect(modal).toBeVisible();
    await expect(page.locator('body')).toHaveClass(/ui-modal-open/);

    await page.keyboard.press('Tab');
    await expect.poll(() => modal.evaluate(element => element.contains(document.activeElement)))
      .toBe(true);

    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
    await expect(page.locator('body')).not.toHaveClass(/ui-modal-open/);
  };

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await ensureSidebarOpen(page);
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await assertModalLifecycle('projectCreateModal');
  await page.locator('#sidebar [data-action="close-sidebar"]').click();

  await page.locator('[data-action="toggle-settings"]').click();
  await assertModalLifecycle('settingsModal');

  await page.locator('#functionsMenuSummary').click();
  await page.locator('[data-action="open-function-panel"][data-function="agents"]').click();
  await assertModalLifecycle('functionPanelModal');

  await page.locator('#deepResearchStudioButton').click();
  await assertModalLifecycle('researchStudioModal');
});

test('responsive visual review captures viewport and navigation evidence', async ({ page }, testInfo) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#chatBox')).toBeVisible();
  await expect(page.locator('#userInput')).toBeVisible();

  const status = page.locator('#searchStatus');
  const stop = page.locator('#stopBtn');
  await expect(status).toBeHidden();
  await expect(stop).toBeHidden();
  await status.evaluate(element => element.classList.remove('hidden'));
  await expect(status).toBeVisible();
  await status.evaluate(element => element.classList.add('hidden'));
  await stop.evaluate(element => element.classList.remove('hidden'));
  await expect(stop).toBeVisible();
  await stop.evaluate(element => element.classList.add('hidden'));

  // These screenshots are review evidence, not pixel-perfect visual-regression baselines.
  // Keep viewport changes and browser state identical so reviewers can compare releases.
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth
    }));
    expect(dimensions.document, `horizontal overflow in visual review at ${width}px`)
      .toBeLessThanOrEqual(dimensions.viewport);

    if (width <= 420) {
      const composer = await page.locator('#inputArea').evaluate(element => ({
        display: getComputedStyle(element).display,
        inputWidth: Math.round(element.querySelector('#userInput').getBoundingClientRect().width)
      }));
      expect(composer.display, `mobile composer layout at ${width}px`).toBe('grid');
      expect(composer.inputWidth, `mobile message field width at ${width}px`).toBeGreaterThanOrEqual(180);

      const header = await page.locator('.app-header').evaluate(element => ({
        titleWidth: Math.round(element.querySelector('#activeChatTitle').getBoundingClientRect().width),
        clockWidth: Math.round(element.querySelector('.clock-face').getBoundingClientRect().width),
        wordmarkVisibility: getComputedStyle(element.querySelector('#brandWordmark')).visibility
      }));
      expect(header.titleWidth, `chat title width at ${width}px`).toBeGreaterThanOrEqual(70);
      expect(header.clockWidth, `brand clock width at ${width}px`).toBeGreaterThanOrEqual(54);
      expect(header.wordmarkVisibility, `compact wordmark at ${width}px`).toBe('hidden');
    }

    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await attachVisualReviewScreenshot(page, testInfo, `landing-v2-app-${width}px`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await ensureSidebarOpen(page);
  await attachVisualReviewScreenshot(page, testInfo, 'landing-v2-mobile-sidebar-open');

  await page.setViewportSize({ width: 1440, height: 900 });
  await ensureSidebarOpen(page);
  await attachVisualReviewScreenshot(page, testInfo, 'landing-v2-desktop-sidebar-open');
});


test('composer text drafts stay isolated per chat and restore after reload', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await ensureSidebarOpen(page);

  const firstChatId = await page.evaluate(() => localStorage.getItem('ai_current_chat_v87'));
  await page.locator('#userInput').fill('Draft belonging to the first chat');
  await expect.poll(() => page.evaluate(id => JSON.parse(localStorage.getItem('ai_chat_drafts_v1') || '{}')[id], firstChatId))
    .toBe('Draft belonging to the first chat');

  await page.locator('#sidebar [data-action="new-chat"]').click();
  const secondChatId = await page.evaluate(() => localStorage.getItem('ai_current_chat_v87'));
  expect(secondChatId).not.toBe(firstChatId);
  await expect(page.locator('#userInput')).toHaveValue('');

  await page.locator('#userInput').fill('Draft belonging to the second chat');
  await expect.poll(() => page.evaluate(id => JSON.parse(localStorage.getItem('ai_chat_drafts_v1') || '{}')[id], secondChatId))
    .toBe('Draft belonging to the second chat');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#userInput')).toHaveValue('Draft belonging to the second chat');
  await ensureSidebarOpen(page);
  await page.locator('#chatList [data-action="switch-chat"][data-chat-id="' + firstChatId + '"]').click();
  await expect(page.locator('#userInput')).toHaveValue('Draft belonging to the first chat');

  const state = await page.evaluate(() => ({
    current: localStorage.getItem('ai_current_chat_v87'),
    chats: JSON.parse(localStorage.getItem('ai_chats_v87') || '[]'),
    drafts: JSON.parse(localStorage.getItem('ai_chat_drafts_v1') || '{}')
  }));
  expect(state.current).toBe(firstChatId);
  expect(state.chats.every(chat => !chat.messages.some(message => message.role === 'user'))).toBe(true);
  expect(state.drafts[firstChatId]).toBe('Draft belonging to the first chat');
  expect(state.drafts[secondChatId]).toBe('Draft belonging to the second chat');
});


test('Escape dismisses the topmost transient menu before the sidebar and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });

  await page.locator('#attachTextButton').click();
  await expect(page.locator('#attachmentMenu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#attachmentMenu')).toBeHidden();
  await expect(page.locator('#composerPopoverScrim')).toBeHidden();
  await expect(page.locator('#attachTextButton')).toBeFocused();

  await ensureSidebarOpen(page);
  const menu = page.locator('#sidebar .chat-row-menu').first();
  const summary = menu.locator(':scope > summary');
  await summary.click();
  await expect(menu).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(summary).toBeFocused();
  await expect(page.locator('#sidebar')).not.toHaveClass(/-translate-x-full/);

  await page.keyboard.press('Escape');
  await expect(page.locator('#sidebar')).toHaveClass(/-translate-x-full/);
  await expect(page.locator('[data-action="toggle-sidebar"]')).toBeFocused();
});


test('browser connectivity status is distinct from offline search and never retries a draft', async ({ page }) => {
  await page.addInitScript(() => {
    window.__testNetworkOnline = true;
    Object.defineProperty(Navigator.prototype, 'onLine', {
      configurable: true,
      get: () => window.__testNetworkOnline
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });

  const status = page.locator('#networkStatus');
  const composer = page.locator('#userInput');
  await chooseSearchMode(page, 'offline');
  await expect(page.locator('#offlineToggle')).toHaveText('Веб-поиск выключен');
  await expect(status).toBeHidden();
  await composer.fill('Keep this offline draft');
  await expect.poll(() => page.evaluate(() => {
    const drafts = JSON.parse(localStorage.getItem('ai_chat_drafts_v1') || '{}');
    const currentId = localStorage.getItem('ai_current_chat_v87');
    return drafts[currentId] || '';
  })).toBe('Keep this offline draft');

  const messageCount = await page.evaluate(() => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    const currentId = localStorage.getItem('ai_current_chat_v87');
    return chats.find(chat => chat.id === currentId)?.messages.length ?? -1;
  });

  await page.evaluate(() => {
    window.__testNetworkOnline = false;
    window.dispatchEvent(new Event('offline'));
  });
  await expect(status).toBeVisible();
  await expect(status).toContainText(/Браузер сообщает|browser reports/i);
  await expect(status).toContainText(/не повторяются автоматически|not retried automatically/i);

  await page.evaluate(() => {
    window.__testNetworkOnline = true;
    window.dispatchEvent(new Event('online'));
  });
  await expect(status).toBeHidden();
  await expect(page.locator('#toast')).toContainText(/Повтори запрос вручную|Retry manually/i);
  await expect(composer).toHaveValue('Keep this offline draft');
  const messageCountAfterReconnect = await page.evaluate(() => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    const currentId = localStorage.getItem('ai_current_chat_v87');
    return chats.find(chat => chat.id === currentId)?.messages.length ?? -1;
  });
  expect(messageCountAfterReconnect).toBe(messageCount);
});


test('composer draft is synchronously flushed when the tab becomes hidden', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('#userInput').fill('Persist before tab suspension');

  const persistedImmediately = await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
    const drafts = JSON.parse(localStorage.getItem('ai_chat_drafts_v1') || '{}');
    const currentId = localStorage.getItem('ai_current_chat_v87');
    return drafts[currentId] || '';
  });
  expect(persistedImmediately).toBe('Persist before tab suspension');
});


test('chat project move offers a bounded undo action', async ({ page }) => {
  await page.addInitScript(() => {
    const project = { id: 'undo-target-project', name: 'Undo target project', description: '', instructions: '', memoryScope: 'project-only', memory: [], createdAt: '', updatedAt: '' };
    const chat = { id: 'undo-current-chat', title: 'Undo current chat', projectId: null, messages: [] };
    localStorage.setItem('ai_projects_v1', JSON.stringify([project]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([chat]));
    localStorage.setItem('ai_current_chat_v87', chat.id);
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await openProjectSettingsForId(page, 'undo-target-project');
  const projectSelect = page.locator('#currentProjectSelect');
  await expect(projectSelect).toBeVisible();
  await projectSelect.selectOption('undo-target-project');
  await expect(page.locator('#toast')).toContainText('Чат добавлен в проект: Undo target project');
  const undo = page.locator('#toast .toast-action');
  await expect(undo).toHaveText('Отменить');
  await expect(undo).toHaveCSS('min-height', '44px');
  await undo.click();
  await expect(projectSelect).toHaveValue('');
  await expect.poll(() => page.evaluate(() => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    return chats.find(chat => chat.id === 'undo-current-chat')?.projectId || '';
  })).toBe('');
  await expect(page.locator('#toast')).toContainText('Перемещение чата отменено');
});


test('chat-row project move can be undone without changing chat identity', async ({ page }) => {
  await page.addInitScript(() => {
    const project = (id, name) => ({ id, name, description: '', instructions: '', memoryScope: 'project-only', memory: [], createdAt: '', updatedAt: '' });
    const chat = { id: 'undo-row-chat', title: 'Undo row chat', projectId: 'undo-row-source', messages: [] };
    localStorage.setItem('ai_projects_v1', JSON.stringify([project('undo-row-source', 'Undo row source'), project('undo-row-target', 'Undo row target')]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([chat]));
    localStorage.setItem('ai_current_chat_v87', chat.id);
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await ensureSidebarOpen(page);
  const navigation = page.locator('#projectNavigationList');
  if (await navigation.evaluate(element => element.classList.contains('hidden'))) {
    await page.locator('#projectNavToggle').click();
  }
  const chatId = 'undo-row-chat';
  const sourceGroup = page.locator('#projectNavigationList details[data-project-id="undo-row-source"]');
  if (!(await sourceGroup.evaluate(element => element.open))) await sourceGroup.locator(':scope > summary').click();
  const chatRow = sourceGroup.locator('.chat-row').filter({
    has: page.locator('[data-action="switch-chat"][data-chat-id="' + chatId + '"]')
  });
  await chatRow.locator('.chat-row-menu > summary').click();
  await chatRow.locator('[data-action="chat-project"]').click();
  await page.locator('#chatActionProject').selectOption('undo-row-target');
  await page.locator('[data-action="chat-action-save"]').click();
  await expect(page.locator('#toast')).toContainText('Чат добавлен в проект: Undo row target');
  const undo = page.locator('#toast .toast-action');
  await expect(undo).toHaveText('Отменить');
  await undo.click();
  const restored = await page.evaluate(id => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    return chats.find(chat => chat.id === id)?.projectId || '';
  }, chatId);
  expect(restored).toBe('undo-row-source');
  expect(await page.evaluate(() => localStorage.getItem('ai_current_chat_v87'))).toBe(chatId);
  await expect(page.locator('#toast')).toContainText('Перемещение чата отменено');
});


test('chat deletion offers immediate undo through the existing recovery slot', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-sidebar"]').click();
  await page.locator('#chatListNewButton').click();
  const deletedChatId = await page.evaluate(() => localStorage.getItem('ai_current_chat_v87'));

  await ensureSidebarOpen(page);
  const row = page.locator('#chatList .chat-row').filter({
    has: page.locator('[data-action="switch-chat"][data-chat-id="' + deletedChatId + '"]')
  });
  await row.locator('.chat-row-menu > summary').click();
  page.on('dialog', dialog => dialog.accept());
  await row.locator('[data-action="delete-chat"]').click();
  await expect.poll(() => page.evaluate(id => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    return chats.some(chat => chat.id === id);
  }, deletedChatId)).toBe(false);

  const undo = page.locator('#toast .toast-action');
  await expect(undo).toHaveText('Отменить');
  await undo.click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_current_chat_v87'))).toBe(deletedChatId);
  await expect.poll(() => page.evaluate(id => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    return chats.some(chat => chat.id === id);
  }, deletedChatId)).toBe(true);
});


test('chat rename offers bounded undo and restores the exact previous title', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await ensureSidebarOpen(page);
  const chatId = await page.evaluate(() => localStorage.getItem('ai_current_chat_v87'));
  const row = page.locator('#chatList .chat-row').filter({
    has: page.locator('[data-action="switch-chat"][data-chat-id="' + chatId + '"]')
  });
  const switchButton = row.locator('[data-action="switch-chat"]');
  const previousTitle = (await switchButton.textContent())?.trim() || '';
  await row.locator('.chat-row-menu > summary').click();
  await row.locator('[data-action="chat-rename"]').click();
  await page.locator('#chatActionName').fill('Undo rename title');
  await page.locator('[data-action="chat-action-save"]').click();
  await expect(switchButton).toHaveText('Undo rename title');

  const undo = page.locator('#toast .toast-action');
  await expect(undo).toHaveText('Отменить');
  await undo.focus();
  await undo.press('Enter');
  await expect(switchButton).toHaveText(previousTitle);
  await expect.poll(() => page.evaluate(() => document.activeElement?.dataset?.chatId || '')).toBe(chatId);
  await expect.poll(() => page.evaluate(id => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    return chats.find(chat => chat.id === id)?.title || '';
  }, chatId)).toBe(previousTitle);
});


test('advanced appearance theme selector is present, translated, and synchronized with header toggle', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="toggle-settings"]').first().click();
  const advanced = page.locator('#additionalSettings');
  if (!(await advanced.evaluate(element => element.open))) await advanced.locator(':scope > summary').click();
  const appearance = page.locator('[data-settings-category="appearance"]');
  if (!(await appearance.evaluate(element => element.open))) await appearance.locator(':scope > summary').click();

  const theme = page.locator('#uiTheme');
  await expect(theme).toBeVisible();
  await expect(theme.locator('option[value="dark"]')).toHaveText('Тёмная');
  await expect(theme.locator('option[value="light"]')).toHaveText('Светлая');
  await theme.selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_ui_theme_v2'))).toBe('light');

  await page.locator('#settingsModal [data-action="close-settings"]').click();
  await page.locator('#headerThemeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-action="toggle-settings"]').first().click();
  await expect(theme).toHaveValue('dark');
});

test('planned function menu items are status cards, not fake controls, and can pause motion', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.locator('#functionsMenuSummary').click();
  const menu = page.locator('#functionsMenu');
  const cards = menu.locator('.function-roadmap-item');
  await expect(cards).toHaveCount(5);
  await expect(cards.nth(0)).toContainText('Глубокое исследование 2.0');
  await expect(cards.nth(1)).toContainText('постоянная библиотека');
  await expect(cards.nth(2)).toContainText('screenshot-to-code');
  await expect(cards.nth(3)).toContainText('Knowledge-to-Skill');
  await expect(cards.nth(4)).toContainText('генерация изображений/видео');
  await expect(cards.locator('button')).toHaveCount(0);
  const ticker = cards.nth(0).locator('.roadmap-ticker-track');
  await expect(ticker).toContainText('1ИÆИT10И');
  await page.locator('#functionsRoadmapPause').check();
  expect(await ticker.evaluate(element => getComputedStyle(element).animationPlayState)).toBe('paused');
  await selectLanguage(page, 'en');
  await expect(menu.locator('.toolbar-menu-group-label').nth(1)).toContainText('Research and sources');
});
