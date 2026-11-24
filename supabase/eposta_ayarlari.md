# Kayıt ve şifre e-postalarının gitmesi için Supabase ayarları

Neden e-posta gitmiyor (2026-11-24 kontrolü): Supabase'de "Confirm email" kapalı
(`/auth/v1/settings` → `mailer_autoconfirm: true`). Bu durumda kayıtta hiç e-posta
gönderilmez, hesap doğrudan açılır. Ayrıca Supabase'in kendi e-posta servisi yalnızca
proje ekibindeki adreslere ve saatte birkaç e-posta gönderir; gerçek kullanıcılara
e-posta gitmesi için kendi SMTP hesabınız (Resend, Brevo, Google Workspace vb.) gerekir.

Not: Supabase şifreyi e-postayla göndermez (güvenlik gereği şifre kimsede düz metin
olarak durmaz). Kullanıcıya giden e-posta "hoş geldiniz + onay kodu" e-postasıdır;
şifresini unutan kullanıcı giriş ekranındaki "Şifremi unuttum" ile yenisini belirler.

## 1. SMTP (önce bu)
Project Settings → Authentication → SMTP Settings → Enable custom SMTP.
Gönderen adresi örn. `merhaba@proflingo.com`, gönderen adı `Prof Lingo`.
SMTP sağlayıcısında proflingo.com alan adını doğrulayın (DNS'e SPF/DKIM kayıtları);
yoksa e-postalar spam'e düşer.

## 2. Authentication → Sign In / Providers → Email
- Confirm email: AÇIK
- Email OTP length: 6 (uygulama 6-10 haneyi kabul ediyor)

## 3. Authentication → URL Configuration
- Site URL: `https://proflingo.com`
- Redirect URLs: `https://proflingo.com/**`

## 4. Authentication → Emails → Templates

### Confirm signup
Konu: `Prof Lingo'ya hoş geldiniz! Onay kodunuz: {{ .Token }}`

```html
<h2>Prof Lingo'ya hoş geldiniz! 🎉</h2>
<p>Hesabınız <strong>{{ .Email }}</strong> adresiyle oluşturuldu.</p>
<p>Kaydınızı tamamlamak için uygulamadaki "Son Bir Adım" ekranına bu kodu yazın:</p>
<p style="font-size:28px;font-weight:bold;letter-spacing:6px">{{ .Token }}</p>
<p>Ya da bu bağlantıya tıklayın: <a href="{{ .ConfirmationURL }}">Hesabımı onayla</a></p>
<p>Giriş bilgileriniz: e-posta adresiniz <strong>{{ .Email }}</strong> ve kayıtta belirlediğiniz şifre.
Şifrenizi unutursanız giriş ekranındaki "Şifremi unuttum" bağlantısını kullanın.</p>
<p>Bu kaydı siz yapmadıysanız bu e-postayı yok sayabilirsiniz.</p>
```

### Reset Password
Konu: `Prof Lingo şifre sıfırlama kodunuz: {{ .Token }}`

```html
<h2>Şifre sıfırlama</h2>
<p><strong>{{ .Email }}</strong> hesabı için şifre sıfırlama istendi.</p>
<p>Uygulamadaki "Yeni Şifre Belirle" ekranına bu kodu yazın:</p>
<p style="font-size:28px;font-weight:bold;letter-spacing:6px">{{ .Token }}</p>
<p>Ya da bu bağlantıya tıklayın: <a href="{{ .ConfirmationURL }}">Yeni şifre belirle</a></p>
<p>Bu isteği siz yapmadıysanız bu e-postayı yok sayın; şifreniz değişmez.</p>
```

## 5. Deneme
Kendinize ait yeni bir adresle proflingo.com'da kayıt olun: onay ekranı çıkmalı,
e-posta birkaç dakika içinde gelmeli, kod çalışmalı. Sonra çıkış yapıp "Şifremi unuttum"u deneyin.
Kontrol: `curl -s https://lavrodcnjqxkejzgtnoo.supabase.co/auth/v1/settings -H "apikey: <anon>"`
çıktısında `"mailer_autoconfirm": false` görünmeli.
