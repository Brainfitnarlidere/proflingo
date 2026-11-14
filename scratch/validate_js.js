import json
import re

content_path = '/Users/berkeryildiz/Desktop/lingua-visual/js/content.js'

with open(content_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Let's extract the JS object by cleaning up lines and using a simple parser or just reading the structure.
# Since it's in JS format, we can parse it using a small script. Let's write a python script that runs node to load and validate!
# Yes! Running node to evaluate content.js is 100% accurate because it uses the actual JS engine!
# Let's write a node script to validate the data structure of content.js.
