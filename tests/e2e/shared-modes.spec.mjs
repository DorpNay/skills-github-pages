import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

async function openSidebar(page) {
  const sidebar = page.locator('#sidebar');
  const toggle = page.locator('#appSidebarToggle');
  if (await toggle.getAttribute('aria-expanded') !== 'true') {
    await toggle.click();
  }
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(sidebar).not.toHaveClass(/-translate-x-full/);
}

async function chooseMode(page, mode) {
  const strip = page.locator('#sharedModeStrip');
  if (await strip.getAttribute('aria-expanded') !== 'true') await strip.click();
  await page.locator(`[data-shared-mode="${mode}"]`).click();
}

async function closeSidebar(page) {
  const sidebar = page.locator('#sidebar');
  if (!(await sidebar.evaluate(el => el.classList.contains('-translate-x-full')))) {
    await sidebar.locator('[data-action="close-sidebar"]').click();
  }
  await expect(sidebar).toHaveClass(/-translate-x-full/);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('mode selector expands, selects in two steps, collapses and signals on return', async ({ page }) => {
  await page.goto(APP_PATH);
  const nav = page.locator('#sharedModeSwitcher');
  const strip = page.locator('#sharedModeStrip');
  const choices = page.locator('#sharedModeChoices');
  await expect(strip).toBeVisible();
  await expect(nav).toHaveClass(/return-signal/);
  await expect.poll(() => strip.getAttribute('aria-expanded'), { timeout: 2000 }).toBe('false');
  await expect(strip).toContainText('aLandi');
  await expect(choices).toBeHidden();

  await strip.click();
  await expect(strip).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[data-shared-mode]')).toHaveCount(3);
  await page.locator('[data-shared-mode="notebook"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-app-mode', 'notebook');
  await expect(strip).toHaveAttribute('aria-expanded', 'true');
  await expect(strip).toContainText('aNoteBooki');
  await page.locator('[data-shared-mode="notebook"]').click();
  await expect(strip).toHaveAttribute('aria-expanded', 'false');

  await strip.click();
  await page.locator('[data-shared-mode="alandi"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-app-mode', 'alandi');
  await expect(strip).toHaveAttribute('aria-expanded', 'true');
  await page.locator('[data-shared-mode="alandi"]').click();
  await expect(strip).toHaveAttribute('aria-expanded', 'false');

  await page.evaluate(() => window.dispatchEvent(new Event('pageshow')));
  await expect(strip).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(() => strip.getAttribute('aria-expanded'), { timeout: 2000 }).toBe('false');
  await expect(nav).toHaveAttribute('data-mode', 'alandi');
});

test('Notebook sidebar shortcut stays inside the shared root application', async ({ page }) => {
  await page.goto(APP_PATH);
  await openSidebar(page);
  const shortcut = page.locator('#sidebar [data-action="open-notebook-mode"]');
  await expect(shortcut).toBeVisible();
  await expect(page.locator('#sidebar a[href*="/notebook/"]')).toHaveCount(0);

  await shortcut.click();
  await expect(page).toHaveURL(/#mode=notebook$/);
  await expect(page.locator('body')).toHaveAttribute('data-app-mode', 'notebook');
  await expect(page.locator('#notebookModePanel')).toBeVisible();
  await expect(page.locator('#projectPanel')).toBeHidden();
  await expect(page.locator('#chatBox')).toBeVisible();
});

test('shared modes preserve the root frame and scope Notebook chat to checked sources', async ({ page }) => {
  await page.goto(APP_PATH);
  await expect(page.locator('#sharedModeSwitcher')).toBeVisible();
  const input = page.locator('#userInput');
  const placeholderBefore = await input.getAttribute('placeholder');
  expect(placeholderBefore).not.toBe('');
  await input.fill('keep personal draft');
  const chatBox = page.locator('#chatBox');
  const composer = page.locator('#composerFooter');
  const chatBefore = await chatBox.boundingBox();
  const composerBefore = await composer.boundingBox();
  const normalChatText = await chatBox.innerText();

  await chooseMode(page, 'notebook');
  await expect(page).toHaveURL(/#mode=notebook$/);
  await expect(page.locator('body')).toHaveAttribute('data-app-mode', 'notebook');
  await expect(page.locator('#notebookModePanel')).toBeVisible();
  await expect(page.locator('#projectPanel')).toBeHidden();
  await openSidebar(page);

  await page.locator('#sharedNotebookName').fill('Research notebook');
  await page.locator('#sharedNotebookCreate button[type="submit"]').click();
  await expect(page.locator('#sharedNotebookList')).toContainText('Research notebook');

  await page.locator('#notebookModePanel details').nth(2).locator('summary').click();
  await page.locator('#sharedTextFiles').setInputFiles([
    { name: 'selected.txt', mimeType: 'text/plain', buffer: Buffer.from('Project Orion launch date is 14 March 2027. This selected document is the only allowed evidence.') },
    { name: 'private.txt', mimeType: 'text/plain', buffer: Buffer.from('PRIVATE_UNSELECTED_SENTINEL must never be transmitted to aServi.') }
  ]);
  await page.locator('#sharedImportForm button[type="submit"]').click();
  await expect(page.locator('#sharedNotebookStatus')).toContainText(/Текст импортирован локально|Text imported locally/);
  await expect(page.locator('#sharedNotebookSources label')).toHaveCount(2);
  await page.locator('#sharedNotebookSources label').filter({ hasText: 'selected.txt' }).locator('input').check();
  await closeSidebar(page);

  await page.evaluate(() => {
    localStorage.setItem('ai_alandi_cloud_base_url', 'https://aservi.example.test/v1');
    localStorage.setItem('ai_api_key_alandi', 'test-only-key');
    localStorage.setItem('ai_alandi_cloud_model', 'test-model');
  });
  let transmittedBody = null;
  await page.route('https://aservi.example.test/v1/chat/completions', async route => {
    transmittedBody = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ choices: [{ message: { content: 'The launch date is 14 March 2027 [E1].' } }] })
    });
  });
  page.on('dialog', dialog => dialog.accept());
  await page.locator('#userInput').fill('What is the Orion launch date?');
  await page.locator('#sendBtn').click();

  await expect(page.locator('#sharedNotebookStatus')).toContainText('Ответ сохранён');
  expect(transmittedBody).not.toBeNull();
  const userPacket = transmittedBody.messages.at(-1).content;
  expect(userPacket).toContain('14 March 2027');
  expect(JSON.stringify(transmittedBody)).not.toContain('PRIVATE_UNSELECTED_SENTINEL');
  await expect(chatBox).toContainText('14 March 2027');

  const chatAfter = await chatBox.boundingBox();
  const composerAfter = await composer.boundingBox();
  for (const key of ['x', 'y', 'width', 'height']) {
    expect(Math.abs(chatAfter[key] - chatBefore[key])).toBeLessThanOrEqual(1);
    expect(Math.abs(composerAfter[key] - composerBefore[key])).toBeLessThanOrEqual(1);
  }

  await chooseMode(page, 'alandi');
  await expect(page.locator('body')).toHaveAttribute('data-app-mode', 'alandi');
  await expect(chatBox).toHaveText(normalChatText);
  await expect(page.locator('#projectPanel')).toBeVisible();
  await expect(input).toHaveValue('keep personal draft');
  await expect(input).toHaveAttribute('placeholder', placeholderBefore);
  await page.goBack();
  await expect(page.locator('body')).toHaveAttribute('data-app-mode', 'notebook');
  await page.goForward();
  await expect(page.locator('body')).toHaveAttribute('data-app-mode', 'alandi');
  await expect(input).toHaveValue('keep personal draft');
});

test('Coding Projects persist in the canonical project store and hand off to the scoped browser workspace', async ({ page }) => {
  await page.goto(APP_PATH);const originalTitle=await page.locator('#activeChatTitle').innerText();
  await chooseMode(page, 'coding');await expect(page.locator('#codingProjectCreate')).toBeVisible();
  await page.locator('#codingProjectCreateName').fill('aLandi coding workspace');
  await page.locator('#codingProjectCreateInstructions').fill('Keep changes scoped to this project. Preserve a reviewable diff.');
  await page.locator('#codingProjectCreate button[type="submit"]').click();
  await expect(page.locator('#sharedCodingProjectList')).toContainText('aLandi coding workspace');
  await expect(page.locator('#codingProjectEditInstructions')).toHaveValue('Keep changes scoped to this project. Preserve a reviewable diff.');
  await expect(page.locator('#activeChatTitle')).toHaveText(originalTitle);
  const workspaceLink=page.locator('#sharedCodingWorkspaceLink');await expect(workspaceLink).toBeVisible();
  const workspaceUrl=new URL(await workspaceLink.getAttribute('href')),projectId=workspaceUrl.searchParams.get('projectId');expect(projectId).toBeTruthy();
  const stored=await page.evaluate(id=>JSON.parse(localStorage.getItem('ai_projects_v1')).find(item=>item.id===id),projectId);
  expect(stored.kind).toBe('coding');expect(stored.codingWorkspace.schemaVersion).toBe(1);
  await page.locator('#codingProjectEditName').fill('aLandi coding workspace v2');await page.locator('#codingProjectEdit button[type="submit"]').click();
  await expect(page.locator('#sharedCodingProjectList')).toContainText('aLandi coding workspace v2');
  await page.reload();await expect(page.locator('#codingProjectEditName')).toHaveValue('aLandi coding workspace v2');
  await workspaceLink.click();await expect(page).toHaveURL(/workspace\/\?projectId=/);
  await expect(page.locator('#codingProjectContext')).toBeVisible();await expect(page.locator('#codingProjectName')).toHaveText('aLandi coding workspace v2');
  await expect(page.locator('#workspaceActivityList')).toContainText(/Рабочее пространство открыто|Workspace opened/);
  await expect(page.locator('#codingProjectInstructions')).toContainText('Keep changes scoped to this project');await expect(page.locator('#chooseFolder')).toBeEnabled();
  await page.goBack();await page.locator('#codingProjectOpenChat').click();await expect(page.locator('body')).toHaveAttribute('data-app-mode','alandi');
  await expect(page.locator('#activeProjectTitle')).toContainText('aLandi coding workspace v2');
});

test('aCodingi keeps the shared frame but does not claim an unavailable sandbox', async ({ page }) => {
  await page.goto(APP_PATH);
  await expect(page.locator('#sharedModeSwitcher')).toBeVisible();
  const chatBox = page.locator('#chatBox');
  const composer = page.locator('#composerFooter');
  const chatBefore = await chatBox.boundingBox();
  const composerBefore = await composer.boundingBox();

  await chooseMode(page, 'coding');
  await expect(page.locator('body')).toHaveAttribute('data-app-mode', 'coding');
  await expect(page.locator('#codingModePanel')).toBeVisible();
  await expect(page.locator('#codingModePanel')).toContainText('sandbox');
  await expect(page.locator('#codingProjectCreate')).toBeVisible();
  await expect(page.locator('#userInput')).toBeDisabled();
  await expect(page.locator('#sendBtn')).toBeDisabled();

  const chatAfter = await chatBox.boundingBox();
  const composerAfter = await composer.boundingBox();
  for (const key of ['x', 'y', 'width', 'height']) {
    expect(Math.abs(chatAfter[key] - chatBefore[key])).toBeLessThanOrEqual(1);
    expect(Math.abs(composerAfter[key] - composerBefore[key])).toBeLessThanOrEqual(1);
  }
});


test('shared modes preserve the root frame and scope Notebook chat to checked sources when selection storage is unavailable', async ({ page }) => {
  await page.goto(APP_PATH);
  await page.evaluate(() => {
    document.documentElement.lang = 'en';
    localStorage.setItem('ai_ui_language_v1', 'en');
  });
  await chooseMode(page, 'notebook');
  await expect(page.locator('#notebookModePanel')).toBeVisible();
  await openSidebar(page);
  await page.locator('#sharedNotebookName').fill('Storage failure notebook');
  await page.locator('#sharedNotebookCreate button[type="submit"]').click();
  await expect(page.locator('#sharedNotebookList')).toContainText('Storage failure notebook');
  await page.locator('#notebookModePanel details').first().locator('summary').click();
  await page.locator('#sharedNoteTitle').fill('Persisted source');
  await page.locator('#sharedNoteBody').fill('This source is selected before storage becomes unavailable.');
  await page.locator('#sharedNoteForm button[type="submit"]').click();
  const checkbox = page.locator('#sharedNotebookSources label').filter({ hasText: 'Persisted source' }).locator('input');
  await expect(checkbox).toBeVisible();
  await checkbox.check();
  await expect(checkbox).toBeChecked();
  const persistedBeforeFailure = await page.evaluate(() => localStorage.getItem('ai_shared_notebook_sources_v1'));
  expect(persistedBeforeFailure).not.toBeNull();
  await page.evaluate(() => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'ai_shared_notebook_sources_v1') throw new DOMException('Quota exceeded', 'QuotaExceededError');
      return Reflect.apply(originalSetItem, this, [key, value]);
    };
  });
  await checkbox.click();
  await expect(checkbox).toBeChecked();
  await expect(page.locator('#sharedNotebookStatus')).toContainText('Could not save source selection');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('ai_shared_notebook_sources_v1'))).toBe(persistedBeforeFailure);
});


test('Coding Workspace metadata is scoped by project and export omits directory handles and file contents', async ({ page }) => {
  await page.goto(APP_PATH);
  await expect.poll(() => page.evaluate(() => Boolean(window.AlandiCodingWorkspaceStore))).toBe(true);
  const result = await page.evaluate(async () => {
    const store = window.AlandiCodingWorkspaceStore;
    await store.ensureWorkspace('coding-project-a');
    await store.ensureWorkspace('coding-project-b');
    await store.saveRootHandle('coding-project-a', {kind:'directory',name:'project-a-root'});
    await store.saveRootHandle('coding-project-b', {kind:'directory',name:'project-b-root'});
    await store.recordEvent('coding-project-a','project_selected');
    await store.recordEvent('coding-project-a','workspace_opened');
    await store.recordEvent('coding-project-a','files_loaded',{count:3});
    const exported = await store.exportMetadata('coding-project-a');
    const a = await store.getWorkspace('coding-project-a');
    const b = await store.getWorkspace('coding-project-b');
    const handleA = await store.getRootHandle('coding-project-a');
    const handleB = await store.getRootHandle('coding-project-b');
    const events = await store.listEvents('coding-project-a');
    let rejectedUnknownEvent = false;
    try { await store.recordEvent('coding-project-a','private_prompt',{prompt:'never store this'}); }
    catch (_) { rejectedUnknownEvent = true; }
    await store.forgetWorkspace('coding-project-a');
    return {a,b,handleA,handleB,events,exported,rejectedUnknownEvent,removed:await store.getWorkspace('coding-project-a')};
  });
  expect(result.a.lastEventSeq).toBe(5);
  expect(result.b.lastEventSeq).toBe(1);
  expect(result.handleA.name).toBe('project-a-root');
  expect(result.handleB.name).toBe('project-b-root');
  expect(result.events.map(event => event.seq)).toEqual([1,2,3,4,5]);
  expect(result.events.map(event => event.type)).toEqual(['root_selected','project_selected','workspace_opened','files_loaded','workspace_exported']);
  expect(result.events[3].details).toEqual({count:3});
  expect(result.exported.workspace.hasRootHandle).toBe(true);
  expect(result.exported.workspace.rootLabel).toBe('project-a-root');
  expect(JSON.stringify(result.exported)).not.toContain('rootHandle');
  expect(JSON.stringify(result.exported)).not.toContain('never store this');
  expect(result.rejectedUnknownEvent).toBe(true);
  expect(result.removed).toBeNull();
});

test('Coding Workspace controls and status copy follow the selected RU/EN locale', async ({ page }) => {
  await page.goto(APP_PATH);
  await page.evaluate(() => {
    localStorage.setItem('ai_ui_language_v1','en');
    localStorage.setItem('ai_projects_v1',JSON.stringify([{id:'coding-locale-fixture',kind:'coding',name:'English project',instructions:'Use local files only.',codingWorkspace:{schemaVersion:1,rootLabel:'',lastOpenedAt:''}}]));
  });
  await page.goto('/workspace/?projectId=coding-locale-fixture');
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('h1')).toHaveText('aCodingi — coding workspace');
  await expect(page.locator('#chooseFolder')).toHaveText('Choose folder');
  await expect(page.locator('#chooseFiles')).toHaveText('Choose files');
  await expect(page.locator('#fileList .empty')).toHaveText('Choose a folder or files first.');
  await expect(page.locator('#codingProjectName')).toHaveText('English project');
  await expect(page.locator('#codingProjectInstructions')).toHaveText('Use local files only.');
});
