'use strict';
// Hazır ses kayıtlarının (ElevenLabs) anahtarı. Hem tarayıcı (js/speech.js) hem üretim betiği
// (tools/elevenlabs_uret.js) bu dosyayı kullanır; iki tarafın aynı metne aynı anahtarı
// vermesi gerekir. rol: 'm' (erkek) | 'f' (kadın), hiz: 'n' (normal) | 's' (yavaş).
(function (g) {
  const EMOJI = /(©|®|[ -㌀]|\ud83c[퀀-\udfff]|\ud83d[퀀-\udfff]|\ud83e[퀀-\udfff])/g;
  g.sesMetniTemizle = function (text) {
    return String(text == null ? '' : text).replace(EMOJI, '').replace(/\s+/g, ' ').trim();
  };
  g.sesKaydiAnahtari = function (text, rol, hiz) {
    return (rol === 'f' ? 'f' : 'm') + (hiz === 's' ? 's' : 'n') + '|' + g.sesMetniTemizle(text);
  };
})(typeof window !== 'undefined' ? window : globalThis);
