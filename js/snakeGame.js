const gameBoard = document.getElementById('gameBoard')
const messages = document.getElementById('messages')
let direction = 1; 
let lastPosition = []
let position = [1,0]
let snake = null
let lastKeyPressTime = 0
const debounceDelay = 100
let foodNumber = 1
let foodLocations = []

async function initGameBoard() {
    gameBoard.replaceChildren('')
    for (let index = 0; index < 1600; index++) {
        const cell = document.createElement('div');
        cell.classList.add('cell')
        gameBoard.appendChild(cell)
    }

}

function getAllCells() {
    const cells = gameBoard.getElementsByClassName('cell')
    return cells;
}

function moveSnake() {
    try {

        killSnake(position[0])
        eatFood(position[0])

        for (let index = 0; index < lastPosition.length; index++) {

            erraseSnake(lastPosition[index])

        }

        lastPosition = []

        for (let index = 0; index < position.length; index++) {

            position[index] = drawSnake(position[index], position[0], index)

        }
    } catch (error) {
        clearInterval(snake)
        const cell = document.createElement('alert')
        cell.textContent = "Game Over!"
        messages.appendChild(cell)
    }

}

function generateFood(){
    const cells = getAllCells()
    for (let index = 0; index < foodNumber; index++) {
        const foodLocation = Math.round(Math.random() * 1600)
        foodLocations.push(foodLocation) 
        cells[foodLocation].classList.add('food')
    }
}

function killSnake(p){
    const cells = getAllCells()
    if(p >= cells.length || p < 0){
        throw new Error('Game Over!')
    } 
    if(position.lastIndexOf(p) != -1 && position.lastIndexOf(p) != 0){        
        throw new Error('Game Over!')
    }
}

function erraseSnake(p) {
    let cells = getAllCells()
    cells[p].classList.remove('snake')
}

function erraseFood(f) {
    let cells = getAllCells()
    cells[f].classList.remove('food')
}

function drawSnake(p, head, index) {
    let cells = getAllCells()
    lastPosition.push(position[index])
    if (p < cells.length) {
        cells[p].classList.add('snake')
        if (p == head) {
            p = p + direction
        } else {
            p = lastPosition[index - 1]
        }
    }
    return p
}

function eatFood(p){
    if(foodLocations.indexOf(p) != -1){
        let index = foodLocations.indexOf(p)
        erraseFood(foodLocations[index])
        delete foodLocations[index]
        position.push(p)
        generateFood()
    }
}

function start() {
    generateFood()
    snake = setInterval(moveSnake, 150)//moveng the snake with 200ms speed
}

initGameBoard()
start()

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
    const currentTime = Date.now()
    if (currentTime - lastKeyPressTime > debounceDelay) {
        lastKeyPressTime = currentTime
        if (e.key === 'ArrowDown') {
            if (direction != -40) goDown()
        }
        if (e.key === 'ArrowUp') {
            if (direction != 40) goUp()
        }
        if (e.key === 'ArrowRight') {
            if (direction != -1) goRight()
        }
        if (e.key === 'ArrowLeft') {
            if (direction != 1) goLeft()
        }
    }
})