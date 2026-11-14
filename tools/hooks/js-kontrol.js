// Claude Code hook'u: bir .js dosyası düzenlenince sözdizimini kontrol eder.
// Hata varsa (çıkış kodu 2) mesaj Claude'a gösterilir ve hemen düzeltmesi istenir.
let input = '';
process.stdin.on('data', c => (input += c));
process.stdin.on('end', () => {
  let file;
  try { file = JSON.parse(input).tool_input.file_path; } catch (e) { process.exit(0); }
  if (!file || !file.endsWith('.js')) process.exit(0);
  const r = require('child_process').spawnSync('node', ['--check', file], { encoding: 'utf8' });
  if (r.status !== 0) {
    process.stderr.write(`Sözdizimi hatası (${file}):\n${r.stderr}\nDosyayı hemen düzelt.`);
    process.exit(2);
  }
  process.exit(0);
});
