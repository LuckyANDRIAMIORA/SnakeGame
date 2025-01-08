let isPaused = false;
import {qTable} from "./QTable.js"
import {AI}  from "./AI.js"


const snakeGame = async () => {
    const gameBoard = document.getElementById("gameBoard");
    const ctx = gameBoard.getContext("2d")

    const gameBoardWidth = gameBoard.offsetWidth;
    const gameBoardHeight = gameBoard.offsetHeight;
    const tileSize = 10;
    const rows = gameBoardWidth / tileSize;
    const cols = gameBoardHeight / tileSize;

    let snakeInstance = [{ x: 1, y: 0 }, { x: 0, y: 0 }];
    let foodInstance = AI.generateFoodPosition(cols, rows, snakeInstance);
    AI.initQTable(qTable);

    const getUpdate = () => {
        const { newSnake, newFood } = AI.qFunction(snakeInstance, foodInstance, cols, rows);
        foodInstance = Object.assign({}, newFood);
        snakeInstance = newSnake.map(obj => ({ ...obj }));
    }

    const draw = () => {

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, gameBoardWidth, gameBoardHeight);

        ctx.fillStyle = "pink";
        snakeInstance.forEach(segment => {
            ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
        });

        ctx.fillStyle = "red";
        ctx.fillRect(foodInstance.x * tileSize, foodInstance.y * tileSize, tileSize, tileSize);
    }

    function gameLoop() {
        if (!isPaused) {
            getUpdate();
            draw();
        }
        setTimeout(() => requestAnimationFrame(gameLoop), 100);
    }

    gameLoop();
}

function togglePause() {
    isPaused = !isPaused;
}

function downloadQTableJS() {
    if (localStorage.hasOwnProperty("QTable")) {

        const jsonString = localStorage.getItem("QTable");

        const jsContent = `export const qTable = ${jsonString};`;

        const blob = new Blob([jsContent], { type: 'application/javascript' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "QTable.js";

        link.click();

        URL.revokeObjectURL(link.href);
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'p') { // Press 'p' to toggle pause
        togglePause();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 's') { // Press 'p' to toggle pause
        downloadQTableJS();
    }
});

snakeGame();