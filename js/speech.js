'use strict';

window.SOUNDS = {
  correct: new Audio('audio/correct.wav'),
  wrong: new Audio('audio/wrong.wav'),
  complete: new Audio('audio/complete.wav'),
  pop: new Audio('audio/pop.wav'),
  feverBg: new Audio('audio/fever_bgm.wav'),
  bgm: new Audio('audio/mozart.ogg')
};

window.isBgmPlaying = true;
window.audioUnlocked = false;

window.SOUNDS.complete.volume = 0.5;
window.SOUNDS.correct.volume = 0.25;
window.SOUNDS.wrong.volume = 0.25;
window.SOUNDS.pop.volume = 0.25;
window.SOUNDS.feverBg.loop = false;
window.SOUNDS.feverBg.volume = 0.20;
window.SOUNDS.bgm.loop = true;
window.SOUNDS.bgm.volume = 0.08;

window.toggleBGM = function(btnId) {
  const btn = document.getElementById(btnId);
  if (window.isBgmPlaying) {
    window.SOUNDS.bgm.pause();
    window.isBgmPlaying = false;
    if (btn) btn.style.opacity = '0.5';
  } else {
    window.SOUNDS.bgm.play().catch(() => { });
    window.isBgmPlaying = true;
    if (btn) btn.style.opacity = '1';
  }
};

window.unlockAudio = function() {
  if (window.audioUnlocked) return;
  Object.values(window.SOUNDS).forEach(snd => {
    snd.volume = 0;
    snd.play().then(() => {
      snd.pause();
      snd.currentTime = 0;
      window.SOUNDS.complete.volume = 0.9;
      window.SOUNDS.correct.volume = 0.8;
      window.SOUNDS.pop.volume = 0.8;
      window.SOUNDS.feverBg.volume = 0.8;
      window.SOUNDS.bgm.volume = 0.05;
    }).catch(() => { });
  });
  window.audioUnlocked = true;
  document.removeEventListener('click', window.unlockAudio);
  document.removeEventListener('touchstart', window.unlockAudio);
  if (window.isBgmPlaying) window.SOUNDS.bgm.play().catch(() => { });
};

window.playTTS = async function(text) {
  if (text.includes(' ') || text.includes('?')) {
    window.playNativeTTS(text);
    return;
  }
  try {
    const cleanWord = text.trim().toLowerCase();
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
    if (!res.ok) throw new Error('API limits or word not found');
    const data = await res.json();
    let audioUrl = null;
    for (const item of data[0].phonetics) {
      if (item.audio && item.audio !== '') {
        audioUrl = item.audio;
        break;
      }
    }
    if (audioUrl) {
      const humanAudio = new Audio(audioUrl);
      humanAudio.volume = 1.0; 
      humanAudio.play().catch(() => window.playNativeTTS(text));
    } else {
      window.playNativeTTS(text);
    }
  } catch (err) {
    window.playNativeTTS(text);
  }
};

window.playNativeTTS = function(text, opts = {}) {
  if (!('speechSynthesis' in window)) return;
  // Strip emojis to prevent them from being read aloud
  const cleanText = text.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, "");
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'en-US';
  const { rate = 0.75, pitch = 1.0, gender = 'male' } = opts;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 1.0; 
  
  let voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    voices = window.speechSynthesis.getVoices();
  }
  
  const preferredMaleNames = ['Daniel', 'Alex', 'Google US English Male', 'Fred', 'Arthur', 'James'];
  const preferredFemaleNames = ['Samantha', 'Google US English Female', 'Karen', 'Victoria', 'Moira'];
  
  const usVoices = voices.filter(v => v.lang.startsWith('en-US'));

  if (usVoices.length > 0) {
    const targetNames = (gender === 'female') ? preferredFemaleNames : preferredMaleNames;
    const genderMatching = usVoices.filter(v => targetNames.some(name => v.name.includes(name)));
    
    if (genderMatching.length > 0) {
      // Pick random from matching gender for mix
      utterance.voice = genderMatching[Math.floor(Math.random() * genderMatching.length)];
    } else {
      // Pick random US voice
      utterance.voice = usVoices[Math.floor(Math.random() * usVoices.length)];
    }
  } else {
    // Fallback to any english voice
    const anyEng = voices.find(v => v.lang.startsWith('en-'));
    if (anyEng) utterance.voice = anyEng;
  }
  
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

window.playSlow = function(text) {
  window.playNativeTTS(text, { rate: 0.50 });
};

window.normalizePhrase = function(str) {
  return str.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
};

window.isLenientMatch = function(target, spoken) {
  const targetWords = window.normalizePhrase(target);
  const spokenWords = window.normalizePhrase(spoken);
  const spokenSet = new Set(spokenWords);
  let allMatched = true;
  for (const word of targetWords) {
    let matchFound = spokenSet.has(word);
    if (!matchFound && window.HOMOPHONES[word]) {
      matchFound = window.HOMOPHONES[word].some(h => spokenSet.has(h));
    }
    if (!matchFound) {
      allMatched = false;
      break;
    }
  }
  if (allMatched) return true;
  const score = window.diceSimilarity(target, spoken);
  return score > 0.60;
};

window.diceSimilarity = function(a, b) {
  const makeTri = str => {
    const c = str.replace(/\s+/g, ' ').toLowerCase();
    if (c.length < 3) return [c];
    const out = [];
    for (let i = 0; i < c.length - 2; i++) out.push(c.slice(i, i + 3));
    return out;
  };
  const ta = makeTri(a), tb = makeTri(b);
  const counts = new Map();
  for (const x of ta) counts.set(x, (counts.get(x) || 0) + 1);
  let intersect = 0;
  for (const x of tb) {
    if (counts.has(x) && counts.get(x) > 0) {
      intersect++;
      counts.set(x, counts.get(x) - 1);
    }
  }
  return (2 * intersect) / (ta.length + tb.length);
};

window.buildMismatchHint = function(target, spoken, suffix = '') {
  const targetWords = window.normalizePhrase(target);
  const spokenWords = window.normalizePhrase(spoken);
  const spokenSet = new Set(spokenWords);
  const missing = targetWords.filter(w => {
    let matched = spokenSet.has(w);
    if (!matched && window.HOMOPHONES[w]) {
      matched = window.HOMOPHONES[w].some(h => spokenSet.has(h));
    }
    return !matched;
  });
  if (missing.length === 0) return `Heard: "${spoken}". ${suffix}`;
  return `Heard: "${spoken}". Please say: ${missing.join(', ')}. ${suffix}`;
};
