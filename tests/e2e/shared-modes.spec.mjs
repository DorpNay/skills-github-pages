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

  await page.locator('[data-shared-mode="notebook"]').click();
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

  await page.locator('[data-shared-mode="alandi"]').click();
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

test('aCodingi keeps the shared frame but does not claim an unavailable sandbox', async ({ page }) => {
  await page.goto(APP_PATH);
  await expect(page.locator('#sharedModeSwitcher')).toBeVisible();
  const chatBox = page.locator('#chatBox');
  const composer = page.locator('#composerFooter');
  const chatBefore = await chatBox.boundingBox();
  const composerBefore = await composer.boundingBox();

  await page.locator('[data-shared-mode="coding"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-app-mode', 'coding');
  await expect(page.locator('#codingModePanel')).toBeVisible();
  await expect(page.locator('#codingModePanel')).toContainText('sandbox');
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
  await page.locator('[data-shared-mode="notebook"]').click();
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

  const persistedBeforeFailure = await page.evaluate(() => (
    localStorage.getItem('ai_shared_notebook_sources_v1')
  ));
  expect(persistedBeforeFailure).not.toBeNull();

  await page.evaluate(() => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'ai_shared_notebook_sources_v1') {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      }
      return Reflect.apply(originalSetItem, this, [key, value]);
    };
  });

  await checkbox.click();
  await expect(checkbox).toBeChecked();
  await expect(page.locator('#sharedNotebookStatus')).toContainText('Could not save source selection');
  await expect.poll(() => page.evaluate(() => (
    localStorage.getItem('ai_shared_notebook_sources_v1')
  ))).toBe(persistedBeforeFailure);
});
