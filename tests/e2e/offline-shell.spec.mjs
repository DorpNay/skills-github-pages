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

  const cacheUpgrade = await page.evaluate(async () => {
    const activeUrl = new URL(navigator.serviceWorker.controller.scriptURL);
    const oldRevision = activeUrl.searchParams.get('v') || 'dev';
    const oldCache = 'alandi-shell-' + oldRevision.slice(0, 16);
    const legacyAsset = new URL('assets/js/vendor/legacy-compat-test.js', location.href);
    const oldCacheStore = await caches.open(oldCache);
    await oldCacheStore.put(legacyAsset.href, new Response('legacy-asset-from-previous-shell'));
    const nextRevision = 'offline-upgrade-test';
    activeUrl.searchParams.set('v', nextRevision);
    await navigator.serviceWorker.register(activeUrl.href, { updateViaCache: 'none' });
    return { oldCache, nextCache: 'alandi-shell-' + nextRevision.slice(0, 16), legacyAsset: legacyAsset.href };
  });
  await page.waitForFunction(() => new URL(navigator.serviceWorker.controller.scriptURL).searchParams.get('v') === 'offline-upgrade-test');
  const cacheNames = await page.evaluate(() => caches.keys());
  expect(cacheNames).toContain(cacheUpgrade.oldCache);
  expect(cacheNames).toContain(cacheUpgrade.nextCache);
  await context.setOffline(true);
  const legacyBody = await page.evaluate(async url => (await fetch(url)).text(), cacheUpgrade.legacyAsset);
  expect(legacyBody).toBe('legacy-asset-from-previous-shell');
  await context.setOffline(false);
});


test('Offline Core displays browser storage state and requests persistence only after an explicit click', async ({ page }) => {
  await page.addInitScript(() => {
    const storage = navigator.storage;
    if (!storage) return;
    window.__persistRequests = 0;
    window.__persistentGranted = false;
    Object.defineProperty(storage, 'persist', {
      configurable: true,
      value: async () => { window.__persistRequests += 1; window.__persistentGranted = true; return true; }
    });
    Object.defineProperty(storage, 'persisted', {
      configurable: true,
      value: async () => window.__persistentGranted
    });
  });
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#offlineCoreSettings')).toBeAttached();
  await expect(page.locator('#offlineNetworkValue')).not.toHaveText('');
  await expect(page.locator('#offlineStorageValue')).not.toHaveText('');
  expect(await page.evaluate(() => window.__persistRequests)).toBe(0);
  await page.locator('#uiLanguage').selectOption('en');
  await expect(page.locator('#offlineCoreSettings h3')).toHaveText('Offline Core · on-device storage');
  await expect(page.locator('#offlineCorePersistButton')).toHaveText('Request persistent storage on this device');
  await page.locator('#offlineCorePersistButton').click();
  await expect(page.locator('#offlineCoreStatus')).toContainText('The browser granted persistent storage.');
  expect(await page.evaluate(() => window.__persistRequests)).toBe(1);
  await expect(page.locator('#offlineCorePersistButton')).toBeHidden();
});
