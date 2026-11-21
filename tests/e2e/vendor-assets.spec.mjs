import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test('root runtime assets stay same-origin and work without a CDN', async ({ page }) => {
  const externalRuntimeRequests = [];
  page.on('request', request => {
    if (!['script', 'stylesheet', 'font'].includes(request.resourceType())) return;
    const url = new URL(request.url());
    if (url.origin !== new URL(APP_PATH, 'http://127.0.0.1').origin && !['http://127.0.0.1', 'http://localhost'].includes(url.origin)) {
      externalRuntimeRequests.push(request.url());
    }
  });
  await page.route('https://**', route => route.abort());
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() =>
    typeof window.marked?.parse === 'function' &&
    typeof window.DOMPurify?.sanitize === 'function'
  )).toBe(true);
  const runtime = await page.evaluate(() => ({
    scripts: [...document.scripts].filter(script => script.src).map(script => script.src),
    externalScripts: [...document.scripts].filter(script => script.src && new URL(script.src).origin !== location.origin).map(script => script.src),
    sidebarDisplay: getComputedStyle(document.querySelector('#sidebar')).display
  }));
  expect(runtime.externalScripts).toEqual([]);
  expect(runtime.scripts.some(url => url.includes('tailwindcss-3.4.17.js'))).toBe(true);
  expect(runtime.scripts.some(url => url.includes('marked-18.0.14.min.js'))).toBe(true);
  expect(runtime.scripts.some(url => url.includes('purify-3.4.16.min.js'))).toBe(true);
  expect(runtime.sidebarDisplay).toBe('flex');
  expect(externalRuntimeRequests).toEqual([]);
});
