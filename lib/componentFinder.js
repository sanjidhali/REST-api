/**
 * Union-Find (Disjoint Set Union) to identify connected components.
 *
 * @param {Map<string, string[]>} adjacency - Adjacency list
 * @param {Set<string>} allNodes - All nodes in the graph
 * @returns {Map<string, string[]>} - Map of representative root -> [nodes]
 */
export function findComponents(adjacency, allNodes) {
  const parent = {};
  const rank = {};

  // Initialize each node as its own parent
  for (const node of allNodes) {
    parent[node] = node;
    rank[node] = 0;
  }

  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // path compression
    }
    return parent[x];
  }

  function union(a, b) {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return;
    // union by rank
    if (rank[ra] < rank[rb]) {
      parent[ra] = rb;
    } else if (rank[ra] > rank[rb]) {
      parent[rb] = ra;
    } else {
      parent[rb] = ra;
      rank[ra]++;
    }
  }

  // Union connected nodes via edges
  for (const [from, children] of adjacency) {
    for (const to of children) {
      union(from, to);
    }
  }

  // Group nodes by their root representative
  const components = new Map();
  for (const node of allNodes) {
    const root = find(node);
    if (!components.has(root)) {
      components.set(root, []);
    }
    components.get(root).push(node);
  }

  return components;
}
