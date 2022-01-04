// sonar sweep report
const report = [
  199,
  200,
  208,
  210,
  200,
  207,
  240,
  269,
  260,
  263
]

const inputToArray = () => {
  const fs = require('fs');
  let array = fs.readFileSync('./input.txt').toString().split("\n");
  array = array.map(x => parseInt(x, 10)) // This part got me for a while
  return array
}

// PART 1
const countDepthIncreases = (report) => {
  let increases = 0;

  for (let i = 1; i < report.length; i++) {
    
    if (report[i] > report[i-1]) {
      increases ++;
      // console.log(`${report[i]} > ${report[i-1]} - count ${increases}`);
    }
  }

  console.log(`increases: ${increases}`);
  return increases
}

// countDepthIncreases(inputToArray())


// PART 2
const countDepthWindowIncreases = (report) => {
  let increases = 0;
  let previousWindowSum = 0;

  for (let i = 2; i < report.length; i++) {
    const windowSum = report[i] + report[i-1] + report[i-2];

    // first window is not considered an increase
    if ((windowSum > previousWindowSum) && i !== 2) {
      increases ++
    }

    // Set the previous window sum for the next iteration
    previousWindowSum = windowSum;
  }

  console.log(`increases: ${increases}`);
  return increases;
}

countDepthWindowIncreases(report)
// countDepthWindowIncreases(inputToArray())