# Pathfinding Visualizer

An interactive graph tool for visualizing how pathfinding algorithms explore
nodes and determine a route from a start node to a goal node.

## Algorithms

- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Uniform-Cost Search
- Greedy Best-First Search
- A*

## Run locally

Make sure [Node.js](https://nodejs.org/) and npm are installed, then run:

```bash
cd ../Pathfinding
npm install
npm run serve
```

Open the local URL printed in the terminal, usually
[http://localhost:8080](http://localhost:8080). Press `Ctrl+C` to stop the server.

## How to use it

1. Select **Vertex**, then click the canvas to add nodes.
2. Select **Connection**, then drag between two nodes to create an edge.
3. Choose the start node, goal node, and an algorithm.
4. Click **Visualize algorithm** to animate the traversal.
5. Use **Prev** and **Next** to inspect individual steps, or click
   **Show shortest path** after the traversal finishes.

Graphs can be saved as JSON and imported again using the sidebar controls.

## Development checks

```bash
npm run lint
npm test
npm run build
```

Built with Vue 2, BootstrapVue, and Konva.
