'use strict';

/* Quiz akışı: zamanlayıcı, görsel, soru gösterme, doğru/yanlış, bölüm sonu */

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
  window.gameState.questionSpeech = null; // bu soruda ne okunduysa "Tekrar dinle" onu okur
  if (window.stopSpeech) window.stopSpeech(); // önceki sorunun sesi bu soruya taşmasın
  
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

  const ch = window.CHAPTER_DATA[window.gameState.chapterId];
  const d_target = (ch.items && ch.items[q.key]) || (ch.allReviewItems && ch.allReviewItems[q.key]);
  const isDualQA = [33, 34, 40, 41, 42].includes(window.gameState.chapterId);

  let speech = null;
  if (d_target) {
    if (q.type === 'listen-choice') {
      speech = { text: d_target.word };
    } else if (q.type === 'word-choice') {
      // Görsel gösterilip kelimesi soruluyor: kelimeyi okumak cevabı vermek olur,
      // soruyu oku ("What do you see?"). Soru-cevap bölümlerinde hedef sorunun kendisi.
      speech = ch.isQAMode ? { text: d_target.word } : { text: q.prompt || window.talimat('What do you see?'), native: true };
    } else if (q.type === 'image-choice') {
      // Ekranda yazanı oku: tek hedef + ne yapılacağı ("Find Pig")
      speech = { text: window.talimat('Find ') + (ch.isQAMode ? d_target.sentence : d_target.word) };
    } else if (q.type === 'word-ordering') {
      speech = { text: d_target.word, slow: true };
    } else if (q.type === 'speak' && !isDualQA) {
      speech = { text: ch.isQAMode ? d_target.sentence : d_target.word };
    }
  }
  // Birden fazla kelimeli sorularda tek hedef yok: ne yapılacağını söyleyen talimatı oku.
  // (Kelimelerin kendisi sürüklerken/dokununca okunur.)
  const MULTI_ITEM_TYPES = ['match-pairs', 'memory-match', 'drag-drop-scene', 'matching-list-10'];
  if (!speech && MULTI_ITEM_TYPES.includes(q.type) && q.prompt) {
    speech = { text: q.prompt, native: true };
  }
  if (speech) {
    window.gameState.questionSpeech = speech;
    window.replayQuestion();
  }

  // Her soruda TEK tekrar düğmesi: dinleme sorusunda büyük hoparlör, konuşma sorusunda kendi
  // "🔊 Repeat" düğmesi var; diğer bütün sorularda bu ortak düğme görünür.
  const replayBtn = window.$('btn-quiz-replay');
  if (replayBtn) replayBtn.classList.toggle('hidden', q.type === 'speak' || q.type === 'listen-choice');
};

// Bu soruda okunan metni tekrar okur (düğme ve ilk okuma bunu kullanır).
window.replayQuestion = function() {
  const s = window.gameState.questionSpeech;
  if (!s || !s.text) return;
  if (s.slow && window.playSlow) window.playSlow(s.text);
  else if (s.native && window.playNativeTTS) window.playNativeTTS(s.text);
  else if (window.playTTS) window.playTTS(s.text);
};

// Soru türüne göre taban puan (seri çarpanından önce). Sunucu sınırı: supabase/xp_guvenlik.sql
window.XP_PUANLARI = {
  'word-choice': 10,       // görselden kelime seç
  'image-choice': 10,      // kelimeden görsel seç
  'listen-choice': 15,     // dinleyip seç
  'word-ordering': 20,     // cümle sırala
  'speak': 25,             // sesli söyle
  'match-pairs': 10,       // eşleştirme (bitirince) + her eşleşme XP_ESLESME
  'memory-match': 15,      // hafıza oyunu (bitirince) + her eşleşme
  'matching-list-10': 15,  // 10'lu liste (bitirince) + her eşleşme
  'drag-drop-scene': 20,   // sahneye yerleştir (bitirince) + her eşleşme
  'falling-visuals': 20    // düşen görseller (bitirince) + her yakalama XP_YAKALAMA
};
window.XP_ESLESME = 5;
window.XP_YAKALAMA = 3;

window.seriCarpani = function() {
  const user = window.getCurrentUser();
  const streak = (user ? user.streak : 0) || 0;
  return streak >= 7 ? 3 : streak >= 3 ? 2 : 1;
};

// Puanı (seri çarpanıyla) ekler ve ekranda gösterir.
window.puanEkle = function(taban) {
  const xp = Math.round(taban * window.seriCarpani());
  window.gameState.earnedXP += xp;
  window.showXPFloat(xp);
  return xp;
};

window.correctAns = function(btn, mode) {
  window.gameState.answering = false;
  window.gameState.quizCorrect++;
  window.gameState.consecutiveCorrects++;
  
  const curQ = window.gameState.questions[window.gameState.qIndex] || {};
  const taban = window.XP_PUANLARI[curQ.type] || 10;
  window.puanEkle(window.gameState.firstTry ? taban : Math.round(taban * 2 / 3)); // ilk denemede tam puan
  window.SOUNDS.correct.currentTime = 0;
  window.SOUNDS.correct.play().catch(() => {});
  // Her 3 doğru cevaplık seride bir can kazanılır.
  const heartEarned = window.gameState.consecutiveCorrects % 3 === 0;
  const heartsWereFull = window.gameState.hearts >= 5;
  if (heartEarned && !heartsWereFull) {
    window.gameState.hearts++;
    window.renderHearts(window.gameState.hearts);
    window.showToast('toast-heart', '❤️ +1 Can! Harika!');
  }

  // Winner Mode: canlar doluyken bir can daha kazanılınca açılır — her seferinde
  // (eskiden bölüm başına bir kez ve sadece 3. doğruda kontrol ediliyordu).
  if (heartEarned && heartsWereFull) {
    if (btn) btn.classList.add(mode === 'word' ? 'option-correct' : 'option-correct-color');
    window.gameState.qIndex++; // Winner Mode bitince sıradaki soruya geçilsin
    setTimeout(() => { window.clearStyles(); window.startWinnerMode(); }, 800);
    return;
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
      // XP, seri ve bölüm tamamlama sunucuda hesaplanır (supabase/xp_guvenlik.sql)
      const res = await window.completeChapter({
        chapterId: window.gameState.chapterId,
        earnedXP: window.gameState.earnedXP,
        correct: window.gameState.allCorrect,
        wrong: window.gameState.allWrong
      });
      if (res.error) window.showToast('toast-heart', '⚠️ ' + res.error);
      else window.updateUserUI(res.user);
    }
    window.showFinalResults(window.gameState);
  }
};
