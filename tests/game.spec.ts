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
        for (let i = 0; i < qs.length; i++) {   // her soru (eskiden yanlış alanla hep ilk soru gösteriliyordu)
          try { w.gameState.qIndex = i; w.renderQuestion(); } catch (e: any) { errs.push('render: ' + e.message); }
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

  test('her soru açılınca okunur ve her soruda tekrar dinle düğmesi çalışır', async ({ page }) => {
    test.setTimeout(120_000);
    await setupApp(page, { confirm: false });
    await register(page);
    const unread: string[] = await page.evaluate(async () => {
      const w = window as any, log: string[] = [], miss: string[] = [];
      w.playTTS = async (t: string) => { log.push(t); }; w.playSlow = (t: string) => log.push(t); w.playNativeTTS = (t: string) => log.push(t);
      w.startWinnerMode = () => {}; w.onQuizDone = () => {};
      for (const c of w.CHAPTERS) {
        w.startChapter(c.id); await new Promise(r => setTimeout(r, 20));
        w.startQuizPhase(); await new Promise(r => setTimeout(r, 20));
        const qs = w.gameState.questions || [];
        for (let i = 0; i < qs.length; i++) {
          log.length = 0; w.gameState.qIndex = i; w.renderQuestion();
          await new Promise(r => setTimeout(r, 60));   // düşen görseller bir kare sonra okur
          const where = `bölüm ${c.id} soru ${i} (${qs[i].type})`;
          if (!log.length) miss.push(where + ': açılınca okunmadı');
          // "Tekrar dinle": her soruda olmalı (dinleme/konuşma kendi düğmesini kullanır)
          const own = ({ 'listen-choice': 'btn-quiz-listen', 'speak': 'btn-speak-repeat' } as any)[qs[i].type];
          const btn = document.getElementById(own || 'btn-quiz-replay') as HTMLElement | null;
          if (!btn || btn.offsetParent === null || btn.classList.contains('hidden')) miss.push(where + ': tekrar dinle düğmesi görünmüyor');
          else if (!own) { const n = log.length; btn.click(); if (log.length === n) miss.push(where + ': düğme okumadı'); }
          w.stopTimer && w.stopTimer();
        }
      }
      return miss;
    });
    expect(unread).toEqual([]);
  });

  test('Winner Mode: canlar doluyken kazanılan her ekstra canda açılır', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    const r = await page.evaluate(async () => {
      const w = window as any; let opened = 0;
      w.startWinnerMode = () => { opened++; };
      w.renderQuestion = () => {}; w.SOUNDS.correct.play = () => Promise.resolve();
      w.startChapter(1); w.startQuizPhase();
      const g = w.gameState; const steps: any[] = [];
      g.hearts = 4; g.consecutiveCorrects = 0; g.qIndex = 0;
      for (let k = 1; k <= 9; k++) { w.correctAns(null, 'word'); steps.push(g.hearts); }
      await new Promise(r => setTimeout(r, 1000));
      return { opened, steps, qIndex: g.qIndex };
    });
    // 3. doğru: 4→5 can (Winner yok); 6. ve 9. doğru: canlar dolu → Winner iki kez
    expect(r.steps[2]).toBe(5);
    expect(r.opened).toBe(2);
    expect(r.qIndex).toBe(9);   // Winner sonrası sıradaki soruya geçilir
  });
});
