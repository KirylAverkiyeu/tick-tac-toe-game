document.getElementById("xCheckbox").checked = true;
document.getElementById("zeroCheckbox").checked = false;

let boardStart = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let huPlayer = "X"; //human
let aiPlayer = "O"; //"AI"
let aiImg = "circle.png";
let huImg = "cross.png";

function handleClick(cb) {
  let xCheckbox = document.getElementById("xCheckbox");
  if (xCheckbox.name === cb.name) {
    document.getElementById("zeroCheckbox").checked = false;
    document.getElementById("xCheckbox").checked = true;
  } else {
    xCheckbox.checked = false;
    cb.checked = true;
  }
}

function onStartGame() {
  let whoIsWho = document.getElementById("xCheckbox").checked;
  document.getElementById("logo").innerHTML = "Beat your opponent!";
  document.getElementById("choosePlayer").style.display = "none";
  document.getElementById("table").style.display = "block";
  document.getElementById("refresh").style.display = "inline";
  document.getElementById("multiBtn").innerHTML = "Your Turn";
  document.getElementById("multiBtn").disabled = true;
  if (!whoIsWho) {
    aiPlayer = "X";
    huPlayer = "O";
    aiImg = "cross.png";
    huImg = "circle.png";
    opponentsTurn();
  }
}

function pageReload() {
  window.location.reload();
}

function usersTurn(obj) {
  boardStart[obj.id] = huPlayer;
  document.getElementById(obj.id).src = huImg;
  document.getElementById(obj.id).onclick = null;
  if (emptyIndices(boardStart).length == 0) {
    document.getElementById("multiBtn").innerHTML = "Draw";
    document.getElementById("multiBtn").style.backgroundColor = "blue";
  } else {
    opponentsTurn();
  }
}

function opponentsTurn() {
  document.getElementById("multiBtn").innerHTML = "...";
  let opponent = minimax(boardStart, aiPlayer);
  boardStart[opponent.index] = aiPlayer;
  document.getElementById(opponent.index).src = aiImg;
  if (winning(boardStart, aiPlayer)) {
    document.getElementById("multiBtn").innerHTML = "YOU LOST";
    document.getElementById("multiBtn").style.backgroundColor = "red";
  } else if (
    !winning(boardStart, aiPlayer) &&
    emptyIndices(boardStart).length == 0
  ) {
    document.getElementById("multiBtn").innerHTML = "Draw";
    document.getElementById("multiBtn").style.backgroundColor = "blue";
  } else {
    document.getElementById("multiBtn").innerHTML = "Your Turn";
  }
}

//returns an array of indices of empty cells of a board
function emptyIndices(board) {
  return board.filter((s) => s != "O" && s != "X");
}

//winnig combinations with respect to indices
function winning(board, player) {
  if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  ) {
    return true;
  } else {
    return false;
  }
}

// main minimax function
function minimax(newBoard, player) {
  //avaliable spots
  let availSpots = emptyIndices(newBoard);

  // checking whether a state is a terminal state(win/loss/draw)
  //and returning a value accordingly
  if (winning(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (winning(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  // array to collect all objects
  let moves = [];

  //  // loop through available spots
  for (let i = 0; i < availSpots.length; i++) {
    //create an object for each and store the index of that spot
    let move = {};
    move.index = newBoard[availSpots[i]];

    // set the empty spot to the current player
    newBoard[availSpots[i]] = player;

    // recieve points obtained after the calling minimax on the opponent of the current player
    if (player == aiPlayer) {
      let result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    // reset the spot to empty
    newBoard[availSpots[i]] = move.index;

    // push the object to the array
    moves.push(move);
  }
  // if it is the computer's turn loop over the moves and choose the move with the highest score
  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    // else loop over the moves and choose the move with the lowest score
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  // return the chosen move (object) from the array to the higher depth
  return moves[bestMove];
}
