const learningRate = 0.1;
const discountFactor = 0.9;
const eGradientMalus = 0.0001;

const generateFoodPosition = (cols, rows, snake) => {
    let foodPosition;

    const isOccupied = (x, y) => {
        return snake.some(segment => segment.x === x && segment.y === y);
    };

    do {
        foodPosition = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    } while (isOccupied(foodPosition.x, foodPosition.y)); // Regenerate if occupied

    return foodPosition;
};

const handleDirectionChange = (key) => {
    let direction = { x: 0, y: 0 };
    switch (key) {
        case 0:

            direction.x = 0;
            direction.y = -1;
            break;
        case 1:
            direction.x = 0;
            direction.y = 1;
            break;
        case 2:
            direction.x = -1;
            direction.y = 0;
            break;
        case 3:
            direction.x = 1;
            direction.y = 0;
            break;
    }
    return direction;
}

const update = (snakeInstance, foodInstance, direction, cols, rows) => {

    let newSnake = snakeInstance.map(obj => ({ ...obj }));
    let newFood = Object.assign({}, foodInstance);

    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };
    newSnake.unshift(head);

    const foodEaten = (newFood.x === head.x && newFood.y === head.y);
    if (foodEaten) {

        const food = generateFoodPosition(cols, rows, newSnake);
        newFood.x = food.x
        newFood.y = food.y

    } else if (direction.x !== 0 || direction.y !== 0) {
        newSnake.pop();
    }

    const isGameOver = head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows ||
        newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);

    if (isGameOver) {
        newSnake = [{ x: 1, y: 0 }, { x: 0, y: 0 }].map(obj => ({ ...obj }));
        const food = generateFoodPosition(cols, rows, newSnake);
        newFood.x = food.x
        newFood.y = food.y
        console.log("game over")
    }


    return { newSnake, newFood, isGameOver, foodEaten }

}

const getCurrentState = (snake, food, cols, rows) => {
    // State representation: 
    // [food_direction_up, food_direction_down, food_direction_left, food_direction_right,
    // obstacle_up, obstacle_down, obstacle_left, obstacle_right, 
    // snake_direction_up, snake_direction_down, snake_direction_left, snake_direction_right,
    // tail_direction_up, tail_direction_down, tail_direction_left, tail_direction_right]

    const state = Array(16).fill(0);
    const head = snake[0];
    const tail = snake[snake.length - 1];

    //Food Direction
    food.x > head.x ? state[3] = 1 : food.x < head.x ? state[2] = 1 : null;
    food.y > head.y ? state[1] = 1 : food.y < head.y ? state[0] = 1 : null;

    // Obstacle detection
    state[4] = (head.y === 0 || snake.some(segment => segment.x === head.x && segment.y === head.y - 1)) ? 1 : 0; // Up
    state[5] = (head.y === rows - 1 || snake.some(segment => segment.x === head.x && segment.y === head.y + 1)) ? 1 : 0; // Down
    state[6] = (head.x === 0 || snake.some(segment => segment.x === head.x - 1 && segment.y === head.y)) ? 1 : 0; // Left
    state[7] = (head.x === cols - 1 || snake.some(segment => segment.x === head.x + 1 && segment.y === head.y)) ? 1 : 0; // Right

    // Snake Direction
    const neck = snake[1] || head; // Use neck to determine direction
    if (head.y < neck.y) state[8] = 1; // Moving up
    if (head.y > neck.y) state[9] = 1; // Moving down
    if (head.x < neck.x) state[10] = 1; // Moving left
    if (head.x > neck.x) state[11] = 1; // Moving rigth

    // Tail Direction
    if (tail.y < head.y) state[12] = 1; // Tail is above
    if (tail.y > head.y) state[13] = 1; // Tail is below
    if (tail.x < head.x) state[14] = 1; // Tail is to the left
    if (tail.x > head.x) state[15] = 1; // Tail is to the right
    
    return state;
};

const initQTable = (savedQTable) => {

    if (localStorage.getItem('QTable')) {
        console.log('QTable already exists in localStorage.');
        return;
    }

    if(savedQTable){
        initEGradient(-1);
        return localStorage.setItem('QTable', JSON.stringify(savedQTable));
    }

    const foodDirection = ["1,0,0,0", "0,1,0,0", "0,0,1,0", "0,0,0,1", "1,0,1,0", "1,0,0,1", "0,1,1,0", "0,1,0,1"];

    const obstacleDirection = [
        "0,0,0,0", "1,0,0,0", "0,1,0,0", "1,1,0,0", "0,0,1,0", "0,0,0,1", "0,0,1,1", "1,0,1,0", "1,0,0,1",
        "1,0,1,1", "0,1,1,0", "0,1,0,1", "0,1,1,1", "1,1,1,0", "1,1,0,1", "1,1,1,1"
    ];
    const snakeDirection = ["1,0,0,0", "0,1,0,0", "0,0,1,0", "0,0,0,1"];

    const tailDirection = ["1,0,0,0", "0,1,0,0", "0,0,1,0", "0,0,0,1", "1,0,1,0", "1,0,0,1", "0,1,1,0", "0,1,0,1"];

    const combine = (arrays) => {
        return arrays.reduce((acc, curr) => {
            return acc.flatMap(accItem => curr.map(currItem => [...accItem, currItem]));
        }, [[]]);
    };

    const allCombinations = combine([foodDirection, obstacleDirection, snakeDirection, tailDirection]);

    const actions = ['up', 'down', 'left', 'right'];
    const qTable = {};

    allCombinations.forEach(state => {
        const stateKey = state.join(',');
        qTable[stateKey] = actions.map(() => 0);
    });

    localStorage.setItem('QTable', JSON.stringify(qTable));
    initEGradient();
};

const initEGradient = (initValue) => {
    const e = localStorage.getItem("e");
    if (e) return;
    if (initValue) {
        return localStorage.setItem("e", initValue);
    }
    localStorage.setItem("e", 1);
}

const updateEGradient = () => {
    const e = localStorage.getItem("e");
    if (e && e > 0) {
        localStorage.setItem("e", e - eGradientMalus);
    }
}

const getMaxQvalueAction = (stateKey) => {
    const qTable = JSON.parse(localStorage.getItem('QTable'));
    if (qTable) {
        const maxIndex = qTable[stateKey].reduce((maxIdx, currentValue, currentIndex, arr) =>
            currentValue > arr[maxIdx] ? currentIndex : maxIdx, 0);

        return maxIndex;
    }
    console.log('No QTable in localStorage.');
}

const getUnexploredPath = (stateKey) => {
    const qTable = JSON.parse(localStorage.getItem('QTable'));
    if (qTable) {
        const unexpIndex = qTable[stateKey].reduce((unexpIdx, currentValue, currentIndex, arr) =>
            currentValue === 0 ? currentIndex : unexpIdx, null);

        return unexpIndex;
    }
    console.log('No QTable in localStorage.');
}

const getRandomAction = () => {
    const actions = [0, 1, 2, 3];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    return randomAction;
}

const chooseDirection = (stateKey) => {
    const direction = getMaxQvalueAction(stateKey);
    const e = localStorage.getItem("e");
    const unexpDir = getUnexploredPath(stateKey);

    if ((e < 0 || e === 0) && unexpDir !== null) {
        return unexpDir
    }

    if (Math.random() > e) {
        return direction;
    }

    return getRandomAction();
}

const getNextMaxQvalue = (stateKey) => {
    const qTable = JSON.parse(localStorage.getItem('QTable'));
    if (qTable) {
        const maxValue = qTable[stateKey].reduce((max, currentValue) =>
            currentValue > max ? currentValue : max, qTable[stateKey][0]);

        return maxValue;
    }
    console.log('No QTable in localStorage.');
}


const getReward = (oldSnake, oldFood, newSnake, newFood, isGameOver, foodEaten) => {
    const oldDistance = Math.abs(oldFood.x - oldSnake[0].x) + Math.abs(oldFood.y - oldSnake[0].y);
    const newDistance = Math.abs(newFood.x - newSnake[0].x) + Math.abs(newFood.y - newSnake[0].y);
    const distancesDiff = oldDistance - newDistance;

    let reward = 0;

    if (isGameOver) return reward -= 20;

    reward += foodEaten ? 20 : (5 * distancesDiff)/(newDistance/2);

    return reward;
};

const updateQTable = (stateKey, newStateKey, reward, action) => {
    const qTable = JSON.parse(localStorage.getItem('QTable'));
    try {
        const qValue = qTable[stateKey][action];
        const nextMaxQvalue = getNextMaxQvalue(newStateKey);
        const newQvalue = qValue + learningRate * (reward + (discountFactor * nextMaxQvalue) - qValue);

        const roundedNewQvalue = Math.round(newQvalue * 1000) / 1000
        qTable[stateKey][action] = roundedNewQvalue;
        localStorage.removeItem("QTable")
        localStorage.setItem("QTable", JSON.stringify(qTable));
        console.log("Q-Table updated!")

    } catch (error) {
        console.log(error)
    }
}

const qFunction = (snake, food, cols, rows) => {
    const currentState = getCurrentState(snake, food, cols, rows);
    const currentStateKey = currentState.join(",");
    const action = chooseDirection(currentStateKey);
    const direction = handleDirectionChange(action);
    const { newSnake, newFood, isGameOver, foodEaten } = update(snake, food, direction, cols, rows);
    const newState = getCurrentState(newSnake, newFood, cols, rows);
    const newStateKey = newState.join(",");
    const reward = getReward(snake, food, newSnake, newFood, isGameOver, foodEaten);
    updateQTable(currentStateKey, newStateKey, reward, action);
    updateEGradient();

    return { newSnake, newFood, isGameOver, foodEaten };
}

export const AI = {
    initQTable,
    initEGradient,
    qFunction,
    generateFoodPosition,
}