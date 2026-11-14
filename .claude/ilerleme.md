# İlerleme kaydı

Her oturumun sonunda proje lideri en üste kısa bir kayıt ekler (en yeni üstte).
Format: tarih — ne yapıldı — test sonucu — açık kalanlar. Eski kayıtlar silinmez.

## 2026-11-15 — Başlangıç (Claude ile elle yapıldı)
- Giriş sistemi Supabase Auth'a döndürüldü (düz metin şifre kaldırıldı), onay formu hatası düzeltildi.
- XP/seri/market sunucu fonksiyonlarına taşındı (`supabase/xp_guvenlik.sql`); market ve Winner Mode XP hataları düzeltildi.
- Görseller WebP'ye çevrildi (236 MB → 11 MB), kullanılmayan ~5.300 satır silindi, `game.js` 8 dosyaya bölündü.
- Bölüm 49 ve 51'in açılırken çökmesi düzeltildi.
- Testler: `npm test` 9/9 geçti (sahte Supabase ile). Gerçek Supabase'de henüz denenmedi.
- Açık: `.claude/is-listesi.json` (SUPA-1, N8N-1 kullanıcıda; LEGAL-1, ASSET-1, DATA-1 ekipte).
