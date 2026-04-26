'use strict';

window.gameState = {
  chapterId: 1,
  currentBatch: 0,
  learnedKeys: [],
  cardIndex: 0,
  questions: [],
  qIndex: 0,
  answering: true,
  firstTry: true,
  earnedXP: 0,
  hearts: 5,
  consecutiveCorrects: 0,
  wrongTotal: 0,
  quizCorrect: 0,
  quizWrong: 0,
  allCorrect: 0,
  allWrong: 0,
  memoryGameDone: false,
  homePage: 1,
  perfectStreak: 0,
  isSpeedMode: false,
  targetLanguage: localStorage.getItem('lv_target_lang') || 'en'
};

window.resetGameState = function() {
  window.gameState = {
    ...window.gameState,
    currentBatch: 0,
    learnedKeys: [],
    cardIndex: 0,
    questions: [],
    qIndex: 0,
    answering: true,
    firstTry: true,
    earnedXP: 0,
    hearts: 5,
    consecutiveCorrects: 0,
    wrongTotal: 0,
    quizCorrect: 0,
    quizWrong: 0,
    allCorrect: 0,
    allWrong: 0,
    memoryGameDone: false,
    winnerModeUsed: false
  };
};


window.startChapter = function(id) {
  if (window.UsageManager && window.UsageManager.isLimitReached()) {
    window.showLimitScreen();
    return;
  }
  if (window.UsageManager) window.UsageManager.startSession();

  window.resetGameState();
  window.gameState.chapterId = id;
  window.renderHearts(window.gameState.hearts);
  window.show(window.$('btn-back'));
  window.showHeader();

  const ch = window.CHAPTER_DATA[id];
  if (ch.isReview) {
    window.gameState.learnedKeys = Object.keys(ch.allReviewItems || {});
    window.startQuizPhase();
  } else {
    window.startLearnPhase();
  }
};

window.startLearnPhase = function() {
  const ch = window.CHAPTER_DATA[window.gameState.chapterId];
  if (ch && ch.batches) {
    ch.batches[window.gameState.currentBatch].forEach(k => { 
      if (!window.gameState.learnedKeys.includes(k)) window.gameState.learnedKeys.push(k); 
    });
  }
  window.gameState.cardIndex = 0;
  window.setPhase('learn', window.gameState);
  window.showProgressUI();
  window.renderLearnCard(window.gameState);
  window.showScreen('learn');
};

window.nextCard = function() {
  const batch = window.CHAPTER_DATA[window.gameState.chapterId].batches[window.gameState.currentBatch];
  if (window.gameState.cardIndex < batch.length - 1) { 
    window.gameState.cardIndex++; 
    window.renderLearnCard(window.gameState); 
  } else {
    window.startQuizPhase();
  }
};

window.prevCard = function() {
  if (window.gameState.cardIndex > 0) { 
    window.gameState.cardIndex--; 
    window.renderLearnCard(window.gameState); 
  }
};

window.startQuizPhase = function() {
  window.gameState.questions = window.generateQuestions(window.gameState.learnedKeys);
  window.gameState.qIndex = 0;
  window.gameState.quizCorrect = 0;
  window.gameState.quizWrong = 0;
  window.gameState.answering = true;
  window.setPhase('quiz', window.gameState);
  window.hideAllQuizSections();
  window.showProgressUI();
  window.showScreen('quiz');
  window.renderQuestion();
};

window.shuffle = function(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

window.pick3Wrong = function(k, pool) { 
  return window.shuffle(pool.filter(x => x !== k)).slice(0, 3); 
};

window.rand = function(arr) { 
  return arr[Math.floor(Math.random() * arr.length)]; 
};

window.makeQuestion = function(key, type, pool) {
  const options = window.shuffle([key, ...window.pick3Wrong(key, pool)]);
  let prompt = '';
  const ch = window.CHAPTER_DATA[window.gameState.chapterId];
  if (type === 'word-choice') prompt = window.rand(ch.wordPrompts);
  else if (type === 'image-choice') prompt = ch.imgPrompts ? window.rand(ch.imgPrompts)(key, window.gameState) : 'Find the image';
  else if (type === 'speak') prompt = window.rand(ch.speakPrompts);
  else prompt = "Listen closely 🔊";
  return { key, type, options, prompt };
};

window.generateQuestions = function(keys) {
  let qs = [];
  const ch = window.CHAPTER_DATA[window.gameState.chapterId];

  // REVIEW CHAPTERS: generate only review-specific questions and return immediately
  if (ch.isReview) {
    const allItems = ch.allReviewItems || {};
    const reviewKeys = Object.keys(allItems);
    if (reviewKeys.length === 0) return qs;
    const shuffledKeys = window.shuffle([...reviewKeys]);
    
    // --- Phase 5 Review (Chapter 35) & Phase 6 Review (Chapter 42) Specialization ---
    // User requested FOUR phases of 6x6 matching list for these review chapters.
    if (window.gameState.chapterId === 35 || window.gameState.chapterId === 42) {
      let qaKeys, stdKeys;
      
      if (window.gameState.chapterId === 35) {
        qaKeys = window.shuffle(reviewKeys.filter(k => allItems[k].sourceChapter === 33 || allItems[k].sourceChapter === 34));
        stdKeys = window.shuffle(reviewKeys.filter(k => allItems[k].sourceChapter >= 29 && allItems[k].sourceChapter <= 32));
      } else {
        // Chapter 42: Phase 6
        qaKeys = window.shuffle(reviewKeys.filter(k => allItems[k].sourceChapter === 40 || allItems[k].sourceChapter === 41));
        stdKeys = window.shuffle(reviewKeys.filter(k => allItems[k].sourceChapter >= 36 && allItems[k].sourceChapter <= 39));
      }
      
      // Phase 1: QA matching - Set A
      const p1Keys = qaKeys.slice(0, 6);
      if (p1Keys.length > 0) {
        qs.push({ 
          type: 'matching-list-10', 
          prompt: 'Match the pairs!', 
          keys: p1Keys, 
          allReviewItems: allItems,
          matchType: 'qa'
        });
      }
      
      // Phase 2: Standard matching - Set A
      const p2Keys = stdKeys.slice(0, 6);
      if (p2Keys.length > 0) {
        qs.push({ 
          type: 'matching-list-10', 
          prompt: 'Match the pairs!', 
          keys: p2Keys, 
          allReviewItems: allItems,
          matchType: 'standard'
        });
      }

      // Phase 3: QA matching - Set B
      const p3Keys = qaKeys.slice(6, 12);
      if (p3Keys.length > 0) {
        qs.push({ 
          type: 'matching-list-10', 
          prompt: 'Match the pairs!', 
          keys: p3Keys, 
          allReviewItems: allItems,
          matchType: 'qa'
        });
      }

      // Phase 4: Standard matching - Set B
      const p4Keys = stdKeys.slice(6, 12);
      if (p4Keys.length > 0) {
        qs.push({ 
          type: 'matching-list-10', 
          prompt: 'Match the pairs!', 
          keys: p4Keys, 
          allReviewItems: allItems,
          matchType: 'standard'
        });
      }
      return qs; 
    }

    // --- Standard Review Flow (Phase 1-4 / Chapters 7, 14, 21, 28) ---
    // 1. Drag-Drop Scene
    try {
      const sceneData = window.getSceneForChapter(window.gameState.chapterId, allItems);
      if (sceneData) {
        qs.push({
          type: 'drag-drop-scene',
          prompt: 'Complete the scene!',
          ...sceneData,
          allReviewItems: allItems
        });
      }
    } catch (e) {
      console.error("Error generating drag-drop scene:", e);
    }

    // 2. Memory Match (9 items)
    const memItems = {};
    shuffledKeys.slice(0, Math.min(9, shuffledKeys.length)).forEach(k => memItems[k] = allItems[k]);
    qs.push({ type: 'memory-match', prompt: 'Match the 9 pairs!', items: memItems });
    
    // 3. Falling Visuals
    const fallingSets = [];
    const targetKeys = window.shuffle([...reviewKeys]).slice(0, 5);
    targetKeys.forEach(tk => {
      fallingSets.push({ target: tk });
    });
    qs.push({ 
      type: 'falling-visuals', 
      prompt: 'Reaction Game: Click the correctly named visuals!', 
      sets: fallingSets,
      allReviewItems: allItems,
      distractors: reviewKeys
    });
    
    return qs;
  }

  // Normal chapters
  let workKeys = keys;

  if (ch.isSentenceMode) {
    workKeys.forEach(k => {
      qs.push({ key: k, type: 'word-ordering', prompt: 'Sıraya diz!' });
      qs.push({ key: k, type: 'speak', prompt: window.rand(ch.speakPrompts) });
    });
  } else if (ch.isRepeatMode) {
    workKeys.forEach(k => {
      qs.push({ key: k, type: 'speak', prompt: window.rand(ch.speakPrompts) });
    });
  } else if (ch.isQAMode) {
    if (workKeys.length >= 3) {
      const matchOptions = window.shuffle([...workKeys]).slice(0, Math.min(3, workKeys.length));
      qs.push({ key: matchOptions[0], type: 'match-pairs', options: matchOptions, prompt: "Match the pairs!" });
    }
    workKeys.forEach(k => {
      const distractors = window.shuffle(workKeys.filter(dk => dk !== k)).slice(0, 3);
      const options = window.shuffle([k, ...distractors]);
      qs.push({ key: k, type: 'word-choice', prompt: window.CHAPTER_DATA[window.gameState.chapterId].items[k].word, options });
      qs.push({ key: k, type: 'speak', prompt: 'Answer the question' });
    });
  } else {
    if (workKeys.length >= 3) {
      const matchCount = 1;
      for (let i = 0; i < matchCount; i++) {
        const matchOptions = window.shuffle([...workKeys]).slice(0, 3);
        qs.push({ key: matchOptions[0], type: 'match-pairs', options: matchOptions, prompt: "Match the pairs!" });
      }
    }
    workKeys.forEach((k) => {
      const types = ['word-choice', 'image-choice', 'listen-choice', 'speak'];
      const sliced = window.shuffle(types).slice(0, 2);
      sliced.forEach(t => qs.push(window.makeQuestion(k, t, workKeys)));
    });
  }

  return window.shuffle(qs);
};



let quizTimer = null;

window.stopTimer = function() {
  if (quizTimer) clearInterval(quizTimer);
  const bar = window.$('speed-timer-bar');
  if (bar) window.hide(bar);
};

window.startTimer = function(seconds) {
  window.stopTimer();
  const bar = window.$('speed-timer-bar');
  const fill = window.$('speed-timer-fill');
  if (!bar || !fill) return;
  
  window.show(bar);
  let timeLeft = seconds * 10; // 0.1s steps
  const total = seconds * 10;
  
  quizTimer = setInterval(() => {
    timeLeft--;
    fill.style.width = `${(timeLeft / total) * 100}%`;
    if (timeLeft <= 0) {
      window.stopTimer();
      window.loseHeart();
      window.gameState.qIndex++;
      window.clearStyles();
      window.renderQuestion();
    }
  }, 100);
};

window.applyVisual = function(el, d, small = false, isMatch = false, customScale = null) {
  if (!el) return;
  el.innerHTML = '';
  el.textContent = '';
  
  const isTimeCh = (window.gameState.chapterId === 38 || window.gameState.chapterId === 39 || window.gameState.chapterId === 41);
  
  // Rule: Choice options (4-item grid) should be "Large" (around 0.65)
  // Single stimulus should be "Medium" (around 0.6)
  let scaleVal = 1.0;
  if (isMatch) scaleVal = 0.30; // Draggable in match pairs
  else if (small) scaleVal = 0.65; // Choice option in 4-item grid
  else if (isTimeCh) scaleVal = 0.60; // Single stimulus in Quiz (Word choice / Speak)
  
  if (customScale !== null) scaleVal = customScale;

  if (d.isCalendar) {
    el.style.backgroundImage = 'none';
    el.style.backgroundColor = 'transparent';
    el.style.border = 'none';
    el.style.boxShadow = 'none';
    el.style.fontSize = 'inherit';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    const noText = (window.gameState.chapterId === 38 || window.gameState.chapterId === 39 || window.gameState.chapterId === 41 || window.gameState.chapterId === 42);
    const html = window.renderCalendarLeaf(d.dayIndex, d.word, noText);
    if (small || isMatch || isTimeCh || customScale !== null) {
       el.innerHTML = `<div style="transform: scale(${scaleVal}); transform-origin: center;">${html}</div>`;
    } else {
       el.innerHTML = html;
    }
    return;
  }
  if (d.isMonth) {
    el.style.backgroundImage = 'none';
    el.style.backgroundColor = 'transparent';
    el.style.border = 'none';
    el.style.boxShadow = 'none';
    el.style.fontSize = 'inherit';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    const noText = (window.gameState.chapterId === 38 || window.gameState.chapterId === 39 || window.gameState.chapterId === 41 || window.gameState.chapterId === 42);
    const html = window.renderMonthLeaf(d.word, d.monthIndex, noText);
    if (small || isMatch || isTimeCh || customScale !== null) {
       el.innerHTML = `<div style="transform: scale(${scaleVal}); transform-origin: center;">${html}</div>`;
    } else {
       el.innerHTML = html;
    }
    return;
  }
  if (d.image) {
    el.style.backgroundImage = `url(${d.image})`;
    el.style.backgroundSize = 'contain';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundColor = 'transparent';
  } else {
    el.style.backgroundImage = 'none';
    el.style.backgroundColor = d.color || '#F5F5F5';
    el.textContent = d.emoji || '';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.fontSize = small ? '40px' : '80px';
  }
};

window.renderQuestion = function() {
  window.stopTimer();
  if (window.gameState.qIndex >= window.gameState.questions.length) { 
    window.onQuizDone(); 
    return; 
  }
  const q = window.gameState.questions[window.gameState.qIndex];
  
  if (window.gameState.isSpeedMode) {
    window.startTimer(10); // 10 seconds per question in speed mode
  }
  window.setProgress(window.gameState.qIndex + 1, window.gameState.questions.length);
  const promptEl = window.$('quiz-prompt');
  if (promptEl) promptEl.textContent = q.prompt;
  const hintEl = window.$('correct-hint');
  if (hintEl) { hintEl.textContent = ''; hintEl.classList.add('hidden'); }
  window.gameState.answering = true;
  window.gameState.firstTry = true;
  window.hideAllQuizSections(); // Call the new function here

  if (q.type === 'word-choice') window.renderWordChoice(q);
  else if (q.type === 'image-choice') window.renderImageChoice(q);
  else if (q.type === 'listen-choice') window.renderListenChoice(q);
  else if (q.type === 'word-ordering') window.renderWordOrdering(q);
  else if (q.type === 'match-pairs') window.renderMatchPairs(q);
  else if (q.type === 'speak') window.renderSpeakWord(q);
  else if (q.type === 'memory-match') window.renderMemoryMatch(q);
  else if (q.type === 'falling-visuals') window.renderFallingVisuals(q);
  else if (q.type === 'drag-drop-scene') window.renderDragDropScene(q);
  else if (q.type === 'matching-list-10') window.renderMatchingList10(q);

  if (q.type === 'listen-choice') {
    window.playTTS(window.CHAPTER_DATA[window.gameState.chapterId].items[q.key].word);
  } else {
    // Skip reading prompt for dual-voice QA speak tasks because renderSpeakWord handles it
    const isDualQA = [33, 34, 40, 41, 42].includes(window.gameState.chapterId);
    if (!(q.type === 'speak' && isDualQA)) {
      window.playTTS(q.prompt);
    }
  }
};

window.renderWordChoice = function(q) {
  window.show(window.$('quiz-choose-word'));
  window.hide(window.$('quiz-choose-image'));
  window.hide(window.$('quiz-listen-choice'));
  window.hide(window.$('quiz-match-pairs'));
  window.hide(window.$('quiz-speak-word'));
  window.hide(window.$('quiz-word-ordering'));

  const d = window.CHAPTER_DATA[window.gameState.chapterId].items[q.key];
  const c = window.$('quiz-stimulus-circle');
  if (c && c.parentElement) {
    if (d.isCalendar || d.isMonth) {
      c.parentElement.classList.add('stim-expanded');
    } else {
      c.parentElement.classList.remove('stim-expanded');
    }
  }
  window.applyVisual(c, d);

  const grid = window.$('quiz-word-options');
  grid.innerHTML = '';
  const ch = window.CHAPTER_DATA[window.gameState.chapterId];
  q.options.forEach(k => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-word';
    btn.textContent = ch.isQAMode ? ch.items[k].sentence : ch.items[k].word;
    btn.dataset.key = k;
    btn.onclick = () => { if (k === q.key) window.correctAns(btn, 'word'); else window.wrongAns(btn, q, 'word'); };
    grid.appendChild(btn);
  });
};

window.renderImageChoice = function(q) {
  window.hide(window.$('quiz-choose-word'));
  window.hide(window.$('quiz-match-pairs'));
  window.hide(window.$('quiz-speak-word'));
  window.hide(window.$('quiz-word-ordering'));
  window.show(window.$('quiz-choose-image'));

  const ch = window.CHAPTER_DATA[window.gameState.chapterId];
  const d_target = ch.items[q.key];
  const promptEl = window.$('quiz-prompt');
  if (promptEl) {
    const targetText = (ch.isQAMode ? d_target.sentence : d_target.word);
    promptEl.textContent = `Find ${targetText}`;
  }
  if (window.$('quiz-choose-image')) {
    const stim = window.$('quiz-choose-image').querySelector('.quiz-stimulus');
    if (stim) window.hide(stim);
  }
  if (window.playTTS) window.playTTS(ch.isQAMode ? d_target.sentence : d_target.word);

  const grid = window.$('quiz-image-options');
  if (grid) {
    if (window.gameState.chapterId === 38 || window.gameState.chapterId === 39) {
      grid.classList.add('match-compact');
    } else {
      grid.classList.remove('match-compact');
    }
  }
  grid.innerHTML = '';
  q.options.forEach(k => {
    const d = ch.items[k];
    const btn = document.createElement('button');
    btn.className = 'choice-image quiz-option-color';
    window.applyVisual(btn, d, true);
    btn.dataset.key = k;
    btn.onclick = () => { if (k === q.key) window.correctAns(btn, 'color'); else window.wrongAns(btn, q, 'color'); };
    grid.appendChild(btn);
  });
};

window.renderListenChoice = function(q) {
  window.show(window.$('quiz-listen-choice'));
  window.hide(window.$('quiz-choose-word'));
  window.hide(window.$('quiz-choose-image'));
  window.hide(window.$('quiz-match-pairs'));
  window.hide(window.$('quiz-speak-word'));
  window.hide(window.$('quiz-word-ordering'));
  const btnPlay = window.$('btn-quiz-listen');
  if (btnPlay) {
    btnPlay.onclick = () => window.playTTS(window.CHAPTER_DATA[window.gameState.chapterId].items[q.key].sentence || window.CHAPTER_DATA[window.gameState.chapterId].items[q.key].word);
  }
    const grid = window.$('quiz-listen-options');
    if (grid) {
      if (window.gameState.chapterId === 38 || window.gameState.chapterId === 39) {
        grid.style.maxWidth = '250px';
        grid.style.margin = '0 auto';
        grid.style.gap = '0.8rem';
        const stim = window.$('quiz-listen-choice').querySelector('.quiz-stimulus');
        if (stim) {
           stim.style.marginBottom = '0.5rem';
           const btn = stim.querySelector('button');
           if (btn) btn.style.fontSize = '3.5rem';
        }
      } else {
        grid.style.maxWidth = '320px';
        grid.style.gap = '.65rem';
      }
    }
    grid.innerHTML = '';
    q.options.forEach(k => {
      const d = window.CHAPTER_DATA[window.gameState.chapterId].items[k];
      const btn = document.createElement('button');
      btn.className = 'choice-image quiz-option-color';
      window.applyVisual(btn, d, true);
      btn.dataset.key = k;
      btn.onclick = () => { if (k === q.key) window.correctAns(btn, 'color'); else window.wrongAns(btn, q, 'color'); };
      grid.appendChild(btn);
    });
};

window.renderWordOrdering = function(q) {
  window.hide(window.$('quiz-choose-word'));
  window.hide(window.$('quiz-choose-image'));
  window.hide(window.$('quiz-listen-choice'));
  window.hide(window.$('quiz-match-pairs'));
  window.hide(window.$('quiz-speak-word'));
  window.show(window.$('quiz-word-ordering'));

  const item = window.CHAPTER_DATA[window.gameState.chapterId].items[q.key];
  const targetSentence = item.word;
  const correctWords = targetSentence.split(' ');
  let currentSelection = [];
  const slotsContainer = window.$('ordering-slots');
  const optionsContainer = window.$('ordering-options');
  const visualContainer = window.$('ordering-visual-container');
  const visualEl = window.$('ordering-visual');
  slotsContainer.innerHTML = '';
  optionsContainer.innerHTML = '';
  window.hide(visualContainer);

  function updateSlots() {
    slotsContainer.innerHTML = '';
    currentSelection.forEach((w, idx) => {
      const slot = document.createElement('div');
      slot.className = 'word-slot';
      slot.textContent = w;
      slot.onclick = () => {
        if (!window.gameState.answering) return;
        currentSelection.splice(idx, 1);
        const btns = optionsContainer.querySelectorAll('.word-btn');
        for (let b of btns) {
          if (b.textContent === w && b.classList.contains('is-placed')) {
            b.classList.remove('is-placed');
            break;
          }
        }
        updateSlots();
      };
      slotsContainer.appendChild(slot);
    });
    if (currentSelection.length === correctWords.length) {
      if (currentSelection.join(' ') === targetSentence) {
        window.gameState.answering = false;
        window.show(visualContainer);
        window.applyVisual(visualEl, item);
        window.playSlow(targetSentence);
        setTimeout(() => window.correctAns(null, 'ordering'), 1500);
      } else {
        window.SOUNDS.wrong.play().catch(() => {});
        slotsContainer.classList.add('shake');
        setTimeout(() => slotsContainer.classList.remove('shake'), 400);
        window.loseHeart();
        window.gameState.firstTry = false;
      }
    }
  }

  window.shuffle([...correctWords]).forEach(w => {
    const btn = document.createElement('button');
    btn.className = 'word-btn';
    btn.textContent = w;
    btn.onclick = () => {
      if (!window.gameState.answering || btn.classList.contains('is-placed')) return;
      btn.classList.add('is-placed');
      currentSelection.push(w);
      updateSlots();
      window.SOUNDS.pop.currentTime = 0;
      window.SOUNDS.pop.play().catch(() => {});
    };
    optionsContainer.appendChild(btn);
  });
};

window.renderMatchPairs = function(q) {
  window.hide(window.$('quiz-choose-word'));
  window.hide(window.$('quiz-choose-image'));
  window.hide(window.$('quiz-speak-word'));
  window.hide(window.$('quiz-word-ordering'));
  window.show(window.$('quiz-match-pairs'));
  const draggablesContainer = window.$('match-draggables');
  if (draggablesContainer) {
    if (window.gameState.chapterId === 38 || window.gameState.chapterId === 39) {
       draggablesContainer.style.gap = '2.5rem';
       draggablesContainer.style.display = 'flex';
       draggablesContainer.style.flexDirection = 'column';
    } else if (window.gameState.chapterId === 41 || window.gameState.chapterId === 42) {
       draggablesContainer.style.display = 'grid';
       draggablesContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
       draggablesContainer.style.gap = '1.2rem';
       draggablesContainer.style.width = '100%';
       draggablesContainer.style.maxWidth = '300px';
       draggablesContainer.style.margin = '0 auto';
    } else {
       draggablesContainer.style.gap = '1rem';
       draggablesContainer.style.display = 'flex';
       draggablesContainer.style.flexDirection = 'column';
    }
  }
  const targetsContainer = window.$('match-targets');
  draggablesContainer.innerHTML = '';
  targetsContainer.innerHTML = '';
  const draggables = window.shuffle([...q.options]);
  const targets = window.shuffle([...q.options]);
  let matchesMade = 0;
  const ch = window.CHAPTER_DATA[window.gameState.chapterId];
  draggables.forEach(k => {
    const d = ch.items[k];
    const el = document.createElement('div');
    el.className = 'match-draggable' + (ch.isQAMode ? ' text-draggable' : '');
    if (d.isCalendar || d.isMonth) el.classList.add('match-draggable-leaf');
    el.style.overflow = 'hidden'; 
    el.draggable = true;
    el.dataset.key = k;
    if (ch.isQAMode) {
       if ([33, 34, 35, 40, 41, 42].includes(window.gameState.chapterId)) {
          if (d.isCalendar || d.isMonth) {
             window.applyVisual(el, d, false, true); 
             el.style.width = '120px';
             el.style.height = '120px';
             el.style.padding = '0';
             el.style.overflow = 'hidden';
          } else {
             el.innerHTML = `<div class="vis-thumb" style="background-image:url(${d.image}); width:120px; height:120px; border-radius:15px; background-size:contain; background-position:center; background-repeat:no-repeat;"></div>`;
          }
       } else {
          el.innerHTML = `<div class="vis-thumb" style="background-image:url(${d.image}); width:100px; height:100px;"></div><span style="font-size:0.95rem; font-weight:600;">${d.word}</span>`;
       }
       el.style.flexDirection = 'column';
       el.style.gap = '8px';
       el.style.padding = '15px';
    } else {
       window.applyVisual(el, d, false, true); 
       el.style.width = '120px';
       el.style.height = '120px';
       el.style.display = 'flex';
       el.style.alignItems = 'center';
       el.style.justifyContent = 'center';
       el.style.overflow = 'hidden';
    }
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', k);
      if (window.playTTS) window.playTTS(d.sentence || d.word);
    });
    el.onclick = () => { if (window.playTTS) window.playTTS(d.sentence || d.word); };
    draggablesContainer.appendChild(el);
  });
  targets.forEach(k => {
    const d = ch.items[k];
    const zone = document.createElement('div');
    zone.className = 'match-dropzone' + (ch.isQAMode ? ' qa-zone' : '');
    zone.textContent = ch.isQAMode ? d.sentence : d.word;
    zone.addEventListener('dragover', e => e.preventDefault());
    zone.addEventListener('drop', e => {
      e.preventDefault();
      const dragKey = e.dataTransfer.getData('text/plain');
      if (dragKey === k) {
        zone.classList.add('is-matched');
        if (ch.isQAMode) zone.classList.add('is-matched-qa');
        zone.textContent = '✅ ' + (ch.isQAMode ? d.sentence : d.word);
        const dragEl = draggablesContainer.querySelector(`[data-key="${k}"]`);
        if (dragEl) dragEl.style.visibility = 'hidden';
        matchesMade++;
        window.SOUNDS.pop.play().catch(() => {});
        if (matchesMade === q.options.length) {
          setTimeout(() => window.correctAns(null, 'match'), 500);
        }
      } else {
        window.SOUNDS.wrong.play().catch(() => {});
        window.loseHeart();
        window.gameState.firstTry = false;
      }
    });
    targetsContainer.appendChild(zone);
  });
};

window.renderSpeakWord = function(q) {
  window.hide(window.$('quiz-choose-word'));
  window.hide(window.$('quiz-choose-image'));
  window.hide(window.$('quiz-match-pairs'));
  window.hide(window.$('quiz-word-ordering'));
  window.show(window.$('quiz-speak-word'));
  const d = window.CHAPTER_DATA[window.gameState.chapterId].items[q.key];
  const visualEl = window.$('speak-visual');
  // Use stimulus scale (default in applyVisual for isTimeCh)
  window.applyVisual(visualEl, d);
  
  const hintEl = window.$('speak-word-hint');
  const promptEl = window.$('quiz-prompt');
  const ch = window.CHAPTER_DATA[window.gameState.chapterId];
  
  if (ch.isQAMode && promptEl) {
     promptEl.textContent = d.word; // Show the question as the prompt
     if (window.playNativeTTS) {
       if ([33, 34, 40, 41, 42].includes(window.gameState.chapterId)) {
         window.playNativeTTS(d.word, { gender: 'male' });
         setTimeout(() => {
           window.playNativeTTS(d.sentence, { gender: 'female' });
         }, 2000); 
       } else {
         window.playNativeTTS(d.word); 
       }
     }
  }

  if (hintEl) {
    if (ch.isQAMode) {
      hintEl.innerHTML = `<div style="font-size:1.3rem; color:var(--primary); font-weight:700;">Say: "${d.sentence}"</div>`;
    } else {
      hintEl.textContent = `"${d.word}"`;
    }
    window.show(hintEl);
  }
  const btnMic = window.$('btn-speak-mic');
  const txtResult = window.$('speak-result-text');
  if (!btnMic) return;
  btnMic.classList.remove('listening');
  txtResult.textContent = "Press mic and speak";
  
  const btnRepeat = window.$('btn-speak-repeat');
  if (btnRepeat) {
    btnRepeat.onclick = () => {
      // In QAMode highlight prompt for question repeat
      if (ch.isQAMode) {
        // Request: QA chapters should read BOTH question (male) and answer (female) on repeat
        const isDualQA = [33, 34, 40, 41, 42].includes(window.gameState.chapterId);
        if (isDualQA) {
          window.playNativeTTS(d.word, { gender: 'male' });
          setTimeout(() => {
            window.playNativeTTS(d.sentence, { gender: 'female' });
          }, 2000); 
        } else {
          window.playNativeTTS(d.word); 
        }
      } else {
        window.playNativeTTS(d.word);
      }
    };
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    txtResult.textContent = "Ses tanıma desteklenmiyor. Lütfen kelimeyi yazın:";
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'quiz-option-word';
    input.style.marginTop = '1rem';
    input.style.width = '100%';
    input.style.textAlign = 'center';
    input.placeholder = 'Buraya yazın ve Enter\'a basın...';
    btnMic.style.display = 'none';
    const container = btnMic.parentElement;
    const oldInput = container.querySelector('.speak-fallback-input');
    if (oldInput) oldInput.remove();
    input.classList.add('speak-fallback-input');
    container.insertBefore(input, txtResult);
    input.focus();
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        const val = input.value.trim();
        const targetText = window.CHAPTER_DATA[window.gameState.chapterId].isQAMode ? d.sentence : d.word;
        if (window.isLenientMatch(targetText, val)) {
          txtResult.style.color = "var(--success)";
          txtResult.textContent = `Doğru: "${targetText}"`;
          window.correctAns(null, 'word');
        } else {
          txtResult.style.color = "var(--wrong)";
          txtResult.textContent = window.buildMismatchHint(targetText, val);
          window.loseHeart();
          window.gameState.firstTry = false;
        }
      }
    };
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  btnMic.onclick = async () => {
    if (!window.gameState.answering) return;
    if (btnMic.classList.contains('listening')) {
      txtResult.style.color = "var(--success)";
      txtResult.textContent = "Microphone is already active";
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognition.start();
      btnMic.classList.add('listening');
      txtResult.style.color = "var(--success)";
      txtResult.textContent = "Microphone Active";
    } catch (e) {
      txtResult.style.color = "var(--error)";
      txtResult.textContent = "Microphone permission denied.";
    }
  };
  recognition.onresult = (event) => {
    btnMic.classList.remove('listening');
    const speechResult = event.results[0][0].transcript.toLowerCase().trim();
    const targetText = window.CHAPTER_DATA[window.gameState.chapterId].isQAMode ? d.sentence : d.word;
    if (window.isLenientMatch(targetText, speechResult)) {
      txtResult.style.color = "var(--success)";
      txtResult.textContent = `Doğru: "${targetText}"`;
      window.correctAns(null, 'word');
    } else {
      txtResult.style.color = "var(--wrong)";
      txtResult.textContent = window.buildMismatchHint(targetText, speechResult);
      window.loseHeart();
      window.gameState.firstTry = false;
    }
  };
};

window.correctAns = function(btn, mode) {
  window.gameState.answering = false;
  window.gameState.quizCorrect++;
  window.gameState.consecutiveCorrects++;
  
  const user = window.getCurrentUser();
  let multiplier = 1;
  const streak = (user ? user.streak : 0) || 0;
  if (streak >= 7) multiplier = 3;
  else if (streak >= 3) multiplier = 2;

  const xpBase = window.gameState.firstTry ? 15 : 10;
  const xpGained = xpBase * multiplier;
  
  window.gameState.earnedXP += xpGained;
  window.showXPFloat(xpGained);
  window.SOUNDS.correct.currentTime = 0;
  window.SOUNDS.correct.play().catch(() => {});
  if (window.gameState.consecutiveCorrects % 3 === 0 && window.gameState.hearts < 5) {
    window.gameState.hearts++;
    window.renderHearts(window.gameState.hearts);
    window.showToast('toast-heart', '❤️ +1 Can! Harika!');
  }

  // Winner Mode Trigger: 5 hearts AND 3-in-a-row (first time in the chapter)
  if (window.gameState.hearts === 5 && window.gameState.consecutiveCorrects === 3 && !window.gameState.winnerModeUsed) {
    window.gameState.winnerModeUsed = true;
    setTimeout(() => window.startWinnerMode(), 800);
    return; // Stop normal progression
  }
  if (btn) btn.classList.add(mode === 'word' ? 'option-correct' : 'option-correct-color');
  setTimeout(async () => {
    window.gameState.qIndex++;
    window.clearStyles();
    window.renderQuestion();
  }, 600);
};

window.wrongAns = function(btn, q, mode) {
  window.gameState.answering = false;
  window.gameState.quizWrong++;
  window.gameState.wrongTotal++;
  window.gameState.consecutiveCorrects = 0;
  window.SOUNDS.wrong.currentTime = 0;
  window.SOUNDS.wrong.play().catch(() => {});
  if (btn) btn.classList.add(mode === 'word' ? 'option-wrong' : 'option-wrong-color');
  
  // Highlight correct answer scoped to active section
  const activeSection = document.querySelector('.quiz-section:not(.hidden)');
  const correctBtn = activeSection ? activeSection.querySelector(`[data-key="${q.key}"]`) : null;
  if (correctBtn) correctBtn.classList.add(mode === 'word' ? 'option-correct' : 'option-correct-color');

  const hint = window.$('correct-hint');
  if (hint) {
    const ch = window.CHAPTER_DATA[window.gameState.chapterId];
    const targetText = ch.isQAMode ? ch.items[q.key].sentence : ch.items[q.key].word;
    hint.textContent = `✅ Doğru: "${targetText}"`;
    hint.classList.remove('hidden');
  }
  window.gameState.firstTry = false;
  window.loseHeart();
  window.gameState.earnedXP = Math.max(0, window.gameState.earnedXP - 5);
  window.showXPFloat(-5);
  setTimeout(() => {
    window.gameState.answering = true;
    if (btn) {
      if (mode === 'word') btn.classList.remove('option-wrong');
      else btn.classList.remove('option-wrong-color');
    }
    if (correctBtn) {
      if (mode === 'word') correctBtn.classList.remove('option-correct');
      else correctBtn.classList.remove('option-correct-color');
    }
  }, 1200);
};

window.clearStyles = function() {
  document.querySelectorAll('.quiz-option-word, .quiz-option-color, .choice-image').forEach(el => {
    el.classList.remove('correct', 'wrong', 'option-correct', 'option-wrong', 'option-correct-color', 'option-wrong-color');
  });
};

window.loseHeart = function() {
  if (window.gameState.hearts > 0) window.gameState.hearts--;
  window.renderHearts(window.gameState.hearts);
  window.showToast('toast-heart', window.gameState.hearts === 0 ? '💔 Can kalmadı!' : `💔 -1 Can! ${window.gameState.hearts} kaldı`);
};

window.onQuizDone = async function() {
  window.gameState.allCorrect += window.gameState.quizCorrect;
  window.gameState.allWrong += window.gameState.quizWrong;
  const ch = window.CHAPTER_DATA[window.gameState.chapterId];
  if (ch.batches && window.gameState.currentBatch < ch.batches.length - 1) {
    window.showTransitionScreen(window.gameState);
  } else {
    const hearts = window.gameState.hearts;
  if (hearts === 5) {
    window.gameState.perfectStreak++;
  } else {
    window.gameState.perfectStreak = 0;
  }

  if (window.gameState.perfectStreak >= 3) {
    window.gameState.isSpeedMode = true;
  } else {
    window.gameState.isSpeedMode = false;
  }

  const user = window.getCurrentUser();
    if (user) {
      const pct = Math.round((window.gameState.allCorrect / (window.gameState.allCorrect + window.gameState.allWrong)) * 100);
      user.xp = (user.xp || 0) + window.gameState.earnedXP + (pct >= 80 ? 50 : 0);
      if (pct >= 80 && !user.completedChapters.includes(window.gameState.chapterId)) {
        user.completedChapters.push(window.gameState.chapterId);
      }
      await window.updateUser(user);
      await window.updateStreak();
    }
    window.showFinalResults(window.gameState);
  }
};

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

/* ══ NEW REVIEW MODE: DRAG DROP SCENE ══ */
window.renderDragDropScene = function(q) {
  const container = window.$('quiz-drag-drop-scene');
  window.show(container);
  const bg = window.$('scene-background');
  const sidebar = window.$('scene-parts');
  bg.innerHTML = '';
  sidebar.innerHTML = '';
  
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
      bgImage: 'images/bg/home_bg.png?v=' + Date.now(),
      zones: [
        { key: 'ch10_door', x: 95, y: 60 },
        { key: 'ch10_window', x: 20, y: 30 },
        { key: 'ch10_sofa', x: 50, y: 70 },
        { key: 'ch10_lamp', x: 85, y: 45 },
        { key: 'ch10_chair', x: 5, y: 75 }
      ]
    },
    28: {
      bgImage: 'images/bg/wardrobe_bg.png?v=' + Date.now(),
      zones: [
        { key: 'ch5_shirt', x: 42, y: 32 },
        { key: 'ch5_pants', x: 65, y: 64 },
        { key: 'ch5_shoes', x: 50, y: 84 },
        { key: 'ch5_hat', x: 35, y: 18 },
        { key: 'ch5_jacket', x: 62, y: 32 }
      ]
    },
    35: {
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
  return scenes[chapterId] || scenes[7];
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
      // Update persistent XP immediately
      const user = window.getCurrentUser();
      if (user) {
        user.xp = (user.xp || 0) + bonus;
        await window.updateUser(user);
        window.updateUserUI(user);
      }
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

