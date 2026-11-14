import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  retries: 0,
  reporter: [['list']],
  use: {
    headless: true,
    // Sistemdeki Chrome'u kullanmak için: CHROME_PATH=/yol/chrome npm test
    launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
  },
});
