// Projenin hızlı sağlık kontrolü. Her oturumun başında ve iş bitince çalıştırılır.
// Kullanım: node tools/kontrol.js          (tarayıcı testleri dahil)
//           node tools/kontrol.js --hizli  (tarayıcı testleri hariç)
// Çıkış kodu: 0 = sağlam, 1 = bozuk (sözdizimi hatası veya başarısız test).
const { spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const run = (cmd, args) => spawnSync(cmd, args, { cwd: root, encoding: 'utf8' });
let bozuk = false;

// 1) Sözdizimi
const jsFiles = [];
const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).forEach(e => {
  const rel = path.join(d, e.name);
  if (e.isDirectory()) walk(rel); else if (e.name.endsWith('.js')) jsFiles.push(rel);
});
['js', 'tools', 'tests'].forEach(d => fs.existsSync(path.join(root, d)) && walk(d));
const syntaxErr = jsFiles.filter(f => run('node', ['--check', f]).status !== 0);
console.log(syntaxErr.length ? `✗ Sözdizimi hatası: ${syntaxErr.join(', ')}` : `✓ Sözdizimi: ${jsFiles.length} dosya`);
if (syntaxErr.length) bozuk = true;

// 2) Bölüm verisi ve dosya yolları (bilinen sorunlar .claude/is-listesi.json'da; uyarı olarak gösterilir)
const data = run('node', ['tools/validate_data.js']);
const dataErr = (data.stdout.match(/^ - .*/gm) || []);
console.log(dataErr.length ? `⚠ Bölüm verisi: ${dataErr.length} uyarı\n${dataErr.join('\n')}` : '✓ Bölüm verisi');
const assets = run('node', ['tools/audit_assets.js']);
const missing = (assets.stdout.match(/^EKSİK: .*/gm) || []);
console.log(missing.length ? `⚠ Eksik dosya: ${missing.length}\n${missing.join('\n')}` : '✓ Görsel/ses yolları');

// 3) Sürüm etiketleri (eskiyse canlıda yeni HTML ile eski JS karışır)
const surum = run('node', ['tools/surum.js', '--kontrol']);
console.log(surum.stdout.trim());
if (surum.status !== 0) bozuk = true;

// 4) Tarayıcı testleri
if (!process.argv.includes('--hizli')) {
  const t = spawnSync('npx', ['playwright', 'test', '--reporter=line'], { cwd: root, encoding: 'utf8', env: process.env });
  const out = (t.stdout || '') + (t.stderr || '');
  const sum = out.match(/\d+ (passed|failed)[^\n]*/g) || [];
  if (t.status === 0) console.log(`✓ Tarayıcı testleri: ${sum.join(', ')}`);
  else {
    bozuk = true;
    console.log(`✗ Tarayıcı testleri: ${sum.join(', ') || 'çalıştırılamadı'}`);
    if (/Executable doesn't exist|browserType.launch/.test(out)) console.log('  → Tarayıcı kurulu değil: npx playwright install chromium');
    else console.log(out.split('\n').filter(l => /✘|Error|Expected|Received/.test(l)).slice(0, 15).join('\n'));
  }
}
console.log(bozuk ? '\nSONUÇ: BOZUK' : '\nSONUÇ: SAĞLAM');
process.exit(bozuk ? 1 : 0);
