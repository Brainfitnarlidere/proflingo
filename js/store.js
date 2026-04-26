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
    const userId = localStorage.getItem(window.STORAGE.CURRENT_USER);
    if (!userId) return null;
    const users = window.getUsers();
    return users.find(u => String(u.id) === String(userId)) || null;
  } catch (e) {
    console.error('getCurrentUser error:', e);
    return null;
  }
};

window.saveCurrentUser = function(user) {
  try {
    if (user && user.id) {
      localStorage.setItem(window.STORAGE.CURRENT_USER, String(user.id));
    } else {
      localStorage.removeItem(window.STORAGE.CURRENT_USER);
    }
  } catch (e) {
    console.error('saveCurrentUser error:', e);
  }
};

window.updateUser = async function(updatedUser) {
  // Save locally first for responsiveness
  const currentId = localStorage.getItem(window.STORAGE.CURRENT_USER);
  if (currentId && String(currentId) === String(updatedUser.id)) {
      // We don't have all users anymore, just the current one in a real DB setup.
      // But we can store a local record if needed.
  }

  // Update Supabase
  if (window.supabase && updatedUser.id) {
    const { error } = await window.supabase
      .from('profiles')
      .upsert({
        id: updatedUser.id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        xp: updatedUser.xp,
        streak: updatedUser.streak,
        completed_chapters: updatedUser.completedChapters || [],
        rewards: updatedUser.rewards || [],
        last_practice_date: updatedUser.lastPracticeDate
      });

    if (error) {
      console.error('Supabase profile update error:', error);
    }
  }
};

window.updateStreak = async function() {
  const user = window.getCurrentUser();
  if (!user) return;
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const lastDate = user.lastPracticeDate;
  
  if (lastDate === today) return; // Already updated today
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (lastDate === yesterdayStr) {
    user.streak = (user.streak || 0) + 1;
  } else {
    user.streak = 1;
  }
  
  user.lastPracticeDate = today;
  await window.updateUser(user);
};

window.redeemReward = async function(reward) {
  const user = window.getCurrentUser();
  if (!user || (user.xp || 0) < reward.price) return false;
  
  user.xp -= reward.price;
  user.rewards = user.rewards || [];
  user.rewards.push({
    id: reward.id,
    date: new Date().toISOString(),
    name: reward.name
  });
  
  await window.updateUser(user);
  return true;
};

window.clearCurrentUser = function() {
  localStorage.removeItem(window.STORAGE.CURRENT_USER);
};
