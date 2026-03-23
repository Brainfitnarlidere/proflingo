'use strict';

window.MAP_POSITIONS = [
  { top: '85%', left: '25%' },
  { top: '72%', left: '75%' },
  { top: '58%', left: '30%' },
  { top: '44%', left: '70%' },
  { top: '28%', left: '25%' },
  { top: '12%', left: '65%' },
  { top: '2%', left: '45%' },
];

window.HOMOPHONES = {
  'red': ['read', 'rad', 'rd', 'lead'],
  'blue': ['blew', 'below'],
  'i': ['hi', 'eye', 'high', 'ai', 'aye'],
  'hi': ['i', 'high', 'eye'],
  'green': ['grin', 'grain'],
  'one': ['won', '1', 'on'],
  'two': ['too', 'to', '2'],
  'three': ['tree', '3', 'free'],
  'four': ['four', '4', 'far'],
  'ten': ['10'],
  'twenty': ['20', 'twentey', 'twany', 'tweny'],
  'thirty': ['30', 'thirtey', 'thurty', 'therty'],
  'forty': ['40', 'fourtey', 'forty', 'fourty'],
  'fifty': ['50', 'fiftey', 'fifty', 'fiffty'],
  'sixty': ['60', 'sixtey', 'sixty', 'sixy'],
  'seventy': ['70', 'seventey', 'seventy', 'seveny'],
  'eighty': ['80', 'eightey', 'eighty', 'eighy'],
  'ninety': ['90', 'ninetey', 'ninety', 'niney'],
  'turkey': ['turki', 'torkey', 'turk'],
  'years': ['yeas', 'yers', 'yes'],
  'old': ['hold', 'odd', 'oldy'],
  'where': ['wear', 'ware', 'were', "where's", 'whers'],
  'how': ['howdy', 'hou', 'who'],
  'who': ['hoo', 'hu', 'wue'],
  'are': ['r', 'our', 'or'],
  'am': ['m', 'em', 'um', 'ahm'],
  'from': ['form', 'fram', 'frum'],
  'happy': ['hepy', 'heppy', 'hapy'],
  'cries': ['crys', 'crise', 'cris'],
  'wait': ['weight', 'wate', 'wayt'],
  'help': ['helps', 'elps', 'helbs'],
  'jump': ['jamp', 'jumbs', 'jomp'],
  'opens': ['upens', 'obens'],
  'closes': ['clozes', 'cloze'],
  'carries': ['carrys', 'carry', 'caries'],
  'he': ['he', 'the', 'e'],
  'pizza': ['piza', 'pits', 'pidsa'],
  'milk': ['milck', 'melk'],
  'cheese': ['shees', 'cheez'],
  'egg': ['eg', 'ag'],
  'meat': ['meet', 'met'],
  'soup': ['sup', 'sop'],
  'rice': ['rise', 'raice'],
  'salad': ['salat', 'salit'],
  'sister': ['sistar', 'sista'],
  'brother': ['bruther', 'brotha'],
  'grandmother': ['granmother', 'gramother'],
  'grandfather': ['granfather', 'gramfather'],
  'baby': ['bebi', 'babi'],
  'bad': ['bed', 'bat', 'bet'],
  'bed': ['bad', 'bet'],
  'table': ['tabel', 'tebel'],
  'chair': ['char', 'cher'],
  'window': ['windo', 'windov'],
  'clock': ['clok', 'qlok'],
  'lamp': ['lamp', 'lamb'],
  'mirror': ['miror', 'mirer'],
  'sofa': ['sopha', 'sofa'],
  'gloves': ['close', 'clothes', 'clubs', 'cloves', 'loves'],
  'scarf': ['scurf', 'scar'],
  'skirt': ['skirt', 'shirt', 'skit'],
  'dress': ['dres', 'drass'],
  'train': ['trane', 'tray', 'rain'],
  'airplane': ['airplan', 'erplane'],
  'bicycle': ['bisicle', 'baicicle'],
  'boat': ['bot', 'boot'],
  'motorcycle': ['motorcicel', 'motorcik'],
  'truck': ['traq', 'trak'],
  'helicopter': ['elicopter', 'helikolter'],
  'scooter': ['scuter', 'skuter'],
  'park': ['park', 'bark'],
  'hospital': ['hospital', 'ospitel'],
  'market': ['market', 'markit'],
  'house': ['haus', 'hows'],
  'restaurant': ['restorant', 'restrant'],
  'library': ['librari', 'laibrery'],
  'beach': ['bich', 'bech'],
  'bank': ['bank', 'benk'],
  'museum': ['musium', 'muzeum'],
  'she': ['sea', 'si', 'shee'],
  'we': ['wee', 'wi', 'uwi'],
  'i': ['eye', 'ai', 'aye'],
  'your': ['yo', 'ure', 'ur'],
  'her': ['hair', 'hear', 'hur'],
  'our': ['are', 'hour', 'or'],
  'their': ['there', 'theyre', 'theyr'],
  'drink': ['dring', 'drinc', 'drinked', 'dronk'],
  'sleep': ['slep', 'sleap', 'slip'],
  'clean': ['clin', 'clene'],
  'travel': ['travil', 'trave'],
  'drive': ['driv', 'draive'],
  'swim': ['swem', 'suim'],
  'dance': ['dans', 'dens'],
  'crawl': ['craul', 'crol'],
  'think': ['thinc', 'tink', 'thing'],
  'draw': ['dra', 'drawnd'],
  'shout': ['shaut', 'shot', 'shouty']
};

window.CHAPTER_DATA = {
  1: {
    items: {
      red: { word: 'Red', image: 'images/colors/color_red.png' },
      blue: { word: 'Blue', image: 'images/colors/color_blue.png' },
      green: { word: 'Green', image: 'images/colors/color_green.png' },
      yellow: { word: 'Yellow', image: 'images/colors/color_yellow.png' },
      orange: { word: 'Orange', image: 'images/colors/color_orange.png' },
      purple: { word: 'Purple', image: 'images/colors/color_purple.png' },
      pink: { word: 'Pink', image: 'images/colors/color_pink.png' },
      black: { word: 'Black', image: 'images/colors/color_black.png' },
      white: { word: 'White', image: 'images/colors/color_white.png', border: true },
      brown: { word: 'Brown', image: 'images/colors/color_brown.png' },
    },
    batches: [
      ['red', 'blue', 'green', 'yellow'],
      ['orange', 'purple', 'pink'],
      ['black', 'white', 'brown'],
    ],
    transitions: [
      { icon: '🎉', title: 'Mini Quiz Tamam!', subtitle: '4 rengi öğrendin. 3 tane daha öğrenelim!', next: 'Orange, Purple, Pink' },
      { icon: '⭐', title: 'Harika Gidiyorsun!', subtitle: '7 rengi öğrendin. Son 3 kaldı!', next: 'Black, White, Brown' },
    ],
    wordPrompts: ['Which color is this?', 'Choose the color', 'What do you see?'],
    speakPrompts: ['Say the color', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  2: {
    items: {
      one: { word: 'One', color: '#FFF8E1', emoji: '1️⃣' },
      two: { word: 'Two', color: '#FFECB3', emoji: '2️⃣' },
      three: { word: 'Three', color: '#FFE082', emoji: '3️⃣' },
      four: { word: 'Four', color: '#FFD54F', emoji: '4️⃣' },
      five: { word: 'Five', color: '#FFCA28', emoji: '5️⃣' },
      six: { word: 'Six', color: '#FFC107', emoji: '6️⃣' },
      seven: { word: 'Seven', color: '#FFB300', emoji: '7️⃣' },
      eight: { word: 'Eight', color: '#FFA000', emoji: '8️⃣' },
      nine: { word: 'Nine', color: '#FF8F00', emoji: '9️⃣' },
      ten: { word: 'Ten', color: '#FF6F00', emoji: '🔟' },
    },
    batches: [
      ['one', 'two', 'three', 'four'],
      ['five', 'six', 'seven'],
      ['eight', 'nine', 'ten'],
    ],
    transitions: [
      { icon: '🎉', title: 'Harika!', subtitle: 'İlk 4 sayıyı öğrendin.', next: '5, 6, 7' },
      { icon: '⭐', title: 'Mükemmel!', subtitle: '7 sayıyı geçtin, son 3!', next: '8, 9, 10' },
    ],
    wordPrompts: ['Which number is this?', 'Choose the number', 'Can you count?'],
    speakPrompts: ['Say the number', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  3: {
    items: {
      apple: { word: 'Apple', image: 'images/fruits/apple.png', border: true },
      banana: { word: 'Banana', image: 'images/fruits/banana.png', border: true },
      orange: { word: 'Orange', image: 'images/fruits/orange.png', border: true },
      strawberry: { word: 'Strawberry', image: 'images/fruits/strawberry.png', border: true },
      grapes: { word: 'Grapes', image: 'images/fruits/grapes.png', border: false },
      watermelon: { word: 'Watermelon', image: 'images/fruits/watermelon.png', border: false },
      lemon: { word: 'Lemon', image: 'images/fruits/lemon.png', border: false },
      cherry: { word: 'Cherry', image: 'images/fruits/cherry.png', border: false },
      pineapple: { word: 'Pineapple', image: 'images/fruits/pineapple.png', border: false },
      carrot: { word: 'Carrot', image: 'images/fruits/carrot.png', border: false }
    },
    batches: [
      ['apple', 'banana', 'orange'],
      ['strawberry', 'grapes', 'watermelon', 'lemon'],
      ['cherry', 'pineapple', 'carrot']
    ],
    transitions: [
      { icon: '🌟', title: 'Harika!', subtitle: 'İlk meyveleri öğrendin.', next: 'Daha Fazla Meyve' },
      { icon: '🚀', title: 'Mükemmel!', subtitle: 'Meyveleri tanıyorsun, son 3!', next: 'Son Meyveler' }
    ],
    wordPrompts: ['Which item is this?', 'Select the fruit', 'What do you see?'],
    speakPrompts: ['Say the item', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  4: {
    items: {
      cat: { word: 'Cat', image: 'images/animals/cat.png', border: false },
      dog: { word: 'Dog', image: 'images/animals/dog.png', border: false },
      bird: { word: 'Bird', image: 'images/animals/bird.png', border: false },
      fish: { word: 'Fish', image: 'images/animals/fish.png', border: false },
      rabbit: { word: 'Rabbit', image: 'images/animals/rabbit.png', border: false },
      mouse: { word: 'Mouse', image: 'images/animals/mouse.png', border: false },
      turtle: { word: 'Turtle', image: 'images/animals/turtle.png', border: false },
      horse: { word: 'Horse', image: 'images/animals/horse.png', border: false },
      cow: { word: 'Cow', image: 'images/animals/cow.png', border: false },
      pig: { word: 'Pig', image: 'images/animals/pig.png', border: false }
    },
    batches: [
      ['cat', 'dog', 'bird'],
      ['fish', 'rabbit', 'mouse', 'turtle'],
      ['horse', 'cow', 'pig']
    ],
    transitions: [
      { icon: '🐾', title: 'Harika!', subtitle: 'İlk hayvanları öğrendin.', next: 'Daha Fazla Hayvan' },
      { icon: '🦁', title: 'Mükemmel!', subtitle: 'Sonsuz potansiyel, son 3!', next: 'Son Hayvanlar' }
    ],
    wordPrompts: ['Which animal is this?', 'Select the animal', 'What do you see?'],
    speakPrompts: ['Say the animal', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  5: {
    items: {
      shirt: { word: 'Shirt', image: 'images/clothing/shirt.png', border: false },
      pants: { word: 'Pants', image: 'images/clothing/pants.png', border: false },
      shoes: { word: 'Shoes', image: 'images/clothing/shoes.png', border: false },
      hat: { word: 'Hat', image: 'images/clothing/hat.png', border: false },
      dress: { word: 'Dress', image: 'images/clothing/dress.png', border: false },
      socks: { word: 'Socks', image: 'images/clothing/socks.png', border: false },
      jacket: { word: 'Jacket', image: 'images/clothing/jacket.png', border: false },
      skirt: { word: 'Skirt', image: 'images/clothing/skirt.png', border: false },
      scarf: { word: 'Scarf', image: 'images/clothing/scarf.png', border: false },
      gloves: { word: 'Gloves', image: 'images/clothing/gloves.png', border: false }
    },
    batches: [
      ['shirt', 'pants', 'shoes'],
      ['hat', 'dress', 'socks', 'jacket'],
      ['skirt', 'scarf', 'gloves']
    ],
    transitions: [
      { icon: '👚', title: 'Tebrikler!', subtitle: 'Kıyafetlerin bir kısmını öğrendin.', next: 'Daha Fazlası' },
      { icon: '🧥', title: 'Tarz Konuşuyor!', subtitle: 'Neredeyse bitirdin, son 3 kelime!', next: 'Son Kelimeler' }
    ],
    wordPrompts: ['Which clothing item is this?', 'Select the clothing', 'What do you see?'],
    speakPrompts: ['Say the item', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  6: {
    items: {
      head: { word: 'Head', image: 'images/bodyparts/head.png', border: false },
      hand: { word: 'Hand', image: 'images/bodyparts/hand.png', border: false },
      eye: { word: 'Eye', image: 'images/bodyparts/eye.png', border: false },
      ear: { word: 'Ear', image: 'images/bodyparts/ear.png', border: false },
      nose: { word: 'Nose', image: 'images/bodyparts/nose.png', border: false },
      mouth: { word: 'Mouth', image: 'images/bodyparts/mouth.png', border: false },
      leg: { word: 'Leg', image: 'images/bodyparts/leg.png', border: false },
      foot: { word: 'Foot', image: 'images/bodyparts/foot.png', border: false },
      arm: { word: 'Arm', image: 'images/bodyparts/arm.png', border: false },
      finger: { word: 'Finger', image: 'images/bodyparts/finger.png', border: false }
    },
    batches: [
      ['head', 'hand', 'eye'],
      ['ear', 'nose', 'mouth', 'leg'],
      ['foot', 'arm', 'finger']
    ],
    transitions: [
      { icon: '🧠', title: 'Harika!', subtitle: 'Vücut bölümlerini öğrenmeye başladın!', next: 'Daha Fazlası' },
      { icon: '🦵', title: 'Süper!', subtitle: 'Neredeyse bitirdin, son 3 kelime!', next: 'Son Kelimeler' }
    ],
    wordPrompts: ['Which body part is this?', 'Select the body part', 'What is this?'],
    speakPrompts: ['Say the body part', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ],
    hasMemoryGame: true
  },
  7: {
    isReview: true,
    get allReviewItems() {
      const items = {};
      for (let ch = 1; ch <= 6; ch++) {
        const chData = window.CHAPTER_DATA[ch];
        if (chData && chData.items) {
          Object.entries(chData.items).forEach(([key, val]) => {
            items[`ch${ch}_${key}`] = { ...val, sourceChapter: ch, originalKey: key };
          });
        }
      }
      return items;
    },
    get items() { return this.allReviewItems; },
    wordPrompts: ['Which one is correctly named?', 'Identify the Phase 1 item', 'Select the word'],
    imgPrompts: [
      (k, S) => `Which image shows: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`,
      (k, S) => `Find the picture for: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ],
    speakPrompts: ['Pronounce this word', 'Say it clearly']
  },
  8: {
    items: {
      bread: { word: 'Bread', image: 'images/food/food_bread_1773075723895.png', border: false },
      water: { word: 'Water', image: 'images/food/food_water_1773075740123.png', border: false },
      pizza: { word: 'Pizza', image: 'images/food/food_pizza_1773075757350.png', border: false },
      milk: { word: 'Milk', image: 'images/food/food_milk_1773075771555.png', border: false },
      cheese: { word: 'Cheese', image: 'images/food/food_cheese_1773075785909.png', border: false },
      egg: { word: 'Egg', image: 'images/food/food_egg_1773075814569.png', border: false },
      meat: { word: 'Meat', image: 'images/food/food_meat_1773075829044.png', border: false },
      soup: { word: 'Soup', image: 'images/food/food_soup_1773075848167.png', border: false },
      rice: { word: 'Rice', image: 'images/food/food_rice_1773075860734.png', border: false },
      salad: { word: 'Salad', image: 'images/food/food_salad_1773075874436.png', border: false }
    },
    batches: [
      ['bread', 'water', 'pizza', 'milk'],
      ['cheese', 'egg', 'meat'],
      ['soup', 'rice', 'salad']
    ],
    transitions: [
      { icon: '🍔', title: 'Harika!', subtitle: 'İlk yiyecekleri öğrendin.', next: 'Daha Fazla Yemek' },
      { icon: '🥘', title: 'Mükemmel!', subtitle: 'Karnımız doyuyor, son 3!', next: 'Son Yiyecekler' }
    ],
    wordPrompts: ['Which sentence matches?', 'Choose the food', 'What do you see?'],
    speakPrompts: ['Read the word', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  9: {
    items: {
      mother: { word: 'Mother', image: 'images/family/family_mother_1773075997792.png', border: false },
      father: { word: 'Father', image: 'images/family/family_father_1773076012290.png', border: false },
      brother: { word: 'Brother', image: 'images/family/family_brother_1773076028376.png', border: false },
      sister: { word: 'Sister', image: 'images/family/family_sister_v2.png', border: false },
      grandmother: { word: 'Grandmother', image: 'images/family/family_grandmother_1773076099611.png', border: false },
      grandfather: { word: 'Grandfather', image: 'images/family/family_grandfather_1773076117483.png', border: false },
      baby: { word: 'Baby', image: 'images/family/family_baby_1773076057187.png', border: false }
    },
    batches: [
      ['mother', 'father', 'brother', 'sister'],
      ['grandmother', 'grandfather', 'baby']
    ],
    transitions: [
      { icon: '👨‍👩‍👧‍👦', title: 'Harika!', subtitle: 'İlk aile üyelerini öğrendin.', next: 'Daha Fazlası' }
    ],
    wordPrompts: ['Who is this?', 'Identify the person', 'Select the family member'],
    speakPrompts: ['Say the family member', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  10: {
    items: {
      bed: { word: 'Bed', image: 'images/houseitems/bed.png', border: false },
      table: { word: 'Table', image: 'images/houseitems/table.png', border: false },
      chair: { word: 'Chair', image: 'images/houseitems/chair.png', border: false },
      wardrobe: { word: 'Wardrobe', image: 'images/houseitems/wardrobe.png', border: false },
      door: { word: 'Door', image: 'images/houseitems/door.png', border: false },
      window: { word: 'Window', image: 'images/houseitems/window.png', border: false },
      clock: { word: 'Clock', image: 'images/houseitems/clock.png', border: false },
      lamp: { word: 'Lamp', image: 'images/houseitems/lamp.png', border: false },
      mirror: { word: 'Mirror', image: 'images/houseitems/mirror.png', border: false },
      sofa: { word: 'Sofa', image: 'images/houseitems/sofa.png', border: false }
    },
    batches: [
      ['bed', 'table', 'chair'],
      ['wardrobe', 'door', 'window'],
      ['clock', 'lamp', 'mirror', 'sofa']
    ],
    transitions: [
      { icon: '🏠', title: 'Harika!', subtitle: 'Evin temel eşyalarını öğrendin.', next: 'Devam Et' },
      { icon: '🛋️', title: 'Mükemmel!', subtitle: 'Evini döşemeye devam et.', next: 'Son Eşyalar' }
    ],
    wordPrompts: ['Which item matches?', 'Select the object', 'What do you see?'],
    speakPrompts: ['Say the item', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  11: {
    items: {
      car: { word: 'Car', image: 'images/vehicles/car.png', border: false },
      bus: { word: 'Bus', image: 'images/vehicles/bus.png', border: false },
      train: { word: 'Train', image: 'images/vehicles/train.png', border: false },
      airplane: { word: 'Airplane', image: 'images/vehicles/airplane.png', border: false },
      bicycle: { word: 'Bicycle', image: 'images/vehicles/bicycle.png', border: false },
      boat: { word: 'Boat', image: 'images/vehicles/boat.png', border: false },
      motorcycle: { word: 'Motorcycle', image: 'images/vehicles/motorcycle.png', border: false },
      truck: { word: 'Truck', image: 'images/vehicles/truck.png', border: false },
      helicopter: { word: 'Helicopter', image: 'images/vehicles/helicopter.png', border: false },
      scooter: { word: 'Scooter', image: 'images/vehicles/scooter.png', border: false }
    },
    batches: [
      ['car', 'bus', 'train', 'airplane'],
      ['bicycle', 'boat', 'motorcycle'],
      ['truck', 'helicopter', 'scooter']
    ],
    transitions: [
      { icon: '🚗', title: 'Hızlandın!', subtitle: 'Ana taşıtları öğrendin.', next: 'Daha Fazlası' },
      { icon: '🚀', title: 'Uçuyorsun!', subtitle: 'Yeni araçlar seni bekliyor.', next: 'Son Araçlar' }
    ],
    wordPrompts: ['Which vehicle is this?', 'Select the transport', 'What do you see?'],
    speakPrompts: ['Say the vehicle', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  12: {
    items: {
      school: { word: 'School', image: 'images/places/school.png', border: false },
      park: { word: 'Park', image: 'images/places/park.png', border: false },
      hospital: { word: 'Hospital', image: 'images/places/hospital.png', border: false },
      market: { word: 'Market', image: 'images/places/market.png', border: false },
      house: { word: 'House', image: 'images/places/house.png', border: false },
      restaurant: { word: 'Restaurant', image: 'images/places/restaurant.png', border: false },
      library: { word: 'Library', image: 'images/places/library.png', border: false },
      beach: { word: 'Beach', image: 'images/places/beach.png', border: false },
      bank: { word: 'Bank', image: 'images/places/bank.png', border: false },
      museum: { word: 'Museum', image: 'images/places/museum.png', border: false }
    },
    batches: [
      ['school', 'park', 'hospital', 'market', 'house'],
      ['restaurant', 'library', 'beach'],
      ['bank', 'museum']
    ],
    transitions: [
      { icon: '🏫', title: 'Keşfediyorsun!', subtitle: 'Şehirdeki ilk mekanları öğrendin.', next: 'Devam Et' },
      { icon: '🗺️', title: 'Harika Gidiyorsun!', subtitle: 'Yeni yerler seni bekliyor.', next: 'Son Mekanlar' }
    ],
    wordPrompts: ['Which place is this?', 'Identify the location', 'Where are we?'],
    speakPrompts: ['Say the place', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  13: {
    items: {
      doctor: { word: 'Doctor', image: 'images/occupations/doctor.png', border: false },
      teacher: { word: 'Teacher', image: 'images/occupations/teacher.png', border: false },
      police: { word: 'Police Officer', image: 'images/occupations/policeman.png', border: false },
      farmer: { word: 'Farmer', image: 'images/occupations/farmer.png', border: false },
      firefighter: { word: 'Firefighter', image: 'images/occupations/fireman.png', border: false },
      cook: { word: 'Cook', image: 'images/occupations/cook.png', border: false },
      driver: { word: 'Driver', image: 'images/occupations/driver.png', border: false },
      artist: { word: 'Artist', image: 'images/occupations/artist.png', border: false },
      student: { word: 'Student', image: 'images/occupations/student.png', border: false },
      pilot: { word: 'Pilot', image: 'images/occupations/pilot.png', border: false }
    },
    batches: [
      ['doctor', 'teacher', 'police', 'farmer'],
      ['firefighter', 'cook', 'driver'],
      ['artist', 'student', 'pilot']
    ],
    transitions: [
      { icon: '👮', title: 'Harika Kariyer!', subtitle: 'Toplumdaki rolleri öğrendin.', next: 'Daha Fazlası' },
      { icon: '👨‍🔬', title: 'Geleceğin Parlak!', subtitle: 'Yeni meslekler seni bekliyor.', next: 'Son Meslekler' }
    ],
    wordPrompts: ['Which job is this?', 'Identify the worker', 'Choose the occupation'],
    speakPrompts: ['Say the occupation', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  14: {
    isReview: true,
    wordPrompts: ['Which one is correctly named?', 'Identify the Phase 2 item', 'Select the word'],
    imgPrompts: [
      (k, S) => `Which image shows: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`,
      (k, S) => `Find the picture for: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ],
    speakPrompts: ['Pronounce this word', 'Say it clearly'],
    get allReviewItems() {
      const items = {};
      for (let ch = 8; ch <= 13; ch++) {
        const chData = window.CHAPTER_DATA[ch];
        if (chData && chData.items) {
          Object.entries(chData.items).forEach(([key, val]) => {
            items[`ch${ch}_${key}`] = { ...val, sourceChapter: ch, originalKey: key };
          });
        }
      }
      return items;
    },
    get items() { return this.allReviewItems; }
  },
  15: {
    isRepeatMode: true,
    items: {
      hungry: { word: 'I am hungry', sentence: 'I am hungry', image: 'images/food/ch15_hungry_v1.png' },
      doctor_visit: { word: 'I see a doctor', sentence: 'I see a doctor', image: 'images/occupations/ch15_doctor_visit_v1.png' },
      go_school: { word: 'I go to school', sentence: 'I go to school', image: 'images/places/go_school.png' },
      drive_car: { word: 'I drive a car', sentence: 'I drive a car', image: 'images/vehicles/ch15_drive_car_v1.png' },
      my_mother: { word: 'This is my mother', sentence: 'This is my mother', image: 'images/family/family_mother_1773075997792.png' },
      apple_red: { word: 'The apple is red', sentence: 'The apple is red', image: 'images/fruits/ch15_apple_red_v1.png' },
      cat_item: { word: 'This is a cat', sentence: 'This is a cat', image: 'images/animals/cat.png' },
      teacher_item: { word: 'I am a teacher', sentence: 'I am a teacher', image: 'images/occupations/ch15_teacher_item_v1.png' },
      eat_bread: { word: 'I eat bread', sentence: 'I eat bread', image: 'images/food/food_bread_1773075723895.png' },
      bus_blue: { word: 'The bus is yellow', sentence: 'The bus is yellow', image: 'images/vehicles/ch15_bus_yellow_v1.png' },
      dog_sleep: { word: 'The dog is sleeping', sentence: 'The dog is sleeping', image: 'images/animals/dog_sleeping.png' },
      eat_apple: { word: 'I eat an apple', sentence: 'I eat an apple', image: 'images/verbs/verb_i_v2_eat_apple_bite_v2_1773652468439.png' },
      drink_water: { word: 'I drink water', sentence: 'I drink water', image: 'images/verbs/verb_i_v2_drink_water_mirror_v2_1773652485146.png' },
      big_house: { word: 'The house is big', sentence: 'The house is big', image: 'images/places/place_house_v2_big_small_arrow_v2_1773652502094.png' },
      red_shirt: { word: 'I wear a red shirt', sentence: 'I wear a red shirt', image: 'images/clothing/ch15_red_shirt_v1.png' },
      father_work: { word: 'My father is at work', sentence: 'My father is at work', image: 'images/family/family_father_v2_at_work_v2_1773652518794.png' },
      see_bird: { word: 'I see a bird', sentence: 'I see a bird', image: 'images/animals/ch15_see_bird_v1.png' },
      blue_eyes: { word: 'The eyes are blue', sentence: 'The eyes are blue', image: 'images/bodyparts/eye.png' },
      ride_bicycle: { word: 'I ride a bicycle', sentence: 'I ride a bicycle', image: 'images/vehicles/ch15_ride_bicycle_v1.png' },
      good_student: { word: 'He is a good student', sentence: 'He is a good student', image: 'images/occupations/student.png' },
      hat_yellow21: { word: 'The hat is yellow', sentence: 'The hat is yellow', image: 'images/colourfull_things/hat_yellow_21_1773353338523.png' },
      socks_white21: { word: 'The socks are white', sentence: 'The socks are white', image: 'images/colourfull_things/socks_white_21_1773353353754.png' },
      jacket_brown21: { word: 'The jacket is brown', sentence: 'The jacket is brown', image: 'images/colourfull_things/jacket_brown_21_1773353370271.png' },
      shoes_blue21: { word: 'The shoes are blue', sentence: 'The shoes are blue', image: 'images/colourfull_things/shoes_blue_21_1773353388726.png' },
      scarf_pink21: { word: 'The scarf is pink', sentence: 'The scarf is pink', image: 'images/colourfull_things/scarf_pink_21_1773353402563.png' },
      banana_yellow21: { word: 'The banana is yellow', sentence: 'The banana is yellow', image: 'images/colourfull_things/banana_yellow21.png' },
      grapes_purple21: { word: 'The grapes are purple', sentence: 'The grapes are purple', image: 'images/colourfull_things/grapes_purple21.png' },
      lemon_green21: { word: 'The lemon is green', sentence: 'The lemon is green', image: 'images/colourfull_things/lemon_green_21_1773353420502.png' }
    },
    batches: [
      ['hungry', 'doctor_visit', 'go_school', 'drive_car', 'my_mother'],
      ['apple_red', 'cat_item', 'teacher_item', 'eat_bread', 'bus_blue'],
      ['dog_sleep', 'eat_apple', 'drink_water', 'big_house', 'red_shirt'],
      ['father_work', 'see_bird', 'blue_eyes', 'ride_bicycle', 'good_student'],
      ['hat_yellow21', 'socks_white21', 'jacket_brown21', 'shoes_blue21'],
      ['scarf_pink21', 'banana_yellow21', 'grapes_purple21', 'lemon_green21']
    ],
    transitions: [
      { icon: '🗣️', title: 'Cümle Kuruyorsun!', subtitle: 'Kelime bilgisini cümlelere dökmeye başladın.', next: 'Yeni Cümleler' },
      { icon: '🌟', title: 'Harika Gidiyorsun!', subtitle: 'Cümleler giderek daha doğal geliyor.', next: 'Daha Fazla Cümle' },
      { icon: '🚀', title: 'Mükemmel!', subtitle: 'Neredeyse bitirdin, devam et!', next: 'Daha Fazla Cümle' },
      { icon: '🎨', title: 'Renkli Dünyalar!', subtitle: 'Renkleri cümle içinde kullanıyorsun.', next: 'Daha Fazla Renk' },
      { icon: '👑', title: 'Harika!', subtitle: 'Son bir set kaldı!', next: 'Son Kelimeler' }
    ],
    wordPrompts: ['Which sentence matches?', 'Choose the action', 'What are they doing?'],
    speakPrompts: ['Read the sentence', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].sentence}"`
    ]
  },
  16: {
    isRepeatMode: true,
    items: {
      bus_trip: { word: 'I am on the bus', sentence: 'I am on the bus', image: 'images/vehicles/bus.png' },
      family_car: { word: 'Mother and father are in the car', sentence: 'Mother and father are in the car', image: 'images/vehicles/car.png' },
      go_hospital: { word: 'We go to the hospital', sentence: 'We go to the hospital', image: 'images/places/go_hospital.png' },
      grand_meal: { word: 'Grandfather and grandmother eat bread', sentence: 'Grandfather and grandmother eat bread', image: 'images/food/food_bread_1773075723895.png' },
      driver_market: { word: 'The driver is at the market', sentence: 'The driver is at the market', image: 'images/places/market.png' },
      baby_water: { word: 'The baby drinks water', sentence: 'The baby drinks water', image: 'images/food/food_water_1773075740123.png' }
    },
    batches: [['bus_trip', 'family_car', 'go_hospital', 'grand_meal', 'driver_market', 'baby_water']],
    transitions: [
      { icon: '🗣️', title: 'First round done!', subtitle: 'Repeat the sentences slowly.', next: 'Last 3 sentences' }
    ],
    wordPrompts: ['Listen first, then repeat', 'I will say it slowly—repeat after me', 'Listen carefully and repeat'],
    speakPrompts: ['Repeat after me', 'Say the sentence']
  },
  17: {
    items: {
      eat_bread17: { word: 'I eat bread', sentence: 'I eat [bread]', options: ['bread', 'rice', 'cheese'], image: 'images/food/food_bread_1773075723895.png' },
      drink_water17: { word: 'I drink water', sentence: 'I drink [water]', options: ['water', 'milk', 'soup'], image: 'images/food/food_water_1773075740123.png' },
      red_car17: { word: 'The car is green', sentence: 'The car is [green]', options: ['green', 'red', 'blue'], image: 'images/vehicles/car.png' },
      bus_school17: { word: 'We take the bus to school', sentence: 'We take the bus to [school]', options: ['school', 'park', 'market'], image: 'images/places/school.png' },
      father_market17: { word: 'Father goes to the market', sentence: 'Father goes to the [market]', options: ['market', 'hospital', 'park'], image: 'images/places/market.png' },
      mother_kitchen17: { word: 'Mother cooks rice', sentence: 'Mother cooks [rice]', options: ['rice', 'bread', 'soup'], image: 'images/food/food_rice_1773075860734.png' },
      blue_shirt17: { word: 'The shirt is blue', sentence: 'The shirt is [blue]', options: ['blue', 'red', 'yellow'], image: 'images/clothing/shirt.png' },
      doctor_hospital17: { word: 'The doctor is at the hospital', sentence: 'The doctor is at the [hospital]', options: ['hospital', 'school', 'market'], image: 'images/places/hospital.png' },
      children_park17: { word: 'The children play in the park', sentence: 'The children play in the [park]', options: ['park', 'house', 'school'], image: 'images/places/children_park.png' },
      baby_milk17: { word: 'The baby drinks milk', sentence: 'The baby drinks [milk]', options: ['milk', 'water', 'juice'], image: 'images/food/food_milk_1773075771555.png' }
    },
    batches: [
      ['eat_bread17', 'drink_water17', 'red_car17', 'bus_school17', 'father_market17'],
      ['mother_kitchen17', 'blue_shirt17', 'doctor_hospital17', 'children_park17', 'baby_milk17']
    ],
    transitions: [
      { icon: '✏️', title: 'Halfway there!', subtitle: 'Keep completing the sentences.', next: 'Final set' }
    ],
    wordPrompts: ['Fill in the blank', 'What belongs here?', 'Complete the sentence'],
    speakPrompts: ['Read the full sentence', 'Say it out loud'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  18: {
    isRepeatMode: true,
    items: {
      cat_apple: { word: 'The cat eats a red apple', sentence: 'The cat eats a red apple', image: 'images/animals/cat_apple.png' },
      bird_tree: { word: 'A green bird sits on a tree', sentence: 'A green bird sits on a tree', image: 'images/animals/bird_tree.png' },
      rabbit_carrot: { word: 'The rabbit eats a carrot', sentence: 'The rabbit eats a carrot', image: 'images/animals/rabbit_carrot.png' },
      yellow_bus: { word: 'I see a yellow bus', sentence: 'I see a yellow bus', image: 'images/vehicles/bus_yellow.png' },
      dog_hat: { word: 'The dog sits and smiles', sentence: 'The dog sits and smiles', image: 'images/animals/dog_sits_smiles.png' },
      two_fish: { word: 'I see one fish', sentence: 'I see one fish', image: 'images/animals/one_fish.png' },
      fish_swim: { word: 'The fish swims fast', sentence: 'The fish swims fast', image: 'images/animals/fish_swims.png' },
      cat_sleep: { word: 'The cat is sleeping', sentence: 'The cat is sleeping', image: 'images/animals/cat_sleeping_new.png' },
      dog_run: { word: 'The dog runs fast', sentence: 'The dog runs fast', image: 'images/animals/dog_runs.png' },
      bird_fly: { word: 'The bird flies high', sentence: 'The bird flies high', image: 'images/animals/bird_flies.png' },
      cat_jump: { word: 'The cat jumps high', sentence: 'The cat jumps high', image: 'images/animals/cat_jumps.png' },
      dog_happy: { word: 'The dog is happy', sentence: 'The dog is happy', image: 'images/animals/dog_happy.png' },
      bird_blue: { word: 'The bird is blue', sentence: 'The bird is blue', image: 'images/animals/bird_blue.png' }
    },
    batches: [
      ['cat_apple', 'bird_tree', 'rabbit_carrot', 'yellow_bus', 'dog_hat', 'cat_jump'],
      ['two_fish', 'fish_swim', 'cat_sleep', 'dog_run', 'bird_fly', 'dog_happy', 'bird_blue']
    ],
    transitions: [{ icon: '🦁', title: 'Amazing!', subtitle: 'You are an action star!', next: 'Next round' }],
    wordPrompts: ['Listen and repeat', 'Say it slowly'],
    speakPrompts: ['Repeat after me', 'Say the sentence']
  },
  19: {
    isRepeatMode: true,
    items: {
      mother_kitchen: { word: 'Mother is in the kitchen', sentence: 'Mother is in the kitchen', image: 'images/family/mother_kitchen.png' },
      father_car: { word: 'Father drives a blue car', sentence: 'Father drives a blue car', image: 'images/family/father_car.png' },
      grandma_park: { word: 'Grandmother walks in the park', sentence: 'Grandmother walks in the park', image: 'images/family/grandmother_park.png' },
      brother_school: { word: 'Brother goes to school', sentence: 'Brother goes to school', image: 'images/family/brother_school.png' },
      sister_milk: { word: 'Sister drinks milk', sentence: 'Sister drinks milk', image: 'images/family/sister_milk.png' },
      family_home: { word: 'We are at home', sentence: 'We are at home', image: 'images/family/family_home.png' },
      mother_read: { word: 'Mother reads a book', sentence: 'Mother reads a book', image: 'images/family/mother_reading.png' },
      father_cooks: { word: 'Father cooks dinner', sentence: 'Father cooks dinner', image: 'images/family/father_cooking.png' },
      sister_smiles: { word: 'Sister smiles happily', sentence: 'Sister smiles happily', image: 'images/family/sister_smiles.png' },
      baby_happy: { word: 'The baby is happy', sentence: 'The baby is happy', image: 'images/family/family_baby_1773076057187.png' },
      grandpa_reads: { word: 'Grandfather reads a book', sentence: 'Grandfather reads a book', image: 'images/family/family_grandfather_1773076117483.png' },
      family_park: { word: 'The family plays in the park', sentence: 'The family plays in the park', image: 'images/places/park.png' }
    },
    batches: [
      ['mother_kitchen', 'father_car', 'grandma_park', 'brother_school', 'sister_milk', 'grandpa_reads'],
      ['family_home', 'mother_read', 'father_cooks', 'sister_smiles', 'baby_happy', 'family_park']
    ],
    transitions: [{ icon: '🏠', title: 'Great Job!', subtitle: 'Family and home sentences mastered.', next: 'Well done!' }],
    wordPrompts: ['Listen and repeat', 'Say it slowly'],
    speakPrompts: ['Repeat after me', 'Say the sentence']
  },
  20: {
    isRepeatMode: true,
    items: {
      open_door20: { word: 'The door is open', sentence: 'The door is open', image: 'images/home_items/door_open_20_1773353180045.png' },
      sit_chair20: { word: 'Sit on the chair', sentence: 'Sit on the chair', image: 'images/home_items/sit_chair.png' },
      lamp_bright20: { word: 'The lamp is bright', sentence: 'The lamp is bright', image: 'images/home_items/lamp_bright_20_1773353209893.png' },
      window_open20: { word: 'The window is open', sentence: 'The window is open', image: 'images/home_items/window_open_20_1773353226258.png' },
      sofa_soft20: { word: 'The sofa is soft', sentence: 'The sofa is soft', image: 'images/home_items/sofa_soft_20_1773353242220.png' },
      mirror_clean20: { word: 'The mirror is clean', sentence: 'The mirror is clean', image: 'images/home_items/mirror_clean_20_1773353260023.png' },
      eat_table20: { word: 'The table is big', sentence: 'The table is big', image: 'images/home_items/table_big_20_1773353277095.png' },
      sleep_bed20: { word: 'I sleep in the bed', sentence: 'I sleep in the bed', image: 'images/home_items/bed_sleep_20_1773353292508.png' }
    },
    batches: [
      ['open_door20', 'sit_chair20', 'lamp_bright20', 'window_open20'],
      ['sofa_soft20', 'mirror_clean20', 'eat_table20', 'sleep_bed20']
    ],
    transitions: [{ icon: '🛋️', title: 'Great start!', subtitle: 'Keep repeating home sentences.', next: 'More home lines' }],
    wordPrompts: ['Listen first, then repeat', 'Repeat after me', 'Say it clearly'],
    speakPrompts: ['Repeat this sentence', 'Say it out loud']
  },
  21: {
    isReview: true,
    wordPrompts: ['Which sentence matches?', 'Identify the Phase 3 item', 'Select the correct sentence'],
    imgPrompts: [
      (k, S) => `Which image shows: "${window.CHAPTER_DATA[S.chapterId].items[k].sentence || window.CHAPTER_DATA[S.chapterId].items[k].word}"`,
      (k, S) => `Find the picture for: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ],
    speakPrompts: ['Read the sentence', 'Say it clearly'],
    get allReviewItems() {
      const items = {};
      // Include current phase (15-20)
      for (let ch = 15; ch <= 20; ch++) {
        const chData = window.CHAPTER_DATA[ch];
        if (chData && chData.items) {
          Object.entries(chData.items).forEach(([key, val]) => {
            items[`ch${ch}_${key}`] = { ...val, sourceChapter: ch, originalKey: key };
          });
        }
      }
      // ALSO include Chapter 10 for the Home Scene targets
      const ch10 = window.CHAPTER_DATA[10];
      if (ch10 && ch10.items) {
        Object.entries(ch10.items).forEach(([key, val]) => {
          items[`ch10_${key}`] = { ...val, sourceChapter: 10, originalKey: key };
        });
      }
      return items;
    },
    get items() { return this.allReviewItems; }
  },
  22: {
    items: {
      pron_he: { word: 'he', image: 'images/pronouns/pron_he.png' },
      pron_she: { word: 'she', image: 'images/family/family_mother_1773075997792.png' },
      pron_it: { word: 'it', image: 'images/animals/dog.png' },
      pron_they: { word: 'they', image: 'images/family/family_home.png' },
      pron_we: { word: 'we', image: 'images/pronouns/pron_we.png' },
      pron_you: { word: 'you', color: '#FFF3E0', emoji: '🫵' },
      pron_i: { word: 'I', image: 'images/pronouns/pron_i_v2_mirror_point_v2_1773651368293.png' },
      poss_his: { word: 'his', image: 'images/possessives/poss_his_v3_book_arrow_v2_1773651384133.png' },
      poss_her: { word: 'her', image: 'images/possessives/poss_her_v3_hat_arrow_1773630467553.png' },
      poss_its: { word: 'its', image: 'images/possessives/poss_its_v3_yarn_arrow_v2_1773630483676.png' },
      poss_their: { word: 'their', image: 'images/possessives/poss_their_v3_dog_arrow_v2_1773651416435.png' },
      poss_my: { word: 'my', image: 'images/possessives/poss_my_v3_phone_arrow_v2_1773651451526.png' },
      poss_your: { word: 'your', image: 'images/possessives/poss_your_v3_guitar_arrow_v2_1773651434309.png' },
      poss_babys: { word: "baby's", image: 'images/possessives/poss_babys.png' },
      poss_boys: { word: "boy's", image: 'images/possessives/poss_boys_v3_car_arrow_v2_1773630502208.png' },
      poss_girls: { word: "girl's", image: 'images/possessives/poss_girls_v3_gift_arrow_v2_1773651399139.png' }
    },
    batches: [
      ['pron_he', 'pron_she', 'pron_it', 'pron_they', 'pron_we', 'pron_you', 'pron_i'],
      ['poss_his', 'poss_her', 'poss_its', 'poss_their', 'poss_my', 'poss_your', 'poss_babys', 'poss_boys', 'poss_girls']
    ],
    transitions: [{ icon: '👥', title: 'Great job!', subtitle: 'Keep practicing pronouns and possession.', next: 'Next set' }],
    wordPrompts: ['Who is this?', 'Pick the correct word', 'Select the pronoun'],
    speakPrompts: ['Say the word', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  23: {
    isRepeatMode: true,
    items: {
      s_i_happy: { word: 'I am happy', sentence: 'I am happy', image: 'images/sentences/i_am_happy.png' },
      s_you_friend: { word: 'You are my friend', sentence: 'You are my friend', image: 'images/sentences/you_are_my_friend.png' },
      s_he_boy: { word: 'He is a boy', sentence: 'He is a boy', image: 'images/sentences/he_is_a_boy.png' },
      s_she_girl: { word: 'She is a girl', sentence: 'She is a girl', image: 'images/sentences/she_is_a_girl.png' },
      s_it_cat: { word: 'It is a cat', sentence: 'It is a cat', image: 'images/animals/cat.png' },
      s_we_family: { word: 'We are a family', sentence: 'We are a family', image: 'images/pronouns/pron_we.png' },
      s_they_playing: { word: 'They are playing', sentence: 'They are playing', image: 'images/family/family_home.png' }
    },
    batches: [
      ['s_i_happy', 's_you_friend', 's_he_boy', 's_she_girl'],
      ['s_it_cat', 's_we_family', 's_they_playing']
    ],
    transitions: [{ icon: '👤', title: 'Great job!', subtitle: 'You are learning simple sentences.', next: 'Next set' }],
    wordPrompts: ['Which sentence matches?', 'Choose the action', 'What do you see?'],
    speakPrompts: ['Read the sentence', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  24: {
    isRepeatMode: true,
    items: {
      s_my_apple: { word: 'My apple is red', sentence: 'My apple is red', image: 'images/possessives/poss_my_v2_apple_mirror_v2_1773630532257.png' },
      s_your_guitar: { word: 'Your guitar is loud', sentence: 'Your guitar is loud', image: 'images/possessives/poss_your_v3_guitar_arrow_v2_1773651434309.png' },
      s_his_book: { word: 'His book is blue', sentence: 'His book is blue', image: 'images/possessives/poss_his_v3_book_arrow_v2_1773651384133.png' },
      s_her_hat: { word: 'Her hat is stylish', sentence: 'Her hat is stylish', image: 'images/possessives/poss_her_v3_hat_arrow_1773630467553.png' },
      s_its_ball: { word: 'Its ball is colorful', sentence: 'Its ball is colorful', image: 'images/possessives/poss_its_v3_yarn_arrow_v2_1773630483676.png' },
      s_their_dog: { word: 'Their dog is friendly', sentence: 'Their dog is friendly', image: 'images/possessives/poss_their_v3_dog_arrow_v2_1773651416435.png' },
      s_babys_rattle: { word: "The baby's rattle is colorful", sentence: "The baby's rattle is colorful", image: 'images/possessives/poss_babys.png' }
    },
    batches: [
      ['s_my_apple', 's_your_guitar', 's_his_book', 's_her_hat'],
      ['s_its_ball', 's_their_dog', 's_babys_rattle']
    ],
    transitions: [{ icon: '🔑', title: 'Excellent!', subtitle: 'Now you can talk about things you own.', next: 'Finish' }],
    wordPrompts: ['Which sentence matches?', 'Choose the possessive', 'Practice ownership'],
    speakPrompts: ['Read the sentence', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ]
  },
  25: {
    isRepeatMode: true,
    items: {
      bus_stop: { word: 'The bus stops here', sentence: 'The bus stops here', image: 'images/vehicles/bus_stop.png' },
      car_fast: { word: 'The car goes fast', sentence: 'The car goes fast', image: 'images/vehicles/car_fast.png' },
      bicycle_ride: { word: 'I ride my bicycle', sentence: 'I ride my bicycle', image: 'images/vehicles/bicycle_ride.png' },
      train_long: { word: 'The train is long', sentence: 'The train is long', image: 'images/vehicles/train_long.png' },
      airplane_high: { word: 'The airplane flies high', sentence: 'The airplane flies high', image: 'images/vehicles/airplane.png' },
      boat_water: { word: 'The boat is on the water', sentence: 'The boat is on the water', image: 'images/vehicles/boat.png' },
      truck_big: { word: 'The truck is big', sentence: 'The truck is big', image: 'images/vehicles/truck.png' },
      scooter_small: { word: 'The scooter is small', sentence: 'The scooter is small', image: 'images/vehicles/scooter.png' }
    },
    batches: [
      ['bus_stop', 'car_fast', 'bicycle_ride', 'train_long'],
      ['airplane_high', 'boat_water', 'truck_big', 'scooter_small']
    ],
    transitions: [{ icon: '🚗', title: 'Moving along!', subtitle: 'Keep repeating transport sentences.', next: 'Second set' }],
    wordPrompts: ['Listen first, then repeat', 'Repeat after me', 'Say it clearly'],
    speakPrompts: ['Repeat this sentence', 'Say it out loud']
  },
  26: {
    items: {
      v_i_eat: { word: 'I eat', sentence: 'I eat', image: 'images/verbs/v26_i_eat_dinner_premium_v1_1773764012055.png' },
      v_she_walks: { word: 'She walks', sentence: 'She walks', image: 'images/verbs/v26_she_walks_premium_v1_1773763897147.png' },
      v_they_watch: { word: 'They watch', sentence: 'They watch', image: 'images/verbs/v26_they_watch_premium_v1_1773763919160.png' },
      v_it_runs: { word: 'It runs', sentence: 'It runs', image: 'images/verbs/v26_it_runs_premium_v1_1773763938394.png' },
      v_we_drink: { word: 'We drink', sentence: 'We drink', image: 'images/verbs/v26_we_drink_premium_v1_1773763961236.png' },
      v_you_sleep: { word: 'You sleep', sentence: 'You sleep', image: 'images/verbs/v26_you_sleep_premium_v1_1773763978953.png' },
      v_it_jumps: { word: 'It jumps', sentence: 'It jumps', image: 'images/verbs/v26_it_jumps_premium_v1_1773764349536.png' },
      v_i_speak: { word: 'I speak', sentence: 'I speak', image: 'images/verbs/verb_i_v2_speak_mirror_v2_1773651351878.png' },
      v_she_reads: { word: 'She reads', sentence: 'She reads', image: 'images/verbs/v26_she_reads_premium_v1_1773764368196.png' },
      v_they_sing: { word: 'They sing', sentence: 'They sing', image: 'images/verbs/verb_they_v2_sing_notes_v2_1773630547420.png' },
      v_he_writes: { word: 'He writes', sentence: 'He writes', image: 'images/verbs/v26_he_writes_premium_v1_1773764051303.png' },
      v_we_listen: { word: 'We listen', sentence: 'We listen', image: 'images/verbs/v26_we_listen_premium_v1_1773764071225.png' },
      v_you_sit: { word: 'You sit', sentence: 'You sit', image: 'images/verbs/v26_you_sit_premium_v1_1773764091139.png' },
      v_it_flies: { word: 'It flies', sentence: 'It flies', image: 'images/verbs/v26_it_flies_premium_v1_1773764384883.png' },
      v_i_stand: { word: 'I stand', sentence: 'I stand', image: 'images/verbs/v26_i_stand_premium_v1_1773764110820.png' },
      v_she_smiles: { word: 'She smiles', sentence: 'She smiles', image: 'images/family/sister_smiles.png' },
      v_they_laugh: { word: 'They laugh', sentence: 'They laugh', image: 'images/family/ch26_they_laugh_v1.png' },
      v_he_plays: { word: 'He plays', sentence: 'He plays', image: 'images/family/ch26_he_plays_v1.png' },
      v_we_cook: { word: 'We cook', sentence: 'We cook', image: 'images/family/ch26_we_cook_v1.png' },
      v_you_wash: { word: 'You wash', sentence: 'You wash', image: 'images/verbs/v26_you_wash_premium_v1_1773764030297.png' }
    },
    batches: [
      ['v_i_eat', 'v_she_walks', 'v_they_watch', 'v_it_runs', 'v_we_drink'],
      ['v_you_sleep', 'v_it_jumps', 'v_i_speak', 'v_she_reads', 'v_they_sing'],
      ['v_he_writes', 'v_we_listen', 'v_you_sit', 'v_it_flies', 'v_i_stand'],
      ['v_she_smiles', 'v_they_laugh', 'v_he_plays', 'v_we_cook', 'v_you_wash']
    ],
    transitions: [
      { icon: '🏃', title: 'Action time!', subtitle: 'Süper gidiyorsun, devam et!', next: 'Set 2' },
      { icon: '🌟', title: 'Harika gidiyorsun!', subtitle: 'Günlük fiillerle devam ediyoruz.', next: 'Set 3' },
      { icon: '🔥', title: 'Mükemmel!', subtitle: 'Az kaldı, son sete geçiyoruz.', next: 'Son Set' }
    ],
    wordPrompts: ['Which sentence matches?', 'Choose the action', 'What are they doing?'],
    speakPrompts: ['Read the sentence', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].sentence}"`
    ]
  },
  27: {
    items: {
      v_i_work: { word: 'I work', sentence: 'I work', image: 'images/verbs/ch27_i_work_v1.png' },
      v_she_cleans: { word: 'She cleans', sentence: 'She cleans', image: 'images/verbs/verb_she_v3_cleans_v2_1773652987130.png' },
      v_they_travel: { word: 'They travel', sentence: 'They travel', image: 'images/verbs/ch27_they_travel_v1.png' },
      v_he_drives: { word: 'He drives', sentence: 'He drives', image: 'images/verbs/ch27_he_drives_v1.png' },
      v_we_swim: { word: 'We swim', sentence: 'We swim', image: 'images/verbs/verb_we_v3_swim_fish_v2_1773653001233.png' },
      v_you_dance: { word: 'You dance', sentence: 'You dance', image: 'images/verbs/verb_you_v2_dance_premium_v2_1773653230487.png' },
      v_it_crawls: { word: 'It crawls', sentence: 'It crawls', image: 'images/verbs/verb_it_v2_crawls_bug_v2_1773653194123_1773653245123.png' },
      v_i_think: { word: 'I think', sentence: 'I think', image: 'images/verbs/verb_i_v2_think_mirror_v2_1773671042123_1773672272400.png' },
      v_she_draws: { word: 'She draws', sentence: 'She draws', image: 'images/verbs/ch27_she_draws_v1.png' },
      v_they_shout: { word: 'They shout', sentence: 'They shout', image: 'images/verbs/verb_they_v2_shout_crowd_v2_1773671042123_1773672289788.png' },
      v_he_cries: { word: 'He cries', sentence: 'He cries', image: 'images/verbs/v27_he_cries_final_v8_1773750480000_1316_1773742215055.png' },
      v_we_wait: { word: 'We wait', sentence: 'We wait', image: 'images/verbs/v27_we_wait_final_v8_1773750480000_1316_1773742233870.png' },
      v_you_buy: { word: 'You buy', sentence: 'You buy', image: 'images/verbs/v27_you_buy_final_v9_1773750840000_1317_1773742294403.png' },
      v_it_grows: { word: 'It grows', sentence: 'It grows', image: 'images/verbs/v27_it_grows_final_v9_1773750840000_1317_1773742313303.png' },
      v_i_help: { word: 'I help', sentence: 'I help', image: 'images/verbs/v27_i_help_final_v10_1773751320000_1318_1773742341353.png' },
      v_he_carries: { word: 'He carries', sentence: 'He carries', image: 'images/verbs/v27_he_carries_final_v11_1773751800000_1319_1773742420458.png' },
      v_they_are_happy: { word: 'They are happy', sentence: 'They are happy', image: 'images/verbs/v27_they_are_happy_final_v11_1773751800000_1319_1773742434579.png' },
      v_he_opens: { word: 'He opens', sentence: 'He opens', image: 'images/verbs/v27_he_opens_final_v10_1773751320000_1318_1773742358013.png' },
      v_we_close: { word: 'We close', sentence: 'We close', image: 'images/verbs/v27_we_close_final_v10_1773751320000_1318_1773742371639.png' },
      v_you_jump: { word: 'You jump', sentence: 'You jump', image: 'images/verbs/v27_you_jump_final_v10_1773751320000_1318_1773742386779.png' }
    },
    batches: [
      ['v_i_work', 'v_she_cleans', 'v_they_travel', 'v_he_drives', 'v_we_swim'],
      ['v_you_dance', 'v_it_crawls', 'v_i_think', 'v_she_draws', 'v_they_shout'],
      ['v_he_cries', 'v_we_wait', 'v_you_buy', 'v_it_grows', 'v_i_help'],
      ['v_he_opens', 'v_we_close', 'v_you_jump', 'v_he_carries', 'v_they_are_happy']
    ],
    transitions: [
      { icon: '🚗', title: 'Devam edelim!', subtitle: 'Yeni fiiller öğreniyorsun.', next: 'Set 2' },
      { icon: '📈', title: 'İlerleme harika!', subtitle: 'Kelimeler hafızana kazınıyor.', next: 'Set 3' },
      { icon: '🥇', title: 'Bayağı yol aldık!', subtitle: 'Neredeyse bitti!', next: 'Son Set' }
    ],
    wordPrompts: ['Which sentence matches?', 'Choose the action', 'What are they doing?'],
    speakPrompts: ['Read the sentence', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].sentence}"`
    ]
  },
  28: {
    isReview: true,
    title: 'Phase 4 Özeti',
    chapters: [22, 23, 24, 25, 26, 27],
    get allReviewItems() {
      const items = {};
      [22, 23, 24, 25, 26, 27].forEach(chId => {
        const chData = window.CHAPTER_DATA[chId];
        if (chData && chData.items) {
          Object.entries(chData.items).forEach(([key, val]) => {
            items[`ch${chId}_${key}`] = { ...val, sourceChapter: chId, originalKey: key };
          });
        }
      });
      // ALSO include Chapter 5 for the Wardrobe Scene targets
      const ch5 = window.CHAPTER_DATA[5];
      if (ch5 && ch5.items) {
        Object.entries(ch5.items).forEach(([key, val]) => {
          items[`ch5_${key}`] = { ...val, sourceChapter: 5, originalKey: key };
        });
      }
      return items;
    },
    transitions: [
      { icon: '🏁', title: 'Phase 4 Tamamlandı!', subtitle: 'Harika bir ilerleme kaydettin.', next: 'Bitir' }
    ],
    wordPrompts: ['Which sentence matches?', 'Choose the action', 'What are they doing?'],
    speakPrompts: ['Read the sentence', 'Say it clearly'],
    imgPrompts: [
      (k, S) => `Which image matches: "${window.CHAPTER_DATA[S.chapterId].items[k].sentence || window.CHAPTER_DATA[S.chapterId].items[k].word}"`
    ],
    get items() { return this.allReviewItems; }
  },
  29: {
    isRepeatMode: true,
    items: {
      hello: { word: 'Hello!', sentence: 'Hello!', image: 'images/dialogue/ch29_hello_comic_3d_v1_1773671042123_1773672305146.png' },
      hi: { word: 'Hi!', sentence: 'Hi!', image: 'images/dialogue/ch29_hi_comic_3d_v1_1773671042123_1773672320345.png' },
      how_are_you: { word: 'How are you?', sentence: 'How are you?', image: 'images/dialogue/ch29_how_are_you_comic_v1_1773682243123_1773683477254.png' },
      whats_up: { word: 'What\'s up?', sentence: 'What\'s up?', image: 'images/dialogue/ch29_whats_up_comic_v1_1773682243123_1773683491833.png' },
      im_fine: { word: 'I\'m fine.', sentence: 'I\'m fine.', image: 'images/dialogue/ch29_im_fine_comic_v1_1773682243123_1773683508849.png' },
      fine: { word: 'Fine.', sentence: 'Fine.', image: 'images/dialogue/ch29_fine_comic_v1_1773763831326.png' },
      great: { word: 'Great!', sentence: 'Great!', image: 'images/dialogue/ch29_great_comic_v1_1773682243123_1773683523014.png' },
      im_good_and_you: { word: 'I\'m good and you?', sentence: 'I\'m good and you?', image: 'images/dialogue/ch29_good_and_you_comic_v1_1773763851349.png' },
      im_good_how_about_you: { word: 'I\'m good and how about you?', sentence: 'I\'m good and how about you?', image: 'images/dialogue/ch29_good_how_about_you_comic_v1_1773763869616.png' }
    },
    batches: [
      ['hello', 'hi', 'how_are_you'],
      ['im_fine', 'fine', 'great'],
      ['whats_up', 'im_good_and_you', 'im_good_how_about_you']
    ],
    transitions: [
      { icon: '👋', title: 'Selamlaşmalar!', subtitle: 'Temel nezaket kurallarını öğrendin.', next: 'Set 2' },
      { icon: '😊', title: 'Nasılsın?', subtitle: 'Duygularını ifade etmeye başladın.', next: 'Set 3' },
      { icon: '📈', title: 'Harika!', subtitle: 'Diyalog kurabiliyorsun.', next: 'Kapanış' }
    ],
    speakPrompts: ['Speak the dialogue', 'Say it naturally']
  },
  30: {
    isRepeatMode: true,
    items: {
      eleven: { word: 'Eleven', sentence: 'Eleven', image: 'images/numbers/ch30_num_11_v2_1773724155000_1773724215553.png' },
      twelve: { word: 'Twelve', sentence: 'Twelve', image: 'images/numbers/ch30_num_12_v2_1773724155000_1773724231695.png' },
      thirteen: { word: 'Thirteen', sentence: 'Thirteen', image: 'images/numbers/ch30_num_13_v2_1773724155000_1773724246024.png' },
      fourteen: { word: 'Fourteen', sentence: 'Fourteen', image: 'images/numbers/ch30_num_14_v2_1773724155000_1773724260935.png' },
      fifteen: { word: 'Fifteen', sentence: 'Fifteen', image: 'images/numbers/ch30_num_15_v2_1773724155000_1773724275428.png' },
      sixteen: { word: 'Sixteen', sentence: 'Sixteen', image: 'images/numbers/ch30_num_16_v2_1773724155000_1773724291226.png' },
      seventeen: { word: 'Seventeen', sentence: 'Seventeen', image: 'images/numbers/ch30_num_17_v2_1773724155000_1773724308206.png' },
      eighteen: { word: 'Eighteen', sentence: 'Eighteen', image: 'images/numbers/ch30_num_18_v2_1773724155000_1773724324933.png' },
      nineteen: { word: 'Nineteen', sentence: 'Nineteen', image: 'images/numbers/ch30_num_19_v2_1773724155000_1773724380818.png' },
      twenty: { word: 'Twenty', sentence: 'Twenty', image: 'images/numbers/ch30_num_20_v2_1773724155000_1773724394109.png' }
    },
    batches: [
      ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'],
      ['sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
    ],
    transitions: [
      { icon: '🔢', title: 'Sayılar devam ediyor!', subtitle: '11\'den 15\'e kadar öğrendin.', next: 'Set 2' },
      { icon: '🎯', title: 'Harika!', subtitle: '20\'ye kadar sayabiliyorsun.', next: 'Kapanış' }
    ],
    wordPrompts: ['Which number is this?', 'Select the number'],
    speakPrompts: ['Pronounce the number', 'Say it clearly']
  },
  31: {
    isRepeatMode: true,
    items: {
      twenty: { word: 'Twenty', sentence: 'Twenty', image: 'images/numbers/ch30_num_20_v2_1773724155000_1773724394109.png' },
      thirty: { word: 'Thirty', sentence: 'Thirty', image: 'images/numbers/ch31_num_30_v2_1773724155000_1773724406887.png' },
      forty: { word: 'Forty', sentence: 'Forty', image: 'images/numbers/ch31_num_40_v2_1773724155000_1773724420861.png' },
      fifty: { word: 'Fifty', sentence: 'Fifty', image: 'images/numbers/ch31_num_50_v2_1773724155000_1773724436705.png' },
      sixty: { word: 'Sixty', sentence: 'Sixty', image: 'images/numbers/ch31_num_60_v1_1773724155000_1773724450331.png' },
      seventy: { word: 'Seventy', sentence: 'Seventy', image: 'images/numbers/ch31_num_70_v1_1773724155000_1773724461559.png' },
      eighty: { word: 'Eighty', sentence: 'Eighty', image: 'images/numbers/ch31_num_80_v1_1773724155000_1773724475514.png' },
      ninety: { word: 'Ninety', sentence: 'Ninety', image: 'images/numbers/ch31_num_90_v1_1773724155000_1773724539891.png' },
      hundred: { word: 'One hundred', sentence: 'One hundred', image: 'images/numbers/ch31_num_100_final_v9_1773750840000_1317_1773742258174.png' },
      thousand: { word: 'One thousand', sentence: 'One thousand', image: 'images/numbers/ch31_num_1000_final_v9_1773750840000_1317_1773742277417.png' }
    },
    batches: [
      ['twenty', 'thirty', 'forty', 'fifty'],
      ['sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand']
    ],
    transitions: [
      { icon: '🔢', title: 'Büyük Sayılar!', subtitle: '10\'ar 10\'ar saymayı öğreniyoruz.', next: 'Set 2' },
      { icon: '💯', title: '1000\'e Ulaştın!', subtitle: 'Tüm sayıları artık biliyorsun!', next: 'Kapanış' }
    ],
    wordPrompts: ['Which number is this?', 'Select the number'],
    speakPrompts: ['Pronounce the number', 'Say it clearly']
  },
  32: {
    isRepeatMode: true,
    items: {
      where_from: { word: 'Where are you from?', sentence: 'Where are you from?', image: 'images/dialogue/v32_where_from_final_v11_1773751800000_1319_1773742464869.png' },
      im_from_turkey: { word: 'I am from Turkey.', sentence: 'I am from Turkey.', image: 'images/dialogue/v32_turkey_final_v11_1773751800000_1319_1773742480793.png' },
      how_old: { word: 'How old are you?', sentence: 'How old are you?', image: 'images/dialogue/v32_how_old_final_v12_1773752100000_1320_1773742520196.png' },
      im_thirty: { word: 'I am thirty years old.', sentence: 'I am thirty years old.', image: 'images/dialogue/v32_age_final_v12_1773752100000_1320_1773742534825.png' }
    },
    batches: [
      ['where_from', 'im_from_turkey', 'how_old', 'im_thirty']
    ],
    transitions: [
      { icon: '🌍', title: 'Harika Diyalog!', subtitle: 'Artık kendini tanıtabiliyorsun.', next: 'Kapanış' }
    ],
    wordPrompts: ['Answer the question', 'Choose the dialogue'],
    speakPrompts: ['Give an answer', 'Say it naturally']
  },
  33: {
    isQAMode: true,
    items: {
      where_is_father: { word: 'Where is your father?', sentence: 'My father is at work.', image: 'images/dialogue/ch33_father_work.png' },
      where_is_he: { word: 'Where is he from?', sentence: 'He is from Italy.', image: 'images/dialogue/ch33_he_italy.png' },
      what_is_his_name: { word: 'What is his name?', sentence: 'His name is Leo.', image: 'images/dialogue/ch33_name_leo.png' },
      how_old_is_he: { word: 'How old is he?', sentence: 'He is ten years old.', image: 'images/dialogue/ch33_age_ten.png' },
      where_is_she: { word: 'Where is she from?', sentence: 'She is from Spain.', image: 'images/dialogue/ch33_she_spain.png' },
      what_is_her_name: { word: 'What is her name?', sentence: 'Her name is Mia.', image: 'images/dialogue/ch33_name_mia.png' },
      is_he_doctor: { word: 'Is he a doctor?', sentence: 'Yes, he is.', image: 'images/dialogue/ch33_he_doctor.png' },
      is_she_teacher: { word: 'Is she a teacher?', sentence: 'No, she is a student.', image: 'images/dialogue/ch33_she_student.png' }
    },
    batches: [
      ['where_is_father', 'where_is_he', 'what_is_his_name', 'how_old_is_he'],
      ['where_is_she', 'what_is_her_name', 'is_he_doctor', 'is_she_teacher']
    ],
    transitions: [
      { icon: '👨‍👩‍👧‍👦', title: 'Aile ve Kişiler!', subtitle: 'Harika gidiyorsun.', next: 'Daha fazla soru' }
    ],
    wordPrompts: ['Look at the image', 'Match Q&A'],
    speakPrompts: ['Ask the question', 'Give the answer']
  },
  34: {
    isQAMode: true,
    items: {
      what_is_this: { word: 'What is this?', sentence: 'This is a smartphone.', image: 'images/dialogue/ch34_this_phone.png' },
      what_is_that: { word: 'What is that?', sentence: 'That is a blue car.', image: 'images/dialogue/ch34_that_car.png' },
      whose_bag: { word: 'Whose bag is this?', sentence: 'This is my bag.', image: 'images/dialogue/ch34_my_bag.png' },
      whose_cat: { word: 'Whose cat is this?', sentence: 'This is her cat.', image: 'images/custom/ch34_her_cat.png' },
      are_they_happy: { word: 'Are they happy?', sentence: 'Yes, they are.', image: 'images/custom/ch34_they_happy.png' },
      is_it_big: { word: 'Is it big?', sentence: 'No, it is small.', image: 'images/custom/ch34_it_small.png' },
      are_you_hungry: { word: 'Are you hungry?', sentence: 'Yes, I am.', image: 'images/custom/ch34_i_hungry.png' },
      who_is_he: { word: 'Who is he?', sentence: 'He is my brother.', image: 'images/custom/ch34_he_brother.png' }
    },
    batches: [
      ['what_is_this', 'what_is_that', 'whose_bag', 'whose_cat'],
      ['are_they_happy', 'is_it_big', 'are_you_hungry', 'who_is_he']
    ],
    transitions: [
      { icon: '❓', title: 'Nesne ve Aidiyet!', subtitle: 'Soruları çok iyi çözdün.', next: 'Grup 2' }
    ],
    wordPrompts: ['Which is the correct answer?', 'Complete the matching'],
    speakPrompts: ['Natural speech', 'Ask and answer']
  },
  35: {
    isReview: true,
    get allReviewItems() {
      const items = {};
      for (let ch = 29; ch <= 34; ch++) {
        const chData = window.CHAPTER_DATA[ch];
        if (chData && chData.items) {
          Object.entries(chData.items).forEach(([key, val]) => {
            items[`ch${ch}_${key}`] = { ...val, sourceChapter: ch, originalKey: key };
          });
        }
      }
      return items;
    },
    get items() { return this.allReviewItems; },
    transitions: [
      { icon: '🏆', title: 'Phase 5 Tamamlandı!', subtitle: 'Harika bir tekrar yaptın.', next: 'Phase 6' }
    ],
    wordPrompts: ['Review time!', 'Pick the correct one'],
    speakPrompts: ['Say it loud!', 'Practice makes perfect']
  },
  36: {
    items: {
      adj_big: { word: 'Big', sentence: 'The elephant is big.', image: 'images/dialogue/ch36_big_elephant.png' },
      adj_small: { word: 'Small', sentence: 'The mouse is small.', image: 'images/custom/ch36_mouse_small_1773914273209.png' },
      adj_good: { word: 'Good', sentence: 'This is good.', image: 'images/custom/ch36_good_final.png' },
      adj_bad: { word: 'Bad', sentence: 'This is bad.', image: 'images/custom/ch36_bad_final.png' },
      adj_happy: { word: 'Happy', sentence: 'I am happy.', image: 'images/custom/ch36_happy.png' },
      adj_sad: { word: 'Sad', sentence: 'I am sad.', image: 'images/custom/ch36_sad.png' },
      adj_fast: { word: 'Fast', sentence: 'This car is fast.', image: 'images/custom/ch36_fast.png' },
      adj_slow: { word: 'Slow', sentence: 'This turtle is slow.', image: 'images/custom/ch36_slow.png' }
    },
    batches: [
      ['adj_big', 'adj_small', 'adj_good', 'adj_bad'],
      ['adj_happy', 'adj_sad', 'adj_fast', 'adj_slow']
    ],
    transitions: [
      { icon: '📏', title: 'Boyutlar ve Durumlar!', subtitle: 'Sıfatları öğreniyoruz.', next: 'Duygular ve Hız' }
    ],
    wordPrompts: ['Sıfatı seç', 'Describe it'],
    speakPrompts: ['Telaffuz et']
  },
  37: {
    items: {
      adj_hot: { word: 'Hot', sentence: 'The sun is hot.', image: 'images/custom/ch37_hot_sun_1773914288948.png' },
      adj_cold: { word: 'Cold', sentence: 'The ice is cold.', image: 'images/custom/ch37_cold_ice_1773914302369.png' },
      adj_old: { word: 'Old', sentence: 'He is old.', image: 'images/custom/ch37_old_man_1773914323552.png' },
      adj_young: { word: 'Young', sentence: 'She is young.', image: 'images/custom/ch37_young_girl_1773914336451.png' },
      adj_beautiful: { word: 'Beautiful', sentence: 'The flower is beautiful.', image: 'images/custom/ch37_beautiful_flower_1773914350114.png' },
      adj_ugly: { word: 'Ugly', sentence: 'The monster is ugly.', image: 'images/custom/ch37_ugly_monster_1773914364565.png' },
      adj_cheap: { word: 'Cheap', sentence: 'It is cheap.', emoji: '🪙' },
      adj_expensive: { word: 'Expensive', sentence: 'It is expensive.', image: 'images/custom/ch37_diamond_1773914379175.png' }
    },
    batches: [
      ['adj_hot', 'adj_cold', 'adj_old', 'adj_young'],
      ['adj_beautiful', 'adj_ugly', 'adj_cheap', 'adj_expensive']
    ],
    transitions: [
      { icon: '⚖️', title: 'Zıt Kavramlar!', subtitle: 'Çok iyi bir başlangıç.', next: 'Güzellik ve Değer' }
    ],
    wordPrompts: ['What is this?', 'Select the correct adjective'],
    speakPrompts: ['']
  },
  38: {
    items: {
      day_mon: { word: 'Monday', sentence: 'Today is Monday.', isCalendar: true, dayIndex: 0 },
      day_tue: { word: 'Tuesday', sentence: 'Today is Tuesday.', isCalendar: true, dayIndex: 1 },
      day_wed: { word: 'Wednesday', sentence: 'Today is Wednesday.', isCalendar: true, dayIndex: 2 },
      day_thu: { word: 'Thursday', sentence: 'Today is Thursday.', isCalendar: true, dayIndex: 3 },
      day_fri: { word: 'Friday', sentence: 'Today is Friday.', isCalendar: true, dayIndex: 4 },
      day_sat: { word: 'Saturday', sentence: 'Today is Saturday.', isCalendar: true, dayIndex: 5 },
      day_sun: { word: 'Sunday', sentence: 'Today is Sunday.', isCalendar: true, dayIndex: 6 }
    },
    batches: [
      ['day_mon', 'day_tue', 'day_wed', 'day_thu'],
      ['day_fri', 'day_sat', 'day_sun']
    ],
    transitions: [
      { icon: '📅', title: 'Hafta içi bitti!', subtitle: 'Hafta sonuna geçiyoruz.', next: 'Hafta Sonu' }
    ],
    wordPrompts: ['Select the day', 'What day is it?'],
    speakPrompts: ['Say the day']
  },
  39: {
    items: {
      mon_jan: { word: 'January', sentence: 'It is January.', isMonth: true, turkishName: 'Ocak', monthIndex: 0 },
      mon_feb: { word: 'February', sentence: 'It is February.', isMonth: true, turkishName: 'Şubat', monthIndex: 1 },
      mon_mar: { word: 'March', sentence: 'It is March.', isMonth: true, turkishName: 'Mart', monthIndex: 2 },
      mon_apr: { word: 'April', sentence: 'It is April.', isMonth: true, turkishName: 'Nisan', monthIndex: 3 },
      mon_may: { word: 'May', sentence: 'It is May.', isMonth: true, turkishName: 'Mayıs', monthIndex: 4 },
      mon_jun: { word: 'June', sentence: 'It is June.', isMonth: true, turkishName: 'Haziran', monthIndex: 5 },
      mon_jul: { word: 'July', sentence: 'It is July.', isMonth: true, turkishName: 'Temmuz', monthIndex: 6 },
      mon_aug: { word: 'August', sentence: 'It is August.', isMonth: true, turkishName: 'Ağustos', monthIndex: 7 },
      mon_sep: { word: 'September', sentence: 'It is September.', isMonth: true, turkishName: 'Eylül', monthIndex: 8 },
      mon_oct: { word: 'October', sentence: 'It is October.', isMonth: true, turkishName: 'Ekim', monthIndex: 9 },
      mon_nov: { word: 'November', sentence: 'It is November.', isMonth: true, turkishName: 'Kasım', monthIndex: 10 },
      mon_dec: { word: 'December', sentence: 'It is December.', isMonth: true, turkishName: 'Aralık', monthIndex: 11 }
    },
    batches: [
      ['mon_jan', 'mon_feb', 'mon_mar', 'mon_apr'],
      ['mon_may', 'mon_jun', 'mon_jul', 'mon_aug'],
      ['mon_sep', 'mon_oct', 'mon_nov', 'mon_dec']
    ],
    transitions: [
      { icon: '❄️', title: 'Yılın İlk Ayları!', subtitle: 'Kış ve Bahar bitti.', next: 'Yaz Ayları' },
      { icon: '☀️', title: 'Yaz Bitti!', subtitle: 'Okul zamanı yaklaşıyor.', next: 'Sonbahar ve Kış' }
    ],
    wordPrompts: ['Select the month', 'Which month?'],
    speakPrompts: ['Say the month', 'Can you name it?']
  },
  40: {
    isQAMode: true,
    items: {
      qa_is_it_big: { word: 'Is it big?', sentence: 'Yes, it is very big.', image: 'images/dialogue/ch36_big_elephant.png' },
      qa_how_is_it: { word: 'How is the weather?', sentence: 'It is very hot.', image: 'images/custom/ch40_hot_weather_1773914402331.png' },
      qa_is_he_happy: { word: 'Is he happy?', sentence: 'No, he is sad.', image: 'images/custom/ch40_sad_man_1773914414702.png' },
      qa_is_it_cheap: { word: 'Is it cheap?', sentence: 'No, it is expensive.', image: 'images/custom/ch37_diamond_1773914379175.png' },
      qa_is_she_young: { word: 'Is she young?', sentence: 'Yes, she is young.', image: 'images/custom/ch37_young_girl_1773914336451.png' }
    },
    batches: [
      ['qa_is_it_big', 'qa_how_is_it', 'qa_is_he_happy', 'qa_is_it_cheap', 'qa_is_she_young']
    ],
    wordPrompts: ['Match Q&A', 'Find the correct answer'],
    speakPrompts: ['']
  },
  41: {
    isQAMode: true,
    items: {
      qa_what_day: { word: 'What day is it today?', sentence: 'Today is Friday.', isCalendar: true, dayIndex: 4 },
      qa_what_month: { word: 'What month is it?', sentence: 'It is October.', isMonth: true, monthIndex: 9 },
      qa_when_birthday: { word: 'When is your birthday?', sentence: 'My birthday is in June.', image: 'images/custom/ch41_birthday_party_1773914427771.png' },
      qa_is_it_mon: { word: 'Is it Monday?', sentence: 'No, it is Tuesday.', isCalendar: true, dayIndex: 1 },
      qa_is_it_jan: { word: 'Is it January?', sentence: 'No, it is February.', isMonth: true, monthIndex: 1 }
    },
    batches: [
      ['qa_what_day', 'qa_what_month', 'qa_when_birthday', 'qa_is_it_mon', 'qa_is_it_jan']
    ],
    wordPrompts: ['Match Q&A', 'Comprehensive matching section'],
    speakPrompts: ['Practice QA']
  },
  42: {
    isReview: true,
    get allReviewItems() {
      const items = {};
      for (let ch = 36; ch <= 41; ch++) {
        const data = window.CHAPTER_DATA[ch];
        if (data && data.items) {
          Object.keys(data.items).forEach(k => {
            items[k] = { ...data.items[k], sourceChapter: ch };
          });
        }
      }
      return items;
    },
    get items() { return this.allReviewItems; },
    transitions: [
      { icon: '🏆', title: 'Phase 6 Tamamlandı!', subtitle: 'Muazzam bir ilerleme kaydettin.', next: 'Phase 7' }
    ],
    wordPrompts: ['Phase 6 Summary', 'Grand Review'],
    speakPrompts: ['Grand Review']
  },
  43: {
    items: {
      act_run: { word: 'Run', sentence: 'I can run fast.', image: 'images/custom/ch43_run.png' },
      act_jump: { word: 'Jump', sentence: 'He can jump high.', image: 'images/custom/ch43_jump.png' },
      act_eat: { word: 'Eat', sentence: 'I eat an apple.', image: 'images/verbs/v26_i_eat_dinner_premium_v1_1773764012055.png' },
      act_drink: { word: 'Drink', sentence: 'She drinks water.', image: 'images/verbs/v26_we_drink_premium_v1_1773763961236.png' },
      act_sleep: { word: 'Sleep', sentence: 'The baby is sleeping.', image: 'images/verbs/v26_you_sleep_premium_v1_1773763978953.png' },
      act_walk: { word: 'Walk', sentence: 'We walk in the park.', image: 'images/verbs/v26_she_walks_premium_v1_1773763897147.png' },
      act_read: { word: 'Read', sentence: 'I read a book.', image: 'images/verbs/v26_she_reads_premium_v1_1773764368196.png' },
      act_write: { word: 'Write', sentence: 'Write your name.', image: 'images/verbs/v26_he_writes_premium_v1_1773764051303.png' }
    },
    batches: [
      ['act_run', 'act_jump', 'act_eat', 'act_drink'],
      ['act_sleep', 'act_walk', 'act_read', 'act_write']
    ],
    transitions: [
      { icon: '🏃', title: 'Hızlı Hareketler!', subtitle: 'Fiilleri öğrenmeye başladın.', next: 'Günlük Eylemler' }
    ],
    wordPrompts: ['Choose the action', 'Action Time!'],
    speakPrompts: ['Say the action']
  },
  44: {
    items: {
      prep_in: { word: 'In', sentence: 'The cat is in the box.', image: 'images/custom/ch44_in.png' },
      prep_on: { word: 'On', sentence: 'The book is on the table.', image: 'images/custom/ch44_on_v2.png' },
      prep_under: { word: 'Under', sentence: 'The ball is under the chair.', image: 'images/custom/ch44_under.png' },
      prep_next_to: { word: 'Next to', sentence: 'The dog is next to the tree.', image: 'images/custom/ch44_next_to.png' },
      prep_between: { word: 'Between', sentence: 'The girl is between the boxes.', image: 'images/custom/ch44_between.png' },
      prep_behind: { word: 'Behind', sentence: 'He is behind the door.', image: 'images/custom/ch44_behind.png' }
    },
    batches: [
      ['prep_in', 'prep_on', 'prep_under'],
      ['prep_next_to', 'prep_between', 'prep_behind']
    ],
    transitions: [
      { icon: '📍', title: 'Yerleri Öğrendin!', subtitle: 'Edatları tanıyorsun artık.', next: 'Hava Durumu' }
    ],
    wordPrompts: ['Where is it?', 'Choose the position'],
    speakPrompts: ['Say the position']
  },
  45: {
    items: {
      weath_rainy: { word: 'Rainy', sentence: 'It is rainy today.', image: 'images/custom/ch45_rainy.png' },
      weath_sunny: { word: 'Sunny', sentence: 'It is sunny and hot.', image: 'images/custom/ch45_sunny.png' },
      weath_snowy: { word: 'Snowy', sentence: 'It is snowy and cold.', image: 'images/custom/ch45_snowy.png' },
      weath_windy: { word: 'Windy', sentence: 'It is a windy day.', image: 'images/custom/ch45_windy.png' },
      weath_cloudy: { word: 'Cloudy', sentence: 'It is cloudy today.', image: 'images/custom/ch45_cloudy.png' },
      weath_stormy: { word: 'Stormy', sentence: 'It is stormy tonight.', image: 'images/custom/ch45_stormy.png' }
    },
    batches: [
      ['weath_rainy', 'weath_sunny', 'weath_snowy'],
      ['weath_windy', 'weath_cloudy', 'weath_stormy']
    ],
    transitions: [
      { icon: '☁️', title: 'Hava Durumu!', subtitle: 'Hava durumlarını öğrendin.', next: 'Duygular' }
    ],
    wordPrompts: ['How is the weather?', 'Select the weather'],
    speakPrompts: ['Say the weather']
  },
  46: {
    items: {
      emo_angry: { word: 'Angry', sentence: 'He is very angry.', image: 'images/custom/ch46_angry.png' },
      emo_tired: { word: 'Tired', sentence: 'I am so tired.', image: 'images/custom/ch46_tired.png' },
      emo_bored: { word: 'Bored', sentence: 'She is bored.', image: 'images/custom/ch46_bored.png' },
      emo_surprised: { word: 'Surprised', sentence: 'He is surprised.', image: 'images/custom/ch46_surprised.png' },
      emo_scared: { word: 'Scared', sentence: 'The boy is scared.', image: 'images/custom/ch46_scared.png' },
      emo_excited: { word: 'Excited', sentence: 'We are excited.', image: 'images/custom/ch46_excited.png' }
    },
    batches: [['emo_angry', 'emo_tired', 'emo_bored'], ['emo_surprised', 'emo_scared', 'emo_excited']],
    transitions: [{ icon: '😡', title: 'Duygular!', subtitle: 'Duyguları öğrenmeye devam.', next: 'Doğa' }],
    wordPrompts: ['How do they feel?', 'Choose the emotion'],
    speakPrompts: ['Say the emotion']
  },
  47: {
    items: {
      nat_river: { word: 'River', sentence: 'The river is long.', image: 'images/custom/ch47_river.png' },
      nat_mountain: { word: 'Mountain', sentence: 'The mountain is high.', image: 'images/custom/ch47_mountain.png' },
      nat_forest: { word: 'Forest', sentence: 'The forest is green.', image: 'images/custom/ch47_forest.png' },
      nat_lake: { word: 'Lake', sentence: 'The lake is beautiful.', image: 'images/custom/ch47_lake.png' },
      nat_island: { word: 'Island', sentence: 'It is a small island.', image: 'images/custom/ch47_island.png' },
      nat_sea: { word: 'Sea', sentence: 'The sea is blue.', image: 'images/custom/ch47_sea.png' }
    },
    batches: [['nat_river', 'nat_mountain', 'nat_forest'], ['nat_lake', 'nat_island', 'nat_sea']],
    transitions: [{ icon: '🌲', title: 'Doğa Gezisi!', subtitle: 'Doğayı tanıdın.', next: 'Phase 7 Quiz' }],
    wordPrompts: ['What is this?', 'Choose the nature element'],
    speakPrompts: ['Say the word']
  },
  48: {
    isQAMode: true,
    items: {
      qa_cat_box: { word: 'Where is the cat?', sentence: 'The cat is in the box.', image: 'images/custom/ch44_in.png' },
      qa_book_table: { word: 'Where is the book?', sentence: 'The book is on the table.', image: 'images/custom/ch44_on_v2.png' },
      qa_weather_sunny: { word: 'How is the weather?', sentence: 'It is sunny and hot.', image: 'images/custom/ch45_sunny.png' },
      qa_weather_rainy: { word: 'Is it snowing?', sentence: 'No, it is rainy today.', image: 'images/custom/ch45_rainy.png' },
      qa_feel_angry: { word: 'How does he feel?', sentence: 'He is angry and tired.', image: 'images/custom/ch46_angry.png' },
      qa_feel_bored: { word: 'Are they bored?', sentence: 'Yes, they are bored.', image: 'images/custom/ch46_bored.png' },
      qa_nat_mountain: { word: 'What is that high place?', sentence: 'It is a high mountain.', image: 'images/custom/ch47_mountain.png' },
      qa_nat_sea: { word: 'Where can you swim?', sentence: 'You can swim in the sea.', image: 'images/custom/ch47_sea.png' },
      qa_act_run: { word: 'What is he doing?', sentence: 'He is running in the park.', image: 'images/custom/ch43_run.png' },
      qa_act_jump: { word: 'Can she jump?', sentence: 'Yes, she can jump high.', image: 'images/custom/ch43_jump.png' }
    },
    batches: [
      ['qa_cat_box', 'qa_book_table', 'qa_weather_sunny', 'qa_weather_rainy'],
      ['qa_feel_angry', 'qa_feel_bored', 'qa_nat_mountain', 'qa_nat_sea'],
      ['qa_act_run', 'qa_act_jump']
    ],
    wordPrompts: ['Answer the questions', 'Practice Q&A'],
    speakPrompts: ['Answer out loud']
  },
  49: {
    isReview: true,
    title: 'Phase 7 Özeti',
    get allReviewItems() {
      const items = {};
      // Collect items from Ch 43 to Ch 48
      for (let ch = 43; ch <= 48; ch++) {
        const data = window.CHAPTER_DATA[ch];
        if (data && data.items) {
          Object.entries(data.items).forEach(([k, v]) => {
            items[`ch${ch}_${k}`] = { ...v, sourceChapter: ch, originalKey: k };
          });
        }
      }
      return items;
    },
    get items() { return this.allReviewItems; },
    transitions: [{ icon: '🏆', title: 'Phase 7 Bitti!', subtitle: 'Süper bir başarı, tebrikler!', next: 'Phase 8' }],
    wordPrompts: ['Phase 7 Mixed Review', 'Pick the correct one'],
    speakPrompts: ['Practice Phase 7 words']
  },
  50: {
    isReview: true,
    title: 'Phase 1-4 Genel Tekrar',
    get allReviewItems() {
      const items = {};
      for (let ch = 1; ch <= 28; ch++) {
        const data = window.CHAPTER_DATA[ch];
        if (data && data.items) {
          Object.entries(data.items).forEach(([k, v]) => {
            items[`ch${ch}_${k}`] = { ...v, sourceChapter: ch, originalKey: k };
          });
        }
      }
      return items;
    },
    get items() { return this.allReviewItems; },
    transitions: [{ icon: '📅', title: 'İlk Dönem Tekrarı Bitti!', subtitle: 'Temelin çok sağlam.', next: 'Phase 8 Devam' }]
  },
  51: {
    isReview: true,
    title: 'Phase 5-7 Genel Tekrar',
    get allReviewItems() {
      const items = {};
      for (let ch = 29; ch <= 49; ch++) {
        const data = window.CHAPTER_DATA[ch];
        if (data && data.items) {
          Object.entries(data.items).forEach(([k, v]) => {
            items[`ch${ch}_${k}`] = { ...v, sourceChapter: ch, originalKey: k };
          });
        }
      }
      return items;
    },
    get items() { return this.allReviewItems; },
    transitions: [{ icon: '📈', title: 'İkinci Dönem Tekrarı Bitti!', subtitle: 'Neredeyse her şeyi tazeledin.', next: 'Master Final' }]
  },
  52: {
    isReview: true,
    title: 'USTALIK SINAVI (1-51)',
    get allReviewItems() {
      const items = {};
      for (let ch = 1; ch <= 51; ch++) {
        const data = window.CHAPTER_DATA[ch];
        if (data && data.items && !data.isReview) { // Only take original items to avoid duplication
          Object.entries(data.items).forEach(([k, v]) => {
            items[`ch${ch}_${k}`] = { ...v, sourceChapter: ch, originalKey: k };
          });
        }
      }
      return items;
    },
    get items() { return this.allReviewItems; },
    transitions: [{ icon: '👑', title: 'BÜYÜK USTALIK!', subtitle: 'Tüm dili görselle fethettin!', next: 'Bitti' }]
  }
};

window.CHAPTERS = [
  { id: 1, emoji: '🎨', name: 'Colors', words: 'Red, Blue, Green + 7 more', locked: false },
  { id: 2, emoji: '🔢', name: 'Numbers', words: '1–10', locked: false },
  { id: 3, emoji: '🍎', name: 'Fruits & Vegetables', words: 'Apple, Banana + 8 more', locked: false },
  { id: 4, emoji: '🐾', name: 'Animals', words: 'Cat, Dog + 8 more', locked: false },
  { id: 5, emoji: '👕', name: 'Clothing', words: 'Shirt, Hat + 8 more', locked: false },
  { id: 6, emoji: '🦵', name: 'Body Parts', words: 'Head, Hand + 8 more', locked: false },
  { id: 7, emoji: '🏆', name: 'Grand Review', words: 'Tüm bölümlerden tekrar', locked: false },
  { id: 8, emoji: '🍔', name: 'Food & Drinks', words: 'Bread, Water, Pizza + 7 more', locked: false },
  { id: 9, emoji: '👨‍👩‍👧‍👦', name: 'Family', words: 'Mother, Father + 5 more', locked: false },
  { id: 10, emoji: '🛏️', name: 'House Items', words: 'Bed, Chair + 8 more', locked: false },
  { id: 11, emoji: '🚗', name: 'Vehicles', words: 'Car, Bus + 8 more', locked: false },
  { id: 12, emoji: '🏫', name: 'Places', words: 'School, Park + 8 more', locked: false },
  { id: 13, emoji: '👮', name: 'Occupations', words: 'Doctor, Teacher + 8 more', locked: false },
  { id: 14, emoji: '🏆', name: 'Grand Review 2', words: 'Tüm bölümlerden tekrar', locked: false },
  { id: 15, emoji: '🗣️', name: 'Basic Sentences', words: 'Cümle tamamlama ve diyaloglar', locked: false },
  { id: 16, emoji: '🗣️', name: 'Repeat After Me', words: 'Yavaş söyle, tekrar et', locked: false },
  { id: 17, emoji: '✏️', name: 'Sentence Builder', words: 'Early words in easy sentences', locked: false },
  { id: 18, emoji: '🦁', name: 'Pet Actions', words: 'Simple sentences with pets', locked: false },
  { id: 19, emoji: '🏠', name: 'Family Life', words: 'Daily life at home', locked: false },
  { id: 20, emoji: '🛋️', name: 'Home Things', words: 'Simple home sentences', locked: false },
  { id: 21, emoji: '🏆', name: 'Grand Review 3', words: '15-20. bölümler özeti', locked: false },
  { id: 22, emoji: '👥', name: 'Pronouns & Possessives', words: 'he, she, it, his, her, their...', locked: false },
  { id: 23, emoji: '🗣️', name: 'Pronouns Only', words: 'he, she, it, they, we, you, I', locked: false },
  { id: 24, emoji: '🔑', name: 'Possessives Only', words: 'my, your, his, her, its, their...', locked: false },
  { id: 25, emoji: '🚗', name: 'Transport Talk', words: 'Vehicle sentences to repeat', locked: false },
  { id: 26, emoji: '🏃', name: 'Daily Verbs 1', words: 'I eat, she walks...', locked: false },
  { id: 27, emoji: '🛠️', name: 'Daily Verbs 2', words: 'I work, she cleans...', locked: false },
  { id: 28, emoji: '🏁', name: 'Phase 4 Özeti', words: '22-27. bölümler özeti', locked: false },
  { id: 29, emoji: '👋', name: 'Selamlaşmalar', words: 'Temel selamlaşma cümleleri', locked: false },
  { id: 30, emoji: '🔢', name: 'Sayılar 11-20', words: '11-20 arası sayılar', locked: false },
  { id: 31, emoji: '🔢', name: 'Sayılar 20-100', words: '10\'ar 10\'ar sayma', locked: false },
  { id: 32, emoji: '🌍', name: 'Tanışma', words: 'Kişisel bilgiler ve diyaloglar', locked: false },
  { id: 33, emoji: '💬', name: 'Sorular ve Cevaplar 1', words: 'Where is he from? What is his name? + 6 more', locked: false },
  { id: 34, emoji: '❓', name: 'Sorular ve Cevaplar 2', words: 'Whose bag is this? Are they happy? + 6 more', locked: false },
  { id: 35, emoji: '🏆', name: 'Phase 5 Tekrar', words: '29-34 arası tüm konular', locked: false },
  { id: 36, emoji: '📏', name: 'Sıfatlar 1', words: 'Big, Small, Good, Bad...', locked: false },
  { id: 37, emoji: '⚖️', name: 'Sıfatlar 2', words: 'Hot, Cold, Old, Young...', locked: false },
  { id: 38, emoji: '📅', name: 'Günler', words: 'Haftanın günleri', locked: false },
  { id: 39, emoji: '🗓️', name: 'Aylar', words: 'Yılın ayları', locked: false },
  { id: 40, emoji: '❓', name: 'Sıfatlar QA', words: 'Sıfatlarla ilgili soru-cevap', locked: false },
  { id: 41, emoji: '🧩', name: 'Zaman QA', words: 'Gün/Ay soru-cevap ve eşleştirme', locked: false },
  { id: 42, emoji: '🏆', name: 'Grand Review 4', words: '36-41 arası tüm konular', locked: false },
  { id: 43, emoji: '🏃', name: 'Eylemler', words: 'Run, Jump, Eat, Sleep...', locked: false },
  { id: 44, emoji: '📍', name: 'Yer-Yön (Edatlar)', words: 'In, On, Under, Next to...', locked: false },
  { id: 45, emoji: '☁️', name: 'Hava Durumu', words: 'Rainy, Sunny, Snowy...', locked: false },
  { id: 46, emoji: '😡', name: 'Duygular 2', words: 'Angry, Tired, Bored...', locked: false },
  { id: 47, emoji: '🌲', name: 'Doğa', words: 'River, Mountain, Forest...', locked: false },
  { id: 48, emoji: '❓', name: 'Phase 7 QA', words: 'Eylemler ve yerler soru-cevap', locked: false },
  { id: 49, emoji: '🏁', name: 'Phase 7 Özeti', words: 'Bölüm 43-48 tekrarı', locked: false },
  { id: 50, emoji: '🔄', name: 'Phase 1-4 Tekrar', words: 'Genel tekrar I', locked: false },
  { id: 51, emoji: '🔄', name: 'Phase 5-7 Tekrar', words: 'Genel tekrar II', locked: false },
  { id: 52, emoji: '👑', name: 'USTALIK SINAVI', words: 'Final Master Review', locked: false }
];

window.REWARDS = [
  {
    id: 'lang_3',
    name: '3 Günlük Dil Paketi',
    desc: 'Seçilen başka bir dilde 3 günlük ilerleme hakkı.',
    price: 25000,
    icon: '🌍'
  },
  {
    id: 'lang_7',
    name: '7 Günlük Dil Paketi',
    desc: 'Seçilen başka bir dilde 7 günlük ilerleme hakkı.',
    price: 50000,
    icon: '🗺️'
  },
  {
    id: 'lang_14',
    name: '14 Günlük Dil Paketi',
    desc: 'Seçilen başka bir dilde 14 günlük ilerleme hakkı.',
    price: 90000,
    icon: '🚀'
  },
  {
    id: 'books_all',
    name: 'İngilizce Kitap Seti',
    desc: '10 farklı seviyede dijital hikaye kitabı koleksiyonu.',
    price: 90000,
    icon: '📚'
  }
];

