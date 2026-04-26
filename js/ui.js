'use strict';
// Security Hardening Version: 1.0.2 - Sync Active Test

window.$ = function(id) { return document.getElementById(id); };
window.show = function(el) { if (el) el.classList.remove('hidden'); };
window.hide = function(el) { if (el) el.classList.add('hidden'); };
window.sanitizeHTML = function(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

window.showScreen = function(name) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => {
    s.classList.add('hidden');
    // Force direct style if needed, but class based is cleaner with the new CSS
  });
  
  const target = window.$(`screen-${name}`);
  if (target) {
    target.classList.remove('hidden');
    // Ensure scroll is at top when switching screens
    target.scrollTop = 0;
  } else {
    console.warn(`Screen not found: screen-${name}`);
  }
};

window.hideAllQuizSections = function() {
  const ids = [
    'quiz-choose-word', 
    'quiz-choose-image', 
    'quiz-listen-choice', 
    'quiz-match-pairs', 
    'quiz-speak-word', 
    'quiz-word-ordering',
    'quiz-memory-match',
    'quiz-falling-visuals',
    'quiz-drag-drop-scene',
    'quiz-matching-list'
  ];
  ids.forEach(id => {
    const el = window.$(id);
    if (el) el.classList.add('hidden');
  });
};

window.slideIdx = 0;

window.showOnboarding = function() {
  window.slideIdx = 0;
  window.updateSlide();
  window.show(window.$('app'));
  window.showScreen('onboarding');
};

window.updateSlide = function() {
  const wrapper = window.$('slides-wrapper');
  if (!wrapper) return;
  const slides = wrapper.querySelectorAll('.slide');
  const offset = -window.slideIdx * 100;
  slides.forEach((s) => {
    s.style.transform = `translateX(${offset}%)`;
  });
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === window.slideIdx);
  });
  const btnNext = window.$('btn-slide-next');
  if (btnNext) btnNext.textContent = window.slideIdx === 2 ? 'Başlayalım! →' : 'İleri →';
};

window.nextSlide = function(onFinish) {
  if (window.slideIdx < 2) { 
    window.slideIdx++; 
    window.updateSlide(); 
  } else { 
    if (onFinish) onFinish();
  }
};

window.showLoginForm = function() {
  window.show(window.$('form-login'));
  window.hide(window.$('form-register'));
  window.hide(window.$('form-verify'));
  window.clearErrors();
};

window.showRegisterForm = function() {
  window.hide(window.$('form-login'));
  window.show(window.$('form-register'));
  window.hide(window.$('form-verify'));
  window.clearErrors();
};

window.showVerifyForm = function() {
  window.hide(window.$('form-login'));
  window.hide(window.$('form-register'));
  window.show(window.$('form-verify'));
  window.clearErrors();
};

window.clearErrors = function() {
  [window.$('login-error'), window.$('reg-error'), window.$('verify-error')].forEach(el => {
    if (el) { el.textContent = ''; el.classList.add('hidden'); }
  });
  document.querySelectorAll('.field input').forEach(i => i.classList.remove('invalid'));
};

window.showError = function(elId, msg) {
  const el = window.$(elId);
  if (el) {
    el.textContent = msg; 
    el.classList.remove('hidden');
  }
};

window.updateUserUI = function(user) {
  if (!user) return;
  const initial = (user.name || '?')[0].toUpperCase();
  if (window.$('user-initial')) window.$('user-initial').textContent = initial;
  if (window.$('drawer-initial')) window.$('drawer-initial').textContent = initial;
  if (window.$('drawer-name')) window.$('drawer-name').textContent = user.name;
  if (window.$('drawer-email')) window.$('drawer-email').textContent = user.email;
  if (window.$('greeting-name')) window.$('greeting-name').textContent = user.name.split(' ')[0];
  if (window.$('home-xp')) window.$('home-xp').textContent = user.xp || 0;
  if (window.$('home-streak')) window.$('home-streak').textContent = user.streak || 0;
  if (window.$('h-streak')) window.$('h-streak').textContent = user.streak || 0;
  if (window.$('d-xp')) window.$('d-xp').textContent = user.xp || 0;
  if (window.$('d-streak')) window.$('d-streak').textContent = user.streak || 0;
  if (window.$('d-hearts')) window.$('d-hearts').textContent = user.hearts || 5;
};

window.showHeader = function() { window.show(window.$('app-header')); };

window.renderHome = function(user, state, onStartChapter) {
  if (window.UsageManager) window.UsageManager.endSession();
  if (user) window.updateUserUI(user);
  window.showHeader();
  window.hide(window.$('btn-back'));
  window.hideProgressUI();
  window.showScreen('home');

  const completed = user ? (user.completedChapters || []) : [];
  let maxUnlocked = 1;
  window.CHAPTERS.forEach((ch, idx) => {
    if (idx === 0 || completed.includes(window.CHAPTERS[idx - 1].id)) {
      maxUnlocked = ch.id;
    }
  });

  let page = state.homePage;
  if (page === undefined || page === null) {
    page = Math.ceil(maxUnlocked / 7);
    state.homePage = page;
  }

  const journey = window.$('journey');
  if (!journey) return;

  Array.from(journey.children).forEach(child => {
    if (!child.classList.contains('journey-path-svg')) {
      child.remove();
    }
  });

  const startIndex = (page - 1) * 7;
  const endIndex = page * 7;
  const currentChapters = window.CHAPTERS.slice(startIndex, endIndex);

  currentChapters.forEach((ch, i) => {
    const isUnlocked = true; // All chapters unlocked for now as per user request
    const isCompleted = completed.includes(ch.id);
    const isActive = isUnlocked && !isCompleted;
    const isLocked = !isUnlocked;

    const pos = window.MAP_POSITIONS[i] || { top: '50%', left: '50%' };
    const pin = document.createElement('div');
    pin.className = 'map-pin';
    if (isActive) pin.classList.add('is-active');
    else if (isUnlocked) pin.classList.add('is-unlocked');

    pin.style.top = pos.top;
    pin.style.left = pos.left;
    pin.textContent = isLocked ? '🔒' : (isCompleted ? '⭐' : ch.id);

    const label = document.createElement('div');
    label.className = `pin-label ${isLocked ? 'pin-label-locked' : ''}`;
    label.style.top = `calc(${pos.top} + 30px)`;
    label.style.left = pos.left;
    label.textContent = ch.name;

    if (!isLocked) {
      pin.addEventListener('click', () => {
        if (onStartChapter) onStartChapter(ch.id);
      });
    } else {
      pin.addEventListener('click', () => {
        window.showToast('toast-heart', '🔒 Bu bölüm henüz kilitli!');
        window.SOUNDS.wrong.currentTime = 0;
        window.SOUNDS.wrong.play().catch(() => { });
      });
    }

    journey.appendChild(pin);
    journey.appendChild(label);
  });

  window.renderPagination(page, state, (newPage) => {
    state.homePage = newPage;
    window.renderHome(user, state, onStartChapter);
  });
};

window.renderPagination = function(page, state, onPageChange) {
  let paginationContainer = window.$('home-pagination');
  if (!paginationContainer) {
    paginationContainer = document.createElement('div');
    paginationContainer.id = 'home-pagination';
    paginationContainer.className = 'home-pagination';
    paginationContainer.style.display = 'flex';
    paginationContainer.style.justifyContent = 'center';
    paginationContainer.style.gap = '20px';
    paginationContainer.style.marginTop = '20px';
    paginationContainer.style.zIndex = '10';
    paginationContainer.style.position = 'relative';
    const homeScreen = window.$('screen-home');
    if (homeScreen) homeScreen.appendChild(paginationContainer);
  }
  paginationContainer.innerHTML = '';
  const totalPages = Math.ceil(window.CHAPTERS.length / 7);
  const btnPrev = document.createElement('button');
  btnPrev.textContent = page > 1 ? `◀ ${(page - 2) * 7 + 1}-${(page - 1) * 7} Bölümler` : '◀ Önceki';
  btnPrev.className = 'btn-primary';
  btnPrev.style.padding = '10px 15px';
  btnPrev.style.fontSize = '0.9rem';
  btnPrev.style.borderRadius = 'var(--r-md)';
  if (page <= 1) {
    btnPrev.style.opacity = '0.5';
    btnPrev.style.pointerEvents = 'none';
  } else {
    btnPrev.onclick = () => onPageChange(page - 1);
  }
  paginationContainer.appendChild(btnPrev);
  const btnNext = document.createElement('button');
  const nextStart = page * 7 + 1;
  const nextEnd = Math.min((page + 1) * 7, window.CHAPTERS.length);
  btnNext.textContent = page < totalPages ? `${nextStart}-${nextEnd} Bölümler ▶` : 'Sonraki ▶';
  btnNext.className = 'btn-primary';
  btnNext.style.padding = '10px 15px';
  btnNext.style.fontSize = '0.9rem';
  btnNext.style.borderRadius = 'var(--r-md)';
  if (page >= totalPages) {
    btnNext.style.opacity = '0.5';
    btnNext.style.pointerEvents = 'none';
  } else {
    btnNext.onclick = () => onPageChange(page + 1);
  }
  paginationContainer.appendChild(btnNext);
};

window.renderHearts = function(hearts) {
  const el = window.$('hearts-display');
  if (!el) return;
  el.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const sp = document.createElement('span');
    sp.className = 'heart-icon' + (i >= hearts ? ' empty' : '');
    sp.textContent = '❤️';
    el.appendChild(sp);
  }
  if (window.$('d-hearts')) window.$('d-hearts').textContent = hearts;
};

window.showToast = function(id, msg) {
  const t = window.$(id);
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
};

window.setProgress = function(cur, total) {
  const fill = window.$('progress-bar-fill');
  const text = window.$('progress-text');
  if (fill) fill.style.width = `${(cur / total) * 100}%`;
  if (text) text.textContent = `${cur}/${total}`;
};

window.setPhase = function(phase, state) {
  const el = window.$('phase-indicator');
  if (!el) return;
  const ch = window.CHAPTER_DATA[state.chapterId];
  if (ch && ch.batches) {
    const n = state.currentBatch + 1, t = ch.batches.length;
    el.textContent = phase === 'learn' ? `Set ${n}/${t} — Öğrenme` : `Set ${n}/${t} — Quiz!`;
  } else {
    el.textContent = phase === 'learn' ? `Öğrenme` : `Quiz!`;
  }
  window.show(el);
};

window.showProgressUI = function() { window.show(window.$('progress-bar-container')); };
window.hideProgressUI = function() { window.hide(window.$('progress-bar-container')); window.hide(window.$('phase-indicator')); };

window.showXPFloat = function(amount) {
  const el = document.createElement('div');
  el.className = `xp-float ${amount >= 0 ? 'xp-gain' : 'xp-loss'}`;
  el.textContent = amount >= 0 ? `+${amount} XP` : `${amount} XP`;
  el.style.top = '100px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
};

window.renderLearnCard = function(state) {
  const ch = window.CHAPTER_DATA[state.chapterId];
  const batch = ch.batches[state.currentBatch];
  const key = batch[state.cardIndex];
  const data = ch.items[key];
  const vis = window.$('flashcard-visual-static');
  if (!vis) return;
  if (data.isCalendar) {
    vis.style.backgroundImage = 'none';
    vis.style.backgroundColor = 'transparent';
    vis.style.border = 'none';
    vis.style.boxShadow = 'none';
    vis.style.fontSize = 'inherit';
    const noText = (state.chapterId === 38 || state.chapterId === 39 || state.chapterId === 41);
    vis.innerHTML = window.renderCalendarLeaf(data.dayIndex, data.word, noText);
    vis.style.display = 'flex';
    vis.style.alignItems = 'center';
    vis.style.justifyContent = 'center';
  } else if (data.isMonth) {
    vis.style.backgroundImage = 'none';
    vis.style.backgroundColor = 'transparent';
    vis.style.border = 'none';
    vis.style.boxShadow = 'none';
    vis.style.fontSize = 'inherit';
    const noText = (state.chapterId === 38 || state.chapterId === 39 || state.chapterId === 41);
    vis.innerHTML = window.renderMonthLeaf(data.word, data.monthIndex, noText);
    vis.style.display = 'flex';
    vis.style.alignItems = 'center';
    vis.style.justifyContent = 'center';
  } else if (data.image) {
    vis.style.backgroundImage = `url(${data.image})`;
    vis.style.backgroundSize = 'contain';
    vis.style.backgroundPosition = 'center';
    vis.style.backgroundRepeat = 'no-repeat';
    vis.style.backgroundColor = 'transparent';
    vis.style.border = data.border ? '4px solid #BDBDBD' : '4px solid rgba(0,0,0,.04)';
    vis.textContent = '';
    vis.innerHTML = '';
  } else {
    vis.style.backgroundImage = 'none';
    vis.style.backgroundColor = data.color || '#F5F5F5';
    vis.style.border = '4px solid rgba(0,0,0,.04)';
    vis.textContent = data.emoji || '';
    vis.style.display = 'flex';
    vis.style.alignItems = 'center';
    vis.style.justifyContent = 'center';
    vis.style.fontSize = '80px';
    vis.innerHTML = '';
  }
  const wordEl = window.$('flashcard-word-static');
  const counterEl = window.$('card-counter');
  if (wordEl) {
    if (ch.isQAMode) {
      wordEl.innerHTML = `<div style="font-size:0.9em;color:var(--text-light);margin-bottom:5px;">${data.word}</div><div style="font-weight:bold;color:var(--primary);">${data.sentence}</div>`;
    } else {
      wordEl.textContent = data.word;
    }
  }
  if (counterEl) counterEl.textContent = `${state.cardIndex + 1} / ${batch.length}`;
  window.setProgress(state.cardIndex + 1, batch.length);
  const btnPrev = window.$('btn-prev-card');
  const btnNext = window.$('btn-next-card');
  if (btnPrev) btnPrev.style.display = state.cardIndex === 0 ? 'none' : 'flex';
  if (btnNext) btnNext.textContent = state.cardIndex === batch.length - 1 ? 'Quiz Başlat' : 'İleri →';
  
  if (ch.isQAMode) {
    window.playSlow(data.word + " ... " + data.sentence);
  } else if (ch.isRepeatMode || ch.isSentenceMode) {
    window.playSlow(data.word);
  } else {
    if (window.playTTS) setTimeout(() => window.playTTS(data.word || data.sentence), 100);
  }

  const btnRepeatWord = window.$('btn-speak-word');
  if (btnRepeatWord) {
    btnRepeatWord.onclick = () => {
      if (ch.isQAMode) {
        if ([33, 34, 38, 39, 40, 41, 42].includes(state.chapterId)) {
          window.playNativeTTS(data.word, { gender: 'male' });
          setTimeout(() => {
            window.playNativeTTS(data.sentence, { gender: 'female' });
          }, 2000); 
        } else {
          window.playSlow(data.word + " ... " + data.sentence);
        }
      } else {
        window.playTTS(data.word || data.sentence);
      }
    };
  }
};

window.showTransitionScreen = function(state) {
  const ch = window.CHAPTER_DATA[state.chapterId];
  const t = ch.transitions[state.currentBatch];
  const tot = state.quizCorrect + state.quizWrong;
  const pct = tot > 0 ? Math.round((state.quizCorrect / tot) * 100) : 0;
  if (window.$('transition-icon')) window.$('transition-icon').textContent = t.icon;
  if (window.$('transition-title')) window.$('transition-title').textContent = t.title;
  if (window.$('transition-subtitle')) window.$('transition-subtitle').textContent = t.subtitle;
  const scoreEl = window.$('transition-score');
  if (scoreEl) {
    scoreEl.innerHTML = `
      <p>Bu quiz: <strong>${pct}%</strong> doğru (${state.quizCorrect}/${tot})</p>
      <small>Sıradaki: <strong>${t.next}</strong></small>
    `;
  }
  window.hideProgressUI();
  window.showScreen('transition');
};

window.showFinalResults = function(state) {
  const correct = state.allCorrect, wrong = state.allWrong, total = correct + wrong;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const ch = window.CHAPTER_DATA[state.chapterId] || {};
  const chMeta = window.CHAPTERS.find(c => c.id === state.chapterId);
  if (window.$('stat-percentage')) window.$('stat-percentage').textContent = `${pct}%`;
  if (window.$('stat-correct')) window.$('stat-correct').textContent = correct;
  if (window.$('stat-wrong')) window.$('stat-wrong').textContent = wrong;
  if (window.$('stat-total')) window.$('stat-total').textContent = total;
  if (window.$('results-icon')) window.$('results-icon').textContent = pct >= 80 ? '🏆' : pct >= 60 ? '🎉' : '💪';
  if (window.$('results-title')) window.$('results-title').textContent = pct >= 80 ? 'Mükemmel!' : pct >= 60 ? 'Harika iş!' : 'Devam et!';
  const chapterLabel = chMeta?.name ? `"${chMeta.name}"` : 'bu bölüm';
  let subtitle = `${pct}% doğruluk — ${chapterLabel} bölümünü tamamladın!`;
  
  // Custom Phase Completion messages
  if (pct >= 80) {
    if (state.chapterId === 7) subtitle = "Tebrikler! Phase 1 (Temel Kavramlar) Tamamlandı! 🏆";
    else if (state.chapterId === 14) subtitle = "Tebrikler! Phase 2 (Gelişmiş Kelimeler) Tamamlandı! 🏆";
    else if (state.chapterId === 21) subtitle = "Harika! Phase 3 Tamamlandı! 🏆";
    else if (state.chapterId === 28) subtitle = "Mükemmel! Phase 4 (Cümle Yapıları) Tamamlandı! 🏆";
    else if (state.chapterId === 35) subtitle = "Efsane! Phase 5 (Diyaloglar) Tamamlandı! 🏆";
    else if (state.chapterId === 41) subtitle = "BÜYÜK BAŞARI! Tüm İngilizce Yolculuğunu Tamamladın! 👑🎉";
  }
  
  if (pct < 80 && pct >= 60) subtitle = `${pct}% doğruluk — ${chapterLabel} bölümünde iyi gidiyorsun!`;
  else if (pct < 60) subtitle = `${pct}% doğruluk — ${chapterLabel} bölümünde tekrar dene!`;
  if (window.$('results-subtitle')) window.$('results-subtitle').textContent = subtitle;
  const circ = 327;
  const ring = window.$('stat-ring-fill');
  if (ring) {
    ring.style.strokeDashoffset = circ;
    setTimeout(() => { ring.style.strokeDashoffset = circ - (pct / 100) * circ; }, 300);
  }
  const unlockEl = window.$('results-unlock');
  if (unlockEl) { if (pct >= 80) window.show(unlockEl); else window.hide(unlockEl); }
  window.hideProgressUI();
  window.showScreen('results');
};

window.openDrawer = function() {
  const d = window.$('screen-profile-drawer');
  if (d) {
    d.classList.add('open');
    d.classList.remove('hidden');
  }
};
window.closeDrawer = function() {
  const d = window.$('screen-profile-drawer');
  if (d) {
    d.classList.remove('open');
    d.classList.add('hidden');
  }
};

window.renderCalendarLeaf = function(dayIndex, dayName, noText = false) {
  const labels = ['M','T','W','T','F','S','S'];
  let gridHtml = '';
  labels.forEach(l => gridHtml += `<div class="cal-day-label">${l}</div>`);
  for(let i=1; i<=31; i++) {
    const isHighlight = (i === (dayIndex + 1)); 
    gridHtml += `<div class="cal-date ${isHighlight ? 'highlight' : ''}">${i}</div>`;
  }
  return `
    <div class="calendar-leaf">
      ${noText ? '' : `<div class="calendar-top">${dayName}</div>`}
      <div class="calendar-grid">${gridHtml}</div>
      ${noText ? '' : `<div class="calendar-bottom">MARCH</div>`}
    </div>
  `;
};

window.renderMonthLeaf = function(english, monthIndex, noText = false) {
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  let gridHtml = '';
  months.forEach((m, idx) => {
    const isHighlight = (idx === monthIndex);
    gridHtml += `<div class="month-grid-item ${isHighlight ? 'highlight' : ''}">${m}</div>`;
  });
  return `
    <div class="month-leaf-full">
      ${noText ? '' : `<div class="month-top-full">${english}</div>`}
      <div class="month-grid-full">${gridHtml}</div>
    </div>
  `;
};

window.showLimitScreen = function() {
  window.showScreen('limit');
};

window.renderMarket = function() {
  const user = window.getCurrentUser();
  if (!user) return;
  
  if (window.$('m-xp')) window.$('m-xp').textContent = user.xp || 0;
  
  const container = window.$('market-items');
  if (!container) return;
  
  container.innerHTML = '';
  
  const ownedIds = (user.rewards || []).map(r => r.id);
  
  window.REWARDS.forEach(item => {
    const isOwned = ownedIds.includes(item.id);
    const canAfford = (user.xp || 0) >= item.price;
    
    const card = document.createElement('div');
    card.className = 'market-item';
    card.innerHTML = `
      <div class="mi-icon">${item.icon}</div>
      <div class="mi-info">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div>
      <div class="mi-action">
        <button class="btn-buy ${isOwned ? 'owned' : ''}" 
                data-id="${item.id}" 
                ${(!canAfford && !isOwned) ? 'disabled' : ''}>
          ${isOwned ? 'Alındı ✓' : `${item.price.toLocaleString()} XP`}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const btnLimitClose = window.$('btn-limit-close');
  if (btnLimitClose) {
    btnLimitClose.onclick = () => {
      window.showScreen('home');
    };
  }

  // Market entry
  const btnOpenMarket = window.$('btn-open-market');
  if (btnOpenMarket) {
    btnOpenMarket.onclick = () => {
      window.closeDrawer();
      setTimeout(() => {
        window.renderMarket();
        window.showScreen('market');
      }, 300); // Wait for drawer close animation
    };
  }

  const btnMarketBack = window.$('btn-market-back');
  if (btnMarketBack) {
    btnMarketBack.onclick = () => {
      window.showScreen('home');
    };
  }

  // Market purchases (delegation)
  const marketItems = window.$('market-items');
  if (marketItems) {
    marketItems.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-buy');
      if (!btn || btn.disabled || btn.classList.contains('owned')) return;
      
      const rewardId = btn.dataset.id;
      const reward = window.REWARDS.find(r => r.id === rewardId);
      
      if (reward && window.redeemReward(reward)) {
        window.showToast('toast-heart', `🎉 ${reward.name} başarıyla alındı!`);
        window.renderMarket();
        const user = window.getCurrentUser();
        if (user) window.updateUserUI(user);
        
        // Play success sound
        if (window.SOUNDS && window.SOUNDS.correct) {
          window.SOUNDS.correct.currentTime = 0;
          window.SOUNDS.correct.play().catch(() => {});
        }
      } else {
        window.showToast('toast-heart', '❌ XP yetersiz veya bir hata oluştu.');
      }
    });
  }
});

