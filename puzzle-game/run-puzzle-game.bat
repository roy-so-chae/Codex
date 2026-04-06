@echo off
setlocal
set PORT=8000
set URL=http://127.0.0.1:%PORT%/

cd /d %~dp0

echo Puzzle Game 서버 실행: %URL%
start "" %URL%
python -m http.server %PORT% --bind 127.0.0.1
