import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test('root runtime assets stay same-origin and work without a CDN', async ({ page }) => {
  const externalRuntimeRequests = [];
  page.on('request', request => {
    if (!['script', 'stylesheet', 'font'].includes(request.resourceType())) return;
    if (new URL(request.url()).origin !== new URL(page.url()).origin) externalRuntimeRequests.push(request.url());
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
    stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map(link => link.href),
    externalStylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].filter(link => new URL(link.href).origin !== location.origin).map(link => link.href),
    sidebarDisplay: getComputedStyle(document.querySelector('#sidebar')).display,
    settingsDisplay: getComputedStyle(document.querySelector('#settingsModal')).display
  }));
  expect(runtime.externalScripts).toEqual([]);
  expect(runtime.externalStylesheets).toEqual([]);
  expect(runtime.scripts.some(url => url.includes('marked-18.0.14.min.js'))).toBe(true);
  expect(runtime.scripts.some(url => url.includes('purify-3.4.16.min.js'))).toBe(true);
  expect(runtime.scripts.some(url => url.includes('tailwindcss-3.4.17.js'))).toBe(false);
  expect(runtime.stylesheets.some(url => url.includes('tailwind.generated.css'))).toBe(true);
  expect(runtime.sidebarDisplay).toBe('flex');
  expect(runtime.settingsDisplay).toBe('none');
  expect(externalRuntimeRequests).toEqual([]);
});
