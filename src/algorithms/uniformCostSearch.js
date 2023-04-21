function uniformCostSearch(grid, startNode, finishNode, size, heuristic) {
    // Initialize the frontier with the start node
    let frontier = [startNode];
  
    // Keep track of the cost to reach each node
    let costs = new Map([[startNode, 0]]);
  
    // Keep track of each node's parent in the search tree
    let parents = new Map();
  
    // Loop until the frontier is empty
    while (frontier.length > 0) {
      // Get the node with the lowest cost
      let currentNode = frontier[0];
      let currentCost = costs.get(currentNode);
      for (let i = 1; i < frontier.length; i++) {
        let node = frontier[i];
        let cost = costs.get(node);
        if (cost < currentCost) {
          currentNode = node;
          currentCost = cost;
        }
      }
  
      // If the current node is the goal, we're done
      if (currentNode === finishNode) {
        return reconstructPath(currentNode, parents);
      }
  
      // Loop through the current node's neighbors
      for (let neighbor of currentNode.neighbors) {
        // Calculate the cost to reach the neighbor through the current node
        let newCost = currentCost + neighbor.cost;
  
        // If the neighbor hasn't been visited yet or the new cost is lower than the old cost, update the cost and parent
        if (!costs.has(neighbor) || newCost < costs.get(neighbor)) {
          frontier.push(neighbor);
          costs.set(neighbor, newCost);
          parents.set(neighbor, currentNode);
        }
      }
  
      // Remove the current node from the frontier
      frontier = frontier.filter(node => node !== currentNode);
    }
  
    // If we get here, there's no path to the goal
    return null;
  }
  
  function reconstructPath(node, parents) {
    let path = [node];
    while (parents.has(node)) {
      node = parents.get(node);
      path.unshift(node);
    }
    return path;
  }
  