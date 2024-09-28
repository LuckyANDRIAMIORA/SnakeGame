const board = document.getElementById('gameBoard');
const boardSize = 1600;
const gameBoard = new GameBoard(board, boardSize)

let snake

let snakeMotion = null
let direction = 1;
let lastTime = 0;
const speed = 50;

function initSnake() {
    for (let index = 0; index < snake.bodyLength(); index++) {
        gameBoard.drawSnakePart(snake.getIndex(index));
    }
}

function killSnake() {
    if (snake.getIndex(0) >= gameBoard.getCellsLength() || snake.getIndex(0) < 0) {
        throw new Error('Game Over!')
    }
    if (snake.biteItself()) {
        throw new Error('Game Over!')
    }
}

function moveSnake(timestamp) {
    try {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        if (deltaTime > speed) {
            killSnake()
            const hasEaten = foodEaten()
            if (!hasEaten) {
                gameBoard.erraseSnakePart(snake.getIndex(snake.bodyLength() - 1));
                snake.removeSnakeTail();
            }
            const newHead = snake.getIndex(0) + direction;
            snake.addNewSnakeHead(newHead);
            gameBoard.drawSnakePart(snake.getIndex(0))
            lastTime = timestamp;
        }
        requestAnimationFrame(moveSnake)
    } catch (error) {
        stop()
        console.log('Game Over')
    }

}

function foodEaten() {
    if (gameBoard.getFoodIndex(snake.getIndex(0)) != -1) {
        let index = gameBoard.getFoodIndex(snake.getIndex(0))
        gameBoard.erraseFood(snake.getIndex(0))
        gameBoard.removeFood(index);
        gameBoard.generateFood()
        return true
    } else {
        return false
    }
}

function generateFood() {
    gameBoard.generateFood()
}

async function initGame() {
    gameBoard.initGameBoard()
    snake = new Snake(0, 1)
    initSnake()
    generateFood()

    snakeMotion = requestAnimationFrame(moveSnake,)
}

function restart() {
    stop();

    direction = 1
    for (let index = 0; index < snake.bodyLength(); index++) {
        gameBoard.erraseSnakePart(snake.getIndex(index))
    }
    gameBoard.removeAllFood()
    snake = new Snake(0, 1)
    initSnake()
    generateFood()
    snakeMotion = requestAnimationFrame(moveSnake,)

}

async function stop() {
    cancelAnimationFrame(snakeMotion)
}

function goDown() {
    direction = 40
}

function goUp() {
    direction = -40
}

function goLeft() {
    direction = -1
}

function goRight() {
    direction = 1
}

document.addEventListener('keyup', (e) => {

    if (e.key === 'ArrowDown' && direction != -40) {
        goDown()
    }
    if (e.key === 'ArrowUp' && direction != 40) {
        goUp()
    }
    if (e.key === 'ArrowRight' && direction != -1) {
        goRight()
    }
    if (e.key === 'ArrowLeft' && direction != 1) {
        goLeft()
    }
})

initGame()