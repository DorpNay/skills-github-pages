#!/usr/bin/env node
/**
 * Fast JavaScript/DOM interaction smoke using Lightpanda.
 * This deliberately does not claim CSS layout or pixel-rendering coverage.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { lightpanda } from '@lightpanda/browser';

const host = '127.0.0.1';
const port = 9222;
const baseURL = process.env.APP_URL || 'http://127.0.0.1:4173/';
let server;
let browser;

try {
  server = await lightpanda.serve({ host, port });
  browser = await chromium.connectOverCDP(`http://${host}:${port}`);
  const context = browser.contexts()[0] || await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(8000);

  const response = await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  assert.ok(response?.ok(), `App shell did not load: HTTP ${response?.status()}`);

  for (const selector of ['#chatBox', '#userInput', '#sendBtn', '#functionsMenu', '#functionPanelModal']) {
    assert.equal(await page.locator(selector).count(), 1, `Missing app control: ${selector}`);
  }

  const sidebar = page.locator('#sidebar');
  const sidebarToggle = page.locator('#appSidebarToggle');
  assert.equal(await sidebar.getAttribute('role'), 'navigation');
  assert.equal(await sidebar.getAttribute('aria-label'), 'Проекты и чаты');
  assert.equal(await sidebarToggle.getAttribute('aria-controls'), 'sidebar');
  assert.equal(await sidebarToggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await sidebarToggle.getAttribute('aria-label'), 'Открыть меню');
  assert.equal(await sidebar.getAttribute('aria-hidden'), 'true');
  assert.notEqual(await sidebar.getAttribute('inert'), null);
  await sidebarToggle.click();
  assert.equal(await sidebarToggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await sidebarToggle.getAttribute('aria-label'), 'Закрыть меню');
  assert.equal(await sidebar.getAttribute('aria-hidden'), null);
  assert.equal(await sidebar.getAttribute('inert'), null);
  assert.equal(await page.evaluate(() => document.activeElement?.dataset.action), 'close-sidebar');
  await page.locator('[data-action="close-sidebar"]').click();
  assert.equal(await sidebarToggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await sidebarToggle.getAttribute('aria-label'), 'Открыть меню');
  assert.notEqual(await sidebar.getAttribute('inert'), null);
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'appSidebarToggle');
  await page.locator('#uiLanguage').selectOption('en');
  assert.equal(await sidebar.getAttribute('aria-label'), 'Projects and chats');
  assert.equal(await sidebarToggle.getAttribute('aria-label'), 'Open navigation');
  await page.locator('#uiLanguage').selectOption('ru');

  await page.locator('#functionsMenu > summary').click();
  await page.locator('[data-action="open-function-panel"][data-function="skills"]').click();
  await page.waitForFunction(() => {
    const panel = document.getElementById('functionPanelModal');
    return panel && !panel.classList.contains('hidden');
  });

  await page.locator('#skillPresetSelect').selectOption('custom');
  await page.waitForFunction(() => {
    const fields = document.getElementById('skillCustomFields');
    return fields && !fields.classList.contains('hidden');
  });

  for (const id of ['customSkillName', 'customSkillInstructions', 'customSkillOutput']) {
    const field = page.locator('#' + id);
    const placeholder = await field.getAttribute('placeholder');
    assert.ok(placeholder, `Missing localized placeholder on #${id}`);
    assert.equal(await field.getAttribute('aria-label'), placeholder, `Accessible name does not match the localized label on #${id}`);
  }

  await page.locator('#functionPanelModal .function-panel-close').click();
  await page.locator('#functionsMenu > summary').click();
  await page.locator('[data-action="open-function-panel"][data-function="agents"]').click();
  await page.locator('#agentTeamScenario').selectOption('custom');
  await page.waitForFunction(() => {
    const fields = document.getElementById('agentCustomFields');
    return fields && !fields.classList.contains('hidden');
  });
  for (const id of ['agentTeamCustomScenario', 'agentCustomRoles']) {
    assert.equal(await page.locator('#' + id).getAttribute('aria-label'), await page.locator('#' + id).getAttribute('placeholder'), `Russian accessible name mismatch on #${id}`);
  }

  await page.locator('#functionPanelModal .function-panel-close').click();
  await page.locator('#uiLanguage').selectOption('en');
  await page.locator('#functionsMenu > summary').click();
  await page.locator('[data-action="open-function-panel"][data-function="skills"]').click();
  await page.locator('#skillPresetSelect').selectOption('custom');
  for (const [id, expected] of [
    ['customSkillName', 'Custom skill name'],
    ['customSkillInstructions', 'Instructions for this task'],
    ['customSkillOutput', 'Custom output format (optional)']
  ]) {
    assert.equal(await page.locator('#' + id).getAttribute('aria-label'), expected, `English accessible name mismatch on #${id}`);
  }

  await page.locator('#functionPanelModal .function-panel-close').click();
  await page.locator('#functionsMenu > summary').click();
  await page.locator('[data-action="open-function-panel"][data-function="agents"]').click();
  await page.locator('#agentTeamScenario').selectOption('custom');
  await page.waitForFunction(() => {
    const fields = document.getElementById('agentCustomFields');
    return fields && !fields.classList.contains('hidden');
  });
  for (const [id, expected] of [
    ['agentTeamCustomScenario', 'Describe the team scenario'],
    ['agentCustomRoles', 'Roles and responsibilities, one per line']
  ]) {
    assert.equal(await page.locator('#' + id).getAttribute('aria-label'), expected, `English accessible name mismatch on #${id}`);
  }

  console.log('PASS Lightpanda: app shell, Functions → Skills/Agents interactions, custom fields, RU/EN accessible names.');
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) {
    server.stdout?.destroy();
    server.stderr?.destroy();
    server.kill();
  }
}
