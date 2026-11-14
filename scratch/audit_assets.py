import re
import os

content_path = '/Users/berkeryildiz/Desktop/lingua-visual/js/content.js'
workspace_dir = '/Users/berkeryildiz/Desktop/lingua-visual'

if not os.path.exists(content_path):
    print(f"Error: {content_path} not found.")
    exit(1)

with open(content_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all image paths like 'images/...' or "images/..."
matches = re.findall(r"['\"](images/[^'\"]+)['\"]", content)

unique_matches = sorted(list(set(matches)))
print(f"Found {len(unique_matches)} unique image references in content.js.")

missing_files = []
for rel_path in unique_matches:
    abs_path = os.path.join(workspace_dir, rel_path)
    if not os.path.exists(abs_path):
        missing_files.append(rel_path)

if missing_files:
    print(f"\nCRITICAL: Found {len(missing_files)} missing image files:")
    for f in missing_files:
        print(f" - {f}")
else:
    print("\nSUCCESS: All referenced images exist in the workspace!")
