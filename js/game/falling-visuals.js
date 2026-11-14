'use strict';

/* Tekrar modu: düşen görseller */

/* ══ NEW REVIEW MODE: FALLING VISUALS ══ */
window.renderFallingVisuals = function(q) {
  const container = window.$('quiz-falling-visuals');
  window.show(container);
  const area = window.$('falling-area');
  const inst = window.$('falling-instruction');
  const prog = window.$('falling-progress');
  area.innerHTML = '';
  
  let currentSet = 0;
  let score = 0;
  const sets = q.sets; // 5 sets
  
  const startSet = (idx) => {
    if (idx >= sets.length) {
      window.correctAns(null, 'falling');
      return;
    }
    currentSet = idx;
    score = 0;
    area.innerHTML = '';
    const targetKey = sets[idx].target;
    const targetItem = q.allReviewItems[targetKey];
    const ch = window.CHAPTER_DATA[window.gameState.chapterId];
    if (ch.isQAMode) {
      inst.innerHTML = `<div style="color:var(--text-light); font-size: 0.9em; margin-bottom: 8px;">Question: ${targetItem.word}</div>` +
                         `<div style="color:var(--primary); font-weight: 500;">Answer: "${targetItem.sentence}"</div>`;
    } else {
      inst.textContent = `Click the: "${targetItem.word}"`;
    }
    prog.textContent = `Sets: ${idx + 1}/5 | Correct: 0/3`;
    window.playTTS(targetItem.word);
    
    // Spawning loop — wait one frame for layout to be ready
    const spawn = () => {
      if (currentSet !== idx || score >= 3) return;
      const isTarget = Math.random() > 0.6;
      const possibleDistractors = q.distractors.filter(dk => dk !== targetKey);
      const key = isTarget ? targetKey : possibleDistractors[Math.floor(Math.random() * possibleDistractors.length)] || targetKey;
      const d = q.allReviewItems[key];
      if (!d) { setTimeout(spawn, 500); return; }
      
      const el = document.createElement('div');
      el.className = 'falling-item';
      if (d.image) el.style.backgroundImage = `url(${d.image})`;
      else el.textContent = d.emoji || '';
      
      // Use fallback dimensions if area hasn't laid out yet
      const areaW = area.offsetWidth || area.clientWidth || 300;
      const areaH = area.offsetHeight || area.clientHeight || 400;
      
      el.style.left = Math.random() * Math.max(areaW - 70, 50) + 'px';
      el.style.top = '-80px';
      area.appendChild(el);
      
      const speed = 2 + Math.random() * 4;
      let pos = -80;
      const fall = () => {
        if (!el.parentElement || score >= 3) { el.remove(); return; }
        pos += speed;
        el.style.top = pos + 'px';
        // Re-check area height each frame (use fallback if 0)
        const currentH = area.offsetHeight || area.clientHeight || 400;
        if (pos > currentH) {
          // Penalty if target item reaches the bottom without being clicked
          if (key === targetKey && currentSet === idx && score < 3) {
            window.loseHeart();
            window.gameState.earnedXP = Math.max(0, window.gameState.earnedXP - 30);
            window.showXPFloat(-30);
          }
          el.remove();
        } else {
          requestAnimationFrame(fall);
        }
      };
      requestAnimationFrame(fall);
      
      el.onclick = () => {
        if (key === targetKey) {
          score++;
          window.SOUNDS.pop.play().catch(() => {});
          prog.textContent = `Sets: ${idx + 1}/5 | Correct: ${score}/3`;
          el.remove();
          if (score >= 3) {
            setTimeout(() => startSet(idx + 1), 1000);
          }
        } else {
          // Penalty for clicking wrong item: -30 XP and lose a heart
          window.loseHeart();
          window.gameState.earnedXP = Math.max(0, window.gameState.earnedXP - 30);
          window.showXPFloat(-30);
          el.remove();
        }
      };
      
      setTimeout(spawn, 800 + Math.random() * 1000);
    };
    // Wait for next frame to ensure layout is ready before spawning
    requestAnimationFrame(() => {
      requestAnimationFrame(spawn);
    });
  };
  
  // Delay the first set start to let the section fully render
  requestAnimationFrame(() => {
    startSet(0);
  });
};
