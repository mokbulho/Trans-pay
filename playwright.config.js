// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { environment } = require('./config/environment');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',

  // Fail the build on CI if a test.only was accidentally committed.
  forbidOnly: !!process.env.CI,

  // Flaky-test safety net: retry on CI only, never mask failures locally.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  fullyParallel: true,

  // Whole-test and per-assertion timeouts.
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ...(process.env.CI ? /** @type {const} */ ([['github']]) : []),
  ],

  use: {
    baseURL: environment.baseURL,
    headless: environment.headless,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },

    // Uncomment to add mobile coverage once the wizard's responsive layout is in scope.
    // { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    // { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
  ],
});
