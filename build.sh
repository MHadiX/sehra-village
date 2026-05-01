#!/bin/bash
# Netlify build script — generates index.json for each content folder
# Runs automatically on every Netlify deploy (including CMS saves)

echo "Building content indexes..."

for dir in content/news content/gallery content/main-cards content/notifications; do
  mkdir -p "$dir"
  # List .json files excluding index.json itself, sorted newest first
  files=$(find "$dir" -maxdepth 1 \( -name "*.json" -o -name "*.md" \) ! -name "index.json" 2>/dev/null | xargs -I{} basename {} | sort -r | python3 -c "
import sys, json
files = [l.strip() for l in sys.stdin if l.strip()]
print(json.dumps(files))
")
  echo "$files" > "$dir/index.json"
  echo "  $dir: $(echo $files | python3 -c 'import sys,json;print(len(json.loads(sys.stdin.read())))'  ) files"
done

echo "Build complete."
