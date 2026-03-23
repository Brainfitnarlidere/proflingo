'use strict';

window.UsageManager = {
  LIMIT_MINUTES: 30,
  TRACK_INTERVAL_MS: 30000, 
  SYNC_INTERVAL_MS: 300000, // Sync heartbeats every 5 mins
  N8N_WEBHOOK_URL: 'https://n8n.brainfitnarlidere.com/webhook/lv-usage-sync', // Placeholder for user
  
  init() {
    this.checkDayReset();
    this.startPeriodicCheck();
    this.requestNotificationPermission();
    
    // Periodic sync to n8n
    setInterval(() => this.syncToN8N('heartbeat'), this.SYNC_INTERVAL_MS);
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
    this.syncToN8N('goal_reached');
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
  
  async syncToN8N(event = 'heartbeat') {
    if (!this.N8N_WEBHOOK_URL || !this.N8N_WEBHOOK_URL.includes('http')) return;
    
    // Use window.getCurrentUser if available
    const user = typeof window.getCurrentUser === 'function' ? window.getCurrentUser() : null;
    if (!user) return;
    
    const payload = {
      email: user.email,
      name: user.name,
      totalMinutes: Math.round(this.getTodayUsage() * 10) / 10,
      event: event,
      timestamp: new Date().toISOString()
    };
    
    try {
      await fetch(this.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log(`[Usage] Synced ${event} to n8n`);
    } catch (e) {
      console.warn('[Usage] Sync failed', e);
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
      this.syncToN8N('session_end');
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
