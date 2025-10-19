// Game state
let currentLevel = 0;
let moves = 0;
let grid = [];
let laserPath = [];

// Cell types
const CELL_TYPES = {
    EMPTY: 'empty',
    SOURCE: 'source',
    TARGET: 'target',
    MIRROR: 'mirror',
    PRISM: 'prism',
    TREE: 'tree',
    ROCK: 'rock'
};

// Directions
const DIRECTIONS = {
    RIGHT: { dx: 1, dy: 0 },
    LEFT: { dx: -1, dy: 0 },
    UP: { dx: 0, dy: -1 },
    DOWN: { dx: 0, dy: 1 }
};

// Level definitions
const levels = [
    // Level 1 - Tutorial: Simple straight line with one mirror
    {
        size: 5,
        source: { x: 0, y: 2, direction: 'RIGHT' },
        target: { x: 4, y: 2 },
        obstacles: [
            { x: 2, y: 1, type: CELL_TYPES.TREE }
        ],
        mirrors: [
            { x: 2, y: 2, rotation: 0 }
        ],
        bestMoves: 2
    },
    // Level 2 - Simple diagonal: Learn basic reflection (solvable)
    {
        size: 5,
        source: { x: 0, y: 0, direction: 'RIGHT' },
        target: { x: 4, y: 4 },
        obstacles: [
            // Keep empty to avoid accidental blocks on the learning level
        ],
        mirrors: [
            // Rotate both mirrors to 45° during play to route: RIGHT -> DOWN -> RIGHT
            { x: 1, y: 0, rotation: 0 }, // set to 45° to go DOWN
            { x: 1, y: 4, rotation: 0 }  // set to 45° to go RIGHT to target
        ],
        bestMoves: 2
    },
    // Level 3 - Three mirrors: More complex path
    {
        size: 6,
        source: { x: 0, y: 3, direction: 'RIGHT' },
        target: { x: 5, y: 0 },
        obstacles: [
            { x: 2, y: 3, type: CELL_TYPES.ROCK },
            { x: 3, y: 2, type: CELL_TYPES.TREE }
        ],
        mirrors: [
            { x: 1, y: 3, rotation: 0 },
            { x: 1, y: 1, rotation: 0 },
            { x: 3, y: 1, rotation: 0 },
            { x: 5, y: 1, rotation: 0 }
        ],
        bestMoves: 4
    },
    // Level 4 - Maze navigation
    {
        size: 6,
        source: { x: 0, y: 0, direction: 'DOWN' },
        target: { x: 5, y: 5 },
        obstacles: [
            { x: 2, y: 2, type: CELL_TYPES.TREE },
            { x: 3, y: 3, type: CELL_TYPES.ROCK }
        ],
        mirrors: [
            { x: 0, y: 2, rotation: 0 },
            { x: 2, y: 4, rotation: 0 },
            { x: 4, y: 4, rotation: 0 },
            { x: 4, y: 2, rotation: 0 }
        ],
        bestMoves: 4
    },
    // Level 5 - Snake path
    {
        size: 7,
        source: { x: 0, y: 3, direction: 'RIGHT' },
        target: { x: 6, y: 3 },
        obstacles: [
            { x: 2, y: 2, type: CELL_TYPES.TREE },
            { x: 2, y: 4, type: CELL_TYPES.TREE },
            { x: 4, y: 2, type: CELL_TYPES.ROCK },
            { x: 4, y: 4, type: CELL_TYPES.ROCK }
        ],
        mirrors: [
            { x: 1, y: 3, rotation: 0 },
            { x: 1, y: 1, rotation: 0 },
            { x: 3, y: 1, rotation: 0 },
            { x: 3, y: 5, rotation: 0 },
            { x: 5, y: 5, rotation: 0 },
            { x: 5, y: 3, rotation: 0 }
        ],
        bestMoves: 6
    },
    // Level 6 - Corner challenge
    {
        size: 7,
        source: { x: 0, y: 0, direction: 'RIGHT' },
        target: { x: 6, y: 6 },
        obstacles: [
            { x: 3, y: 3, type: CELL_TYPES.TREE },
            { x: 1, y: 3, type: CELL_TYPES.ROCK },
            { x: 5, y: 3, type: CELL_TYPES.ROCK }
        ],
        mirrors: [
            { x: 3, y: 0, rotation: 0 },
            { x: 6, y: 3, rotation: 0 },
            { x: 3, y: 6, rotation: 0 }
        ],
        bestMoves: 3
    },
    // Level 7 - Forest maze
    {
        size: 8,
        source: { x: 0, y: 0, direction: 'DOWN' },
        target: { x: 7, y: 7 },
        obstacles: [
            { x: 2, y: 2, type: CELL_TYPES.TREE },
            { x: 2, y: 5, type: CELL_TYPES.TREE },
            { x: 5, y: 2, type: CELL_TYPES.TREE },
            { x: 5, y: 5, type: CELL_TYPES.ROCK }
        ],
        mirrors: [
            { x: 0, y: 3, rotation: 0 },
            { x: 3, y: 3, rotation: 0 },
            { x: 3, y: 0, rotation: 0 },
            { x: 6, y: 0, rotation: 0 },
            { x: 6, y: 3, rotation: 0 },
            { x: 3, y: 6, rotation: 0 }
        ],
        bestMoves: 6
    },
    // Level 8 - Double bounce
    {
        size: 8,
        source: { x: 0, y: 4, direction: 'RIGHT' },
        target: { x: 7, y: 4 },
        obstacles: [
            { x: 2, y: 4, type: CELL_TYPES.ROCK },
            { x: 5, y: 4, type: CELL_TYPES.ROCK },
            { x: 3, y: 2, type: CELL_TYPES.TREE },
            { x: 4, y: 6, type: CELL_TYPES.TREE }
        ],
        mirrors: [
            { x: 1, y: 4, rotation: 0 },
            { x: 1, y: 1, rotation: 0 },
            { x: 4, y: 1, rotation: 0 },
            { x: 4, y: 4, rotation: 0 },
            { x: 6, y: 4, rotation: 0 },
            { x: 6, y: 7, rotation: 0 }
        ],
        bestMoves: 6
    },
    // Level 9 - Complex zigzag
    {
        size: 9,
        source: { x: 4, y: 0, direction: 'DOWN' },
        target: { x: 4, y: 8 },
        obstacles: [
            { x: 4, y: 2, type: CELL_TYPES.ROCK },
            { x: 4, y: 6, type: CELL_TYPES.ROCK },
            { x: 2, y: 4, type: CELL_TYPES.TREE },
            { x: 6, y: 4, type: CELL_TYPES.TREE }
        ],
        mirrors: [
            { x: 4, y: 1, rotation: 0 },
            { x: 2, y: 1, rotation: 0 },
            { x: 2, y: 3, rotation: 0 },
            { x: 4, y: 3, rotation: 0 },
            { x: 6, y: 5, rotation: 0 },
            { x: 6, y: 7, rotation: 0 },
            { x: 4, y: 7, rotation: 0 }
        ],
        bestMoves: 7
    },
    // Level 10 - Master challenge
    {
        size: 10,
        source: { x: 0, y: 5, direction: 'RIGHT' },
        target: { x: 9, y: 5 },
        obstacles: [
            { x: 2, y: 5, type: CELL_TYPES.ROCK },
            { x: 7, y: 5, type: CELL_TYPES.ROCK },
            { x: 5, y: 2, type: CELL_TYPES.TREE },
            { x: 5, y: 8, type: CELL_TYPES.TREE },
            { x: 3, y: 3, type: CELL_TYPES.TREE },
            { x: 6, y: 7, type: CELL_TYPES.TREE }
        ],
        mirrors: [
            { x: 1, y: 5, rotation: 0 },
            { x: 1, y: 2, rotation: 0 },
            { x: 4, y: 2, rotation: 0 },
            { x: 4, y: 5, rotation: 0 },
            { x: 5, y: 5, rotation: 0 },
            { x: 8, y: 5, rotation: 0 },
            { x: 8, y: 8, rotation: 0 },
            { x: 5, y: 8, rotation: 0 }
        ],
        bestMoves: 8
    }
];

// Initialize game
function init() {
    loadLevel(currentLevel);
    setupEventListeners();
    loadBestScore();
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('resetBtn').addEventListener('click', resetLevel);
    document.getElementById('nextBtn').addEventListener('click', nextLevel);
    document.getElementById('instructionsBtn').addEventListener('click', showInstructions);
    document.getElementById('continueBtn').addEventListener('click', () => {
        closeModal('winModal');
        nextLevel();
    });

    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Load level
function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        alert('🎉 Congratulations! You completed all levels!');
        currentLevel = 0;
        levelIndex = 0;
    }

    const level = levels[levelIndex];
    moves = 0;
    updateMoves();

    // Create grid
    const size = level.size;
    grid = Array(size).fill(null).map(() => Array(size).fill(null).map(() => ({
        type: CELL_TYPES.EMPTY,
        rotation: 0
    })));

    // Place source
    grid[level.source.y][level.source.x] = {
        type: CELL_TYPES.SOURCE,
        direction: level.source.direction,
        rotation: 0
    };

    // Place target
    grid[level.target.y][level.target.x] = {
        type: CELL_TYPES.TARGET,
        rotation: 0
    };

    // Place obstacles
    level.obstacles.forEach(obs => {
        grid[obs.y][obs.x] = {
            type: obs.type,
            rotation: 0
        };
    });

    // Place mirrors
    level.mirrors.forEach(mirror => {
        grid[mirror.y][mirror.x] = {
            type: CELL_TYPES.MIRROR,
            rotation: mirror.rotation
        };
    });

    // Update UI
    document.getElementById('level').textContent = levelIndex + 1;
    updateBestScore();
    renderGrid();
    calculateLaserPath();
}

// Render grid
function renderGrid() {
    const board = document.getElementById('gameBoard');
    const size = grid.length;
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.innerHTML = '';

    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.dataset.x = x;
            cellDiv.dataset.y = y;

            const content = document.createElement('div');
            content.className = 'cell-content';

            switch (cell.type) {
                case CELL_TYPES.SOURCE:
                    content.textContent = '🔦';
                    break;
                case CELL_TYPES.TARGET:
                    content.textContent = '🎯';
                    break;
                case CELL_TYPES.MIRROR:
                    content.textContent = '🪞';
                    content.style.transform = `rotate(${cell.rotation}deg)`;
                    cellDiv.classList.add('clickable');
                    cellDiv.addEventListener('click', () => rotateMirror(x, y));
                    break;
                case CELL_TYPES.TREE:
                    content.textContent = '🌲';
                    break;
                case CELL_TYPES.ROCK:
                    content.textContent = '🪨';
                    break;
            }

            cellDiv.appendChild(content);
            board.appendChild(cellDiv);
        });
    });
}

// Rotate mirror
function rotateMirror(x, y) {
    const cell = grid[y][x];
    if (cell.type === CELL_TYPES.MIRROR) {
        cell.rotation = (cell.rotation + 45) % 360;
        moves++;
        updateMoves();
        renderGrid();
        calculateLaserPath();
    }
}

// Calculate laser path
function calculateLaserPath() {
    const level = levels[currentLevel];
    const source = level.source;
    
    laserPath = [];
    let x = source.x;
    let y = source.y;
    let direction = source.direction;
    
    const visited = new Set();
    const maxSteps = 100; // Prevent infinite loops
    let steps = 0;

    while (steps < maxSteps) {
        steps++;
        const key = `${x},${y},${direction}`;
        if (visited.has(key)) break; // Loop detected
        visited.add(key);

        // Move in current direction
        const dir = DIRECTIONS[direction];
        x += dir.dx;
        y += dir.dy;

        // Check bounds
        if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) break;

        const cell = grid[y][x];
        laserPath.push({ x, y });

        // Check if hit target
        if (cell.type === CELL_TYPES.TARGET) {
            renderLaserPath();
            checkWin();
            return;
        }

        // Check obstacles
        if (cell.type === CELL_TYPES.TREE || cell.type === CELL_TYPES.ROCK) {
            renderLaserPath();
            return;
        }

        // Check mirrors
        if (cell.type === CELL_TYPES.MIRROR) {
            direction = reflectDirection(direction, cell.rotation);
            if (!direction) break; // Invalid reflection
        }
    }

    renderLaserPath();
}

// Reflect direction based on mirror rotation
function reflectDirection(direction, rotation) {
    const reflections = {
        0: { // Vertical mirror (|)
            'RIGHT': 'LEFT',
            'LEFT': 'RIGHT',
            'UP': 'UP',
            'DOWN': 'DOWN'
        },
        45: { // Diagonal mirror (\)
            'RIGHT': 'DOWN',
            'LEFT': 'UP',
            'UP': 'LEFT',
            'DOWN': 'RIGHT'
        },
        90: { // Horizontal mirror (—)
            'RIGHT': 'RIGHT',
            'LEFT': 'LEFT',
            'UP': 'DOWN',
            'DOWN': 'UP'
        },
        135: { // Diagonal mirror (/)
            'RIGHT': 'UP',
            'LEFT': 'DOWN',
            'UP': 'RIGHT',
            'DOWN': 'LEFT'
        },
        180: { // Vertical mirror (|)
            'RIGHT': 'LEFT',
            'LEFT': 'RIGHT',
            'UP': 'UP',
            'DOWN': 'DOWN'
        },
        225: { // Diagonal mirror (\)
            'RIGHT': 'DOWN',
            'LEFT': 'UP',
            'UP': 'LEFT',
            'DOWN': 'RIGHT'
        },
        270: { // Horizontal mirror (—)
            'RIGHT': 'RIGHT',
            'LEFT': 'LEFT',
            'UP': 'DOWN',
            'DOWN': 'UP'
        },
        315: { // Diagonal mirror (/)
            'RIGHT': 'UP',
            'LEFT': 'DOWN',
            'UP': 'RIGHT',
            'DOWN': 'LEFT'
        }
    };

    return reflections[rotation]?.[direction] || null;
}

// Render laser path
function renderLaserPath() {
    // Clear previous path
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('laser-path');
        const beams = cell.querySelectorAll('.laser-beam');
        beams.forEach(beam => beam.remove());
    });

    // Render new path
    laserPath.forEach(point => {
        const cells = document.querySelectorAll('.cell');
        const index = point.y * grid.length + point.x;
        const cell = cells[index];
        if (cell) {
            cell.classList.add('laser-path');
            
            // Add beam visualization
            const beam = document.createElement('div');
            beam.className = 'laser-beam horizontal';
            cell.appendChild(beam);
        }
    });
}

// Check win condition
function checkWin() {
    const level = levels[currentLevel];
    const lastPoint = laserPath[laserPath.length - 1];
    
    if (lastPoint && lastPoint.x === level.target.x && lastPoint.y === level.target.y) {
        setTimeout(() => {
            document.getElementById('finalMoves').textContent = moves;
            saveBestScore();
            document.getElementById('nextBtn').disabled = false;
            showModal('winModal');
        }, 500);
    } else {
        document.getElementById('nextBtn').disabled = true;
    }
}

// Update moves display
function updateMoves() {
    document.getElementById('moves').textContent = moves;
}

// Reset level
function resetLevel() {
    loadLevel(currentLevel);
}

// Next level
function nextLevel() {
    currentLevel++;
    if (currentLevel >= levels.length) {
        currentLevel = 0;
    }
    loadLevel(currentLevel);
    document.getElementById('nextBtn').disabled = true;
}

// Show modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Show instructions
function showInstructions() {
    showModal('modal');
}

// Save best score
function saveBestScore() {
    const key = `laserGrove_level${currentLevel}_best`;
    const currentBest = localStorage.getItem(key);
    
    if (!currentBest || moves < parseInt(currentBest)) {
        localStorage.setItem(key, moves.toString());
        updateBestScore();
    }
}

// Load best score
function loadBestScore() {
    updateBestScore();
}

// Update best score display
function updateBestScore() {
    const key = `laserGrove_level${currentLevel}_best`;
    const best = localStorage.getItem(key);
    document.getElementById('best').textContent = best || '--';
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', init);
