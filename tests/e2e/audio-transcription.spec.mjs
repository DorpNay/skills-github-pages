import { test, expect } from '@playwright/test';

test('voice recording is sent to the configured gateway and transcript stays editable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) }
    });
    class FakeMediaRecorder extends EventTarget {
      constructor(_stream, options = {}) { super(); this.mimeType = options.mimeType || 'audio/webm'; this.state = 'inactive'; }
      static isTypeSupported() { return true; }
      start() { this.state = 'recording'; }
      stop() {
        this.state = 'inactive';
        const event = new Event('dataavailable');
        Object.defineProperty(event, 'data', { value: new Blob(['fake audio'], { type: 'audio/webm' }) });
        this.dispatchEvent(event);
        this.dispatchEvent(new Event('stop'));
      }
    }
    window.MediaRecorder = FakeMediaRecorder;
  });
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'e2e-model' }] })
  }));
  let receivedAudio = false;
  await page.route(/https:\/\/api\.example\.test\/v1\/audio\/transcriptions\?lang=auto$/, async route => {
    receivedAudio = route.request().headers()['content-type'] === 'audio/webm'
      && route.request().headers().authorization === 'Bearer ' + 'v'.repeat(64)
      && (await route.request().postDataBuffer())?.length > 0;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      headers: { 'Cache-Control': 'no-store' },
      body: JSON.stringify({ text: 'Локальная тестовая расшифровка', language: 'auto', provider: 'local-whisper.cpp' })
    });
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) {
    await page.locator('#legacyProviderSettings > summary').click();
  }
  await page.locator('#providerPreset').selectOption('alandi');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-model');
  await page.locator('#apiKey').fill('v'.repeat(64));
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#voiceMenu').evaluate(el => el.classList.remove('hidden'));
  await page.locator('[data-action="voice-message-preview"]').click();
  await expect(page.locator('#voiceRecordingPanel')).toBeVisible();
  await page.locator('[data-action="stop-voice-recording"]').click();
  await expect(page.locator('#userInput')).toHaveValue('Локальная тестовая расшифровка');
  expect(receivedAudio).toBe(true);
  await page.locator('#userInput').fill('Пользователь исправил расшифровку');
  await expect(page.locator('#userInput')).toHaveValue('Пользователь исправил расшифровку');
});


test('assistant message offers copy and local TTS controls with a mini-player', async ({ page }) => {
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'e2e-model' }] })
  }));
  await page.route('https://api.example.test/v1/chat/completions', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ model: 'e2e-model', choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'A local response to read aloud.' } }] })
  }));
  await page.route('https://api.example.test/v1/audio/speech', async route => {
    expect(route.request().headers().authorization).toBe('Bearer ' + 'w'.repeat(64));
    const wav = Buffer.from('524946462400000057415645' + '00'.repeat(32), 'hex');
    await route.fulfill({ status: 200, contentType: 'audio/wav', headers: { 'Cache-Control': 'no-store' }, body: wav });
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) {
    await page.locator('#legacyProviderSettings > summary').click();
  }
  await page.locator('#providerPreset').selectOption('alandi');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-model');
  await page.locator('#apiKey').fill('w'.repeat(64));
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Please answer so I can test the audio player.');
  await page.locator('#sendBtn').click();
  const assistant = page.locator('#chatBox .assistant-content').filter({ hasText: 'A local response to read aloud.' });
  await expect(assistant).toBeVisible();
  const copy = page.locator('#chatBox [data-action="copy-message"]').last();
  const speak = page.locator('#chatBox [data-action="speak-message"]').last();
  await expect(copy).toBeVisible();
  await expect(speak).toBeVisible();
  await speak.click();
  await expect(page.locator('#ttsMiniPlayer')).toBeVisible();
  await expect(page.locator('#ttsAudioPlayer')).toHaveAttribute('src', /^blob:/);
  await page.locator('#ttsMiniPlayer [data-action="stop-speech"]').click();
  await expect(page.locator('#ttsMiniPlayer')).toBeHidden();
});


test('stopping local TTS cancels generation and prevents late playback', async ({ page }) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input, init = {}) => {
      if (String(input).endsWith('/audio/speech')) {
        return new Promise((resolve, reject) => {
          const abort = () => reject(new DOMException('Aborted', 'AbortError'));
          if (init.signal?.aborted) abort();
          else init.signal?.addEventListener('abort', abort, { once: true });
        });
      }
      return originalFetch(input, init);
    };
  });
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'e2e-model' }] })
  }));
  await page.route('https://api.example.test/v1/chat/completions', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ model: 'e2e-model', choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'A response whose speech will be cancelled.' } }] })
  }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) {
    await page.locator('#legacyProviderSettings > summary').click();
  }
  await page.locator('#providerPreset').selectOption('alandi');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('e2e-model');
  await page.locator('#apiKey').fill('x'.repeat(64));
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#userInput').fill('Test cancellation.');
  await page.locator('#sendBtn').click();
  const assistant = page.locator('#chatBox .assistant-content').filter({ hasText: 'A response whose speech will be cancelled.' });
  await expect(assistant).toBeVisible();
  await page.locator('#chatBox [data-action="speak-message"]').last().click();
  await expect(page.locator('#ttsMiniPlayerStatus')).toContainText('Генерирую речь');
  await page.locator('#ttsMiniPlayer [data-action="stop-speech"]').click();
  await expect(page.locator('#ttsMiniPlayer')).toBeHidden();
  await expect(page.locator('#ttsAudioPlayer')).not.toHaveAttribute('src', /^blob:/);
  await expect(page.locator('#toast')).toBeHidden();
});


test('attached audio is transcribed locally before model submission', async ({ page }) => {
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'audio-attachment-model' }] })
  }));
  let receivedAudio = null;
  let submittedUserContent = '';
  await page.route('https://api.example.test/v1/capabilities', async route => {
    expect(route.request().headers().authorization).toBe('Bearer ' + 'a'.repeat(64));
    await route.fulfill({
      status: 200, contentType: 'application/json', headers: { 'Cache-Control': 'no-store' },
      body: JSON.stringify({ search: { searxng: false }, audio: { transcription: true, speech: false }, documents: { extraction: false } })
    });
  });
  await page.route('https://api.example.test/v1/audio/transcriptions?lang=auto', async route => {
    receivedAudio = {
      authorization: route.request().headers().authorization,
      contentType: route.request().headers()['content-type'],
      body: (await route.request().postDataBuffer()).toString()
    };
    await route.fulfill({
      status: 200, contentType: 'application/json', headers: { 'Cache-Control': 'no-store' },
      body: JSON.stringify({ text: 'Turn left at the next street.', language: 'en', provider: 'local-whisper.cpp' })
    });
  });
  await page.route('https://api.example.test/v1/chat/completions', async route => {
    const payload = route.request().postDataJSON();
    submittedUserContent = payload.messages.filter(message => message.role === 'user').map(message => message.content).join('\n');
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ model: 'audio-attachment-model', choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'Audio transcript received.' } }] })
    });
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) {
    await page.locator('#legacyProviderSettings > summary').click();
  }
  await page.locator('#providerPreset').selectOption('alandi');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('audio-attachment-model');
  await page.locator('#apiKey').fill('a'.repeat(64));
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#attachTextButton').click();
  await page.locator('[data-action="choose-any-file"]').click();
  await page.locator('#textAttachmentInput').setInputFiles({
    name: 'voice-note.webm', mimeType: 'audio/webm', buffer: Buffer.from('private audio fixture')
  });
  await expect(page.locator('#draftAttachments')).toContainText('voice-note.webm');
  await page.locator('#userInput').fill('Summarize this recording.');
  await page.locator('#sendBtn').click();

  await expect.poll(() => submittedUserContent).toContain('Turn left at the next street.');
  expect(receivedAudio).toEqual({
    authorization: 'Bearer ' + 'a'.repeat(64),
    contentType: 'audio/webm',
    body: 'private audio fixture'
  });
  expect(submittedUserContent).toContain('недоверенные справочные данные');
  expect(submittedUserContent).toContain('Summarize this recording.');
  expect(submittedUserContent).not.toContain('private audio fixture');
  await expect(page.locator('#chatBox')).toContainText('Audio transcript received.');
});

test('attached audio remains in the draft when local ASR is disabled', async ({ page }) => {
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'audio-disabled-model' }] })
  }));
  let chatSubmitted = false;
  await page.route('https://api.example.test/v1/capabilities', route => route.fulfill({
    status: 200, contentType: 'application/json', headers: { 'Cache-Control': 'no-store' },
    body: JSON.stringify({ audio: { transcription: false }, documents: { extraction: false }, search: { searxng: false } })
  }));
  await page.route('https://api.example.test/v1/chat/completions', route => {
    chatSubmitted = true;
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { role: 'assistant', content: 'Should not be reached.' } }] }) });
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) {
    await page.locator('#legacyProviderSettings > summary').click();
  }
  await page.locator('#providerPreset').selectOption('alandi');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('audio-disabled-model');
  await page.locator('#apiKey').fill('b'.repeat(64));
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#attachTextButton').click();
  await page.locator('[data-action="choose-any-file"]').click();
  await page.locator('#textAttachmentInput').setInputFiles({
    name: 'private.wav', mimeType: 'audio/wav', buffer: Buffer.from('private audio bytes')
  });
  await page.locator('#userInput').fill('Please transcribe this.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#toast')).toContainText('выключена');
  await expect(page.locator('#userInput')).toHaveValue('Please transcribe this.');
  await expect(page.locator('#draftAttachments')).toContainText('private.wav');
  expect(chatSubmitted).toBe(false);
});

test('local voice dialogue transcribes, sends, speaks, and listens for the next turn', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) }
    });
    class FakeMediaRecorder extends EventTarget {
      constructor(_stream, options = {}) { super(); this.mimeType = options.mimeType || 'audio/webm'; this.state = 'inactive'; }
      static isTypeSupported() { return true; }
      start() { this.state = 'recording'; }
      stop() {
        this.state = 'inactive';
        const event = new Event('dataavailable');
        Object.defineProperty(event, 'data', { value: new Blob(['spoken turn'], { type: 'audio/webm' }) });
        this.dispatchEvent(event);
        this.dispatchEvent(new Event('stop'));
      }
    }
    window.MediaRecorder = FakeMediaRecorder;
    HTMLMediaElement.prototype.play = function () {
      if (this.id === 'ttsAudioPlayer') setTimeout(() => this.dispatchEvent(new Event('ended')), 30);
      return Promise.resolve();
    };
  });
  await page.route('https://api.example.test/v1/models', route => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'voice-dialogue-model' }] })
  }));
  await page.route('https://api.example.test/v1/capabilities', route => route.fulfill({
    status: 200, contentType: 'application/json', headers: { 'Cache-Control': 'no-store' },
    body: JSON.stringify({ audio: { transcription: true, speech: true }, documents: { extraction: false }, search: { searxng: false } })
  }));
  let transcriptionCount = 0;
  let speechCount = 0;
  await page.route('https://api.example.test/v1/audio/transcriptions?lang=auto', async route => {
    transcriptionCount += 1;
    expect(route.request().headers().authorization).toBe('Bearer ' + 'c'.repeat(64));
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ text: 'Please tell me a short greeting.', language: 'en', provider: 'local-whisper.cpp' })
    });
  });
  await page.route('https://api.example.test/v1/chat/completions', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ model: 'voice-dialogue-model', choices: [{ finish_reason: 'stop', message: { role: 'assistant', content: 'Hello from the local voice dialogue.' } }] })
  }));
  await page.route('https://api.example.test/v1/audio/speech', async route => {
    speechCount += 1;
    expect(route.request().headers().authorization).toBe('Bearer ' + 'c'.repeat(64));
    const wav = Buffer.from('524946462400000057415645' + '00'.repeat(32), 'hex');
    await route.fulfill({ status: 200, contentType: 'audio/wav', headers: { 'Cache-Control': 'no-store' }, body: wav });
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  if (!(await page.locator('#legacyProviderSettings').evaluate(el => el.open))) {
    await page.locator('#legacyProviderSettings > summary').click();
  }
  await page.locator('#providerPreset').selectOption('alandi');
  await page.locator('#baseUrl').fill('https://api.example.test/v1');
  await page.locator('#modelName').fill('voice-dialogue-model');
  await page.locator('#apiKey').fill('c'.repeat(64));
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await page.locator('#voiceMenu').evaluate(el => el.classList.remove('hidden'));
  await page.locator('[data-action="voice-chat-preview"]').click();

  await expect(page.locator('#voiceRecordingPanel')).toBeVisible();
  await expect(page.locator('#voiceRecordingStatus')).toContainText('Запись');
  await page.locator('[data-action="stop-voice-recording"]').click();
  await expect(page.locator('#chatBox')).toContainText('Please tell me a short greeting.');
  await expect(page.locator('#chatBox')).toContainText('Hello from the local voice dialogue.');
  await expect.poll(() => transcriptionCount).toBe(1);
  await expect.poll(() => speechCount).toBe(1);
  await expect(page.locator('#voiceRecordingStatus')).toContainText('Запись');
  await expect(page.locator('#voiceRecordingPanel')).toBeVisible();

  await page.locator('[data-action="stop-voice-conversation"]').click();
  await expect(page.locator('#voiceRecordingPanel')).toBeHidden();
  await expect(page.locator('#ttsMiniPlayer')).toBeHidden();
});
