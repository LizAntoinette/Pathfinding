export function greedyBFS(grid, startNode, finishNode, size, heuristic) {
  const closedlist = [];
  const openlist = [];

  const startH = heuristic.find((h) => h.node === startNode.point2);
  startNode.cost = {
    F: 0,
    G: 0,
    H: startH.hval
  };

  openlist.push(startNode);

  while (!!openlist.length) {
    openlist.sort((a, b) => a.cost.F - b.cost.F);
    const current = openlist.shift();

    closedlist.push(current);

    if (current.point2 === finishNode)
      return [closedlist, calculatePath(current)];

    const neighbors = getAllNeighbors(grid, current, size);

    for (let i = 0; i < neighbors.length; i++) {
      const nNode = neighbors[i];
      const hNode = heuristic.find((h) => h.node === nNode.point2);
      nNode.isVisited = true;
      if (closedlist.includes(nNode)) continue;

      //Calculate Cost H computes the heuristics of the node  (distance between node and distance)
      nNode.cost.H = hNode.hval;
      //Addition of the node heuristics and distance cost
      nNode.cost.F = nNode.cost.H;

      if (!openlist.includes(nNode)) {
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
