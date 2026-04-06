const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");
const messageEl = document.getElementById("message");
const shuffleBtn = document.getElementById("shuffleBtn");
const resetBtn = document.getElementById("resetBtn");

const SIZE = 4;
const LAST_INDEX = SIZE * SIZE - 1;

let board = [];
let moveCount = 0;
let seconds = 0;
let timerId = null;
let started = false;

function initBoard() {
  board = [...Array(LAST_INDEX).keys()].map((n) => n + 1);
  board.push(0);
  moveCount = 0;
  seconds = 0;
  started = false;
  stopTimer();
  updateStatus();
  messageEl.textContent = "";
  render();
}

function render() {
  boardEl.innerHTML = "";

  board.forEach((value, idx) => {
    const tile = document.createElement("button");
    tile.className = "tile";

    if (value === 0) {
      tile.classList.add("empty");
      tile.disabled = true;
      tile.setAttribute("aria-label", "빈 칸");
    } else {
      tile.textContent = String(value);
      tile.setAttribute("aria-label", `${value} 타일`);
      tile.addEventListener("click", () => moveTile(idx));
    }

    boardEl.appendChild(tile);
  });
}

function moveTile(index) {
  const empty = board.indexOf(0);
  if (!isAdjacent(index, empty)) return;

  [board[index], board[empty]] = [board[empty], board[index]];
  moveCount += 1;

  if (!started) {
    started = true;
    startTimer();
  }

  updateStatus();
  render();

  if (isSolved()) {
    stopTimer();
    messageEl.textContent = `🎉 완료! ${moveCount}번 이동, ${formatTime(seconds)} 소요`;
  }
}

function isAdjacent(a, b) {
  const rowA = Math.floor(a / SIZE);
  const colA = a % SIZE;
  const rowB = Math.floor(b / SIZE);
  const colB = b % SIZE;

  return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
}

function isSolved() {
  for (let i = 0; i < LAST_INDEX; i += 1) {
    if (board[i] !== i + 1) return false;
  }
  return board[LAST_INDEX] === 0;
}

function shuffle() {
  for (let i = 0; i < 200; i += 1) {
    const empty = board.indexOf(0);
    const neighbors = getNeighbors(empty);
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    [board[empty], board[randomNeighbor]] = [board[randomNeighbor], board[empty]];
  }

  moveCount = 0;
  seconds = 0;
  started = false;
  stopTimer();
  messageEl.textContent = "";
  updateStatus();
  render();
}

function getNeighbors(index) {
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  const result = [];

  if (row > 0) result.push(index - SIZE);
  if (row < SIZE - 1) result.push(index + SIZE);
  if (col > 0) result.push(index - 1);
  if (col < SIZE - 1) result.push(index + 1);

  return result;
}

function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    seconds += 1;
    updateStatus();
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
  movesEl.textContent = String(moveCount);
  timerEl.textContent = formatTime(seconds);
}

shuffleBtn.addEventListener("click", shuffle);
resetBtn.addEventListener("click", initBoard);

initBoard();
