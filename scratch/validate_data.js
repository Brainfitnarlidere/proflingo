// Load content.js into global context
global.window = global;
require('../js/content.js');

const chapters = global.CHAPTER_DATA;
console.log("Loaded CHAPTER_DATA from content.js.");
console.log(`Total chapters: ${Object.keys(chapters).length}`);

let errors = [];

for (const [chId, ch] of Object.entries(chapters)) {
  const id = parseInt(chId);
  
  if (ch.isReview) {
    // Review chapters have items as a getter that refers to allReviewItems
    try {
      const items = ch.items;
      if (!items || Object.keys(items).length === 0) {
        errors.push(`Chapter ${id} (Review): No items found.`);
      }
    } catch (e) {
      errors.push(`Chapter ${id} (Review): Error getting items: ${e.message}`);
    }
    continue;
  }

  // Normal chapters
  if (!ch.items) {
    errors.push(`Chapter ${id}: Missing 'items'.`);
    continue;
  }
  if (!ch.batches) {
    errors.push(`Chapter ${id}: Missing 'batches'.`);
    continue;
  }

  const itemKeys = Object.keys(ch.items);
  
  // Check if batches refer to existing items
  let batchKeys = [];
  ch.batches.forEach((batch, bIdx) => {
    if (!Array.isArray(batch)) {
      errors.push(`Chapter ${id}: Batch at index ${bIdx} is not an array.`);
      return;
    }
    batch.forEach(k => {
      batchKeys.push(k);
      if (!ch.items[k]) {
        errors.push(`Chapter ${id}: Batch at index ${bIdx} references missing item key '${k}'.`);
      }
    });
  });

  // Check if all items are included in batches
  itemKeys.forEach(k => {
    if (!batchKeys.includes(k)) {
      errors.push(`Chapter ${id}: Item '${k}' is defined in 'items' but not included in any batch.`);
    }
  });

  // Check transitions length
  if (ch.batches.length > 1) {
    if (!ch.transitions) {
      errors.push(`Chapter ${id}: Multiple batches (${ch.batches.length}) but 'transitions' is missing.`);
    } else if (ch.transitions.length !== ch.batches.length - 1) {
      errors.push(`Chapter ${id}: Has ${ch.batches.length} batches, but transitions count is ${ch.transitions.length} (should be ${ch.batches.length - 1}).`);
    }
  }
}

if (errors.length > 0) {
  console.log(`\nFound ${errors.length} structure errors in content.js:`);
  errors.forEach(e => console.log(` - ${e}`));
} else {
  console.log("\nSUCCESS: All chapter data structures are completely valid!");
}
