"""PNG görselleri WebP'ye çevirir (en uzun kenar en fazla 1280 px). Kullanım: python3 tools/convert_webp.py"""
import glob, os, sys
from concurrent.futures import ProcessPoolExecutor
from PIL import Image

MAX = 1280

def conv(src):
    dst = src[:-4] + '.webp'
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
        return src, 0, os.path.getsize(src), os.path.getsize(dst)
    im = Image.open(src)
    im.load()
    if im.mode == 'P':
        im = im.convert('RGBA')
    if max(im.size) > MAX:
        im.thumbnail((MAX, MAX), Image.LANCZOS)
    lossless_alpha = 'A' in im.mode
    im.save(dst, 'WEBP', quality=82, method=6, alpha_quality=90 if lossless_alpha else 100)
    return src, 1, os.path.getsize(src), os.path.getsize(dst)

if __name__ == '__main__':
    root = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'images')
    files = [f for f in glob.glob(os.path.join(root, '**', '*.png'), recursive=True) if os.path.isfile(f)]
    a = b = n = 0
    with ProcessPoolExecutor() as ex:
        for src, did, s, d in ex.map(conv, files):
            a += s; b += d; n += did
    print(f'{len(files)} görsel ({n} yeni çevrildi): {a/2**20:.0f} MB -> {b/2**20:.0f} MB')
