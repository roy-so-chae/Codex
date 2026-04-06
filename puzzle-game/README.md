# Puzzle Game

10x10 보드에서 영어 단어를 찾는 **영어 단어 맞추기 퍼즐(Word Search)** 프로젝트입니다.

## 실행 파일 다운로드

아래 실행 파일을 내려받아 게임을 실행할 수 있습니다.

- Linux/macOS 실행 파일: [run-puzzle-game.sh 다운로드](./run-puzzle-game.sh)
- Windows 실행 파일: [run-puzzle-game.bat 다운로드](./run-puzzle-game.bat)

## 실행 방법

### 방법 1) 실행 파일로 실행

- **Linux/macOS**
  1. `run-puzzle-game.sh` 다운로드
  2. 터미널에서 실행 권한 부여: `chmod +x run-puzzle-game.sh`
  3. 실행: `./run-puzzle-game.sh`

- **Windows**
  1. `run-puzzle-game.bat` 다운로드
  2. 더블 클릭으로 실행

실행 후 브라우저에서 `http://127.0.0.1:8000` 이 열립니다.

### 방법 2) HTML 직접 실행

1. `puzzle-game` 폴더로 이동
2. `index.html` 파일을 브라우저로 열기

## 게임 방법

1. 격자에서 단어를 이룬다고 생각하는 글자를 순서대로 클릭
2. `단어 확인` 버튼 클릭
3. 정답이면 단어와 경로가 초록색으로 고정
4. 모든 단어를 찾으면 게임 종료

## 기능

- 10x10 영문 퍼즐 보드
- 10개의 영어 단어 자동 배치
- 정/역순 단어 매칭 지원
- 찾아야 할 단어 목록 표시
- 찾은 단어 하이라이트 및 완료 처리
- 타이머, 새 게임, 선택 취소 기능
