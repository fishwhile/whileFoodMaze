/*
//總秒數計算不算
//滾輪
//頁面分數加1000
let score = 0;
let timer = 100;
let gameInterval;
let gameStartTime;
let gameStarted = false;
let isPaused = false;
let isFoodModalOpen = false; // 新增變數來追踪食物彈窗是否開啟
let collectedFoodImages = [];

function updateScore(points) {
    score += points;
    document.getElementById('scoreBoard').innerText = `分數: ${score}`;
}

function updateTimer() {
    if (!isPaused && !isFoodModalOpen) { // 修改此行以檢查食物彈窗是否開啟
        const timerElement = document.getElementById('timer');
        timerElement.innerText = `時間: ${timer}`;
        timer--;

        if (timer < 0) {
            clearInterval(gameInterval);
            showEndModal('哇哇!時間到了', `你得到了 ${score} 分，遊戲時間為 100 秒`, collectedFoodImages); // 修改此處
        }
    }
}

function generateMaze(width, height) {
    let maze = Array(height).fill().map(() => Array(width).fill(false));

    function carve(x, y) {
        const directions = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
        ].sort(() => Math.random() - 0.5);

        directions.forEach(dir => {
            const nx = x + dir.dx * 2;
            const ny = y + dir.dy * 2;

            if (nx > 0 && nx < width && ny > 0 && ny < height && !maze[ny][nx]) {
                maze[y + dir.dy][x + dir.dx] = true;
                maze[ny][nx] = true;
                carve(nx, ny);
            }
        });
    }

    maze[1][1] = true;
    carve(1, 1);

    // 確保出口設置在最右下角
    maze[height - 2][width - 2] = true;
    maze[height - 2][width - 3] = true; // 確保到達出口的通路
    maze[height - 3][width - 2] = true; // 確保到達出口的通路

    return maze;
}

function drawMaze(maze) {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 20;
    canvas.width = maze[0].length * cellSize;
    canvas.height = maze.length * cellSize;

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[0].length; x++) {
            ctx.fillStyle = maze[y][x] ? 'white' : 'black';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

const maze = generateMaze(41, 41); // 增加迷宮尺寸
drawMaze(maze);

let currentPosition = { x: 1, y: 1 };

document.addEventListener('keydown', (event) => {
    if (!isFoodModalOpen) { // 確保在彈窗開啟時無法移動
        let newX = currentPosition.x;
        let newY = currentPosition.y;

        switch (event.key) {
            case 'ArrowUp':
                newY--;
                break;
            case 'ArrowDown':
                newY++;
                break;
            case 'ArrowLeft':
                newX--;
                break;
            case 'ArrowRight':
                newX++;
                break;
        }

        if (maze[newY][newX]) {
            if (!gameStarted) {
                gameStarted = true;
                gameStartTime = Date.now();
                gameInterval = setInterval(updateTimer, 1000);
            }

            currentPosition = { x: newX, y: newY };
            drawMaze(maze);
            drawCharacter(currentPosition.x, currentPosition.y);
            checkFoodPoint(currentPosition.x, currentPosition.y);
        }
    }
});

function drawCharacter(x, y) {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 20;

    ctx.fillStyle = 'red';
    ctx.fillRect(x * cellSize + cellSize / 4, y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2);
}

drawCharacter(currentPosition.x, currentPosition.y);

let foodPoints = [];
for (let i = 0; i < 36; i++) { // 保持食物點數量
    let fx, fy;
    do {
        fx = Math.floor(Math.random() * maze[0].length);
        fy = Math.floor(Math.random() * maze.length);
    } while (!maze[fy][fx] || (fx === 1 && fy === 1) || (fx === maze[0].length - 2 && fy === maze.length - 2));
    foodPoints.push({ x: fx, y: fy, food: { image: `images/food${i + 1}.jpg` } });
}

function checkFoodPoint(x, y) {
    foodPoints.forEach((point, index) => {
        if (point.x === x && point.y === y) {
            collectedFoodImages.push(point.food.image);
            showFoodDetails(point.food);
            foodPoints.splice(index, 1);
            updateScore(5); // 找到美食加5分
        }
    });

    // 檢查是否到達出口
    if (x === maze[0].length - 2 && y === maze.length - 2) {
        clearInterval(gameInterval);
        showEndModal('你超厲害的!居然走到終點了', `你得到了 ${score+1000} 分，遊戲時間為 ${100-timer} 秒`, collectedFoodImages); // 修改此處
    }
}

function showFoodDetails(food) {
    isPaused = true; // 暫停計時
    isFoodModalOpen = true; // 標記食物彈窗已開啟
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <img src="${food.image}" alt="美食圖片">
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close').onclick = () => {
        modal.remove();
        isPaused = false; // 恢復計時
        isFoodModalOpen = false; // 標記食物彈窗已關閉
    };
}

function showEndModal(title, message, images) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    const imageHTML = images.map(src => `<img src="${src}" alt="美食圖片">`).join('');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${title}</h2>
            <p>${message}</p>
            <div class="images">${imageHTML}</div>
            <button class="close">關閉</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.querySelector('.close').onclick = () => window.location.reload();
}
*/
let score = 0;
let timer = 100;
let gameInterval;
let gameStartTime;
let gameStarted = false;
let isPaused = false;
let isFoodModalOpen = false; // 新增變數來追踪食物彈窗是否開啟
let collectedFoodImages = [];

function updateScore(points) {
    score += points;
    document.getElementById('scoreBoard').innerText = `分數: ${score}`;
}

function updateTimer() {
    if (!isPaused && !isFoodModalOpen) { // 修改此行以檢查食物彈窗是否開啟
        const timerElement = document.getElementById('timer');
        timerElement.innerText = `時間: ${timer}`;
        timer--;

        if (timer < 0) {
            clearInterval(gameInterval);
            showEndModal('哇哇!時間到了', `你得到了 ${score} 分，遊戲時間為 100 秒`, collectedFoodImages); // 修改此處
        }
    }
}

function generateMaze(width, height) {
    let maze = Array(height).fill().map(() => Array(width).fill(false));

    function carve(x, y) {
        const directions = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
        ].sort(() => Math.random() - 0.5);

        directions.forEach(dir => {
            const nx = x + dir.dx * 2;
            const ny = y + dir.dy * 2;

            if (nx > 0 && nx < width && ny > 0 && ny < height && !maze[ny][nx]) {
                maze[y + dir.dy][x + dir.dx] = true;
                maze[ny][nx] = true;
                carve(nx, ny);
            }
        });
    }

    maze[1][1] = true;
    carve(1, 1);

    // 確保出口設置在最右下角
    maze[height - 2][width - 2] = true;
    maze[height - 2][width - 3] = true; // 確保到達出口的通路
    maze[height - 3][width - 2] = true; // 確保到達出口的通路

    return maze;
}

function drawMaze(maze) {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 20;
    canvas.width = maze[0].length * cellSize;
    canvas.height = maze.length * cellSize;

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[0].length; x++) {
            ctx.fillStyle = maze[y][x] ? 'white' : 'black';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

const maze = generateMaze(41, 41); // 增加迷宮尺寸
drawMaze(maze);

let currentPosition = { x: 1, y: 1 };

document.addEventListener('keydown', (event) => {
    if (!isFoodModalOpen) { // 確保在彈窗開啟時無法移動
        moveCharacter(event.key);
    }
});

function moveCharacter(direction) {
    let newX = currentPosition.x;
    let newY = currentPosition.y;

    switch (direction) {
        case 'ArrowUp':
        case 'up':
            newY--;
            break;
        case 'ArrowDown':
        case 'down':
            newY++;
            break;
        case 'ArrowLeft':
        case 'left':
            newX--;
            break;
        case 'ArrowRight':
        case 'right':
            newX++;
            break;
    }

    if (maze[newY][newX]) {
        if (!gameStarted) {
            gameStarted = true;
            gameStartTime = Date.now();
            gameInterval = setInterval(updateTimer, 1000);
        }

        currentPosition = { x: newX, y: newY };
        drawMaze(maze);
        drawCharacter(currentPosition.x, currentPosition.y);
        checkFoodPoint(currentPosition.x, currentPosition.y);
    }
}

function drawCharacter(x, y) {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 20;

    ctx.fillStyle = 'red';
    ctx.fillRect(x * cellSize + cellSize / 4, y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2);
}

drawCharacter(currentPosition.x, currentPosition.y);

let foodPoints = [];
for (let i = 0; i < 36; i++) { // 保持食物點數量
    let fx, fy;
    do {
        fx = Math.floor(Math.random() * maze[0].length);
        fy = Math.floor(Math.random() * maze.length);
    } while (!maze[fy][fx] || (fx === 1 && fy === 1) || (fx === maze[0].length - 2 && fy === maze.length - 2));
    foodPoints.push({ x: fx, y: fy, food: { image: `images/food${i + 1}.jpg` } });
}

function checkFoodPoint(x, y) {
    foodPoints.forEach((point, index) => {
        if (point.x === x && point.y === y) {
            collectedFoodImages.push(point.food.image);
            showFoodDetails(point.food);
            foodPoints.splice(index, 1);
            updateScore(5); // 找到美食加5分
        }
    });

    // 檢查是否到達出口
    if (x === maze[0].length - 2 && y === maze.length - 2) {
        clearInterval(gameInterval);
        showEndModal('你超厲害的!居然走到終點了', `你得到了 ${score+1000} 分，遊戲時間為 ${100-timer} 秒`, collectedFoodImages); // 修改此處
    }
}

function showFoodDetails(food) {
    isPaused = true; // 暫停計時
    isFoodModalOpen = true; // 標記食物彈窗已開啟
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <img src="${food.image}" alt="美食圖片">
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close').onclick = () => {
        modal.remove();
        isPaused = false; // 恢復計時
        isFoodModalOpen = false; // 標記食物彈窗已關閉
    };
}

function showEndModal(title, message, images) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    const imageHTML = images.map(src => `<img src="${src}" alt="美食圖片">`).join('');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${title}</h2>
            <p>${message}</p>
            <div class="images">${imageHTML}</div>
            <button class="close">關閉</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.querySelector('.close').onclick = () => window.location.reload();
}

// 新增按鈕事件監聽
document.getElementById('up').addEventListener('click', () => moveCharacter('up'));
document.getElementById('down').addEventListener('click', () => moveCharacter('down'));
document.getElementById('left').addEventListener('click', () => moveCharacter('left'));
document.getElementById('right').addEventListener('click', () => moveCharacter('right'));
