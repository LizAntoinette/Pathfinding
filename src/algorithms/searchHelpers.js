export function createSearchNode(edge, previousNode = null) {
  return {
    point1: edge.point1,
    point2: edge.point2,
    distance: Number(edge.distance) || 0,
    previousNode,
    cost: {
      F: Infinity,
      G: Infinity,
      H: Infinity
    }
  };
}

export function getNeighbors(grid, vertex, size) {
  const row = grid[vertex] || [];

  return row.slice(0, size).filter(edge => Number(edge.distance) > 0);
}

export function reconstructPath(node) {
  const path = [];
  let currentNode = node;

  while (currentNode) {
    path.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return path;
}

export function heuristicByNode(heuristics) {
  return new Map(heuristics.map(item => [item.node, Number(item.hval)]));
}

export function emptySearchResult(visitedNodes) {
  return [visitedNodes, []];
}
