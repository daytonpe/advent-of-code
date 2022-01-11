const fs = require('fs');

// MARK Part 1 - Input Reader

const inputToArray1 = (file) => {
  const lines = fs.readFileSync(file)
    .toString().split("\n").map(line => line.split('-'));

  const edges = {};
  const visited = {};

  // build an edges object and a visited object. 
  // edges says which edges come from each node
  // visited says which nodes have been visited
  lines.forEach(line => {

    const a = line[0];
    const b = line[1];

    visited[a] = false;
    visited[b] = false;

    // build the edge map going forward, foregoing duplicates
    if (edges[a]){

      if (!edges[a].includes(b)) edges[a].push(b);

    } else {

      edges[a] = [b];

    }

    // now backward
    if (edges[b]){

      if (!edges[b].includes(a)) edges[b].push(a);

    } else {

      edges[b] = [a];
    }

  })

  return {edges, visited};
}

// MARK Part 1

const isSmallCave = (node) => node == node.toLowerCase();

// would probably be more professional to return the paths rather than use a 
// global variable. 
const partOnePaths = []; 

const dfsUtil = (node, finish, edges, visited, path = []) => {
  // copy of our objects because Node will pass by reference otherwise
  const visitedCopy = Object.assign({}, visited);
  const pathCopy = [...path]
  
  // mark only small caves as visited so that we have the option to come back
  // through.
  if (isSmallCave(node)){
    visitedCopy[node] = true;
  }

  // still need to add it to our path though, since we did technically "visit"
  pathCopy.push(node)

  for(let i = 0; i < edges[node].length; i++){
    const neighbor = edges[node][i]
    if(neighbor == finish){
      partOnePaths.push([...pathCopy, finish])
      // console.log(`path:`, [...pathCopy, finish]);
      continue

    // if we haven't reached the end, we continue searching. BUT we can only
    // search if the new node is an unvisited small cave or a big cave. Luckily 
    // we've already handled this by never marking a big cave as visited.
    } else if (!visitedCopy[neighbor]){
      dfsUtil (neighbor, finish, edges, visitedCopy, pathCopy);
    }
  }
}

const main1 = (filename = 'test_input_1.txt') => {
  const {edges, visited} = inputToArray1(filename);

  console.log('edges',edges);

  // visit start
  dfsUtil('start', 'end', edges, visited)

  console.log(`\nNumber of paths: ${partOnePaths.length}`);


}

// main1('input.txt')

// MARK Part 2 - Input Reader

const inputToArray2 = (file) => {
  const lines = fs.readFileSync(file)
    .toString().split("\n").map(line => line.split('-'));

  const edges = {};
  const visited = {};

  // build an edges object and a visited object. 
  // edges says which edges come from each node
  // visited says which nodes have been visited
  lines.forEach(line => {

    const a = line[0];
    const b = line[1];

    visited[a] = 0;
    visited[b] = 0;

    // build the edge map going forward, foregoing duplicates
    if (edges[a]){

      if (!edges[a].includes(b)) edges[a].push(b);

    } else {

      edges[a] = [b];

    }

    // now backward
    if (edges[b]){

      if (!edges[b].includes(a)) edges[b].push(a);

    } else {

      edges[b] = [a];
    }

  })

  return {edges, visited};
}

// MARK Part 2

// has a small cave been visited twice? loop through caves to find out.
const extraTime = (visited) => {
  const caves = Object.keys(visited);
  for (let i = 0; i < caves.length; i++){
    const cave = caves[i];
    if (isSmallCave(cave)){
      if (visited[cave] === 2) {
        return false;
      }
    }
  }
  return true;
}

// would probably be more professional to return the paths rather than use a 
// global variable. 
const partTwoPaths = []; 

// same idea, except that we will keep track of whether or not we have extra
// time and do extra recursing if we do.
const dfsUtil2 = (node, finish, edges, visited, path = []) => {
  // copy of our objects because Node will pass by reference otherwise
  const visitedCopy = Object.assign({}, visited);
  const pathCopy = [...path]
  
  // mark only small caves as visited since we can revisit big caves
  if (isSmallCave(node)){
    visitedCopy[node]++;
  }

  // console.log('visitedCopy',visitedCopy);

  // still need to add it to our path though, since we did technically "visit"
  pathCopy.push(node)

  for(let i = 0; i < edges[node].length; i++){
    const neighbor = edges[node][i]

    // now that we aren't using a boolean visited, we have to be explicit about
    // not revisiting the start. 
    if(neighbor === 'start'){
      continue;

    }else if(neighbor == finish){
      partTwoPaths.push([...pathCopy, finish])
      console.log(`path:`, [...pathCopy, finish].join(' --> '));
      continue

    // if it's a big cave, we always recurse
    } else if (!isSmallCave(neighbor)){
      dfsUtil2 (neighbor, finish, edges, visitedCopy, pathCopy);

      // if it's a small cave we have scenarios.
    } else{
      
      // if we have extra time remaining (haven't visited a small cave twice
      // already) then we can visit this cave if it has < 2 visits. 
      if (extraTime(visitedCopy) && visitedCopy[neighbor] < 2){
        dfsUtil2 (neighbor, finish, edges, visitedCopy, pathCopy);

      // if we don't have extra time, we can only visit unvisited small caves 
      } else if (!extraTime(visitedCopy) && visitedCopy[neighbor] == 0){
        dfsUtil2 (neighbor, finish, edges, visitedCopy, pathCopy);
      }

    }
  }
}

const main2 = (filename = 'test_input_2.txt') => {
  const {edges, visited} = inputToArray2(filename);

  console.log('edges',edges);

  // visit start
  dfsUtil2('start', 'end', edges, visited)

  console.log(`\nNumber of paths: ${partTwoPaths.length}`);


}

main2('input.txt')