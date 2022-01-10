const fs = require('fs');

// MARK Input Reader

const inputToArray = (file) => fs.readFileSync(file).toString().split("\n").map(line => line.split(''));

// using try catches here to start with, could be smarter with if statements
// to figure out whether we were on a wall or not. 
const handle = (e) => {
  if (!e.message.includes('Cannot read property')) throw e
}
const increaseAdjacentLevels = (board, point) => {
  const [x, y] = point;

  // increase the level of the point itself or else we can get caught in an
  // infinite loop. Use Infinity so we can differentiate flashpoints that have 
  // had their adjacent levels increased and those for which the increase still
  // needs to be done.
  board[y][x] = Infinity;
  
  // up left
  if (x > 0 && y > 0) board[y-1][x-1] ++;

  // up
  if (y > 0) board[y-1][x] ++;

  // up right
  if (x < board.length - 1 && y > 0) board[y-1][x+1] ++;

  // left
  if (x > 0) board[y][x-1] ++;

  // right
  if (x < board.length - 1) board[y][x+1] ++;
    
  // down left
  if (x > 0 && y < board.length - 1) board[y+1][x-1] ++;

  // down
  if (y < board.length - 1) board[y+1][x] ++;

  // down right
  if (x < board.length - 1 && y < board.length - 1) board[y+1][x+1] ++;

}

const prettyPrintBoard = (board) => {
  console.log();
  board.forEach(l => console.log(l.join(' ')))
  console.log();
}

const incrementBoard = (board) => {
  // increase everything by exactly 1
  for (let y = 0; y < board.length; y++){
    for (let x = 0; x < board.length; x++){
      board[y][x]++;
    }
  }
}

const generateFlashpoints = (board) => {
  const flashPoints = [];
  for (let y = 0; y < board.length; y++){
    for (let x = 0; x < board.length; x++){
      if (board[y][x] > 9 && board[y][x] !== Infinity){
        flashPoints.push([x,y]);
      }
    }
  }
  return flashPoints;
}

// turn everything that was increased past 9 to 0 
// also return the number of flashes
const resetFlashpoints = (board) => {
  let flashes = 0;
  for (let y = 0; y < board.length; y++){
    for (let x = 0; x < board.length; x++){
      if (board[y][x] === Infinity){
        board[y][x] = 0;
        flashes ++ ;
      }
    }
  }
  return flashes;
}

// move the board one step forward
const step = (board) => {
  
  // increment all points on the board
  incrementBoard(board);
    
  // get the initial flashpoints
  // list of points that reached 9 during the initial energy increase
  let flashPoints = generateFlashpoints(board);
  
  // if we have flashpoints, we need to propagate them
  while (flashPoints.length > 0) {
        
    // increment the adjacent points of every flashpoint
    flashPoints.forEach(fp => {increaseAdjacentLevels(board, fp)});
    
    // clear out the flashpoints we already incremented
    flashPoints = new Array(0);
  
    // regenerate flashpoints with the updated board
    flashPoints = generateFlashpoints(board);
    
  }
  
  // once done propogating, change all the points that flashed back to 0
  return resetFlashpoints(board); // counts

}

const main = (board = inputToArray('input.txt'), steps = 100) => {
  let flashes = 0;

  for (let i = 1; i <= steps; i++){

    flashes += step(board)
    console.log(`After step ${i}`);
    prettyPrintBoard(board)

  }
 
  console.log(`Flashes: ${flashes}`);

}

// main()

// MARK Part 2 

const isSynced = (board) => {
  for (let y = 0; y < board.length; y++){
    for (let x = 0; x < board.length; x++){
      if (board[y][x] !== 0)  return false;  
    }
  }
  return true;
}


const main2 = (board = inputToArray('input.txt'), steps = 100) => {

  let syncstep = 1;
  while (!isSynced(board)){
    step(board)
    
    console.log(`After step ${syncstep}`);
    prettyPrintBoard(board)
    
    syncstep++
  }

  
  console.log(`Flashes synchronize on step ${syncstep - 1}`);

}

main2();