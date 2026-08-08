import {
  createSearchNode,
  emptySearchResult,
  getNeighbors,
  reconstructPath
} from "./searchHelpers";

export function dfs(grid, startNode, finishNode, size) {
  const start = createSearchNode(startNode);
  const stack = [start];
  const discovered = new Set([start.point2]);
  const visitedNodesInOrder = [];

  while (stack.length) {
    const current = stack.pop();
    visitedNodesInOrder.push(current);

    if (current.point2 === finishNode) {
      return [visitedNodesInOrder, reconstructPath(current)];
    }

    const neighbors = getNeighbors(grid, current.point2, size);
    for (let index = neighbors.length - 1; index >= 0; index -= 1) {
      const edge = neighbors[index];
      if (discovered.has(edge.point2)) continue;

      discovered.add(edge.point2);
      stack.push(createSearchNode(edge, current));
    }
  }

  return emptySearchResult(visitedNodesInOrder);
}
