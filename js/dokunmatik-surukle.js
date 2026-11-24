'use strict';
// Dokunmatik ekranlarda sürükle-bırak (tablet, telefon: Safari ve Chrome).
// Oyunlar tarayıcının fareyle çalışan sürükle-bırak olaylarını kullanıyor (dragstart / dragover /
// drop). Dokunmatik ekranlarda bu olaylar gelmediği için öğeler sürüklenemiyordu. Bu dosya,
// draggable="true" olan HER öğe için parmak hareketini aynı olaylara çevirir; böylece bütün
// oyunlar (eşleştirme, 10'lu liste, sahneye yerleştirme, Winner Mode), bütün bölümler ve
// bütün dillerde ayrı kod gerekmeden çalışır. Fareyle sürükleme eskisi gibi tarayıcıda kalır.
(function () {
  const ESIK = 8; // px: bundan az hareket dokunma (tıklama) sayılır, sürükleme başlamaz
  let aktif = null; // { kaynak, x0, y0, basladi, hayalet, dt, ustteki }

  function sahteVeri() {
    const veri = {};
    return {
      effectAllowed: 'all', dropEffect: 'move', types: [],
      setData(tur, deger) { veri[tur] = String(deger); if (!this.types.includes(tur)) this.types.push(tur); },
      getData(tur) { return veri[tur] !== undefined ? veri[tur] : ''; },
      clearData() { Object.keys(veri).forEach(k => delete veri[k]); this.types = []; }
    };
  }

  function gonder(hedef, tur, dt, x, y) {
    if (!hedef) return true;
    const ev = new Event(tur, { bubbles: true, cancelable: true });
    Object.defineProperty(ev, 'dataTransfer', { value: dt });
    Object.defineProperty(ev, 'clientX', { value: x });
    Object.defineProperty(ev, 'clientY', { value: y });
    return hedef.dispatchEvent(ev);
  }

  function altindaki(x, y) {
    const el = document.elementFromPoint(x, y);
    return el && el.closest ? el : null;
  }

  function hayaletOlustur(kaynak, x, y) {
    const r = kaynak.getBoundingClientRect();
    const h = kaynak.cloneNode(true);
    h.removeAttribute('id');
    h.classList.add('dokunmatik-hayalet');
    Object.assign(h.style, {
      position: 'fixed', left: '0', top: '0', margin: '0', zIndex: '10000', pointerEvents: 'none',
      width: r.width + 'px', height: r.height + 'px', opacity: '0.85', visibility: 'visible',
      transform: `translate(${x - r.width / 2}px, ${y - r.height / 2}px) scale(1.05)`
    });
    h._w = r.width; h._h = r.height;
    document.body.appendChild(h);
    return h;
  }

  function hayaletTasi(h, x, y) {
    h.style.transform = `translate(${x - h._w / 2}px, ${y - h._h / 2}px) scale(1.05)`;
  }

  function bitir() {
    if (!aktif) return;
    if (aktif.hayalet) aktif.hayalet.remove();
    if (aktif.kaynak) aktif.kaynak.classList.remove('is-dragging');
    aktif = null;
  }

  document.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) { bitir(); return; }
    const kaynak = e.target && e.target.closest ? e.target.closest('[draggable="true"]') : null;
    if (!kaynak) return;
    const t = e.touches[0];
    aktif = { kaynak, x0: t.clientX, y0: t.clientY, basladi: false, hayalet: null, dt: null, ustteki: null };
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!aktif) return;
    const t = e.touches[0];
    if (!aktif.basladi) {
      if (Math.hypot(t.clientX - aktif.x0, t.clientY - aktif.y0) < ESIK) return;
      aktif.basladi = true;
      aktif.dt = sahteVeri();
      gonder(aktif.kaynak, 'dragstart', aktif.dt, aktif.x0, aktif.y0);
      aktif.kaynak.classList.add('is-dragging');
      aktif.hayalet = hayaletOlustur(aktif.kaynak, t.clientX, t.clientY);
    }
    e.preventDefault(); // sürüklerken sayfa kaymasın
    hayaletTasi(aktif.hayalet, t.clientX, t.clientY);
    // Hedef ekranın dışındaysa: parmak üst/alt kenara yaklaşınca sayfa kendiliğinden kayar
    const KENAR = 60;
    if (t.clientY < KENAR) window.scrollBy(0, -14);
    else if (t.clientY > window.innerHeight - KENAR) window.scrollBy(0, 14);
    const ustteki = altindaki(t.clientX, t.clientY);
    if (ustteki !== aktif.ustteki) {
      if (aktif.ustteki) gonder(aktif.ustteki, 'dragleave', aktif.dt, t.clientX, t.clientY);
      aktif.ustteki = ustteki;
    }
    if (ustteki) gonder(ustteki, 'dragover', aktif.dt, t.clientX, t.clientY);
  }, { passive: false });

  document.addEventListener('touchend', e => {
    if (!aktif) return;
    if (aktif.basladi) {
      e.preventDefault(); // sürüklemenin sonunda ayrıca tıklama olmasın
      const t = e.changedTouches[0];
      if (aktif.hayalet) aktif.hayalet.style.display = 'none';
      const hedef = altindaki(t.clientX, t.clientY);
      if (hedef) gonder(hedef, 'drop', aktif.dt, t.clientX, t.clientY);
      gonder(aktif.kaynak, 'dragend', aktif.dt, t.clientX, t.clientY);
    }
    bitir();
  }, { passive: false });

  document.addEventListener('touchcancel', () => {
    if (aktif && aktif.basladi && aktif.ustteki) gonder(aktif.ustteki, 'dragleave', aktif.dt, 0, 0);
    bitir();
  });
})();
