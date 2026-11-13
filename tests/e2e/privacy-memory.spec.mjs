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
  await page.waitForFunction(async () => (await indexedDB.databases()).some(item => item.name === 'AI_Agent_DB_v87' && item.version === 3));

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
  await page.waitForFunction(async () => (await indexedDB.databases()).some(item => item.name === 'AI_Agent_DB_v87' && item.version === 3));
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
  await page.waitForFunction(async () => (await indexedDB.databases()).some(item => item.name === 'AI_Agent_DB_v87' && item.version === 3));
  await page.locator('#userInput').fill('Запомни: приватный тестовый маркер чата');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Сохранил указанный факт в личную память локальной модели');

  await page.evaluate(() => {
    localStorage.setItem('ai_api_provider', 'gemini');
    localStorage.setItem('ai_cross_provider_fallback', 'true');
  });
  await page.reload();
  await page.waitForFunction(async () => (await indexedDB.databases()).some(item => item.name === 'AI_Agent_DB_v87' && item.version === 3));
  await page.locator('#userInput').fill('Проверь приватность этого чата');
  await page.locator('#sendBtn').click();

  await expect(page.locator('body')).toContainText('Сторонние провайдеры заблокированы для этого чата');
  await expect(page.locator('#chatBox')).not.toContainText('Проверь приватность этого чата');
  expect(modelRequests, 'A private chat must be blocked before any third-party model request').toEqual([]);
});


test('upgrading an existing v1 database preserves private facts and leaves shared memory empty', async ({ page }) => {
  // Seed the v1 private-memory schema without loading the app, then let the current v3 app upgrade it.
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
    .some(item => item.name === 'AI_Agent_DB_v87' && item.version === 3));

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


test('upgrading an existing v2 database preserves cache, private and shared records', async ({ page }) => {
  await page.route('**/', route => route.fulfill({
    status: 200,
    contentType: 'text/html; charset=utf-8',
    body: '<!doctype html><html><head><title>IndexedDB v2 seed</title></head><body>seed</body></html>'
  }));
  await page.goto('/');
  await page.evaluate(async () => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87', 2);
      request.onupgradeneeded = () => {
        const db = request.result;
        for (const name of ['cache', 'memory', 'sharedMemory']) {
          if (!db.objectStoreNames.contains(name)) db.createObjectStore(name);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(['cache', 'memory', 'sharedMemory'], 'readwrite');
      transaction.objectStore('cache').put({value: 'v2-cache-survives'}, 'cache-sentinel');
      transaction.objectStore('memory').put({id: 'v2-private', fact: 'private survives', scope: 'private'}, 'v2-private');
      transaction.objectStore('sharedMemory').put({id: 'v2-shared', fact: 'shared survives', scope: 'shared'}, 'v2-shared');
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error || new Error('Seed transaction aborted'));
    });
    database.close();
  });

  await page.unroute('**/');
  await page.goto('/');
  await page.waitForFunction(async () => (await indexedDB.databases())
    .some(item => item.name === 'AI_Agent_DB_v87' && item.version === 3));

  const data = await page.evaluate(async () => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const read = (store, key) => new Promise((resolve, reject) => {
      const request = database.transaction(store, 'readonly').objectStore(store).get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const result = {
      cache: await read('cache', 'cache-sentinel'),
      privateFact: await read('memory', 'v2-private'),
      sharedFact: await read('sharedMemory', 'v2-shared'),
      stores: Array.from(database.objectStoreNames)
    };
    database.close();
    return result;
  });

  expect(data.cache?.value).toBe('v2-cache-survives');
  expect(data.privateFact?.fact).toBe('private survives');
  expect(data.sharedFact?.fact).toBe('shared survives');
  expect(data.stores).toContain('notebooks');
  expect(data.stores).toContain('notebookEntries');
});

test('canceling private-to-shared promotion keeps the fact private', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(async () => (await indexedDB.databases())
    .some(item => item.name === 'AI_Agent_DB_v87' && item.version === 3));

  await page.evaluate(async () => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('memory', 'readwrite');
      transaction.objectStore('memory').put({
        id: 'cancel-promotion',
        fact: 'cancelled promotion stays private',
        time: Date.now(),
        scope: 'private'
      }, 'cancel-promotion');
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error || new Error('Seed transaction aborted'));
    });
    database.close();
  });
  await page.reload();

  await page.evaluate(() => {
    document.getElementById('sidebar')?.classList.remove('-translate-x-full');
    const projectDetails = document.getElementById('projectManagerDetails');
    const memoryDetails = document.getElementById('memoryToolsDetails');
    if (projectDetails) projectDetails.open = true;
    if (memoryDetails) memoryDetails.open = true;
  });
  await expect(page.locator('#memoryBox')).toContainText('cancelled promotion stays private');

  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('[data-action="promote-memory"][data-memory-id="cancel-promotion"]').click();
  await expect(page.locator('#sharedMemoryBox')).toContainText('Нет общих заметок.');

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
    const result = { privateFacts: await read('memory'), sharedFacts: await read('sharedMemory') };
    database.close();
    return result;
  });
  expect(stores.privateFacts.some(item => item.fact === 'cancelled promotion stays private')).toBeTruthy();
  expect(stores.sharedFacts).toHaveLength(0);
});
