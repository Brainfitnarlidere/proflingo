// Koddaki tüm görsel/ses yollarının diskte var olduğunu kontrol eder.
// Kullanım: node tools/audit_assets.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const files = ['index.html', 'css/style.css', ...fs.readdirSync(path.join(root, 'js')).filter(f => f.endsWith('.js')).map(f => 'js/' + f)];
const re = /(?:\.\.\/)?((?:images|audio)\/[^'"`()\s]+\.(?:webp|png|jpe?g|svg|gif|wav|ogg|mp3))/g;
let missing = 0, total = 0;
for (const f of files) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  for (const m of src.matchAll(re)) {
    total++;
    if (!fs.existsSync(path.join(root, m[1]))) { missing++; console.log(`EKSİK: ${m[1]}  (${f})`); }
  }
}
console.log(`${total} referans, ${missing} eksik`);
process.exit(missing ? 1 : 0);
