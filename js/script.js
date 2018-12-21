window.sessionStorage
var origBoard;
var player = '1';
var player1 = '';
var player2 = '<img src=img/7.png>';
const playerAI = '<img src=img/25.png alt=Pikachu>';
var players = false;
var winPlayer1 = 0
var winPlayerAI = 0
var ties = 0
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
var name1 = window.sessionStorage.getItem("player1");
var name2 = window.sessionStorage.getItem("player2");

const cells = document.querySelectorAll('.cell');

function pokemonChoose(img, switchplayer){
    var src = img;

    if(players == true){
        player1 = src;
        document.querySelector(".choosePokemon").style.display = "none";
        document.querySelector(".choosePokemon2").style.display = "flex";
        startGame();
    }else{
        player1 = src;
        document.querySelector(".choosePokemon").style.display = "none"; 
        startGame();      
    }
}

function pokemonChoose2(img, switchplayer){
    var src = img;

    if(players == true){
        player2 = src;
        document.querySelector(".choosePokemon2").style.display = "none";
    }
}

function startGame(){
    document.querySelector(".endGame").style.display = "none";
   
    origBoard = Array.from(Array(9).keys());

    player = '1';
    
    for ( i = 0; i < cells.length; i ++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
        cells[i].style.cursor = "pointer";
    }
}

function switchPlayer(){

    startGame();
    document.querySelector(".choosePokemon").style.display = "flex";

    var elem = document.querySelector(".players");
    if(elem.innerText == "2 PLAYERS"){  
        document.querySelector(".players").innerText = "1 PLAYER";
        players = true;
    }else if(elem.innerText == "1 PLAYER"){
        document.querySelector(".players").innerText = "2 PLAYERS";
        players = false;
    }

    console.log(elem.innerText);
}

function turnClick(square, switchPlayer){
    if(typeof origBoard[square.target.id] == 'number'){

        if(players == true){
            
            if(player == 1){
                if(emptySquares().length == 0){
                    declareWinner('Tie game')
                    console.log('tie');
                }else{
                    turn(square.target.id, player1);
                    player = 2;
                    console.log('player1');
                }
            }else if(player == 2){
                if(emptySquares().length == 0){
                    declareWinner('Tie game');
                    console.log('tie')
                }else{
                    turn(square.target.id, player2);
                    player = 1;
                    console.log('player1');
                }
            }

        }else if(players == false){
            turn(square.target.id, player1);
            if(!checkTie()) turn(bestSpot(), playerAI);
        }
    }
} 

function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
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
        gameWon.player == player1 ? "blue" : gameWon.player == player2 ? "blue" : "yellow";
    }
    for (i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
        cells[i].style.removeProperty('cursor');
    }
    declareWinner(gameWon.player == player1 ? "player 1 Wins" : gameWon.player == player2 ? "player 2 Wins" : "You Lose");
    gameScore(gameWon)
}

function declareWinner(who){
    document.querySelector(".endGame").style.display = "block";
    document.querySelector(".endGame .text").innerText = who;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot(){
    return miniMax(origBoard, playerAI).index;
}

function checkTie(){
    if (emptySquares().length == 0){
        for( i = 0; i < cells.length; i ++){
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner('Tie Game');
        gameScore(emptySquares);
        return true;
    }
    return false;
}

function miniMax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, player1)) {
		return {score: -10};
	} else if (checkWin(newBoard, playerAI)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == playerAI) {
			var result = miniMax(newBoard, player1);
			move.score = result.score;
		} else {
			var result = miniMax(newBoard, playerAI);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === playerAI) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

function gameScore(gameWon){

    if(gameWon.player == player1){
        winPlayer1 ++;
        document.querySelector('#score1').innerText = winPlayer1;
        
    }else if(gameWon.player == playerAI){
        winPlayerAI ++
        document.querySelector('#score2').textContent = winPlayerAI;
    }else if(emptySquares().length == 0){
        ties ++
        document.querySelector('#score3').textContent = ties;
    }
}

function next(prev, next){
    document.getElementById(prev).style.display = 'none';
    document.getElementById(next).style.display = 'block';
}

function nameFunc(player, name, prev, next) {
    var person = prompt("Please enter your name", name);
    if (person != null) {
        document.querySelector(player).innerHTML = person;
        document.getElementById(prev).style.display = 'none';
        document.getElementById(next).style.display = 'block';

        window.sessionStorage.setItem(player, name);

        
    }   
}

function fadeOutEffect(){
    document.querySelector(".person1").innerHTML = name1;
    document.querySelector(".person2").innerHTML = name2;
    var fadeTarget = document.querySelector(".start");
    var fadeEffect = setInterval(function() {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
            // console.log(fadeTarget.style.opacity);
            if(fadeTarget.style.opacity == 0){
                fadeTarget.style.display = "none";
            }
        } else {
            clearInterval(fadeEffect);
        }
        
    }, 200);   
}


