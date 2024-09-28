class GameBoard {

    constructor(gameBoard, boardSize){
        this.gameBoard = gameBoard
        this.boardSize = boardSize
        this.foodNumber = 1;
        this.foodLocations = [];
        this.cells = [];    
    }
    
    initGameBoard() {
        for (let index = 0; index < this.boardSize; index++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            this.gameBoard.appendChild(cell);
        }
        this.cells = document.getElementsByClassName('cell');
    }
    
    drawSnakePart(index) {
        this.cells[index].classList.add('snake');
    }
    
    erraseSnakePart(index) {
        try {
            this.cells[index].classList.remove('snake');            
        } catch (error) {
            
        }
    }
    
    generateFood() {
        for (let index = 0; index < this.foodNumber; index++) {
            const foodLocation = Math.round(Math.random() * 1600);
            this.foodLocations.push(foodLocation);
            this.cells[foodLocation].classList.add('food');
        }
    }
    erraseFood(f) {
        try {
            this.cells[f].classList.remove('food');            
        } catch (error) {
            
        }
    }
    removeFood(index) {
        delete this.foodLocations[index];
    }

    removeAllFood(){
        for (let index = 0; index < this.foodLocations.length; index++) {
            this.erraseFood(this.foodLocations[index])
        }
        this.foodLocations = []
    }
    getFoodIndex(foodLocation) {
        return this.foodLocations.indexOf(foodLocation);
    }
    
    levelUp(){
        this.foodNumber = this.foodNumber + 1
    }

    getCellsLength(){
        return this.cells.length
    }
}

