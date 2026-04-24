# BFHL Node Processor

A full-stack Next.js 14+ (App Router) application for processing directed graph edges, building tree hierarchies, detecting cycles, and generating statistical summaries.

## Features

- **Validation**: Filters out invalid entries (e.g., self-loops, malformed strings).
- **Duplicate Detection**: Identifies duplicate edges within the graph.
- **Graph Construction**: Builds an adjacency list and child set, ensuring single parent per node.
- **Cycle Detection**: Identifies cyclic components using a DFS-based algorithm.
- **Tree Building**: Constructs nested object representations of valid hierarchies and calculates depths.
- **Minimal UI**: Clean, responsive frontend using plain Tailwind CSS to display processed results.
- **API**: A robust REST API built into the Next.js `app/api` route.

## Setup & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Documentation

### Endpoint
`POST /api/bfhl`

### Request Payload Example
```json
{
  "data": [
    "A->B", "A->C", "B->D", "C->E", "E->F", "X->Y", "Y->Z", "Z->X",
    "P->Q", "Q->R", "G->H", "G->H", "G->I", "hello", "1->2", "A->"
  ]
}
```

### Response Example
```json
{
  "is_success": true,
  "user_id": "sanjidh_ali_24042004",
  "email_id": "sa6025@srmist.edu.in",
  "college_roll_number": "RA2211003011684",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": { "D": {} },
          "C": { "E": { "F": {} } }
        }
      },
      "depth": 4
    },
    {
      "root": "X",
      "tree": {},
      "has_cycle": true
    },
    {
      "root": "P",
      "tree": {
        "P": {
          "Q": { "R": {} }
        }
      },
      "depth": 3
    },
    {
      "root": "G",
      "tree": {
        "G": {
          "H": {},
          "I": {}
        }
      },
      "depth": 2
    }
  ],
  "invalid_entries": ["hello", "1->2", "A->"],
  "duplicate_edges": ["G->H"],
  "summary": {
    "total_trees": 3,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

## Edge Case Handling

- **Empty Input:** Returns an empty response structure with zeroed summary statistics.
- **All Invalid Entries:** Hierarchies array will be empty, and all entries are added to `invalid_entries`.
- **Diamond Paths (Multiple Parents):** For inputs like `A->C` and `B->C`, the node `C` is assigned to the first parent encountered (`A`). Subsequent edges to `C` (e.g., `B->C`) are silently discarded to enforce single-parent strict hierarchies.
- **Pure Cycles:** A component consisting exclusively of a cycle (e.g., `X->Y`, `Y->Z`, `Z->X`) will have the lexicographically smallest node selected as its root and flag `has_cycle: true`.

## Deployment

Deploy on Vercel:
```bash
vercel --prod
```
