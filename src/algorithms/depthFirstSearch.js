export function dfs(grid, startNode, finishNode, size) {
  const stack = [];
  const visitedNodesInOrder = [];

  startNode.isVisited = true;
  stack.push(startNode);
  visitedNodesInOrder.push(startNode);

  while (stack.length>0) {
      let node = stack.pop();

      if (finishNode === node.point2)
          return [visitedNodesInOrder, calculatePath(node)];


      const neighbors = getAllNeighbors(grid, node, size);

      for (const neighbor of neighbors) {
          neighbor.isVisited = true;
          neighbor.previousNode = node;
          visitedNodesInOrder.push(neighbor);
          stack.push(neighbor);
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
    if((!(tempNode.isVisited && grid[i][point2].isVisited)) && tempNode.distance > 0){
        neighbors.push(tempNode);
        for(let j=0; j <size; j++){
          grid[i][j].isVisited = true;
        }
    }
    
  }

    return neighbors;
}
  