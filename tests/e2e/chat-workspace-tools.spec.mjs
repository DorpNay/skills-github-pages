import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';
const MODEL = 'alandi-huihui-qwen35-4b';
const API_KEY = 'e2e-local-gateway-key-not-a-secret-0123456789';

async function chooseSearchMode(page, mode) {
  await page.locator('#searchModeSummary').click();
  await page.locator(`[data-action="select-search-mode"][data-search-mode="${mode}"]`).click();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('e2e-cleaned') !== '1') {
      localStorage.clear();
      sessionStorage.setItem('e2e-cleaned', '1');
    }
  });
});

test('workspace tools run from chat while web search is off and stay in the current browser profile', async ({ page }) => {
  const payloads = [];
  await page.route('https://alandi.example.test/**', async route => {
    const request = route.request();
    const cors = {
      'access-control-allow-origin': request.headers().origin || 'https://dorpnay.github.io',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'authorization,content-type,cache-control,x-ai-cache-bypass',
      'access-control-expose-headers': 'X-AI-Cache',
      'access-control-max-age': '600'
    };
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors, body: '' });
    if (request.url().includes('/v1/models')) {
      return route.fulfill({ status: 200, headers: cors, contentType: 'application/json',
        body: JSON.stringify({ data: [{ id: MODEL, context_length: 4096 }] }) });
    }
    if (request.url().includes('/v1/chat/completions')) {
      const payload = request.postDataJSON();
      payloads.push(payload);
      const last = payload.messages[payload.messages.length - 1];
      if (last?.role === 'tool') {
        const toolResult = String(last.content || '');
        const content = toolResult.includes('Диаграмма подготовлена прямо в чате.')
          ? 'Диаграмма готова:\n\n```mermaid\nflowchart TD\n  A[Пользователь] --> B[aLandi Gateway]\n  B --> C[Модель]\n```'
          : 'Готово: действие выполнено в текущем профиле.';
        return route.fulfill({ status: 200, headers: { ...cors, 'x-ai-cache': 'MISS' },
          contentType: 'application/json', body: JSON.stringify({ id: 'workspace-tool-final', model: MODEL,
            choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }] }) });
      }
      const userText = [...payload.messages].reverse().find(message => message.role === 'user')?.content || '';
      let call;
      if (/создай проект/i.test(userText)) {
        call = { id: 'call-project-create', type: 'function', function: {
          name: 'project_create', arguments: JSON.stringify({ name: 'Chat Tool Project', instructions: 'Created by an explicit user request.' })
        }};
      } else if (/добавь заметку/i.test(userText)) {
        call = { id: 'call-project-note', type: 'function', function: {
          name: 'project_add_note', arguments: JSON.stringify({ note: 'First tool-driven project note.' })
        }};
      } else {
        call = { id: 'call-diagram-create', type: 'function', function: {
          name: 'diagram_create', arguments: JSON.stringify({ diagram_type: 'flowchart TD',
            mermaid_source: 'flowchart TD\n  A[Пользователь] --> B[aLandi Gateway]\n  B --> C[Модель]' })
        }};
      }
      return route.fulfill({ status: 200, headers: { ...cors, 'x-ai-cache': 'MISS' },
        contentType: 'application/json', body: JSON.stringify({ id: 'workspace-tool-call', model: MODEL,
          choices: [{ index: 0, message: { role: 'assistant', content: null, tool_calls: [call] }, finish_reason: 'tool_calls' }] }) });
    }
    return route.fulfill({ status: 404, headers: cors, contentType: 'application/json', body: '{}' });
  });

  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Настройки', exact: true }).click();
  await page.locator('#cloudBaseUrl').fill('https://alandi.example.test/v1');
  await page.locator('#cloudModel').fill(MODEL);
  await page.locator('#cloudApiKey').fill(API_KEY);
  await page.locator('[data-action="select-alandi-primary"]').click();
  await page.locator('[data-action="save-settings"]').click();
  await page.locator('[data-action="close-settings"]').click();
  await chooseSearchMode(page, 'offline');

  await page.locator('#userInput').fill('Создай проект Chat Tool Project.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('Готово: действие выполнено в текущем профиле.', { timeout: 15000 });
  await expect.poll(() => page.evaluate(() => {
    const projects = JSON.parse(localStorage.getItem('ai_projects_v1') || '[]');
    return projects.some(project => project.name === 'Chat Tool Project');
  })).toBe(true);
  const projectToolRequest = payloads.find(payload => payload.tools?.some(tool => tool.function?.name === 'project_create'));
  expect(projectToolRequest).toBeTruthy();
  expect(projectToolRequest.tools.some(tool => tool.function?.name === 'web_search')).toBe(false);

  await page.locator('#userInput').fill('Добавь заметку в память текущего проекта: First tool-driven project note.');
  await page.locator('#sendBtn').click();
  await expect.poll(() => page.evaluate(() => {
    const projects = JSON.parse(localStorage.getItem('ai_projects_v1') || '[]');
    return projects.find(project => project.name === 'Chat Tool Project')?.memory?.some(note => note.text === 'First tool-driven project note.') || false;
  })).toBe(true);

  await page.locator('#userInput').fill('Создай диаграмму потока запроса прямо в чате.');
  await page.locator('#sendBtn').click();
  await expect(page.locator('#chatBox')).toContainText('flowchart TD', { timeout: 15000 });
  const diagramToolRequest = payloads.find(payload => payload.tools?.some(tool => tool.function?.name === 'diagram_create'));
  expect(diagramToolRequest).toBeTruthy();
  expect(diagramToolRequest.tools.some(tool => tool.function?.name === 'web_search')).toBe(false);
  expect(payloads.some(payload => payload.messages?.some(message =>
    message.role === 'tool' && String(message.content || '').includes('Диаграмма подготовлена прямо в чате.')))).toBe(true);
});
