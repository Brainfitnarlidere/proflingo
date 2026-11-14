import re

content_path = '/Users/berkeryildiz/Desktop/lingua-visual/js/content.js'

with open(content_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find each chapter block. We can find lines starting with "  1: {" or "  33: {"
chapters = {}
current_chapter = None
mode = None # "items" or "batches"
chapter_items = set()
chapter_batches = []

lines = text.split('\n')
for line in lines:
    # Match chapter start e.g. "  1: {" or "  42: {"
    ch_match = re.match(r'^\s+(\d+):\s*\{', line)
    if ch_match:
        if current_chapter is not None:
            chapters[current_chapter] = {
                'items': chapter_items,
                'batches': chapter_batches
            }
        current_chapter = int(ch_match.group(1))
        chapter_items = set()
        chapter_batches = []
        mode = None
        # We don't skip the rest of the line, although it's usually just chapter ID
    
    # Detect items start
    if 'items:' in line:
        mode = 'items'
        # Parse potential item keys on the same line
        item_keys = re.findall(r"(\w+)\s*:\s*\{", line.replace('items:', ''))
        for k in item_keys:
            chapter_items.add(k)
        continue
    
    # Detect batches start
    if 'batches:' in line:
        mode = 'batches'
        # Parse potential batch keys on the same line
        batch_keys = re.findall(r"['\"](\w+)['\"]", line)
        if batch_keys:
            chapter_batches.extend(batch_keys)
        continue
    
    # Detect transitions or prompts (end of batches/items)
    if 'transitions:' in line or 'wordPrompts:' in line or 'isReview:' in line:
        mode = None
        continue

    # Parse inside items
    if mode == 'items':
        # E.g. "      red: {" or "      cat: {" or "      ' rosso ': {"
        item_match = re.match(r'^\s*([\'"]?\w+[\'"]?)\s*:\s*\{', line)
        if item_match:
            item_key = item_match.group(1).strip("'\" ")
            chapter_items.add(item_key)
            
    # Parse inside batches
    if mode == 'batches':
        # E.g. "      ['red', 'blue', 'green', 'yellow'],"
        batch_keys = re.findall(r"['\"](\w+)['\"]", line)
        if batch_keys:
            chapter_batches.extend(batch_keys)

# Add the last chapter
if current_chapter is not None:
    chapters[current_chapter] = {
        'items': chapter_items,
        'batches': chapter_batches
    }

print(f"Parsed {len(chapters)} chapters from content.js.")

errors = []
for ch_id, data in chapters.items():
    # Review chapters don't define batches
    if not data['batches'] and ch_id in [7, 14, 21, 28, 35, 42]:
        continue
        
    items = data['items']
    batches = data['batches']
    
    # Find batch items that are not in items
    for b_key in batches:
        if b_key not in items:
            errors.append(f"Chapter {ch_id}: Batch item '{b_key}' is not defined in items.")
            
    # Find items that are not in batches
    for i_key in items:
        if i_key not in batches:
            errors.append(f"Chapter {ch_id}: Item '{i_key}' is defined in items but missing from batches.")

if errors:
    print(f"\nFound {len(errors)} errors:")
    for err in errors:
        print(err)
else:
    print("\nSUCCESS: All chapter batches and items are fully synchronized!")
