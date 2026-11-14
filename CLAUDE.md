# Prof Lingo (lingua-visual) — proje bilgisi

Görsel eşleştirmeyle dil öğreten web uygulaması. Arayüz Türkçe; öğretilen dil İngilizce
(İtalyanca başlangıç aşamasında). Ayrıntılı ürün tanımı: `LinguaVisual_Specification.md`.

## Yapı
- Derleme yok: düz HTML + CSS + JavaScript. Giriş noktası `index.html`.
- `js/content.js` İngilizce bölümler (CHAPTER_DATA, CHAPTERS), `js/content_it.js` İtalyanca.
- `js/game/` oyun motoru: `core.js` (durum, bölüm başlatma), `questions.js` (soru üretimi),
  `quiz.js` (akış, doğru/yanlış, bölüm sonu), `question-types.js` (temel soru tipleri),
  `memory-match.js`, `falling-visuals.js`, `drag-drop-scene.js`, `winner-mode.js` (mini oyunlar).
- `js/ui.js` ekranlar, `js/main.js` olaylar ve açılış, `js/store.js` kullanıcı ve XP/market
  çağrıları, `js/auth.js` Supabase Auth girişi, `js/usage.js` n8n'e kullanım süresi,
  `js/speech.js` seslendirme.
- Fonksiyonlar `window.` üzerinde global; dosyalar `<script>` sırasıyla yüklenir.
- `images/` WebP görseller (yeni görsel: PNG koy, `python3 tools/convert_webp.py` çalıştır,
  koddaki yolu `.webp` yap), `audio/` sesler.
- `supabase/`: `auth_fix.sql` (giriş + RLS), `xp_guvenlik.sql` (XP/market sunucu fonksiyonları),
  `n8n_dogrulama.md`.

## Komutlar
- Hepsi birden (her oturum başında): `node tools/kontrol.js` (`--hizli`: tarayıcısız)
- Sözdizimi: `node --check js/<dosya>.js` (düzenlemelerde hook otomatik yapar)
- Testler: `npm test` (Playwright, internetsiz; sahte Supabase: `tests/helpers/`)
- Bölüm verisi kontrolü: `node tools/validate_data.js`
- Görsel/ses yolları kontrolü: `node tools/audit_assets.js`

## Güvenlik ve veri
- Supabase anon anahtarı istemcide herkese açıktır; güvenliği RLS kuralları sağlar.
- XP, seri, tamamlanan bölümler ve ödüller tarayıcıdan doğrudan yazılamaz; sadece
  `complete_chapter` / `redeem_reward` veritabanı fonksiyonlarıyla değişir. Market fiyatı
  değişirse hem `js/content.js` (REWARDS) hem `supabase/xp_guvenlik.sql` güncellenir.
  RLS'i kapatan, şifreyi tabloda tutan ya da başka kullanıcının verisini okuyan kod yazılmaz.
- Kişisel veri (ad, e-posta, telefon) loglara/raporlara yazılmaz. KVKK onayı kayıtta zorunlu.

## Git
- `sync.sh` her 5 dakikada `git add .` + commit + push yapar; ajanlar bunu çalıştırmaz.
- GitHub'a gönderimi kullanıcı yapar.

## Hafıza (oturumlar arası)
- `.claude/is-listesi.json`: işler ve durumları (ajanlar sadece `durum`/`not` değiştirir).
- `.claude/ilerleme.md`: her oturumun kısa kaydı (en yeni üstte).

## Ajan ekibi
Ana oturum `proje-lideri` ajanıyla açılır (`.claude/settings.json`). Ekip ve akış:
`AJANLAR.md`. Ajanların çalışma dosyaları `.claude/calisma/` altındadır (git'e girmez).
