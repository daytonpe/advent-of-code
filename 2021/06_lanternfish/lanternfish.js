// MARK Input Reader

const inputToArray = (file) => {
  const fs = require('fs');
  let array = fs.readFileSync(file).toString().split(",");
  array = array.map(x => parseInt(x, 10)) // This part got me for a while
  return array
}


// MARK: Part 1
const main = (initialState = [], days = 18) => {

  let state = [...initialState];

  for (let i = 1; i <= days; i++){

    const babyFish = []

    state = state.map(fish => {

      if (fish == 0) { // if the fish is ready to give birth?
        
        babyFish.push(8)

        return 6;
      } else { // else just decrement
        
        return fish - 1;
      }

    } ) 
    state = state.concat(babyFish)

    // use when number of days is small or else it blows up
    // console.log(`After ${i} days: ${state}`);

  }

  // console.log(`Fish after ${days} days? ${state.length}`);
  return state.length;
}

// MARK: Part 1 (REcursive)
const mainRecursive = (initialState = [], days = 18) => {

  let state = [...initialState];

  let count = 0;
  
  for (let i = days; i > 0; i--){
    
    const babyFish = []

    state = state.map(fish => {

      if (fish == 0) { // if the fish is ready to give birth?
        babyFish.push(8)
        return 6;
      } else { // else just decrement
        return fish - 1;
      }

    } ) 
    
    if (babyFish.length > 0) {
      count += main2(babyFish, i-1)
    }

  }

  // console.log(`Fish after ${days} days? ${state.length}`);
  return state.length + count;
}


// MARK: Part 2
// needed a few hints on this one.
const main2 = (initialState = [], days = 256) => {

  let ageCounts = new Array(9).fill(0)

  initialState.forEach(age => ageCounts[age]++)

  for (let i = 1; i <= days ; i++){
    // the baby count for the next day will be the current number of 0s, doubled.
    const babyCount =  ageCounts.shift()
    ageCounts[6]+=babyCount; // parents go back to 6
    ageCounts.push(babyCount)
  }

  const schoolSize = ageCounts.reduce((count, total) => count + total);

  console.log(`After ${days} days there will be ${schoolSize} fish.`);
}


const output = main2(inputToArray('input.txt'), 256);