function astar(start, end, graph) {
    let open = [start];
    let closed = [];
    let cameFrom = {};
    let gScore = {};
    let fScore = {};
    gScore[start] = 0;
    fScore[start] = heuristic(start, end);
  
    while (open.length > 0) {
      let current = getNodeWithLowestFScore(open, fScore);
      if (current === end) {
        return reconstructPath(cameFrom, end);
      }
  
      open = open.filter(node => node !== current);
      closed.push(current);
  
      for (let neighbor of graph[current]) {
        if (closed.includes(neighbor)) {
          continue;
        }
  
        let tentativeGScore = gScore[current] + distance(current, neighbor);
        if (!open.includes(neighbor)) {
          open.push(neighbor);
        } else if (tentativeGScore >= gScore[neighbor]) {
          continue;
        }
  
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);
      }
    }
  
    return null; // no path found
  }
  
  function getNodeWithLowestFScore(nodes, fScore) {
    let lowestFScore = Infinity;
    let nodeWithLowestFScore = null;
    for (let node of nodes) {
      if (fScore[node] < lowestFScore) {
        lowestFScore = fScore[node];
        nodeWithLowestFScore = node;
      }
    }
    return nodeWithLowestFScore;
  }
  
  function reconstructPath(cameFrom, current) {
    let path = [current];
    while (cameFrom[current]) {
      current = cameFrom[current];
      path.unshift(current);
    }
    return path;
  }