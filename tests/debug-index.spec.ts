import { test } from '@playwright/test';
import path from 'path';

test('index loads without console errors', async ({ page }) => {
  const fileUrl = 'file://' + path.join(__dirname, '..', 'index.html');
  const errors: string[] = [];
  const logs: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => logs.push(`${m.type()}: ${m.text()}`));

  await page.goto(fileUrl);
  await page.waitForTimeout(2500); // wait for splash to fade

  const appVisible = await page.$eval('#app', el =>
    getComputedStyle(el).display !== 'none' && !el.classList.contains('hidden')
  );
  const splashHidden = await page.$eval('#splash-screen', el =>
    getComputedStyle(el).display === 'none' || el.classList.contains('fade-out')
  );

  if (errors.length) {
    throw new Error('Page errors: ' + errors.join(' | ') + '\nLogs:\n' + logs.join('\n'));
  }
  if (!appVisible || !splashHidden) {
    throw new Error(`UI not visible (appVisible=${appVisible}, splashHidden=${splashHidden}). Logs:\\n${logs.join('\\n')}`);
  }
});
