// --- DOM Elements ---
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');
const restartButton = document.getElementById('restartButton');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const pointsInput = document.getElementById('pointsInput');
const wallsToggle = document.getElementById('wallsToggle');
const boardSizeInput = document.getElementById('boardSizeInput');

// --- Game State ---
const grid = 20;
let snake = [];
let dx = grid;
let dy = 0;
let food = { x: 0, y: 0 };
let score = 0;
let isGameOver = false;
let gameLoopTimeout; // To store the timeout ID

// --- Settings ---
let gameSpeed = 150; // Initial speed
let pointsPerFood = 10;
let wallsArePassable = false;

// --- Main Game Loop ---
function gameLoop() {
    if (isGameOver) {
        gameOverMessage.style.display = 'block';
        restartButton.style.display = 'block';
        return;
    }

    // Clear previous timeout to prevent multiple loops
    clearTimeout(gameLoopTimeout);

    gameLoopTimeout = setTimeout(() => {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        checkCollision();
        gameLoop();
    }, gameSpeed);
}

// --- Game Functions ---
function clearCanvas() {
    context.fillStyle = '#333';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach((segment, index) => {
        context.fillStyle = index === 0 ? 'darkgreen' : 'lime';
        context.fillRect(segment.x, segment.y, grid, grid);
        context.strokeStyle = '#222';
        context.strokeRect(segment.x, segment.y, grid, grid);
    });
}

function drawFood() {
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, grid, grid);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };


    if (wallsArePassable) {
        if (head.x >= canvas.width) head.x = 0;
        if (head.x < 0) head.x = canvas.width - grid;
        if (head.y >= canvas.height) head.y = 0;
        if (head.y < 0) head.y = canvas.height - grid;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += pointsPerFood;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
    food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;

    for (const segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

function checkCollision() {
    const head = snake[0];

    // Wall collision (only if walls are not passable)
    if (!wallsArePassable) {
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            isGameOver = true;
        }
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            isGameOver = true;
            break;
        }
    }
}

// --- Input Handling ---
function handleKeyPress(event) {
    const goingUp = dy === -grid;
    const goingDown = dy === grid;
    const goingRight = dx === grid;
    const goingLeft = dx === -grid;

    switch (event.key) {
        case 'ArrowUp':
            if (!goingDown) { dx = 0; dy = -grid; }
            break;
        case 'ArrowDown':
            if (!goingUp) { dx = 0; dy = grid; }
            break;
        case 'ArrowLeft':
            if (!goingRight) { dx = -grid; dy = 0; }
            break;
        case 'ArrowRight':
            if (!goingLeft) { dx = grid; dy = 0; }
            break;
    }
}

// --- Reset and Initialization ---
function resetGame() {
    // Apply board size from input
    const newBoardSize = parseInt(boardSizeInput.value, 10);
    if (!isNaN(newBoardSize) && newBoardSize >= 100) {
        canvas.width = newBoardSize;
        canvas.height = newBoardSize;
    }

    // Reset game state
    const startX = Math.floor((canvas.width / 2) / grid) * grid;
    const startY = Math.floor((canvas.height / 2) / grid) * grid;
    snake = [{ x: startX, y: startY }, { x: startX - grid, y: startY }];
    dx = grid;
    dy = 0;
    score = 0;
    isGameOver = false;
    scoreDisplay.textContent = score;

    // Hide game over messages
    gameOverMessage.style.display = 'none';
    restartButton.style.display = 'none';

    // Start fresh
    generateFood();
    gameLoop();
}

// --- Event Listeners ---
speedSlider.addEventListener('input', (e) => {
    gameSpeed = 250 - e.target.value;
    speedValue.textContent = e.target.value;
});

pointsInput.addEventListener('change', (e) => {
    const points = parseInt(e.target.value, 10);
    if (!isNaN(points) && points > 0) {
        pointsPerFood = points;
    }
});

wallsToggle.addEventListener('change', (e) => {
    wallsArePassable = e.target.checked;
});

restartButton.addEventListener('click', resetGame);
document.addEventListener('keydown', handleKeyPress);

// --- Initial Game Start ---
resetGame();
