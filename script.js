let board = [ // 2d array
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','',''],
    ['','','','','','','','','']
];

let pressedCount = 0;
let play = false;

// x = col, y = row

function checkWin() {
    if (pressedCount === 71) {
        play = false;
        document.getElementById("result").textContent = "You won!!!";
        document.getElementById("result").style.display = "block";
    }
    return;
}


function updatePress(id) {
    id.classList.add("pressed")
    pressedCount+=1; // for some reason when i had it as pressedCount++; the count would get wrong and the player would win prematurely
    console.log("pressed count: " + pressedCount);
    checkWin();
}

const directions = [
    [-1, 1], [0,1],  [1,1],
    [-1, 0],         [1,0],
    [-1,-1], [0,-1], [1,-1]
]

// const directionsAdj = [
//            [0,1],
//     [-1,0],      [1,0]
//            [0,-1]
// ]

function squareCoords(input) {
    index = input.id - 1;
    row = Math.floor(index / 9);
    col = index % 9;

    return [col, row];
}
function coordsToId(coords) {
    let col = coords[0];
    let row = coords[1];

    let id = (row * 9) + col + 1;

    return id.toString();
}

function press(input) {
    if (play) {
        if (input.textContent !== "F") {
            let coords = squareCoords(input);

            let row = coords[1];
            let col = coords[0];

            coordsToId(coords);
            if (board[col][row] === "M") {
                input.classList.add("bomb");
                document.getElementById("result").textContent = "You lose :o";
                document.getElementById("result").style.display = "block";
                play = false;
            }
            else {
                let mineCount = adjacentMineCount(coords);

                if (mineCount === 0) {
                    revealEmptySquares([col, row]);
                }
                else {
                    if (!input.classList.contains("pressed")) {
                        updatePress(input);
                    }
                    // checkWin(pressedCount);
                    input.textContent = mineCount;
                }
            }
            // document.getElementById("debug").textContent = squareCoords(input);
        }
    }
}

function flag(input, event) {;
    if (play) {
        event.preventDefault();

        if (input.classList.contains("pressed")) return false;

        if (input.textContent === "F") {
            input.textContent = "";
            document.getElementById("mineCount").textContent++;
            input.classList.remove("flagged");
        }
        else {
            input.textContent = "F";

            document.getElementById("mineCount").textContent--;
            input.classList.add("flagged");
        }
        return false;
    }
}

function resetGame() {
    play = false;
    pressedCount = 0;
    document.getElementById("parentDiv").querySelectorAll(':scope > *').forEach(child => {
        child.classList.remove("pressed");
        child.classList.remove("bomb");
        child.textContent = "";
    })
    document.getElementById("mineCount").textContent = "10";
    // document.getElementById("debug").textContent = "";
    document.getElementById("result").style.display = "block";
    document.getElementById("result").textContent = 'Press "Minesweeper" to start!'

    board = [['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','',''],['','','','','','','','','']];
}

function startGame() {
    let mines = [];
    resetGame();
    document.getElementById("result").style.display = "none";
    play = true;
    while (mines.length < 10) {
        let randoRow = Math.floor(Math.random() * 9); // y coordinate
        let randoCol = Math.floor(Math.random() * 9); // x coordinate

        if (!(board[randoCol][randoRow] === "M")) {
            mines.push([randoCol, randoRow]);
            board[randoCol][randoRow] = "M";
        }
    }
    
    // document.getElementById("debug").textContent = mines;
}

// function change() {
//     document.getElementById("debug").textContent = board;
// }

function adjacentMineCount(square) {
    let x = square[0]; // col number
    let y = square[1]; // row number

    let adjMineCount = 0;
    for (let adjSquare of directions) {
        let newX = x + adjSquare[0];
        let newY = y + adjSquare[1];

        if (newX >= 0 && newX < 9 && newY >= 0 && newY < 9) {
            if (board[newX][newY] === "M") {
                adjMineCount++;
            }
        }
    }
    return adjMineCount;
}

function revealEmptySquares(square) {
    let col = square[0];
    let row = square[1];

    let visitedSquares = new Set();

    function recursivePart(x, y) {
        if (x < 0 || y < 0 || x > 8 || y > 8) return;

        let key = x + "," + y;

        if (visitedSquares.has(key)) return;
        visitedSquares.add(key);

        let squareId = coordsToId([x,y]);
        let squareDiv = document.getElementById(squareId);

        if (squareDiv.textContent === "F") return;

        if (!squareDiv.classList.contains("pressed")) {
            updatePress(squareDiv);
        }
        // checkWin(pressedCount);

        let mineCount = adjacentMineCount([x,y]);

        if (mineCount > 0) {
            squareDiv.textContent = mineCount;
            return;
        }

        for ( let direction of directions) {
            let newX = x + direction[0];
            let newY = y + direction[1];

            recursivePart(newX,newY);
        }
    }
    recursivePart(col, row);
}