var origBoard;
const player1 = 'O';
const playerAI = 'X';
const winCombos =[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]
var i;

const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector(".endGame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    
    for ( i = 0; i < cells.length; i ++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square){
    if(typeof origBoard[square.target.id] == 'number'){
        turn(square.target.id, player1);
        if(!checkTie()) turn(bestSpot(), playerAI);
    }
} 

function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player){
    let plays = board.reduce((a, e, i) =>
    (e == player) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){
        if(win.every(elem =>  plays.indexOf(elem) > -1)){
            gameWon = {index: index, player:player}
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor =
        gameWon.player == player1 ? "blue" : "red";
    }
    for (i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
}

function declareWinner(who){
    document.querySelector(".endGame").style.display = "block";
    document.querySelector(".endGame .text").innerText = who;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot(){
    return emptySquares() [0];
}

function checkTie(){
    if (emptySquares().length == 0){
        for( i = 0; i < cells.length; i ++){
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner('Tie Game')
        return true;
    }
    return false;
}