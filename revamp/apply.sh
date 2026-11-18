#!/usr/bin/env bash
# Copy the revamped pages and shared files into content/ (the folder Netlify publishes).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
for f in index.html LambdaSim.html art.html CV.html Blogg.html economicOutlook.html hh-site.css hh-site.js logo3-256.png; do
  cp "$ROOT/revamp/$f" "$ROOT/content/$f"
  echo "  content/$f"
done
echo "Done. Review with 'git diff --stat', then commit and push."
