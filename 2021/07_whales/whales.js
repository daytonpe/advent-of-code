// MARK Input Reader

const inputToArray = (file) => {
  const fs = require('fs');
  let array = fs.readFileSync(file).toString().split(",");
  array = array.map(x => parseInt(x, 10)) // This part got me for a while
  return array
}


// MARK: Part 1
const positions = inputToArray('./input.txt');

const main1 = (positions = []) => {
  const sorted = positions.sort((x, y) => x > y ? 1 : -1);
  
  // find the median
  const medianChoices = [];

  // if it's an odd length, we will have two choices for median
  if (sorted.length % 2 == 1) {
    const leftMedian = sorted[(sorted.length/2) - 1];
    const rightMedian = sorted[sorted.length/2];
    
    medianChoices.push(rightMedian);
    medianChoices.push(leftMedian);

  } else {
    const medianIndex = parseInt(sorted.length / 2)
    medianChoices.push(sorted[medianIndex])
  }


  let minDist = Infinity;

  // loop through each of the one or two medians
  medianChoices.forEach(median => {

    let dist = 0;

    positions.forEach(pos => {

      dist += Math.abs(pos - median);

    })

    if (dist < minDist) {
      minDist = dist;
    }

  })

  console.log(`Minimum Distance/Cost: ${minDist}`);
  return minDist;
}

// main1(positions)

// MARK: Part 2 - Memoized Cost Function Helper

// memoized cost dict to pull from to make it a bit faster
const costDict = new Array(2000).fill(0)

const cost = (from, to) => {

  const dist = Math.abs(from - to);

  // no score if dist is 0
  if (dist == 0) return 0

  // check our memoization dict
  if (costDict[dist] != 0) return costDict[dist]

  let stepCost = 1;
  let total = 0;
  for (let i = 0; i < dist; i++){
    total += stepCost;
    stepCost++;
  }
  
  // memoize
  costDict[dist] = total;

  return total;
}


// MARK Part 2 - Using Mean
const main2 = (positions = []) => {
  
  const sum = positions.reduce((count, total) => count + total);
  const mean = parseInt(sum / positions.length);

  const meanBounds = [mean, mean+1];

  let minCost = Infinity;
  let minCostPos;

  meanBounds.forEach(m => {

    let distCost = 0;

    positions.forEach(pos => {
      distCost += cost(pos, m)
    })

    if (distCost < minCost) {
      minCost = distCost;
      minCostPos = m;
    }
  })

  

  console.log(`Minimum Cost: ${minCost}`);
  console.log(`Minimum Cost Position: ${minCostPos}`);
  return minCost;
}

main2(positions)


// MARK Part 2 - Brute Force (Initial Approach)
const main2brute = (positions = []) => {
  
  let min = Infinity;
  let max = -Infinity;

  positions.forEach(pos => {
    if (pos > max) max = pos;
    if (pos < min) min = pos;
  })

  let minCost = Infinity;
  let minCostPos;

  // loop through the viable convergence points (must be between the rightmost
  // and leftmost crab sub)
  for (let i = min; i<= max; i++){

    let distCost = 0;
    positions.forEach(pos => {
      distCost += cost(pos, i)
    })

    if (distCost < minCost) {
      minCost = distCost;
      minCostPos = i;
    }
  }


  console.log(`Minimum Cost: ${minCost}`);
  console.log(`Minimum Cost Position: ${minCostPos}`);
  return minCost;
}

// main2brute(positions)
