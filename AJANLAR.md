# Prof Lingo Ajan Ekibi

Bu projede Claude Code beş ajandan oluşan bir ekiple çalışır. Sen sadece **proje lideriyle**
konuşursun; o işi diğerlerine dağıtır ve sana sonucu getirir.

```
            Sen
             │
       ┌─────▼──────┐
       │ proje-lideri│  (yönetir, kod yazmaz)
       └─────┬──────┘
   ┌─────────┼───────────┬────────────┐
   ▼         ▼           ▼            ▼
planlayici → uygulayici → test-edici → denetci
                ▲                        │
                └── DEĞİŞİKLİK GEREKLİ ──┘   (en fazla 3 tur)
```

## Ajanlar ve yetkileri

| Ajan | Görevi | Yapabilir | Yapamaz | Model |
|---|---|---|---|---|
| **proje-lideri** | İsteği anlar, görev dağıtır, döngüyü yönetir, sana raporlar | Dosya okumak, diğer 4 ajanı çağırmak, görev dosyası, ilerleme ve iş listesi yazmak | Kod yazmak, push | Oturumunki |
| **planlayici** | Kodu inceler, adım adım plan + ölçülebilir kabul kriterleri yazar | Okumak, `plan.md` yazmak | Uygulama kodunu değiştirmek | Opus |
| **uygulayici** | Planı ya da denetçinin istediği değişiklikleri koda döker | Kod düzenlemek, `node --check` | Plan dışına çıkmak, test dosyası değiştirmek, commit/push | Oturumunki |
| **test-edici** | Kabul kriterlerine göre test yazar ve çalıştırır | `tests/` altına test yazmak, testleri çalıştırmak | Uygulama kodunu düzeltmek | Sonnet |
| **denetci** | Testleri kendisi yeniden çalıştırır, testlerin gerçekten işe yaradığını kontrol eder, kodu inceler; **ONAY** ya da **DEĞİŞİKLİK GEREKLİ** der | Okumak, test çalıştırmak, `denetim.md` yazmak | Hiçbir proje dosyasını değiştirmek | Opus |

## Bir iş nasıl ilerler
1. Sen isteğini yazarsın: *"Kayıt ekranına şifre tekrar alanı ekle."*
2. Lider gerekiyorsa soru sorar, sonra `.claude/calisma/<tarih>-<ad>/gorev.md` açar.
3. **planlayici** → `plan.md` (adımlar + kabul kriterleri)
3b. **denetci** → kabul kriterlerini onaylar (`SÖZLEŞME: ONAY`)
4. **uygulayici** → kod + `uygulama.md`
5. **test-edici** → `test-raporu.md`
6. **denetci** → `denetim.md` → `KARAR: ONAY` veya `KARAR: DEĞİŞİKLİK GEREKLİ`
7. Değişiklik gerekirse lider maddeleri ilgili ajana geri verir (kod → uygulayıcı, zayıf test →
   test edici, yanlış plan → planlayıcı) ve 5–6 tekrarlanır. 3 turda onay çıkmazsa sana sorar.
8. Lider sana kısa bir rapor verir. GitHub'a göndermek sana kalır.

Küçük işlerde (tek bir metin/renk değişikliği) lider planlayıcıyı atlayabilir; **test ve
denetim her zaman yapılır.**

## Oturumlar arası hafıza ve kontrol
Ajanlar önceki oturumları hatırlamaz; bu yüzden üç şey eklendi:
- **`.claude/is-listesi.json`**: yapılacak işler, kabul kriterleri ve durumları. Lider buradan iş
  önerir; ajanlar sadece durum/not alanını değiştirebilir.
- **`.claude/ilerleme.md`**: her oturumun sonunda lider kısa bir kayıt ekler.
- **`node tools/kontrol.js`**: projenin sağlam olup olmadığını tek komutta gösterir. Lider her
  oturuma bununla başlar, işi bununla bitirir.

Ek güvenceler:
- **Sözleşme adımı:** kod yazılmadan önce denetçi kabul kriterlerini onaylar.
- **Hook:** bir JS dosyası düzenlenince sözdizimi otomatik kontrol edilir.
- **Testler:** `npm test` uygulamayı internetsiz, sahte bir Supabase ile kullanıcı gibi dener.

## Kullanım
Proje klasöründe Terminal'de:
```
cd ~/Desktop/lingua-visual
claude
```
`.claude/settings.json` sayesinde oturum doğrudan proje lideriyle açılır. Sonra isteğini yaz.

- Ajanları görmek/düzenlemek: oturumda `/agents`
- Lider olmadan normal Claude ile çalışmak: `.claude/settings.json` içindeki `"agent"` satırını sil
- Bir ajanı doğrudan çağırmak: *"denetci ajanına son değişikliği denetlet"*

## Güvenlik kuralları (tüm ajanlar)
- `git push` ve `sync.sh` ayarlarla engelli; commit, dosya silme ve Supabase'e yazma senin
  onayın olmadan yapılmaz.
- Şifre düz metin saklanmaz, RLS kapatılmaz, kişisel veri raporlara yazılmaz.

## Dosyalar
- `.claude/agents/*.md` — her ajanın tanımı ve talimatları (düzenleyerek davranışlarını değiştirebilirsin)
- `.claude/settings.json` — ana oturumun lider olması ve push yasağı
- `CLAUDE.md` — tüm ajanların okuduğu proje bilgisi
- `.claude/calisma/` — görev başına plan, uygulama, test ve denetim kayıtları (git'e girmez)
