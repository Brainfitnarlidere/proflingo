'use strict';

/* Temel soru tipleri: kelime/görsel/dinleme seçimi, sıralama, eşleştirme, konuşma */

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
    btn.onclick = () => {
      if (k === q.key) {
        if (window.playTTS) window.playTTS(btn.textContent); // doğru kelimeyi duysun
        window.correctAns(btn, 'word');
      } else window.wrongAns(btn, q, 'word');
    };
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
    promptEl.textContent = window.talimat('Find ') + targetText;
  }
  if (window.$('quiz-choose-image')) {
    const stim = window.$('quiz-choose-image').querySelector('.quiz-stimulus');
    if (stim) window.hide(stim);
  }
  // Play target language TTS is handled in renderQuestion

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
        window.puanEkle(window.XP_ESLESME); // her doğru eşleşme
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
         const qiAtStart = window.gameState.qIndex;
         setTimeout(() => {
           if (window.gameState.qIndex !== qiAtStart) return; // soru geçildiyse okuma
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
          const qiAtStart = window.gameState.qIndex;
          setTimeout(() => {
            if (window.gameState.qIndex !== qiAtStart) return; // soru geçildiyse okuma
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
    txtResult.innerHTML = '<div style="background: var(--primary-lt); color: var(--primary); padding: 10px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 10px;">' +
                          'Tarayıcınız ses tanımayı desteklemiyor. Lütfen kelimeyi yüksek sesle tekrar edin ve aşağıdaki butona basın.' +
                          '</div>';
    btnMic.style.display = 'none';
    const container = btnMic.parentElement;
    const oldBtn = container.querySelector('.speak-fallback-btn');
    if (oldBtn) oldBtn.remove();
    
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn-primary btn-full speak-fallback-btn';
    confirmBtn.textContent = 'Tekrar Ettim (Devam Et)';
    confirmBtn.style.marginTop = '1rem';
    container.insertBefore(confirmBtn, txtResult.nextSibling);
    
    confirmBtn.onclick = () => {
      confirmBtn.remove();
      txtResult.style.color = "var(--success)";
      txtResult.textContent = "Harika! Bir sonraki kelimeye geçelim.";
      window.correctAns(null, 'word');
    };
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = window.hedefDil && window.hedefDil() === 'it' ? 'it-IT' : 'en-US';
  recognition.maxAlternatives = 5;   // gürültüde doğru kelime çoğu zaman 2.-3. tahminde olur
  recognition.interimResults = false;
  recognition.continuous = false;

  let olcer = null;          // yakın ses kapısı (mikrofon seviyesi ölçümü)
  let muzikCaliyordu = false;
  let sonuclandi = false;

  const dinlemeyiBitir = () => {
    btnMic.classList.remove('listening');
    if (olcer) { olcer.durdur(); }
    if (muzikCaliyordu && window.SOUNDS && window.SOUNDS.bgm) window.SOUNDS.bgm.play().catch(() => {});
    muzikCaliyordu = false;
  };

  btnMic.onclick = async () => {
    if (!window.gameState.answering) return;
    if (btnMic.classList.contains('listening')) {
      try { recognition.abort(); } catch (e) {}   // takılı kaldıysa sıfırla
      dinlemeyiBitir();
    }
    sonuclandi = false;
    try {
      // Dinlerken uygulamanın kendi sesleri mikrofona girmesin
      if (window.stopSpeech) window.stopSpeech();
      if (window.SOUNDS && window.SOUNDS.bgm && !window.SOUNDS.bgm.paused) { muzikCaliyordu = true; window.SOUNDS.bgm.pause(); }
      olcer = window._yakinSesKapisiKapali ? null : await window.mikrofonOlcerBaslat();
      if (!olcer) await navigator.mediaDevices.getUserMedia({ audio: true }).then(st => st.getTracks().forEach(t => t.stop()));
      recognition.start();
      btnMic.classList.add('listening');
      txtResult.style.color = "var(--success)";
      txtResult.textContent = "Listening… speak close to the mic";
    } catch (e) {
      dinlemeyiBitir();
      txtResult.style.color = "var(--error)";
      txtResult.textContent = "Microphone permission denied.";
    }
  };

  recognition.onresult = (event) => {
    sonuclandi = true;
    const tahminler = [];
    for (const r of event.results) for (const alt of r) if (alt && alt.transcript) tahminler.push(alt.transcript.toLowerCase().trim());
    const yakin = olcer ? olcer.yakinMi() : true;
    dinlemeyiBitir();
    const targetText = window.CHAPTER_DATA[window.gameState.chapterId].isQAMode ? d.sentence : d.word;
    if (tahminler.some(t => window.isLenientMatch(targetText, t))) {
      txtResult.style.color = "var(--success)";
      txtResult.textContent = `Doğru söyledin! ✅ "${targetText}"`;
      window.correctAns(null, 'word');
    } else if (!yakin) {
      // Duyulan ses uzaktan geldi / ortam gürültüsü: can kaybettirme, tekrar denet
      txtResult.style.color = "var(--warning, #d97706)";
      txtResult.textContent = "Too far or too noisy. Move closer to the mic and try again.";
    } else {
      txtResult.style.color = "var(--wrong)";
      txtResult.textContent = window.buildMismatchHint(targetText, tahminler[0] || '');
      window.loseHeart();
      window.gameState.firstTry = false;
    }
  };

  recognition.onerror = (event) => {
    sonuclandi = true;
    dinlemeyiBitir();
    const err = event && event.error;
    if (err === 'audio-capture' && olcer !== null) window._yakinSesKapisiKapali = true; // bu cihazda ölçüm ile tanıma birlikte çalışmıyor
    txtResult.style.color = "var(--warning, #d97706)";
    txtResult.textContent = err === 'not-allowed' ? "Microphone permission denied."
      : err === 'no-speech' ? "No speech heard. Speak close to the mic and try again."
      : "Didn't catch that. Speak close to the mic and try again.";
  };

  recognition.onend = () => {
    if (!sonuclandi) {
      txtResult.style.color = "var(--warning, #d97706)";
      txtResult.textContent = "Didn't catch that. Speak close to the mic and try again.";
    }
    dinlemeyiBitir();
  };
};
