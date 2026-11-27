import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';
const NOTEBOOK_PATH = process.env.LIVE_SITE_URL ? './notebook/' : '/notebook/';
const CODER_PATH = process.env.LIVE_SITE_URL ? './workspace/' : '/workspace/';

test('app shell is available offline after its first successful visit', async ({ page, context }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.offlineShell)).toBe('registered');
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await expect(page.locator('#chatBox')).toBeVisible();
  await page.waitForFunction(() => typeof window.marked?.parse === 'function' && typeof window.DOMPurify?.sanitize === 'function');
  const rootRevision = await page.locator('meta[name="alandi-build-revision"]').getAttribute('content');
  expect(rootRevision).toMatch(/^[0-9a-f]{40}$/);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#chatBox')).toBeVisible();
  await expect(page.locator('#sidebar')).toBeAttached();
  await page.waitForFunction(() => typeof window.marked?.parse === 'function' && typeof window.DOMPurify?.sanitize === 'function');
  await expect(page.locator('link[href*="tailwind.generated.css"]')).toHaveCount(1);
  await page.goto(NOTEBOOK_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'aNoteBooki' })).toBeVisible();
  await page.waitForFunction(() => Boolean(window.AlandiNotebookStore));
  await page.evaluate(() => localStorage.setItem('ai_projects_v1', JSON.stringify([{id:'offline-coding-project',kind:'coding',name:'Offline Coding Project',instructions:'Work only in the explicitly selected folder.',codingWorkspace:{schemaVersion:1,rootLabel:'',lastOpenedAt:''}}])));
  await page.goto(CODER_PATH + '?projectId=offline-coding-project', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: /aCodingi/ })).toBeVisible();
  await expect(page.locator('#codingProjectContext')).toBeVisible();
  await expect(page.locator('#codingProjectName')).toHaveText('Offline Coding Project');
  await expect(page.locator('#codingProjectInstructions')).toContainText('explicitly selected folder');
  await page.waitForFunction(() => Boolean(window.AlandiBrowserLocalProvider));
  const offlineState = await page.evaluate(() => ({ controlled: Boolean(navigator.serviceWorker.controller) }));
  expect(offlineState.controlled).toBe(true);
  expect(rootRevision).toMatch(/^[0-9a-f]{40}$/);
  await context.setOffline(false);
});
