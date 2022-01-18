const fs = require('fs');

// MARK - Types

class Node {
  constructor(value, coords, risk = Infinity) {
    this.risk = risk; // risk to get to this spot (path cost)
    this.value = value;
    this.visited = false;
    this.coords = coords;
  }
}

// build an Set object to store nodes
class NodeSet {
  constructor() {
    this.nodes = []
  }

  length() { 
    return this.nodes.length;
  }

  add(newNode) {
    for (let i = 0; i < this.nodes.length; i++){
      const node = this.nodes[i];
      if (node.coords[0] === newNode.coords[0] && node.coords[1] === newNode.coords[1]){
        return this.nodes;
      }
    };
    this.nodes.push(newNode);
    return this.nodes;
  }

  remove(paramNode) {
    for (let i = 0; i < this.nodes.length; i++){
      const node = this.nodes[i];
      if (node.coords[0] === paramNode.coords[0] && node.coords[1] === paramNode.coords[1]){
        this.nodes = [...this.nodes.slice(0,i), ...this.nodes.slice(i+1)];
        return this.nodes;
      }
    };
  }

  includes(paramNode) {
    for (let i = 0; i < this.nodes.length; i++){
      const node = this.nodes[i];
      if (node.coords[0] === paramNode.coords[0] && node.coords[1] === paramNode.coords[1]){
        return true
      }
    };
    return false
  }
}

// MARK - Input Reader

// turn the input text into a nested array of Nodes
const inputToArray = (file) => {
  return fs.readFileSync(file)
    .toString().split("\n")
    .map((line, y) => line.split('')
    .map((e, x) => {
      return new Node(parseInt(e , 10), [x, y])
    }));    
}

// MARK - Part 1


const getUnvisitedNodes = (cave) => {
  const unvisitedNodes = new NodeSet();

  cave.forEach(line => {
    line.forEach(element => {
      unvisitedNodes.add(element);
    })
  })

  return unvisitedNodes;
}

const prettyPrint = (cave) => {
  console.log(`\n\VALUES:\n`);
  cave.forEach(line => {
    const lineMap = line.map(l => {
      return `${l.value}`
    })
    console.log(`${lineMap.join('')}`);
  })

  console.log(`\n\nVISITED:\n`);
  cave.forEach(line => {
    const lineMap = line.map(l => {
      return `${l.visited ? 't' : 'f'}`
    })
    console.log(`${lineMap.join('')}`);
  })

  console.log(`\nRISK:\n`);
  cave.forEach(line => {
    const lineMap = line.map(l => {
      return `${l.risk === Infinity ? '-' : l.risk}`
    })
    console.log(`${lineMap.join(' ')}`);
  })

  console.log(`\n\n`);
}

const getAdjacentNodes = (cave, node) => {

  const adjacentNodes = new NodeSet();
  const [x,y] = node.coords;

  // if there is a node above that is unvisited, add it to the set
  if (y > 0) adjacentNodes.add(cave[y-1][x]);

  // same for left
  if (x > 0) adjacentNodes.add(cave[y][x-1]);

  // same for right
  if (x < cave[y].length - 1) adjacentNodes.add(cave[y][x+1]);

  // same for below
  if (y < cave.length - 1) adjacentNodes.add(cave[y+1][x]);

  return adjacentNodes
}

// Convert to priority queue
const getLowestRiskUnvisitedNode = (cave) => {
  let nextNode = new Node();
  for (let y = 0; y < cave.length; y++){
    for (let x = 0; x < cave[y].length; x++){
      const node = cave[y][x];
      if (!node.visited && (!nextNode.risk || node.risk < nextNode.risk)){
        nextNode = node;
      }
    }
  }
  return nextNode;
}


// MARK Dijkstra

const dijkstra = (cave) => {

  // initialize our first node
  const initialNode = cave[0][0];
  initialNode.risk = 0; // only for the initial spot based on the instructions
  
  let currentNode = initialNode;
  
  // could maybe do count of visited nodes to save a little time instead
  let unvisitedNodes = getUnvisitedNodes(cave); 
  
  
  while(unvisitedNodes.length() > 0){
    currentNode.visited = true;
    unvisitedNodes.remove(currentNode);

    // update the risk levels of the adjacent nodes if needed. 
    const adjacentNodes = getAdjacentNodes(cave, currentNode);
    adjacentNodes.nodes.forEach(adjNode => {
      if (adjNode.risk > currentNode.risk + adjNode.value) {
        adjNode.risk = currentNode.risk + adjNode.value; 
      }
    });

    currentNode = getLowestRiskUnvisitedNode(cave);
  }

  return cave;
}

const main = (filename = 'test_input.txt') => {
  let cave = inputToArray(filename);

  cave = dijkstra(cave)
  
  // prettyPrint(cave)

  console.log('Cave Exit Risk:', cave[cave.length-1][cave[0].length-1].risk);
}

// main()
// main('input.txt')


// MARK: Part 2

// increment function to "wrap around" 9 back to 0, even if we add multiple
const increment = (x, increments) => {
  const newX = x + increments;
  const soln =  (newX > 9) ? (newX % 9) : newX;
  return soln
};

console.log(increment(8,1));

const incrementCave = (cave, incrementAmount) => {
  for (let y = 0; y < cave.length; y++){
    for (let x = 0; x < cave[y].length; x++){
      cave[y][x].value = increment(cave[y][x].value, incrementAmount);
    }
  }
  return cave
}

// helper function to perform the cave expansion
const getExpandedCave = (cave) => {
  const caveWidth = cave[0].length;
  const caveHeight = cave.length;
  const xDim = caveWidth * 5;


  // have to use map here or else it passes by reference
  const expandedCave = new Array(caveHeight).fill().map(() => {
    return new Array(xDim).fill().map(() => new Node(0))
  });

  // expand right first. 
  for (let y = 0; y < cave.length; y++){
    for (let x = 0; x < expandedCave[y].length; x++){ 
      const caveValue = cave[y % cave.length][x % caveWidth].value;
      

      let inc = 0
        if (x < caveWidth) {
          inc = 0
        }
        else if (x < caveWidth * 2){
          inc = 1;
        }
        else if (x < caveWidth * 3){
          inc = 2;
        }
        else if (x < caveWidth * 4){
          inc = 3;
        }
        else if (x < caveWidth * 5){
          inc = 4;
        }
      
      expandedCave[y][x].value = increment(caveValue, inc);

    }
  }

  // then expand down
  for (let i = 1; i < 5; i++){
    const expandedCaveCopy = JSON.parse(JSON.stringify(expandedCave.slice(0,caveHeight))); // hate this but it works
    incrementCave(expandedCaveCopy, i);
    expandedCave.push(...expandedCaveCopy)
  }

  // TODO combine this loop so we don't have to loop again.
  for (let y = 0; y < expandedCave.length; y++){
    for (let x = 0; x < expandedCave[y].length; x++){ 
      expandedCave[y][x].coords = [x,y];
      expandedCave[y][x].risk = Infinity;
    }
  }

  return expandedCave;
}
const main2 = (filename = 'test_input.txt') => {
  let cave = inputToArray(filename);
  
  // prettyPrint(cave)
  
  let expandedCave = getExpandedCave(cave);
  // prettyPrint(expandedCave)

  // prettyPrint(expandedCave)
  expandedCave = dijkstra(expandedCave)
  

  console.log('Cave Exit Risk:', expandedCave[expandedCave.length-1][expandedCave[0].length-1].risk);
  
}

// main2()
main2('input.txt')