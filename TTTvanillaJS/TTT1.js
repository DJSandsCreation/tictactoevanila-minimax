var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
// an array full of arrays, winning combinations
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
// the cellls var stores a ref of each cell
startGame();

function startGame() {
  // replay also starts the start game function
  document.querySelector(".endgame").style.display = "none";
   // origBoard[squareId] = player;
  origBoard = Array.from(Array(9).keys());
    // make the array be every no.  from 0-9
    // console.log(origBoard)
    // dev tool run
  for (var i = 0; i < cells.length; i++) {
    // when restart remove x & O 's'
    cells[i].innerText = '';
    // nothing in cell
    cells[i].style.removeProperty('background-color');
    // remove b-ground color
    cells[i].addEventListener('click', turnClick, false);
    // click then turn click
  }
}

function turnClick(square) {
   // console.log(square.tartget.id)
   // if no one play in spot 
  if (typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, huPlayer)
    // calling the turn function above
    // below definning the
    if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  // below to check if functions meet call gameover
  let gameWon = checkWin(origBoard, player)
  if (gameWon) gameOver(gameWon)
}

// ref
function checkWin(board, player) {
  // finds all places on board played in
  // a accumalator, e element , i index
  let plays = board.reduce((a, e, i) =>
    // if element === the player , take a array and add index to array
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  // check if game has been won, loops thru wind comb enteries
  for (let [index, win] of winCombos.entries()) {
    // has the player played all these spots that consitutes a winner
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      // 
      break;
    }
  }
  return gameWon;
}
// basic AI
function gameOver(gameWon) {
  // highlight won squares
  for (let index of winCombos[gameWon.index]) {
    // set background based on who won
    document.getElementById(index).style.backgroundColor =
    // hu blue ai red
      gameWon.player == huPlayer ? "blue" : "red";
  }
  // through every cell cant change it now
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

// declare who winner
function declareWinner(who) {
  // show end game section
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

// find all empty squares
function emptySquares() {
  //  to see with x o is not empty but with no. is empty
  return origBoard.filter(s => typeof s == 'number');
}
// find all empty squares
function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

// to check tie
function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "steelblue";
      cells[i].removeEventListener('click', turnClick, false);
      // eventlit cannot click
    }
    declareWinner("Tie Game!")
    return true;
  }
  return false;
}
// define minimax function
function minimax(newBoard, player) {
  var availSpots = emptySquares();
//  check winner
  if (checkWin(newBoard, huPlayer)) {
    return {score: -10};
  } else if (checkWin(newBoard, aiPlayer)) {
    return {score: 10};
    // if no more spots
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
  // collects moves/score
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }
    // recursion
    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }
// min max evaluates
  var bestMove;
  if(player === aiPlayer) {
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