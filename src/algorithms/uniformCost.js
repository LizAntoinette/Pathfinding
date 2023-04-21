export function uniformCost(grid, startNode, finishNode, size, heuristic) {
  const closedlist = [];
  const openlist = [];

  startNode.cost = {
    F: 0,
    G: 0,
    H: 0
  };

  openlist.push(startNode);

  console.log("uniformCost is clicked");

  while (openlist.length > 0) {
    openlist.sort((a, b) => a.distance - b.distance);
    const current = openlist.shift();


    closedlist.push(current);

    if (current.point2 === finishNode)
      return [closedlist, calculatePath(current)];

    const neighbors = getAllNeighbors(grid, current, size);

    for (let i = 0; i < neighbors.length; i++) {
      const nNode = neighbors[i];
      nNode.isVisited = true;
      if (closedlist.includes(nNode)) continue;

      //Addition of the node heuristics and distance cost
      nNode.cost.F = current.distance + nNode.distance;

      if (!openlist.includes(nNode)|| nNode.cost.F < current.distance) {
        nNode.previousNode = current;
        openlist.push(nNode);
      }
    }
  }
 
  return [closedlist, calculatePath(finishNode)];
}

function getAllNeighbors(grid, node, size) {
  const neighbors = [];
  const point2 = node.point2;

  for (let i = 0; i < size; i++) {
    var tempNode = grid[point2][i];
    if (!tempNode.isVisited && tempNode.distance > 0) {
      grid[i][point2].isVisited = true;
      // grid[i][point2].distance += node.distance;
      // grid[point2][i].distance += node.distance;
      neighbors.push(tempNode);
    }
  }
  return neighbors;
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
