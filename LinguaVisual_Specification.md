ses # LinguaVisual — Kapsamlı Uygulama Spesifikasyon Dokümanı

## 1. Genel Bakış

| Alan | Detay |
|------|-------|
| **Uygulama Adı** | LinguaVisual |
| **Amaç** | Görsel eşleştirme yöntemiyle dil öğretimi. Kullanıcının anadili kullanılmaz — sadece hedef dil + görsel eşleştirmesi yapılır. |
| **Hedef Kitle** | Gençler ve yetişkinler (13+ yaş) |
| **Platform** | Mobil uygulama (iOS + Android) — React Native veya Flutter |
| **Arayüz Dili** | Türkçe (ileride başka diller eklenebilir altyapıda) |
| **Öğretilen Diller** | İngilizce (aktif), İtalyanca / İspanyolca / Almanca ("Çok Yakında" olarak gösterilecek) |

---

## 2. Kullanıcı Akışı (User Flow)

### 2.1 İlk Açılış (Onboarding)
1. **Karşılama slaytları** (2-3 sayfa): Uygulamanın ne yaptığını ve nasıl çalıştığını anlatan kısa görsel tanıtım
2. **Kayıt ekranı**: Email + şifre ile hesap oluşturma
3. **Seviye belirleme testi**: Kullanıcının mevcut dil bilgisini ölçen kısa bir test. Sonuca göre başlangıç seviyesi belirlenir (tamamen yeni başlayan ise Bölüm 1'den başlar, bilgisi varsa ileri bölümlerden)

### 2.2 Kayıtlı Kullanıcı Girişi
- Eğer kullanıcı daha önce kayıt olmuşsa, onboarding slaytları ve seviye testi atlanır
- Direkt **giriş ekranı** (email + şifre) gösterilir
- Giriş sonrası ana ekrana yönlendirilir

### 2.3 Ana Ekran — Yol Haritası (MentalUP Tarzı)
- Ekranda bir **yol/patika** görseli bulunur
- Yol üzerinde her bölüm bir **durak noktası** (ev, bina, ada vb.) olarak gösterilir
- Bir **karakter** (avatar) yol üzerinde kullanıcının bulunduğu bölümde durur
- Tamamlanan bölümler renkli/aktif, kilitli bölümler soluk/kilitli görünür
- Karakter ilerledikçe bir sonraki durağa animasyonlu olarak hareket eder
- Üst kısımda: XP puanı, streak sayacı, can sayısı, profil ikonu

### 2.4 Bölüm İçi Akış
Her bölüm 2 aşamadan oluşur:

**Aşama 1 — Öğrenme (Flashcard):**
- Her kelime tek tek gösterilir: büyük görsel + İngilizce kelime
- Kart çevirme animasyonu ile önce görsel, sonra kelime gösterilir
- Kullanıcı "İleri" butonuna basarak sonraki karta geçer
- Tüm kartlar görüldükten sonra sınav aşamasına geçilir

**Aşama 2 — Sınav (Quiz):**
- 4 farklı soru tipinden rastgele sorular sorulur (detaylar Bölüm 5'te)
- Her kelime en az 2 kez test edilir
- **Yanlış cevaplarda doğru cevap GÖSTERİLMEZ** — kullanıcıya tekrar tıklama şansı verilir, doğru bulana kadar deneyebilir
- Yanlış her deneme XP puanı düşürür ve can kaybettirir
- Sınav sonunda sonuç ekranı gösterilir

**Aşama 3 — Sonuç:**
- Doğru/yanlış sayısı ve yüzde başarı gösterilir
- %80+ başarı → sonraki bölüm açılır, karakter haritada ilerler
- %80 altı → bölüm tekrar edilebilir

### 2.5 Tekrar Bölümü (Review)
- **Her bölüm tamamlandığında**, önceki TÜM bölümlerin karması olan bir **tekrar bölümü** otomatik olarak oluşturulur
- Bu tekrar bölümü, tüm önceki bölümlerden rastgele sorular içerir
- Eğer kullanıcı belirli bir bölümün sorularında çok yanlış yapıyorsa, uygulama **o bölümü tekrar etmeyi önerir**
- Kullanıcı isterse o bölümü tekrar edebilir (zorunlu değil, isteğe bağlı)

---

## 3. Ders İçerikleri (28 Bölüm)

Her bölümde 8-10 adet kelime/kavram bulunur. Her öğe için: İngilizce kelime + temsili görsel (illüstrasyon/ikon).

### Temel Seviye (Bölüm 1-10)

| # | Konu | İçerik Örnekleri |
|---|------|-----------------|
| 1 | 🎨 Colors | Red, Blue, Green, Yellow, Orange, Purple, Pink, Black, White, Brown |
| 2 | 🔢 Numbers (1-20) | One, Two, Three... Twenty (sayılara karşılık gelen nokta/obje görselleri) |
| 3 | 🍎 Fruits & Vegetables | Apple, Banana, Orange, Tomato, Carrot, Grape, Strawberry, Potato, Onion, Lemon |
| 4 | 🐾 Animals | Cat, Dog, Bird, Fish, Horse, Elephant, Lion, Rabbit, Bear, Monkey |
| 5 | 👕 Clothing | Shirt, Pants, Shoes, Hat, Dress, Jacket, Socks, Glasses, Scarf, Gloves |
| 6 | 🦵 Body Parts | Head, Hand, Eye, Ear, Nose, Mouth, Leg, Foot, Arm, Finger |
| 7 | 👨‍👩‍👧 Family | Mother, Father, Sister, Brother, Baby, Grandmother, Grandfather, Uncle, Aunt, Cousin |
| 8 | 🌤️ Weather | Sunny, Rainy, Cloudy, Snowy, Windy, Stormy, Foggy, Hot, Cold, Warm |
| 9 | 🍽️ Food & Drinks | Bread, Water, Milk, Egg, Rice, Cheese, Chicken, Coffee, Tea, Juice |
| 10 | 🏠 Rooms & Furniture | Kitchen, Bedroom, Bathroom, Table, Chair, Bed, Sofa, Door, Window, Mirror |

### Orta Seviye (Bölüm 11-17)

| # | Konu | İçerik Örnekleri |
|---|------|-----------------|
| 11 | 😊 Emotions & Feelings | Happy, Sad, Angry, Scared, Tired, Surprised, Excited, Bored, Nervous, Proud |
| 12 | 🏃 Daily Actions | Eat, Drink, Sleep, Walk, Run, Read, Write, Cook, Drive, Work |
| 13 | 🚗 Vehicles & Transport | Car, Bus, Train, Bicycle, Airplane, Boat, Motorcycle, Taxi, Truck, Helicopter |
| 14 | 💼 Jobs & Professions | Doctor, Teacher, Engineer, Chef, Police, Firefighter, Pilot, Farmer, Artist, Nurse |
| 15 | 🏫 Places in City | School, Hospital, Market, Bank, Park, Library, Restaurant, Airport, Station, Pharmacy |
| 16 | ⏰ Time & Days | Monday-Sunday, January-December, Morning, Afternoon, Evening, Night, Today, Tomorrow, Yesterday |
| 17 | 🧭 Directions | Left, Right, Straight, Up, Down, Near, Far, Behind, In front of, Between |

### İleri Seviye (Bölüm 18-23) — Cümle/İfade Bazlı

| # | Konu | İçerik Örnekleri |
|---|------|-----------------|
| 18 | 👋 Greetings & Phrases | Hello, Goodbye, Please, Thank you, Sorry, How are you?, Nice to meet you, Good morning, Good night, See you later |
| 19 | 🛒 Shopping Phrases | How much?, Too expensive, I want this, Credit card, Cash, Receipt, Discount, Size, Color, Bag |
| 20 | 🍽️ Restaurant Phrases | Menu, Order, Bill/Check, Waiter, Delicious, Spicy, Table for two, I'd like..., Water please, No sugar |
| 21 | 🏥 Emergency Phrases | Help!, Call ambulance, I'm lost, Police, Hospital, Fire, Hurt, Medicine, Allergic, Emergency |
| 22 | ✈️ Travel Phrases | Passport, Ticket, Gate, Boarding, Hotel, Reservation, Luggage, Map, Tourist, Where is...? |
| 23 | 📞 Phone & Communication | Call, Message, Email, Internet, Password, App, Download, Send, Receive, Contact |

### Genel Bilgi Seviyesi (Bölüm 24-28)

| # | Konu | İçerik Örnekleri |
|---|------|-----------------|
| 24 | 🌍 Countries & Flags | USA, UK, Germany, France, Spain, Italy, Japan, Turkey, China, Brazil (bayrak görselleriyle) |
| 25 | 🎵 Music & Instruments | Guitar, Piano, Drums, Violin, Flute, Microphone, Song, Concert, Band, Dance |
| 26 | ⚽ Sports | Football, Basketball, Tennis, Swimming, Running, Volleyball, Boxing, Cycling, Yoga, Skiing |
| 27 | 🌿 Nature & Science | Tree, Flower, River, Mountain, Sun, Moon, Star, Cloud, Rain, Ocean |
| 28 | 🎓 School Supplies | Book, Pen, Pencil, Notebook, Eraser, Ruler, Bag, Desk, Board, Computer |

> **NOT**: İlk 2 bölüm (Colors + Numbers) ücretsiz erişime açık. Bölüm 3'ten itibaren abonelik gerekir.

---

## 4. Soru Tipleri (Quiz Modunda)

### Tip 1: Resim → Kelime Seçme
- Ekranda bir **görsel** gösterilir
- Altında **4 İngilizce kelime seçeneği** bulunur
- Kullanıcı doğru kelimeyi seçer
- Yanlış seçerse: seçenek kırmızı titrer, tekrar deneme şansı verilir (doğru cevap gösterilmez)
- Doğru seçerse: yeşil onay animasyonu + XP kazanma

### Tip 2: Kelime → Resim Seçme
- Ekranda bir **İngilizce kelime** gösterilir
- Altında **4 görsel seçeneği** bulunur
- Kullanıcı doğru görseli seçer
- Aynı yanlış/doğru mekanikleri geçerli

### Tip 3: Sürükle-Bırak Eşleştirme
- Ekranda sol tarafta **3-4 görsel**, sağ tarafta **3-4 İngilizce kelime** bulunur
- Kullanıcı görselleri doğru kelimelerin üzerine sürükleyip bırakır
- Doğru eşleştirmeler yeşil olur ve kilitlenir
- Yanlış eşleştirmeler kırmızı titrer ve geri döner

### Tip 4: Dinleme → Resim Seçme
- Ekranda bir **ses butonu** bulunur — basınca İngilizce kelime sesli okunur
- Altında **4 görsel seçeneği** bulunur
- Kullanıcı duyduğu kelimeye ait görseli seçer
- Ses tekrar dinlenebilir (buton tekrar basılabilir)

> **ÖNEMLİ**: Tüm soru tiplerinde yanlış cevap verildiğinde **doğru cevap asla gösterilmez**. Kullanıcı doğru cevabı bulana kadar tekrar deneyebilir. Her yanlış denemede bir can kaybedilir.

---

## 5. Oyunlaştırma (Gamification)

### 5.1 🔥 Günlük Seri (Streak)
- Kullanıcı her gün en az 1 ders tamamlarsa seri devam eder
- Seri sayısı ana ekranda ve profilde görünür
- Seri kaybedilmeden önce bildirim gönderilir
- En uzun seri rekoru profilde gösterilir

### 5.2 ⭐ XP Puan Sistemi
- Her doğru cevap: +10 XP
- İlk denemede doğru cevap: +15 XP (bonus)
- Bir bölümü tamamlama: +50 XP bonus
- Tekrar bölümünü tamamlama: +30 XP bonus
- Yanlış cevap: XP kazanılmaz

### 5.3 🏆 Rozetler / Başarımlar
Örnek rozetler:
- 🌟 "İlk Adım" — İlk dersi tamamla
- 🔥 "Ateş Serisi" — 7 gün üst üste giriş yap
- 💯 "Mükemmel Skor" — Bir sınavda %100 al
- 📚 "Kitap Kurdu" — 10 bölümü tamamla
- 🏆 "Yarı Yolda" — 14 bölümü tamamla
- 👑 "Usta" — Tüm 28 bölümü tamamla
- 🔄 "Tekrarcı" — 5 tekrar bölümünü tamamla
- ❤️ "Dayanıklı" — Hiç can kaybetmeden bir bölümü bitir

### 5.4 ❤️ Can Sistemi
- Kullanıcı **5 canla** başlar
- Her yanlış cevap **1 can** kaybettirir
- Canlar **30 dakikada 1 adet** yenilenir
- Can biterse sınav devam edemez, beklenmeli
- Abonelik kullanıcıları **sınırsız can** seçeneğine sahip olabilir

### 5.5 🗺️ Yol Haritası (Map Journey)
- Ana ekranda bir **yol/patika** görseli bulunur
- Her bölüm yol üzerinde bir **durak** olarak gösterilir (ev, bina, ağaç, ada vb.)
- Kullanıcının **avatarı/karakteri** mevcut bölümünde durur
- Bölüm tamamlandığında karakter sonraki durağa **animasyonlu olarak yürür/hareket eder**
- Tamamlanan duraklar parlak/renkli, kilitli duraklar soluk ve kilitli ikon ile gösterilir
- Yol, yukarıdan aşağıya veya sağdan sola kıvrılarak ilerler
- Her seviye grubu (Temel, Orta, İleri, Genel Bilgi) farklı tema/arka plana sahip olabilir (orman, şehir, uzay vb.)

---

## 6. Tekrar Sistemi (Review)

### 6.1 Bölüm Sonu Tekrar
- Her bölüm tamamlandığında, **önceki TÜM bölümlerin karması** olan bir tekrar bölümü otomatik oluşur
- Bu tekrar, daha önce öğrenilen tüm kelimelerden rastgele sorular içerir
- Yeni öğrenilen kelimeler daha sık sorulur (ağırlıklı rastgele)

### 6.2 Zayıf Bölüm Önerisi
- Tekrar bölümünde belirli bir bölüme ait sorularda **çok fazla yanlış** yapılırsa (ör: %50'den fazla yanlış):
  - Bir popup/bildirim gösterilir: "Colors bölümünde zorlanıyor gibisin. Tekrar etmek ister misin?"
  - Kullanıcı "Evet" derse o bölüme yönlendirilir
  - "Hayır" derse devam eder (zorunlu değil)

### 6.3 Akıllı Tekrar
- Yanlış yapılan kelimeler bir **"zor kelimeler" listesine** eklenir
- Bu kelimeler sonraki sınavlarda daha sık karşılarına çıkar
- Kelime 3 kez üst üste doğru cevaplanırsa listeden çıkar

---

## 7. Kullanıcı Sistemi & Backend

### 7.1 Kayıt & Giriş
- **Email + şifre** ile kayıt
- **Sosyal giriş** (Google / Apple) desteği eklenebilir
- Email doğrulama
- Şifremi unuttum akışı

### 7.2 Bulut Senkronizasyon
- Tüm ilerleme verileri sunucuya kaydedilir:
  - Tamamlanan bölümler
  - Her bölümün en iyi skoru
  - XP puanı ve seviye
  - Streak bilgisi
  - Kazanılan rozetler
  - Zor kelimeler listesi
  - Can durumu ve son yenilenme zamanı
- Cihaz değiştirildiğinde ilerleme kaybolmaz

### 7.3 Backend Gereksinimleri
- Kullanıcı veritabanı (users, progress, achievements)
- Authentication API (kayıt, giriş, token yönetimi)
- Progress API (ilerleme kaydetme/okuma)
- Push notification servisi
- Abonelik doğrulama (App Store / Google Play)

---

## 8. Abonelik & Monetizasyon

### 8.1 Freemium Model
- **Ücretsiz içerik**: Bölüm 1 (Colors) ve Bölüm 2 (Numbers) tamamen ücretsiz
- **Premium içerik**: Bölüm 3-28 abonelik gerektirir
- Ücretsiz kullanıcılar premium bölümleri kilitli olarak görür

### 8.2 Abonelik Planları
- **Aylık abonelik**: Tüm bölümlere erişim
- **Yıllık abonelik**: İndirimli fiyatla tüm bölümlere erişim
- Abonelik özellikleri:
  - Tüm 28 bölüme erişim
  - Sınırsız can seçeneği
  - Reklamsız deneyim (eğer reklam eklenirse)

### 8.3 Entegrasyon
- iOS: App Store In-App Purchase / Subscription
- Android: Google Play Billing

---

## 9. Bildirimler (Push Notifications)

### 9.1 Bildirim Tipleri
- **Günlük hatırlatma**: "Bugün ders yapmayı unuttun! Serinizi kaybetmeyin 🔥"
- **Streak uyarısı**: "Seriniz tehlikede! Bugün 1 ders tamamlayın"
- **Can yenilendi**: "Canlarınız yenilendi! Öğrenmeye devam edin ❤️"
- **Başarım kazanıldı**: "Yeni rozet kazandınız: Ateş Serisi 🏆"
- **Haftalık özet**: "Bu hafta 150 XP kazandınız! Harika gidiyorsunuz 📊"

### 9.2 Kullanıcı Kontrolü
- Ayarlar sayfasında her bildirim tipi ayrı ayrı açılıp kapatılabilir
- "Tüm bildirimleri kapat" genel seçeneği

---

## 10. Ses Sistemi

### 10.1 Kelime Telaffuzu
- Her kelime için İngilizce sesli telaffuz (Text-to-Speech veya önceden kaydedilmiş ses dosyaları)
- Öğrenme modunda kart gösterilirken otomatik oynatma
- Sınav modundaki dinleme sorusunda kullanılır
- Kullanıcı herhangi bir kelimeye tıklayarak telaffuzu tekrar dinleyebilir

### 10.2 Efekt Sesleri
- ✅ Doğru cevap sesi (pozitif, kısa)
- ❌ Yanlış cevap sesi (hafif uyarı)
- 🎉 Bölüm tamamlama sesi (kutlama)
- 🏆 Rozet kazanma sesi
- 📈 Seviye atlama sesi
- 💔 Can kaybetme sesi

### 10.3 Kullanıcı Kontrolü
- Ayarlardan ses efektleri açılıp kapatılabilir
- Telaffuz sesleri ayrı olarak açılıp kapatılabilir
- Ses seviyesi ayarlanabilir

---

## 11. Profil Sayfası

### 11.1 Profil Bilgileri
- Profil fotoğrafı (kameradan çek veya galeriden seç)
- Kullanıcı adı
- Email adresi

### 11.2 İstatistikler
- Toplam XP puanı
- Tamamlanan ders sayısı / toplam ders sayısı
- Genel doğruluk oranı (%)
- En uzun streak rekoru
- Toplam öğrenme süresi

### 11.3 Rozetler
- Kazanılan rozetler grid halinde gösterilir
- Kazanılmamış rozetler kilitli/soluk gösterilir
- Rozete tıklayınca detayı görünür (nasıl kazanılır)

### 11.4 İlerleme Grafiği
- Haftalık/aylık XP kazanma grafiği (çubuk veya çizgi grafik)
- Günlük aktivite haritası (ısı haritası — GitHub tarzı)

### 11.5 Ayarlar
- 🌓 Tema: Karanlık / Açık mod geçişi
- 🔔 Bildirimler: Her bildirim tipi ayrı ayrı açılıp kapatılabilir
- 🔊 Sesler: Efekt sesleri ve telaffuz ayrı ayrı kontrol edilebilir
- 🌐 Arayüz dili: Türkçe (ilerisi için genişletilebilir)
- 🗣️ Öğrenilen dil: İngilizce (diğerleri "Çok Yakında")

### 11.6 Abonelik Durumu
- Mevcut plan (Ücretsiz / Aylık / Yıllık)
- Abonelik bitiş tarihi
- Plan yükseltme/değiştirme butonu

### 11.7 İletişim / Geri Bildirim
- **İstek & Öneri** gönderme formu
- **Şikayet** bildirme
- **Hata Bildirimi** (bug report)
- Email veya uygulama içi form ile gönderim
- SSS (Sıkça Sorulan Sorular) bölümü

---

## 12. Tasarım & UI/UX

### 12.1 Genel Tasarım Dili
- **Pastel ve yumuşak renkler** — zarif, yetişkinlere hitap eden
- Çocuksu değil, modern ve profesyonel
- Yumuşak gölgeler ve yuvarlak köşeler
- Bol beyaz alan (açık tema) / bol koyu alan (karanlık tema)
- Pastel mavi, pastel yeşil, lavanta, soft pembe, krem tonları

### 12.2 Tipografi
- Modern ve okunabilir font (Inter, Poppins veya Nunito)
- Başlıklar: Bold/Semi-bold
- İçerik: Regular/Medium
- Kelime kartlarında büyük ve net tipografi

### 12.3 Animasyonlar & Mikro-Etkileşimler
- Kart çevirme animasyonu (3D flip)
- Doğru cevap: yeşil parıltı + confetti efekti
- Yanlış cevap: kırmızı titreme (shake)
- Ekran geçişleri: yumuşak slide/fade
- Karakter yürüme animasyonu (harita üzerinde)
- Buton basma: scale-down efekti
- XP kazanma: sayı yukarı doğru uçar (+10 XP)
- Rozet kazanma: parlama + büyüme animasyonu
- Can kaybı: kalp kırılma animasyonu

### 12.4 Karanlık / Açık Tema
- **Açık tema**: krem/beyaz arka plan, pastel renkli kartlar, koyu yazılar
- **Karanlık tema**: koyu lacivert/antrazit arka plan, hafif parlak kartlar, açık yazılar
- Tema geçişi yumuşak animasyonla olur
- Sistem temasına otomatik uyum seçeneği

### 12.5 Mobil UI Kuralları
- Alt navigasyon çubuğu: Ana Sayfa (Harita), Tekrar, Profil
- Büyük ve kolay tıklanabilir butonlar (minimum 44x44pt)
- Tek elle kullanılabilir tasarım
- Safe area desteği (notch/island)
- Haptic feedback (titreşim) doğru/yanlış cevaplarda

---

## 13. Dil Seçim Ekranı

- Uygulama açıldığında veya ayarlardan erişilebilir
- **İngilizce**: Aktif, seçilebilir, bayrak ikonu ile
- **İtalyanca**: "Çok Yakında" etiketi, soluk/gri, tıklanamaz
- **İspanyolca**: "Çok Yakında" etiketi, soluk/gri, tıklanamaz
- **Almanca**: "Çok Yakında" etiketi, soluk/gri, tıklanamaz
- İleride yeni diller eklendiğinde kolayca aktifleştirilebilir altyapı

---

## 14. Teknik Gereksinimler

### 14.1 Frontend (Mobil)
- **Framework**: React Native veya Flutter
- **State Management**: Redux/Zustand (React Native) veya Riverpod/Bloc (Flutter)
- **Navigasyon**: React Navigation veya Go Router
- **Animasyonlar**: Lottie, React Native Animated veya Flutter Animations
- **Ses**: expo-av veya audioplayers
- **Push Notifications**: Firebase Cloud Messaging (FCM) + APNs
- **Lokal depolama**: AsyncStorage veya SharedPreferences (offline cache)

### 14.2 Backend
- **API**: REST API veya GraphQL
- **Veritabanı**: PostgreSQL veya MongoDB
- **Authentication**: Firebase Auth veya custom JWT
- **Hosting**: AWS, Google Cloud veya Firebase
- **Push Notifications**: Firebase Cloud Messaging
- **Dosya depolama**: AWS S3 veya Firebase Storage (görseller, ses dosyaları)

### 14.3 Görseller
- Her kelime için **yüksek kaliteli illüstrasyon/ikon** (AI-generated veya tasarımcı tarafından)
- Tutarlı stil: düz/flat design veya soft 3D
- Minimum 256x256px, ideal 512x512px
- Şeffaf veya beyaz arka plan
- Toplam ~280 görsel (28 bölüm x ~10 öğe)

### 14.4 Ses Dosyaları
- Her kelime/cümle için İngilizce telaffuz ses dosyası
- Format: MP3 veya AAC
- Kaynak: Text-to-Speech API (Google TTS, AWS Polly vb.) veya profesyonel ses kaydı
- Toplam ~280 ses dosyası
- Efekt sesleri: ~6-8 kısa ses efekti

---

## 15. Ekranlar Listesi

| # | Ekran | Açıklama |
|---|-------|----------|
| 1 | Splash Screen | Uygulama açılış ekranı (logo + animasyon) |
| 2 | Onboarding Slaytları | 2-3 sayfalık tanıtım |
| 3 | Kayıt Ekranı | Email + şifre ile hesap oluşturma |
| 4 | Giriş Ekranı | Email + şifre ile giriş |
| 5 | Şifremi Unuttum | Email ile şifre sıfırlama |
| 6 | Seviye Belirleme Testi | Başlangıç seviyesi belirleme |
| 7 | Dil Seçim Ekranı | Öğrenilecek dil seçimi |
| 8 | Ana Sayfa (Yol Haritası) | MentalUP tarzı ilerleyen karakter haritası |
| 9 | Öğrenme Modu (Flashcard) | Kart çevirerek kelime öğrenme |
| 10 | Sınav Modu | 4 soru tipinden quiz |
| 11 | Sonuç Ekranı | Sınav sonucu, skor, yıldızlar |
| 12 | Tekrar Bölümü | Önceki bölümlerin karması |
| 13 | Profil Sayfası | İstatistikler, rozetler, ayarlar |
| 14 | Ayarlar | Tema, bildirim, ses, dil |
| 15 | Abonelik Ekranı | Plan seçimi ve ödeme |
| 16 | Rozetler Sayfası | Tüm başarımlar detaylı |
| 17 | İletişim / Geri Bildirim | İstek, öneri, şikayet formu |
| 18 | Abonelik Paywall | Premium bölüme erişirken gösterilen ekran |

---

## 16. Özet — Tüm Özellikler Kontrol Listesi

- [x] 28 bölümlük aşamalı ders sistemi
- [x] Görsel + İngilizce kelime eşleştirmesi (anadil yok)
- [x] Flashcard öğrenme modu
- [x] 4 farklı soru tipi (resim→kelime, kelime→resim, eşleştirme, dinleme)
- [x] Yanlış cevaplarda doğruyu göstermeme, tekrar deneme
- [x] %80+ başarı ile sonraki bölüm açılır
- [x] Bölüm sonu karışık tekrar bölümü
- [x] Zayıf bölüm tekrar önerisi
- [x] Akıllı tekrar sistemi (zor kelimeler)
- [x] MentalUP tarzı yol haritası + karakter
- [x] XP puan sistemi
- [x] Günlük seri (streak)
- [x] Rozetler / başarımlar
- [x] Can sistemi (5 can, 30dk yenilenme)
- [x] Email + şifre kayıt/giriş
- [x] Bulut senkronizasyon
- [x] Karanlık / açık tema
- [x] Kelime telaffuzu (ses)
- [x] Ses efektleri (açılıp kapatılabilir)
- [x] Push bildirimler (açılıp kapatılabilir)
- [x] Dil seçim ekranı (İngilizce aktif, diğerleri "Çok Yakında")
- [x] Arayüz dili: Türkçe (genişletilebilir)
- [x] Freemium (ilk 2 bölüm ücretsiz) + abonelik
- [x] Profil sayfası (istatistik, rozetler, grafik)
- [x] İletişim / geri bildirim formu
- [x] Seviye belirleme testi (onboarding)
- [x] Onboarding tanıtım slaytları
- [x] iOS + Android mobil uygulama
