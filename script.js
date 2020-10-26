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
      temp[i].push({ x: i, y: j, level: 0, pawn: null });
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
          return `<div data-x="${j.x}" data-y="${j.y}" class="tile ${j.pawn&&j.level===3 ? "winner":""}">
                ${j.pawn ? `<img class="game__pawn ${j.pawn.pawnId == choosenPawnId ? "active__pawn" : ""} " id="${j.pawn.pawnId}" src="${pawnSorce[j.pawn.pawnId]}" />` : ''}
                ${j.level === 1 ? `<div class="level level-1"></div>` : ''}
                ${j.level === 2 ? `<div class="level level-2"></div><div class="level level-1"></div>` : ''}
                ${j.level === 3 ? `<div class="level level-3"></div><div class="level level-2"></div><div class="level level-1"></div>` : ''}
                ${j.level === 4 ? `<div class="dome"></div><div class="level level-3"></div><div class="level level-2"></div><div class="level level-1"></div>` : ''}
            </div>`;
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
        "Phase 0: <br>PLACE THE PAWN <br><br>Place your pawn on an empty space of the board <br><br> click on choosen tile";
      break;
    case "movePawn":
      instruction =
        "Phase 1: MOVING <br><br>Pick up one pawn and make a move <br><br>click on choosen tile";
      break;
    case "tileOccupated":
      instruction = "THIS TILE IS ALREADY TAKEN <br><br> CHOOSE THE OTHER ONE";
      break;

    case "moveNotPossible":
      instruction = "THIS MOVE IS NOT POSSIBLE <br><br> CHOOSE THE OTHER ONE";
      break

    case "buildBlock":
      instruction =
        "Phase 2: BUILDING <br><br>Pick up one tile for build the block";
      break
      case "winning":
        instruction =
          "YOY WIN!";
        break
        case "gameOver":
          instruction =
            "";
          break
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
      position: { x, y },
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
  e.stopPropagation();

  pawns.forEach((pawn) => {
    if (pawn.pawnId == e.target.id && pawn.player == currentPlayerId) {
      const pawnsOnBoard = gameContainer.querySelectorAll(".game__pawn");
      pawnsOnBoard.forEach((pawn) => pawn.classList.remove("active__pawn"));
      e.target.classList.add("active__pawn");
      choosenPawnId = pawn.pawnId;
      gameContainer.addEventListener("mousemove", highlitTile)
    }
  });

  gameContainer.addEventListener("click", movePawn)
  gamePhase = 'pawnMove'
}

function chceckIfPawnsAreNotBlocked()

//winning conditions if any pawn have no possible move game over if no make a choosen move

function movePawn(e) {

 let target
  e.target.classList.contains('tile')? target=e.target: target = e.target.parentElement
  if (!checkIfMoveIsAllowed(target)) {
    displayGameInstruction(currentPlayerId, "moveNotPossible");
  } else {
    const x = pawns[choosenPawnId - 1].position.x
    const y = pawns[choosenPawnId - 1].position.y
    const newX = target.dataset.x
    const newY = target.dataset.y



    //pown array update
    pawns[choosenPawnId - 1].position.x = newX
    pawns[choosenPawnId - 1].position.y = newY

    //board update
    board[x][y].pawn = null
    board[newX][newY].pawn = pawns[choosenPawnId - 1]
    updateBoard()

    //winning conditions if pown is on 3rd level block:game over if no: go to next game phase - building, remove old and add new listeners for building phase
    if (board[newX][newY].level == 3) {
      gameOver(target)
    } else {
      gameContainer.removeEventListener("click", movePawn)
      displayGameInstruction(currentPlayerId, "buildBlock")
      gameContainer.addEventListener("click", buildBlock)
      gamePhase = "building"
    }
  }
}

function gameOver(winningBlock) {
  console.log(choosenPawnId)
  displayGameInstruction(currentPlayerId, "winning")
  gameContainer.removeEventListener("click", movePawn)
  gameContainer.removeEventListener("mousemove", highlitTile)
  console.log(winningBlock)
  winningBlock.classList.add('winner')
}


function buildBlock(e) {
  let target
  e.target.classList.contains('tile')? target=e.target: target = e.target.parentElement
  if (!checkIfMoveIsAllowed(target)) {
    displayGameInstruction(currentPlayerId, "moveNotPossible");
  } else {
    const x = target.dataset.x
    const y = target.dataset.y

    if (board[x][y].level < 4) {
      board[x][y].level++
    } else {
      displayGameInstruction(currentPlayerId, "moveNotPossible")
    }
    choosenPawnId = undefined
    updateBoard()
    gameContainer.removeEventListener("mousemove", highlitTile)
    gameContainer.removeEventListener("click", buildBlock)
    changePlayerId()
    gamePhase = 'pawnMove'
    displayGameInstruction(currentPlayerId, "movePawn");
    choosePawn()
  }
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
      const pawnX = parseInt(pawns[choosenPawnId - 1].position.x);
      const pawnY = parseInt(pawns[choosenPawnId - 1].position.y);
      if (board[tileX][tileY].pawn === null &&
        verifyIfTileIsNextToPawn(tileX, tileY, pawnX, pawnY) &&
        board[tileX][tileY].level - board[pawnX][pawnY].level < 2)
        return true
      break

      //phase2 - building
    case "building":
      const pawnXb = parseInt(pawns[choosenPawnId - 1].position.x);
      const pawnYb = parseInt(pawns[choosenPawnId - 1].position.y);
      if (board[tileX][tileY].pawn === null && verifyIfTileIsNextToPawn(tileX, tileY, pawnXb, pawnYb)) return true

      break
  }
}

function verifyIfTileIsNextToPawn(tileX, tileY, pawnX, pawnY) {
  if (board[tileX][tileY].x == (pawnX + 1) && board[tileX][tileY].y == (pawnY - 1) ||
    board[tileX][tileY].x == (pawnX + 1) && board[tileX][tileY].y == pawnY ||
    board[tileX][tileY].x == (pawnX + 1) && board[tileX][tileY].y == (pawnY + 1) ||
    board[tileX][tileY].x == pawnX && board[tileX][tileY].y == (pawnY - 1) ||
    board[tileX][tileY].x == pawnX && board[tileX][tileY].y == (pawnY + 1) ||
    board[tileX][tileY].x == (pawnX - 1) && board[tileX][tileY].y == (pawnY - 1) ||
    board[tileX][tileY].x == (pawnX - 1) && board[tileX][tileY].y == (pawnY) ||
    board[tileX][tileY].x == (pawnX - 1) && board[tileX][tileY].y == (pawnY + 1)) return true
}


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
  displayGameInstruction(currentPlayerId, "gameOver")
  pawns = [];
  gameStarted = false;
  pawnPlacementCounter = 0;
  currentPlayerId = 0;
  gamePhase = "";
  choosenPawnId = undefined;
  gameContainer.innerHTML = "";
  pawnImages.forEach((pawn) => {
    pawn.classList.remove("pawn-used");
    pawn.classList.remove("pawn-active");
  });
  startGame()
}



startGameButton.addEventListener("click", startGame);
