import {
  createSearchNode,
  emptySearchResult,
  getNeighbors,
  heuristicByNode,
  reconstructPath
} from "./searchHelpers";

export function astar(grid, startNode, finishNode, size, heuristic) {
  const heuristicMap = heuristicByNode(heuristic);
  const start = createSearchNode(startNode);
  const startH = heuristicMap.get(start.point2);
  start.cost = { F: startH, G: 0, H: startH };

  const frontier = [start];
  const bestByNode = new Map([[start.point2, start]]);
  const closed = new Set();
  const visitedNodesInOrder = [];

  while (frontier.length) {
    frontier.sort((a, b) => a.cost.F - b.cost.F || a.cost.H - b.cost.H);
    const current = frontier.shift();
    if (closed.has(current.point2)) continue;

    closed.add(current.point2);
    visitedNodesInOrder.push(current);

    if (current.point2 === finishNode) {
      return [visitedNodesInOrder, reconstructPath(current)];
    }

    for (const edge of getNeighbors(grid, current.point2, size)) {
      if (closed.has(edge.point2)) continue;

      const nextG = current.cost.G + Number(edge.distance);
      const existing = bestByNode.get(edge.point2);
      if (existing && nextG >= existing.cost.G) continue;

      const neighbor = createSearchNode(edge, current);
      const hCost = heuristicMap.get(neighbor.point2);
      neighbor.cost = { F: nextG + hCost, G: nextG, H: hCost };
      bestByNode.set(neighbor.point2, neighbor);
      frontier.push(neighbor);
    }
  }

  return emptySearchResult(visitedNodesInOrder);
}
