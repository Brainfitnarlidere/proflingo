#!/bin/bash
# Supabase kütüphanesini CDN yerine projenin içine indirir (tek seferlik).
# Kullanım (proje klasöründe): bash tools/vendor_supabase.sh
set -e
cd "$(dirname "$0")/.."
V=$(curl -fsS "https://data.jsdelivr.com/v1/packages/npm/@supabase/supabase-js/resolved?specifier=2" | sed -E 's/.*"version":"([^"]+)".*/\1/')
echo "Sürüm: $V"
mkdir -p js/vendor
curl -fsS "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@$V/dist/umd/supabase.js" -o js/vendor/supabase.js
head -c 200 js/vendor/supabase.js | grep -q "supabase" || { echo "İndirilen dosya beklenen gibi değil"; exit 1; }
echo "$V" > js/vendor/SUPABASE_VERSION
sed -i '' 's#<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>#<script src="js/vendor/supabase.js"></script>#' index.html
grep -n "supabase" index.html | head -3
echo "Tamam: js/vendor/supabase.js ($V)"
