const fs = require('fs');

// MARK Input Reader

const inputToArray = (file) => fs.readFileSync(file).toString().split("\n").map(line => line.split(''));

// MARK Constants

const OPENINGS = {
  '{': '}',
  '(': ')',
  '<': '>',
  '[': ']'
}

const CLOSINGS = {
  '}': '{',
  ')': '(',
  '>': '<',
  ']': '['
}

const PART1POINTS = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
}

const PART2POINTS = {
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4
}

// MARK - Part 1


// Needed some hints for this one. I didn't make the mental leap that you could
// move left to right with a stack data structure, so I got stuck doing
// recursion and looking at the whole line as a unit. My recursive validator 
// seemed to work though... even if it didn't give the score (:
const main = (input = inputToArray('./test_input.txt')) => {
  // total error points found
  let total = 0;

  for (let i = 0; i < input.length; i++){
    const line = input[i];
    
    const stack = [];

    for (let j = 0; j < line.length; j++){
      const c = line[j];
      // if it's an opening, push it to the stack
      if (Object.keys(OPENINGS).includes(c)){
        stack.push(c);
        
        // if it's a closing, it should be closing the most recent opening.
        // otherwise it's a corruption and we can stop
      } else if (Object.keys(CLOSINGS).includes(c)){
        
        if (CLOSINGS[c] == stack[stack.length - 1]){
          
          // we've closed out this pair, so pop it
          stack.pop()

        } else {

          // error! the pair was not closed out.
          total += PART1POINTS[c];
          break;

        }
      }
    }
  }

  console.log(`Total Error Points: ${total}`);
  return total;
}

// main()
// main(inputToArray('./input.txt'))

// MARK - Part 2


const score = (stack) => {
  let score = 0;
  for (let i = stack.length-1; i>=0; i--){
    const c = stack[i];
    score = score *= 5
    score += PART2POINTS[c]
  }
  return score;
  // return stack.reduce((total, current) => total += PART2POINTS[current])
}

const main2 = (input = inputToArray('./test_input.txt')) => {
  let scores = [];
  for (let i = 0; i < input.length; i++){
    const line = input[i];
    
    let stack = [];

    for (let j = 0; j < line.length; j++){
      const c = line[j];
      // if it's an opening, push it to the stack
      if (Object.keys(OPENINGS).includes(c)){
        stack.push(c);
        
        // if it's a closing, it should be closing the most recent opening.
        // otherwise it's a corruption and we can stop
      } else if (Object.keys(CLOSINGS).includes(c)){
        
        if (CLOSINGS[c] == stack[stack.length - 1]){
          
          // we've closed out this pair, so pop it
          stack.pop()

        } else {
          // need to clear the stack so it's not scored if the line is corrupted
          stack = []

          break;
        }
      }
    }

    const lineScore = score(stack);

    if (lineScore !== 0){
      scores.push(lineScore);
    }
  }

  scores = scores.sort((a, b) => (a > b) ? -1: 1);

  const middleScore = scores[parseInt(scores.length / 2)];

  console.log(`Middle Auto Complete Points: ${middleScore}`);
  return middleScore;
}

// main2()
main2(inputToArray('./input.txt'))