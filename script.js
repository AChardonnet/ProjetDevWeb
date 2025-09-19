let sizeX = 9;
let sizeY = 9;
let numberBombs = 10;
let bombsLeft = numberBombs;
let cellsHidden = sizeX * sizeY;
let maxBombs = sizeX * sizeY - 1;

const gameBoard = document.getElementById("gameBoard");
const bombsLeftBox = document.getElementById("bombsLeft");
const cellsLeftBox = document.getElementById("cellsLeft");

const lengthInput = document.getElementById('lengthInput');
const heightInput = document.getElementById('heightInput');
const minesInput = document.getElementById('minesInput');

lengthInput.addEventListener('input', updateLength);
heightInput.addEventListener('input', updateHeight);
minesInput.addEventListener('input', updateMines);

lengthInput.value = sizeX;
heightInput.value = sizeY;
minesInput.value = numberBombs;

function updateLength() {
    sizeX = parseInt(lengthInput.value, 10) || 0;
    if (sizeX < 2) {
        sizeX = 2;
    } else if (sizeX > 42) {
        sizeX = 42;
    }
    maxBombs = sizeX * sizeY - 1;
    if (numberBombs > maxBombs) {
        numberBombs = maxBombs;
        minesInput.value = maxBombs;
    }
    initializeGame()
}
function updateHeight() {
    sizeY = parseInt(heightInput.value, 10) || 0;
    if (sizeY < 2) {
        sizeY = 2;
    } else if (sizeY > 42) {
        sizeY = 42;
    }
    maxBombs = sizeX * sizeY - 1;
    if (numberBombs > maxBombs) {
        numberBombs = maxBombs;
        minesInput.value = maxBombs;
    }
    initializeGame()
}
function updateMines() {
    numberBombs = parseInt(minesInput.value, 10) || 0;
    if (numberBombs < 0) {
        numberBombs = 0;
    }
    maxBombs = sizeX * sizeY - 1;
    if (numberBombs > maxBombs) {
        numberBombs = maxBombs;
        minesInput.value = maxBombs;
    }
    initializeGame()
}

function newGame(numberBombs, sizeX, sizeY) {
    board = newBoard(sizeX, sizeY)
    bombs = randomBombs(numberBombs, sizeX, sizeY)
    board = placeBombs(board, bombs)
    board = countBoard(board, sizeX, sizeY)
    return board
}

function placeBombs(board, bombs) {
    for (let i = 0; i < bombs.length; i++) {
        x = bombs[i][0]
        y = bombs[i][1]
        board[y][x].isBomb = true
    }
    return board
}

function countNeighbours(board, x, y, sizeX, sizeY) {
    if (x == 0) {
        xmin = 0
        xmax = 1
    } else if (x == sizeX - 1) {
        xmin = x - 1
        xmax = x
    } else {
        xmin = x - 1
        xmax = x + 1
    }
    if (y == 0) {
        ymin = 0
        ymax = 1
    } else if (y == sizeY - 1) {
        ymin = y - 1
        ymax = y
    } else {
        ymin = y - 1
        ymax = y + 1
    }
    count = 0
    for (let i = ymin; i <= ymax; i++) {
        for (let j = xmin; j <= xmax; j++) {
            if (!(i == y && j == x)) {
                if (board[i][j].isBomb) {
                    count++
                }
            }
        }
    }
    board[y][x].count = count
    return board
}

function countBoard(board, sizeX, sizeY) {
    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            board = countNeighbours(board, j, i, sizeX, sizeY)
        }
    }
    return board
}

function newBoard(sizeX, sizeY) {
    board = newMatrix(sizeX, sizeY);
    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            board[i][j] = {
                isBomb: false,
                isRevealed: false,
                isFlagged: false,
                count: 0,
            }
        }
    }
    return board
}

function newArray(size) {
    array = new Array();
    for (let i = 0; i < size; i++) {
        array.push(0);
    }
    return array;
}

function newMatrix(sizeX, sizeY) {
    matrix = new Array();
    for (let i = 0; i < sizeY; i++) {
        matrix.push(newArray(sizeX));
    }
    return matrix;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isElementInList(list, element) {
    isIn = false
    for (let i = 0; i < list.length && !isIn; i++) {
        if (list[i][0] == element[0] && list[i][1] == element[1]) {
            isIn = true
        }
    }
    return isIn
}

function randomBombs(number, sizeX, sizeY) {
    bombs = new Array()
    while (bombs.length < number) {
        x = randomInt(0, sizeX - 1)
        y = randomInt(0, sizeY - 1)
        bomb = [x, y]
        console.log(bombs.length)
        console.log(bomb)
        if (!isElementInList(bombs, bomb)) {
            bombs.push(bomb)
        }
    }
    return bombs
}

function flagCell(board, x, y, sizeX, sizeY) {
    if (board[y][x].isFlagged) {
        bombsLeft += 1;
    } else {
        bombsLeft += -1;
    }
    board[y][x].isFlagged = !board[y][x].isFlagged;
    renderBoard(board, sizeX, sizeY)
}

function renderBoard(board, sizeX, sizeY) {
    console.log("rendering board")
    gameBoard.innerHTML = ""
    bombsLeftBox.innerHTML = "Mines Left: " + bombsLeft
    cellsLeftBox.innerHTML = "Cells Left: " + cellsHidden

    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            const cell = document.createElement("div")
            cell.className = "cell";
            if (board[i][j].isFlagged) {
                cell.classList.add('flagged')
            } else if (board[i][j].isRevealed) {
                cell.classList.add('revealed')
                if (board[i][j].isBomb) {
                    cell.classList.add('bomb')
                } else if (board[i][j].count > 0) {
                    cell.textContent = board[i][j].count
                }
            }
            cell.addEventListener("click", () => {
                board = revealCell(board, j, i, sizeX, sizeY);
            });
            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                board = flagCell(board, j, i, sizeX, sizeY);

            });
            gameBoard.appendChild(cell)
        }
        gameBoard.appendChild(document.createElement("br"))
    }
}

function revealAllBoard(board, sizeX, sizeY) {
    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            board[i][j].isRevealed = true
        }
    }
    return board
}

function revealCell(board, x, y, sizeX, sizeY) {
    if (x < 0 || x >= sizeX || y < 0 || y >= sizeY || board[y][x].isRevealed || board[y][x].isFlagged) {
        return board
    }
    renderBoard(board, sizeX, sizeY);
    lost = false;
    if (board[y][x].isBomb) {
        board = revealAllBoard(board, sizeX, sizeY);
        renderBoard(board, sizeX, sizeY);
        lost = true;
        setTimeout(() => {
            alert("Game Over!");
        }, 0);
    }
    board[y][x].isRevealed = true
    cellsHidden += -1;
    if (board[y][x].count == 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                console.log(x + " " + y + " revealing " + x + j + " " + y + i)
                board = revealCell(board, x + j, y + i, sizeX, sizeY)
            }
        }
    }
    renderBoard(board, sizeX, sizeY)
    if (cellsHidden == numberBombs && !lost) {
        lost = true
        setTimeout(() => {
            alert("GG EZ !");
        }, 0);
    }
    return board
}

function initializeGame() {
    bombsLeft = numberBombs;
    cellsHidden = sizeX * sizeY;

    board = newGame(numberBombs, sizeX, sizeY)
    renderBoard(board, sizeX, sizeY)
}

function presetEasy() {
    numberBombs = 10;
    sizeX = 9;
    sizeY = 9;

    lengthInput.value = 9;
    heightInput.value = 9;
    minesInput.value = 10;

    initializeGame();
}

function presetMedium() {
    numberBombs = 40;
    sizeX = 16;
    sizeY = 16;

    lengthInput.value = 16;
    heightInput.value = 16;
    minesInput.value = 40;

    initializeGame();
}

function presetHard() {
    numberBombs = 99;
    sizeX = 30;
    sizeY = 16;

    lengthInput.value = 30;
    heightInput.value = 16;
    minesInput.value = 99;

    initializeGame();
}

initializeGame()