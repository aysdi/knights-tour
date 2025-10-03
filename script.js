const visited = [];
let lastSquare = null;
let hasKnight = false;
let animationTimeout = null;
const knightMoves = [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2]
];

document.addEventListener("DOMContentLoaded", () => {
    const board = document.querySelector(".board");
    for (let i = 7; i >= 0; i--) {
        for (let j = 0; j < 8; j++) {
            var square = document.createElement("div");
            square.classList.add("square");

            if ((i + j) % 2) {
                square.classList.add("black");
            } else {
                square.classList.add("white");
            }

            let file = String.fromCharCode(65 + j);
            let rank = i + 1;
            let pos = file + rank;

            square.dataset.row = i;
            square.dataset.col = j;
            square.dataset.pos = pos;

            board.appendChild(square);
        }
    }

    const resetButton = document.getElementById("reset-button");
    const solveButton = document.getElementById("solve-button");
    
    resetButton.addEventListener("click", () => {
        if (animationTimeout) {
            clearTimeout(animationTimeout);
            animationTimeout = null;
        }

        const knight = document.querySelector(".knight");
        if (knight) {
            knight.remove();
        }
        hasKnight = false;
        board.classList.remove("has-knight");
        solveButton.classList.add("hidden");
        clearHighlights();
        clearVisited();
        clearMessage();
    });
    
    solveButton.addEventListener("click", () => {
        solve();
    })


    board.addEventListener("click", (event) => {
        const square = event.target.closest(".square");
        if (!square) return;

        if (hasKnight && !square.classList.contains("highlight")) {
            return;
        }

        const knight = document.querySelector(".knight");
        if (knight) {
            knight.remove();
        }
        
        placeKnight(square);
        hasKnight = true;
        board.classList.add("has-knight");
        solveButton.classList.remove("hidden");

        if (lastSquare && !isSquareVisited(lastSquare)) {
            visitSquare(lastSquare);
        }

        lastSquare = square;
        const row = Number(square.dataset.row);
        const col = Number(square.dataset.col);
        highlightLegalMoves(row, col);
    });

});

function visitSquare(square) {
    const alreadyVisited = visited.some(
        (entry) => entry.pos === square.dataset.pos
    );

    if (!alreadyVisited) {
        const moveNumber = visited.length + 1;

        visited.push({
            pos: square.dataset.pos,
            row: Number(square.dataset.row),
            col: Number(square.dataset.col),
            moveNumber: moveNumber
        });

        square.classList.add("visited");

        const label = document.createElement("span");
        label.classList.add("move-number");
        label.textContent = moveNumber;

        square.appendChild(label);

        if (visited.length === 64) {
            showMessage("the knight has completed his tour", true);
        }
    }
}


function placeKnight(square) {
    const knightImg = document.createElement("img");
    knightImg.src = "assets/pixel-knight.png";
    knightImg.classList.add("knight");
    square.appendChild(knightImg);
}

function highlightLegalMoves(row, col) {
    clearHighlights();

    let anyMoves = false;

    knightMoves.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const selector = `.square[data-row="${newRow}"][data-col="${newCol}"]`;
            const targetSquare = document.querySelector(selector);
            if (targetSquare && !isSquareVisited(targetSquare)) {
                targetSquare.classList.add("highlight");
                const overlay = document.createElement("img");
                overlay.src = "assets/highlightViable.png";
                overlay.classList.add("highlight-overlay");
                targetSquare.appendChild(overlay);
                anyMoves = true;
            }
        }
    });

    if (!anyMoves && visited.length < 63) {
        showMessage("no more legal moves. the tour is invalid.");
    }
}

function clearHighlights() {
    document.querySelectorAll(".highlight-overlay").forEach(overlay => {
        overlay.remove();
    });
    document.querySelectorAll(".square.highlight").forEach(square => {
        square.classList.remove("highlight");
    });
}


function isSquareVisited(square) {
    return visited.some(entry => entry.pos === square.dataset.pos);
}

function clearVisited() {
    document.querySelectorAll(".move-number").forEach(label => {
        label.remove();
    });

    visited.length = 0;
    lastSquare = null;
}

function showMessage(text, isSuccess = false) {
    const messageBox = document.getElementById("message");
    messageBox.textContent = text;

    if (isSuccess) {
        messageBox.classList.remove("error");
        messageBox.classList.add("success");
    } else {
        messageBox.classList.remove("success");
        messageBox.classList.add("error");
    }
}


function clearMessage() {
    const messageBox = document.getElementById("message");
    messageBox.textContent = "";
}

function solve() {
    const n = 8;
    const board = Array.from({ length: n }, () => Array(n).fill(-1));

    const start = lastSquare;
    if (!start) {
        showMessage("place the knight before solving.");
        return;
    }

    const startX = Number(start.dataset.row);
    const startY = Number(start.dataset.col);
    board[startX][startY] = 0;

    const startRow = Number(lastSquare.dataset.row);
    const startCol = Number(lastSquare.dataset.col);

    const result = knightTourUtil(startRow, startCol, 1, 8, board);
    if (result) {
        showMessage("knight's tour solution found!", true);
        animateKnightTour(board);
    } else {
        showMessage("no solution exists from this position.", false);
    }


}

function knightTourUtil(x, y, step, n, board) {
    if (step === n * n) return true;

    const moves = getSortedMoves(board, x, y, n);

    for (let move of moves) {
        const dirIndex = move[1];
        const dx = knightMoves[dirIndex][0];
        const dy = knightMoves[dirIndex][1];
        const nx = x + dx;
        const ny = y + dy;

        board[nx][ny] = step;
        if (knightTourUtil(nx, ny, step + 1, n, board)) return true;

        board[nx][ny] = -1;
    }

    return false;
}

function getSortedMoves(board, x, y, n) {
    const moveList = [];

    for (let i = 0; i < knightMoves.length; i++) {
        const dx = knightMoves[i][0];
        const dy = knightMoves[i][1];
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && ny >= 0 && nx < n && ny < n && board[nx][ny] === -1) {
            const options = countOptions(board, nx, ny, n);
            moveList.push([options, i]);
        }
    }

    return moveList.sort((a, b) => a[0] - b[0]);
}

function countOptions(board, x, y, n) {
    let count = 0;

    for (let i = 0; i < knightMoves.length; i++) {
        const dx = knightMoves[i][0];
        const dy = knightMoves[i][1];
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && ny >= 0 && nx < n && ny < n && board[nx][ny] === -1) {
            count++;
        }
    }

    return count;
}

function animateKnightTour(solutionBoard) {
    const boardElement = document.querySelector(".board");
    
    const existingKnight = document.querySelector(".knight");
    if (existingKnight) {
        existingKnight.remove();
    }
    
    const sortedSteps = [];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const step = solutionBoard[row][col];
            if (step !== -1) {
                sortedSteps[step] = { row, col };
            }
        }
    }

    let step = 0;
    const totalSteps = sortedSteps.length;

    const knight = document.createElement("img");
    knight.src = "assets/pixel-knight.png";
    knight.classList.add("knight");
    boardElement.appendChild(knight);

    function moveNext() {
        if (step >= totalSteps) {
            showMessage("knight's tour animation complete!", true);
            return;
        }

        const { row, col } = sortedSteps[step];
        const square = document.querySelector(
            `.square[data-row="${row}"][data-col="${col}"]`
        );

        square.appendChild(knight);

        const label = document.createElement("span");
        label.classList.add("move-number");
        label.textContent = step + 1;
        square.appendChild(label);

        square.classList.add("visited");

        step++;
        animationTimeout = setTimeout(moveNext, 200);
    }

    clearHighlights();
    clearVisited();
    clearMessage();
    hasKnight = true;
    boardElement.classList.add("has-knight");

    moveNext();
}
