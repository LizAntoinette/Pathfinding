export function astar(grid, startNode, finishNode, size, heuristic, distances) {
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
    const current = openlist.shift( );

    closedlist.push(current);

    if (current.point2 === finishNode)
      return [closedlist, calculatePath(current)];

   
    const neighbors = getAllNeighbors(grid, current, size);

    for (let i = 0; i < neighbors.length; i++) {
      const nNode = neighbors[i];
      if (closedlist.includes(nNode)) continue;

      const hNode = heuristic.find( (h) => h.node === nNode.point2);
      nNode.isVisited = true;
      // console.log("current node");
      // console.log(current);
      // console.log("neighbor node");
      // console.log(nNode);
      
     
      let tentativeG = current.cost.G  +  parseFloat(nNode.distance);
      console.log("tentative G");
      console.log("current cost g: " +current.cost.G+"  neighbor distance: "+ nNode.distance +" =  "+ tentativeG);
     nNode.previousNode = current;

      if (!openlist.includes(nNode)) {
        openlist.push(nNode);
      }else if (tentativeG >= parseFloat(nNode.distance)) {
        continue;
      }

      // nNode.previousNode = current;
      nNode.cost.H = parseFloat(hNode.hval);
      nNode.cost.G =   parseFloat(tentativeG);
      nNode.cost.F =  parseFloat(nNode.cost.G) + parseFloat(nNode.cost.H);
      // console.log("the F solution thingy");
      // console.log("tentativeG: "+ nNode.cost.G+" neighgor heuristic: "+nNode.cost.H+" = "+ nNode.cost.F);
    }
  }
  return [closedlist, calculatePath(finishNode)];
}

function distance(nodeA, nodeB) {
  // return distance between nodeA and nodeB
  return Math.sqrt(Math.pow(nodeB.x - nodeA.x, 2) + Math.pow(nodeB.y - nodeA.y, 2));
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
