'use strict';

/* Oyun durumu, bölüm başlatma, öğrenme kartları, yardımcılar */

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
    memoryGameDone: false
  };
};


window.startChapter = function(id) {
  // Günlük süre sınırı yok: 30 dakika sadece hedef (tebrik bildirimi usage.js'de), oyunu kilitlemez.
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
