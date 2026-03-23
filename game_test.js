'use strict';

import { 
  CHAPTER_DATA, CHAPTERS, getCurrentUser, saveCurrentUser, getUsers, saveUsers 
} from './data.js';
import { 
  SOUNDS, playTTS, playSlow, isLenientMatch, buildMismatchHint 
} from './speech.js';
import { 
  $, show, hide, renderHearts, showToast, setProgress, setPhase, 
  showProgressUI, hideProgressUI, showScreen, renderLearnCard, showXPFloat,
  showTransitionScreen, showFinalResults
} from './ui.js';

// ── Game state ───────────────────────────────────────────────
export let S = {
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
  consecutiveCorrects: 0, // Corrected key name from legacy
  wrongTotal: 0,
  quizCorrect: 0,
  quizWrong: 0,
  allCorrect: 0,
  allWrong: 0,
  memoryGameDone: false,
};

function resetGameState() {
  S = {
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
  };
}

// ── Core Game Loop ───────────────────────────────────────────
function startChapter(id) {
  resetGameState();
  S.chapterId = id;
  renderHearts(S.hearts);
  show($('btn-back'));
  show($('app-header'));

  const ch = CHAPTER_DATA[id];
  if (ch.isReview) {
    if (id === 7 || id === 14 || id === 28) {
      // Special reviews: Pick random items from previous chapters
      const items = ch.allReviewItems;
      const allKeys = Object.keys(items);
      const randomKeys = shuffle(allKeys).slice(0, 20); // Pick 20 random items for review
      
      // Temporary override ch.items for generateQuestions
      ch.items = items;
      S.learnedKeys = randomKeys;
      startQuizPhase();
    } else {
      S.learnedKeys = Object.keys(ch.allReviewItems || {});
      startQuizPhase();
    }
  } else {
    startLearnPhase();
  }
}

function startLearnPhase() {
  const ch = CHAPTER_DATA[S.chapterId];
  if (ch && ch.batches) {
    ch.batches[S.currentBatch].forEach(k => { 
      if (!S.learnedKeys.includes(k)) S.learnedKeys.push(k); 
    });
  }
  S.cardIndex = 0;
  setPhase('learn', S);
  showProgressUI();
  renderLearnCard(S);
  showScreen('learn');
}

function nextCard() {
  const batch = CHAPTER_DATA[S.chapterId].batches[S.currentBatch];
  if (S.cardIndex < batch.length - 1) { 
    S.cardIndex++; 
    renderLearnCard(S); 
  } else {
    startQuizPhase();
  }
}

function prevCard() {
  if (S.cardIndex > 0) { 
    S.cardIndex--; 
    renderLearnCard(S); 
  }
}

function startQuizPhase() {
  S.questions = generateQuestions(S.learnedKeys);
  S.qIndex = 0;
  S.quizCorrect = 0;
  S.quizWrong = 0;
  S.answering = true;
  setPhase('quiz', S);
  showProgressUI();
  showScreen('quiz');
  renderQuestion();
}

// ── Question Generation ──────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick3Wrong(k, pool) { 
  return shuffle(pool.filter(x => x !== k)).slice(0, 3); 
}

function rand(arr) { 
  return arr[Math.floor(Math.random() * arr.length)]; 
}

function makeQuestion(key, type, pool) {
  const options = shuffle([key, ...pick3Wrong(key, pool)]);
  let prompt = '';
  const ch = CHAPTER_DATA[S.chapterId];
  if (type === 'word-choice') prompt = rand(ch.wordPrompts);
  else if (type === 'image-choice') prompt = ch.imgPrompts ? rand(ch.imgPrompts)(key) : 'Find the image';
  else if (type === 'speak') prompt = rand(ch.speakPrompts);
  else prompt = "Listen closely 🔊";
  return { key, type, options, prompt };
}

function generateQuestions(keys) {
  const qs = [];
  const ch = CHAPTER_DATA[S.chapterId];

  if (ch.isSentenceMode) {
    keys.forEach(k => {
      qs.push({ key: k, type: 'sentence-completion', prompt: rand(ch.wordPrompts) });
      qs.push({ key: k, type: 'word-ordering', prompt: 'Sıraya diz!' });
      qs.push({ key: k, type: 'speak-sentence', prompt: rand(ch.speakPrompts) });
    });
  } else if (ch.isRepeatMode) {
    keys.forEach(k => {
      qs.push({ key: k, type: 'repeat-after-me', prompt: rand(ch.wordPrompts) });
    });
  } else {
    if (keys.length >= 3) {
      const matchCount = S.chapterId === 28 ? 4 : (ch.isQAMode ? 3 : 1);
      for (let i = 0; i < matchCount; i++) {
        const matchOptions = shuffle([...keys]).slice(0, 3);
        const type = ch.isQAMode ? 'match-qa' : 'match-pairs';
        qs.push({ key: matchOptions[0], type: type, options: matchOptions, prompt: ch.isQAMode ? "Match Question to Answer! 💬" : "Match the pairs! 🧩" });
      }
    }
    keys.forEach((k) => {
      // Increase Speak frequency for sentence-heavy chapters (25-27)
      const isSentenceCh = S.chapterId >= 25;
      const types = ['word-choice', 'image-choice', 'listen-choice', 'speak'];
      const sliced = isSentenceCh ? shuffle(types).slice(0, 3) : shuffle(types).slice(0, 2);
      
      sliced.forEach(t => qs.push(makeQuestion(k, t, keys)));
      
      // For Ch 25-27, ensure at least one 'speak' if not already added
      if (isSentenceCh && !sliced.includes('speak')) {
        qs.push(makeQuestion(k, 'speak', keys));
      }
    });
  }
  return shuffle(qs);
}

// ── Question Rendering & Logic ───────────────────────────────
function renderQuestion() {
  if (S.qIndex >= S.questions.length) { 
    onQuizDone(); 
    return; 
  }
  
  const q = S.questions[S.qIndex];
  setProgress(S.qIndex + 1, S.questions.length);
  const promptEl = $('quiz-prompt');
  if (promptEl) promptEl.textContent = q.prompt;
  
  const hintEl = $('correct-hint');
  if (hintEl) {
    hintEl.textContent = '';
    hintEl.classList.add('hidden');
  }
  
  S.answering = true;
  S.firstTry = true;

  if (q.type === 'word-choice') renderWordChoice(q);
  else if (q.type === 'image-choice') renderImageChoice(q);
  else if (q.type === 'listen-choice') renderListenChoice(q);
  else if (q.type === 'sentence-completion') renderSentenceCompletion(q);
  else if (q.type === 'speak-sentence') renderSpeakSentence(q);
  else if (q.type === 'word-ordering') renderWordOrdering(q);
  else if (q.type === 'match-pairs') renderMatchPairs(q);
  else if (q.type === 'match-qa') renderMatchQA(q);
  else if (q.type === 'repeat-after-me') renderRepeatAfterMe(q);
  else if (q.type === 'speak') renderSpeakWord(q);

  // Audio prompt
  if (q.type === 'listen-choice') {
    const targetWord = CHAPTER_DATA[S.chapterId].items[q.key].word;
    playTTS(targetWord);
  } else if (q.type === 'speak') {
    playTTS("Can you name it?");
  } else if (q.type !== 'match-pairs') {
    playTTS(q.prompt);
  } else {
    playTTS("Match the pairs");
  }
}

function renderWordChoice(q) {
  show($('quiz-choose-word'));
  hide($('quiz-choose-image'));
  hide($('quiz-listen-choice'));
  hide($('quiz-match-pairs'));
  hide($('quiz-speak-word'));
  
  const d = CHAPTER_DATA[S.chapterId].items[q.key];
  const c = $('quiz-stimulus-circle');
  if (c) {
    if (d.image) {
      c.style.backgroundImage = `url(${d.image})`;
      c.style.backgroundSize = 'contain';
      c.style.backgroundPosition = 'center';
      c.style.backgroundRepeat = 'no-repeat';
      c.style.backgroundColor = 'transparent';
      c.style.border = d.border ? '4px solid #BDBDBD' : 'none';
      c.textContent = '';
    } else {
      c.style.backgroundImage = 'none';
      c.style.backgroundColor = d.color || '#F5F5F5';
      c.textContent = d.emoji || '';
    }
  }

  const grid = $('word-grid');
  grid.innerHTML = '';
  q.options.forEach(k => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-word';
    btn.textContent = CHAPTER_DATA[S.chapterId].items[k].word;
    btn.dataset.key = k;
    btn.onclick = () => { if (k === q.key) correctAns(btn, 'word'); else wrongAns(btn, q, 'word'); };
    grid.appendChild(btn);
  });
}

function renderImageChoice(q) {
  hide($('quiz-choose-word'));
  hide($('quiz-match-pairs'));
  hide($('quiz-speak-word'));
  show($('quiz-choose-image'));

  const grid = $('image-grid');
  grid.innerHTML = '';
  q.options.forEach(k => {
    const d = CHAPTER_DATA[S.chapterId].items[k];
    const btn = document.createElement('button');
    btn.className = 'choice-image quiz-option-color';
    btn.dataset.key = k;
    if (d.image) {
      btn.style.backgroundImage = `url(${d.image})`;
      btn.style.backgroundSize = 'contain';
      btn.style.backgroundRepeat = 'no-repeat';
      btn.style.backgroundPosition = 'center';
    } else {
      btn.textContent = d.emoji || '';
      btn.style.backgroundColor = d.color || '#F5F5F5';
    }
    btn.onclick = () => { if (k === q.key) correctAns(btn, 'color'); else wrongAns(btn, q, 'color'); };
    grid.appendChild(btn);
  });
}

function renderListenChoice(q) {
  show($('quiz-listen-choice'));
  hide($('quiz-choose-word'));
  hide($('quiz-choose-image'));
  hide($('quiz-match-pairs'));
  hide($('quiz-speak-word'));

  const btnPlay = $('btn-play-audio');
  if (btnPlay) {
    btnPlay.onclick = () => playTTS(CHAPTER_DATA[S.chapterId].items[q.key].word);
  }

  const grid = $('listen-grid');
  grid.innerHTML = '';
  q.options.forEach(k => {
    const d = CHAPTER_DATA[S.chapterId].items[k];
    const btn = document.createElement('button');
    btn.className = 'choice-image quiz-option-color';
    btn.dataset.key = k;
    if (d.image) {
      btn.style.backgroundImage = `url(${d.image})`;
      btn.style.backgroundSize = 'contain';
      btn.style.backgroundRepeat = 'no-repeat';
      btn.style.backgroundPosition = 'center';
    } else {
      btn.textContent = d.emoji || '';
      btn.style.backgroundColor = d.color || '#F5F5F5';
    }
    btn.onclick = () => { if (k === q.key) correctAns(btn, 'color'); else wrongAns(btn, q, 'color'); };
    grid.appendChild(btn);
  });
}

function renderWordOrdering(q) {
  hide($('quiz-choose-word'));
  hide($('quiz-choose-image'));
  hide($('quiz-listen-choice'));
  hide($('quiz-match-pairs'));
  hide($('quiz-speak-word'));
  show($('quiz-word-ordering'));

  const item = CHAPTER_DATA[S.chapterId].items[q.key];
  const targetSentence = item.word;
  const correctWords = targetSentence.split(' ');
  let currentSelection = [];

  const slotsContainer = $('ordering-slots');
  const optionsContainer = $('ordering-options');
  const visualContainer = $('ordering-visual-container');
  const visualEl = $('ordering-visual');

  slotsContainer.innerHTML = '';
  optionsContainer.innerHTML = '';
  hide(visualContainer);

  function updateSlots() {
    slotsContainer.innerHTML = '';
    currentSelection.forEach((w, idx) => {
      const slot = document.createElement('div');
      slot.className = 'word-slot';
      slot.textContent = w;
      slot.onclick = () => {
        if (!S.answering) return;
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
        S.answering = false;
        show(visualContainer);
        if (item.image) {
          visualEl.style.backgroundImage = `url(${item.image})`;
          visualEl.style.backgroundSize = 'contain';
          visualEl.style.backgroundPosition = 'center';
          visualEl.style.backgroundRepeat = 'no-repeat';
        } else {
          visualEl.textContent = item.emoji || '';
          visualEl.style.backgroundColor = item.color || '#F5F5F5';
        }
        playSlow(targetSentence);
        setTimeout(() => correctAns(null, 'ordering'), 1500);
      } else {
        SOUNDS.wrong.play().catch(() => {});
        slotsContainer.classList.add('shake');
        setTimeout(() => slotsContainer.classList.remove('shake'), 400);
        loseHeart();
        S.firstTry = false;
      }
    }
  }

  shuffle([...correctWords]).forEach(w => {
    const btn = document.createElement('button');
    btn.className = 'word-btn';
    btn.textContent = w;
    btn.onclick = () => {
      if (!S.answering || btn.classList.contains('is-placed')) return;
      btn.classList.add('is-placed');
      currentSelection.push(w);
      updateSlots();
      SOUNDS.pop.currentTime = 0;
      SOUNDS.pop.play().catch(() => {});
    };
    optionsContainer.appendChild(btn);
  });
}

function renderMatchPairs(q) {
  hide($('quiz-choose-word'));
  hide($('quiz-choose-image'));
  hide($('quiz-speak-word'));
  show($('quiz-match-pairs'));

  const draggablesContainer = $('match-draggables');
  const targetsContainer = $('match-targets');
  draggablesContainer.innerHTML = '';
  targetsContainer.innerHTML = '';

  const draggables = shuffle([...q.options]);
  const targets = shuffle([...q.options]);
  let matchesMade = 0;

  draggables.forEach(k => {
    const d = CHAPTER_DATA[S.chapterId].items[k];
    const el = document.createElement('div');
    el.className = 'match-draggable';
    el.draggable = true;
    el.dataset.key = k;
    if (d.image) el.style.backgroundImage = `url(${d.image})`;
    else el.textContent = d.emoji || '';
    
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', k);
      playTTS(d.word);
    });
    draggablesContainer.appendChild(el);
  });

  targets.forEach(k => {
    const d = CHAPTER_DATA[S.chapterId].items[k];
    const zone = document.createElement('div');
    zone.className = 'match-dropzone';
    zone.textContent = d.word;
    zone.dataset.key = k;
    
    zone.addEventListener('dragover', e => e.preventDefault());
    zone.addEventListener('drop', e => {
      e.preventDefault();
      const dragKey = e.dataTransfer.getData('text/plain');
      if (dragKey === k) {
        zone.classList.add('is-matched');
        zone.textContent = '✅ ' + d.word;
        const dragEl = draggablesContainer.querySelector(`[data-key="${k}"]`);
        if (dragEl) dragEl.style.visibility = 'hidden';
        matchesMade++;
        SOUNDS.pop.play().catch(() => {});
        if (matchesMade === q.options.length) {
          setTimeout(() => correctAns(null, 'match'), 500);
        }
      } else {
        SOUNDS.wrong.play().catch(() => {});
        loseHeart();
        S.firstTry = false;
      }
    });
    targetsContainer.appendChild(zone);
  });
}

function renderMatchQA(q) {
  hide($('quiz-choose-word'));
  hide($('quiz-choose-image'));
  hide($('quiz-speak-word'));
  show($('quiz-match-pairs')); // Reuse the containers but different style

  const draggablesContainer = $('match-draggables');
  const targetsContainer = $('match-targets');
  draggablesContainer.innerHTML = '';
  targetsContainer.innerHTML = '';

  const draggables = shuffle([...q.options]);
  const targets = shuffle([...q.options]);
  let matchesMade = 0;

  draggables.forEach(k => {
    const d = CHAPTER_DATA[S.chapterId].items[k];
    const el = document.createElement('div');
    el.className = 'match-draggable text-draggable';
    el.draggable = true;
    el.dataset.key = k;
    el.textContent = d.word; // Question
    
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', k);
      playTTS(d.word);
    });
    draggablesContainer.appendChild(el);
  });

  targets.forEach(k => {
    const d = CHAPTER_DATA[S.chapterId].items[k];
    const zone = document.createElement('div');
    zone.className = 'match-dropzone qa-zone';
    zone.textContent = d.sentence; // Answer
    zone.dataset.key = k;
    
    zone.addEventListener('dragover', e => e.preventDefault());
    zone.addEventListener('drop', e => {
      e.preventDefault();
      const dragKey = e.dataTransfer.getData('text/plain');
      if (dragKey === k) {
        zone.classList.add('is-matched-qa');
        zone.textContent = '✅ ' + d.sentence;
        const dragEl = draggablesContainer.querySelector(`[data-key="${k}"]`);
        if (dragEl) dragEl.style.visibility = 'hidden';
        matchesMade++;
        SOUNDS.pop.play().catch(() => {});
        if (matchesMade === q.options.length) {
          setTimeout(() => correctAns(null, 'match'), 500);
        }
      } else {
        SOUNDS.wrong.play().catch(() => {});
        loseHeart();
        S.firstTry = false;
      }
    });
    targetsContainer.appendChild(zone);
  });
}

function renderSpeakWord(q) {
  hide($('quiz-choose-word'));
  hide($('quiz-choose-image'));
  hide($('quiz-match-pairs'));
  show($('quiz-speak-word'));
  
  const d = CHAPTER_DATA[S.chapterId].items[q.key];
  const visualEl = $('speak-visual');
  if (visualEl) {
    if (d.image) {
      visualEl.style.backgroundImage = `url(${d.image})`;
      visualEl.style.backgroundSize = 'contain';
      visualEl.style.backgroundPosition = 'center';
      visualEl.style.backgroundRepeat = 'no-repeat';
      visualEl.textContent = '';
    } else {
      visualEl.textContent = d.emoji || '';
      visualEl.style.backgroundColor = d.color || '#f5f5f5';
    }
  }

  const promptEl = $('speak-prompt-text');
  if (promptEl) promptEl.textContent = q.prompt || "Can you name it? 🎤";

  const hintEl = $('speak-word-hint');
  if (hintEl) {
    const displayText = d.sentence || d.word || "";
    hintEl.textContent = displayText ? `"${displayText}"` : "";
    show(hintEl);
    hintEl.style.fontSize = "2.2rem"; // Slightly larger for clarity
    hintEl.style.color = "var(--primary)";
    hintEl.style.display = "block";
    hintEl.classList.remove('hidden');
    
    // Add a helper sub-text if it's a long sentence
    if (displayText.length > 20) {
      hintEl.style.fontSize = "1.8rem";
    }
  }

  const btnMic = $('btn-speak-mic');
  const txtResult = $('speak-result-text');
  if (!btnMic) return;

  btnMic.classList.remove('listening');
  txtResult.textContent = "Tap the mic and speak";

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    txtResult.textContent = "Support missing.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';

  btnMic.onclick = async () => {
    if (!S.answering) return;
    if (btnMic.classList.contains('listening')) {
      txtResult.textContent = "Microphone already active.";
      return;
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognition.start();
      btnMic.classList.add('listening');
      txtResult.textContent = "Listening...";
    } catch (e) {
      txtResult.textContent = "Mic denied.";
    }
  };

  recognition.onresult = (event) => {
    btnMic.classList.remove('listening');
    const speechResult = event.results[0][0].transcript.toLowerCase().trim();
    if (isLenientMatch(d.word, speechResult)) {
      txtResult.style.color = "var(--success)";
      txtResult.textContent = `Correct: "${d.word}"`;
      correctAns(null, 'word');
    } else {
      txtResult.style.color = "var(--wrong)";
      txtResult.textContent = buildMismatchHint(d.word, speechResult);
      loseHeart();
      S.firstTry = false;
    }
  };
}

function renderRepeatAfterMe(q) {
  // Similar to Speak Word but uses playSlow first
  renderSpeakWord(q);
  const item = CHAPTER_DATA[S.chapterId].items[q.key];
  playSlow(item.word);
}

// ── Answer Feedback ──────────────────────────────────────────
function correctAns(btn, mode) {
  S.answering = false;
  S.quizCorrect++;
  S.consecutiveCorrects++;

  const xpGained = S.firstTry ? 15 : 10;
  S.earnedXP += xpGained;
  showXPFloat(xpGained);

  SOUNDS.correct.currentTime = 0;
  SOUNDS.correct.play().catch(() => {});

  if (S.consecutiveCorrects % 3 === 0 && S.hearts < 5) {
    S.hearts++;
    renderHearts(S.hearts);
    showToast('toast-heart', '❤️ +1 Can! Harika!');
  }

  if (btn) btn.classList.add(mode === 'word' ? 'option-correct' : 'option-correct-color');
  
  setTimeout(() => {
    S.qIndex++;
    clearStyles();
    renderQuestion();
  }, 600);
}

function wrongAns(btn, q, mode) {
  S.answering = false;
  S.quizWrong++;
  S.wrongTotal++;
  S.consecutiveCorrects = 0;

  SOUNDS.wrong.currentTime = 0;
  SOUNDS.wrong.play().catch(() => {});

  if (btn) btn.classList.add(mode === 'word' ? 'option-wrong' : 'option-wrong-color');

  const hint = $('correct-hint');
  if (hint) {
    hint.textContent = `✅ Doğru: "${CHAPTER_DATA[S.chapterId].items[q.key].word}"`;
    hint.classList.remove('hidden');
  }

  S.firstTry = false;
  loseHeart();
  S.earnedXP = Math.max(0, S.earnedXP - 5);
  showXPFloat(-5);

  setTimeout(() => {
    S.answering = true;
    if (mode === 'word') btn.classList.remove('option-wrong');
    else btn.classList.remove('option-wrong-color');
  }, 1000);
}

function clearStyles() {
  document.querySelectorAll('.quiz-option-word, .quiz-option-color, .choice-image').forEach(el => {
    el.classList.remove('correct', 'wrong', 'option-correct', 'option-wrong', 'option-correct-color', 'option-wrong-color');
  });
  const skipBtn = $('btn-speak-skip');
  if (skipBtn) hide(skipBtn);
}

function loseHeart() {
  if (S.hearts > 0) S.hearts--;
  renderHearts(S.hearts);
  showToast('toast-heart', S.hearts === 0 ? '💔 Can kalmadı!' : `💔 -1 Can! ${S.hearts} kaldı`);
}

// ── Completion Logic ─────────────────────────────────────────
function onQuizDone() {
  S.allCorrect += S.quizCorrect;
  S.allWrong += S.quizWrong;
  const ch = CHAPTER_DATA[S.chapterId];

  if (ch.batches && S.currentBatch < ch.batches.length - 1) {
    showTransitionScreen(S);
  } else {
    // Save progress
    const user = getCurrentUser();
    if (user) {
      const pct = Math.round((S.allCorrect / (S.allCorrect + S.allWrong)) * 100);
      user.xp = (user.xp || 0) + S.earnedXP + (pct >= 80 ? 50 : 0);
      if (pct >= 80 && !user.completedChapters.includes(S.chapterId)) {
        user.completedChapters.push(S.chapterId);
      }
      saveCurrentUser(user);
      const users = getUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx >= 0) { users[idx] = user; saveUsers(users); }
    }
    showFinalResults(S);
  }
}

// ── Placeholders for Render branches in question rendering ─────
// (Added missing render functions above)
function renderSentenceCompletion(q) { renderWordOrdering(q); } // Simplified for now
function renderSpeakSentence(q) { renderSpeakWord(q); }
