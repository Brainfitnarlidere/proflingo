import { test, expect } from '@playwright/test';
import { setupApp, register, serverProfile } from './helpers/app';

test.describe('Oyun ve XP', () => {
  test('tüm bölümler açılır, quiz soruları hatasız gösterilir', async ({ page }) => {
    test.setTimeout(120_000);
    const app = await setupApp(page, { confirm: false });
    await register(page);
    const ids: number[] = await page.evaluate(() => (window as any).CHAPTERS.map((c: any) => c.id));
    expect(ids.length).toBeGreaterThan(40);
    const failures: string[] = [];
    for (const id of ids) {
      const r = await page.evaluate(async (cid) => {
        const w = window as any, errs: string[] = [];
        try { w.startChapter(cid); } catch (e: any) { errs.push('start: ' + e.message); }
        await new Promise(r => setTimeout(r, 40));
        try { w.startQuizPhase(); } catch (e: any) { errs.push('quiz: ' + e.message); }
        await new Promise(r => setTimeout(r, 40));
        const qs = w.gameState.questions || [];
        for (let i = 1; i < Math.min(qs.length, 6); i++) {
          try { w.gameState.qIdx = i; w.renderQuestion(); } catch (e: any) { errs.push('render: ' + e.message); }
        }
        w.stopTimer && w.stopTimer();
        return { errs, n: qs.length };
      }, id);
      if (r.errs.length || r.n === 0) failures.push(`Bölüm ${id}: ${r.n} soru; ${r.errs.join(' | ')}`);
    }
    expect(failures).toEqual([]);
    expect(app.errors).toEqual([]);
  });

  test('bölüm sonu XP sunucu fonksiyonundan geçer ve sınırlanır', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    await page.evaluate(async () => {
      const w = window as any, g = w.gameState, ch = w.CHAPTER_DATA[1];
      Object.assign(g, { chapterId: 1, earnedXP: 5000, allCorrect: 0, allWrong: 0, quizCorrect: 10, quizWrong: 0,
        currentBatch: ch.batches ? ch.batches.length - 1 : 0 });
      await w.onQuizDone();
    });
    const p = await serverProfile(page);
    expect(p.xp).toBe(10 * 45 + 600 + 50);   // 5000 istendi, sınır uygulandı
    expect(p.completed_chapters).toContain(1);
    expect(await page.evaluate(() => (window as any).getCurrentUser().xp)).toBe(p.xp);
  });

  test('tarayıcıdan XP yazılamaz', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    await page.evaluate(async () => { const w = window as any; const u = w.getCurrentUser(); u.xp = 99999; await w.updateUser(u); });
    expect((await serverProfile(page)).xp).toBe(0);
    const updates = await page.evaluate(() => (window as any).__FAKE.calls.filter((c: any) => c.op === 'update'));
    for (const u of updates) expect(Object.keys(u.payload)).not.toContain('xp');
  });

  test('market: yeterli XP ile alınır, yetersizse reddedilir', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    await page.evaluate(() => {
      const w = window as any; (Object.values(w.__FAKE.profiles)[0] as any).xp = 30000;
      const u = w.getCurrentUser(); u.xp = 30000; w.saveCurrentUser(u); w.renderMarket(); w.showScreen('market');
    });
    await page.click('.btn-buy[data-id=lang_3]');
    await expect(page.locator('.btn-buy[data-id=lang_3]')).toContainText('Alındı');
    expect((await serverProfile(page)).xp).toBe(5000);
    await expect(page.locator('.btn-buy[data-id=lang_7]')).toBeDisabled();
    const forced = await page.evaluate(() => { const w = window as any; return w.redeemReward(w.REWARDS.find((r: any) => r.id === 'lang_7')); });
    expect(forced.error).toContain('XP yetersiz');
  });

  test('n8n isteği oturum anahtarıyla gönderilir', async ({ page }) => {
    const app = await setupApp(page, { confirm: false });
    await register(page);
    await page.evaluate(() => (window as any).UsageManager.syncToN8N('test'));
    await page.waitForTimeout(300);
    expect(app.n8n.length).toBeGreaterThan(0);
    expect(app.n8n[0]['authorization']).toMatch(/^Bearer /);
  });
});
