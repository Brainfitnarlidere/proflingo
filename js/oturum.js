'use strict';

/**
 * Giriş zamanı ve aktif süre takibi (supabase/oturum_takibi.sql).
 * Girişte/açılışta oturum açılır; sayfa görünür ve kullanıcı son 2 dk içinde bir şeye
 * dokunmuşsa 30 sn'de bir sunucuya sinyal gider. Süreyi sunucu saati ölçer.
 */
window.Oturum = {
  id: null,
  timer: null,
  lastInput: Date.now(),
  NABIZ_MS: 30000,
  PASIF_MS: 120000,

  async baslat(tur) {
    if (!window.supabase || !window.supabase.rpc) return;
    try {
      const { data, error } = await window.supabase.rpc('oturum_baslat', { p_tur: tur === 'giris' ? 'giris' : 'acilis' });
      if (error) { console.warn('[Oturum] başlatılamadı:', error.message); return; }
      this.id = data;
      this.lastInput = Date.now();
      if (!this.timer) this.timer = setInterval(() => this.nabiz(), this.NABIZ_MS);
    } catch (e) { console.warn('[Oturum]', e); }
  },

  async nabiz(zorla) {
    if (!this.id) return;
    if (document.visibilityState !== 'visible') return;
    if (!zorla && Date.now() - this.lastInput > this.PASIF_MS) return; // uzun süredir dokunulmadı
    try {
      const { data, error } = await window.supabase.rpc('oturum_nabiz', { p_oturum: this.id });
      if (!error && data) this.id = data; // uzun aradan sonra sunucu yeni oturum açabilir
    } catch (e) {}
  },

  durdur() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.id = null;
  }
};

['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(evt =>
  document.addEventListener(evt, () => { window.Oturum.lastInput = Date.now(); }, { passive: true, capture: true }));
document.addEventListener('visibilitychange', () => {
  // Sekmeye geri dönünce hemen sinyal: aradaki süre sunucuda sayılmaz, sayım buradan sürer
  if (document.visibilityState === 'visible') { window.Oturum.lastInput = Date.now(); window.Oturum.nabiz(true); }
  else window.Oturum.nabiz(true); // ayrılırken son 30 sn'yi de say
});
