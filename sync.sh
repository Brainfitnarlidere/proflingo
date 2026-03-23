#!/bin/bash

# Prof Lingo - Otomatik GitHub Senkronizasyon Betiği
# Bu dosya açık olduğu sürece klasördeki değişiklikler 5 dakikada bir GitHub'a yüklenir.

echo "Prof Lingo Otomatik Senkronizasyon Başlatıldı... 🚀"
echo "Durdurmak için 'Control + C' tuşlarına basabilirsiniz."

while true; do
  # Değişiklik var mı kontrol et
  if [ -n "$(git status --porcelain)" ]; then
    echo "$(date): Değişiklikler algılandı, yükleniyor..."
    git add .
    git commit -m "Otomatik Güncelleme: $(date)"
    git push origin main
    echo "✅ Başarıyla yüklendi. 5 dakika bekleniyor..."
  else
    echo "$(date): Değişiklik yok. Bekleniyor..."
  fi
  
  sleep 300
done
