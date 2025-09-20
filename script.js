const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');

const grid = 20;
let snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }];
let dx = grid;
let dy = 0;
let food = { x: 0, y: 0 };
let score = 0;
let isGameOver = false;

function gameLoop() {
    if (isGameOver) {
        gameOverMessage.style.display = 'block';
        return;
    }

    setTimeout(() => {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        checkCollision();
        gameLoop();
    }, 100);
}

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
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
    food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;

    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
        }
    });
}

function handleKeyPress(event) {
    const goingUp = dy === -grid;
    const goingDown = dy === grid;
    const goingRight = dx === grid;
    const goingLeft = dx === -grid;

    switch (event.key) {
        case 'ArrowUp':
            if (!goingDown) {
                dx = 0;
                dy = -grid;
            }
            break;
        case 'ArrowDown':
            if (!goingUp) {
                dx = 0;
                dy = grid;
            }
            break;
        case 'ArrowLeft':
            if (!goingRight) {
                dx = -grid;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (!goingLeft) {
                dx = grid;
                dy = 0;
            }
            break;
    }
}

function checkCollision() {
    const head = snake[0];

    // Wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        isGameOver = true;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            isGameOver = true;
            break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);
generateFood();

// Initial draw to prevent blank screen before game loop starts
clearCanvas();
drawFood();
drawSnake();

gameLoop();
