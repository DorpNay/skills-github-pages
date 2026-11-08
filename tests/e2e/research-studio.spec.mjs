import { test, expect } from '@playwright/test';

const APP_PATH = process.env.LIVE_SITE_URL ? './' : '/';

test('retired Research Studio stays absent while owner-approved Functions drawer exposes real sections', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#researchStudioModal')).toHaveCount(0);
  await expect(page.locator('[data-action="open-research-studio"]')).toHaveCount(0);

  const trigger=page.locator('#functionsMenuSummary'),drawer=page.locator('#functionPanelModal');
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(drawer).toBeVisible();
  await expect(drawer.locator('#functionsDrawerNav [data-function]')).toHaveCount(4);
  for(const [kind,label] of [['agents','Агенты'],['research','Исследования'],['notebook','Notebook'],['skills','Скиллы']]){
    const section=drawer.locator('#functionsDrawerNav [data-function="'+kind+'"]');
    await expect(section).toBeVisible();
    await expect(section).toContainText(label);
  }
  await expect(drawer.locator('#functionsDrawerNav [data-function="connectors"]')).toHaveCount(0);
  await drawer.locator('[data-action="close-function-panel"]').first().click();
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Functions drawer opens Agents, Skills and Research controls without sending a message', async ({ page }) => {
  await page.goto(APP_PATH, { waitUntil: 'domcontentloaded' });
  const trigger=page.locator('#functionsMenuSummary'),drawer=page.locator('#functionPanelModal'),nav=drawer.locator('#functionsDrawerNav');

  await trigger.click();
  await expect(drawer).toBeVisible();
  await expect(page.locator('#agentFunctionSettings')).toBeVisible();
  await drawer.locator('[data-function="agents"]').click();
  await expect(page.locator('#agentFunctionSettings')).toBeVisible();
  await drawer.locator('[data-action="close-function-panel"]').first().click();
  await expect(drawer).toBeHidden();

  await trigger.click();
  await nav.locator('[data-function="skills"]').click();
  await expect(drawer).toBeVisible();
  await expect(page.locator('#skillFunctionSettings')).toBeVisible();
  await expect(page.locator('#agentFunctionSettings')).toBeHidden();
  await drawer.locator('[data-action="close-function-panel"]').first().click();
  await expect(drawer).toBeHidden();

  await trigger.click();
  await nav.locator('[data-function="research"]').click();
  const researchPanel=page.locator('#researchFunctionSettings');
  await expect(drawer).toBeVisible();
  await expect(researchPanel).toBeVisible();
  await researchPanel.locator('[data-action="select-processing-mode"][data-processing-mode="deep"]').click();
  await expect(page.locator('#modeDeep')).toHaveAttribute('aria-pressed','true');
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('ai_processing_mode'))).toBe('deep');
  await expect(page.locator('#chatBox .message')).toHaveCount(0);
});
