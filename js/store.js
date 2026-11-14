'use strict';

window.STORAGE = {
  USERS: 'lv_users',
  CURRENT_USER: 'lv_curr_user',
  ONBOARD: 'lv_onboard_seen',
  LANG: 'lv_target_lang'
};

window.getUsers = function() {
  try {
    const data = localStorage.getItem(window.STORAGE.USERS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('getUsers error:', e);
    return [];
  }
};

window.saveUsers = function(users) {
  try {
    localStorage.setItem(window.STORAGE.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('saveUsers error:', e);
  }
};

window.getCurrentUser = function() {
  try {
    const data = localStorage.getItem(window.STORAGE.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('getCurrentUser error:', e);
    return null;
  }
};

window.saveCurrentUser = function(user) {
  try {
    if (user && user.id) {
      localStorage.setItem(window.STORAGE.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(window.STORAGE.CURRENT_USER);
    }
  } catch (e) {
    console.error('saveCurrentUser error:', e);
  }
};

// Sadece ad ve telefon tarayıcıdan güncellenebilir. XP, seri, bölümler ve
// ödüller veritabanı fonksiyonlarıyla değişir (supabase/xp_guvenlik.sql).
window.updateUser = async function(updatedUser) {
  window.saveCurrentUser(updatedUser);
  if (!window.supabase || !updatedUser.id) return;
  const { error } = await window.supabase
    .from('profiles')
    .update({ name: updatedUser.name, phone: updatedUser.phone })
    .eq('id', updatedUser.id);
  if (error) console.error('Supabase profile update error:', error);
};

function rpcErrorText(error) {
  const msg = (error && error.message) || '';
  if (/çok hızlı/i.test(msg)) return 'Bölüm çok hızlı bitirildi, XP verilmedi.';
  if (/xp yetersiz/i.test(msg)) return 'XP yetersiz.';
  if (/zaten alınmış/i.test(msg)) return 'Bu ödülü zaten aldın.';
  return 'Bağlantı hatası, lütfen tekrar dene.';
}

// Bölüm sonunda çağrılır. Sunucu XP'yi sınırlar, seriyi ve bölüm listesini günceller.
window.completeChapter = async function({ chapterId, earnedXP, correct, wrong }) {
  const user = window.getCurrentUser();
  if (!user) return { error: 'Giriş yapılmamış.' };
  const { data, error } = await window.supabase.rpc('complete_chapter', {
    p_chapter_id: chapterId,
    p_earned_xp: Math.max(0, Math.round(earnedXP || 0)),
    p_correct: correct || 0,
    p_wrong: wrong || 0
  });
  if (error || !data) {
    console.error('complete_chapter error:', error);
    return { error: rpcErrorText(error) };
  }
  const updated = window.profileToUser(data, { email: user.email, user_metadata: {} });
  window.saveCurrentUser(updated);
  return { user: updated };
};

// Eski çağrılarla uyumluluk için: seri artık complete_chapter içinde hesaplanır.
window.updateStreak = async function() {};

window.redeemReward = async function(reward) {
  const user = window.getCurrentUser();
  if (!user || !reward) return { error: 'Giriş yapılmamış.' };
  const { data, error } = await window.supabase.rpc('redeem_reward', { p_reward_id: reward.id });
  if (error || !data) {
    console.error('redeem_reward error:', error);
    return { error: rpcErrorText(error) };
  }
  const updated = window.profileToUser(data, { email: user.email, user_metadata: {} });
  window.saveCurrentUser(updated);
  return { user: updated };
};

window.clearCurrentUser = function() {
  localStorage.removeItem(window.STORAGE.CURRENT_USER);
};
