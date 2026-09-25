#!/bin/bash
# keep_tunnel_alive.sh — Watchdog script for Trisattā tunnel & server
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

while true; do
  # 1. Ensure uvicorn is running on port 8000
  if ! curl --noproxy "*" -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
    echo "[$(date)] Local backend down. Restarting uvicorn..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    GROQ_API_KEY="${GROQ_API_KEY}" .venv/bin/uvicorn api:app --host 0.0.0.0 --port 8000 --timeout-keep-alive 300 > /tmp/uvicorn.log 2>&1 &
    sleep 5
  fi

  # 2. Check if current tunnel URL is alive
  CURRENT_URL=$(grep -oE "https://[a-zA-Z0-9-]+\.trycloudflare\.com" index.html | head -1)
  TUNNEL_OK=false
  if [ -n "$CURRENT_URL" ]; then
    HTTP_CODE=$(curl --noproxy "*" -s -o /dev/null -w "%{http_code}" "$CURRENT_URL/health" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
      TUNNEL_OK=true
    fi
  fi

  # 3. If tunnel is down, restart it and update Netlify
  if [ "$TUNNEL_OK" = false ]; then
    echo "[$(date)] Cloudflare tunnel down ($CURRENT_URL). Restarting..."
    pkill -f "cloudflared tunnel" 2>/dev/null || true
    sleep 2
    ./cloudflared tunnel --url http://127.0.0.1:8000 > /tmp/cf_watchdog.log 2>&1 &
    
    # Wait for new URL
    NEW_URL=""
    for i in {1..20}; do
      sleep 2
      NEW_URL=$(grep -oE "https://[a-zA-Z0-9-]+\.trycloudflare\.com" /tmp/cf_watchdog.log | head -1)
      if [ -n "$NEW_URL" ]; then
        break
      fi
    done

    if [ -n "$NEW_URL" ]; then
      echo "[$(date)] New tunnel established: $NEW_URL"
      # Update index.html and netlify-deploy/index.html
      sed -i '' -E "s|https://[a-zA-Z0-9-]+\.trycloudflare\.com|$NEW_URL|g" index.html
      sed -i '' -E "s|https://[a-zA-Z0-9-]+\.trycloudflare\.com|$NEW_URL|g" netlify-deploy/index.html
      
      echo "[$(date)] Redeploying to Netlify..."
      cd "$DIR/netlify-deploy" && npx netlify-cli deploy --prod --dir . > /tmp/netlify_redeploy.log 2>&1
      echo "[$(date)] Netlify updated with $NEW_URL"
    fi
  fi

  sleep 45
done
