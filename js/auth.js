'use strict';

/**
 * Supabase Auth Integration
 *
 * Şifreler Supabase Auth tarafından (hash'lenmiş olarak) tutulur; profiles
 * tablosunda şifre saklanmaz. profiles satırına sadece sahibi erişebilir (RLS).
 * Veritabanı tarafındaki ayarlar için: supabase/auth_fix.sql
 */

const PENDING_KEY = 'pending_user';
const RESET_KEY = 'pending_reset';

// E-postadaki şifre sıfırlama linkiyle gelindiyse adres çubuğunda type=recovery olur;
// supabase-js ayrıca PASSWORD_RECOVERY olayı yayınlar.
// (Bu dosya supabase.js'ten önce çalışır; dinleyici authRestoreSession içinde bağlanır.)
let recoveryMode = /type=recovery/.test(window.location.hash || '');
let recoveryWatched = false;
function watchRecovery() {
  if (recoveryWatched) return;
  recoveryWatched = true;
  try {
    window.supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') recoveryMode = true;
    });
  } catch (e) {}
}
window.authIsRecovery = function() { return recoveryMode; };

function normEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function trError(err) {
  const msg = (err && err.message) || String(err || '');
  if (/invalid login credentials/i.test(msg)) return 'E-posta veya şifre hatalı.';
  if (/email not confirmed/i.test(msg)) return 'E-posta adresiniz henüz onaylanmadı.';
  if (/already registered|already been registered/i.test(msg)) return 'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.';
  if (/token has expired|invalid.*token|otp/i.test(msg)) return 'Kod hatalı veya süresi dolmuş. Yeni kod isteyebilirsiniz.';
  if (/rate limit|too many/i.test(msg)) return 'Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin.';
  if (/password/i.test(msg) && /characters|short|weak/i.test(msg)) return 'Şifre en az 6 karakter olmalı.';
  return msg || 'Bir hata oluştu. Lütfen tekrar deneyin.';
}

function setPending(email) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify({ email: normEmail(email) })); } catch (e) {}
}
function getPending() {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY)); } catch (e) { return null; }
}
function clearPending() {
  try { localStorage.removeItem(PENDING_KEY); } catch (e) {}
}

// Oturum açmış kullanıcının profilini getirir; yoksa oluşturur.
async function loadOrCreateProfile(authUser) {
  const meta = authUser.user_metadata || {};

  let { data: profile, error } = await window.supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  if (error) {
    // Ağ/izin hatası: profil yok sanıp sıfır XP ile devam edersek bir sonraki
    // kayıtta gerçek XP'nin üzerine yazarız. Önbellekteki kaydı kullan.
    console.error('Profile fetch error:', error);
    const cached = window.getCurrentUser && window.getCurrentUser();
    if (cached && String(cached.id) === String(authUser.id)) return cached;
    throw new Error('Profil yüklenemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.');
  }

  if (!profile) {
    // Normalde veritabanı tetikleyicisi oluşturur; yoksa burada oluşturuyoruz.
    // Sadece insert: tarayıcının profil satırını güncelleme yetkisi kısıtlıdır.
    const res = await window.supabase
      .from('profiles')
      .insert({
        id: authUser.id,
        email: normEmail(authUser.email),
        name: meta.full_name || null,
        phone: meta.phone || null
      })
      .select()
      .maybeSingle();
    if (res.error) console.error('Profile create error:', res.error);
    profile = res.data;
  }

  return window.profileToUser(profile, authUser);
}

// Veritabanı satırını uygulamanın kullanıcı nesnesine çevirir.
window.profileToUser = function(profile, authUser) {
  const meta = (authUser && authUser.user_metadata) || {};
  return {
    id: profile?.id || authUser?.id,
    email: authUser?.email || profile?.email || '',
    name: profile?.name || meta.full_name || 'Kullanıcı',
    phone: profile?.phone || meta.phone || '',
    xp: profile?.xp || 0,
    streak: profile?.streak || 0,
    rewards: profile?.rewards || [],
    completedChapters: profile?.completed_chapters || [],
    lastPracticeDate: profile?.last_practice_date || null
  };
};

async function finishLogin(authUser, tur) {
  const user = await loadOrCreateProfile(authUser);
  clearPending();
  window.saveCurrentUser(user);
  if (window.Oturum) window.Oturum.baslat(tur || 'giris'); // giriş zamanı ve aktif süre
  return user;
}

window.authLogin = async function(email, password) {
  email = normEmail(email);
  if (!email || !password) return { error: 'E-posta ve şifre zorunludur.' };

  const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (/email not confirmed/i.test(error.message || '')) {
      setPending(email);
      await window.supabase.auth.resend({ type: 'signup', email }).catch(() => {});
      return { pending: true, message: '📧 Hesabınızı onaylamanız gerekiyor. Onay kodu e-postanıza tekrar gönderildi.' };
    }
    return { error: trError(error) };
  }

  try {
    return { user: await finishLogin(data.user) };
  } catch (e) {
    return { error: e.message };
  }
};

window.authRegister = async function(name, email, phone, password, kvkk) {
  email = normEmail(email);
  if (!name.trim()) return { error: 'Ad Soyad zorunludur.' };
  if (!email.includes('@')) return { error: 'Geçerli bir e-posta girin.' };
  if (!phone.trim()) return { error: 'Telefon numarası zorunludur.' };
  if (password.length < 6) return { error: 'Şifre en az 6 karakter olmalı.' };
  if (!kvkk) return { error: 'Lütfen KVKK ve Gizlilik Politikası\'nı onaylayın.' };

  const { data, error } = await window.supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin + window.location.pathname,
      data: {
        full_name: name.trim(),
        phone: phone.replace(/\s/g, ''),
        kvkk_accepted_at: new Date().toISOString()
      }
    }
  });

  if (error) return { error: trError(error) };

  // E-posta onayı açıkken kayıtlı bir adres tekrar denenirse Supabase
  // hata vermez, kimliği boş bir kullanıcı döner.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { error: 'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.' };
  }

  if (data.session && data.user) {
    // E-posta onayı kapalıysa doğrudan giriş yapılır.
    try {
      return { user: await finishLogin(data.user) };
    } catch (e) {
      return { error: e.message };
    }
  }

  setPending(email);
  return { pending: true, message: '📧 Onay kodu e-posta adresinize gönderildi.' };
};

window.authVerifyCode = async function(inputCode) {
  const pending = getPending();
  if (!pending || !pending.email) return { error: 'Bekleyen kayıt bulunamadı. Lütfen giriş yapmayı deneyin.' };

  const token = String(inputCode || '').replace(/\s/g, '');
  // Supabase kod uzunluğu ayardan 6-10 hane olabilir.
  if (!/^\d{6,10}$/.test(token)) return { error: 'Lütfen e-postadaki kodu eksiksiz girin.' };

  const { data, error } = await window.supabase.auth.verifyOtp({
    email: pending.email,
    token,
    type: 'signup'
  });

  if (error) return { error: trError(error) };
  if (!data.user) return { error: 'Doğrulama tamamlanamadı. Lütfen tekrar deneyin.' };

  try {
    return { user: await finishLogin(data.user) };
  } catch (e) {
    return { error: e.message };
  }
};

window.authResendCode = async function() {
  const pending = getPending();
  if (!pending || !pending.email) return { error: 'Bekleyen kayıt bulunamadı.' };

  const { error } = await window.supabase.auth.resend({ type: 'signup', email: pending.email });
  if (error) return { error: trError(error) };
  return { success: true };
};

// Uygulama açılırken çağrılır: geçerli bir Supabase oturumu varsa kullanıcıyı
// döndürür, yoksa yerel kaydı temizler. (E-postadaki onay linkine tıklanınca
// gelen oturum da burada yakalanır.)
window.authRestoreSession = async function() {
  watchRecovery();
  try {
    const { data } = await window.supabase.auth.getSession();
    if (data && data.session && data.session.user) {
      return await finishLogin(data.session.user, 'acilis');
    }
  } catch (e) {
    console.error('Session restore error:', e);
  }
  window.clearCurrentUser();
  return null;
};

// --- Şifre sıfırlama ---
// Supabase "Reset Password" e-postası gönderir. Şablonda {{ .Token }} varsa kullanıcı
// kodu girer; linke tıklarsa site type=recovery ile açılır ve sadece yeni şifre sorulur.
window.authSendReset = async function(email) {
  email = normEmail(email);
  if (!email.includes('@')) return { error: 'Geçerli bir e-posta girin.' };
  const { error } = await window.supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname
  });
  if (error) return { error: trError(error) };
  try { localStorage.setItem(RESET_KEY, email); } catch (e) {}
  // Adres kayıtlı olmasa da aynı yanıt verilir (kayıtlı e-postalar dışarıdan öğrenilemesin).
  return { success: true, message: '📧 Kayıtlı bir hesapsa sıfırlama kodu e-postanıza gönderildi.' };
};

window.authResendReset = async function() {
  let email = null;
  try { email = localStorage.getItem(RESET_KEY); } catch (e) {}
  if (!email) return { error: 'Önce e-posta adresinizi girin.' };
  return window.authSendReset(email);
};

window.authConfirmReset = async function(inputCode, newPassword) {
  newPassword = String(newPassword || '');
  if (newPassword.length < 6) return { error: 'Şifre en az 6 karakter olmalı.' };

  if (!recoveryMode) {
    let email = null;
    try { email = localStorage.getItem(RESET_KEY); } catch (e) {}
    if (!email) return { error: 'Sıfırlama isteği bulunamadı. Lütfen tekrar kod isteyin.' };
    const token = String(inputCode || '').replace(/\s/g, '');
    if (!/^\d{6,10}$/.test(token)) return { error: 'Lütfen e-postadaki kodu eksiksiz girin.' };
    const { error } = await window.supabase.auth.verifyOtp({ email, token, type: 'recovery' });
    if (error) return { error: trError(error) };
  }

  const { data, error } = await window.supabase.auth.updateUser({ password: newPassword });
  if (error) {
    if (/different from the old|same.*password/i.test(error.message || '')) {
      return { error: 'Yeni şifre eskisiyle aynı olamaz.' };
    }
    return { error: trError(error) };
  }
  recoveryMode = false;
  try { localStorage.removeItem(RESET_KEY); } catch (e) {}
  if (window.location.hash) {
    try { history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) {}
  }
  try {
    return { user: await finishLogin(data.user, 'giris') };
  } catch (e) {
    return { error: e.message };
  }
};

window.authHasPending = function() {
  const p = getPending();
  return !!(p && p.email);
};
