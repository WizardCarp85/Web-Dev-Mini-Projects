const colors = [
    { name: 'RED', value: '#ef4444' },
    { name: 'BLUE', value: '#3b82f6' },
    { name: 'GREEN', value: '#22c55e' },
    { name: 'YELLOW', value: '#eab308' },
    { name: 'PURPLE', value: '#a855f7' },
    { name: 'ORANGE', value: '#f97316' },
    { name: 'PINK', value: '#ec4899' },
    { name: 'CYAN', value: '#06b6d4' }
];

let score = 0;
let streak = 0;
let bestStreak = 0;
let lives = 3;
let correctAnswers = 0;
let wrongAnswers = 0;
let timerInterval = null;
let timeLeft = 100;
let gameActive = false;
let baseTime = 5000;
let currentTextColor = null;
let currentMode = 'NORMAL'; // NORMAL or CHAOS

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomColors(count = 6) {
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function updateLivesDisplay() {
    const heartsArray = [];
    for (let i = 0; i < lives; i++) {
        heartsArray.push('❤️');
    }
    for (let i = lives; i < 3; i++) {
        heartsArray.push('🖤');
    }
    document.getElementById('lives').textContent = heartsArray.join('');
}

function startRound() {
    if (!gameActive) return;
    
    // Determine mode based on score
    if (score >= 100 && Math.random() > 0.5) {
        currentMode = 'CHAOS';
        document.getElementById('modeIndicator').textContent = '⚡ CHAOS MODE';
        document.getElementById('modeIndicator').style.background = '#ef4444';
        document.getElementById('modeIndicator').style.color = 'white';
    } else {
        currentMode = 'NORMAL';
        document.getElementById('modeIndicator').textContent = 'NORMAL MODE';
        document.getElementById('modeIndicator').style.background = '#fbbf24';
        document.getElementById('modeIndicator').style.color = '#78350f';
    }
    
    // Get random colors for display and text
    currentTextColor = getRandomColor();
    const wordToDisplay = getRandomColor();
    
    // In CHAOS mode, text and color are ALWAYS different
    if (currentMode === 'CHAOS') {
        let differentWord = getRandomColor();
        while (differentWord.name === currentTextColor.name) {
            differentWord = getRandomColor();
        }
        document.getElementById('wordDisplay').textContent = differentWord.name;
    } else {
        document.getElementById('wordDisplay').textContent = wordToDisplay.name;
    }
    
    document.getElementById('wordDisplay').style.color = currentTextColor.value;
    
    // Create buttons
    const buttonOptions = getRandomColors(6);
    if (!buttonOptions.find(c => c.name === currentTextColor.name)) {
        buttonOptions[Math.floor(Math.random() * buttonOptions.length)] = currentTextColor;
    }
    
    const buttonsContainer = document.getElementById('buttons');
    buttonsContainer.innerHTML = '';
    
    buttonOptions.forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';
        btn.textContent = color.name;
        btn.style.background = color.value;
        btn.onclick = () => checkAnswer(color, btn);
        buttonsContainer.appendChild(btn);
    });
    
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 100;
    const timerDuration = Math.max(2500, baseTime - Math.floor(score / 50) * 300);
    const timerElement = document.getElementById('timer');
    
    timerInterval = setInterval(() => {
        timeLeft -= 100 / (timerDuration / 100);
        timerElement.style.width = timeLeft + '%';
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            loseLife();
        }
    }, 100);
}

function checkAnswer(selectedColor, btn) {
    if (!gameActive) return;
    
    clearInterval(timerInterval);
    
    if (selectedColor.name === currentTextColor.name) {
        btn.classList.add('correct');
        
        // Calculate points
        let points = 10;
        if (currentMode === 'CHAOS') points = 20;
        if (streak >= 5) points *= 1.5;
        
        score += Math.floor(points);
        streak++;
        correctAnswers++;
        
        if (streak > bestStreak) {
            bestStreak = streak;
        }
        
        document.getElementById('score').textContent = score;
        document.getElementById('streak').textContent = streak;
        
        setTimeout(() => {
            btn.classList.remove('correct');
            startRound();
        }, 500);
    } else {
        btn.classList.add('wrong');
        wrongAnswers++;
        setTimeout(() => {
            btn.classList.remove('wrong');
            loseLife();
        }, 500);
    }
}

function loseLife() {
    lives--;
    streak = 0;
    document.getElementById('streak').textContent = '0';
    updateLivesDisplay();
    
    if (lives <= 0) {
        endGame();
    } else {
        startRound();
    }
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    document.querySelector('.game-play').style.display = 'none';
    document.getElementById('gameOver').classList.add('show');
    document.getElementById('finalScore').textContent = score;
    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('wrongCount').textContent = wrongAnswers;
    document.getElementById('bestStreak').textContent = bestStreak;
}

function restartGame() {
    score = 0;
    streak = 0;
    bestStreak = 0;
    lives = 3;
    correctAnswers = 0;
    wrongAnswers = 0;
    gameActive = true;
    
    document.getElementById('score').textContent = '0';
    document.getElementById('streak').textContent = '0';
    updateLivesDisplay();
    document.querySelector('.game-play').style.display = 'block';
    document.getElementById('gameOver').classList.remove('show');
    
    startRound();
}

// Start game on load
gameActive = true;
updateLivesDisplay();
startRound();