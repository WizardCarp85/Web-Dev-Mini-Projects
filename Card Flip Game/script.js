const symbols = ['💎','🌟','⚡','🔥','🌙','💫'];
let cardsArray = [...symbols, ...symbols];
let flippedCards = [];
let moves = 0;
let matched = 0;
let timer = 0;
let interval;

const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
const newGameBtn = document.getElementById('new-game');

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startGame() {
  clearInterval(interval);
  timer = 0;
  moves = 0;
  matched = 0;
  flippedCards = [];
  cardsArray = shuffle(cardsArray);
  movesDisplay.textContent = `Moves: ${moves}`;
  timeDisplay.textContent = `Time: ${timer}s`;

  gameBoard.innerHTML = '';
  cardsArray.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${symbol}</div>
      </div>`;
    gameBoard.appendChild(card);

    card.addEventListener('click', () => flipCard(card, symbol));
  });

  interval = setInterval(() => {
    timer++;
    timeDisplay.textContent = `Time: ${timer}s`;
  }, 1000);
}

function flipCard(card, symbol) {
  if (flippedCards.length === 2 || card.classList.contains('flip')) return;
  card.classList.add('flip');
  flippedCards.push({ card, symbol });

  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flippedCards;
  if (first.symbol === second.symbol) {
    matched++;
    flippedCards = [];
    if (matched === symbols.length) {
      clearInterval(interval);
      setTimeout(() => alert(`🎉 You won in ${moves} moves and ${timer} seconds!`), 500);
    }
  } else {
    setTimeout(() => {
      first.card.classList.remove('flip');
      second.card.classList.remove('flip');
      flippedCards = [];
    }, 800);
  }
}

newGameBtn.addEventListener('click', startGame);

startGame();
