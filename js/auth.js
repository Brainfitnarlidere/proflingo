'use strict';

window.authLogin = function(email, password) {
  const users = window.getUsers();
  const user = users.find(u => u.email === email.trim().toLowerCase() && u.password === password);
  if (!user) return { error: 'E-posta veya şifre hatalı.' };
  window.saveCurrentUser(user);
  return { user };
};

window.authRegister = function(name, email, phone, password, kvkk) {
  if (!name.trim()) return { error: 'Ad Soyad zorunludur.' };
  if (!email.includes('@')) return { error: 'Geçerli bir e-posta girin.' };
  if (!phone.trim()) return { error: 'Telefon numarası zorunludur.' };
  if (password.length < 6) return { error: 'Şifre en az 6 karakter olmalı.' };
  if (!kvkk) return { error: 'Lütfen KVKK ve Gizlilik Politikası\'nı onaylayın.' };
  
  const users = window.getUsers();
  if (users.find(u => u.email === email.trim().toLowerCase())) return { error: 'Bu e-posta zaten kayıtlı.' };

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  const pendingUser = { 
    name: name.trim(), 
    email: email.trim().toLowerCase(), 
    phone: phone.trim(),
    password, 
    code,
    timestamp: Date.now()
  };
  
  localStorage.setItem('pending_user', JSON.stringify(pendingUser));
  
  // Sync to N8N for email delivery
  if (window.syncToN8N) {
    window.syncToN8N({
      event: 'registration_verification',
      email: pendingUser.email,
      name: pendingUser.name,
      code: pendingUser.code
    });
  }
  
  return { pending: true };
};

window.authVerifyCode = function(inputCode) {
  const pending = JSON.parse(localStorage.getItem('pending_user'));
  if (!pending) return { error: 'Doğrulama süreci bulunamadı. Lütfen tekrar kayıt olun.' };
  
  if (inputCode === pending.code) {
    const users = window.getUsers();
    const newUser = {
      id: Date.now(),
      name: pending.name,
      email: pending.email,
      phone: pending.phone,
      password: pending.password,
      xp: 0,
      streak: 0,
      rewards: [],
      completedChapters: [],
      lastPracticeDate: null
    };
    
    users.push(newUser);
    window.saveUsers(users);
    window.saveCurrentUser(newUser);
    localStorage.removeItem('pending_user');
    return { user: newUser };
  } else {
    return { error: 'Yanlış doğrulama kodu.' };
  }
};

window.authResendCode = function() {
  const pending = JSON.parse(localStorage.getItem('pending_user'));
  if (!pending) return { error: 'Doğrulama süreci bulunamadı.' };
  
  const newCode = Math.floor(100000 + Math.random() * 900000).toString();
  pending.code = newCode;
  localStorage.setItem('pending_user', JSON.stringify(pending));
  
  if (window.syncToN8N) {
    window.syncToN8N({
      event: 'registration_verification',
      email: pending.email,
      name: pending.name,
      code: pending.code
    });
  }
  return { success: true };
};
