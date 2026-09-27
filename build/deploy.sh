#!/usr/bin/env bash
# Build, verify, and publish out/ to the gh-pages branch (GitHub Pages).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
uv run python build/build.py
node --check build/_app.js
REMOTE="$(git remote get-url origin)"
TMP="$(mktemp -d)"
cp out/index.html out/.nojekyll "$TMP/"
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="Melvern Mogens" -c user.email="melvernmogens@gmail.com" commit -q -m "deploy $(date '+%Y-%m-%d %H:%M')"
git push -q -f "$REMOTE" gh-pages
echo "pushed gh-pages ($(du -h index.html | cut -f1))"
rm -rf "$TMP"
