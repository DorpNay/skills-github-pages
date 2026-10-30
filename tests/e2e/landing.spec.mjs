import { test, expect } from '@playwright/test';

const LANDING_PATH = process.env.LIVE_SITE_URL
  ? new URL('landing/', process.env.LIVE_SITE_URL.replace(/\/?$/, '/')).toString()
  : '/landing/';

test('V1 landing has accurate metadata, working CTAs and honest product boundaries', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(LANDING_PATH, { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle(/aLandi.*собственным gateway/i);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText('Сохраняй контроль над средой');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /бесплатная|AI-среда|gateway/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://dorpnay.github.io/skills-github-pages/landing/'
  );

  await expect(page.getByRole('link', { name: /Открыть рабочую среду/ })).toHaveAttribute(
    'href',
    'https://dorpnay.github.io/skills-github-pages/'
  );
  await expect(page.getByRole('link', { name: /Пошаговый запуск/ })).toHaveAttribute(
    'href',
    /docs\/START_HERE_RU\.md$/
  );
  await expect(page.locator('.hero .note')).toContainText('бесплатная статическая страница');
  await expect(page.locator('.hero .note')).toContainText('публичный hosted AI endpoint этим сайтом не предоставляется');
  await expect(page.locator('#stack')).toContainText('Это целевая схема развёртывания');
  await expect(page.locator('#capabilities')).toContainText('Голосовой интерфейс');
  await expect(page.locator('#readiness')).toContainText('обязательная часть первого функционального обновления');
  await expect(page.locator('#capabilities')).toContainText('транскрипция речи с редактированием');
  await expect(page.locator('#capabilities')).toContainText('чтение выделенного текста');
  await expect(page.locator('#capabilities')).toContainText('очереди выбранных сообщений');
  await expect(page.locator('#roadmap')).toContainText('эхоподавление');
  await expect(page.locator('#readiness')).toContainText('а не на открытый многопользовательский SaaS');
  await expect(page.locator('nav a[href="#roadmap"]')).toBeVisible();
  await expect(page.locator('footer')).toContainText('Реестр финализации UI');

  const metadata = await page.evaluate(() => ({
    scripts: document.scripts.length,
    emptyLinks: [...document.querySelectorAll('a')].filter(link => !link.getAttribute('href')?.trim()).length,
    canonical: document.querySelector('link[rel="canonical"]')?.href
  }));
  expect(metadata.scripts).toBe(0);
  expect(metadata.emptyLinks).toBe(0);
  expect(metadata.canonical).toBe('https://dorpnay.github.io/skills-github-pages/landing/');
});

test('landing has no horizontal overflow at common mobile, tablet and desktop widths', async ({ page }) => {
  await page.goto(LANDING_PATH, { waitUntil: 'domcontentloaded' });

  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth
    }));
    expect(dimensions.document, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
  }
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

test('landing roadmap tickers can be paused and resumed without JavaScript', async ({ page }) => {
  await page.goto(LANDING_PATH, { waitUntil: 'domcontentloaded' });
  const item = page.locator('#roadmap details').first();
  await item.locator('summary').click();

  const ticker = item.locator('.innovation-track');
  const pause = item.locator('input.innovation-toggle');
  await expect(pause).toHaveAttribute('aria-label', 'Приостановить бегущую строку');
  await expect(item.locator('label.innovation-toggle-label')).toHaveText('Пауза');
  expect(await ticker.evaluate(element => getComputedStyle(element).animationPlayState)).toBe('running');

  await pause.check();
  expect(await ticker.evaluate(element => getComputedStyle(element).animationPlayState)).toBe('paused');
  await pause.uncheck();
  expect(await ticker.evaluate(element => getComputedStyle(element).animationPlayState)).toBe('running');
  expect(await page.locator('script').count()).toBe(0);
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
