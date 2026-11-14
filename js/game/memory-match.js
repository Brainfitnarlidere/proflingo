'use strict';

/* Tekrar modu: hafıza eşleştirme */

/* ══ NEW REVIEW MODE: MEMORY MATCH ══ */
window.renderMemoryMatch = function(q) {
  const container = window.$('quiz-memory-match');
  window.show(container);
  const grid = window.$('memory-grid');
  const pool = window.$('memory-words-pool');
  grid.innerHTML = '';
  pool.innerHTML = '';
  
  let selectedBox = null;
  let matchesFound = 0;
  const items = q.items; // 9 items
  const keys = Object.keys(items);
  
  // Create Boxes (Top)
  keys.forEach(k => {
    const box = document.createElement('div');
    box.className = 'memory-box';
    box.dataset.key = k;
    
    const front = document.createElement('div');
    front.className = 'box-front';
    const back = document.createElement('div');
    back.className = 'box-back';
    
    const d = items[k];
    if (d.image) back.style.backgroundImage = `url(${d.image})`;
    else back.textContent = d.emoji || '';
    
    box.appendChild(front);
    box.appendChild(back);
    
    box.onclick = () => {
      if (!window.gameState.answering || box.classList.contains('is-flipped')) return;
      if (selectedBox) selectedBox.classList.remove('is-selected');
      
      // Flip logic
      document.querySelectorAll('.memory-box').forEach(b => b.classList.remove('is-flipped'));
      box.classList.add('is-flipped');
      selectedBox = box;
      window.playTTS(d.word);
    };
    grid.appendChild(box);
  });
  
  // Create Words (Bottom) - Shuffled
  const shuffledKeys = window.shuffle([...keys]);
  shuffledKeys.forEach(k => {
    const opt = document.createElement('div');
    opt.className = 'memory-word-option';
    opt.textContent = items[k].word;
    opt.onclick = () => {
      if (!selectedBox || !window.gameState.answering) return;
      if (k === selectedBox.dataset.key) {
        // Correct
        opt.style.visibility = 'hidden';
        selectedBox.style.visibility = 'hidden';
        selectedBox = null;
        matchesFound++;
        window.SOUNDS.pop.play().catch(() => {});
        if (matchesFound === keys.length) {
          setTimeout(() => window.correctAns(null, 'memory'), 500);
        }
      } else {
        // Wrong
        window.SOUNDS.wrong.play().catch(() => {});
        window.loseHeart();
      }
    };
    pool.appendChild(opt);
  });
};
