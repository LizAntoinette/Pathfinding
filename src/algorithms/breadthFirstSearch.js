export function bfs(grid, startNode, finishNode, size) {
  const queue = [];
  const visitedNodesInOrder = [];
  console.log("The grid");


  startNode.isVisited = true;
  visitedNodesInOrder.push(startNode);

  queue.push(startNode);

  while (queue.length>0) {
      let node = queue.shift();

      if (node.point2 === finishNode)
          return [visitedNodesInOrder, calculatePath(node)];

     
      const neighbors = getAllNeighbors(grid, node, size);
      console.log("Calculating..");
      console.log(neighbors);

      for (const neighbor of neighbors) {
          neighbor.isVisited = true;
          neighbor.previousNode = node;
          visitedNodesInOrder.push(neighbor);
          queue.push(neighbor);
          
      }
  }

  return [visitedNodesInOrder, calculatePath(startNode)];
}

function calculatePath(finishNode) {
  const shortestPathNodes = [];
  let currentNode = finishNode;
  console.log("the unshifting");
  while (currentNode !== null) {

      shortestPathNodes.unshift(currentNode);
      currentNode = currentNode.previousNode;

      console.log(shortestPathNodes);
  }
  return shortestPathNodes;
}

function getAllNeighbors(grid, node, size) {

  const neighbors = [];
  const point2 = node.point2;
   
  for(let i=0; i <size; i++){
    var tempNode = grid[point2][i]; 
    if((!(tempNode.isVisited && grid[i][point2].isVisited)) && tempNode.distance > 0){
        neighbors.push(tempNode);
        for(let j=0; j <size; j++){
          grid[i][j].isVisited = true;
        }
    }
    
  }

   return neighbors;
}
