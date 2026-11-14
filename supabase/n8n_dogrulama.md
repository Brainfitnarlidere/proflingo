# n8n webhook doğrulaması (`lv-usage-sync`)

Uygulama artık her isteğe `Authorization: Bearer <oturum anahtarı>` başlığı ekliyor.
n8n tarafında bu anahtar doğrulanmazsa adresi bilen herkes sahte veri gönderebilir.

## n8n akışına eklenecek adımlar
1. **Webhook** düğümünden hemen sonra bir **HTTP Request** düğümü ekle:
   - Method: `GET`
   - URL: `https://lavrodcnjqxkejzgtnoo.supabase.co/auth/v1/user`
   - Headers:
     - `apikey`: Supabase anon anahtarı (`js/supabase.js` içindeki)
     - `Authorization`: `{{ $json.headers.authorization }}`
   - Options → "Never Error" kapalı kalsın (anahtar geçersizse 401 döner ve akış durur).
2. Sonraki düğümlerde e-postayı gövdeden (`body.email`) değil, bu isteğin cevabından al:
   `{{ $('HTTP Request').item.json.email }}`. Böylece biri başkasının e-postasını yazsa bile
   işlem gerçek oturum sahibine yapılır.
3. İsteğe bağlı: Webhook düğümünde "Allowed Origins" alanına `https://proflingo.com` yaz.

## Test
- Başlıksız istek → akış HTTP Request adımında 401 ile durmalı.
- Uygulamadan giriş yapmış kullanıcıyla 5 dakika bekle → kayıt doğru e-postayla düşmeli.
