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
