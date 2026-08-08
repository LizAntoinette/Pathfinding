<template>
  <div class="app-shell">
    <aside class="sidebar">
      <header class="sidebar__header">
        <p class="eyebrow">Interactive graph explorer</p>
        <h1>Pathfinding Visualizer</h1>
      </header>

      <div class="sidebar__controls">
        <b-dropdown block :text="selectedAlgorithm" variant="dark">
          <b-dropdown-header id="unweighted">Unweighted</b-dropdown-header>
          <b-dropdown-item-button
            v-for="algorithm in unweightedAlgorithms"
            :key="algorithm"
            aria-describedby="unweighted"
            @click="selectAlgorithm(algorithm)"
          >
            {{ algorithm }}
          </b-dropdown-item-button>
          <b-dropdown-divider />
          <b-dropdown-header id="weighted">Weighted</b-dropdown-header>
          <b-dropdown-item-button
            v-for="algorithm in weightedAlgorithms"
            :key="algorithm"
            aria-describedby="weighted"
            @click="selectAlgorithm(algorithm)"
          >
            {{ algorithm }}
          </b-dropdown-item-button>
        </b-dropdown>

        <div class="button-grid">
          <input
            ref="fileUpload"
            type="file"
            accept=".json,.txt,application/json,text/plain"
            hidden
            @change="onFileSelected"
          >
          <b-button block variant="outline-light" @click="chooseFile">Import graph</b-button>
          <b-button block variant="outline-light" :disabled="!list.length" @click="saveFile">
            Save graph
          </b-button>
        </div>

        <fieldset>
          <legend>Add to graph</legend>
          <div class="button-grid">
            <b-button
              block
              :variant="vertexMode ? 'primary' : 'secondary'"
              @click="toggleVertexMode"
            >
              Vertex
            </b-button>
            <b-button
              block
              :variant="connectionMode ? 'primary' : 'secondary'"
              @click="toggleConnectionMode"
            >
              Connection
            </b-button>
          </div>
        </fieldset>

        <div class="node-selectors">
          <label for="start-node">Start node</label>
          <b-form-select
            id="start-node"
            v-model="startNode"
            :options="nodeOptions"
            @change="changeStartNode"
          />

          <label for="goal-node">Goal node</label>
          <b-form-select
            id="goal-node"
            v-model="goalNode"
            :options="goalNodeOptions"
            @change="changeGoalNode"
          />
        </div>

        <b-button block variant="primary" :disabled="isAnimating" @click="runGraph">
          {{ isAnimating ? "Animating…" : "Visualize algorithm" }}
        </b-button>
        <b-button block variant="light" :disabled="cannotShowPath" @click="getPath">
          Show shortest path
        </b-button>
        <b-button block variant="outline-light" @click="clearScreen">Clear graph</b-button>

        <p v-if="statusMessage" class="status-message" role="status">{{ statusMessage }}</p>
      </div>
    </aside>

    <main class="main-content">
      <section class="workspace-card graph-card">
        <div class="card-heading">
          <div>
            <p class="eyebrow">Canvas</p>
            <h2>Your graph</h2>
          </div>
          <p class="mode-hint">{{ modeHint }}</p>
        </div>

        <div ref="stageContainer" class="stage-container">
          <v-stage
            ref="konva"
            :config="stageSize"
            @click="handleCanvasClick"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="cancelDraftConnection"
          >
            <v-layer>
              <v-line
                v-for="line in connections"
                :key="line.id"
                :config="{
                  id: line.id,
                  points: line.points,
                  stroke: line.color,
                  strokeWidth: 3,
                  lineCap: 'round'
                }"
              />

              <v-text
                v-for="label in distanceLabels"
                :key="label.id"
                :config="{
                  x: label.x - 24,
                  y: label.y - 16,
                  width: 48,
                  align: 'center',
                  text: label.text,
                  fontSize: 11,
                  fill: '#111827',
                  listening: false
                }"
              />

              <v-circle
                v-for="(node, index) in list"
                :key="node.id"
                :config="{
                  id: `circle-${index}`,
                  x: node.x,
                  y: node.y,
                  radius: 18,
                  fill: node.color,
                  stroke: '#ffffff',
                  strokeWidth: 2,
                  shadowColor: '#111827',
                  shadowBlur: 5,
                  shadowOpacity: 0.24
                }"
              />

              <v-text
                v-for="(node, index) in list"
                :key="`${node.id}-label`"
                :config="{
                  x: node.x - 18,
                  y: node.y - 7,
                  width: 36,
                  align: 'center',
                  text: String(index),
                  fontSize: 14,
                  fontStyle: 'bold',
                  fill: '#ffffff',
                  listening: false
                }"
              />
            </v-layer>
          </v-stage>

          <div v-if="!list.length" class="empty-canvas">
            Select Vertex, then click anywhere here to begin.
          </div>
        </div>
      </section>

      <section class="workspace-card details-card">
        <div class="card-heading details-heading">
          <div>
            <p class="eyebrow">Playback</p>
            <h2>Graph details</h2>
          </div>
          <div class="playback-controls" aria-label="Animation controls">
            <button type="button" :disabled="cannotPlayPrevious" @click="previousStep">← Prev</button>
            <button type="button" :disabled="cannotPlayNext" @click="nextStep">Next →</button>
          </div>
        </div>

        <template v-if="isUnweighted">
          <h3>Adjacency matrix</h3>
          <div class="table-scroll">
            <table class="data-table matrix-table">
              <tbody>
                <tr v-for="(row, rowIndex) in adjacencyMatrix" :key="`row-${rowIndex}`">
                  <td v-for="(cell, cellIndex) in row" :key="`cell-${rowIndex}-${cellIndex}`">
                    {{ cell }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>{{ traversalLabel }}</h3>
          <div class="table-scroll">
            <table class="data-table traversal-table">
              <tbody>
                <tr>
                  <th>From</th>
                  <td v-for="(node, index) in visibleTraversal" :key="`from-${index}`">
                    {{ node.point1 }}
                  </td>
                </tr>
                <tr>
                  <th>To</th>
                  <td v-for="(node, index) in visibleTraversal" :key="`to-${index}`">
                    {{ node.point2 }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Shortest path</h3>
          <p v-if="!visiblePath.length" class="empty-details">Run the search, then show its path.</p>
          <div v-else class="path-list">
            <span>{{ startNode }}</span>
            <template v-for="(node, index) in visiblePath">
              <span :key="`arrow-${index}`" aria-hidden="true">→</span>
              <span :key="`path-${index}`">{{ node.point2 }}</span>
            </template>
          </div>
        </template>

        <template v-else-if="selectedAlgorithm !== defaultAlgorithm">
          <template v-if="heuristics.length">
            <h3>Heuristic distance to goal</h3>
            <div class="table-scroll">
              <table class="data-table cost-table">
                <thead>
                  <tr><th>Node</th><th>H</th></tr>
                </thead>
                <tbody>
                  <tr v-for="item in heuristics" :key="`heuristic-${item.node}`">
                    <td>{{ item.node }}</td>
                    <td>{{ formatCost(item.hval) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <h3>Visited nodes and costs</h3>
          <p v-if="!visibleVisitedNodes.length" class="empty-details">
            Choose start and goal nodes, then visualize the algorithm.
          </p>
          <div v-else class="table-scroll">
            <table class="data-table cost-table">
              <thead>
                <tr><th>Node</th><th>G</th><th>H</th><th>F</th></tr>
              </thead>
              <tbody>
                <tr v-for="(node, index) in visibleVisitedNodes" :key="`cost-${index}`">
                  <td>{{ node.point2 }}</td>
                  <td>{{ formatCost(node.cost.G) }}</td>
                  <td>{{ formatCost(node.cost.H) }}</td>
                  <td>{{ formatCost(node.cost.F) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Shortest path</h3>
          <p v-if="!visiblePath.length" class="empty-details">Run the search, then show its path.</p>
          <div v-else class="path-list">
            <span>{{ startNode }}</span>
            <template v-for="(node, index) in visiblePath">
              <span :key="`weighted-arrow-${index}`" aria-hidden="true">→</span>
              <span :key="`weighted-path-${index}`">{{ node.point2 }}</span>
            </template>
          </div>
        </template>

        <p v-else class="empty-details">
          Select an algorithm to see its traversal and path details.
        </p>
      </section>
    </main>
  </div>
</template>

<script>
import { astar } from "../algorithms/astar";
import { bfs } from "../algorithms/breadthFirstSearch";
import { dfs } from "../algorithms/depthFirstSearch";
import { greedyBFS } from "../algorithms/greedyBestFirstSearch";
import { uniformCost } from "../algorithms/uniformCost";

const MAX_NODES = 20;
const VISIT_DELAY_MS = 500;
const PATH_DELAY_MS = 350;
const COLORS = {
  node: "#a20417",
  start: "#159a68",
  goal: "#14532d",
  visited: "#db5cab",
  path: "#ef334e",
  edge: "#374151"
};
const DEFAULT_ALGORITHM = "Algorithms";

export default {
  name: "PathfindingVisualizer",

  data() {
    return {
      defaultAlgorithm: DEFAULT_ALGORITHM,
      unweightedAlgorithms: ["BFS", "DFS"],
      weightedAlgorithms: ["Uniform Cost", "Greedy BFS", "A*"],
      selectedAlgorithm: DEFAULT_ALGORITHM,
      list: [],
      connections: [],
      grid: [],
      startNode: null,
      goalNode: null,
      vertexMode: false,
      connectionMode: false,
      drawingLine: false,
      draftStartNode: null,
      stageSize: { width: 640, height: 520 },
      visitedNodesInOrder: [],
      calculatedPath: [],
      visitedCount: 0,
      heuristics: [],
      isAnimating: false,
      pathHighlighted: false,
      animationTimers: [],
      resizeObserver: null,
      statusMessage: "Add vertices and connections to build a graph."
    };
  },

  computed: {
    nodeOptions() {
      return [
        { value: null, text: "Select a node" },
        ...this.list.map((node, index) => ({ value: index, text: `Node ${index}` }))
      ];
    },

    goalNodeOptions() {
      return this.nodeOptions.filter(option => option.value === null || option.value !== this.startNode);
    },

    distanceLabels() {
      return this.connections
        .filter(connection => connection.to !== null)
        .map(connection => ({
          id: `${connection.id}-distance`,
          x: (connection.points[0] + connection.points[2]) / 2,
          y: (connection.points[1] + connection.points[3]) / 2,
          text: Number(connection.weight).toFixed(1)
        }));
    },

    adjacencyMatrix() {
      const header = ["", ...this.list.map((node, index) => index)];
      const rows = this.list.map((node, row) => [
        row,
        ...this.list.map((otherNode, column) => Number(this.grid[row][column].distance) > 0 ? 1 : 0)
      ]);
      return [header, ...rows];
    },

    isUnweighted() {
      return this.unweightedAlgorithms.includes(this.selectedAlgorithm);
    },

    traversalLabel() {
      return this.selectedAlgorithm === "DFS" ? "Stack traversal" : "Queue traversal";
    },

    visibleTraversal() {
      return this.visitedNodesInOrder.slice(1, this.visitedCount + 1);
    },

    visibleVisitedNodes() {
      if (!this.visitedNodesInOrder.length) return [];
      return this.visitedNodesInOrder.slice(0, this.visitedCount + 1);
    },

    visiblePath() {
      return this.pathHighlighted ? this.calculatedPath.slice(1) : [];
    },

    cannotPlayPrevious() {
      return this.isAnimating || this.visitedCount === 0;
    },

    cannotPlayNext() {
      return this.isAnimating || !this.visitedNodesInOrder.length ||
        this.visitedCount >= this.visitedNodesInOrder.length - 1;
    },

    cannotShowPath() {
      return this.isAnimating || !this.calculatedPath.length ||
        this.visitedCount < this.visitedNodesInOrder.length - 1 || this.pathHighlighted;
    },

    modeHint() {
      if (this.vertexMode) return "Click the canvas to add a vertex.";
      if (this.connectionMode) return "Drag from one vertex to another.";
      return "Choose a graph tool from the sidebar.";
    }
  },

  created() {
    this.initializeGrid();
  },

  mounted() {
    this.updateStageSize();
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(this.updateStageSize);
      this.resizeObserver.observe(this.$refs.stageContainer);
    }
  },

  beforeDestroy() {
    this.cancelAnimation();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  },

  methods: {
    initializeGrid() {
      this.grid = Array.from({ length: MAX_NODES }, (unusedRow, row) =>
        Array.from({ length: MAX_NODES }, (unusedColumn, column) =>
          this.createEdge(row, column, 0)
        )
      );
    },

    createEdge(from, to, distance) {
      return { point1: from, point2: to, distance: Number(distance) || 0 };
    },

    updateStageSize() {
      this.$nextTick(() => {
        const container = this.$refs.stageContainer;
        if (!container) return;
        this.stageSize = {
          width: Math.max(container.clientWidth, 280),
          height: Math.max(container.clientHeight, 420)
        };
      });
    },

    selectAlgorithm(algorithm) {
      this.selectedAlgorithm = algorithm;
      this.invalidateSearch(`${algorithm} selected. Ready to visualize.`);
    },

    toggleVertexMode() {
      this.cancelDraftConnection();
      this.vertexMode = !this.vertexMode;
      this.connectionMode = false;
      this.statusMessage = this.vertexMode
        ? "Click the canvas to add a vertex."
        : "Vertex mode turned off.";
    },

    toggleConnectionMode() {
      this.cancelDraftConnection();
      this.connectionMode = !this.connectionMode;
      this.vertexMode = false;
      this.statusMessage = this.connectionMode
        ? "Drag from one vertex to another to connect them."
        : "Connection mode turned off.";
    },

    handleCanvasClick(event) {
      if (!this.vertexMode || this.list.length >= MAX_NODES) return;
      const stage = event.target.getStage();
      if (event.target !== stage) return;

      const position = stage.getPointerPosition();
      const index = this.list.length;
      this.list.push({
        id: `node-${Date.now()}-${index}`,
        x: position.x,
        y: position.y,
        color: COLORS.node
      });
      this.invalidateSearch(`Node ${index} added.`);
    },

    getNodeIndex(target) {
      const id = target && typeof target.id === "function" ? target.id() : "";
      if (!id.startsWith("circle-")) return null;
      const index = Number(id.slice("circle-".length));
      return Number.isInteger(index) ? index : null;
    },

    handleMouseDown(event) {
      if (!this.connectionMode) return;
      const start = this.getNodeIndex(event.target);
      if (start === null) return;

      const node = this.list[start];
      this.drawingLine = true;
      this.draftStartNode = start;
      this.connections.push({
        id: `draft-${Date.now()}`,
        from: start,
        to: null,
        weight: 0,
        points: [node.x, node.y, node.x, node.y],
        color: COLORS.edge
      });
    },

    handleMouseMove(event) {
      if (!this.drawingLine) return;
      const position = event.target.getStage().getPointerPosition();
      const draft = this.connections[this.connections.length - 1];
      this.$set(draft, "points", [draft.points[0], draft.points[1], position.x, position.y]);
    },

    handleMouseUp(event) {
      if (!this.drawingLine) return;

      const end = this.getNodeIndex(event.target);
      const start = this.draftStartNode;
      if (end === null || end === start || this.connectionExists(start, end)) {
        this.cancelDraftConnection();
        this.statusMessage = end === start
          ? "A vertex cannot connect to itself."
          : "Choose a different, unconnected vertex.";
        return;
      }

      const draft = this.connections[this.connections.length - 1];
      const startPoint = this.list[start];
      const endPoint = this.list[end];
      const weight = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);

      this.$set(draft, "id", `edge-${Math.min(start, end)}-${Math.max(start, end)}`);
      this.$set(draft, "to", end);
      this.$set(draft, "weight", weight);
      this.$set(draft, "points", [startPoint.x, startPoint.y, endPoint.x, endPoint.y]);
      this.grid[start][end] = this.createEdge(start, end, weight);
      this.grid[end][start] = this.createEdge(end, start, weight);

      this.drawingLine = false;
      this.draftStartNode = null;
      this.invalidateSearch(`Connected node ${start} to node ${end}.`);
    },

    cancelDraftConnection() {
      if (this.drawingLine) this.connections.pop();
      this.drawingLine = false;
      this.draftStartNode = null;
    },

    connectionExists(from, to) {
      return this.connections.some(connection =>
        connection.to !== null &&
        ((connection.from === from && connection.to === to) ||
          (connection.from === to && connection.to === from))
      );
    },

    changeStartNode() {
      if (this.startNode === this.goalNode) this.goalNode = null;
      this.invalidateSearch("Start node updated.");
    },

    changeGoalNode() {
      this.invalidateSearch("Goal node updated.");
    },

    invalidateSearch(message) {
      this.cancelAnimation();
      this.resetSearchState();
      this.resetVisuals();
      if (message) this.statusMessage = message;
    },

    resetSearchState() {
      this.visitedNodesInOrder = [];
      this.calculatedPath = [];
      this.visitedCount = 0;
      this.heuristics = [];
      this.pathHighlighted = false;
    },

    resetVisuals() {
      this.list.forEach(node => this.$set(node, "color", COLORS.node));
      this.connections.forEach(connection => this.$set(connection, "color", COLORS.edge));
      if (this.list[this.startNode]) this.$set(this.list[this.startNode], "color", COLORS.start);
      if (this.list[this.goalNode]) this.$set(this.list[this.goalNode], "color", COLORS.goal);
    },

    createHeuristics(goalNode) {
      const goal = this.list[goalNode];
      return this.list.map((node, index) => ({
        node: index,
        hval: Math.hypot(goal.x - node.x, goal.y - node.y)
      }));
    },

    validateSearch() {
      if (!this.connections.length) return "Add at least one connection first.";
      if (this.selectedAlgorithm === DEFAULT_ALGORITHM) return "Select an algorithm first.";
      if (this.startNode === null || this.goalNode === null) return "Select start and goal nodes first.";
      return "";
    },

    runGraph() {
      const validationMessage = this.validateSearch();
      if (validationMessage) {
        this.statusMessage = validationMessage;
        return;
      }

      this.cancelAnimation();
      this.resetSearchState();
      this.resetVisuals();

      const start = this.grid[this.startNode][this.startNode];
      const size = this.list.length;
      this.heuristics = ["Greedy BFS", "A*"].includes(this.selectedAlgorithm)
        ? this.createHeuristics(this.goalNode)
        : [];

      const searches = {
        BFS: () => bfs(this.grid, start, this.goalNode, size),
        DFS: () => dfs(this.grid, start, this.goalNode, size),
        "Uniform Cost": () => uniformCost(this.grid, start, this.goalNode, size),
        "Greedy BFS": () => greedyBFS(this.grid, start, this.goalNode, size, this.heuristics),
        "A*": () => astar(this.grid, start, this.goalNode, size, this.heuristics)
      };

      [this.visitedNodesInOrder, this.calculatedPath] = searches[this.selectedAlgorithm]();
      this.statusMessage = `Running ${this.selectedAlgorithm}…`;
      this.animateTraversal();
    },

    animateTraversal() {
      this.isAnimating = true;
      const lastIndex = this.visitedNodesInOrder.length - 1;

      for (let index = 1; index <= lastIndex; index += 1) {
        this.scheduleAnimation(() => this.applyVisitedStep(index), index * VISIT_DELAY_MS);
      }

      this.scheduleAnimation(() => {
        this.isAnimating = false;
        this.visitedCount = Math.max(lastIndex, 0);
        this.statusMessage = this.calculatedPath.length
          ? `${this.selectedAlgorithm} reached the goal. Show the shortest path when ready.`
          : `${this.selectedAlgorithm} finished. No path reaches the goal.`;
      }, Math.max(lastIndex, 0) * VISIT_DELAY_MS + 80);
    },

    applyVisitedStep(index) {
      this.visitedCount = index;
      this.colorNode(this.visitedNodesInOrder[index], COLORS.visited);
    },

    colorNode(searchNode, color) {
      if (!searchNode || !this.list[searchNode.point2]) return;
      this.$set(this.list[searchNode.point2], "color", color);

      if (searchNode.point1 === searchNode.point2) return;
      const connection = this.connections.find(line =>
        (line.from === searchNode.point1 && line.to === searchNode.point2) ||
        (line.from === searchNode.point2 && line.to === searchNode.point1)
      );
      if (connection) this.$set(connection, "color", color);
    },

    renderTraversalProgress() {
      this.pathHighlighted = false;
      this.resetVisuals();
      for (let index = 1; index <= this.visitedCount; index += 1) {
        this.colorNode(this.visitedNodesInOrder[index], COLORS.visited);
      }
    },

    nextStep() {
      if (this.cannotPlayNext) return;
      this.visitedCount += 1;
      this.renderTraversalProgress();
    },

    previousStep() {
      if (this.cannotPlayPrevious) return;
      this.visitedCount -= 1;
      this.renderTraversalProgress();
    },

    getPath() {
      if (this.cannotShowPath) return;
      this.isAnimating = true;
      this.pathHighlighted = false;

      this.calculatedPath.slice(1).forEach((node, index) => {
        this.scheduleAnimation(() => this.colorNode(node, COLORS.path), index * PATH_DELAY_MS);
      });

      const duration = Math.max(this.calculatedPath.length - 2, 0) * PATH_DELAY_MS + 80;
      this.scheduleAnimation(() => {
        this.isAnimating = false;
        this.pathHighlighted = true;
        this.statusMessage = "Shortest path highlighted in red.";
      }, duration);
    },

    scheduleAnimation(callback, delay) {
      const timer = window.setTimeout(() => {
        this.animationTimers = this.animationTimers.filter(item => item !== timer);
        callback();
      }, delay);
      this.animationTimers.push(timer);
    },

    cancelAnimation() {
      this.animationTimers.forEach(timer => window.clearTimeout(timer));
      this.animationTimers = [];
      this.isAnimating = false;
    },

    formatCost(value) {
      return Number.isFinite(value) ? value.toFixed(1) : "—";
    },

    chooseFile() {
      this.$refs.fileUpload.click();
    },

    onFileSelected(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = loadEvent => {
        try {
          this.loadGraph(JSON.parse(loadEvent.target.result));
          this.statusMessage = `Imported ${file.name}.`;
        } catch (error) {
          this.statusMessage = `Could not import graph: ${error.message}`;
        } finally {
          event.target.value = "";
        }
      };
      reader.onerror = () => {
        this.statusMessage = `Could not read ${file.name}.`;
        event.target.value = "";
      };
      reader.readAsText(file);
    },

    loadGraph(data) {
      const rawNodes = data.vertices || data.list;
      if (!Array.isArray(rawNodes) || rawNodes.length > MAX_NODES) {
        throw new Error(`the file must contain between 0 and ${MAX_NODES} vertices`);
      }

      this.clearScreen(false);
      this.list = rawNodes.map((node, index) => ({
        id: `node-${Date.now()}-${index}`,
        x: Number(node.x),
        y: Number(node.y),
        color: COLORS.node
      }));

      const rawConnections = data.edges || data.connections || [];
      rawConnections.forEach((connection, index) => {
        const normalized = this.normalizeImportedConnection(connection, index, data);
        if (!normalized || this.connectionExists(normalized.from, normalized.to)) return;
        this.connections.push(normalized);
        this.grid[normalized.from][normalized.to] = this.createEdge(
          normalized.from,
          normalized.to,
          normalized.weight
        );
        this.grid[normalized.to][normalized.from] = this.createEdge(
          normalized.to,
          normalized.from,
          normalized.weight
        );
      });

      this.startNode = this.validImportedNode(data.startNode) ? Number(data.startNode) : null;
      this.goalNode = this.validImportedNode(data.goalNode) && Number(data.goalNode) !== this.startNode
        ? Number(data.goalNode)
        : null;
      const importedAlgorithm = data.selectedAlgorithm || data.selectedItem;
      const algorithms = [...this.unweightedAlgorithms, ...this.weightedAlgorithms];
      this.selectedAlgorithm = algorithms.includes(importedAlgorithm) ? importedAlgorithm : DEFAULT_ALGORITHM;
      this.resetVisuals();
      this.updateStageSize();
    },

    normalizeImportedConnection(connection, index, data) {
      let from = Number.isInteger(Number(connection.from)) ? Number(connection.from) : null;
      let to = Number.isInteger(Number(connection.to)) ? Number(connection.to) : null;
      const points = Array.isArray(connection.points) ? connection.points.map(Number) : [];

      if ((from === null || to === null) && points.length === 4) {
        from = this.findNodeAt(points[0], points[1]);
        to = this.findNodeAt(points[2], points[3]);
      }
      if (!this.validImportedNode(from) || !this.validImportedNode(to) || from === to) return null;

      const start = this.list[from];
      const end = this.list[to];
      const legacyDistance = data.distances && data.distances[index]
        ? Number(data.distances[index].distance)
        : 0;
      const gridDistance = data.grid && data.grid[from] && data.grid[from][to]
        ? Number(data.grid[from][to].distance)
        : 0;
      const weight = Number(connection.weight) || legacyDistance || gridDistance ||
        Math.hypot(end.x - start.x, end.y - start.y);

      return {
        id: `edge-${Math.min(from, to)}-${Math.max(from, to)}`,
        from,
        to,
        weight,
        points: [start.x, start.y, end.x, end.y],
        color: COLORS.edge
      };
    },

    findNodeAt(x, y) {
      return this.list.findIndex(node => Math.abs(node.x - x) < 0.5 && Math.abs(node.y - y) < 0.5);
    },

    validImportedNode(node) {
      if (node === null || node === undefined || node === "") return false;
      const index = Number(node);
      return Number.isInteger(index) && index >= 0 && index < this.list.length;
    },

    saveFile() {
      const graph = {
        version: 2,
        vertices: this.list.map(node => ({ x: node.x, y: node.y })),
        edges: this.connections
          .filter(connection => connection.to !== null)
          .map(connection => ({
            from: connection.from,
            to: connection.to,
            weight: connection.weight
          })),
        startNode: this.startNode,
        goalNode: this.goalNode,
        selectedAlgorithm: this.selectedAlgorithm
      };
      const url = URL.createObjectURL(new Blob([JSON.stringify(graph, null, 2)], {
        type: "application/json"
      }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "pathfinding-graph.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },

    clearScreen(showMessage = true) {
      const shouldShowMessage = typeof showMessage === "boolean" ? showMessage : true;
      this.cancelAnimation();
      this.cancelDraftConnection();
      this.list = [];
      this.connections = [];
      this.startNode = null;
      this.goalNode = null;
      this.vertexMode = false;
      this.connectionMode = false;
      this.selectedAlgorithm = DEFAULT_ALGORITHM;
      this.initializeGrid();
      this.resetSearchState();
      if (this.$refs.fileUpload) this.$refs.fileUpload.value = "";
      if (shouldShowMessage) this.statusMessage = "Graph cleared. Add a vertex to start again.";
    }
  }
};
</script>
