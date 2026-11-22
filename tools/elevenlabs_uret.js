// Uygulamada okunan metinlerin ElevenLabs kayıtlarını üretir: audio/tts/*.mp3 + js/ses-kayitlari.js
// Sadece eksik kayıtları üretir (var olan dosya tekrar ücretlendirilmez).
//
// Kullanım:
//   node tools/elevenlabs_uret.js --bolum 6          (tek bölüm; virgülle birden fazla: --bolum 6,7)
//   node tools/elevenlabs_uret.js --hepsi            (bütün İngilizce bölümler)
//   node tools/elevenlabs_uret.js --bolum 6 --kuru   (sadece say: kaç kayıt, kaç karakter; API çağrısı yok)
//
// Anahtar: ELEVENLABS_API_KEY ortam değişkeni ya da ~/.proflingo/elevenlabs.env
// (proje klasöründe tutulmaz; sync.sh onu GitHub'a gönderemez). Ayarlar: tools/ses-ayarlari.json
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
const root = path.join(__dirname, '..');
global.window = global;
require(path.join(root, 'js/ses-anahtar.js'));
require(path.join(root, 'js/content.js'));
const AYAR = JSON.parse(fs.readFileSync(path.join(__dirname, 'ses-ayarlari.json'), 'utf8'));
const KLASOR = path.join(root, 'audio/tts');
const LISTE_DOSYASI = path.join(root, 'js/ses-kayitlari.js');

const arg = process.argv.slice(2);
const kuru = arg.includes('--kuru');
const bolumArg = arg.includes('--bolum') ? arg[arg.indexOf('--bolum') + 1] : null;
const bolumler = arg.includes('--hepsi')
  ? Object.keys(window.CHAPTER_DATA).map(Number)
  : (bolumArg || '').split(',').map(Number).filter(Boolean);
if (!bolumler.length) { console.log('Bölüm seçin: --bolum 6  ya da  --hepsi'); process.exit(1); }

// Çok öğeli sorularda okunan sabit talimatlar (js/game/questions.js) ve varsayılan soru
const SABIT_TALIMATLAR = ['Match the pairs!', 'Complete the scene!', 'Match the 9 pairs!',
  'Reaction Game: Click the correctly named visuals!', 'What do you see?'];
const CIFT_SORU_CEVAP = [33, 34, 38, 39, 40, 41, 42];   // soru erkek, cevap kadın sesle

// Bir bölümde okunabilecek bütün metinler: [rol, hiz, metin]
function bolumMetinleri(id) {
  const ch = window.CHAPTER_DATA[id];
  if (!ch) { console.log(`Bölüm ${id} yok, atlandı.`); return []; }
  const out = [];
  const ekle = (rol, hiz, metin) => { if (window.sesMetniTemizle(metin)) out.push([rol, hiz, metin]); };
  for (const d of Object.values(ch.items || {})) {
    const { word, sentence } = d;
    ekle('m', 'n', word);
    if (ch.isQAMode) {
      ekle('m', 'n', sentence); ekle('m', 'n', 'Find ' + sentence);
      ekle('m', 's', word + ' ... ' + sentence);
      if (CIFT_SORU_CEVAP.includes(id)) ekle('f', 'n', sentence);
    } else {
      ekle('m', 'n', 'Find ' + word);
      if (sentence) { ekle('m', 'n', sentence); ekle('m', 's', sentence); }
    }
    if (ch.isRepeatMode || ch.isSentenceMode) ekle('m', 's', word);
  }
  (ch.wordPrompts || []).forEach(p => ekle('m', 'n', p));
  SABIT_TALIMATLAR.forEach(p => ekle('m', 'n', p));
  return out;
}

function dosyaAdi(rol, hiz, metin) {
  const ses = AYAR.sesler[rol];
  const iz = [AYAR.model, ses.id, AYAR.hiz[hiz], JSON.stringify(AYAR.ayar), window.sesMetniTemizle(metin)].join('|');
  return crypto.createHash('sha1').update(iz).digest('hex').slice(0, 16) + '.mp3';
}

function listeyiOku() {
  if (!fs.existsSync(LISTE_DOSYASI)) return {};
  const m = fs.readFileSync(LISTE_DOSYASI, 'utf8').match(/window\.SES_KAYITLARI = (\{[\s\S]*\});/);
  return m ? JSON.parse(m[1]) : {};
}
function listeyiYaz(liste) {
  const sirali = Object.fromEntries(Object.entries(liste).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(LISTE_DOSYASI,
    '// Bu dosyayı tools/elevenlabs_uret.js üretir; elle düzenlemeyin.\n' +
    '// Anahtar: js/ses-anahtar.js, değer: audio/tts/ altındaki dosya adı. Listede olmayan metin tarayıcı sesiyle okunur.\n' +
    'window.SES_KAYITLARI = ' + JSON.stringify(sirali, null, 0).replace(/","/g, '",\n"') + ';\n');
}

function anahtariBul() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  const f = path.join(os.homedir(), '.proflingo', 'elevenlabs.env');
  if (fs.existsSync(f)) {
    const m = fs.readFileSync(f, 'utf8').match(/ELEVENLABS_API_KEY=(\S+)/);
    if (m) return m[1];
  }
  return null;
}

async function uret(anahtar, rol, hiz, metin, hedef) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${AYAR.sesler[rol].id}?output_format=${AYAR.format}`;
  for (let deneme = 1; deneme <= 4; deneme++) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'xi-api-key': anahtar, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text: window.sesMetniTemizle(metin), model_id: AYAR.model,
        voice_settings: { ...AYAR.ayar, speed: AYAR.hiz[hiz] } })
    });
    if (r.ok) { fs.writeFileSync(hedef, Buffer.from(await r.arrayBuffer())); return; }
    const govde = (await r.text()).slice(0, 200);
    if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 2000 * deneme)); continue; }
    throw new Error(`ElevenLabs ${r.status}: ${govde}`);
  }
  throw new Error('ElevenLabs çok fazla deneme başarısız oldu');
}

(async () => {
  const liste = listeyiOku();
  const gorulen = new Set(), isler = [];
  for (const id of bolumler) {
    for (const [rol, hiz, metin] of bolumMetinleri(id)) {
      const anahtar = window.sesKaydiAnahtari(metin, rol, hiz);
      if (gorulen.has(anahtar)) continue;
      gorulen.add(anahtar);
      const ad = dosyaAdi(rol, hiz, metin);
      if (liste[anahtar] === ad && fs.existsSync(path.join(KLASOR, ad))) continue;
      isler.push({ anahtar, rol, hiz, metin, ad });
    }
  }
  const karakter = isler.reduce((t, i) => t + window.sesMetniTemizle(i.metin).length, 0);
  console.log(`Bölüm: ${bolumler.join(', ')} | toplam metin: ${gorulen.size} | üretilecek: ${isler.length} (${karakter} karakter)`);
  if (kuru || !isler.length) return;

  const anahtar = anahtariBul();
  if (!anahtar) { console.log('Anahtar bulunamadı: ~/.proflingo/elevenlabs.env'); process.exit(1); }
  fs.mkdirSync(KLASOR, { recursive: true });
  let bitti = 0, hata = 0;
  const kuyruk = isler.slice();
  const calisan = async () => {
    while (kuyruk.length) {
      const i = kuyruk.shift();
      try {
        await uret(anahtar, i.rol, i.hiz, i.metin, path.join(KLASOR, i.ad));
        liste[i.anahtar] = i.ad;
        bitti++;
        if (bitti % 20 === 0) { listeyiYaz(liste); console.log(`  ${bitti}/${isler.length}`); }
      } catch (e) { hata++; console.log(`  ✗ ${i.anahtar}: ${e.message}`); if (/40[13]/.test(e.message)) kuyruk.length = 0; }
    }
  };
  await Promise.all([calisan(), calisan(), calisan()]);
  listeyiYaz(liste);
  console.log(`Bitti: ${bitti} kayıt üretildi${hata ? `, ${hata} hata` : ''}. Sonra: node tools/surum.js`);
  process.exit(hata ? 1 : 0);
})();
