import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  // verejná stránka občas vypadne - 1 retry aj lokálne, report ho označí ako "flaky"
  retries: isCI ? 2 : 1,
  // verejná demo stránka nezvláda veľa paralelných behov
  workers: isCI ? 2 : 4,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  // v CI každý job uloží blob report a na konci sa zlúčia do jedného HTML reportu
  reporter: isCI
    ? [
        ['list'],
        ['blob', { fileName: `report-${process.env.PW_PROJECT ?? 'all'}.zip` }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
      ]
    : [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
      ],

  use: {
    // iné prostredie sa dá nastaviť cez BASE_URL
    baseURL: process.env.BASE_URL ?? 'https://automationexercise.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // rovnaké testy aj na mobile - bez duplikovania kódu
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
});
