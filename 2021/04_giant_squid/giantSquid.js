// MARK Input Reader

const inputToArrays = () => {
  const fs = require('fs');

  // split into input and boards
  let array = fs.readFileSync('./input.txt').toString().split("\n\n");

  // split called numbers into an integer array
  let called = array[0].split(',').map(c => parseInt(c, 10));

  // remove the called number part of the array so we can use forEach
  array = array.slice(1)

  // split boards into an array of array of objects: {val: int, marked: bool}
  const formattedBoards = array.map(b => {
    const rows = b.trim().split('\n');
    const formattedRows = [];

    rows.forEach(r => {
      // MARK this for future use
      const row = r.trim().split(/\s+/g).map(element => {
        return {
          value: parseInt(element, 10),
          marked: false
        }
      })
    
    formattedRows.push(row)
      
    })

    return formattedRows
  });

  return {called, boards: formattedBoards}
}

// MARK Helper Functions

// Could combine this with the marking function so we don't have to loop twice
// though this way makes it easier to use it as a helper function in both parts.
const isWinner = (board) => {
  // we will check columns while we check rows for winners so we only have to 
  // loop through once
  const columnCount = [0, 0, 0, 0, 0]
  
  for(let i = 0; i < board.length; i++){
    const row = board[i];
    let rowCount = 0;
    row.forEach((element, i) => {
        if (element.marked){
          rowCount++;
          columnCount[i]++;
        }
    })

    // if we mark 5 in a row we have a winner
    if (rowCount == 5){
      return true;
    }
  }

  // if any of the columns have been incremented to 5, we have found a winner
  return columnCount.includes(5);
}

const pretty = (board) => {
  console.log(`\nPRETTY PRINT\n`);
  board.forEach(row => {
    row.forEach(element => {
      const marked = element.marked ? '-' : ' ';
      process.stdout.write(`${marked}${element.value}${marked}   `);
    })
    console.log(``);
  })
}

const scoreBoard = (board, lastCalled) => {
  let score = 0;
  board.forEach(row => {
    row.forEach((element) => {
        if (!element.marked){
          score += element.value;
        }
    })
  })
  return score*lastCalled;
}

// MARK Part 1
const firstWinner = (input) => {
  const {boards, called} = input;

  const winningBoards = [];
  let lastCalled;

  // loop through the called numbers
  for (let i = 0; i<called.length; i++){
  
    const num = called[i];
    lastCalled = num;
    // mark and check each board as a winner, pushing winners to a winner array
    // to be checked for score

    boards.forEach(board => {

      board.forEach(row => {

        row.forEach(element => {

          if (element.value == num) {
            element.marked = true;
          }

        })

      })

      // short circuit until we reach at least 5 numbers called.
      if (i > 3 && isWinner(board)){
        winningBoards.push(board)
      }

    })
    
    // short circuit if we have winning boards
    if (winningBoards.length > 0) {
      console.log(`stopping loop with ${winningBoards.length} board/s`);
      break;
    }
  }
  
  let maxScore = 0;
  let winningBoard = winningBoards[0];


  // calculate scores of winning boards and return the max
  winningBoards.forEach(winner => {
    const score = scoreBoard(winner, lastCalled);
    if (score > maxScore) {
      maxScore = score;
      winningBoard = winner
    }
  })
  
  
  console.log(`WINNING BOARD`);
  pretty(winningBoard)
  console.log(`score: ${maxScore}`);
  
  return {score: maxScore, winningBoard}
}


// MARK Part 2
const lastWinner = (input) => {

  // TODO be sure to handle case where there are multiple winners when the last
  // number is called

  const {boards, called} = input;

  let winningBoards;

  // keep a board summary for remaining boards that are not yet winners.
  // true = winner, false = not_winner
  const winningBoardSummary = boards.map(() => false)
  
  let lastCalled;

  // loop through the called numbers
  for (let i = 0; i<called.length; i++){

    // reset winning boards for each number
    winningBoards = [];
  
    const num = called[i];
    lastCalled = num;
    // mark and check each board as a winner, pushing winners to a winner array
    // to be checked for score

    
    for (let j = 0; j<boards.length; j++){

      const board = boards[j];

      // if the board is already a winner, skip it
      if (winningBoardSummary[j]){
        continue;
      }

      board.forEach(row => {

        row.forEach(element => {

          if (element.value == num) {
            element.marked = true;
          }

        })
        
      })

      if (i > 3 && isWinner(board)){
        winningBoardSummary[j] = true;

        // note the boards that won on this call
        winningBoards.push(board)
      }

    }
  
    // when we don't have any more winners, we can break out and check for the
    // lowest scores
    if (!winningBoardSummary.includes(false)){
      break;
    }
  }
  
  let minScore = Infinity;
  let winningBoard = winningBoards[0];

  // calculate scores of winning boards and return the MIN
  winningBoards.forEach(winner => {
    const score = scoreBoard(winner, lastCalled);
    if (score < minScore) {
      minScore = score;
      winningBoard = winner
    }
  })
  
  
  console.log(`WINNING BOARD`);
  pretty(winningBoard)
  console.log(`score: ${minScore}`);
  
  return {score: minScore, winningBoard}


}

// MARK Answers

firstWinner(inputToArrays())
lastWinner(inputToArrays())