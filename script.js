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
});
