const instructions = [
  'forward 5',
  'down 5',
  'forward 8',
  'up 3',
  'down 8',
  'forward 2'
]

const inputToArray = () => {
  const fs = require('fs');
  let array = fs.readFileSync('./input.txt').toString().split("\n");
  return array
}

// Part 1
const position = (instructions = []) => {

  // initialize our starting point
  let depth = 0;
  let distance = 0;

  // would probably want to add some data validation here to ensure all
  // instructions are of the correct format

  instructions.forEach(i => {

    // split the parts of the vector
    const iSplit =  i.split(' ');
    
    const magnitude = parseInt(iSplit[1], 10);
    const direction = iSplit[0].toLowerCase();


    switch (direction) {
      case 'forward':
        distance += magnitude;
        break;
      case 'up':
        depth -= magnitude;
        break;
      case 'down':
        depth += magnitude;
        break;
      default:
        console.log(`invalid direction "${direction}"`);
    }
  })

  console.log(`\n`);
  console.log(`forward position:     ${distance}`);
  console.log(`depth:                ${depth}`);
  console.log(`multiplied position:  ${depth*distance}`);

  return depth*distance
}

// position(inputToArray())

// Part 2
const positionWithAim = (instructions = []) => {

  // initialize our starting point
  let depth = 0;
  let distance = 0;
  let aim = 0;

  // would probably want to add some data validation here to ensure all
  // instructions are of the correct format

  instructions.forEach(i => {

    // split the parts of the vector
    const iSplit =  i.split(' ');
    
    const magnitude = parseInt(iSplit[1], 10);
    const direction = iSplit[0].toLowerCase();


    switch (direction) {
      case 'forward':
        distance += magnitude;
        depth += (aim * magnitude)
        break;
      case 'up':
        aim -= magnitude;
        break;
      case 'down':
        aim += magnitude;
        break;
      default:
        console.log(`invalid direction "${direction}"`);
    }
  })

  console.log(`\n`);
  console.log(`forward position:     ${distance}`);
  console.log(`depth:                ${depth}`);
  console.log(`multiplied position:  ${depth*distance}`);

  return depth*distance
}

positionWithAim(inputToArray())