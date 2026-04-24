/**
 * Recursively builds a nested tree object from root.
 * Example: A->B->C produces { "A": { "B": { "C": {} } } }
 *
 * @param {string} root - Root node
 * @param {Map<string, string[]>} adjacency - Adjacency list
 * @returns {object} - Nested tree object
 */
export function buildTree(root, adjacency) {
  const children = adjacency.get(root) || [];
  const subtree = {};

  for (const child of children) {
    subtree[child] = buildTree(child, adjacency);
  }

  return { [root]: subtree };
}

/**
 * Calculates depth: node count on the longest root-to-leaf path.
 * A single node = depth 1, A->B = depth 2, etc.
 *
 * @param {string} root - Root node
 * @param {Map<string, string[]>} adjacency - Adjacency list
 * @returns {number} - Depth (node count on longest path)
 */
export function calculateDepth(root, adjacency) {
  const children = adjacency.get(root) || [];

  if (children.length === 0) {
    return 1;
  }

  let maxChildDepth = 0;
  for (const child of children) {
    const d = calculateDepth(child, adjacency);
    if (d > maxChildDepth) maxChildDepth = d;
  }

  return 1 + maxChildDepth;
}
