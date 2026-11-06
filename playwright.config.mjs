import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // Each test gets a fresh Playwright browser context; parallel execution is isolated.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // One worker per shard keeps each runner predictable; the workflow matrix provides parallelism.
  workers: process.env.CI ? 1 : undefined,
  // Stop the suite before the Actions job timeout so reporters and artifacts can flush.
  globalTimeout: process.env.CI ? 30 * 60 * 1000 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  timeout: 30000,
  use: {
    baseURL: (process.env.LIVE_SITE_URL ? process.env.LIVE_SITE_URL.replace(/\/?$/, '/') : 'http://127.0.0.1:4173'),
    browserName: 'chromium',
    headless: true,
    // GitHub-hosted ubuntu-latest includes stable Google Chrome; local runs use Playwright Chromium.
    channel: process.env.CI ? 'chrome' : undefined,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  ...(process.env.LIVE_SITE_URL ? {} : { webServer: {
    command: 'set -eu; site_root="$(mktemp -d)"; for item in _site/*; do [ -e "$item" ] || continue; ln -s "$PWD/$item" "$site_root/$(basename "$item")"; done; [ -e "$site_root/skills-github-pages" ] || ln -s "$PWD/_site" "$site_root/skills-github-pages"; python3 -m http.server 4173 --bind 127.0.0.1 --directory "$site_root"',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: !process.env.CI,
    timeout: 10000
  } })
});
