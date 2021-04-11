// UI controller - module
// annouce winner or a tie
// --set difficulty

const displayController = (function() {
   // Cache DOM
   const reset = document.querySelector('.btn--reset');
   const newGame = document.querySelector('.btn--new-game');
   const boardFields = document.querySelectorAll('.board__box');
   const win = document.querySelector('.winner');

   // Bind events
   boardFields.forEach(item => { item.addEventListener('click', playRound) });
   reset.addEventListener('click', restartGame);
   newGame.addEventListener('click', startNewGame);
   
   // Game
   function playRound(e) {
      e.preventDefault();

      const position = getClickPosition(e); 
      const board = gameBoard.get();

      if (board[position] == '') {
         const sign = game.play(position);
         insertSign(sign, position)
      }

      const winner = game.checkWin();
      if (winner != false) {  
         annouceWinner(winner);
      } 
   }

   function getClickPosition(e) {
      const boardClickPosition = e.srcElement.dataset.board;
      const position = boardClickPosition[boardClickPosition.length - 1];

      return position;
   }

   function insertSign(sign, position) {
      const board = gameBoard.get();
      
      gameBoard.setSign(sign, position)
      boardFields[position].innerHTML = sign;
      boardFields[position].classList.remove('board__box--hover');
   }

   function annouceWinner(player) {
      document.querySelector('.winner__title').innerHTML = player;
      win.classList.add('winner--display');

      setTimeout(function(){
         win.classList.add('winner--display-fade');
      }, 250);
   }

   function startNewGame() {
      restartGame();
      win.classList.remove('winner--display-fade');

      setTimeout(function(){
         win.classList.remove('winner--display');
      }, 250);
   }

   function clearUI() {
      boardFields.forEach(field => {
         field.innerHTML = '';
         field.classList.add('board__box--hover')
      })
   };

   function restartGame() {
      gameBoard.clear();
      game.restart();
      clearUI();
   }
})();


// Game board - module
const gameBoard = (function() {
   let board = ['','','','','','','','',''];

   function addSign(sign, position) {      
      board[position] = sign;
   }

   function clearBoard() {
      board = ['','','','','','','','',''];
   }

   function showBoard() {
      return board;
   }

   return { 
      setSign: addSign, 
      clear: clearBoard,
      get: showBoard,
   };
})();


// Player
const Player = (sign) => {
   const getPlayerSign = () => sign;
   const playerWins = () => `Player ${getPlayerSign()} won the game.`
   return { getPlayerSign, playerWins}
}


// Game - module
const game = (function() {
   const firstPlayer = Player('O');
   const secondPlayer = Player('X');
   let lastMove = secondPlayer;

   // Game functions
   function playRound(position) {
      if (lastMove == secondPlayer) {
         gameBoard.setSign(firstPlayer.getPlayerSign(), position);
         lastMove = firstPlayer;
         return firstPlayer.getPlayerSign();

      } else if (lastMove == firstPlayer) {
         gameBoard.setSign(secondPlayer.getPlayerSign(), position);
         lastMove = secondPlayer;
         return secondPlayer.getPlayerSign();
      }
   }

   function checkForWinner() {
      if (checkDiagonals() == true || checkRows() == true || checkColumns() == true) {
         let winner = lastMove.playerWins();
         restartGame();
         return winner;
      } else if (checkTie() == true){
         restartGame();
         return 'A tie.';
      } else {
         return false;
      }
   }

   function checkIfFirstPlayerWins(value) {
      return value == firstPlayer.getPlayerSign();
   }

   function checkIfSecondPlayerWins(value) {
      return value == secondPlayer.getPlayerSign();
   }

   function checkDiagonals() {
      const leftToRightDiagonal = [];
      const rightToLeftDiagonal = [];

      for (let i = 0; i <= 8; i = i + 4) {
         leftToRightDiagonal.push(gameBoard.get()[i])
      }

      for (let i = 2; i <= 6; i = i + 2) {
         rightToLeftDiagonal.push(gameBoard.get()[i])
      }

      if (leftToRightDiagonal.every(checkIfFirstPlayerWins) || leftToRightDiagonal.every(checkIfSecondPlayerWins)) {
         return true;
      } else if (rightToLeftDiagonal.every(checkIfFirstPlayerWins) || rightToLeftDiagonal.every(checkIfSecondPlayerWins)) {
         return true;
      } else {
         return false;
      }
   }

   function checkRows() {
      for (let i = 0; i < 9; i = i + 3) {
         let row = [];

         for (j = i; j < i + 3; j++) {
            row.push(gameBoard.get()[j])
         }

         if (row.every(checkIfFirstPlayerWins) || row.every(checkIfSecondPlayerWins)) {
            return true;
         } else {
            row = [];
         }
      }
   }

   function checkColumns() {
      for (let i = 0; i < 3; i++) {
         let column = [];

         for (j = i; j <= i + 6; j = j + 3) {
            column.push(gameBoard.get()[j])
         }

         if (column.every(checkIfFirstPlayerWins) || column.every(checkIfSecondPlayerWins)) {
            return true;
         } else {
            column = [];
         }
      }
   }

   function checkTie() {
      return gameBoard.get()
                      .every(field => field != '');
   }

   function restartGame() {
      lastMove = secondPlayer;
   }

   return {
      play: playRound,
      checkWin: checkForWinner,
      restart: restartGame,
   }
})();



// AI
// --difficulty modes
// --AI logic
// --AI move
