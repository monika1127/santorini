const gameContainer = document.querySelector(".container");
const startGameButton = document.querySelector(".game__start-button");
const instructionPanels = document.querySelectorAll(".instruction");
const pawnImages = document.querySelectorAll(".pawn__image");

let board;
let pawns = [];
let currentPlayerId = 0;
let pawnPlacementCounter = 0;
let gameStarted;
let gamePhase;
let choosenPawnId;

const pawnSorce = {
  1: "./icons/SVG/man-player1.svg",
  2: "./icons/SVG/man-player2.svg",
  3: "./icons/SVG/woman-player1.svg",
  4: "./icons/SVG/woman-player2.svg",
};

function changePlayerId() {
  currentPlayerId = (currentPlayerId + 1) % 2;
}

function createBoard() {
  let temp = [];
  for (let i = 0; i < 5; i++) {
    temp.push([]);
    for (let j = 0; j < 5; j++) {
      temp[i].push({ x: i, y: j, level: 0, dome: false, pawn: null });
    }
  }
  board = temp;
}

function drawBoard() {
  const boardHtml = board
    .map((i) =>
      i
        .map((j) => `<div data-x="${j.x}" data-y="${j.y}" class="tile"></div>`)
        .join("")
    )
    .join("");
  gameContainer.innerHTML = boardHtml;
}

function updateBoard() {
  const boardHtml = board
    .map((i) =>
      i
        .map((j) => {
          if (j.pawn === null) {
            return `<div data-x="${j.x}" data-y="${j.y}" class="tile"></div>`;
          } else {
            return `<div data-x="${j.x}" data-y="${j.y}" class="tile">
                <img class="game__pawn" id="${j.pawn.pawnId}" src="${
              pawnSorce[j.pawn.pawnId]
            }" />
            </div>`;
          }
        })
        .join("")
    )
    .join("");
  gameContainer.innerHTML = boardHtml;
}

function displayGameInstruction(playerId, gamePhase) {
  let instruction;
  switch (gamePhase) {
    case "placePawn":
      instruction =
        "Place your pawn on an empty space of the board - click on choosen tile";
      break;
    case "movePawn":
      instruction =
        "Phase 1: building <br>pick up one pawn and make a move - click on choosen tile";
      break;
    case "tileOccupated":
      instruction = "THIS TILE IS ALREADY TAKEN - CHOOSE THE EMPTY ONE";
      break;
  }
  instructionPanels.forEach(
    (panel) =>
      (panel.innerHTML = panel.id == playerId ? `<p>${instruction}</p>` : "")
  );
}

//phase0 pawn placement on board
function placePawns(event) {
  const tile = event.target;
  if (!tile.classList.contains("tile")) return;
  if (!checkIfMoveIsAllowed(tile)) {
    displayGameInstruction(currentPlayerId, "tileOccupated");
  } else {
    const { x, y } = tile.dataset;
    const pawn = {
      pawnId: pawnPlacementCounter,
      postion: { x, y },
      player: currentPlayerId,
    };
    pawns.push(pawn);
    board[x][y].pawn = pawn;
    updateBoard();
    placedPawnHighlit();
    if (pawns.length == 4) {
      gameContainer.removeEventListener("click", placePawns);
      gameContainer.removeEventListener("mousemove", highlitTile);
      changePlayerId();
      displayGameInstruction(currentPlayerId, "movePawn");
      choosePawn();
      gamePhase = "pawnMove";
    } else {
      changePlayerId();
      displayGameInstruction(currentPlayerId, "placePawn");
    }
  }
}
//highlite ande remove pawn from player container - use only in first phase - pawn placement on board
function placedPawnHighlit() {
  pawnImages.forEach((image) =>
    image.id == pawnPlacementCounter ? image.classList.add("pawn-used") : ""
  );
  pawnPlacementCounter = pawnPlacementCounter + 1;
  pawnImages.forEach((image) =>
    image.id == pawnPlacementCounter ? image.classList.add("pawn-active") : ""
  );
}

function choosePawn() {
  const pawnsOnBoard = gameContainer.querySelectorAll(".game__pawn");
  pawnsOnBoard.forEach((pawn) => pawn.addEventListener("click", highlitPawn));
}

function highlitPawn(e) {
  const pawnsOnBoard = gameContainer.querySelectorAll(".game__pawn");
  pawnsOnBoard.forEach((pawn) => pawn.classList.remove("active__pawn"));

  pawns.forEach((pawn) => {
    if (pawn.pawnId == e.target.id && pawn.player == currentPlayerId) {
      e.target.classList.add("active__pawn");
      choosenPawnId = pawn.pawnId;
    }
  });

  gamePhase = 'pawnMove'
}

function highlitTile(e) {
  let activeTile = e.target;
  if (!activeTile.classList.contains("tile")) return;
  if (!checkIfMoveIsAllowed(activeTile)) return;
  activeTile.classList.add("active-tile");
  activeTile.addEventListener("mouseleave", () =>
    activeTile.classList.remove("active-tile")
  );
}

function checkIfMoveIsAllowed(selectedTile) {
  const { x: tileX, y: tileY } = selectedTile.dataset;
  //pawn placement phase
  switch (gamePhase) {
    case "pawnPlacement":
      return board[tileX][tileY].pawn === null;
    //phase1 - move
    case "pawnMove":
      const { x: pawnX, y: pawnY } = pawns[choosenPawnId];
      // if ()



      //x+1:  y-1 | y | y+1
      //x:    y-1 |  y+1
      //x11:  y-1 | y | y+1
      // brak innego pionka board[selectedTile.dataset.x][selectedTile.dataset.y].pawn == null

      break;
  }
}

// function movePawn(){
//     dodaj komunikat dla graczy
//     ruszamy pionkiem
//     removeEventListener('click', movePawn)
//     checkIfWin
//     addEventListener('click', buildHouse)
// }

// function buildHouse() {
//     dodaj komunikat dla graczy
//     budujemy
//     removeEventListener('click', buildHouse)
//     change currentPlayerId
//     addEventListener('click', movePawn)
// }

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gamePhase = "pawnPlacement";
    startGameButton.innerHTML = "RE-START GAME";
    createBoard();
    drawBoard();
    window.setTimeout(() => {
      displayGameInstruction(currentPlayerId, "placePawn");
      placedPawnHighlit();
      gameContainer.addEventListener("mousemove", highlitTile);
      gameContainer.addEventListener("click", placePawns);
    }, 200);
  } else {
    reStartGame();
  }
}

function reStartGame() {
  pawns = [];
  player1Active = true;
  gameStarted = false;
  pawnPlacementCounter = 0;
  currentPlayerId = 0;
  gamePhase = "";
  gameContainer.innerHTML = "";
  pawnImages.forEach((pawn) => {
    pawn.classList.remove("pawn-used");
    pawn.classList.remove("pawn-active");
  });
  startGameButton.innerHTML = "START GAME";
}

startGameButton.addEventListener("click", startGame);
