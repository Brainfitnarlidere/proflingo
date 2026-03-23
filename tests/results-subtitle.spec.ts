import { test, expect } from '@playwright/test';
import path from 'path';

const cases = [
  { chapterId: 1, correct: 9, wrong: 1, expect: '"Colors"' },
  { chapterId: 5, correct: 6, wrong: 4, expect: '"Clothing"' },
  { chapterId: 15, correct: 3, wrong: 7, expect: '"Basic Sentences"' },
];

test.describe('Results subtitle', () => {
  for (const c of cases) {
    test(`chapter ${c.chapterId} shows dynamic subtitle`, async ({ page }) => {
      const logs: string[] = [];
      const errors: string[] = [];
      page.on('console', (msg) => logs.push(msg.text()));
      page.on('pageerror', (err) => errors.push(err.message || String(err)));

      const fileUrl = 'file://' + path.join(__dirname, 'results-subtitle.html');
      await page.goto(fileUrl);

      try {
        await page.waitForSelector('.case', { timeout: 5000 });
        const caseCards = page.locator('.case');
        const card = caseCards.nth(cases.indexOf(c));
        await expect(card).toContainText(c.expect);
        await expect(card).toContainText('Altyazı:');
      } finally {
        const note = [
          'console logs:',
          logs.join('\n') || '  (none)',
          'page errors:',
          errors.join('\n') || '  (none)',
        ].join('\n');
        test.info().annotations.push({ type: 'debug', description: note });
      }
    });
  }
});
