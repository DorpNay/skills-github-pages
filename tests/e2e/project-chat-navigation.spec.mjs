import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

async function openSidebar(page) {
  const sidebar = page.locator('#sidebar');
  if (await sidebar.evaluate(element => element.classList.contains('-translate-x-full'))) {
    await page.locator('[data-action="toggle-sidebar"]').click();
  }
  await expect(sidebar).not.toHaveClass(/-translate-x-full/);
}

async function createProject(page, name) {
  await page.locator('#projectPanel [data-action="open-project-create"]').click();
  await expect(page.locator('#projectSettingsModal')).toBeVisible();
  await page.locator('#projectNameInput').fill(name);
  await page.locator('#createProjectSubmit').click();
  await expect.poll(() => page.evaluate(projectName => {
    const projects = JSON.parse(localStorage.getItem('ai_projects_v1') || '[]');
    return projects.some(project => project.name === projectName);
  }, name)).toBe(true);
  await page.locator('#projectSettingsModal [data-action="close-project-settings"]').click();
  await expect(page.locator('#projectSettingsModal')).toBeHidden();
}

async function projectId(page, name) {
  return page.evaluate(projectName => {
    const projects = JSON.parse(localStorage.getItem('ai_projects_v1') || '[]');
    return projects.find(project => project.name === projectName)?.id || null;
  }, name);
}

async function openProjectGroup(page, id) {
  const navigation = page.locator('#projectNavigationList');
  if (await navigation.evaluate(element => element.classList.contains('hidden'))) {
    await page.locator('#projectNavToggle').click();
  }
  const group = navigation.locator('details.project-nav-item[data-project-id="' + id + '"]');
  if (!(await group.evaluate(element => element.open))) {
    await group.locator(':scope > summary').click();
  }
  return group;
}

async function selectProject(page, id) {
  const group = await openProjectGroup(page, id);
  await group.locator('[data-action="select-project"]').click();
  await expect(page.locator('#chatListBack')).toBeVisible();
}

async function readLocalState(page) {
  return page.evaluate(() => ({
    chats: JSON.parse(localStorage.getItem('ai_chats_v87') || '[]'),
    projects: JSON.parse(localStorage.getItem('ai_projects_v1') || '[]'),
    currentId: localStorage.getItem('ai_current_chat_v87')
  }));
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('e2e-cleaned') !== '1') {
      localStorage.clear();
      sessionStorage.setItem('e2e-cleaned', '1');
    }
  });
  await page.route(/(?:\/models(?:\?.*)?|\/text\/models(?:\?.*)?|\/language-models(?:\?.*)?|\/ai\/models\/search(?:\?.*)?)$/, async route => {
    return route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: { message: 'Catalog intentionally unavailable in deterministic E2E.' } })
    });
  });
});

test('project selection filters the Chats pane without changing chat membership; Back returns to personal chats', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await openSidebar(page);

  const initial = await readLocalState(page);
  const initialCurrent = initial.chats.find(chat => chat.id === initial.currentId);
  expect(initialCurrent?.projectId ?? null).toBeNull();

  await createProject(page, 'Alpha workspace');
  await createProject(page, 'Beta workspace');

  const alphaId = await projectId(page, 'Alpha workspace');
  const betaId = await projectId(page, 'Beta workspace');
  expect(alphaId).toBeTruthy();
  expect(betaId).toBeTruthy();
  expect(alphaId).not.toBe(betaId);

  let state = await readLocalState(page);
  const currentAfterCreation = state.chats.find(chat => chat.id === state.currentId);
  expect(currentAfterCreation?.projectId ?? null, 'creating a project must not move the active chat into it').toBeNull();

  await selectProject(page, alphaId);
  await expect(page.locator('#chatSectionTitle')).toContainText('Alpha workspace');
  await expect(page.locator('#chatList .chat-row')).toHaveCount(0);

  const currentBeforeFilter = (await readLocalState(page)).currentId;
  await page.locator('#chatListNewButton').click();
  await expect(page.locator('#chatList .chat-row')).toHaveCount(1);
  state = await readLocalState(page);
  expect(state.currentId).not.toBe(currentBeforeFilter);
  expect(state.chats.find(chat => chat.id === state.currentId)?.projectId).toBe(alphaId);

  await selectProject(page, betaId);
  await expect(page.locator('#chatSectionTitle')).toContainText('Beta workspace');
  await page.locator('#chatListNewButton').click();
  await expect(page.locator('#chatList .chat-row')).toHaveCount(1);
  state = await readLocalState(page);
  expect(state.chats.find(chat => chat.id === state.currentId)?.projectId).toBe(betaId);

  const currentBeforeSelection = state.currentId;
  await selectProject(page, alphaId);
  expect((await readLocalState(page)).currentId, 'filtering a project must not switch the active conversation').toBe(currentBeforeSelection);
  await expect(page.locator('#chatList .chat-row')).toHaveCount(1);
  await expect(page.locator('#chatList')).toContainText('Alpha workspace');
  await expect(page.locator('#chatList')).not.toContainText('Beta workspace');

  await page.locator('#chatListNewButton').click();
  await expect(page.locator('#chatList .chat-row')).toHaveCount(2);
  state = await readLocalState(page);
  expect(state.chats.filter(chat => chat.projectId === alphaId)).toHaveLength(2);
  expect(state.chats.filter(chat => chat.projectId === betaId)).toHaveLength(1);

  await page.locator('#chatListBack').click();
  await expect(page.locator('#chatListBack')).toBeHidden();
  await expect(page.locator('#chatSectionTitle')).toContainText('Без проекта');
  await expect(page.locator('#chatList .chat-row')).toHaveCount(1);
  state = await readLocalState(page);
  expect(state.chats.filter(chat => !chat.projectId)).toHaveLength(1);

  await selectProject(page, betaId);
  await expect(page.locator('#chatList .chat-row')).toHaveCount(1);
  await page.goBack();
  await expect(page.locator('#chatListBack')).toBeHidden();
  await expect(page.locator('#chatSectionTitle')).toContainText('Без проекта');
  await page.goForward();
  await expect(page.locator('#chatSectionTitle')).toContainText('Beta workspace');
  await expect(page.locator('#chatList .chat-row')).toHaveCount(1);
});

test('project-filter and Back controls remain usable at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await openSidebar(page);
  await createProject(page, 'Narrow project');
  const id = await projectId(page, 'Narrow project');
  await selectProject(page, id);
  await expect(page.locator('#chatSectionTitle')).toContainText('Narrow project');
  const backBox = await page.locator('#chatListBack').boundingBox();
  expect(backBox?.height || 0).toBeGreaterThanOrEqual(40);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator('#chatListNewButton').click();
  await expect(page.locator('#chatList .chat-row')).toHaveCount(1);
  await page.locator('#chatListBack').click();
  await expect(page.locator('#chatListBack')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
