const gameBoard = document.getElementById('gameBoard')
let direction = 1;
let newStep = false
let lastMoves = undefined
let lastPosition = []
let position = [2,1,0]


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
    for (let index = 0; index < position.length; index++) {

        position[index] = moveCell(position[index], position[0], index)

    }

}

function moveCell(p, head, index) {
    let cells = getAllCells()
    lastPosition.push(position[index])
    if (p < cells.length) {
        if(newStep){
            cells[lastMoves].classList.remove('snake')
            newStep = false
        }
        lastMoves = p
        cells[p].classList.add('snake')
        if (p == head) {
            p = p + direction
        } else {
            p = lastPosition[index - 1]
        }
    }
    if (lastPosition.length == 3) {
        lastPosition = []
        newStep = true
    }
    return p
}

function goDown(){

    direction = 40

}

function goUp(){

    direction = -40

}

function goLeft(){
    
    direction = -1

}

function goRight(){
    
    direction = 1

}

document.addEventListener('keydown',(e)=>{
    if(e.key === 'ArrowDown'){
        if(direction != -40) goDown()
    }
    if(e.key === 'ArrowUp'){
        if(direction != 40) goUp()
    }
    if(e.key === 'ArrowRight'){
        if(direction != -1) goRight()
    }
    if(e.key === 'ArrowLeft'){
        if(direction != 1) goLeft()
    }
})

initGameBoard()
setInterval(moveSnake, 300)