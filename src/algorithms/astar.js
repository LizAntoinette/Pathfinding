export function astar(grid, startNode, finishNode, size, heuristic) {
  const closedlist = [];
  const openlist = [];
  const startH = heuristic.find((h) => h.node === startNode.point2);
  startNode.cost = {
    F: 0.0,
    G: 0.0,
    H:startH.hval
  };
  console.log("clicking a*")
  openlist.push(startNode);

  while (openlist.length > 0) {
    openlist.sort((a, b) => parseFloat(a.cost.F) - parseFloat(b.cost.F));
    const current = openlist.shift();

    closedlist.push(current);
    console.log(current);

    if (current.point2 === finishNode)
      return [closedlist, calculatePath(current)];

    const neighbors = getAllNeighbors(grid, current, size);

    for (let i = 0; i < neighbors.length; i++) {
      const nNode = neighbors[i];
      const hNode = heuristic.find( (h) => h.node === nNode.point2);
      nNode.isVisited = true;
      if (closedlist.includes(nNode)) continue;

      let tentativeG = current.cost.G  + nNode.distance;

      nNode.previousNode = current;

      if (tentativeG < (nNode.distance)) {
        nNode.cost.H = parseFloat(hNode.hval);
        nNode.cost.G =   parseFloat(tentativeG);
        nNode.cost.F =  parseFloat(nNode.cost.G) + parseFloat(nNode.cost.H);
        console.log("equations:");
        console.log( nNode.distance +" + "+ nNode.cost.H+" = "+ nNode.cost.F )
          
        if (!openlist.includes(nNode)) {
         
          openlist.push(nNode);
        }
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
