const gameContainer = document.querySelector('.container')
const startGameButton = document.querySelector('.game__start-button')
const instructionPanels = document.querySelectorAll('.instruction')
const pownImages = document.querySelectorAll('.pown__image')


let board;
let pawns = []
let player1Active = true;
let currentPlayerId = 1
let pownPlacementCounter = 0
let moveAllow
let gameStarted
let gamePhase

const pownSorce = {
    1: './icons/SVG/man-player1.svg',
    2: './icons/SVG/man-player2.svg',
    3: './icons/SVG/woman-player1.svg',
    4: './icons/SVG/woman-player2.svg'
}

function changePlayerId() {
    player1Active = !player1Active
    player1Active ? currentPlayerId = 1 : currentPlayerId = 2
}

function createBoard() {
    let temp = []
    for (let i = 0; i < 5; i++) {
        temp.push([])
        for (let j = 0; j < 5; j++) {
            temp[i].push({ x: i, y: j, level: 0, dome: false, pawn: null })
        }
    }
    board = temp
}

function drawBoard() {
    const boardHtml = board.map((i) => i.map((j) => `<div data-x="${j.x}" data-y="${j.y}" class="tile"></div>`).join('')).join('')
    gameContainer.innerHTML = boardHtml
}

function updateBoard() {
    const boardHtml = board.map((i) => i.map((j) => {
        if (j.pawn === null) {
            return `<div data-x="${j.x}" data-y="${j.y}" class="tile"></div>`
        } else {
            return `<div data-x="${j.x}" data-y="${j.y}" class="tile">
                <img class="game__pawn" id="${j.pawn.pawnId}" src="${pownSorce[j.pawn.pawnId]}" />
            </div>`}
    }).join('')).join('')
    gameContainer.innerHTML = boardHtml
}

function displayGameInstruction(playerId, gamePhase) {
    let instruction
    instructionPanels.forEach((panel) => panel.innerHTML = "")
    switch (gamePhase) {
        case 'placePawn':
            instruction = "Place your pawn on an empty space of the board - click on choosen tile"
            instructionPanels.forEach((panel) => panel.id == playerId ? panel.innerHTML = `<p>${instruction}</p>` : "")
            break
        case 'movePawn':
            instruction = "Phase 1: building <br>pick up one pawn and make a move - click on choosen tile"
            instructionPanels.forEach((panel) => panel.id == playerId ? panel.innerHTML = `<p>${instruction}</p>` : "")
            break
        case 'tileOccupated':
            instruction = "THIS TILE IS ALREADY TAKEN - CHOOSE THE EMPTY ONE"
            instructionPanels.forEach((panel) => panel.id == playerId ? panel.innerHTML = `<p>${instruction}</p>` : "")
    }
}


//phase0 pown placement on board
function placePawns(event) {
    const tile = event.target
    if (!tile.classList.contains('tile')) return
    checkIfMoveIsAllowed(tile)
    if (!moveAllow) {
        displayGameInstruction(currentPlayerId, 'tileOccupated')
    } else {
        const { x, y } = tile.dataset
        const pawn = { pawnId: pownPlacementCounter, postion: { x, y }, player: currentPlayerId }
        pawns.push(pawn)
        board[x][y].pawn = pawn
        updateBoard()
        placedPownHighlit()
        if (pawns.length == 4) {
            gameContainer.removeEventListener('click', placePawns)
            gameContainer.removeEventListener('mousemove', highlitTile)
            changePlayerId()
            displayGameInstruction(currentPlayerId, 'movePawn')
            choosePawn()
            gamePhase = 'pawnMove'

        } else {
            changePlayerId()
            displayGameInstruction(currentPlayerId, 'placePawn')
        }
    }
}
//highlite ande remove pown from player container - use only in first phase - pown placement on board
function placedPownHighlit() {
    pownImages.forEach((image) => image.id == pownPlacementCounter ? image.classList.add("pown-used") : "")
    pownPlacementCounter = pownPlacementCounter + 1
    pownImages.forEach((image) => image.id == pownPlacementCounter ? image.classList.add("pown-active") : "")
}


function choosePawn() {
    const pawnsOnBoard = gameContainer.querySelectorAll('.game__pawn')
    pawnsOnBoard.forEach((pawn) => pawn.addEventListener('click', highlitPawn))
}


function highlitPawn(e) {
    e.target.classList.add('active__pawn')
    let choosenPawn
    pawns.forEach((pawn)=>{
        if(pawn.pawnId == e.target.id){
        choosenPawn = pawn.postion
       return choosenPawn}})
    checkIfMoveIsAllowed(choosenPawn)
    // const {x,y} = pawns.pawnId[e.target.id]
    // console.log(x,y)


}

function highlitTile(e) {
    let activeTile = e.target
    if (!activeTile.classList.contains('tile')) return
    checkIfMoveIsAllowed(activeTile)
    if (!moveAllow) return
    activeTile.classList.add('active-tile')
    activeTile.addEventListener('mouseleave', () => activeTile.classList.remove('active-tile'))
}

function checkIfMoveIsAllowed(selectedTile) {

    //pown placement phase
    switch (gamePhase) {
        case 'pawnPlacement':
            board[selectedTile.dataset.x][selectedTile.dataset.y].pawn == null ? moveAllow = true : moveAllow = false
            //phase1 - move
            break
        case 'pawnMove':
            console.log("trututu")
        break
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
        gamePhase = 'pawnPlacement'
        startGameButton.innerHTML = "RE-START GAME"
        createBoard()
        drawBoard()
        window.setTimeout(() => {
            displayGameInstruction(currentPlayerId, 'placePawn')
            placedPownHighlit()
            gameContainer.addEventListener('mousemove', highlitTile)
            gameContainer.addEventListener('click', placePawns)
        }
            , 200)
    } else {
        reStartGame()
    }
}

function reStartGame() {
    pawns = []
    player1Active = true;
    gameStarted = false
    pownPlacementCounter = 0
    currentPlayerId = 1
    moveAllow = true
    gamePhase = ''
    gameContainer.innerHTML = ""
    pownImages.forEach((pawn) => {
        pawn.classList.remove("pown-used")
        pawn.classList.remove("pown-active")
    })
    startGameButton.innerHTML = "START GAME"
}

startGameButton.addEventListener('click', startGame)
