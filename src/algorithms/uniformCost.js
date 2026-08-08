import {
  createSearchNode,
  emptySearchResult,
  getNeighbors,
  reconstructPath
} from "./searchHelpers";

export function uniformCost(grid, startNode, finishNode, size) {
  const start = createSearchNode(startNode);
  start.cost = { F: 0, G: 0, H: 0 };

  const frontier = [start];
  const bestByNode = new Map([[start.point2, start]]);
  const closed = new Set();
  const visitedNodesInOrder = [];

  while (frontier.length) {
    frontier.sort((a, b) => a.cost.G - b.cost.G || a.point2 - b.point2);
    const current = frontier.shift();
    if (closed.has(current.point2)) continue;

    closed.add(current.point2);
    visitedNodesInOrder.push(current);

    if (current.point2 === finishNode) {
      return [visitedNodesInOrder, reconstructPath(current)];
    }

    for (const edge of getNeighbors(grid, current.point2, size)) {
      if (closed.has(edge.point2)) continue;

      const nextCost = current.cost.G + Number(edge.distance);
      const existing = bestByNode.get(edge.point2);
      if (existing && nextCost >= existing.cost.G) continue;

      const neighbor = createSearchNode(edge, current);
      neighbor.cost = { F: nextCost, G: nextCost, H: 0 };
      bestByNode.set(neighbor.point2, neighbor);
      frontier.push(neighbor);
    }
  }

  return emptySearchResult(visitedNodesInOrder);
}
