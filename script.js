const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const modeSelect = document.getElementById('mode');
const xWinsText = document.getElementById('xWins');
const oWinsText = document.getElementById('oWins');

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let xWins = 0;
let oWins = 0;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== "" || !gameActive) return;

  makeMove(clickedCell, clickedCellIndex, currentPlayer);

  if (modeSelect.value === "ai" && gameActive && currentPlayer === "O") {
    setTimeout(aiMove, 500); // AI makes a move after 0.5s
  }
}

function makeMove(cell, index, player) {
  gameState[index] = player;
  cell.textContent = player;
  checkResult();
}

function checkResult() {
  let roundWon = false;
  let winningCombo = [];

  for (let i = 0; i < winningConditions.length; i++) {
    const condition = winningConditions[i];
    let a = gameState[condition[0]];
    let b = gameState[condition[1]];
    let c = gameState[condition[2]];

    if (a === '' || b === '' || c === '') continue;
    if (a === b && b === c) {
      roundWon = true;
      winningCombo = condition;
      break;
    }
  }

  if (roundWon) {
    highlightWinningCells(winningCombo);
    statusText.textContent = `${currentPlayer} wins!`;
    updateScore(currentPlayer);
    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusText.textContent = `It's a Draw!`;
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s Turn`;
}

function highlightWinningCells(winningCombo) {
  winningCombo.forEach(index => {
    board.children[index].classList.add('winning-cell');
  });
}

function updateScore(player) {
  if (player === "X") {
    xWins++;
    xWinsText.textContent = xWins;
  } else {
    oWins++;
    oWinsText.textContent = oWins;
  }
}

function resetGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `${currentPlayer}'s Turn`;
  Array.from(board.children).forEach(cell => {
    cell.textContent = "";
    cell.classList.remove('winning-cell');
  });
}

function initializeBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
  statusText.textContent = `${currentPlayer}'s Turn`;
}

function aiMove() {
  const emptyIndices = gameState.map((value, index) => value === "" ? index : null).filter(v => v !== null);
  if (emptyIndices.length === 0) return;

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  const cell = board.children[randomIndex];

  makeMove(cell, randomIndex, "O");
}

resetButton.addEventListener('click', resetGame);
modeSelect.addEventListener('change', resetGame);

initializeBoard();