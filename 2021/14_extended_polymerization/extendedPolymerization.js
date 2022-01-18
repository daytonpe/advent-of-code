const fs = require('fs');

// MARK - Input Reader

const inputToArray = (file) => {
  const lines = fs.readFileSync(file)
    .toString().split("\n");

  const polymer = lines[0];
  let rules = {};

  for (let i = 2; i < lines.length; i++){
    const current = lines[i].split(' -> ');
    rules[current[0]] = current[1]
  }

  return {polymer, rules}
}

// MARK - Part 1

const score = (polymer) => {

  const counts = {};
  let maxCount = 0;
  let minCount = Infinity;

  for (let i = 0; i < polymer.length; i++){

    let count = counts[polymer[i]];

    if (!count) {
      counts[polymer[i]] = 1;
    } else {
      counts[polymer[i]] ++;
    }

  }

  Object.keys(counts).forEach(key => {
     // figure out the max and the min
     if (counts[key] > maxCount) {
        maxCount = counts[key];
      }

      if (counts[key] < minCount) {
        minCount = counts[key];
      }
  })

  return maxCount - minCount;
}

const main = (filename = "test_input.txt", steps = 10) => {

  const input = inputToArray(filename);
  let polymer = input.polymer;
  const rules = input.rules;

  console.log('Rules',rules);
  console.log('Template: ', polymer);

  for (let s = 1; s <= steps; s++){
    
    const newPolymer = [];
    
    // loop through the template
    
    for (let i = 0; i < polymer.length - 1; i++){

      const pair = polymer.slice(i,i+2);

      newPolymer.push(pair[0])

      // if there is a rule for the pair, we push the 
      if (rules[pair]) {
        newPolymer.push(rules[pair])
      }
    }

    // don't forget to add the last letter
    newPolymer.push(polymer.slice(-1))

    polymer = newPolymer.join('')

  }

  console.log(`Score: ${score(polymer)}`)

  return polymer;
}

// main()
// main('input.txt');

// MARK - Part 2 - Time to get more space efficient.

// create a set of rules that say ac -> ab & bc
const getPairMap = (rules) => {

  const pairMap = {};

  Object.keys(rules).forEach(pair => {

    if (rules[pair]){
      const a = pair[0];
      const b = rules[pair];
      const c = pair[1];
  
      const ab = `${a}${b}`;
      const bc = `${b}${c}`;
  
      pairMap[pair] = [ab, bc]
    }
  })

  return pairMap;
}

// "PD" -> 23, "AJ" -> 30, etc.
const getPairCounts = (polymer) => {

  const counts = {};

  for (let i = 0; i < polymer.length - 1; i++){
    
    const pair = polymer.slice(i,i+2);

    if (!counts[pair]){
      counts[pair] = 1;
    } else {
      counts[pair] ++; 
    }
  }

  return counts;
}

// need a new score function since we are using pair counts instead of an array
const score2  = (pairCounts, firstLetter, lastLetter) => {
  const letterCounts = {};
  let maxCount = 0;
  let minCount = Infinity;

  // The first and last letter need a .5 handycap because all "middle" letters 
  // will be counted twice each time they are in split.
  letterCounts[firstLetter] = .5;
  letterCounts[lastLetter] = .5;

  Object.keys(pairCounts).forEach(pair => {
    
    const l1 = pair[0];
    const l2 = pair[1];

    // count the number of times each pair "AB" is encountered int the new
    // template. For each time, increase the count of A's by .5 and the count 
    // of B's by .5 since they will be added twice for each middle pair.
    if (letterCounts[l1]){
      letterCounts[l1] += pairCounts[pair] / 2;
    } else {
      letterCounts[l1] = pairCounts[pair] / 2;
    }

    if (letterCounts[l2]){
      letterCounts[l2] += pairCounts[pair] / 2;
    } else {
      letterCounts[l2] = pairCounts[pair] / 2;
    }

  })

  // figure out the max and the min
  Object.keys(letterCounts).forEach(key => {
    const current = letterCounts[key];
    if (current > maxCount) maxCount = current;
    if (current < minCount) minCount = current;
 })

 return maxCount - minCount;

}

const main2 = (filename = "input.txt", steps = 40) => {

  const input = inputToArray(filename);
  let polymer = input.polymer;
  const rules = input.rules;

  
  // get the pairMap;
  const pairMap = getPairMap(rules);

  // get initial pair counts from the template
  let pairCounts = getPairCounts(polymer);

  for (let i = 1; i <= steps; i++){

    // create a copy of the pairCounts so we don't have to worry about looping
    // and incrementing over/on the same object at the same time
    const pairCountsCopy = Object.assign({}, pairCounts);

    // loop through the pairCounts keys
    Object.keys(pairCounts).forEach(pck => {
      
      // if there is a rule for that key, decrement the key and increment the two
      // keys that the rule leads to.
      if (pairCounts[pck]){
        
        const increment = pairCounts[pck]

        // do the incrmenting until the pairCountsCopy[pck] has reached 0.
        // i.e. split every instance of this pair.
        pairCountsCopy[pck] = pairCountsCopy[pck] - increment;
        const [pm1, pm2] = pairMap[pck];
        pairCountsCopy[pm1] = pairCountsCopy[pm1] ? pairCountsCopy[pm1] + increment : increment;
        pairCountsCopy[pm2] = pairCountsCopy[pm2] ? pairCountsCopy[pm2] + increment : increment;        
      }
    })

    pairCounts = pairCountsCopy;

  }

  const total = score2(pairCounts, polymer[0], polymer[polymer.length-1]);
  console.log('Template',polymer);
  console.log(`Score: ${total}`);
  
  return polymer;
}

main2()
// main2('input.txt');