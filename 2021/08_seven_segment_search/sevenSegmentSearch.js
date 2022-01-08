const { count } = require('console');

const inputToArray = (file) => {
  const fs = require('fs');
  let lines = fs.readFileSync(file).toString().split("\n");

  lines = lines.map(line => {
    let [inputs, outputs] = line.split(' | ');
    inputs = inputs.trim().split(' ');
    outputs = outputs.trim().split(' ');

    return [inputs, outputs]
  })

  return lines;
}


const notes = inputToArray('./input.txt');

// MARK Part 1 - Count Easy Digits (1, 4, 7, 8)
const main = (notes = []) => {
  
  const counts = new Array(10).fill(0);

  notes.forEach(display => {
    
    const [inputs, outputs] = display;

    outputs.forEach(output => {

      switch (output.length){
        case 2: // found a 1
          counts[1] ++;
          break;
        case 3: // found a 7
          counts[7] ++;
          break
        case 4: // found a 4
          counts[4] ++;
          break
        case 7: // found an 8
          counts[8] ++;
          break
      }

    })

  })

  const total = counts.reduce((count, current) => count + current)

  console.log(`Digits 1, 4, 7, or 8 appeared ${total} times`);
  return total;
}

// main(notes)

// MARK Part 2 Helpers

// a - b
const diff = (a, b) => {

  const arrA = a.split('');
  const arrB = b.split('');

  const diff = [];
  arrA.forEach(letter => {
    if (!arrB.includes(letter)){
      diff.push(letter)
    }
  })

  return diff.join('');
}

const sort = (pattern) => pattern.split('').sort().join('');


// build the key to decode the displays
const key = (unsortedPatterns) => {

  const patterns = unsortedPatterns.map(p => sort(p))
  const mappedPatterns = new Array(10).fill('');
  
  let fiveLetterPatterns = [];
  let sixLetterPatterns = []

  // figure out our single possibility numbers (1, 4, 7, 8)
  patterns.forEach(pattern => {
    switch (pattern.length){
      case 2: // found the 1
        mappedPatterns[1] = pattern;
        break;
      case 3: // found the 7
        mappedPatterns[7] = pattern;
        break;
      case 4: // found the 4
        mappedPatterns[4] = pattern;
        break;
      case 5:
        fiveLetterPatterns.push(pattern);
        break;
      case 6:
        sixLetterPatterns.push(pattern);
        break;
      case 7: // found the 8
        mappedPatterns[8] = pattern;
        break
    }
  })

  const one = mappedPatterns[1];

  // determine 3
  for (let p = 0; p<fiveLetterPatterns.length; p++){
    const current = fiveLetterPatterns[p];
    
    if (diff(current, one).length === 3){
      mappedPatterns[3] = current;
      fiveLetterPatterns = fiveLetterPatterns.filter(x => x != current)
      break;
    }
  }

  const three = mappedPatterns[3];
  const four = mappedPatterns[4];

  // determine 2 and 5
  for (let p = 0; p < fiveLetterPatterns.length; p++){
    let current = fiveLetterPatterns[p];

    current = diff(current, three);
    current = diff(current, four)

    if (current.length === 1){
      mappedPatterns[2] = fiveLetterPatterns[p];
    } else if (current.length === 0){
      mappedPatterns[5] = fiveLetterPatterns[p]
    }
  }

  // determine 6
  for (let p = 0; p < sixLetterPatterns.length; p++){
    let current = sixLetterPatterns[p];
    
    current = diff(current, one)
    
    if (current.length === 5){
      const six = sixLetterPatterns[p];
      mappedPatterns[6] = six;
      sixLetterPatterns = sixLetterPatterns.filter(x => x != six)
      break;
    }
  }

  // determine 0 and 9
  for (let p = 0; p < sixLetterPatterns.length; p++){
    let current = sixLetterPatterns[p];
    current = diff(current, four)

    if (current.length === 2){
      mappedPatterns[9] = sixLetterPatterns[p];
    } else if (current.length === 3){
      mappedPatterns[0] = sixLetterPatterns[p]
    }
  }
 

  // turn array into an object for easier manipulation
  const key = {};
  mappedPatterns.forEach((pattern, i) => {
    key[pattern] = i;
  })

  return key;
}

// decode the display using the key
const decode = (key, display) => {

  // we must sort the pattern so we can match against our key.
  const actual = display.map(pattern => key[sort(pattern)]).join('')

  // turn it back into an integer
  return parseInt(actual);
}

// MARK Part 2 Main

const main2 = (notes) => {

  let count = 0;

  // run the calculation for each note, updating the count each time.
  notes.forEach(note => {
    const [input, display] = note;
    const inputKey = key(input);
    count += decode(inputKey, display);
  });

  console.log(`display sum: ${count}`);

  return count;
}

main2(notes)