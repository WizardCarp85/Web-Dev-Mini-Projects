let numSquares = 6; // default
let colors = [];
let pickedColor;
let score = 0;

const colorDisplay = document.getElementById("colorDisplay");
const squaresContainer = document.getElementById("container");
const messageDisplay = document.getElementById("message");
const resetButton = document.getElementById("reset");
const h1 = document.querySelector("h1");
const scoreDisplay = document.getElementById("score");
const modeButtons = document.querySelectorAll(".mode");

const difficulty = {
  easy: 3,
  medium: 6,
  hard: 9
};

init();

function init() {
  setupSquares();
  setupModeButtons();
  reset();
}

function setupSquares() {
  squaresContainer.innerHTML = ''; // clear old squares
  for (let i = 0; i < difficulty.hard; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.addEventListener("click", function () {
      const clickedColor = this.style.backgroundColor.replace(/\s+/g, '');
      const targetColor = pickedColor.replace(/\s+/g, '');
      if (clickedColor === targetColor) {
        messageDisplay.textContent = "✅ Correct!";
        changeColors(pickedColor);
        h1.style.backgroundColor = pickedColor;
        score++;
        scoreDisplay.textContent = score;
        resetButton.textContent = "Play Again?";
      } else {
        this.style.backgroundColor = "#232323";
        messageDisplay.textContent = "❌ Try Again!";
      }
    });
    squaresContainer.appendChild(square);
  }
}

function setupModeButtons() {
  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      modeButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      numSquares = difficulty[btn.dataset.mode];
      reset();
    });
  });
}

function reset() {
  colors = generateRandomColors(numSquares);
  pickedColor = pickColor();
  colorDisplay.textContent = pickedColor.toUpperCase();

  const squares = document.querySelectorAll(".square");
  squares.forEach((sq, i) => {
    if (colors[i]) {
      sq.style.display = "block";
      sq.style.backgroundColor = colors[i];
      sq.title = colors[i]; // RGB hint tooltip
    } else {
      sq.style.display = "none";
    }
  });

  h1.style.backgroundColor = "steelblue";
  messageDisplay.textContent = "";
  resetButton.textContent = "New Colors";
}

resetButton.addEventListener("click", () => reset());

function changeColors(color) {
  const squares = document.querySelectorAll(".square");
  squares.forEach(sq => (sq.style.backgroundColor = color));
}

function pickColor() {
  const random = Math.floor(Math.random() * colors.length);
  return colors[random];
}

function generateRandomColors(num) {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(randomColor());
  }
  return arr;
}

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}
