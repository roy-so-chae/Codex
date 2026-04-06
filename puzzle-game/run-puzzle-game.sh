#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-8000}"
URL="http://127.0.0.1:${PORT}/"

cd "$SCRIPT_DIR"

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/puzzle-game-server.log 2>&1 &
SERVER_PID=$!

sleep 1

echo "Puzzle Game 서버 실행: $URL"
echo "종료하려면 Ctrl+C를 누르세요."

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 || true
elif command -v open >/dev/null 2>&1; then
  open "$URL" >/dev/null 2>&1 || true
fi

wait "$SERVER_PID"
