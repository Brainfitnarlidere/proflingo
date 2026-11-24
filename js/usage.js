'use strict';

window.UsageManager = {
  LIMIT_MINUTES: 30,
  TRACK_INTERVAL_MS: 30000, 
  // Kullanım süresi artık n8n'e gönderilmiyor: süreyi Supabase ölçüyor (js/oturum.js,
  // supabase/oturum_takibi.sql → gunluk_kullanim görünümü). Bu dosya sadece tarayıcıdaki
  // günlük sayaç ve 30 dk tebrik bildirimi için.
  
  init() {
    this.checkDayReset();
    this.startPeriodicCheck();
    this.requestNotificationPermission();
  },
  
  getTodayKey() {
    return 'lv_usage_' + new Date().toISOString().split('T')[0];
  },
  
  getTodayUsage() {
    const key = this.getTodayKey();
    return parseFloat(localStorage.getItem(key)) || 0;
  },
  
  addUsage(ms) {
    const mins = ms / 60000;
    const current = this.getTodayUsage();
    const newTotal = current + mins;
    localStorage.setItem(this.getTodayKey(), newTotal);
    
    // Trigger "Goal Reached" logic once
    if (newTotal >= this.LIMIT_MINUTES && current < this.LIMIT_MINUTES) {
      this.handleGoalReached();
    }
  },
  
  handleGoalReached() {
    this.showLocalNotification('Tebrikler! 🏆', 'Bugünkü 30 dakikalık İngilizce hedefini tamamladın!');
  },
  
  isLimitReached() {
    return this.getTodayUsage() >= this.LIMIT_MINUTES;
  },
  
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  },
  
  showLocalNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: 'favicon.ico' });
      } catch(e) { console.warn('Notification failed', e); }
    }
  },
  
  checkDayReset() {
    const key = this.getTodayKey();
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '0');
    }
  },
  
  sessionStartTS: null,
  
  startSession() {
    this.sessionStartTS = Date.now();
  },
  
  endSession() {
    if (this.sessionStartTS) {
      this.addUsage(Date.now() - this.sessionStartTS);
      this.sessionStartTS = null;
    }
  },
  
  startPeriodicCheck() {
    setInterval(() => {
      if (this.sessionStartTS) {
        const now = Date.now();
        this.addUsage(now - this.sessionStartTS);
        this.sessionStartTS = now;
      }
    }, this.TRACK_INTERVAL_MS);
  }
};

window.UsageManager.init();
