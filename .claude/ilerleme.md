# İlerleme kaydı

Her oturumun sonunda proje lideri en üste kısa bir kayıt ekler (en yeni üstte).
Format: tarih — ne yapıldı — test sonucu — açık kalanlar. Eski kayıtlar silinmez.

## 2026-11-24 — n8n kaldırıldı
- Kullanıcı isteği: n8n yerine sürekli çalışan bir çözüm. js/usage.js artık dışarıya istek atmıyor (sadece yerel sayaç + 30 dk tebriki); süreyi zaten oturum takibi (Supabase) ölçüyor. oturum_takibi.sql'e gunluk_kullanim görünümü eklendi. n8n_dogrulama.md silindi. Testler 24/24.

## 2026-11-24 — Kayıt e-postası ve genel kontrol
- Kayıtta e-posta gitmemesinin nedeni: Supabase'de Confirm email kapalı (mailer_autoconfirm=true) ve özel SMTP yok. Kod tarafı doğruydu; ayar adımları + Türkçe şablonlar: supabase/eposta_ayarlari.md (SUPA-2, kullanıcıda).
- Eklendi: "Şifremi unuttum" (kodla ya da e-postadaki linkle yeni şifre), onay kodu 6-10 hane kabul ediliyor, giriş düğmesi yazısı düzeltildi. Testler 24/24 (3 yeni).
- Genel kontrol: canlı site yerelle aynı sürüm, RLS ve XP fonksiyonları girişsiz kapalı. Bulunan: oturumlar tablosu canlıda yok (SUPA-3), n8n.brainfitnarlidere.com DNS'te yok (N8N-1), DATA-1 uyarıları sürüyor. Ses tanıma testi yük altında bir kez kırıldı, tekrarda geçti (kararsız test).

## 2026-11-24 — Bütün bölümler ElevenLabs ile seslendirildi
- 1.310 yeni kayıt (~19.900 karakter; toplam 1.338, ~19 MB). Kural: bölüm verisindeki en az 3 kelimelik cümleler Matilda, kelime/soru/talimat Liam; çift soru-cevap bölümlerinde soru erkek, cevap kadın.
- Tarayıcı taraması: bütün bölümlerde 7.172 okuma kayıtla çaldı. 22 eksik çıktı; nedeni kart hoparlörünün iki kez bağlanmasıydı (main.js soru ve cevabı birleşik okuyordu), main.js'teki fazla dinleyici kaldırıldı, tekrar taramada eksik yok.
- Testler: cümle/kelime ses kuralı testi eklendi.

## 2026-11-22 — Günlük süre sınırı kaldırıldı
- Kullanıcı isteği: 30 dakika dolunca bölüm açılmıyordu (core.js startChapter → limit ekranı). Kilit kaldırıldı; 30 dk tebrik bildirimi ve n8n 'goal_reached' kaldı. Test eklendi (eski kodla kırıldığı doğrulandı). Testler 20/20.

## 2026-11-22 — ElevenLabs seslendirme (6. bölüm deneme)
- js/speech.js: metnin hazır kaydı varsa (js/ses-kayitlari.js → audio/tts/*.mp3) tek oynatıcıyla çalar; kayıt yoksa ya da açılamazsa eskisi gibi tarayıcı sesi. Kaydı olmayan metinler window.__eksikSesler'de.
- tools/elevenlabs_uret.js (+ tools/ses-ayarlari.json): sadece eksik kayıtları üretir; anahtar proje dışında (~/.proflingo/elevenlabs.env). Sesler Liam + Matilda, hız 0.9 / yavaş 0.7.
- 6. bölüm üretildi (28 kayıt); tarayıcıda bütün kart ve sorular kayıtla okundu, tarayıcı sesine düşen olmadı. Testler 19/19.
- Açık: kullanıcı 6. bölümü dinleyince `node tools/elevenlabs_uret.js --hepsi` (~1.360 kayıt, ~20.600 karakter). İtalyanca henüz yok.

## 2026-11-17 (08:00) — Ses, puan ve konuşma tanıma
- Okuma: tek kaynak (tarayıcı sesi), sabit ses + sabit düzey (eskiden sözlük kayıtları ve rastgele ses karışıyordu).
- Puan: soru türüne göre (10/15/20/25), eşleştirmelerde her eşleşme +5; sunucu sınırı 75/soru + 1000 (SUPA-4, 52 bölümde mükemmel oyun sınırın altında kaldığı hesaplandı).
- Her soruda tek tekrar düğmesi, İngilizce "🔊 Repeat".
- Konuşma: dinlerken müzik susar, 5 tahmin, takılmayan mikrofon, yakın ses kapısı (uzak ses can götürmez), okunuş benzerliği (eye = i = hi = high), "Doğru söyledin!". Gerçek yakın-ses odaklı tanıma ASR-1.
- Testler 18/18; yeni testlerin eski kodla kırıldığı doğrulandı.

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
