# İlerleme kaydı

Her oturumun sonunda proje lideri en üste kısa bir kayıt ekler (en yeni üstte).
Format: tarih — ne yapıldı — test sonucu — açık kalanlar. Eski kayıtlar silinmez.

## 2026-11-17 (sabah) — Oyun testinden gelen düzeltmeler
- Winner Mode artık canlar doluyken kazanılan her ekstra canda açılıyor (eskiden bölüm başına bir kez); bitince sıradaki soruya geçiliyor.
- Okunmayan 46 soru (eşleştirme, hafıza, sahne, 10'lu liste) artık talimatı okuyor; her soruya "🔊 Tekrar dinle" düğmesi eklendi.
- Testler 11/11 (eski kodla yeni testler kırılıyor, doğrulandı). Seslendirme değişikliği VOICE-1 olarak beklemede (Higgsfield üyeliği).
- Canlıda yeni HTML + eski JS karışıyordu (10 dk önbellek): tools/surum.js ile ?v= etiketleri; kontrol.js ve sync.sh bunu denetliyor.
- Ses: kelime seçme sorusu artık cevabı söylemiyor; görsel seçmede "Find X"; aynı anda tek ses (eski kodda yavaş internette 4 ses üst üste çalıyordu).
- Oturum takibi: js/oturum.js + supabase/oturum_takibi.sql (giriş zamanı, aktif süre, kullanici_aktivite görünümü). SQL kullanıcıda (SUPA-3). Testler 13/13.

## 2026-11-17 — Baştan sona kontrol (Claude ile elle)
- GitHub ile birleştirme: GitHub'daki geçmiş web yüklemelerinden oluşuyordu; CNAME (proflingo.com) korunarak birleştirildi, node_modules git takibinden çıkarıldı. Push yapıldı.
- Canlı site (proflingo.com) yeni sürümü yüklüyor: js/game/*, WebP, yeni giriş; girişsiz profil okuma 0 satır, complete_chapter/redeem_reward girişsiz reddediliyor.
- Yerel: kontrol.js SAĞLAM; değişmemiş dosya yok.
- Şehir sahnesi arka planı (images/bg/city_bg.webp) çizildi, 52. bölüme bağlandı, hizası düzeltildi (ASSET-1 tamam). Testler 9/9.
- Bulunan: Supabase'de e-posta onayı kapalı (SUPA-2); diğer sahnelerde nokta hizası kayıyordu (SCENE-1, aynı gün düzeltildi; ayrıca 50/52'de yanlış arka plan hatası giderildi). Hâlâ açık: N8N-1, LEGAL-1, ASSET-1, DATA-1, VENDOR-1.

## 2026-11-15 — Başlangıç (Claude ile elle yapıldı)
- Giriş sistemi Supabase Auth'a döndürüldü (düz metin şifre kaldırıldı), onay formu hatası düzeltildi.
- XP/seri/market sunucu fonksiyonlarına taşındı (`supabase/xp_guvenlik.sql`); market ve Winner Mode XP hataları düzeltildi.
- Görseller WebP'ye çevrildi (236 MB → 11 MB), kullanılmayan ~5.300 satır silindi, `game.js` 8 dosyaya bölündü.
- Bölüm 49 ve 51'in açılırken çökmesi düzeltildi.
- Testler: `npm test` 9/9 geçti (sahte Supabase ile). Gerçek Supabase'de henüz denenmedi.
- Açık: `.claude/is-listesi.json` (SUPA-1, N8N-1 kullanıcıda; LEGAL-1, ASSET-1, DATA-1 ekipte).
