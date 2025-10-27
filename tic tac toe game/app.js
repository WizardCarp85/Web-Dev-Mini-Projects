const board = document.querySelectorAll(".cell");
const landingScreen = document.getElementById("landing");
const gameWindow = document.getElementById("gameWindow");
const playerModeBtn = document.getElementById("playerMode");
const computerModeBtn = document.getElementById("computerMode");
const changeModeBtn = document.getElementById("changeModeBtn");
const resultModal = document.getElementById("resultModal");
const resultMessage = document.getElementById("resultMessage");
const playAgainBtn = document.getElementById("playAgainBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let vsComputer = false;

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];


function initializeGame() {
  for (let i = 0; i < board.length; i++) {
    board[i].addEventListener("click", cellClicked);
  }

  playAgainBtn.addEventListener("click", () => {
    resetGame();
    resultModal.classList.remove("show");
  });

  closeModalBtn.addEventListener("click", () => {
    resultModal.classList.remove("show");
    gameWindow.classList.remove("active");
    gameWindow.classList.add("hidden");
    landingScreen.classList.remove("hidden");
  });

  changeModeBtn.addEventListener("click", () => {
    gameWindow.classList.remove("active");
    gameWindow.classList.add("hidden");
    landingScreen.classList.remove("hidden");
    resetGame();
  });

  running = true;
}
playerModeBtn.addEventListener("click", () => {
  vsComputer = false;
  startGame();
});

computerModeBtn.addEventListener("click", () => {
  vsComputer = true;
  startGame();
});

function startGame() {
  landingScreen.classList.add("hidden");
  gameWindow.classList.remove("hidden");
  gameWindow.classList.add("active")
  resetGame();
}

function cellClicked() {
  const index = this.dataset.index;
  if (options[index] !== "" || !running) {
    return;
  }


  updateCell(this, index);

  if (vsComputer && running && currentPlayer === "O") {
    setTimeout(() => {   
      computerMove();
    }, 200);

  }
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.innerText = currentPlayer;
  cell.classList.add(currentPlayer);

  checkWinner();
}

function changePlayer() {
  currentPlayer = (currentPlayer === "X") ? "O" : "X";
}

function checkWinner() {
  let roundWon = false;

  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (options[a] && options[a] === options[b] && options[a] === options[c]) {
      roundWon = true;
      highlightWin(winConditions[i]);
      break;
    }
  }

  if (roundWon) {
    showResultModal(`Player ${currentPlayer} Wins! 🎉`);
    running = false;
  } else if (noEmptyCells()) {
    showResultModal("It's a Draw! 🤝");
    running = false;
  } else {
    changePlayer();
  }
}

function highlightWin(condition) {
  for (let i = 0; i < condition.length; i++) {
    board[condition[i]].classList.add("win");
  }
}

function noEmptyCells() {
  for (let i = 0; i < options.length; i++) {
    if (options[i] === "") return false;
  }
  return true;
}

function resetGame() {
  options = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  running = true;
  for (let i = 0; i < board.length; i++) {
    board[i].innerText = "";
    board[i].className = "cell";
  }
  resultModal.classList.remove("show");
}

function computerMove() {
  if (!running) return;

  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (options[a] === "O" && options[b] === "O" && options[c] === "") {
      return makeMove(c);
    }
    if (options[a] === "O" && options[c] === "O" && options[b] === "") {
      return makeMove(b);
    }
    if (options[b] === "O" && options[c] === "O" && options[a] === "") {
      return makeMove(a);
    }
  }
  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (options[a] === "X" && options[b] === "X" && options[c] === "") {
      return makeMove(c);
    }
    if (options[a] === "X" && options[c] === "X" && options[b] === "") {
      return makeMove(b);
    }
    if (options[b] === "X" && options[c] === "X" && options[a] === "") {
      return makeMove(a);
    }
  }
  let emptyCells = [];
  for (let i = 0; i < options.length; i++) {
    if (options[i] === "") {
      emptyCells.push(i);
    }
  }

  if (emptyCells.length === 0){
    return;
  } 
  let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeMove(randomIndex);
}

function makeMove(index) {
  currentPlayer = "O";
  updateCell(board[index], index);
}

function showResultModal(message) {
  resultMessage.innerText = message;
  resultModal.classList.add("show");
}

initializeGame();
