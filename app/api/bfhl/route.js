import { NextResponse } from "next/server";
import { validate } from "@/lib/validate";
import { buildGraph } from "@/lib/graphBuilder";
import { findComponents } from "@/lib/componentFinder";
import { hasCycle } from "@/lib/cycleDetector";
import { buildTree, calculateDepth } from "@/lib/treeBuilder";
import { summarize } from "@/lib/summarize";

/** CORS headers applied to all responses */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/** Handle preflight */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/** GET — returns operation code */
export async function GET() {
  return NextResponse.json({ operation_code: 1 }, { headers: corsHeaders });
}

/** POST — main processing endpoint */
export async function POST(request) {
  try {
    const body = await request.json();
    const data = body.data;

    // Handle missing or empty input
    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        {
          is_success: true,
          user_id: "sanjidh_ali_24042004",
          email_id: "st5461@srmist.edu.in",
          college_roll_number: "RA2311003020304",
          hierarchies: [],
          invalid_entries: [],
          duplicate_edges: [],
          summary: {
            total_trees: 0,
            total_cycles: 0,
            largest_tree_root: "",
          },
        },
        { headers: corsHeaders }
      );
    }

    // --- Step 1: Validation ---
    const { valid, invalid } = validate(data);

    // --- Step 2: Duplicate detection ---
    const seen = new Set();
    const duplicateSet = new Set();
    const deduplicated = [];

    for (const edge of valid) {
      if (seen.has(edge)) {
        duplicateSet.add(edge); // track duplicate (once)
      } else {
        seen.add(edge);
        deduplicated.push(edge);
      }
    }

    const duplicate_edges = [...duplicateSet];

    // --- Step 3: Build graph ---
    const { adjacency, childSet, allNodes } = buildGraph(deduplicated);

    // --- Step 4: Find connected components ---
    const components = findComponents(adjacency, allNodes);

    // --- Step 5–8: Process each component ---
    const hierarchies = [];

    for (const [, nodes] of components) {
      // Root detection: node not in childSet
      let root = null;
      for (const n of nodes) {
        if (!childSet.has(n)) {
          root = n;
          break;
        }
      }

      // If no root found (pure cycle), pick lex smallest
      if (root === null) {
        root = nodes.sort()[0];
      }

      // Cycle detection
      const cyclic = hasCycle(nodes, adjacency);

      if (cyclic) {
        hierarchies.push({ root, tree: {}, has_cycle: true });
      } else {
        const tree = buildTree(root, adjacency);
        const depth = calculateDepth(root, adjacency);
        hierarchies.push({ root, tree, depth });
      }
    }

    // --- Step 9: Summary ---
    const summary = summarize(hierarchies);

    return NextResponse.json(
      {
        is_success: true,
        user_id: "sanjidh_ali_24042004",
        email_id: "sa6025@srmist.edu.in",
        college_roll_number: "RA2211003011684",
        hierarchies,
        invalid_entries: invalid,
        duplicate_edges,
        summary,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { is_success: false, error: err.message },
      { status: 400, headers: corsHeaders }
    );
  }
}
