const gameBoard = document.getElementById('gameBoard')
let cells = []
let direction = 1;
let position = 0


async function initGameBoard() {
    for (let index = 0; index < 1600; index++) {
        const cell = document.createElement('div');
        cell.classList.add('cell')
        gameBoard.appendChild(cell)
    }

    cells = getAllCells()
}

function getAllCells() {
    const cells = gameBoard.getElementsByClassName('cell')
    return cells;
}

function moveSnake() {
    if (position < cells.length) {
        if (position != 0) {
            cells[position - 1].classList.remove('snake')
        }
        cells[position].classList.add('snake')
        position = position + 1
    }
}

initGameBoard()
setInterval(moveSnake, 1000)