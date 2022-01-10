// Barked up the wrong tree here. This is the recursive validator that I 
// intitially came up with which turns out to be much less effecient than the 
// stack method. Enjoy...


// return bool noting if b "closes" a
const isMatch = (a, b) => {
  switch (a) {
    case '(':
      return b === ')';
    case '{':
      return b === '}';
    case '[':
      return b === ']';
    case '<':
      return b === '>';
  }
}

const isValid = (chunk = []) => {

  console.log(`\n\nchecking chunk\n${chunk.join(' ')}`);

  if (chunk.length == 0) {
    console.log(`length 0, returning true`);
    return true;
  }

  // odd length chunks can't be valid
  if (chunk.length % 2 == 1) {
    console.log(`odd length, returning false`);
    return false;
  }

  // current is the first char that we will try to "close"
  const current = chunk[0];

  // return true if we receive something like "<>" or "()"
  if (chunk.length == 2 && isMatch(current, chunk[1])) {
    console.log(`basic match, returning true`);
    return true;
  }

  if (chunk.length == 2 && !isMatch(current, chunk[1])) {
    console.log(`basic non match, returning false`);
    return false;
  }
  
  // when we match against the first character in the chunk, we know that for
  // each closing character corresponding to the first character, we can split
  // the chunk into two pieces. The inside of the found match, and everything
  // that comes after the match closing: (***)*** becomes (***) && ***. There
  // can be many of these splits, so we must check for all possible combos.
  let splits = [];
  // don't need to check j = 1, since we already did in base condition
  for (let j = 1; j < chunk.length; j++){
    
    // console.log(`j = ${j} - comparing ${current} and ${chunk1[j]} - match? ${isMatch(current, chunk1[j])}`);

    if (isMatch(current,  chunk[j])){
      
      const subChunk1 = chunk.slice(1, j);
      const subChunk2 = chunk.slice(j+1);
      console.log(`found chunk1 split possibility: ${subChunk1.join(' ')}   &&   ${subChunk2.join(' ')}`);

      splits.push([subChunk1, subChunk2])

    }
  }

  // loop through each of the possible chunk splits and check that each side
  // of the split is valid. If we find a valid way of splitting (where both 
  // sides of the split are valid) we have validated the line
  let validSplitFound = false
  splits.forEach(split => {
    if (isValid(split[0]) && isValid(split[1])){
      validSplitFound = true;
    }
  })

  console.log(`valid split found? - ${validSplitFound}`);

  // TODO REMOVE
  if (!validSplitFound){
    // what was the first non valid split? 
    // it might be that its the closing of the first letter in the first split
    console.log(`splits[0]: ${splits[0]}`);
  }
// TODO REMOVE

  return validSplitFound

}