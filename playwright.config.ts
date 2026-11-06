import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: 'http://127.0.0.1:5199',
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
  webServer: {
    command: 'npx vite --port 5199 --host 127.0.0.1',
    url: 'http://127.0.0.1:5199',
    reuseExistingServer: false,
    env: {
      PREP_CDI_DB_PATH: path.resolve(process.cwd(), 'storage', 'e2e_test_data.sqlite'),
    },
    timeout: 30000,
  },
});
