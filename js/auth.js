'use strict';

/**
 * Supabase Auth Integration
 */

window.authLogin = async function(email, password) {
  const { data, error } = await window.supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: password
  });

  if (error) return { error: error.message };

  // Fetch profile data
  const { data: profile, error: profError } = await window.supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profError && profError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profError);
  }

  const user = {
    id: data.user.id,
    email: data.user.email,
    name: profile?.name || data.user.user_metadata.full_name || 'Kullanıcı',
    xp: profile?.xp || 0,
    streak: profile?.streak || 0,
    rewards: profile?.rewards || [],
    completedChapters: profile?.completed_chapters || [],
    lastPracticeDate: profile?.last_practice_date
  };

  window.saveCurrentUser(user);
  return { user };
};

window.authRegister = async function(name, email, phone, password, kvkk) {
  if (!name.trim()) return { error: 'Ad Soyad zorunludur.' };
  if (!email.includes('@')) return { error: 'Geçerli bir e-posta girin.' };
  if (!phone.trim()) return { error: 'Telefon numarası zorunludur.' };
  if (password.length < 6) return { error: 'Şifre en az 6 karakter olmalı.' };
  if (!kvkk) return { error: 'Lütfen KVKK ve Gizlilik Politikası\'nı onaylayın.' };

  const { data, error } = await window.supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: password,
    options: {
      data: {
        full_name: name.trim(),
        phone: phone.trim()
      }
    }
  });

  if (error) return { error: error.message };

  // Note: Supabase sends a confirmation email by default.
  // We can still show the "pending" state in our UI.
  
  if (data.user && data.session === null) {
      // Confirmation required
      return { pending: true, message: 'Lütfen e-posta adresinize gönderilen onay linkine tıklayın.' };
  }

  return { user: data.user };
};

// Supabase handle's verification via email link by default.
// This function can be kept for compatibility or updated if using OTP.
window.authVerifyCode = async function(inputCode) {
    // If you enable Email OTP in Supabase, you can use:
    // const { data, error } = await supabase.auth.verifyOtp({ email, token: inputCode, type: 'signup' })
    return { error: 'Supabase artık e-postanıza bir onay linki gönderiyor. Lütfen mailinizi kontrol edin.' };
};

window.authResendCode = async function() {
  const pending = JSON.parse(localStorage.getItem('pending_user'));
  if (!pending) return { error: 'Bekleyen kayıt bulunamadı.' };
  
  const { error } = await window.supabase.auth.resend({
    type: 'signup',
    email: pending.email
  });
  
  if (error) return { error: error.message };
  return { success: true };
};
