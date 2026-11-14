'use strict';

/* Winner Mode (hızlı eşleştirme) */

window.startWinnerMode = function() {
  const ch = window.CHAPTER_DATA[window.gameState.chapterId];
  if (!ch) return window.renderQuestion();
  
  // Prepare items
  const allKeys = Object.keys(ch.items);
  const selectedKeys = window.shuffle(allKeys).slice(0, 6); // 6 pairs for high-speed match
  
  const screen = window.$('screen-winner-mode');
  const container = window.$('winner-match-container');
  const timerBar = window.$('winner-timer-bar');
  const timerText = window.$('winner-timer-text');
  
  window.showScreen('winner-mode');
  container.innerHTML = '<div class="match-list-grid"><div class="match-list-left"></div><div class="match-list-right"></div></div>';
  
  const leftCol = container.querySelector('.match-list-left');
  const rightCol = container.querySelector('.match-list-right');
  
  const draggables = window.shuffle([...selectedKeys]);
  const targets = window.shuffle([...selectedKeys]);
  let matchesMade = 0;
  let timeLeft = 8;
  
  // Reset Timer UI
  timerBar.parentElement.classList.remove('winner-timer-active');
  void timerBar.offsetWidth; // Trigger reflow
  timerBar.parentElement.classList.add('winner-timer-active');
  timerText.textContent = '8s';
  
  const feverInterval = setInterval(() => {
    timeLeft--;
    timerText.textContent = `${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(feverInterval);
      endWinnerMode(false);
    }
  }, 1000);

  const endWinnerMode = async (won) => {
    clearInterval(feverInterval);
    
    // Rule: Winner Mode ends with 0 hearts (High Risk)
    window.gameState.hearts = 0;
    window.renderHearts(0);
    
    if (won) {
      const bonus = 100;
      window.gameState.earnedXP += bonus;
      window.showXPFloat(bonus);
      window.showToast('toast-heart', `🏆 MÜKEMMEL! +${bonus} XP Bonus!`);
      // Bonus earnedXP'ye eklendi; bölüm sonunda sunucuya bir kez gönderilir
      // (eskiden burada ayrıca kaydedildiği için iki kez sayılıyordu).
      if (window.SOUNDS.perfect) window.SOUNDS.perfect.play().catch(() => {});
    } else {
      window.showToast('toast-heart', '⏰ Süre bitti!');
    }
    
    const delay = won ? 1500 : 500; // Faster transition if lost/direct pass
    setTimeout(() => {
      window.showScreen('quiz');
      window.renderQuestion();
    }, delay);
  };

  draggables.forEach(k => {
    const d = ch.items[k];
    const el = document.createElement('div');
    el.className = 'scene-draggable match-list-item';
    el.draggable = true;
    el.dataset.key = k;
    window.applyVisual(el, d, true, true);
    
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', k);
      if (window.playTTS) window.playTTS(d.word);
    });
    leftCol.appendChild(el);
  });
  
  targets.forEach(k => {
    const d = ch.items[k];
    const zone = document.createElement('div');
    zone.className = 'match-dropzone list-dropzone';
    zone.textContent = d.word;
    zone.dataset.key = k;
    
    zone.addEventListener('dragover', e => e.preventDefault());
    zone.addEventListener('drop', e => {
      e.preventDefault();
      const dragKey = e.dataTransfer.getData('text/plain');
      if (dragKey === k) {
        zone.classList.add('is-matched');
        zone.textContent = '✅ ' + d.word;
        const dragEl = leftCol.querySelector(`[data-key="${k}"]`);
        if (dragEl) dragEl.style.visibility = 'hidden';
        
        // XP Reward: 20 XP per match in Winner Mode
        const xp = 20; 
        window.gameState.earnedXP += xp;
        window.showXPFloat(xp);
        
        matchesMade++;
        window.SOUNDS.pop.play().catch(() => {});
        if (matchesMade === selectedKeys.length) {
          endWinnerMode(true);
        }
      } else {
        window.SOUNDS.wrong.play().catch(() => {});
      }
    });
    rightCol.appendChild(zone);
  });
};
