"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Parse input by commas or newlines
      const parsedInput = input
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const res = await fetch("/api/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: parsedInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process data");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTree = (treeObj, depth = 0) => {
    if (!treeObj || Object.keys(treeObj).length === 0) return null;
    
    return Object.entries(treeObj).map(([node, children]) => (
      <div key={node} style={{ paddingLeft: `${depth * 1.5}rem` }}>
        {node}
        {renderTree(children, depth + 1)}
      </div>
    ));
  };

  return (
    <main className="max-w-2xl mx-auto p-4 md:p-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">BFHL Node Processor</h1>
        <p className="text-gray-600">Process directed graph edges and analyze hierarchies.</p>
      </header>

      <section>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="nodes" className="font-semibold">Enter node strings</label>
            <textarea
              id="nodes"
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="A->B, A->C, B->D, ..."
              className="w-full border border-gray-200 p-3 focus:outline-none focus:border-black resize-y"
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 px-4 font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
          
          {error && <p className="text-red-600 font-medium">{error}</p>}
        </form>
      </section>

      {result && (
        <section className="space-y-8">
          {/* Summary */}
          {result.summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 p-4">
                <div className="text-sm text-gray-500 mb-1">Total Trees</div>
                <div className="text-2xl font-bold">{result.summary.total_trees}</div>
              </div>
              <div className="border border-gray-200 p-4">
                <div className="text-sm text-gray-500 mb-1">Total Cycles</div>
                <div className="text-2xl font-bold">{result.summary.total_cycles}</div>
              </div>
              <div className="border border-gray-200 p-4">
                <div className="text-sm text-gray-500 mb-1">Largest Tree Root</div>
                <div className="text-2xl font-bold">{result.summary.largest_tree_root || "-"}</div>
              </div>
            </div>
          )}

          {/* Hierarchies */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Hierarchies</h2>
            {result.hierarchies?.length === 0 && <p className="text-gray-500">No valid hierarchies found.</p>}
            
            {result.hierarchies?.map((h, i) => (
              <div key={i} className="border border-gray-200 p-4 space-y-2">
                <div className="font-bold border-b border-gray-100 pb-2 mb-2 flex justify-between">
                  <span>Root: {h.root}</span>
                  <span className="text-gray-500 font-normal">
                    {h.has_cycle ? "CYCLE" : `TREE (depth: ${h.depth})`}
                  </span>
                </div>
                {!h.has_cycle && h.tree && (
                  <div className="font-mono text-sm overflow-x-auto whitespace-pre">
                    {renderTree(h.tree)}
                  </div>
                )}
                {h.has_cycle && (
                  <div className="font-mono text-sm text-red-500">
                    Cycle detected in component starting with {h.root}.
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Invalid Entries */}
          {result.invalid_entries?.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-bold">Invalid Entries</h2>
              <div className="p-4 border border-gray-200 bg-gray-50 text-gray-700 font-mono text-sm break-all">
                {result.invalid_entries.join(", ")}
              </div>
            </div>
          )}

          {/* Duplicate Edges */}
          {result.duplicate_edges?.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-bold">Duplicate Edges</h2>
              <div className="p-4 border border-gray-200 bg-gray-50 text-gray-700 font-mono text-sm break-all">
                {result.duplicate_edges.join(", ")}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
