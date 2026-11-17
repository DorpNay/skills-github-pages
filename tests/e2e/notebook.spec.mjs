import { test, expect } from '@playwright/test';
const NOTEBOOK_PATH = process.env.LIVE_SITE_URL ? new URL('notebook/', process.env.LIVE_SITE_URL).toString() : '/notebook/';

test('aNoteBooki persists notes and URL references locally with project/chat provenance', async ({ page }) => {
  let sourceFetches = 0;
  await page.addInitScript(() => {
    localStorage.setItem('ai_ui_language_v1', 'en');
    localStorage.setItem('ai_projects_v1', JSON.stringify([{ id: 'project-notebook-1', name: 'Notebook Project' }]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([{ id: 'chat-notebook-1', title: 'Notebook Development Chat', projectId: 'project-notebook-1', messages: [] }]));
  });
  await page.route('https://example.com/**', route => { sourceFetches++; return route.abort(); });
  await page.goto(NOTEBOOK_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveText('aNoteBooki');
  await expect(page.locator('#pageDescription')).toContainText('private workspace');
  await expect(page.locator('#notebookProject')).toContainText('Notebook Project');
  await expect(page.locator('#notebookChat')).toContainText('Notebook Development Chat');

  await page.locator('#newNotebookName').fill('Research notebook');
  await page.locator('#createNotebookButton').click();
  await expect(page.locator('#activeNotebookTitle')).toHaveText('Research notebook');
  await page.locator('#notebookProject').selectOption('project-notebook-1');
  await page.locator('#notebookChat').selectOption('chat-notebook-1');
  await page.locator('#saveLinksButton').click();
  await expect(page.locator('#scopeStatus')).toContainText('Links saved');

  await page.locator('#noteTitle').fill('Verified finding');
  await page.locator('#noteBody').fill('A concise note with an explicit project and chat scope.');
  await page.locator('#saveNoteButton').click();
  await expect(page.locator('#notebookItems')).toContainText('Verified finding');
  await page.locator('#sourceTitle').fill('Example reference');
  await page.locator('#sourceUrl').fill('https://example.com/reference');
  await page.locator('#saveSourceButton').click();
  await expect(page.locator('#notebookItems')).toContainText('Example reference');
  expect(sourceFetches).toBe(0);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#activeNotebookTitle')).toHaveText('Research notebook');
  await expect(page.locator('#notebookItems')).toContainText('Verified finding');
  await expect(page.locator('#notebookItems')).toContainText('Example reference');
  await expect(page.locator('#notebookProject')).toHaveValue('project-notebook-1');
  await expect(page.locator('#notebookChat')).toHaveValue('chat-notebook-1');
  const audit = await page.evaluate(async () => {
    const notebook = (await window.AlandiNotebookStore.listNotebooks())[0];
    return { notebook, items: await window.AlandiNotebookStore.listItems(notebook.id), events: await window.AlandiNotebookStore.listEvents(notebook.id) };
  });
  expect(audit.notebook.schemaVersion).toBe(1);
  expect(audit.notebook.autoTransfer).toBe(false);
  expect(audit.items.some(x => x.type === 'note' && x.provenance.kind === 'user_authored')).toBe(true);
  expect(audit.items.some(x => x.type === 'source_reference' && x.provenance.fetched === false)).toBe(true);
  expect(audit.events.some(x => x.type === 'notebook_scope_updated')).toBe(true);
});
