#!/usr/bin/env bash
# Fetch economicOutlook.html from a previous commit and save as oldEO.html
set -euo pipefail

SRC_FILE="economicOutlook.html"
OUT_FILE="oldEO.html"

# How many commits back to look (default: 1)
COMMITS_BACK="${1:-1}"

# Make sure we're in a git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: not inside a git repository." >&2
  exit 1
fi

# Find the target commit
TARGET_COMMIT="HEAD~${COMMITS_BACK}"

# Verify the file existed at that commit
if ! git cat-file -e "${TARGET_COMMIT}:${SRC_FILE}" 2>/dev/null; then
  echo "Error: '${SRC_FILE}' does not exist at ${TARGET_COMMIT}." >&2
  echo "Looking for the most recent commit that contained it..." >&2

  # Fallback: search history for the last commit that had the file
  FOUND=$(git log --all --pretty=format:%H -n 1 -- "${SRC_FILE}")
  if [[ -z "${FOUND}" ]]; then
    echo "Error: '${SRC_FILE}' was never tracked in this repo." >&2
    exit 1
  fi
  TARGET_COMMIT="${FOUND}"
  echo "Using commit ${TARGET_COMMIT}" >&2
fi

# Extract the file
git show "${TARGET_COMMIT}:${SRC_FILE}" >"${OUT_FILE}"
echo "Wrote ${OUT_FILE} from ${TARGET_COMMIT}:${SRC_FILE}"
