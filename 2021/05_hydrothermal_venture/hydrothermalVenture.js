// MARK Input Reader

const { count } = require('console');

// read in the instructions and determine the size of the board.
const inputToArrays = () => {
  const fs = require('fs');

  // assume 0 for the mins right now, but could decrease size of board by using
  // the actual min and an offset to reduce the size of the arrays in the future
  let maxX = 0;
  let maxY = 0;

  // split into line strings
  let array = fs.readFileSync('./input.txt').toString().split("\n");

  // split called numbers into [ [['0,9],[5,9]], [['0,9],[5,9]] ] 
  let lineObjects = array.map(l => l.split(' -> '));

  // split into integer objects
  lineObjects = lineObjects.map(lo => {

    let [start, end] = lo;

    start = start.split(',')
    end = end.split(',')

    const xStart = parseInt(start[0], 10);
    const xEnd = parseInt(end[0], 10);
    const yStart = parseInt(start[1], 10);
    const yEnd = parseInt(end[1], 10);

    // update the max x and y
    if (xStart > maxX) maxX = xStart;
    if (xEnd > maxX) maxX = xEnd;
    if (yStart > maxY) maxY = yStart;
    if (yEnd > maxY) maxY = yEnd;

    return {
      x: {
        start: xStart,
        end: xEnd
      },
      y: {
        start: yStart,
        end: yEnd
      }
    }
  })

  return {lines: lineObjects, maxX, maxY}
};

// MARK Helper Functions

// return an array of arrays to represent the board
const createBoard = (maxX, maxY) => {
  const board = []
  for (let i = 0; i <= maxY; i++){
    const row = []
    for (let j = 0; j <= maxX; j++){
      row.push(0)
    }
    board.push(row);
  }
  return board;
}

// filter for only horizontal or vertical lines
const filter1 = (lines) => {
  return lines.filter(line => (line.x.start == line.x.end || line.y.start == line.y.end))
}

// filter for horizontal, vertical, or perfect oblique lines
const filter2 = (lines) => {
  return lines.filter(line => (
    line.x.start == line.x.end || 
    line.y.start == line.y.end ||
    Math.abs(line.x.start - line.x.end) == Math.abs(line.y.start - line.y.end)))
}

const printPrettyBoard = (board) => {
  board.forEach(line => {
    line.forEach(element => {

      if (element) {
        process.stdout.write(` ${element} `);
      } else {
        process.stdout.write(` 0 `);
      }
    })
    console.log(``);
  })
}

const countDoubles = (board) => {
  let count = 0;
  board.forEach(line => {
    line.forEach(element => {
      if (element > 1) {
        count++;
      }
    })
  })
  console.log(`Double Count: ${count}`)
}


// MARK Part 1

const part1 = () => {
  let {lines, maxX, maxY} = inputToArrays();
  const filteredLines = filter1(lines)

  const board = createBoard(maxX, maxY)

  // traverse the lines, marking the board
  filteredLines.forEach(line => {
    
    // remember that the board is backward because is array of arrays
    // example board[y][x]

    // vertical lines
    if (line.x.start == line.x.end) {
      
      const lineMaxY = (line.y.start > line.y.end) ? line.y.start : line.y.end;
      const lineMinY = (line.y.start == lineMaxY ) ? line.y.end : line.y.start;
      
      for (let i = lineMinY; i <= lineMaxY; i++) {
        board[i][line.x.start]++;
      }
      
      // horizontal lines
    } else {
      
      const lineMaxX = (line.x.start > line.x.end) ? line.x.start : line.x.end;
      const lineMinX = (line.x.start == lineMaxX ) ? line.x.end : line.x.start;
      
      for (let i = lineMinX; i <= lineMaxX; i++){
        board[line.y.start][i]++;
      }
     
    }

    
  })
  
  // printPrettyBoard(board); // ugly with actual input (too big)
  countDoubles(board);
}

// part1()

// MARK Part 2

const part2 = () => {
  let {lines, maxX, maxY} = inputToArrays();
  
  const filteredLines = filter2(lines)
  
  const board = createBoard(maxX, maxY)


  // traverse the lines, marking the board
  filteredLines.forEach(line => {
    
    // remember that the board is backward because is array of arrays
    // example board[y][x]
        
    // vertical lines
    if (line.x.start == line.x.end) {
      const lineMaxY = (line.y.start > line.y.end) ? line.y.start : line.y.end;
      const lineMinY = (line.y.start == lineMaxY ) ? line.y.end : line.y.start;
      
      for (let i = lineMinY; i <= lineMaxY; i++) {
        board[i][line.x.start]++;
      }
      
      // horizontal lines
    } else if (line.y.start == line.y.end){
      const lineMaxX = (line.x.start > line.x.end) ? line.x.start : line.x.end;
      const lineMinX = (line.x.start == lineMaxX ) ? line.x.end : line.x.start;
      
      for (let i = lineMinX; i <= lineMaxX; i++){
        board[line.y.start][i]++;
      }
     
    } else {

      let currentX = line.x.start;
      let currentY = line.y.start;

      while (currentX != line.x.end){
        board[currentY][currentX]++

        if (line.y.end >= currentY){
          currentY++
        } else {
          currentY-- 
        }

        if (line.x.end >= currentX){
          currentX++
        } else {
          currentX-- 
        }
      }

      // still need to mark the end state since we used the flexible while loop
      board[line.y.end][line.x.end]++

    }    
  })
  
  // printPrettyBoard(board); // ugly with actual input (too big)
  countDoubles(board);
}

part2()