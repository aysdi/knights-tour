const visited = [];
let lastSquare = null;
let hasKnight = false;

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

    resetButton.addEventListener("click", () => {
        const knight = document.querySelector(".knight");
        if (knight) {
            knight.remove();
        }
        hasKnight = false;
        board.classList.remove("has-knight");
        clearHighlights();
        clearVisited();
        clearMessage();
    });


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
            showMessage("The knight has completed his Tour", true);
        }
    }
}


function placeKnight(square) {
    const knightImg = document.createElement("img");
    knightImg.src = "images/pixel-knight.png";
    knightImg.classList.add("knight");
    square.appendChild(knightImg);
}

function highlightLegalMoves(row, col) {
    clearHighlights();

    const knightMoves = [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];

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
                overlay.src = "images/highlightViable.png";
                overlay.classList.add("highlight-overlay");
                targetSquare.appendChild(overlay);
                anyMoves = true;
            }
        }
    });

    if (!anyMoves && visited.length < 63) {
        showMessage("No more legal moves. The tour is invalid.");
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



