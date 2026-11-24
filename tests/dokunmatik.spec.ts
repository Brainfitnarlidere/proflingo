import { test, expect, Page } from '@playwright/test';
import { setupApp, register } from './helpers/app';

// Tablet: dokunmatik ekran, fare yok. Sürükle-bırak parmakla (touch olayları) yapılır.
test.use({ hasTouch: true, viewport: { width: 820, height: 1180 } });

// Sayfada: kaynaktan hedefe parmakla sürükle (touchstart → touchmove'lar → touchend)
async function kur(page: Page) {
  await page.evaluate(() => {
    const w = window as any;
    w.__surukle = async (src: Element, dst: Element) => {
      src.scrollIntoView({ block: 'nearest' }); dst.scrollIntoView({ block: 'nearest' });
      const a = src.getBoundingClientRect(), b = dst.getBoundingClientRect();
      const x1 = a.left + a.width / 2, y1 = a.top + a.height / 2, x2 = b.left + b.width / 2, y2 = b.top + b.height / 2;
      const T = (x: number, y: number) => new Touch({ identifier: 7, target: src, clientX: x, clientY: y });
      const gonder = (tur: string, x: number, y: number) => src.dispatchEvent(new TouchEvent(tur, { bubbles: true, cancelable: true,
        touches: tur === 'touchend' ? [] : [T(x, y)], targetTouches: tur === 'touchend' ? [] : [T(x, y)], changedTouches: [T(x, y)] }));
      gonder('touchstart', x1, y1);
      for (let i = 1; i <= 6; i++) { gonder('touchmove', x1 + (x2 - x1) * i / 6, y1 + (y2 - y1) * i / 6); await new Promise(r => setTimeout(r, 10)); }
      gonder('touchend', x2, y2);
      await new Promise(r => setTimeout(r, 30));
    };
    w.__dogru = []; w.correctAns = (_: any, tur: string) => w.__dogru.push(tur);
    w.__can = 0; const kayip = w.loseHeart; w.loseHeart = () => { w.__can++; };
    w.playTTS = () => {}; w.playNativeTTS = () => {};
  });
}

async function soruAc(page: Page, dil: string, bolum: number, tur: string) {
  return page.evaluate(async ({ dil, bolum, tur }) => {
    const w = window as any;
    if (dil === 'it') w.selectLanguage('it');
    w.startWinnerMode = () => {}; w.onQuizDone = () => {};
    w.startChapter(bolum); await new Promise(r => setTimeout(r, 100)); w.startQuizPhase();
    const i = w.gameState.questions.findIndex((q: any) => q.type === tur);
    if (i < 0) return false;
    w.gameState.qIndex = i; w.renderQuestion(); w.stopTimer && w.stopTimer();
    await new Promise(r => setTimeout(r, 200));
    return true;
  }, { dil, bolum, tur });
}

for (const [dil, bolum] of [['en', 1], ['en', 33], ['it', 4]] as const) {
  test(`tablet: eşleştirme parmakla sürüklenir (${dil}, bölüm ${bolum})`, async ({ page }) => {
    await setupApp(page, { confirm: false }); await register(page); await kur(page);
    expect(await soruAc(page, dil, bolum, 'match-pairs')).toBe(true);
    const r = await page.evaluate(async () => {
      const w = window as any; const ch = w.CHAPTER_DATA[w.gameState.chapterId];
      const kaynaklar = Array.from(document.querySelectorAll('#match-draggables [draggable="true"]')) as HTMLElement[];
      const hedefler = Array.from(document.querySelectorAll('#match-targets .match-dropzone')) as HTMLElement[];
      // önce yanlış bir hedefe bırak: can gider, eşleşmez
      const ilk = kaynaklar[0], ilkMetin = ch.isQAMode ? ch.items[ilk.dataset.key!].sentence : ch.items[ilk.dataset.key!].word;
      await w.__surukle(ilk, hedefler.find(h => h.textContent !== ilkMetin)!);
      const yanlisCan = w.__can, yanlisEslesen = document.querySelectorAll('.match-dropzone.is-matched').length;
      for (const k of kaynaklar) {
        const d = ch.items[k.dataset.key!], metin = ch.isQAMode ? d.sentence : d.word;
        await w.__surukle(k, hedefler.find(h => h.textContent === metin)!);
      }
      await new Promise(r => setTimeout(r, 700));
      return { yanlisCan, yanlisEslesen, eslesen: document.querySelectorAll('.match-dropzone.is-matched').length, toplam: hedefler.length,
        dogru: w.__dogru, hayalet: document.querySelectorAll('.dokunmatik-hayalet').length };
    });
    expect(r.yanlisCan).toBe(1);
    expect(r.yanlisEslesen).toBe(0);
    expect(r.eslesen).toBe(r.toplam);
    expect(r.dogru).toEqual(['match']);
    expect(r.hayalet).toBe(0);
  });
}

test('tablet: 10\'lu liste ve sahneye yerleştirme parmakla sürüklenir', async ({ page }) => {
  await setupApp(page, { confirm: false }); await register(page); await kur(page);
  for (const [bolum, tur] of [[35, 'matching-list-10'], [7, 'drag-drop-scene']] as const) {
    expect(await soruAc(page, 'en', bolum, tur)).toBe(true);
    const r = await page.evaluate(async (tur) => {
      const w = window as any; w.__dogru = [];
      const kok = document.querySelector(tur === 'drag-drop-scene' ? '#quiz-drag-drop-scene, .scene-bg' : '.match-list-grid')!.closest('.screen') || document;
      const kaynaklar = Array.from(document.querySelectorAll('.scene-draggable[draggable="true"]')).filter((e: any) => e.offsetParent) as HTMLElement[];
      let n = 0;
      for (const k of kaynaklar) {
        const hedef = Array.from(document.querySelectorAll(`.scene-drop-zone[data-key="${k.dataset.key}"], .list-dropzone[data-key="${k.dataset.key}"]`)).find((e: any) => e.offsetParent);
        if (hedef) { await w.__surukle(k, hedef); n++; }
      }
      await new Promise(r => setTimeout(r, 1200));
      return { n, dogru: w.__dogru, gizli: kaynaklar.filter(k => k.style.visibility === 'hidden').length };
    }, tur);
    expect(r.n).toBeGreaterThan(2);
    expect(r.gizli).toBe(r.n);
    expect(r.dogru.length).toBe(1);
  }
});

test('tablet: Winner Mode parmakla sürüklenir; dokunmak (sürüklemeden) okur ve sürükleme başlatmaz', async ({ page }) => {
  await setupApp(page, { confirm: false }); await register(page); await kur(page);
  const r = await page.evaluate(async () => {
    const w = window as any;
    w.startChapter(1); await new Promise(r => setTimeout(r, 100));
    w.renderQuestion = () => {};
    w.startWinnerMode();
    await new Promise(r => setTimeout(r, 200));
    const kaynaklar = Array.from(document.querySelectorAll('#winner-match-container [draggable="true"]')) as HTMLElement[];
    // dokunma: hareket yok → sürükleme yok
    const ilk = kaynaklar[0];
    const T = new Touch({ identifier: 3, target: ilk, clientX: 10, clientY: 10 });
    ilk.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [T], changedTouches: [T] }));
    ilk.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [T] }));
    const dokunmaSonrasi = document.querySelectorAll('.dokunmatik-hayalet').length + document.querySelectorAll('.is-dragging').length;
    for (const k of kaynaklar) await w.__surukle(k, document.querySelector(`#winner-match-container .list-dropzone[data-key="${k.dataset.key}"]`)!);
    return { dokunmaSonrasi, eslesen: document.querySelectorAll('#winner-match-container .is-matched').length, toplam: kaynaklar.length };
  });
  expect(r.dokunmaSonrasi).toBe(0);
  expect(r.eslesen).toBe(r.toplam);
});
