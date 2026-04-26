'use strict';

window.initEvents = function() {
  const on = (id, evt, fn) => {
    const el = window.$(id);
    if (el) el.addEventListener(evt, fn);
  };

  on('btn-toggle-bgm', 'click', () => window.toggleBGM('btn-toggle-bgm'));

  on('btn-slide-next', 'click', () => window.nextSlide(() => {
    localStorage.setItem(window.STORAGE.ONBOARD, '1');
    window.showScreen('auth');
    window.showLoginForm();
  }));
  
  on('btn-skip', 'click', () => {
    localStorage.setItem(window.STORAGE.ONBOARD, '1');
    window.showScreen('auth');
    window.showLoginForm();
  });

  on('go-register', 'click', window.showRegisterForm);
  on('go-login', 'click', window.showLoginForm);
  on('btn-close-auth', 'click', () => {
    window.showLoginForm();
    window.showToast('toast-heart', 'Lütfen devam etmek için giriş yapın.');
  });

  on('btn-login', 'click', async () => {
    window.clearErrors();
    const email = window.$('login-email').value.trim();
    const pass = window.$('login-password').value;
    if (!email) { window.$('login-email').classList.add('invalid'); return window.showError('login-error', 'E-posta boş olamaz.'); }
    if (!pass) { window.$('login-password').classList.add('invalid'); return window.showError('login-error', 'Şifre boş olamaz.'); }
    
    window.$('btn-login').textContent = 'Giriş yapılıyor...';
    window.$('btn-login').disabled = true;

    const res = await window.authLogin(email, pass);
    
    window.$('btn-login').textContent = 'Giriş Yap';
    window.$('btn-login').disabled = false;

    if (res.error) { window.showError('login-error', res.error); return; }
    window.updateUserUI(res.user);
    window.renderHome(res.user, window.gameState, window.startChapter);
  });

  on('btn-register', 'click', async () => {
    window.clearErrors();
    const name = window.$('reg-name').value;
    const email = window.$('reg-email').value;
    const phone = window.$('reg-phone').value;
    const pass = window.$('reg-password').value;
    const kvkk = window.$('reg-kvkk').checked;
    
    const cleanPhone = phone.replace(/\s/g, '');
    if (!name || !email || !pass) {
        window.showError('reg-error', 'Lütfen tüm alanları doldurun.');
        return;
    }
    if (cleanPhone.length !== 11) {
        window.showError('reg-error', 'Telefon numarası 11 haneli olmalıdır.');
        return;
    }

    window.$('btn-register').textContent = 'Kayıt olunuyor...';
    window.$('btn-register').disabled = true;

    try {
      const res = await window.authRegister(name, email, phone, pass, kvkk);
      if (res.error) {
        window.showError('reg-error', res.error);
      } else if (res.pending) {
        window.showVerifyForm();
        const msg = res.message || '📧 Onay kodu mail adresinize gönderildi.';
        window.showToast('toast-heart', msg);
      } else if (res.user) {
         window.showToast('toast-heart', '✅ Kayıt başarılı!');
         window.showLoginForm();
      }
    } catch (e) {
      console.error('Registration error:', e);
      window.showError('reg-error', 'Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      window.$('btn-register').textContent = 'Hemen Hesap Oluştur';
      window.$('btn-register').disabled = false;
    }
  });

  on('btn-verify-confirm', 'click', async () => {
    window.clearErrors();
    const code = window.$('verify-code').value.trim();
    if (!code) return window.showError('verify-error', 'Lütfen onay kodunu giriniz.');
    
    window.$('btn-verify-confirm').textContent = 'Onaylanıyor...';
    window.$('btn-verify-confirm').disabled = true;

    try {
      const res = await window.authVerifyCode(code);
      if (res.error) {
        window.showError('verify-error', res.error);
      } else {
        window.showToast('toast-heart', '✅ Hesabınız onaylandı! Hoş geldiniz.');
        window.updateUserUI(res.user);
        window.renderHome(res.user, window.gameState, window.startChapter);
      }
    } catch (e) {
      window.showError('verify-error', 'Doğrulama sırasında bir hata oluştu.');
    } finally {
      window.$('btn-verify-confirm').textContent = 'Hesabı Onayla';
      window.$('btn-verify-confirm').disabled = false;
    }
  });

  // --- Phone Mask Logic ---
  const phoneInput = window.$('reg-phone');
  if (phoneInput) {
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) phoneInput.value = '05';
    });

    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, ''); // Only digits
      
      // Force start with 05
      if (!value.startsWith('05')) {
          value = '05' + value;
      }
      
      // Limit to 11 digits
      value = value.substring(0, 11);
      
      // Format: 05XX XXX XX XX
      let formatted = '';
      for (let i = 0; i < value.length; i++) {
        if (i === 4 || i === 7 || i === 9) formatted += ' ';
        formatted += value[i];
      }
      
      e.target.value = formatted.trim();
    });

    phoneInput.addEventListener('blur', () => {
        if (phoneInput.value === '05') phoneInput.value = '';
    });
  }

  on('btn-resend-code', 'click', async () => {
    const res = await window.authResendCode();
    if (res.error) {
      window.showToast('toast-heart', '❌ ' + res.error);
    } else {
      window.showToast('toast-heart', '📧 Onay maili tekrar gönderildi.');
    }
  });

  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = window.$(btn.dataset.target);
      if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
    });
  });

  on('btn-back', 'click', () => window.renderHome(window.getCurrentUser(), window.gameState, window.startChapter));
  on('btn-avatar', 'click', window.openDrawer);
  on('btn-close-drawer', 'click', window.closeDrawer);
  on('drawer-overlay', 'click', window.closeDrawer);
  
  on('btn-logout', 'click', async () => {
    await window.supabase.auth.signOut();
    window.clearCurrentUser();
    window.hide(window.$('app-header'));
    window.closeDrawer();
    window.showScreen('auth');
    window.showLoginForm();
  });

  on('btn-go-home', 'click', () => window.renderHome(window.getCurrentUser(), window.gameState, window.startChapter));
  on('btn-continue-transition', 'click', () => {
    window.gameState.currentBatch++;
    window.startLearnPhase();
  });
  on('btn-retry', 'click', () => window.startChapter(window.gameState.chapterId));

  on('btn-next-card', 'click', window.nextCard);
  on('btn-prev-card', 'click', window.prevCard);
  on('btn-speak-word', 'click', () => { 
    const word = window.$('flashcard-word-static').textContent;
    window.playTTS(word); 
  });

  document.addEventListener('click', window.unlockAudio, { once: false });
  document.addEventListener('touchstart', window.unlockAudio, { once: false });
};


window.selectLanguage = function(lang) {
  window.gameState.targetLanguage = lang;
  localStorage.setItem(window.STORAGE.LANG, lang);
  
  // Switch Data Source
  if (lang === 'it') {
    window.CHAPTER_DATA = window.CHAPTER_DATA_IT;
    window.CHAPTERS = window.CHAPTERS_IT;
  } else {
    window.CHAPTER_DATA = window.__ORIGINAL_EN_DATA;
    window.CHAPTERS = window.__ORIGINAL_EN_CHAPTERS;
  }
  
  // Proceed to next step
  const seen = localStorage.getItem(window.STORAGE.ONBOARD);
  if (seen) {
    window.showScreen('auth');
    window.showLoginForm();
  } else {
    window.showOnboarding();
  }
};

window.init = function() {
  window.initEvents();
  const splash = window.$('splash-screen');
  const appEl = window.$('app');

  // Save original English data as default
  window.__ORIGINAL_EN_DATA = window.CHAPTER_DATA;
  window.__ORIGINAL_EN_CHAPTERS = window.CHAPTERS;

  setTimeout(() => {
    if (appEl) {
      appEl.classList.remove('hidden');
      appEl.style.display = 'flex';
    }
    if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => splash.style.display = 'none', 600);
    }

    const lang = localStorage.getItem(window.STORAGE.LANG);
    if (!lang) {
      window.showScreen('language-select');
      return;
    }

    // Restore language-specific data
    if (lang === 'it') {
      window.CHAPTER_DATA = window.CHAPTER_DATA_IT;
      window.CHAPTERS = window.CHAPTERS_IT;
    }

    const user = window.getCurrentUser();
    if (user) {
      window.updateUserUI(user);
      window.showHeader();
      window.renderHome(user, window.gameState, window.startChapter);
    } else {
      const seen = localStorage.getItem(window.STORAGE.ONBOARD);
      if (seen) {
        window.showScreen('auth');
        window.showLoginForm();
      } else {
        window.showOnboarding();
      }
    }
  }, 1200);

  window.__lvLoaded = true;
};

// Only init once
let initialized = false;
function safeInit() {
  if (initialized) return;
  initialized = true;
  window.init();
}

document.addEventListener('DOMContentLoaded', safeInit);
if (document.readyState !== 'loading') safeInit();
