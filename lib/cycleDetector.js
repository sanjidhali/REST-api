/**
 * DFS-based cycle detection using a recursion stack.
 *
 * @param {string[]} componentNodes - Nodes in this component
 * @param {Map<string, string[]>} adjacency - Full adjacency list
 * @returns {boolean} - true if a cycle exists in this component
 */
export function hasCycle(componentNodes, adjacency) {
  const visited = new Set();
  const recStack = new Set();

  function dfs(node) {
    visited.add(node);
    recStack.add(node);

    const neighbors = adjacency.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true; // back edge → cycle
      }
    }

    recStack.delete(node);
    return false;
  }

  for (const node of componentNodes) {
    if (!visited.has(node)) {
      if (dfs(node)) return true;
    }
  }

  return false;
}
