'use strict';

window.SOUNDS = {
  correct: new Audio('audio/correct.wav'),
  wrong: new Audio('audio/wrong.wav'),
  complete: new Audio('audio/complete.wav'),
  pop: new Audio('audio/pop.wav'),
  feverBg: new Audio('audio/fever_bgm.wav'),
  bgm: new Audio('audio/mozart.ogg')
};

window.isBgmPlaying = true;
window.audioUnlocked = false;

window.SOUNDS.complete.volume = 0.5;
window.SOUNDS.correct.volume = 0.25;
window.SOUNDS.wrong.volume = 0.25;
window.SOUNDS.pop.volume = 0.25;
window.SOUNDS.feverBg.loop = false;
window.SOUNDS.feverBg.volume = 0.20;
window.SOUNDS.bgm.loop = true;
window.SOUNDS.bgm.volume = 0.08;

window.toggleBGM = function(btnId) {
  const btn = document.getElementById(btnId);
  if (window.isBgmPlaying) {
    window.SOUNDS.bgm.pause();
    window.isBgmPlaying = false;
    if (btn) btn.style.opacity = '0.5';
  } else {
    window.SOUNDS.bgm.play().catch(() => { });
    window.isBgmPlaying = true;
    if (btn) btn.style.opacity = '1';
  }
};

window.unlockAudio = function() {
  if (window.audioUnlocked) return;
  Object.values(window.SOUNDS).forEach(snd => {
    snd.volume = 0;
    snd.play().then(() => {
      snd.pause();
      snd.currentTime = 0;
      window.SOUNDS.complete.volume = 0.9;
      window.SOUNDS.correct.volume = 0.8;
      window.SOUNDS.pop.volume = 0.8;
      window.SOUNDS.feverBg.volume = 0.8;
      window.SOUNDS.bgm.volume = 0.05;
    }).catch(() => { });
  });
  // Safari ve telefonlarda konuşma motoru ilk dokunuşta açılmazsa sonraki otomatik
  // okumalar sessizce engellenebilir: sessiz bir cümleyle kilidi aç.
  try {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    }
  } catch (e) {}
  // Hızlı oynatıcının (Web Audio) kilidini ilk dokunuşta aç
  try { const c = sesBaglami(); if (c && c.state !== 'running') c.resume().catch(() => {}); } catch (e) {}
  // Kayıt oynatıcısının kilidini de ilk dokunuşta aç (iPhone'da sonraki otomatik okumalar için)
  try {
    const a = window._kayitCalar;
    if (a && !a.dataset.yol) {
      a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
      const p = a.play(); if (p && p.catch) p.catch(() => {});
    }
  } catch (e) {}
  window.audioUnlocked = true;
  document.removeEventListener('click', window.unlockAudio);
  document.removeEventListener('touchstart', window.unlockAudio);
  if (window.isBgmPlaying) window.SOUNDS.bgm.play().catch(() => { });
};

// Okumalar: metnin ElevenLabs kaydı varsa (js/ses-kayitlari.js, audio/tts/) o çalınır;
// yoksa tarayıcının konuşma motoru, her seferinde AYNI ses ve AYNI ses düzeyiyle okur.
// Kayıtlar tools/elevenlabs_uret.js ile üretilir (erkek: kelime/talimat, kadın: cümle).
const SES_DUZEYI = 1.0;
const KAYIT_DUZEYI = 1.0;
const KAYIT_KLASORU = 'audio/tts/';
// Tek oynatıcı: aynı anda iki kayıt çalamaz (yeni okuma eskisini keser).
window._kayitCalar = new Audio();
window._kayitCalar.preload = 'auto';
// Kaydı olmayan metinler (eksikleri bulmak için; tools/elevenlabs_uret.js'e eklenir)
window.__eksikSesler = new Set();

function aktifDil() { return window.hedefDil ? window.hedefDil() : 'en'; }

function kayitDosyasi(text, rol, hiz) {
  const liste = window.SES_KAYITLARI;
  if (!liste || !window.sesKaydiAnahtari) return null;
  const anahtar = window.sesKaydiAnahtari(text, rol, hiz, aktifDil());
  const dosya = liste[anahtar];
  if (!dosya && Object.keys(liste).length) window.__eksikSesler.add(anahtar);
  return dosya ? KAYIT_KLASORU + dosya : null;
}

// HIZLI OYNATMA: bölüm açılınca o bölümün kayıtları indirilip çözülür (sesOnYukle) ve
// Web Audio ile gecikmesiz çalınır. Hazır değilse eski yol: <audio> ile indirip çal.
window._sesTamponlari = new Map();   // yol -> AudioBuffer
const yukleniyor = new Map();        // yol -> Promise
let baglam = null, calanKaynak = null, kazanc = null;
function sesBaglami() {
  if (baglam) return baglam;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try { baglam = new AC(); kazanc = baglam.createGain(); kazanc.gain.value = KAYIT_DUZEYI; kazanc.connect(baglam.destination); }
  catch (e) { baglam = null; }
  return baglam;
}
window._sesBaglami = () => sesBaglami();
window.__sesBaglamiSifirla = () => { baglam = null; calanKaynak = null; window._sesTamponlari.clear(); yukleniyor.clear(); }; // testler için
// iPad/iPhone uygulamadan çıkıp dönünce sesi askıya alabilir: her dokunuşta yeniden aç
['touchstart', 'click'].forEach(t => document.addEventListener(t, () => {
  if (baglam && baglam.state !== 'running') baglam.resume().catch(() => {});
}, { passive: true }));

function tamponYukle(yol) {
  if (window._sesTamponlari.has(yol)) return Promise.resolve(window._sesTamponlari.get(yol));
  if (yukleniyor.has(yol)) return yukleniyor.get(yol);
  const c = sesBaglami();
  if (!c || !window.fetch) return Promise.resolve(null);
  const p = fetch(yol).then(r => r.ok ? r.arrayBuffer() : null)
    .then(b => b ? new Promise((ok, hata) => c.decodeAudioData(b, ok, hata)) : null)
    .then(t => { if (t) window._sesTamponlari.set(yol, t); yukleniyor.delete(yol); return t; })
    .catch(() => { yukleniyor.delete(yol); return null; });
  yukleniyor.set(yol, p);
  return p;
}

// Bir bölümde okunabilecek metinlerin kayıtlarını önceden indirir (bölüm açılınca çağrılır).
let onYuklemeNo = 0;
window.sesOnYukle = function(chapterId) {
  const liste = window.SES_KAYITLARI, ch = window.CHAPTER_DATA && window.CHAPTER_DATA[chapterId];
  if (!liste || !ch || !window.sesKaydiAnahtari) return 0;
  const dil = aktifDil(), T = window.talimat || (m => m);
  const metinler = new Set(['What do you see?', 'Find the image', 'Match the pairs!', 'Match the 9 pairs!',
    'Complete the scene!', 'Reaction Game: Click the correctly named visuals!'].map(T));
  (ch.wordPrompts || []).forEach(m => metinler.add(m));
  for (const d of Object.values(ch.items || {})) {
    [d.word, d.sentence].forEach(m => { if (m) { metinler.add(m); metinler.add(T('Find ') + m); } });
    if (d.word && d.sentence) metinler.add(d.word + ' ... ' + d.sentence);
  }
  const yollar = new Set();
  metinler.forEach(m => ['m', 'f'].forEach(rol => ['n', 's'].forEach(hiz => {
    const f = liste[window.sesKaydiAnahtari(m, rol, hiz, dil)];
    if (f) yollar.add(KAYIT_KLASORU + f);
  })));
  // Aynı anda en fazla 2 indirme: oyun akıcı kalsın (ilk kartların sesleri listenin başında).
  // Bölüm değişirse eski bölümün kalan indirmeleri bırakılır.
  const kuyruk = Array.from(yollar), bolumNo = ++onYuklemeNo;
  const isci = async () => { while (kuyruk.length && bolumNo === onYuklemeNo) await tamponYukle(kuyruk.shift()); };
  for (let i = 0; i < 2; i++) isci();
  return yollar.size;
};

function tamponCal(tampon) {
  const c = sesBaglami();
  if (!c || c.state !== 'running') return false;
  try {
    const k = c.createBufferSource();
    k.buffer = tampon;
    k.connect(kazanc);
    k.start(0);
    calanKaynak = k;
    return true;
  } catch (e) { return false; }
}

// Kayıt süresi (saniye), hazırsa. Soru-cevapta cevabı soru bitince okumak için.
window.kayitSuresi = function(text, gender) {
  const yol = kayitDosyasi(text, gender === 'female' ? 'f' : 'm', 'n');
  const t = yol && window._sesTamponlari.get(yol);
  return t ? t.duration : null;
};

// Soru-cevapta cevap ne zaman okunsun (ms): soru kaydı bitince kısa bir ara; bilinmiyorsa 2 sn.
window.cevapBeklemesi = function(soru) {
  const sure = window.kayitSuresi(soru, 'male');
  return sure ? Math.round(sure * 1000) + 400 : 2000;
};

// Kaydı çalar; çalamazsa (dosya yok, tarayıcı engelledi) yedek olarak tarayıcı sesine döner.
function kayitCal(yol, yedek) {
  const hazir = window._sesTamponlari.get(yol);
  if (hazir && tamponCal(hazir)) return;
  // İnmekte olan kayıt: ikinci kez indirmek yerine bitmesini kısa süre bekle
  const c = sesBaglami();
  if (yukleniyor.has(yol) && c && c.state === 'running') {
    const no = okumaNo;
    let bitti = false;
    const sure = setTimeout(() => { if (!bitti && no === okumaNo) { bitti = true; elemanlaCal(yol, yedek); } }, 1200);
    yukleniyor.get(yol).then(t => {
      if (bitti || no !== okumaNo) return;
      bitti = true; clearTimeout(sure);
      if (!(t && tamponCal(t))) elemanlaCal(yol, yedek);
    });
    return;
  }
  tamponYukle(yol); // sonraki sefere hazır olsun
  elemanlaCal(yol, yedek);
}

let okumaNo = 0; // her yeni okuma/susturma artırır; geç gelen eski okuma çalmasın
function elemanlaCal(yol, yedek) {
  const a = window._kayitCalar;
  let dondu = false;
  const yedegeDon = () => {
    if (dondu || a.dataset.yol !== yol) return; // bu arada başka okuma başladıysa karışma
    dondu = true;
    yedek();
  };
  a.onerror = yedegeDon;
  a.dataset.yol = yol;
  a.src = yol;
  a.volume = KAYIT_DUZEYI;
  try {
    const p = a.play();
    if (p && p.catch) p.catch(e => { if (!e || e.name !== 'AbortError') yedegeDon(); });
  } catch (e) { yedegeDon(); }
}
const SES_HIZI = 0.75;
const ERKEK_SESLER = ['Alex', 'Google US English Male', 'Fred', 'Aaron', 'Arthur', 'James', 'Daniel'];
const KADIN_SESLER = ['Samantha', 'Google US English Female', 'Ava', 'Allison', 'Karen', 'Victoria', 'Moira'];
// İtalyanca yedek sesler (kaydı olmayan metinler için)
const IT_ERKEK_SESLER = ['Luca', 'Google italiano', 'Diego', 'Cosimo'];
const IT_KADIN_SESLER = ['Alice', 'Federica', 'Paola', 'Google italiano', 'Elsa'];

// Aynı anda tek ses: yeni okuma başlarken (ve yeni soru açılırken) öncekini sustur.
window.stopSpeech = function() {
  okumaNo++;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  const a = window._kayitCalar;
  if (a) { a.dataset.yol = ''; try { a.pause(); } catch (e) {} }
  if (calanKaynak) { try { calanKaynak.stop(); } catch (e) {} calanKaynak = null; }
};

// Her cinsiyet için bir kez seçilir ve hep o ses kullanılır (rastgele değil).
window._sabitSesler = {};
function sabitSes(gender) {
  const dil = aktifDil(), anahtar = dil + '|' + gender;
  if (anahtar in window._sabitSesler) return window._sabitSesler[anahtar];
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null; // henüz yüklenmedi; yüklenince seçilecek
  const onek = dil === 'it' ? 'it' : 'en-US';
  const us = voices.filter(v => (v.lang || '').replace('_', '-').startsWith(onek));
  const isimler = dil === 'it' ? (gender === 'female' ? IT_KADIN_SESLER : IT_ERKEK_SESLER)
    : (gender === 'female' ? KADIN_SESLER : ERKEK_SESLER);
  let secilen = null;
  for (const ad of isimler) { secilen = us.find(v => v.name.includes(ad)); if (secilen) break; }
  if (!secilen) secilen = us[0] || (dil === 'it' ? null : voices.find(v => (v.lang || '').startsWith('en'))) || null;
  window._sabitSesler[anahtar] = secilen;
  return secilen;
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.addEventListener('voiceschanged', () => { window._sabitSesler = {}; });
}

window.playTTS = function(text) {
  if (text) window.playNativeTTS(text);
};

window.playNativeTTS = function(text, opts = {}) {
  if (!text) return;
  const { rate = SES_HIZI, pitch = 1.0 } = opts;
  // Ses belirtilmemişse: cümleler kadın, kelime/soru/talimat erkek sesle (js/ses-anahtar.js)
  const gender = opts.gender || (window.cumleSesiMi && window.cumleSesiMi(text) ? 'female' : 'male');
  const yol = kayitDosyasi(text, gender === 'female' ? 'f' : 'm', rate < SES_HIZI ? 's' : 'n');
  if (yol) {
    window.stopSpeech();
    kayitCal(yol, () => tarayiciSesi(text, rate, pitch, gender));
    return;
  }
  tarayiciSesi(text, rate, pitch, gender);
};

function tarayiciSesi(text, rate, pitch, gender) {
  if (!('speechSynthesis' in window)) return;
  // Emojileri okumasın
  const cleanText = String(text).replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = aktifDil() === 'it' ? 'it-IT' : 'en-US';
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = SES_DUZEYI;
  const voice = sabitSes(gender);
  if (voice) utterance.voice = voice;
  window.stopSpeech();
  window.speechSynthesis.speak(utterance);
}

window.playSlow = function(text) {
  window.playNativeTTS(text, { rate: 0.50 });
};

// Yakın ses kapısı: dinleme sırasında mikrofon seviyesini ölçer. İlk 0,4 sn ortam gürültüsü
// (taban), sonrası konuşma (tepe). Yakından konuşan kişinin sesi tabandan belirgin yüksektir;
// uzaktaki konuşma/TV/gürültü bu eşiği geçemez. Tarayıcının tanıyıcısını değiştiremediğimiz
// için sonuç bu ölçüme göre değerlendirilir (uzak ses = can kaybı yok, tekrar dene).
window.YAKIN_SES = { MUTLAK_ESIK: 0.02, TABAN_KATI: 3, OLCUM_MS: 50, TABAN_MS: 400 };

window.mikrofonOlcerBaslat = async function() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || !navigator.mediaDevices) return null;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false }
    });
    const ctx = new AC();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buf = new Float32Array(analyser.fftSize);
    const t0 = Date.now();
    let tabanTop = 0, tabanN = 0, tepe = 0;
    const timer = setInterval(() => {
      analyser.getFloatTimeDomainData(buf);
      let s = 0;
      for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
      const rms = Math.sqrt(s / buf.length);
      if (Date.now() - t0 < window.YAKIN_SES.TABAN_MS) { tabanTop += rms; tabanN++; }
      else if (rms > tepe) tepe = rms;
    }, window.YAKIN_SES.OLCUM_MS);
    let durdu = false;
    return {
      yakinMi() {
        const taban = tabanN ? tabanTop / tabanN : 0;
        return tepe >= Math.max(window.YAKIN_SES.MUTLAK_ESIK, taban * window.YAKIN_SES.TABAN_KATI);
      },
      seviye() { return { taban: tabanN ? tabanTop / tabanN : 0, tepe }; },
      durdur() {
        if (durdu) return; durdu = true;
        clearInterval(timer);
        stream.getTracks().forEach(t => t.stop());   // mikrofon açık kalmasın
        try { ctx.close(); } catch (e) {}
      }
    };
  } catch (e) {
    return null; // ölçüm yapılamazsa kapı devre dışı (eski davranış)
  }
};

window.normalizePhrase = function(str) {
  return str.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
};

// Tanıyıcının kısa kelimeleri sık karıştırdığı yazılışlar (içerikteki HOMOPHONES'a eklenir).
const EK_ES_SESLILER = {
  eye: ['i', 'aye', 'ai', 'ay', 'hi', 'high', 'eyes', 'hai'], i: ['eye', 'aye', 'ai', 'ay', 'hi', 'high'],
  hi: ['high', 'hey', 'hai', 'i', 'eye', 'hay', 'hiya'], ear: ['here', 'hear', 'year', 'ears', 'era', 'eer'],
  nose: ['knows', 'noes', 'nos', 'noise', 'nosy'], hand: ['and', 'hands', 'end', 'han'], head: ['had', 'heard', 'hid', 'hed'],
  leg: ['lag', 'legs', 'lead', 'leck', 'lake'], arm: ['am', 'harm', 'arms', 'um', 'arn'], foot: ['put', 'food', 'feet', 'fut'],
  hat: ['hot', 'had', 'hut', 'at'], cat: ['kat', 'cut', 'cad', 'cap', 'kit'], dog: ['dug', 'doug', 'dock', 'dogs'],
  pig: ['big', 'peg', 'pick', 'pigs'], cow: ['how', 'ciao', 'cows', 'kow', 'cal'], bird: ['bed', 'bert', 'burt', 'word', 'birds'],
  fish: ['fist', 'phish', 'fis', 'fishes'], egg: ['eggs', 'ag', 'eg', 'ack', 'ec'], milk: ['mil', 'melk', 'milks'],
  meat: ['meet', 'mead', 'neat', 'mit'], soup: ['soap', 'sup', 'super', 'sue'], rice: ['rise', 'lice', 'ryes', 'rights', 'raise'],
  baby: ['bobby', 'maybe', 'babe'], bed: ['bad', 'bet', 'bid', 'bread'], door: ['dore', 'dour', 'tour', 'daw', 'doors'],
  lamp: ['lump', 'lamb', 'lab', 'lamps'], sofa: ['soda', 'so far', 'sopha', 'sofas'], car: ['ca', 'far', 'cart', 'kar', 'cars'],
  bus: ['buzz', 'boss', 'bass', 'bust', 'buses'], boat: ['both', 'bought', 'vote', 'boats'], park: ['bark', 'pork', 'parc', 'parks'],
  bank: ['bang', 'punk', 'banks'], cook: ['look', 'cork', 'kook', 'cooks'], he: ['hee', 'hi', 'e'], she: ['shea', 'chi', 'see'],
  it: ['eat', 'at', 'ate'], they: ['day', 'the', 'dey'], we: ['wee', 'oui', 'v'], you: ['u', 'ewe', 'yo', 'yew', 'ju'],
  his: ['is', 'hiss', "he's", 'hits'], her: ['hur', 'here', 'uh'], its: ["it's", 'eats', 'hits'], my: ['mai', 'mi', 'me', 'mine'],
  your: ["you're", 'yore', 'ur', 'you'], big: ['pig', 'bag', 'bic'], good: ['could', 'would', 'god', 'hood'], bad: ['bed', 'bat', 'bud', 'pad'],
  sad: ['said', 'set', 'sat', 'shed'], fast: ['first', 'past', 'fest'], slow: ['low', 'snow', 'flow', 'slo'], hot: ['hat', 'hut', 'what', 'hop'],
  cold: ['called', 'gold', 'code', 'coal'], old: ['all', 'ode', 'owed', 'hold'], ugly: ['ugli', 'uglee'], may: ['mae', 'me', 'my', 'mey'],
  june: ['joon', 'dune'], july: ['julie', 'jewelry'], run: ['ran', 'rum', 'ron', 'fun'], jump: ['jumped', 'chump', 'dump'],
  eat: ['it', 'eight', 'eats', 'heat'], walk: ['wok', 'work', 'woke', 'talk'], read: ['red', 'reed', 'ride', 'lead'],
  in: ['and', 'an', 'inn', 'n'], on: ['an', 'own', 'un', 'ahn'], lake: ['like', 'leak', 'lick', 'late'], sea: ['see', 'c', 'si', 'she'],
  red: ['read', 'rad', 'led', 'bread'], blue: ['blew', 'bloo'], pink: ['pinky', 'pin', 'ping', 'bink'], one: ['won', '1', 'on', 'wan'],
  two: ['to', 'too', '2', 'tu'], four: ['for', 'fore', '4', 'far'], five: ['5', 'hive', 'fife', 'fight'], six: ['6', 'sex', 'sicks', 'sics'],
  nine: ['9', 'nein', 'line', 'mine'], ten: ['10', 'tin', 'then', 'tan']
};
window.HOMOPHONES = window.HOMOPHONES || {};
for (const [k, list] of Object.entries(EK_ES_SESLILER)) {
  window.HOMOPHONES[k] = Array.from(new Set([...(window.HOMOPHONES[k] || []), ...list]));
}

// Okunuş anahtarı: yazılışı farklı ama aynı okunan kelimeleri eşler
// (eye / i / hi / high → "ai", ear / here / hear → "iir", nose / knows → "nous"/"naus").
window.sesAnahtari = function(kelime) {
  const w = String(kelime || '').toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return '';
  const ozel = { i: 'ai', eye: 'ai', aye: 'ai', ai: 'ai', ay: 'ai', a: 'ei', u: 'yu', you: 'yu', ewe: 'yu', yew: 'yu',
    c: 'si', see: 'si', sea: 'si', b: 'bi', be: 'bi', bee: 'bi', r: 'ar', are: 'ar', o: 'ou', oh: 'ou', owe: 'ou' };
  if (ozel[w]) return ozel[w];
  // BÜYÜK harfler = belirlenmiş ses (sonraki kurallar dokunmaz); küçük harfler = işlenmemiş yazım
  let k = w
    .replace(/^wr/, 'r').replace(/^kn/, 'n').replace(/^gn/, 'n').replace(/^wh/, 'w')
    .replace(/^h(?=[aeiouy])/, '')
    .replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/qu/g, 'kw').replace(/q/g, 'k')
    .replace(/eigh/g, 'EI').replace(/igh/g, 'AI').replace(/eye/g, 'AI').replace(/ye$/, 'AI')
    .replace(/([aeiou])([b-df-hj-np-tv-z])e$/, (m, v, c) => ({ a: 'EI', e: 'II', i: 'AI', o: 'OU', u: 'UU' })[v] + c)
    .replace(/ee|ea|ie/g, 'II').replace(/oo/g, 'UU').replace(/ou|ow/g, 'AU').replace(/oa/g, 'OU').replace(/ai|ay/g, 'EI')
    .replace(/c(?=[eiy])/g, 's').replace(/c/g, 'k').replace(/x/g, 'ks').replace(/z/g, 's')
    .replace(/([b-df-hj-np-tv-z])y$/, (m, c) => c + (w.length <= 3 ? 'AI' : 'II'))
    .replace(/e$/, '')
    .replace(/([a-z])\1+/g, '$1');
  if (k === 'i') k = 'AI'; // "hi" → "i" → "ai"
  return k.toLowerCase();
};

// İki kelime arasındaki harf farkı (Levenshtein)
window.harfFarki = function(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, k) => k);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let k = 1; k <= n; k++) {
      cur[k] = Math.min(prev[k] + 1, cur[k - 1] + 1, prev[k - 1] + (a[i - 1] === b[k - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
};

// Söylenen kelime hedefe "yakın" mı? Kısa kelimede 1 harf (ilk harf aynı), orta uzunlukta
// 2, uzun kelimede 3 harf farka izin verilir. Eş sesliler (HOMOPHONES) de kabul.
window.yakinKelime = function(hedef, soylenen) {
  if (hedef === soylenen) return true;
  const H = window.HOMOPHONES || {};
  if ((H[hedef] && H[hedef].includes(soylenen)) || (H[soylenen] && H[soylenen].includes(hedef))) return true;
  // Okunuşları aynı ya da çok yakınsa kabul (kısa anahtarlarda birebir aynı olmalı)
  const k1 = window.sesAnahtari(hedef), k2 = window.sesAnahtari(soylenen);
  if (k1 && k1 === k2) return true;
  if (Math.min(k1.length, k2.length) >= 3 && window.harfFarki(k1, k2) <= 1) return true;
  const fark = window.harfFarki(hedef, soylenen);
  if (hedef.length <= 3) return fark <= 1 && hedef[0] === soylenen[0];
  if (hedef.length <= 7) return fark <= 2;
  return fark <= 3;
};

// Konuşma kontrolü: hedefteki kelimelerin en az %75'i yakın eşleşirse doğru (tek kelimede o kelime).
window.isLenientMatch = function(target, spoken) {
  const targetWords = window.normalizePhrase(target);
  const spokenWords = window.normalizePhrase(spoken);
  if (!targetWords.length || !spokenWords.length) return false;
  const eslesen = targetWords.filter(t => spokenWords.some(s => window.yakinKelime(t, s))).length;
  if (eslesen / targetWords.length >= 0.75) return true;
  // Kelimeler bitişik/ayrık anlaşıldıysa (ör. "icecream" / "ice cream") bütün olarak karşılaştır
  const birlesikHedef = targetWords.join(''), birlesikSoylenen = spokenWords.join('');
  return birlesikHedef.length > 3 && window.harfFarki(birlesikHedef, birlesikSoylenen) <= Math.max(1, Math.floor(birlesikHedef.length / 5));
};

window.diceSimilarity = function(a, b) {
  const makeTri = str => {
    const c = str.replace(/\s+/g, ' ').toLowerCase();
    if (c.length < 3) return [c];
    const out = [];
    for (let i = 0; i < c.length - 2; i++) out.push(c.slice(i, i + 3));
    return out;
  };
  const ta = makeTri(a), tb = makeTri(b);
  const counts = new Map();
  for (const x of ta) counts.set(x, (counts.get(x) || 0) + 1);
  let intersect = 0;
  for (const x of tb) {
    if (counts.has(x) && counts.get(x) > 0) {
      intersect++;
      counts.set(x, counts.get(x) - 1);
    }
  }
  return (2 * intersect) / (ta.length + tb.length);
};

window.buildMismatchHint = function(target, spoken, suffix = '') {
  const targetWords = window.normalizePhrase(target);
  const spokenWords = window.normalizePhrase(spoken);
  const spokenSet = new Set(spokenWords);
  const missing = targetWords.filter(w => {
    let matched = spokenSet.has(w);
    if (!matched && window.HOMOPHONES[w]) {
      matched = window.HOMOPHONES[w].some(h => spokenSet.has(h));
    }
    return !matched;
  });
  if (missing.length === 0) return `Heard: "${spoken}". ${suffix}`;
  return `Heard: "${spoken}". Please say: ${missing.join(', ')}. ${suffix}`;
};
