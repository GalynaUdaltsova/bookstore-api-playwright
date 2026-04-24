import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['allure-playwright']
  ],

  projects: [
    // API Tests Project
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: {
        baseURL: process.env.API_BASE_URL,
        trace: 'on-first-retry',
      },
    },

    // UI Tests Project
    {
      name: 'ui-chromium',
      testMatch: '**/ui/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.UI_BASE_URL,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
      },
    },
  ],

  tsconfig: './tsconfig.json',
});
