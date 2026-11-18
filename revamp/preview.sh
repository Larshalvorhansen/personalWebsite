#!/usr/bin/env bash
# Serve content/ with the revamped files layered on top, without touching content/.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
# symlink everything from content/ (fast, no copying of large images)...
for f in "$ROOT/content/"* "$ROOT/content/".[!.]*; do
  [ -e "$f" ] && ln -s "$f" "$TMP/$(basename "$f")"
done
# ...then put the revamped files on top
for f in index.html LambdaSim.html art.html CV.html Blogg.html economicOutlook.html hh-site.css hh-site.js logo3-256.png; do
  rm -f "$TMP/$f"; cp "$ROOT/revamp/$f" "$TMP/$f"
done
echo "Preview: http://localhost:8000  (Ctrl+C to stop)"
cd "$TMP" && python3 -m http.server 8000
