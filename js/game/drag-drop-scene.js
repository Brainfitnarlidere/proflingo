'use strict';

/* Tekrar modu: sahneye sürükle-bırak ve 10'lu eşleştirme listesi */

/* ══ NEW REVIEW MODE: DRAG DROP SCENE ══ */
window.renderDragDropScene = function(q) {
  const container = window.$('quiz-drag-drop-scene');
  window.show(container);
  const bg = window.$('scene-background');
  const sidebar = window.$('scene-parts');
  bg.innerHTML = '';
  sidebar.innerHTML = '';
  
  // Önceki sahneden kalan satır içi arka planı temizle (yoksa 28'den sonra 50/52
  // bölümlerinde gardırop görünüyordu)
  bg.className = 'scene-bg';
  bg.style.backgroundImage = '';
  bg.style.backgroundSize = '';

  // Set background based on phase
  if (q.bgClass) {
    bg.className = 'scene-bg ' + q.bgClass;
  } else if (q.bgImage) {
    bg.style.backgroundImage = `url(${q.bgImage})`;
    bg.style.backgroundSize = 'cover';
  }
  
  let matched = 0;
  q.zones.forEach(z => {
    const zone = document.createElement('div');
    zone.className = 'scene-drop-zone';
    zone.style.left = z.x + '%';
    zone.style.top = z.y + '%';
    zone.style.width = '60px';
    zone.style.height = '60px';
    zone.dataset.key = z.key;
    
    // Add text label for clarity
    const label = document.createElement('span');
    label.className = 'scene-drop-zone-label';
    const itemData = q.allReviewItems[z.key];
    label.textContent = itemData ? itemData.word : '';
    zone.appendChild(label);
    
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('active'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('active'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('active');
      const key = e.dataTransfer.getData('text/plain');
      if (key === z.key) {
        zone.style.border = 'none';
        zone.style.background = 'none';
        zone.querySelector('.scene-drop-zone-label').style.display = 'none';
        const d = q.allReviewItems[key];
        if (d.image) zone.style.backgroundImage = `url(${d.image})`;
        else zone.textContent = d.emoji || '';
        zone.style.backgroundSize = 'contain';
        zone.style.backgroundRepeat = 'no-repeat';
        
        const dragEl = sidebar.querySelector(`[data-key="${key}"]`);
        if (dragEl) dragEl.style.visibility = 'hidden';
        
        matched++;
        window.SOUNDS.pop.play().catch(() => {});
        if (matched === q.zones.length) {
          setTimeout(() => window.correctAns(null, 'scene'), 1000);
        }
      } else {
        window.loseHeart();
      }
    });
    bg.appendChild(zone);
  });
  
  window.shuffle(q.zones).forEach(z => {
    const d = q.allReviewItems[z.key];
    const el = document.createElement('div');
    el.className = 'scene-draggable';
    el.dataset.key = z.key;
    el.draggable = true;
    
    if (d.image) {
      const img = document.createElement('img');
      img.src = d.image;
      img.style.width = '85%';
      img.style.height = '85%';
      img.style.pointerEvents = 'none'; // So it doesn't interfere with drag start of parent
      el.appendChild(img);
    } else {
      el.textContent = d.emoji || '';
    }
    
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', z.key);
      e.dataTransfer.effectAllowed = 'move';
      window.playTTS(d.word);
    });
    sidebar.appendChild(el);
  });
};

window.getSceneForChapter = function(chapterId, allItems) {
  const scenes = {
    7: {
      bgClass: 'scene-body-p1',
      zones: [
        { key: 'ch6_head', x: 50, y: 18 },
        { key: 'ch6_mouth', x: 50, y: 28 },
        { key: 'ch6_arm', x: 40, y: 50 },
        { key: 'ch6_hand', x: 33, y: 60 },
        { key: 'ch6_finger', x: 32, y: 68 },
        { key: 'ch6_leg', x: 45, y: 80 },
        { key: 'ch6_foot', x: 45, y: 96 }
      ]
    },
    14: {
      bgClass: 'scene-kitchen-p2',
      zones: [
        { key: 'ch8_bread', x: 22, y: 46 },
        { key: 'ch8_pizza', x: 92, y: 47 },
        { key: 'ch8_milk', x: 28, y: 32 },
        { key: 'ch8_cheese', x: 38, y: 46 },
        { key: 'ch8_egg', x: 81, y: 47 },
        { key: 'ch10_clock', x: 74, y: 18 }
      ]
    },
    21: {
      bgImage: 'images/bg/home_bg.webp?v=' + Date.now(),
      zones: [
        { key: 'ch10_door', x: 95, y: 60 },
        { key: 'ch10_window', x: 20, y: 30 },
        { key: 'ch10_sofa', x: 50, y: 70 },
        { key: 'ch10_lamp', x: 85, y: 45 },
        { key: 'ch10_chair', x: 5, y: 75 }
      ]
    },
    28: {
      bgImage: 'images/bg/wardrobe_bg.webp?v=' + Date.now(),
      zones: [
        { key: 'ch5_shirt', x: 42, y: 32 },
        { key: 'ch5_pants', x: 65, y: 64 },
        { key: 'ch5_shoes', x: 50, y: 84 },
        { key: 'ch5_hat', x: 35, y: 18 },
        { key: 'ch5_jacket', x: 62, y: 32 }
      ]
    },
    // Şehir sahnesi: 52. bölüm (USTALIK SINAVI). 35. bölüm eşleştirme oyunu kullandığı
    // için sahne sorusuna hiç ulaşmıyordu; şehir kelimeleri 14, 50 ve 52'de var.
    52: {
      bgClass: 'scene-city-p5',
      zones: [
        { key: 'ch12_school', x: 20, y: 30 },
        { key: 'ch12_hospital', x: 80, y: 30 },
        { key: 'ch12_market', x: 50, y: 40 },
        { key: 'ch12_park', x: 50, y: 80 },
        { key: 'ch12_house', x: 20, y: 70 }
      ]
    }
  };
  const scene = scenes[chapterId] || scenes[7];
  // Sahnenin tüm kelimeleri bu bölümün tekrar listesinde yoksa sahne sorusunu atla
  // (eskiden 49 ve 51. bölümler bu yüzden açılırken çöküyordu).
  if (!allItems || !scene.zones.every(z => allItems[z.key])) return null;
  return scene;
};

window.renderMatchingList10 = function(q) {
  window.show(window.$('quiz-matching-list'));
  const container = window.$('quiz-matching-list');
  container.innerHTML = '<div class="match-list-grid"><div class="match-list-left"></div><div class="match-list-right"></div></div>';
  
  const leftCol = container.querySelector('.match-list-left');
  const rightCol = container.querySelector('.match-list-right');
  
  const keys = q.keys;
  const draggables = window.shuffle([...keys]);
  const targets = window.shuffle([...keys]);
  let matchesMade = 0;
  
  draggables.forEach(k => {
    const d = q.allReviewItems[k];
    const el = document.createElement('div');
    el.className = 'scene-draggable match-list-item';
    el.draggable = true;
    el.dataset.key = k;
    
    // Use applyVisual to handle image, calendar, month, or emoji
    window.applyVisual(el, d, true, true); // small=true, isMatch=true (matches the look of other match games)
    el.style.width = '80px';
    el.style.height = '80px';
    el.style.overflow = 'hidden';
    
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', k);
      if (window.playTTS) window.playTTS(d.word);
    });
    el.onclick = () => { if (window.playTTS) window.playTTS(d.word); };
    leftCol.appendChild(el);
  });
  
  targets.forEach(k => {
    const d = q.allReviewItems[k];
    const zone = document.createElement('div');
    zone.className = 'match-dropzone list-dropzone';
    
    // Show either sentence (QA) or word (Standard) based on request
    const displayText = (q.matchType === 'qa') ? (d.sentence || d.word) : d.word;
    zone.textContent = displayText;
    zone.dataset.key = k;
    
    zone.addEventListener('dragover', e => e.preventDefault());
    zone.addEventListener('drop', e => {
      e.preventDefault();
      const dragKey = e.dataTransfer.getData('text/plain');
      if (dragKey === k) {
        zone.classList.add('is-matched');
        const displayText = (q.matchType === 'qa') ? (d.sentence || d.word) : d.word;
        zone.textContent = '✅ ' + displayText;
        const dragEl = leftCol.querySelector(`[data-key="${k}"]`);
        if (dragEl) dragEl.style.visibility = 'hidden';
        matchesMade++;
        window.SOUNDS.pop.play().catch(() => {});
        if (matchesMade === q.keys.length) {
          setTimeout(() => window.correctAns(null, 'match'), 800);
        }
      } else {
        window.SOUNDS.wrong.play().catch(() => {});
        window.loseHeart();
        window.gameState.firstTry = false;
      }
    });
    rightCol.appendChild(zone);
  });
};
