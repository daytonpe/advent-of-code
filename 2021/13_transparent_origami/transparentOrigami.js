const fs = require('fs');

// MARK - Input Reader

const inputToArray = (file) => {
  const lines = fs.readFileSync(file)
    .toString().split("\n");

  let points = [];
  let folds = [];


  lines.forEach(line => {
    if (line.includes(',')){
      
      line = line.split(',');
      
      const parsedLine = [parseInt(line[0], 10), parseInt(line[1], 10)];
      points.push(parsedLine);

    } else if (line.includes('=')) {
      line = line.split(' ');
      const fold = line[2].split('=');
      const parsedFold = [fold[0], parseInt(fold[1], 10)];
      folds.push(parsedFold);
    }
  });

  return {points, folds}
}

// MARK - Helper Functions

const getPaper = (points) => {

  let xMax = 0;
  let yMax = 0;
  for(let i = 0; i < points.length; i++){
    const [x, y] = points[i];
    if (x > xMax) xMax = x;
    if (y > yMax) yMax = y;
  }

  // Had issues with nested new Array().fill() statements passing by reference
  let paper = new Array(yMax+1);
  for (let i = 0; i< paper.length; i++){
    paper[i] = new Array(xMax+1).fill('.');
  }

  // add in the #s where points are
  for(let i = 0; i < points.length; i++){
    const [x, y] = points[i];
    paper[y][x] = '#';
  }

  return paper;
}

const print = (paper, label='PAPER') => {
  console.log(`\n${label}: \n`);
  paper.forEach(line => console.log(line.join('')));
  console.log(`\n\n`);
}

// split into a top and bottom
const splitY = (paper, index) => {
  const top = paper.slice(0, index);
  const bottom = paper.slice(index+1)
  return [top, bottom];
}

// split into a left and right
const splitX = (paper, index) => {

  const left = [];
  const right = [];

  paper.forEach(line => {
    left.push(line.slice(0, index));
    right.push(line.slice(index+1));
  })

  return [left, right];
}

const blankCopy = (paper) => {
  let copy = new Array(paper.length);
  for (let i = 0; i< paper.length; i++){
    copy[i] = new Array(paper[0].length).fill('.');
  }
  return copy;
}

// IMPORTANT NOTE - Flip Functions work in place.

// flip up to down. Initially used a for loop (:
const flipY = (paper) => paper.reverse();

// flip left to right
const flipX = (paper) => paper.map(line => line.reverse());

// put two pieces of transparent paper together
const stack = (a, b) => {

  // make a copy of the bigger piece. Since we only fold in one direction at a 
  // time, we can perform both bigger checks (x-wise, y-wise) at the same time.
  let bigger;
  if (a.length > b.length || a[0].length > b[0].length){
    bigger = a;
  } else {
    // if we get here we know that b is either bigger or they are the same size
    bigger = b;
  }

  const stacked = blankCopy(bigger);   

  // rather than having to start from the bottom right each time and do a bunch
  // of confusing diffs, I flip the board that we can perform the stack from
  // top to bottom, left to right
  flipY(a)
  flipY(b)

  flipX(a)
  flipX(b)

  for (let y = 0; y < bigger.length; y++){
    for (let x = 0; x < bigger[0].length; x++){
      try{
        if (a[y][x] === '#' || b[y][x] === '#'){
          stacked[y][x] = '#';
        }  
      // lazy way of ignoring index out of bounds errors
      } catch (e) {}
      
    }
  }

  return flipX(flipY(stacked));
}

const fold = (paper, axis, index) => {
  if (axis === 'y'){;
    const [top, bottom] = splitY(paper, index);
    return stack(top, flipY(bottom));

  } else if (axis === 'x') {
    const [left, right] = splitX(paper, index);
    return stack(left, flipX(right));
  }

}

const dotCount = (paper) => {
  let count = 0;
  for (let y = 0; y < paper.length; y++){
    for (let x = 0; x < paper[0].length; x++){
      if (paper[y][x] === '#'){
        count ++;
      }
    }
  }
  return count;
}


const main = (filename = 'test_input.txt') => {
  const {points, folds} = inputToArray(filename);
  
  let paper = getPaper(points)
 
  folds.forEach(([axis, index]) => {
    paper = fold(paper, axis, index)
  })

  
  print(paper, "Code")

  console.log(`Dots: ${dotCount(paper)}`)
}

// main();
main('input.txt');