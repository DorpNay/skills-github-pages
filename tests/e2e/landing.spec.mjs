import { test, expect } from '@playwright/test';

const LANDING_PATH = process.env.LIVE_SITE_URL
  ? new URL('landing/', process.env.LIVE_SITE_URL.replace(/\/?$/, '/')).toString()
  : '/landing/';

test('V1 landing distinguishes the free static UI from model inference and hosted services', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(LANDING_PATH, { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle(/aLandi/);
  await expect(page.locator('h1')).toContainText('Сохраняй контроль над средой');
  await expect(page.getByRole('link', { name: /Открыть рабочую среду/ })).toHaveAttribute('href', 'https://dorpnay.github.io/skills-github-pages/');
  await expect(page.locator('.hero .note')).toContainText('бесплатная статическая страница');
  await expect(page.locator('.hero .note')).toContainText('публичный hosted AI endpoint этим сайтом не предоставляется');
  await expect(page.locator('#stack')).toContainText('Это целевая схема развёртывания');
  await expect(page.locator('#readiness')).toContainText('а не на открытый многопользовательский SaaS');
  await expect(page.locator('nav a[href="#roadmap"]')).toBeVisible();
  await expect(page.locator('footer')).toContainText('Реестр финализации UI');

  const width = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  expect(width.document).toBeLessThanOrEqual(width.viewport);
});

test('landing roadmap tickers start only when a planned item is opened', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto(LANDING_PATH, { waitUntil: 'domcontentloaded' });

  const items = page.locator('#roadmap details');
  await expect(items).toHaveCount(3);
  const first = items.nth(0);
  const firstTicker = first.locator('.innovation-track');
  await expect(first).not.toHaveAttribute('open', '');
  await expect(firstTicker).toBeHidden();

  await first.locator('summary').click();
  await expect(first).toHaveAttribute('open', '');
  await expect(firstTicker).toBeVisible();
  await expect(firstTicker).toContainText('1nv3nt10n 1n PrOc3ss');
  expect(await firstTicker.evaluate(element => getComputedStyle(element).animationName)).toBe('innovation-marquee');
  await expect(first).toContainText('не сообщает о текущем выполнении фоновой задачи');

  const width = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  expect(width.document).toBeLessThanOrEqual(width.viewport);
});

test('roadmap ticker respects reduced motion and leaves its message readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(LANDING_PATH, { waitUntil: 'domcontentloaded' });
  const item = page.locator('#roadmap details').nth(1);
  await item.locator('summary').click();
  const ticker = item.locator('.innovation-track');
  await expect(ticker).toBeVisible();
  expect(await ticker.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await expect(item.locator('.roadmap-disclaimer')).toContainText('Не означает');
});
