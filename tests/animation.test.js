const assert = require("assert");
require("./registerBabel");

const Vue = require("vue");
const visualizer = require("../src/components/Index.vue").default;

const Visualizer = Vue.extend(visualizer);
const vm = new Visualizer();

vm.list = [
  { id: "node-0", x: 50, y: 50, color: "" },
  { id: "node-1", x: 150, y: 50, color: "" },
  { id: "node-2", x: 250, y: 50, color: "" }
];
vm.connections = [
  {
    id: "edge-0-1",
    from: 0,
    to: 1,
    weight: 100,
    points: [50, 50, 150, 50],
    color: ""
  },
  {
    id: "edge-1-2",
    from: 1,
    to: 2,
    weight: 100,
    points: [150, 50, 250, 50],
    color: ""
  }
];
vm.grid[0][1] = vm.createEdge(0, 1, 100);
vm.grid[1][0] = vm.createEdge(1, 0, 100);
vm.grid[1][2] = vm.createEdge(1, 2, 100);
vm.grid[2][1] = vm.createEdge(2, 1, 100);
vm.startNode = 0;
vm.goalNode = 2;
vm.selectedAlgorithm = "BFS";

// Execute scheduled frames immediately so this test validates state transitions
// without introducing real-time delays.
vm.scheduleAnimation = callback => callback();
vm.runGraph();

assert.deepStrictEqual(vm.visitedNodesInOrder.map(node => node.point2), [0, 1, 2]);
assert.deepStrictEqual(vm.calculatedPath.map(node => node.point2), [0, 1, 2]);
assert.strictEqual(vm.visitedCount, 2);
assert.strictEqual(vm.isAnimating, false);
assert.strictEqual(vm.connections[0].color, "#db5cab");
assert.strictEqual(vm.connections[1].color, "#db5cab");

vm.getPath();
assert.strictEqual(vm.pathHighlighted, true);
assert.strictEqual(vm.isAnimating, false);
assert.strictEqual(vm.connections[0].color, "#ef334e");
assert.strictEqual(vm.connections[1].color, "#ef334e");
assert.deepStrictEqual(vm.visiblePath.map(node => node.point2), [1, 2]);

vm.previousStep();
assert.strictEqual(vm.pathHighlighted, false);
assert.strictEqual(vm.visitedCount, 1);
assert.strictEqual(vm.connections[0].color, "#db5cab");
assert.strictEqual(vm.connections[1].color, "#374151");

vm.$destroy();
console.log("Animation state checks passed.");
