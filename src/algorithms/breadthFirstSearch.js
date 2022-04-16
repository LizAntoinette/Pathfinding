export function bfs(grid, startNode, finishNode, size) {
  const queue = [];
  const visitedNodesInOrder = [];

  startNode.isVisited = true;
  queue.push(startNode);

  while (!!queue.length) {
      let node = queue.shift();

      if (node.point2 === finishNode)
          return [visitedNodesInOrder, calculatePath(node)];

     
      const neighbors = getAllNeighbors(grid, node, size);

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
  while (currentNode !== null) {
      shortestPathNodes.unshift(currentNode);
      currentNode = currentNode.previousNode;
  }
  return shortestPathNodes;
}

function getAllNeighbors(grid, node, size) {

  const neighbors = [];
  const point2 = node.point2;
   
  for(let i=0; i <size; i++){
    var tempNode = grid[point2][i]; 
    if((!tempNode.isVisited) && tempNode.distance > 0){
        grid[i][point2].isVisited = true;
        neighbors.push(tempNode);
    }
  }
   return neighbors;
}
