import {
  createSearchNode,
  emptySearchResult,
  getNeighbors,
  reconstructPath
} from "./searchHelpers";

export function bfs(grid, startNode, finishNode, size) {
  const start = createSearchNode(startNode);
  const queue = [start];
  const visited = new Set([start.point2]);
  const visitedNodesInOrder = [start];

  while (queue.length) {
    const current = queue.shift();

    if (current.point2 === finishNode) {
      return [visitedNodesInOrder, reconstructPath(current)];
    }

    for (const edge of getNeighbors(grid, current.point2, size)) {
      if (visited.has(edge.point2)) continue;

      const neighbor = createSearchNode(edge, current);
      visited.add(neighbor.point2);
      visitedNodesInOrder.push(neighbor);
      queue.push(neighbor);
    }
  }

  return emptySearchResult(visitedNodesInOrder);
}
