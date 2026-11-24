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
    expect(p.xp).toBe(10 * 75 + 1000 + 50);  // 5000 istendi, sınır uygulandı
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

  test('kullanım süresi dış sunucuya (n8n) gönderilmez, 30 dk tebriki yerelde çalışır', async ({ page }) => {
    const app = await setupApp(page, { confirm: false });
    await register(page);
    const r = await page.evaluate(() => {
      const U = (window as any).UsageManager; let tebrik = 0;
      U.showLocalNotification = () => { tebrik++; };
      U.addUsage(31 * 60000);
      return { tebrik, syncVar: typeof U.syncToN8N };
    });
    await page.waitForTimeout(300);
    expect(r).toEqual({ tebrik: 1, syncVar: 'undefined' });
    expect(app.n8n).toEqual([]);
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
        w.startChapter(c.id); await new Promise(r => setTimeout(r, 150)); // öğrenme kartı 100 ms sonra okur
        w.startQuizPhase(); await new Promise(r => setTimeout(r, 20));
        const qs = w.gameState.questions || [];
        for (let i = 0; i < qs.length; i++) {
          log.length = 0; w.gameState.qIndex = i; w.renderQuestion();
          await new Promise(r => setTimeout(r, 60));   // düşen görseller bir kare sonra okur
          const where = `bölüm ${c.id} soru ${i} (${qs[i].type})`;
          if (!log.length) miss.push(where + ': açılınca okunmadı');
          const chd = w.CHAPTER_DATA[c.id];
          if (qs[i].type === 'word-choice' && !chd.isQAMode && log.includes(chd.items[qs[i].key].word)) miss.push(where + ': cevabı sesli söyledi');
          // Her soruda TEK tekrar düğmesi (dinleme: büyük hoparlör, konuşma: kendi Repeat düğmesi)
          const own = ({ 'speak': 'btn-speak-repeat', 'listen-choice': 'btn-quiz-listen' } as any)[qs[i].type];
          const gorunur = (id: string) => { const e = document.getElementById(id) as HTMLElement | null; return !!e && e.offsetParent !== null && !e.classList.contains('hidden'); };
          const tekrarSayisi = ['btn-quiz-replay', 'btn-quiz-listen', 'btn-speak-repeat'].filter(gorunur).length;
          if (tekrarSayisi !== 1) miss.push(where + `: ${tekrarSayisi} tekrar düğmesi görünüyor`);
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

  test('yavaş internette sesler üst üste binmez, geç gelen ses başka soruda çalmaz', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    await page.context().route('**/api.dictionaryapi.dev/**', async route => {
      await new Promise(r => setTimeout(r, 1200));                      // yavaş bağlantı
      const w = route.request().url().split('/').pop();
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify([{ phonetics: [{ audio: `https://ses/${w}.mp3` }] }]) });
    });
    const r = await page.evaluate(async () => {
      const w = window as any; const playing = new Set<any>(); let speaking = false; let worst = 0;
      const bump = () => { worst = Math.max(worst, playing.size + (speaking ? 1 : 0)); };
      w.Audio = function (u: string) { const a: any = { src: u, volume: 1, currentTime: 0,
        play() { playing.add(a); bump(); setTimeout(() => playing.delete(a), 900); return Promise.resolve(); },
        pause() { playing.delete(a); } }; return a; };
      w.speechSynthesis.speak = () => { speaking = true; bump(); setTimeout(() => (speaking = false), 700); };
      w.speechSynthesis.cancel = () => { speaking = false; };
      w.startWinnerMode = () => {}; w.onQuizDone = () => {};
      w.startChapter(4); await new Promise(r => setTimeout(r, 150)); w.startQuizPhase();
      const qs = w.gameState.questions;
      for (let i = 0; i < Math.min(qs.length, 10); i++) {                // hızlı oyuncu: 400 ms'de bir soru
        w.gameState.qIndex = i; w.renderQuestion(); await new Promise(r => setTimeout(r, 400)); w.stopTimer && w.stopTimer();
      }
      await new Promise(r => setTimeout(r, 1500));
      return worst;
    });
    expect(r).toBeLessThanOrEqual(1);
  });

  test('her okuma aynı ses ve aynı ses düzeyiyle yapılır', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    const r = await page.evaluate(() => {
      const w = window as any; const okunan: any[] = []; let kayitSayisi = 0;
      const sesler = [
        { name: 'Google UK English Male', lang: 'en-GB' }, { name: 'Samantha', lang: 'en-US' },
        { name: 'Fred', lang: 'en-US' }, { name: 'Alex', lang: 'en-US' }, { name: 'Victoria', lang: 'en-US' },
      ];
      w.SES_KAYITLARI = {};                                              // kayıtsız: tarayıcı sesi yolu
      w.speechSynthesis.getVoices = () => sesler;
      w.SpeechSynthesisUtterance = function (this: any, t: string) { this.text = t; };   // sahte seslerle çalışabilsin
      w._sabitSesler = {};
      w.speechSynthesis.speak = (u: any) => okunan.push({ metin: u.text, duzey: u.volume, ses: u.voice && u.voice.name });
      const A = w.Audio; w.Audio = function (...a: any[]) { kayitSayisi++; return new A(...a); };
      for (let k = 0; k < 8; k++) { w.playTTS('Banana'); w.playTTS('Pig'); w.playTTS('What do you see?'); w.playSlow('I am a student'); }
      w.playNativeTTS('Where are you from?', { gender: 'female' }); w.playNativeTTS('I am from Turkey.', { gender: 'female' });
      return { okunan, kayitSayisi };
    });
    const erkek = r.okunan.slice(0, 32), kadin = r.okunan.slice(32);
    expect(new Set(r.okunan.map((o: any) => o.duzey))).toEqual(new Set([1]));   // hep aynı düzey
    expect(new Set(erkek.map((o: any) => o.ses))).toEqual(new Set(['Alex']));   // hep aynı ses (rastgele değil)
    expect(new Set(kadin.map((o: any) => o.ses))).toEqual(new Set(['Samantha']));
    expect(r.kayitSayisi).toBe(0);                                              // dışarıdan ses kaydı yok
  });

  test('İtalyanca: bütün bölümler açılır, talimatlar İtalyanca, her okuma İtalyanca kayıtla çalar', async ({ page }) => {
    test.setTimeout(120_000);
    const app = await setupApp(page, { confirm: false });
    await register(page);
    const r = await page.evaluate(async () => {
      const w = window as any; const calinan: string[] = []; const tarayici: string[] = []; const hatalar: string[] = []; const yazilar = new Set<string>();
      w._kayitCalar.play = () => { calinan.push(w._kayitCalar.src); return Promise.resolve(); };
      w.speechSynthesis.speak = (u: any) => tarayici.push(u.text);
      w.startWinnerMode = () => {}; w.onQuizDone = () => {};
      w.selectLanguage('it');
      for (const c of w.CHAPTERS) {
        try { w.startChapter(c.id); } catch (e: any) { hatalar.push(c.id + ' başlat: ' + e.message); }
        await new Promise(r => setTimeout(r, 150));
        for (let i = 0; i < 6; i++) { try { w.nextCard(); } catch (e: any) { hatalar.push(c.id + ' kart: ' + e.message); } await new Promise(r => setTimeout(r, 150)); }
        try { w.startQuizPhase(); } catch (e: any) { hatalar.push(c.id + ' quiz: ' + e.message); }
        const qs = w.gameState.questions || [];
        if (!qs.length) hatalar.push(c.id + ': soru yok');
        for (let i = 0; i < qs.length; i++) {
          try { w.gameState.qIndex = i; w.renderQuestion(); } catch (e: any) { hatalar.push(c.id + ' soru: ' + e.message); }
          yazilar.add(qs[i].prompt); await new Promise(r => setTimeout(r, 30)); w.stopTimer && w.stopTimer();
        }
      }
      return { hatalar, tarayici, eksik: Array.from(w.__eksikSesler), calinan: calinan.length, yazilar: Array.from(yazilar) };
    });
    expect(r.hatalar).toEqual([]);
    expect(r.eksik).toEqual([]);
    expect(r.tarayici).toEqual([]);
    expect(r.calinan).toBeGreaterThan(30);
    expect(r.yazilar.some((y: string) => /Match the pairs|Listen closely|What do you see/.test(y))).toBe(false);
    expect(app.errors).toEqual([]);
  });

  test('İtalyanca kayıt yoksa tarayıcı İtalyanca okur; İngilizce kayıt İtalyancada çalmaz', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    const r = await page.evaluate(() => {
      const w = window as any; const okunan: any[] = []; const calinan: string[] = [];
      w._kayitCalar = { dataset: {}, play() { calinan.push(this.src); return Promise.resolve(); }, pause() {} };
      w.SpeechSynthesisUtterance = function (this: any, t: string) { this.text = t; };
      w.speechSynthesis.speak = (u: any) => okunan.push({ metin: u.text, dil: u.lang });
      w.SES_KAYITLARI = { [w.sesKaydiAnahtari('Banana', 'm', 'n')]: 'ingilizce.mp3' };
      w.gameState.targetLanguage = 'it'; w.playTTS('Banana');
      w.gameState.targetLanguage = 'en'; w.playTTS('Banana');
      return { okunan, calinan };
    });
    expect(r.okunan).toEqual([{ metin: 'Banana', dil: 'it-IT' }]);
    expect(r.calinan).toEqual(['audio/tts/ingilizce.mp3']);
  });

  test('çok gruplu her bölümde grup arası geçiş ekranı açılır (48. bölüm takılmıyordu)', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    const hatalar = await page.evaluate(() => {
      const w = window as any; const h: string[] = [];
      for (const c of w.CHAPTERS) {
        const ch = w.CHAPTER_DATA[c.id];
        if (!ch.batches || ch.batches.length < 2) continue;
        for (let b = 0; b < ch.batches.length - 1; b++) {
          try { w.showTransitionScreen({ chapterId: c.id, currentBatch: b, quizCorrect: 3, quizWrong: 1 });
            if (!document.getElementById('transition-title')!.textContent) h.push(c.id + '/' + b + ': başlık boş'); }
          catch (e: any) { h.push(c.id + '/' + b + ': ' + e.message); }
        }
      }
      return h;
    });
    expect(hatalar).toEqual([]);
  });

  test('günlük 30 dakika dolsa da bölüm açılır (süre sınırı yok)', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    const r = await page.evaluate(async () => {
      const w = window as any;
      localStorage.setItem(w.UsageManager.getTodayKey(), '120');      // bugün 2 saat oynamış
      w.startChapter(6); await new Promise(r => setTimeout(r, 200));
      const limit = document.getElementById('screen-limit');
      return { bolum: w.gameState.chapterId, limitGizli: !limit || limit.classList.contains('hidden') };
    });
    expect(r.bolum).toBe(6);
    expect(r.limitGizli).toBe(true);
  });

  test('ElevenLabs kaydı varsa o çalar; yoksa ya da çalamazsa tarayıcı sesine döner', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    const r = await page.evaluate(async () => {
      const w = window as any; const okunan: string[] = []; const calinan: string[] = [];
      w.SpeechSynthesisUtterance = function (this: any, t: string) { this.text = t; };
      w.speechSynthesis.speak = (u: any) => okunan.push(u.text);
      let sonraHata = false;
      const sahte: any = { dataset: {}, volume: 1, onerror: null, src: '',
        play() { calinan.push(this.src); if (sonraHata) setTimeout(() => this.onerror && this.onerror(), 10); return Promise.resolve(); },
        pause() {} };
      w._kayitCalar = sahte;
      w.SES_KAYITLARI = {
        [w.sesKaydiAnahtari('Head', 'm', 'n')]: 'head.mp3',
        [w.sesKaydiAnahtari('I am a student', 'm', 's')]: 'yavas.mp3',
        [w.sesKaydiAnahtari('I am from Turkey.', 'f', 'n')]: 'kadin.mp3',
        [w.sesKaydiAnahtari('Match the pairs!', 'm', 'n')]: 'talimat.mp3',
        [w.sesKaydiAnahtari('Bozuk', 'm', 'n')]: 'yok.mp3',
      };
      w.playTTS('Head'); w.playSlow('I am a student'); w.playNativeTTS('I am from Turkey.', { gender: 'female' });
      w.playNativeTTS('Match the pairs! 🔊');                   // emoji anahtarı bozmaz
      w.playTTS('Hand');                                         // kaydı yok → tarayıcı sesi
      sonraHata = true; w.playTTS('Bozuk'); await new Promise(r => setTimeout(r, 50));   // dosya açılamazsa yedek
      return { okunan, calinan, eksik: Array.from(w.__eksikSesler) };
    });
    expect(r.calinan).toEqual(['audio/tts/head.mp3', 'audio/tts/yavas.mp3', 'audio/tts/kadin.mp3', 'audio/tts/talimat.mp3', 'audio/tts/yok.mp3']);
    expect(r.okunan).toEqual(['Hand', 'Bozuk']);
    expect(r.eksik).toEqual(['mn|Hand']);
  });

  test('cümleler kadın, kelime ve talimatlar erkek sesle okunur', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    const r = await page.evaluate(() => {
      const w = window as any; const calinan: string[] = [];
      w._kayitCalar = { dataset: {}, play() { calinan.push(this.src); return Promise.resolve(); }, pause() {} };
      w.SES_KAYITLARI = { [w.sesKaydiAnahtari('The elephant is big.', 'f', 'n')]: 'cumle.mp3',
        [w.sesKaydiAnahtari('Big', 'm', 'n')]: 'kelime.mp3', [w.sesKaydiAnahtari('Find Big', 'm', 'n')]: 'talimat.mp3' };
      w.playTTS('The elephant is big.'); w.playTTS('Big'); w.playTTS('Find Big');
      return calinan;
    });
    expect(r).toEqual(['audio/tts/cumle.mp3', 'audio/tts/kelime.mp3', 'audio/tts/talimat.mp3']);
  });

  test('her soru türü kendi puanını verir; eşleştirmede her doğru eşleşme ayrıca puan kazandırır', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    const r = await page.evaluate(async () => {
      const w = window as any;
      w.renderQuestion = () => {}; w.startWinnerMode = () => {}; w.playTTS = () => {}; w.playNativeTTS = () => {};
      w.SOUNDS.correct.play = () => Promise.resolve(); w.SOUNDS.pop.play = () => Promise.resolve();
      const turPuani: Record<string, number> = {};
      for (const tip of ['word-choice', 'listen-choice', 'word-ordering', 'speak']) {
        const g = w.gameState; g.questions = [{ type: tip }]; g.qIndex = 0; g.firstTry = true; g.hearts = 0; g.consecutiveCorrects = 0;
        const once = g.earnedXP; w.correctAns(null, 'word'); turPuani[tip] = g.earnedXP - once;
      }
      // Hafıza oyunu: gerçek tıklamalarla eşleştir
      w.startChapter(7); w.startQuizPhase();
      const qs = w.gameState.questions; const i = qs.findIndex((q: any) => q.type === 'memory-match');
      w.gameState.qIndex = i; w.gameState.answering = true;
      w.correctAns = () => {};                        // bitirme puanını ayrı tut
      w.renderMemoryMatch(qs[i]);
      const once = w.gameState.earnedXP; const adimlar: number[] = [];
      const kelime = (k: string) => qs[i].items[k].word;
      for (const box of Array.from(document.querySelectorAll('#memory-grid .memory-box')) as HTMLElement[]) {
        box.click();
        const opt = (Array.from(document.querySelectorAll('#memory-words-pool .memory-word-option')) as HTMLElement[])
          .find(o => o.textContent === kelime(box.dataset.key!))!;
        opt.click(); adimlar.push(w.gameState.earnedXP - once);
      }
      return { turPuani, adimlar, cift: Object.keys(qs[i].items).length };
    });
    expect(r.turPuani).toEqual({ 'word-choice': 10, 'listen-choice': 15, 'word-ordering': 20, 'speak': 25 });
    expect(r.adimlar).toEqual(Array.from({ length: r.cift }, (_, k) => (k + 1) * 5));   // her eşleşmede +5
  });

  test('ses tanıma: uzak ses can götürmez, 2. tahmin kabul edilir, mikrofon takılmaz, müzik susar', async ({ page }) => {
    await setupApp(page, { confirm: false });
    await register(page);
    const r = await page.evaluate(async () => {
      const w = window as any; const sonuc: any = {};
      // Sahte ses tanıyıcı: testten sonuç/hata gönderilebilir
      let aktif: any = null;
      w.SpeechRecognition = function (this: any) { aktif = this; this.start = () => {}; this.abort = () => {}; };
      w.webkitSpeechRecognition = w.SpeechRecognition;
      let yakin = true;
      w.mikrofonOlcerBaslat = async () => ({ yakinMi: () => yakin, durdur: () => {} });
      w.playTTS = () => {}; w.playNativeTTS = () => {}; w.renderQuestion = () => {}; w.startWinnerMode = () => {};
      let muzik = 'calıyor'; w.SOUNDS.bgm = { get paused() { return muzik !== 'calıyor'; }, pause() { muzik = 'durdu'; }, play() { muzik = 'calıyor'; return Promise.resolve(); } };
      w.startChapter(1); w.startQuizPhase();
      const qs = w.gameState.questions; const i = qs.findIndex((q: any) => q.type === 'speak');
      w.gameState.qIndex = i; w.gameState.answering = true; w.gameState.hearts = 5;
      w.renderSpeakWord(qs[i]);
      const hedef = w.CHAPTER_DATA[1].items[qs[i].key].word.toLowerCase();
      const mic = document.getElementById('btn-speak-mic')!; const yazi = () => document.getElementById('speak-result-text')!.textContent;
      const sonucGonder = (alts: string[]) => aktif.onresult({ results: [alts.map(t => ({ transcript: t }))] });
      let dogru = 0; w.correctAns = () => { dogru++; };

      await (mic as any).onclick(); sonuc.dinlerkenMuzik = muzik;
      yakin = false; sonucGonder(['banana bread']); sonuc.uzakCan = w.gameState.hearts; sonuc.uzakYazi = yazi(); sonuc.sonraMuzik = muzik;
      await (mic as any).onclick(); yakin = true; sonucGonder(['banana bread']); sonuc.yakinCan = w.gameState.hearts;
      await (mic as any).onclick(); sonucGonder(['the end', hedef]); sonuc.ikinciTahminDogru = dogru; sonuc.dogruYazi = yazi();
      await (mic as any).onclick(); aktif.onend(); sonuc.takildiMi = mic.classList.contains('listening'); sonuc.sessizYazi = yazi();
      await (mic as any).onclick(); aktif.onerror({ error: 'no-speech' }); sonuc.hataSonrasiTakildiMi = mic.classList.contains('listening');
      return sonuc;
    });
    expect(r.dinlerkenMuzik).toBe('durdu');
    expect(r.sonraMuzik).toBe('calıyor');
    expect(r.uzakCan).toBe(5);                       // uzak/gürültü: can gitmez
    expect(r.uzakYazi).toContain('Too far or too noisy');
    expect(r.yakinCan).toBe(4);                      // yakından yanlış: can gider
    expect(r.ikinciTahminDogru).toBe(1);             // doğru kelime 2. tahminde: kabul
    expect(r.dogruYazi).toContain('Doğru söyledin');
    expect(r.takildiMi).toBe(false);                 // sonuç gelmeden bitti: mikrofon takılmaz
    expect(r.sessizYazi).toContain("Didn't catch that");
    expect(r.hataSonrasiTakildiMi).toBe(false);
  });

  test('yakın ses kapısı: ortamdan belirgin yüksek ses yakın, zayıf ses uzak sayılır', async ({ page }) => {
    await setupApp(page, { confirm: false });
    const r = await page.evaluate(async () => {
      const w = window as any;
      const dene = async (taban: number, tepe: number) => {
        let t = Date.now(); const seviyeler = () => (Date.now() - t < w.YAKIN_SES.TABAN_MS ? taban : tepe);
        Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) } });
        w.AudioContext = function () { return {
          createAnalyser: () => ({ fftSize: 1024, getFloatTimeDomainData: (b: Float32Array) => b.fill(seviyeler()) }),
          createMediaStreamSource: () => ({ connect() {} }), close() {} }; };
        const o = await w.mikrofonOlcerBaslat(); t = Date.now();
        await new Promise(r => setTimeout(r, w.YAKIN_SES.TABAN_MS + 250));
        const sonuc = o.yakinMi(); o.durdur(); return sonuc;
      };
      return {
        sessizOdaYakin: await dene(0.003, 0.12),    // sessiz oda, yakından konuşma
        gurultuluOdaYakin: await dene(0.03, 0.15),  // gürültülü oda, yakından konuşma
        gurultuluOdaUzak: await dene(0.03, 0.05),   // gürültülü oda, uzaktaki konuşma
        sessizOdaUzak: await dene(0.003, 0.012),    // sessiz oda, uzaktaki konuşma
      };
    });
    expect(r).toEqual({ sessizOdaYakin: true, gurultuluOdaYakin: true, gurultuluOdaUzak: false, sessizOdaUzak: false });
  });

  test('yakın söylenen sözcük doğru kabul edilir, alakasız sözcük edilmez', async ({ page }) => {
    await setupApp(page, { confirm: false });
    const r = await page.evaluate(() => {
      const m = (window as any).isLenientMatch;
      return {
        nine_nein: m('Nine', 'nein'), seven_heaven: m('Seven', 'heaven'), cat_cut: m('Cat', 'cut'),
        banana_bananas: m('Banana', 'bananas'), cumle_eksik: m('I am a student', 'i am student'),
        ice_cream: m('Ice cream', 'icecream'),
        cat_dog: m('Cat', 'dog'), cat_hat: m('Cat', 'hat'), cumle_baska: m('Where are you from?', 'what is your name'),
        bos: m('Apple', ''),
        eye_i: m('Eye', 'i'), eye_hi: m('Eye', 'hi'), eye_high: m('Eye', 'high'), ear_here: m('Ear', 'here'),
        nose_knows: m('Nose', 'knows'), two_to: m('Two', 'to'), eye_dog: m('Eye', 'dog'),
      };
    });
    expect(r).toEqual({ nine_nein: true, seven_heaven: true, cat_cut: true, banana_bananas: true, cumle_eksik: true,
      ice_cream: true, cat_dog: false, cat_hat: false, cumle_baska: false, bos: false,
      eye_i: true, eye_hi: true, eye_high: true, ear_here: true, nose_knows: true, two_to: true, eye_dog: false });
  });
});
