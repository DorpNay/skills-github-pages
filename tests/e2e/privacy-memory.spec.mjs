import { test, expect } from '@playwright/test';

function isModelInferenceRequest(request) {
  if (request.method() !== 'POST') return false;
  const url = new URL(request.url());
  return /\/chat\/completions(?:\/|$)/i.test(url.pathname) && request.postData() !== null;
}

test('provider catalog discovery is not counted as model inference', async () => {
  const catalogGet = {
    method: () => 'GET',
    url: () => 'https://generativelanguage.googleapis.com/v1beta/models',
    postData: () => null
  };
  const inferencePost = {
    method: () => 'POST',
    url: () => 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    postData: () => '{"messages":[]}'
  };

  expect(isModelInferenceRequest(catalogGet)).toBe(false);
  expect(isModelInferenceRequest(inferencePost)).toBe(true);
});

test('explicit remember commands stay in browser memory stores and do not call a provider', async ({ page }) => {
  const modelRequests = [];
  page.on('request', request => {
    if (isModelInferenceRequest(request)) {
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
    if (isModelInferenceRequest(request)) {
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
    if (isModelInferenceRequest(request)) {
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
    if (isModelInferenceRequest(request)) {
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
    if (isModelInferenceRequest(request)) {
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

test('shared memory stays out of third-party requests unless global memory is enabled', async ({ page }) => {
  const outboundBodies = [];
  await page.addInitScript(() => {
    localStorage.setItem('ai_api_provider', 'gemini');
    localStorage.setItem('ai_api_key', 'synthetic-e2e-key');
    localStorage.setItem('ai_global_memory_enabled_v1', 'false');
  });
  await page.route(/https:\/\/generativelanguage\.googleapis\.com\/.*\/chat\/completions(?:\?.*)?$/i, async route => {
    outboundBodies.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Synthetic provider reply.' } }] })
    });
  });

  await page.goto('/');
  await page.waitForFunction(async () => (await indexedDB.databases())
    .some(item => item.name === 'AI_Agent_DB_v87' && item.version === 2));
  const sharedFact = 'secret shared memory sentinel omega';
  await page.evaluate(async fact => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('sharedMemory', 'readwrite');
      transaction.objectStore('sharedMemory').put({
        id: 'global-scope-sentinel',
        fact,
        time: Date.now(),
        scope: 'shared'
      }, 'global-scope-sentinel');
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error || new Error('Seed transaction aborted'));
    });
    database.close();
  }, sharedFact);

  await page.locator('#userInput').fill('Please explain sentinel omega.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Synthetic provider reply.');
  expect(outboundBodies).toHaveLength(1);
  expect(JSON.stringify(outboundBodies[0])).not.toContain(sharedFact);
});

test('explicitly enabled global memory is included only in the allowed third-party request scope', async ({ page }) => {
  const outboundBodies = [];
  await page.addInitScript(() => {
    localStorage.setItem('ai_api_provider', 'gemini');
    localStorage.setItem('ai_api_key', 'synthetic-e2e-key');
    localStorage.setItem('ai_global_memory_enabled_v1', 'true');
  });
  await page.route(/https:\/\/generativelanguage\.googleapis\.com\/.*\/chat\/completions(?:\?.*)?$/i, async route => {
    outboundBodies.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Synthetic provider reply.' } }] })
    });
  });

  await page.goto('/');
  await page.waitForFunction(async () => (await indexedDB.databases())
    .some(item => item.name === 'AI_Agent_DB_v87' && item.version === 2));
  const sharedFact = 'secret shared memory sentinel omega';
  await page.evaluate(async fact => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('sharedMemory', 'readwrite');
      transaction.objectStore('sharedMemory').put({
        id: 'global-scope-sentinel',
        fact,
        time: Date.now(),
        scope: 'shared'
      }, 'global-scope-sentinel');
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error || new Error('Seed transaction aborted'));
    });
    database.close();
  }, sharedFact);

  await page.locator('#userInput').fill('Please explain sentinel omega.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Synthetic provider reply.');
  expect(outboundBodies).toHaveLength(1);
  expect(JSON.stringify(outboundBodies[0])).toContain(sharedFact);
});

test('canceling an explicit shared-memory save leaves the input and stores unchanged', async ({ page }) => {
  let modelRequests = 0;
  page.on('request', request => {
    if (isModelInferenceRequest(request)) {
      modelRequests++;
    }
  });
  await page.goto('/');
  await page.waitForFunction(async () => (await indexedDB.databases())
    .some(item => item.name === 'AI_Agent_DB_v87' && item.version === 2));
  const draft = 'Сохрани в общую память: отменённый синтетический факт';
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('#userInput').fill(draft);
  await page.locator('#sendBtn').click();

  const sharedFacts = await page.evaluate(async () => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const result = await new Promise((resolve, reject) => {
      const request = database.transaction('sharedMemory', 'readonly').objectStore('sharedMemory').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    database.close();
    return result;
  });
  expect(sharedFacts).toHaveLength(0);
  await expect(page.locator('#userInput')).toHaveValue(draft);
  await expect(page.locator('#chatBox')).not.toContainText('отменённый синтетический факт');
  expect(modelRequests).toBe(0);
});

test('canceling external project-context disclosure preserves the draft and sends no request', async ({ page }) => {
  const modelRequests = [];
  let disclosureMessage = '';
  page.on('request', request => {
    if (isModelInferenceRequest(request)) {
      modelRequests.push(request.url());
    }
  });
  await page.addInitScript(() => {
    localStorage.setItem('ai_api_provider', 'gemini');
    localStorage.setItem('ai_api_key', 'synthetic-e2e-key');
    localStorage.setItem('ai_projects_v1', JSON.stringify([{
      id: 'external-project-consent',
      name: 'Privacy Project',
      instructions: 'private project instruction sentinel',
      memoryScope: 'project-only',
      memory: [{ id: 'project-memory-sentinel', text: 'private project memory sentinel' }]
    }]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([{
      id: 'external-project-chat',
      title: 'Privacy Project chat',
      messages: [],
      projectId: 'external-project-consent',
      projectMemoryEnabled: true,
      privateMemoryUsed: false,
      executionMode: 'direct',
      processingMode: 'fast',
      searchMode: 'offline',
      deepResearchMethod: 'none',
      multiAgentEnabled: false
    }]));
    localStorage.setItem('ai_current_chat_v87', 'external-project-chat');
  });

  await page.goto('/');
  const draft = 'Use the project context for this request.';
  await page.locator('#userInput').fill(draft);
  page.once('dialog', async dialog => {
    disclosureMessage = dialog.message();
    await dialog.dismiss();
  });
  await page.locator('#sendBtn').click();

  expect(disclosureMessage).toContain('Privacy Project');
  expect(disclosureMessage).toContain('Google AI Studio');
  expect(disclosureMessage).toContain('outside the aLandi Gateway');
  await expect(page.locator('#userInput')).toHaveValue(draft);
  await expect(page.locator('#chatBox')).not.toContainText(draft);
  const storedChat = await page.evaluate(() => {
    const chats = JSON.parse(localStorage.getItem('ai_chats_v87') || '[]');
    return chats.find(chat => chat.id === 'external-project-chat');
  });
  expect(storedChat.messages).toHaveLength(0);
  expect(storedChat.projectMemoryEnabled).toBeTruthy();
  expect(modelRequests, 'Canceling project-context disclosure must prevent provider requests').toEqual([]);
});

test('accepting external project-context disclosure sends the named project context', async ({ page }) => {
  const outboundBodies = [];
  const disclosureMessages = [];
  await page.addInitScript(() => {
    localStorage.setItem('ai_api_provider', 'gemini');
    localStorage.setItem('ai_api_key', 'synthetic-e2e-key');
    localStorage.setItem('ai_projects_v1', JSON.stringify([{
      id: 'external-project-consent',
      name: 'Privacy Project',
      instructions: 'private project instruction sentinel',
      memoryScope: 'project-only',
      memory: [{ id: 'project-memory-sentinel', text: 'private project memory sentinel' }]
    }]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([{
      id: 'external-project-chat',
      title: 'Privacy Project chat',
      messages: [],
      projectId: 'external-project-consent',
      projectMemoryEnabled: true,
      privateMemoryUsed: false,
      executionMode: 'direct',
      processingMode: 'fast',
      searchMode: 'offline',
      deepResearchMethod: 'none',
      multiAgentEnabled: false
    }]));
    localStorage.setItem('ai_current_chat_v87', 'external-project-chat');
  });
  await page.route(/https:\/\/generativelanguage\.googleapis\.com\/.*\/chat\/completions(?:\?.*)?$/i, async route => {
    outboundBodies.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Synthetic provider reply.' } }] })
    });
  });
  page.once('dialog', async dialog => {
    disclosureMessages.push(dialog.message());
    await dialog.accept();
  });

  await page.goto('/');
  await page.locator('#userInput').fill('Use the project context for this request.');
  await page.locator('#sendBtn').click();

  await expect(page.locator('#chatBox')).toContainText('Synthetic provider reply.');
  expect(disclosureMessages).toHaveLength(1);
  expect(disclosureMessages[0]).toContain('Privacy Project');
  expect(outboundBodies).toHaveLength(1);
  const body = JSON.stringify(outboundBodies[0]);
  expect(body).toContain('private project instruction sentinel');
  expect(body).toContain('private project memory sentinel');
});

test('project-only scope blocks shared-memory facts even when global memory is enabled', async ({ page }) => {
  const outboundBodies = [];
  await page.addInitScript(() => {
    localStorage.setItem('ai_api_provider', 'gemini');
    localStorage.setItem('ai_api_key', 'synthetic-e2e-key');
    localStorage.setItem('ai_global_memory_enabled_v1', 'true');
    localStorage.setItem('ai_projects_v1', JSON.stringify([{
      id: 'project-only-scope',
      name: 'Project-only scope',
      instructions: '',
      memoryScope: 'project-only',
      memory: []
    }]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([{
      id: 'project-only-scope-chat',
      title: 'Project-only scope chat',
      messages: [],
      projectId: 'project-only-scope',
      projectMemoryEnabled: false,
      privateMemoryUsed: false,
      executionMode: 'direct',
      processingMode: 'fast',
      searchMode: 'offline',
      deepResearchMethod: 'none'
    }]));
    localStorage.setItem('ai_current_chat_v87', 'project-only-scope-chat');
  });
  await page.route(/https:\/\/generativelanguage\.googleapis\.com\/.*\/chat\/completions/, async route => {
    outboundBodies.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Synthetic provider reply.' } }] })
    });
  });

  await page.goto('/');
  await page.waitForFunction(async () => (await indexedDB.databases())
    .some(item => item.name === 'AI_Agent_DB_v87' && item.version === 2));
  const sharedFact = 'secret scope sentinel omega global fact';
  await page.evaluate(async fact => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('sharedMemory', 'readwrite');
      transaction.objectStore('sharedMemory').put({
        id: 'scope-shared-fact',
        fact,
        time: Date.now(),
        scope: 'shared'
      }, 'scope-shared-fact');
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error || new Error('Seed transaction aborted'));
    });
    database.close();
  }, sharedFact);

  await page.locator('#userInput').fill('Explain scope sentinel omega.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Synthetic provider reply.');
  expect(outboundBodies).toHaveLength(1);
  expect(JSON.stringify(outboundBodies[0])).not.toContain(sharedFact);
});

test('project-and-global scope includes shared facts only when explicit global opt-in is enabled', async ({ page }) => {
  const outboundBodies = [];
  await page.addInitScript(() => {
    localStorage.setItem('ai_api_provider', 'gemini');
    localStorage.setItem('ai_api_key', 'synthetic-e2e-key');
    localStorage.setItem('ai_global_memory_enabled_v1', 'false');
    localStorage.setItem('ai_projects_v1', JSON.stringify([{
      id: 'project-global-scope',
      name: 'Project and global scope',
      instructions: '',
      memoryScope: 'project-and-global',
      memory: []
    }]));
    localStorage.setItem('ai_chats_v87', JSON.stringify([{
      id: 'project-global-scope-chat',
      title: 'Project and global scope chat',
      messages: [],
      projectId: 'project-global-scope',
      projectMemoryEnabled: false,
      privateMemoryUsed: false,
      executionMode: 'direct',
      processingMode: 'fast',
      searchMode: 'offline',
      deepResearchMethod: 'none'
    }]));
    localStorage.setItem('ai_current_chat_v87', 'project-global-scope-chat');
  });
  await page.route(/https:\/\/generativelanguage\.googleapis\.com\/.*\/chat\/completions/, async route => {
    outboundBodies.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Synthetic provider reply.' } }] })
    });
  });

  await page.goto('/');
  await page.waitForFunction(async () => (await indexedDB.databases())
    .some(item => item.name === 'AI_Agent_DB_v87' && item.version === 2));
  const sharedFact = 'secret scope sentinel omega global fact';
  await page.evaluate(async fact => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('AI_Agent_DB_v87');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('sharedMemory', 'readwrite');
      transaction.objectStore('sharedMemory').put({
        id: 'scope-shared-fact',
        fact,
        time: Date.now(),
        scope: 'shared'
      }, 'scope-shared-fact');
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error || new Error('Seed transaction aborted'));
    });
    database.close();
  }, sharedFact);

  await page.locator('#userInput').fill('Explain scope sentinel omega.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Synthetic provider reply.');
  expect(outboundBodies).toHaveLength(1);
  expect(JSON.stringify(outboundBodies[0])).not.toContain(sharedFact);

  await page.evaluate(() => {
    localStorage.setItem('ai_global_memory_enabled_v1', 'true');
    localStorage.setItem('ai_chats_v87', JSON.stringify([{
      id: 'project-global-scope-chat',
      title: 'Project and global scope chat',
      messages: [],
      projectId: 'project-global-scope',
      projectMemoryEnabled: false,
      privateMemoryUsed: false,
      executionMode: 'direct',
      processingMode: 'fast',
      searchMode: 'offline',
      deepResearchMethod: 'none'
    }]));
  });
  await page.reload();
  await page.locator('#userInput').fill('Explain scope sentinel omega.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Synthetic provider reply.');
  expect(outboundBodies).toHaveLength(2);
  expect(JSON.stringify(outboundBodies[1])).toContain(sharedFact);
});
