/**
 * Validates edge strings against the format /^[A-Z]->[A-Z]$/.
 * Rejects self-loops (e.g. "A->A"), malformed entries, and non-alpha edges.
 *
 * @param {string[]} entries - Raw input strings
 * @returns {{ valid: string[], invalid: string[] }}
 */
export function validate(entries) {
  const valid = [];
  const invalid = [];
  const pattern = /^[A-Z]->[A-Z]$/;

  for (const raw of entries) {
    const trimmed = raw.trim();

    // Reject empty / whitespace-only entries
    if (trimmed === "") {
      invalid.push(trimmed);
      continue;
    }

    // Must match exact format and must not be a self-loop
    if (!pattern.test(trimmed) || trimmed[0] === trimmed[3]) {
      invalid.push(trimmed);
      continue;
    }

    valid.push(trimmed);
  }

  return { valid, invalid };
}
