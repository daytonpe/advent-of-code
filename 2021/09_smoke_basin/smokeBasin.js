// MARK Input Reader

const inputToArray = (file) => {
  const fs = require('fs');
  let lines = fs.readFileSync(file).toString().split("\n");

  lines = lines.map(line => line.split('').map(l => parseInt(l, 10)))

  return lines;
}

// MARK Part 1 - Helper Functions

const isMin = (heightmap, x, y) => {
  const value = heightmap[y][x];

  // check left
  if (x > 0) { // is there a left?
    if (value >= heightmap[y][x-1]) return false;
  }

  // check right
  if (x < heightmap[y].length - 1) { // is there a right?
    if (value >= heightmap[y][x+1]) return false;
  }

  // check up
  if (y > 0) { // is there an up?
    if (value >= heightmap[y-1][x]) return false;
  }

  // check down
  if (y < heightmap.length - 1) { // is there an down?
    if (value >= heightmap[y+1][x]) return false;
  }

  return true;
}

// MARK Part 1 - Main

const main = (heightmap) => {
  
  let risk = 0;

  // traverse through the field, checking to see if each node is a min
  for (let y = 0; y < heightmap.length; y++){
    for (let x = 0; x < heightmap[y].length; x++){
      if (isMin(heightmap, x, y)){
        const riskLevel = heightmap[y][x] + 1;
        risk += riskLevel;
        console.log(`Found min (${x}, ${y}). Risk Level: ${riskLevel}`);
      }
    }
  }

  console.log(`Total Risk: ${risk}`);
  return risk;
}

// const heightmap = inputToArray('input.txt');
// main(heightmap)

// MARK Part 2 - Helpers

// dfs performs a depth first search on a heightmap to determine a basin size. 
// note that the way our search area is set up, we have down and right, rather
// than the traditional right and left of DFS. We will go RIGHT before DOWN.
const dfs = (x, y, map) => {
  const stack = [];
  const [count, finalMap] = dfsUtil(x, y, map, stack);
  return [count, finalMap];
}


const dfsUtil = (x, y, map, stack) => {

  // push to the stack if this is our first time visiting
  if (!map[y][x].visited){
    // mark as visited
    map[y][x].visited = true;
    stack.push([x,y]);
  }
  
  // are there any adjacent unvisited? If so, visit in this order:
  // (RIGHT, DOWN, LEFT, UP)
  const moreBoardRight = (map[y].length > x+1) && map[y][x+1].val !== 9;  

  // if there is more non-9 board to the RIGHT that is UNVISITED, recurse
  if (moreBoardRight && !map[y][x+1].visited){
    const [count, updatedMap] = dfsUtil(x+1, y, map, stack)
    return [1+count, updatedMap]
  }

  // For each direction, check that there is 
  // 1. another spot in that direction
  // 2. that spot is unvisited
  // 3. that spot is not a wall (9)
  const moreBoardDown = (map.length > y+1)  && map[y+1][x].val !== 9
  if (moreBoardDown && !map[y+1][x].visited) {
    const [count, updatedMap] = dfsUtil(x, y+1, map, stack);
    return [1+count, updatedMap];
  }

  const moreBoardLeft = (x>0 && map[y][x-1].val !== 9);
  if (moreBoardLeft && !map[y][x-1].visited){
    const [count, updatedMap] = dfsUtil(x-1, y, map, stack)
    return [1+count, updatedMap]
  }

  const moreBoardUp = (y>0 && map[y-1][x].val !== 9);
  if (moreBoardUp && !map[y-1][x].visited){
    const [count, updatedMap] = dfsUtil(x, y-1, map, stack)
    return [1+count, updatedMap]
  }

  // Reached the end of branch. Backtrack to the next value in stack.
  if (stack.length > 0){
    const [xs, ys] = stack.pop();
    return dfsUtil(xs, ys, map, stack)
  }
  
  // base case, only adjacent 9s or walls and stack is empty
  return [1, map];
}

const addVisitedBoolToMap = (heightmap) => {
  return heightmap.map(row => {
    return row.map(height => {return {val: height, visited: false}})
  })
}

// MARK Part 2 - Main - Using DFS search
// The tricky part here is that  we have to keep track of the map of visited 
// locations over multiple uses of DFS.
const main2 = (map) => {
  
  let visitedMap = addVisitedBoolToMap(map);

  let basins = [];

  // Since every non-wall spot belongs to exactly one basin, we can simply crawl
  // the board and use a DFS search when we find an unvisited non wall spot. The
  // DFS will count the spaces in that basin and mark them as visited.
  for (let y = 0; y < map.length; y++){
    
    for (let x = 0; x < map[y].length; x++){

      // base condition #1: if we've already visited this board space, continue
      // because it means we've already included in a basin.
      if (visitedMap[y][x].visited) continue;

      // base condition #2 (9): if we are on a nine, continue
      if (visitedMap[y][x].val === 9) continue;

      
      // if we make it past these two, we are in a basin. huzzah! Now we just
      // need to count the number of spaces in the basin
      const [basinSize, newVisitedMap] = dfs(x, y, visitedMap);

      // update the visited map
      visitedMap = newVisitedMap;
      
      // add size to the array of basin sizes 
      basins.push(basinSize);

    }
  }

  // Sort and determine the product of the biggest three basins
  basins = basins.sort((a,b) => (a > b) ? -1 : 1)
  const product = basins[0] * basins[1] * basins[2];

  // console.log('Visited Map:',visitedMap); // huge if not using test data
  console.log('Basin Sizes:',basins);
  console.log('Product of Largest 3: ',product);

  return product;
}

const heightmap = inputToArray('input.txt');
main2(heightmap)