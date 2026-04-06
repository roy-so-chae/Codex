const SIZE = 10;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const WORDS = [
  "APPLE",
  "ORANGE",
  "BANANA",
  "GRAPE",
  "MELON",
  "PEACH",
  "CHERRY",
  "LEMON",
  "MANGO",
  "BERRY",
];

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [-1, 1],
];

const boardEl = document.getElementById("board");
const foundCountEl = document.getElementById("foundCount");
const totalCountEl = document.getElementById("totalCount");
const timerEl = document.getElementById("timer");
const messageEl = document.getElementById("message");
const selectedWordEl = document.getElementById("selectedWord");
const wordListEl = document.getElementById("wordList");
const checkBtn = document.getElementById("checkBtn");
const newGameBtn = document.getElementById("newGameBtn");
const clearBtn = document.getElementById("clearBtn");

let board = [];
let selectedCells = [];
let foundWords = new Set();
let placedWordCells = new Map();
let seconds = 0;
let timerId = null;
let started = false;

function createEmptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
}

function startNewGame() {
  board = createEmptyBoard();
  selectedCells = [];
  foundWords = new Set();
  placedWordCells = new Map();
  seconds = 0;
  started = false;
  stopTimer();

  placeWords();
  fillRemainingCells();
  renderBoard();
  renderWordList();
  updateStatus();
  selectedWordEl.textContent = "선택한 글자: -";
  messageEl.textContent = "새 게임이 시작되었습니다!";
}

function placeWords() {
  for (const word of WORDS) {
    let placed = false;

    for (let attempt = 0; attempt < 200 && !placed; attempt += 1) {
      const [dr, dc] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const row = Math.floor(Math.random() * SIZE);
      const col = Math.floor(Math.random() * SIZE);

      if (!canPlaceWord(word, row, col, dr, dc)) continue;

      const cells = [];
      for (let i = 0; i < word.length; i += 1) {
        const r = row + dr * i;
        const c = col + dc * i;
        board[r][c] = word[i];
        cells.push(`${r},${c}`);
      }
      placedWordCells.set(word, cells);
      placed = true;
    }

    if (!placed) {
      throw new Error(`단어 배치 실패: ${word}`);
    }
  }
}

function canPlaceWord(word, row, col, dr, dc) {
  const endRow = row + dr * (word.length - 1);
  const endCol = col + dc * (word.length - 1);

  if (endRow < 0 || endRow >= SIZE || endCol < 0 || endCol >= SIZE) {
    return false;
  }

  for (let i = 0; i < word.length; i += 1) {
    const r = row + dr * i;
    const c = col + dc * i;
    const current = board[r][c];
    if (current !== "" && current !== word[i]) {
      return false;
    }
  }
  return true;
}

function fillRemainingCells() {
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col] === "") {
        const randomIndex = Math.floor(Math.random() * ALPHABET.length);
        board[row][col] = ALPHABET[randomIndex];
      }
    }
  }
}

function renderBoard() {
  boardEl.innerHTML = "";

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const btn = document.createElement("button");
      const key = `${row},${col}`;
      btn.type = "button";
      btn.className = "cell";
      btn.dataset.row = String(row);
      btn.dataset.col = String(col);
      btn.dataset.key = key;
      btn.textContent = board[row][col];
      btn.setAttribute("aria-label", `${row + 1}행 ${col + 1}열 ${board[row][col]}`);
      btn.addEventListener("click", () => toggleSelection(row, col));
      boardEl.appendChild(btn);
    }
  }
}

function renderWordList() {
  wordListEl.innerHTML = "";
  totalCountEl.textContent = String(WORDS.length);

  for (const word of WORDS) {
    const li = document.createElement("li");
    li.textContent = word;
    li.id = `word-${word}`;
    if (foundWords.has(word)) li.classList.add("found-word");
    wordListEl.appendChild(li);
  }
}

function toggleSelection(row, col) {
  const key = `${row},${col}`;
  const button = boardEl.querySelector(`[data-key="${key}"]`);

  if (!button || button.classList.contains("found")) return;

  if (!started) {
    started = true;
    startTimer();
  }

  const selectedIndex = selectedCells.indexOf(key);
  if (selectedIndex >= 0) {
    selectedCells.splice(selectedIndex, 1);
    button.classList.remove("selected");
  } else {
    selectedCells.push(key);
    button.classList.add("selected");
  }

  const selectedWord = selectedCells
    .map((cellKey) => {
      const [r, c] = cellKey.split(",").map(Number);
      return board[r][c];
    })
    .join("");

  selectedWordEl.textContent = `선택한 글자: ${selectedWord || "-"}`;
}

function checkSelection() {
  if (selectedCells.length === 0) {
    messageEl.textContent = "먼저 글자를 선택해주세요.";
    return;
  }

  const selectedWord = selectedCells
    .map((cellKey) => {
      const [r, c] = cellKey.split(",").map(Number);
      return board[r][c];
    })
    .join("");

  const reversedWord = selectedWord.split("").reverse().join("");
  const matchedWord = WORDS.find(
    (word) => !foundWords.has(word) && (word === selectedWord || word === reversedWord),
  );

  if (!matchedWord) {
    messageEl.textContent = `❌ "${selectedWord}" 는 목록의 단어가 아니에요.`;
    clearSelection();
    return;
  }

  const answerCells = placedWordCells.get(matchedWord);
  const selectedSet = new Set(selectedCells);
  const answerSet = new Set(answerCells);
  const isExactPath =
    selectedSet.size === answerSet.size && [...answerSet].every((cell) => selectedSet.has(cell));

  if (!isExactPath) {
    messageEl.textContent = `⚠️ ${matchedWord} 단어는 맞지만 선택 경로가 정확하지 않아요.`;
    clearSelection();
    return;
  }

  foundWords.add(matchedWord);
  markFoundCells(answerCells);
  const wordChip = document.getElementById(`word-${matchedWord}`);
  if (wordChip) wordChip.classList.add("found-word");

  updateStatus();
  messageEl.textContent = `✅ ${matchedWord} 발견!`;
  clearSelection();

  if (foundWords.size === WORDS.length) {
    stopTimer();
    messageEl.textContent = `🎉 축하합니다! 모든 단어를 찾았습니다. (${formatTime(seconds)})`;
  }
}

function markFoundCells(cells) {
  for (const key of cells) {
    const button = boardEl.querySelector(`[data-key="${key}"]`);
    if (button) {
      button.classList.remove("selected");
      button.classList.add("found");
    }
  }
}

function clearSelection() {
  for (const key of selectedCells) {
    const button = boardEl.querySelector(`[data-key="${key}"]`);
    if (button) button.classList.remove("selected");
  }
  selectedCells = [];
  selectedWordEl.textContent = "선택한 글자: -";
}

function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    seconds += 1;
    timerEl.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateStatus() {
  foundCountEl.textContent = String(foundWords.size);
  timerEl.textContent = formatTime(seconds);
}

checkBtn.addEventListener("click", checkSelection);
newGameBtn.addEventListener("click", startNewGame);
clearBtn.addEventListener("click", clearSelection);

startNewGame();
