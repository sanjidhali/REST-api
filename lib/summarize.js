/**
 * Generates summary statistics from the hierarchies list.
 *
 * @param {object[]} hierarchies - Array of hierarchy objects
 * @returns {{ total_trees: number, total_cycles: number, largest_tree_root: string }}
 */
export function summarize(hierarchies) {
  let totalTrees = 0;
  let totalCycles = 0;
  let largestTreeRoot = "";
  let maxDepth = 0;

  for (const h of hierarchies) {
    if (h.has_cycle) {
      totalCycles++;
    } else {
      totalTrees++;
      // Track largest tree (deepest; lex smaller on tie)
      if (
        h.depth > maxDepth ||
        (h.depth === maxDepth && h.root < largestTreeRoot)
      ) {
        maxDepth = h.depth;
        largestTreeRoot = h.root;
      }
    }
  }

  return {
    total_trees: totalTrees,
    total_cycles: totalCycles,
    largest_tree_root: largestTreeRoot,
  };
}
