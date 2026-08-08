import {
  createSearchNode,
  emptySearchResult,
  getNeighbors,
  heuristicByNode,
  reconstructPath
} from "./searchHelpers";

export function greedyBFS(grid, startNode, finishNode, size, heuristic) {
  const heuristicMap = heuristicByNode(heuristic);
  const start = createSearchNode(startNode);
  start.cost = { F: heuristicMap.get(start.point2), G: 0, H: heuristicMap.get(start.point2) };

  const frontier = [start];
  const discovered = new Set([start.point2]);
  const visitedNodesInOrder = [];

  while (frontier.length) {
    frontier.sort((a, b) => a.cost.H - b.cost.H || a.point2 - b.point2);
    const current = frontier.shift();
    visitedNodesInOrder.push(current);

    if (current.point2 === finishNode) {
      return [visitedNodesInOrder, reconstructPath(current)];
    }

    for (const edge of getNeighbors(grid, current.point2, size)) {
      if (discovered.has(edge.point2)) continue;

      const neighbor = createSearchNode(edge, current);
      const hCost = heuristicMap.get(neighbor.point2);
      neighbor.cost = { F: hCost, G: current.cost.G + neighbor.distance, H: hCost };
      discovered.add(neighbor.point2);
      frontier.push(neighbor);
    }
  }

  return emptySearchResult(visitedNodesInOrder);
}
