import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke tests against a deployed URL (PR preview or production), run by the CI/CD workflows:
 *   BASE_URL=https://example.workers.dev npm run test:smoke
 */
const baseURL = process.env.BASE_URL;
if (!baseURL) throw new Error('Set BASE_URL to the deployed site, e.g. BASE_URL=https://andresmolina.dev');

export default defineConfig({
  testDir: 'tests/smoke',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // A fresh deployment can take a few seconds to propagate.
  retries: 2,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-webkit', use: { ...devices['iPhone 15'] } },
  ],
});
