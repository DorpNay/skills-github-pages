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


test('canceling private-to-shared promotion keeps the fact private', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(async () => (await indexedDB.databases())
    .some(item => item.name === 'AI_Agent_DB_v87' && item.version === 2));

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
    const personalDetails = document.getElementById('personalMemoryDetails');
    if (projectDetails) projectDetails.open = true;
    if (memoryDetails) memoryDetails.open = true;
    if (personalDetails) personalDetails.open = true;
  });
  await expect(page.locator('#memoryBox')).toContainText('cancelled promotion stays private');
  await page.locator('#memoryBox .memory-item[data-memory-id="cancel-promotion"] > summary').click();

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

test('private-memory requests fail closed when the durable privacy marker cannot be saved', async ({ page }) => {
  const modelRequests = [];
  page.on('request', request => {
    if (/privacy-gateway\.test|\/v1\/chat\/completions|generativelanguage\.googleapis\.com|api\.groq\.com|openrouter\.ai|api\.x\.ai|api\.kilo\.ai/i.test(request.url())) {
      modelRequests.push(request.url());
    }
  });

  await page.addInitScript(() => {
    localStorage.setItem('ai_ui_language_v1', 'en');
    localStorage.setItem('ai_api_provider', 'alandi');
    localStorage.setItem('ai_base_url', 'https://privacy-gateway.test');
  });
  await page.goto('/');
  await page.waitForFunction(async () => (await indexedDB.databases())
    .some(item => item.name === 'AI_Agent_DB_v87' && item.version === 2));

  await page.evaluate(async () => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('memory', 'readwrite');
      transaction.objectStore('memory').put({
        id: 'privacy-marker-sentinel',
        fact: 'privacy marker sentinel private memory test fact',
        time: Date.now(),
        scope: 'private'
      }, 'privacy-marker-sentinel');
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error || new Error('Seed transaction aborted'));
    });
    database.close();
  });

  await page.evaluate(() => {
    const nativeSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'ai_chats_v87') {
        const storedChats = JSON.parse(String(value));
        if (storedChats.some(chat => chat?.privateMemoryUsed === true)) {
          throw new DOMException('Synthetic quota failure', 'QuotaExceededError');
        }
      }
      return nativeSetItem.call(this, key, value);
    };
  });

  await page.locator('#userInput').fill('Please explain the privacy marker sentinel.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText(
    'Personal-memory privacy could not be saved. No model request was sent.'
  );

  expect(modelRequests, 'Private context must not reach any model when its privacy marker is not durable').toEqual([]);
  const markerState = await page.evaluate(() => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    return chats.find(chat => chat.id === localStorage.getItem('ai_current_chat_v87'))?.privateMemoryUsed;
  });
  expect(markerState).toBeFalsy();
});

test('private chat provider-block feedback follows the English locale', async ({ page }) => {
  const modelRequests = [];
  page.on('request', request => {
    if (/\/v1\/chat\/completions|generativelanguage\.googleapis\.com|api\.groq\.com|openrouter\.ai|api\.x\.ai|api\.kilo\.ai/i.test(request.url())) {
      modelRequests.push(request.url());
    }
  });

  await page.addInitScript(() => {
    localStorage.setItem('ai_ui_language_v1', 'en');
    localStorage.setItem('ai_api_provider', 'gemini');
    localStorage.setItem('ai_chats_v87', JSON.stringify([{
      id: 'private-english-chat',
      title: 'Private chat',
      messages: [],
      projectId: null,
      projectMemoryEnabled: false,
      privateMemoryUsed: true,
      executionMode: 'direct'
    }]));
    localStorage.setItem('ai_current_chat_v87', 'private-english-chat');
  });

  await page.goto('/');
  const draft = 'Check the privacy boundary for this chat.';
  await page.locator('#userInput').fill(draft);
  await page.locator('#sendBtn').click();

  await expect(page.locator('body')).toContainText(
    'Third-party providers are blocked for this chat to protect its history.'
  );
  await expect(page.locator('#chatBox')).not.toContainText(draft);
  await expect(page.locator('#userInput')).toHaveValue(draft);
  expect(modelRequests, 'A private chat must be blocked before any external model request').toEqual([]);
});
