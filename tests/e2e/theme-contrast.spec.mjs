import { test, expect } from '@playwright/test';

function luminance(hex) {
  const raw = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) => parseInt(raw.slice(i, i + 2), 16) / 255);
  const linear = channels.map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('Graphite/Tiffany and Pearl/Teal theme roles meet readable contrast', async ({ page }) => {
  await page.goto('/');
  const themes = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const snapshot = (theme, mode = 'alandi') => {
      root.dataset.theme = theme;
      body.dataset.appMode = mode;
      const style = getComputedStyle(body);
      const rootStyle = getComputedStyle(root);
      return {
        bg: rootStyle.getPropertyValue('--ui-bg').trim(),
        surface: rootStyle.getPropertyValue('--ui-surface').trim(),
        text: style.getPropertyValue('--ui-text').trim(),
        muted: style.getPropertyValue('--ui-text-muted').trim(),
        primary: style.getPropertyValue('--ui-primary').trim(),
        tiffany: style.getPropertyValue('--ui-tiffany').trim()
      };
    };
    return {
      dark: snapshot('dark'),
      light: snapshot('light'),
      notebook: snapshot('dark', 'notebook'),
      coding: snapshot('dark', 'coding')
    };
  });

  for (const [name, palette] of [['dark', themes.dark], ['light', themes.light]]) {
    expect(contrast(palette.text, palette.bg), name + ' body text').toBeGreaterThanOrEqual(7);
    expect(contrast(palette.muted, palette.surface), name + ' muted text').toBeGreaterThanOrEqual(4.5);
    expect(contrast(palette.tiffany, palette.bg), name + ' brand accent').toBeGreaterThanOrEqual(4.5);
    expect(contrast('#ffffff', palette.primary), name + ' primary button label').toBeGreaterThanOrEqual(4.5);
  }
  expect(contrast('#ffffff', themes.notebook.primary), 'Notebook button label').toBeGreaterThanOrEqual(4.5);
  expect(contrast('#ffffff', themes.coding.primary), 'Coding button label').toBeGreaterThanOrEqual(4.5);
});
