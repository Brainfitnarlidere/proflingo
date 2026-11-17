// index.html'deki yerel CSS/JS bağlantılarına içeriğe göre sürüm etiketi ekler (?v=xxxxxxxx).
// Dosya değişince etiket değişir ve tarayıcı eski kopyayı önbellekten kullanamaz.
// Kullanım: node tools/surum.js          (günceller)
//           node tools/surum.js --kontrol (sadece kontrol; eskiyse çıkış kodu 1)
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const re = /(<(?:script|link)\b[^>]*?\b(?:src|href)=")((?:js|css)\/[^"?]+\.(?:js|css))(?:\?v=[^"]*)?(")/g;
let eski = 0;
const yeni = html.replace(re, (m, a, file, b) => {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) return m;
  const v = crypto.createHash('md5').update(fs.readFileSync(full)).digest('hex').slice(0, 8);
  const out = `${a}${file}?v=${v}${b}`;
  if (out !== m) eski++;
  return out;
});
if (process.argv.includes('--kontrol')) {
  console.log(eski ? `⚠ ${eski} dosyanın sürüm etiketi eski: node tools/surum.js` : '✓ Sürüm etiketleri güncel');
  process.exit(eski ? 1 : 0);
}
if (yeni !== html) fs.writeFileSync(indexPath, yeni);
console.log(`${eski} sürüm etiketi güncellendi.`);
