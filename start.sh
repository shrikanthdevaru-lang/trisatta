#!/bin/bash
# start.sh — Start the Trisattā API server
# Usage: ./start.sh YOUR_GEMINI_API_KEY
# Or:    GEMINI_API_KEY=your_key ./start.sh

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Check for API key
if [ -n "$1" ]; then
  export GEMINI_API_KEY="$1"
fi

if [ -z "$GEMINI_API_KEY" ]; then
  echo ""
  echo "⚠️  GEMINI_API_KEY not set."
  echo "   Get a free key at: https://aistudio.google.com"
  echo "   Then run: ./start.sh YOUR_KEY_HERE"
  echo "   Or:       export GEMINI_API_KEY=your_key && ./start.sh"
  echo ""
  echo "   Continuing without Gemini — analysis will return fallback text."
  echo ""
fi

# Check Python
if ! command -v python3 &>/dev/null; then
  echo "❌ python3 not found. Install Python 3.9+"
  exit 1
fi

# Install / upgrade dependencies
echo "📦 Installing dependencies..."
pip install -q -r requirements.txt

echo ""
echo "═══════════════════════════════════════════════════"
echo "  🔱 TRISATTĀ — Verified Sanskrit Grammar AI"
echo "═══════════════════════════════════════════════════"
echo "  API:      http://localhost:8000"
echo "  Docs:     http://localhost:8000/docs"
echo "  Frontend: open index.html in your browser"
echo "═══════════════════════════════════════════════════"
echo ""

# Start server
uvicorn api:app --reload --host 0.0.0.0 --port 8000
