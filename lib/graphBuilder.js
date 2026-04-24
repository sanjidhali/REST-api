/**
 * Builds an adjacency list from deduplicated edges.
 * Each child can only have ONE parent — first-encountered wins.
 * Subsequent parent edges are silently discarded.
 *
 * @param {string[]} edges - Valid, deduplicated edges like ["A->B", "A->C"]
 * @returns {{ adjacency: Map<string, string[]>, childSet: Set<string>, allNodes: Set<string> }}
 */
export function buildGraph(edges) {
  const adjacency = new Map();  // parent -> [children]
  const childSet = new Set();   // tracks which nodes are children
  const allNodes = new Set();

  for (const edge of edges) {
    const [from, to] = edge.split("->");

    allNodes.add(from);
    allNodes.add(to);

    // Each child can only have one parent — first parent wins
    if (childSet.has(to)) {
      continue; // silently discard
    }

    childSet.add(to);

    if (!adjacency.has(from)) {
      adjacency.set(from, []);
    }
    adjacency.get(from).push(to);
  }

  return { adjacency, childSet, allNodes };
}
