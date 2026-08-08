const assert = require("assert");
require("./registerBabel");

const { astar } = require("../src/algorithms/astar");
const { bfs } = require("../src/algorithms/breadthFirstSearch");
const { dfs } = require("../src/algorithms/depthFirstSearch");
const { greedyBFS } = require("../src/algorithms/greedyBestFirstSearch");
const { uniformCost } = require("../src/algorithms/uniformCost");

function createGrid(size, edges) {
  const grid = Array.from({ length: size }, (unusedRow, row) =>
    Array.from({ length: size }, (unusedColumn, column) => ({
      point1: row,
      point2: column,
      distance: 0
    }))
  );

  edges.forEach(([from, to, distance]) => {
    grid[from][to] = { point1: from, point2: to, distance };
    grid[to][from] = { point1: to, point2: from, distance };
  });
  return grid;
}

function nodePath(result) {
  return result[1].map(node => node.point2);
}

const grid = createGrid(5, [
  [0, 1, 2],
  [0, 2, 1],
  [1, 2, 0.5],
  [1, 3, 1],
  [2, 3, 5],
  [3, 4, 1]
]);
const start = grid[0][0];
const zeroHeuristic = Array.from({ length: 5 }, (unused, node) => ({ node, hval: 0 }));
const directedHeuristic = [
  { node: 0, hval: 4 },
  { node: 1, hval: 2 },
  { node: 2, hval: 3 },
  { node: 3, hval: 1 },
  { node: 4, hval: 0 }
];

assert.deepStrictEqual(nodePath(bfs(grid, start, 4, 5)), [0, 1, 3, 4]);
assert.deepStrictEqual(nodePath(dfs(grid, start, 4, 5)), [0, 1, 3, 4]);
assert.deepStrictEqual(nodePath(uniformCost(grid, start, 4, 5)), [0, 2, 1, 3, 4]);
assert.deepStrictEqual(nodePath(astar(grid, start, 4, 5, zeroHeuristic)), [0, 2, 1, 3, 4]);
assert.deepStrictEqual(nodePath(greedyBFS(grid, start, 4, 5, directedHeuristic)), [0, 1, 3, 4]);

assert.deepStrictEqual(
  nodePath(bfs(grid, start, 4, 5)),
  [0, 1, 3, 4],
  "searches must be repeatable without stale visited state"
);

const disconnectedGrid = createGrid(3, [[0, 1, 1]]);
assert.deepStrictEqual(nodePath(bfs(disconnectedGrid, disconnectedGrid[0][0], 2, 3)), []);

console.log("Algorithm checks passed.");
