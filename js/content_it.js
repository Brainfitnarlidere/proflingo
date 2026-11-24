/* ============================================================
   Prof Lingo — Italiano (Italian) Curriculum
   Görseller İngilizce bölümlerdeki aynı nesnelerin resimleri; resmi olmayanlarda emoji.
   ============================================================ */

window.CHAPTER_DATA_IT = {
  1: {
    name: 'Colori (Renkler)',
    items: {
      'rosso': { word: 'Rosso', translation: 'Kırmızı', image: 'images/colors/color_red.webp' },
      'blu': { word: 'Blu', translation: 'Mavi', image: 'images/colors/color_blue.webp' },
      'verde': { word: 'Verde', translation: 'Yeşil', image: 'images/colors/color_green.webp' },
      'giallo': { word: 'Giallo', translation: 'Sarı', image: 'images/colors/color_yellow.webp' },
      'nero': { word: 'Nero', translation: 'Siyah', image: 'images/colors/color_black.webp' }
    },
    batches: [['rosso', 'blu', 'verde'], ['giallo', 'nero']],
    transitions: [
      { icon: '🎉', title: 'Bravo!', subtitle: '3 rengi öğrendin. 2 tane daha kaldı!', next: 'Giallo, Nero' }
    ],
    wordPrompts: ['Che colore è?', 'Scegli il colore', 'Cosa vedi?'],
    speakPrompts: ['Di\' il colore', 'Dillo chiaramente'],
    imgPrompts: [(k, S) => `Trova: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`]
  },
  2: {
    name: 'Numeri (Sayılar)',
    items: {
      'uno': { word: 'Uno', translation: 'Bir', color: '#FFF8E1', emoji: '1️⃣' },
      'due': { word: 'Due', translation: 'İki', color: '#FFECB3', emoji: '2️⃣' },
      'tre': { word: 'Tre', translation: 'Üç', color: '#FFE082', emoji: '3️⃣' },
      'quattro': { word: 'Quattro', translation: 'Dört', color: '#FFD54F', emoji: '4️⃣' },
      'cinque': { word: 'Cinque', translation: 'Beş', color: '#FFCA28', emoji: '5️⃣' }
    },
    batches: [['uno', 'due', 'tre'], ['quattro', 'cinque']],
    transitions: [
      { icon: '🔢', title: 'Ottimo!', subtitle: '3 sayıyı öğrendin. Sırada 4 ve 5 var!', next: 'Quattro, Cinque' }
    ],
    wordPrompts: ['Che numero è?', 'Scegli il numero', 'Cosa vedi?'],
    speakPrompts: ['Di\' il numero', 'Dillo chiaramente'],
    imgPrompts: [(k, S) => `Trova: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`]
  },
  3: {
    name: 'Frutti (Meyveler)',
    items: {
      'mela': { word: 'Mela', translation: 'Elma', image: 'images/fruits/apple.webp', border: true },
      'banana': { word: 'Banana', translation: 'Muz', image: 'images/fruits/banana.webp', border: true },
      'arancia': { word: 'Arancia', translation: 'Portakal', image: 'images/fruits/orange.webp', border: true },
      'limone': { word: 'Limone', translation: 'Limon', image: 'images/fruits/lemon.webp', border: false }
    },
    batches: [['mela', 'banana', 'arancia', 'limone']],
    transitions: [],
    wordPrompts: ['Che frutto è?', 'Scegli il frutto', 'Cosa vedi?'],
    speakPrompts: ['Di\' il frutto', 'Dillo chiaramente'],
    imgPrompts: [(k, S) => `Trova: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`]
  },
  4: {
    name: 'Animali (Hayvanlar)',
    items: {
      'gatto': { word: 'Gatto', translation: 'Kedi', image: 'images/animals/cat.webp', border: false },
      'cane': { word: 'Cane', translation: 'Köpek', image: 'images/animals/dog.webp', border: false },
      'uccello': { word: 'Uccello', translation: 'Kuş', image: 'images/animals/bird.webp', border: false },
      'pesce': { word: 'Pesce', translation: 'Balık', image: 'images/animals/fish.webp', border: false }
    },
    batches: [['gatto', 'cane', 'uccello', 'pesce']],
    transitions: [],
    wordPrompts: ['Che animale è?', 'Scegli l\'animale', 'Cosa vedi?'],
    speakPrompts: ['Di\' l\'animale', 'Dillo chiaramente'],
    imgPrompts: [(k, S) => `Trova: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`]
  },
  5: {
    name: 'Abbigliamento (Giyim)',
    items: {
      'camicia': { word: 'Camicia', translation: 'Gömlek', image: 'images/clothing/shirt.webp', border: false },
      'pantaloni': { word: 'Pantaloni', translation: 'Pantolon', image: 'images/clothing/pants.webp', border: false },
      'scarpe': { word: 'Scarpe', translation: 'Ayakkabı', image: 'images/clothing/shoes.webp', border: false },
      'cappello': { word: 'Cappello', translation: 'Şapka', image: 'images/clothing/hat.webp', border: false }
    },
    batches: [['camicia', 'pantaloni', 'scarpe', 'cappello']],
    transitions: [],
    wordPrompts: ['Cos\'è questo?', 'Scegli il vestito', 'Cosa vedi?'],
    speakPrompts: ['Di\' la parola', 'Dillo chiaramente'],
    imgPrompts: [(k, S) => `Trova: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`]
  },
  6: {
    name: 'Il Corpo (Vücut)',
    items: {
      'testa': { word: 'Testa', translation: 'Baş', image: 'images/bodyparts/head.webp', border: false },
      'mano': { word: 'Mano', translation: 'El', image: 'images/bodyparts/hand.webp', border: false },
      'piede': { word: 'Piede', translation: 'Ayak', image: 'images/bodyparts/foot.webp', border: false },
      'occhio': { word: 'Occhio', translation: 'Göz', image: 'images/bodyparts/eye.webp', border: false }
    },
    batches: [['testa', 'mano', 'piede', 'occhio']],
    transitions: [],
    wordPrompts: ['Che parte del corpo è?', 'Scegli la parte del corpo', 'Cos\'è questo?'],
    speakPrompts: ['Di\' la parte del corpo', 'Dillo chiaramente'],
    imgPrompts: [(k, S) => `Trova: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`]
  },
  7: {
    name: 'In Cucina (Mutfak)',
    items: {
      'piatto': { word: 'Piatto', translation: 'Tabak', color: '#E3F2FD', emoji: '🍽️' },
      'bicchiere': { word: 'Bicchiere', translation: 'Bardak', color: '#E8F5E9', emoji: '🥛' },
      'forchetta': { word: 'Forchetta', translation: 'Çatal', color: '#FFF3E0', emoji: '🍴' },
      'coltello': { word: 'Coltello', translation: 'Bıçak', color: '#FCE4EC', emoji: '🔪' }
    },
    batches: [['piatto', 'bicchiere', 'forchetta', 'coltello']],
    transitions: [],
    wordPrompts: ['Cos\'è questo?', 'Scegli la parola', 'Cosa vedi?'],
    speakPrompts: ['Di\' la parola', 'Dillo chiaramente'],
    imgPrompts: [(k, S) => `Trova: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`]
  }
};

window.CHAPTERS_IT = [
  { id: 1, emoji: '🎨', name: 'Colori', words: 'Rosso, Blu + 3 more', locked: false },
  { id: 2, emoji: '🔢', name: 'Numeri', words: 'Uno to Cinque', locked: false },
  { id: 3, emoji: '🍎', name: 'Frutti', words: 'Mela, Banana + 2 more', locked: false },
  { id: 4, emoji: '🐾', name: 'Animali', words: 'Gatto, Cane + 2 more', locked: false },
  { id: 5, emoji: '👕', name: 'Abbigliamento', words: 'Camicia, Pantaloni...', locked: false },
  { id: 6, emoji: '👤', name: 'Il Corpo', words: 'Testa, Mano...', locked: false },
  { id: 7, emoji: '🍽️', name: 'In Cucina', words: 'Piatto, Bicchiere...', locked: false }
];

// Oyunun ortak (İngilizce) talimatlarının İtalyancası. window.talimat() kullanır (js/game/core.js).
window.TALIMAT_IT = {
  'Find ': 'Trova ',
  'Find the image': 'Trova l\'immagine',
  'What do you see?': 'Cosa vedi?',
  'Listen closely 🔊': 'Ascolta bene 🔊',
  'Match the pairs!': 'Abbina le coppie!',
  'Match the 9 pairs!': 'Abbina le 9 coppie!',
  'Complete the scene!': 'Completa la scena!',
  'Reaction Game: Click the correctly named visuals!': 'Gioco di reazione: tocca le immagini giuste!',
  'Answer the question': 'Rispondi alla domanda'
};
