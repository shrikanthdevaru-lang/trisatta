#!/usr/bin/env bash
# setup_github.sh — One-shot GitHub push for the trisatta project
#
# Usage:
#   1. Create an empty repo at https://github.com/new
#      Name it: trisatta-hallucination
#      Keep it PUBLIC, no README, no .gitignore
#   2. Run: bash setup_github.sh
#
set -e

REPO_NAME="trisatta-hallucination"
GITHUB_USER="shrikanthdevaru-lang"
REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "========================================================"
echo "  Trisattā — GitHub Push Setup"
echo "========================================================"
echo ""
echo "Remote: ${REMOTE_URL}"
echo ""

# ── Check if remote already exists ───────────────────────────────────────────
if git remote get-url origin &>/dev/null; then
  echo "Remote 'origin' already set: $(git remote get-url origin)"
  echo "To update, run: git remote set-url origin ${REMOTE_URL}"
else
  echo "Adding remote origin..."
  git remote add origin "${REMOTE_URL}"
  echo "Done."
fi

# ── Stage any untracked files ─────────────────────────────────────────────────
echo ""
echo "Staging all project files..."
git add \
  trisatta/ \
  run_demo.py \
  requirements.txt \
  README.md \
  theoretical_contribution.md \
  paper.md \
  trisatta_paper.tex \
  trisatta_refs.bib \
  supervisor_email.md \
  output/confusion_matrix.png \
  output/confusion_matrix.csv \
  output_tqa/confusion_matrix.png \
  output_tqa/confusion_matrix.csv \
  2>/dev/null || true

# ── Commit if there are changes ───────────────────────────────────────────────
if git diff --cached --quiet; then
  echo "Nothing new to commit."
else
  git commit -m "feat: add LaTeX paper, bibliography, and GitHub setup script"
fi

# ── Push ─────────────────────────────────────────────────────────────────────
echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "========================================================"
echo "  SUCCESS! Your repo is live at:"
echo "  https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo "========================================================"
