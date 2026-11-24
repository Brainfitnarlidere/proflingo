'use strict';
// Hazır ses kayıtlarının (ElevenLabs) anahtarı. Hem tarayıcı (js/speech.js) hem üretim betiği
// (tools/elevenlabs_uret.js) bu dosyayı kullanır; iki tarafın aynı metne aynı anahtarı
// vermesi gerekir. rol: 'm' (erkek) | 'f' (kadın), hiz: 'n' (normal) | 's' (yavaş).
(function (g) {
  const EMOJI = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  g.sesMetniTemizle = function (text) {
    return String(text == null ? '' : text).replace(EMOJI, '').replace(/\s+/g, ' ').trim();
  };
  // dil: 'en' (varsayılan, öneksiz) | 'it' ("it:" öneki). Aynı yazılan kelime iki dilde ayrı kayıttır (Banana).
  g.sesKaydiAnahtari = function (text, rol, hiz, dil) {
    return (dil === 'it' ? 'it:' : '') + (rol === 'f' ? 'f' : 'm') + (hiz === 's' ? 's' : 'n') + '|' + g.sesMetniTemizle(text);
  };
  // Kim okur: bölümlerdeki cümleler (en az 3 kelimelik örnek cümle / cevap) kadın sesle (Matilda),
  // kelimeler, sorular ve talimatlar erkek sesle (Liam). Soru-cevap bölümlerinde soru erkek,
  // cevap kadın sesle okunur (o çağrılar sesi kendisi seçer).
  let cumleler = null;
  g.cumleSesiMi = function (text) {
    if (!cumleler) {
      cumleler = new Set();
      for (const ch of Object.values(g.__ORIGINAL_EN_DATA || g.CHAPTER_DATA || {})) {
        for (const d of Object.values(ch.items || {})) {
          const c = g.sesMetniTemizle(d.sentence);
          if (c && !c.includes('[') && c.split(' ').length >= 3) cumleler.add(c);
        }
      }
    }
    return cumleler.has(g.sesMetniTemizle(text));
  };
})(typeof window !== 'undefined' ? window : globalThis);
