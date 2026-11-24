'use strict';

/* Soru üretimi */

window.makeQuestion = function(key, type, pool) {
  const options = window.shuffle([key, ...window.pick3Wrong(key, pool)]);
  let prompt = '';
  const ch = window.CHAPTER_DATA[window.gameState.chapterId];
  if (type === 'word-choice') prompt = window.rand(ch.wordPrompts);
  else if (type === 'image-choice') prompt = ch.imgPrompts ? window.rand(ch.imgPrompts)(key, window.gameState) : 'Find the image';
  else if (type === 'speak') prompt = window.rand(ch.speakPrompts);
  else prompt = "Listen closely 🔊";
  return { key, type, options, prompt: window.talimat(prompt) };
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

// Ortak talimatlar öğretilen dilde (İtalyancada çevrilir; İngilizcede değişmez)
(function () {
  const uret = window.generateQuestions;
  window.generateQuestions = function (keys) {
    return uret(keys).map(q => (q && typeof q.prompt === 'string') ? Object.assign(q, { prompt: window.talimat(q.prompt) }) : q);
  };
})();
