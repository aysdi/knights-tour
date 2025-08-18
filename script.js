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
            let rank = i+1; 
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
    });

    board.addEventListener("click", (event) => {
        if (event.target.classList.contains("square")) {
            const knight = document.querySelector(".knight");
            if (knight) {
                knight.remove();
            }
            
            placeKnight(event.target);
        }
    });

});

function placeKnight(square) {
    const knightImg = document.createElement("img");
    knightImg.src = "pixel-knight.png";
    knightImg.classList.add("knight");
    square.appendChild(knightImg);
}

