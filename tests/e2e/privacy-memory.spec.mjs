import { test, expect } from '@playwright/test';

test('explicit remember commands stay in browser memory stores and do not call a provider', async ({ page }) => {
  const modelRequests = [];
  page.on('request', request => {
    if (/\/v1\/chat\/completions|generativelanguage\.googleapis\.com|api\.groq\.com|openrouter\.ai|api\.x\.ai|api\.kilo\.ai/i.test(request.url())) {
      modelRequests.push(request.url());
    }
  });

  await page.goto('/');
  await expect(page.locator('#userInput')).toBeEditable();
  await page.waitForFunction(async () => (await indexedDB.databases()).some(item => item.name === 'AI_Agent_DB_v87' && item.version === 2));

  await page.locator('#userInput').fill('Запомни: тестовый личный факт только для локального aLandi');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Сохранил указанный факт в личную память локальной модели');
  await expect(page.locator('#chatBox')).not.toContainText('тестовый личный факт только для локального aLandi');

  await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const read = name => new Promise((resolve, reject) => {
      const request = db.transaction(name, 'readonly').objectStore(name).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const result = { privateFacts: await read('memory'), sharedFacts: await read('sharedMemory') };
    db.close();
    return result;
  }).then(result => {
    expect(result.privateFacts.some(item => item.fact === 'тестовый личный факт только для локального aLandi')).toBeTruthy();
    expect(result.sharedFacts).toHaveLength(0);
  });

  expect(modelRequests, 'Remember commands must be handled before any provider request').toEqual([]);
});

test('explicit shared-memory command requires confirmation and uses a separate store', async ({ page }) => {
  const modelRequests = [];
  page.on('request', request => {
    if (/\/v1\/chat\/completions|generativelanguage\.googleapis\.com|api\.groq\.com|openrouter\.ai|api\.x\.ai|api\.kilo\.ai/i.test(request.url())) {
      modelRequests.push(request.url());
    }
  });
  page.on('dialog', dialog => dialog.accept());

  await page.goto('/');
  await page.waitForFunction(async () => (await indexedDB.databases()).some(item => item.name === 'AI_Agent_DB_v87' && item.version === 2));
  await page.locator('#userInput').fill('Сохрани в общую память: синтетический общий факт для теста');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Сохранил указанный факт в общую память');
  await expect(page.locator('#chatBox')).not.toContainText('синтетический общий факт для теста');

  const stores = await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const read = name => new Promise((resolve, reject) => {
      const request = db.transaction(name, 'readonly').objectStore(name).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const result = { privateFacts: await read('memory'), sharedFacts: await read('sharedMemory') };
    db.close();
    return result;
  });

  expect(stores.sharedFacts.some(item => item.fact === 'синтетический общий факт для теста')).toBeTruthy();
  expect(stores.privateFacts.some(item => item.fact === 'синтетический общий факт для теста')).toBeFalsy();
  expect(modelRequests, 'Shared-memory commands must be handled before any provider request').toEqual([]);
});

test('a chat marked private cannot be sent to an external provider after reload', async ({ page }) => {
  const modelRequests = [];
  page.on('request', request => {
    if (/\/v1\/chat\/completions|generativelanguage\.googleapis\.com|api\.groq\.com|openrouter\.ai|api\.x\.ai|api\.kilo\.ai/i.test(request.url())) {
      modelRequests.push(request.url());
    }
  });

  await page.goto('/');
  await page.waitForFunction(async () => (await indexedDB.databases()).some(item => item.name === 'AI_Agent_DB_v87' && item.version === 2));
  await page.locator('#userInput').fill('Запомни: приватный тестовый маркер чата');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Сохранил указанный факт в личную память локальной модели');

  await page.evaluate(() => {
    localStorage.setItem('ai_api_provider', 'gemini');
    localStorage.setItem('ai_cross_provider_fallback', 'true');
  });
  await page.reload();
  await page.waitForFunction(async () => (await indexedDB.databases()).some(item => item.name === 'AI_Agent_DB_v87' && item.version === 2));
  await page.locator('#userInput').fill('Проверь приватность этого чата');
  await page.locator('#sendBtn').click();

  await expect(page.locator('body')).toContainText('Сторонние провайдеры заблокированы для этого чата');
  await expect(page.locator('#chatBox')).not.toContainText('Проверь приватность этого чата');
  expect(modelRequests, 'A private chat must be blocked before any third-party model request').toEqual([]);
});


test('upgrading an existing v1 database preserves private facts and leaves shared memory empty', async ({ page }) => {
  // Seed the old schema on the same origin without loading the app, then let v2 upgrade it.
  await page.route('**/', route => route.fulfill({
    status: 200,
    contentType: 'text/html; charset=utf-8',
    body: '<!doctype html><html><head><title>IndexedDB seed</title></head><body>seed</body></html>'
  }));
  await page.goto('/');
  await page.evaluate(async () => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('memory');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('memory', 'readwrite');
      transaction.objectStore('memory').put({
        id: 'legacy-private-fact',
        fact: 'legacy private fact stays private',
        time: 1,
        scope: 'private'
      }, 'legacy-private-fact');
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error || new Error('Seed transaction aborted'));
    });
    database.close();
  });

  await page.unroute('**/');
  await page.goto('/');
  await page.waitForFunction(async () => (await indexedDB.databases())
    .some(item => item.name === 'AI_Agent_DB_v87' && item.version === 2));

  const stores = await page.evaluate(async () => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const read = name => new Promise((resolve, reject) => {
      const request = database.transaction(name, 'readonly').objectStore(name).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const result = {
      privateFacts: await read('memory'),
      sharedFacts: await read('sharedMemory')
    };
    database.close();
    return result;
  });

  expect(stores.privateFacts.some(item => item.fact === 'legacy private fact stays private')).toBeTruthy();
  expect(stores.sharedFacts).toHaveLength(0);
});
