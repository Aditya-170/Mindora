"use client";
import { useState } from "react";

export default function ExtractAndSummarize() {
  const [url, setUrl] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProcess = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    setExtractedText("");
    setSummary("");

    try {
      // 1️⃣ Call Flask API to extract text
      const resText = await fetch("http://localhost:5000/extract-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const dataText = await resText.json();

      if (!resText.ok) {
        setError(dataText.error || "Failed to extract text");
        setLoading(false);
        return;
      }

      setExtractedText(dataText.text);

      // 2️⃣ Call Next.js summarize API with the extracted text
      const resSummary = await fetch("/api/extract-short-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: dataText.text }),
      });

      const dataSummary = await resSummary.json();

      if (!resSummary.ok) {
        setError(dataSummary.error || "Failed to summarize text");
      } else {
        setSummary(dataSummary.finalSummary);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PDF to Short Notes</h1>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Paste PDF link here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleProcess}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? "Processing..." : "Generate Short Notes"}
        </button>
      </div>

      {error && <p className="mt-4 text-red-500 font-semibold">⚠️ {error}</p>}

      {extractedText && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Extracted Text:</h2>
          <pre className="bg-gray-100 p-3 rounded max-h-64 overflow-y-scroll whitespace-pre-wrap">
            {extractedText}
          </pre>
        </div>
      )}

      {summary && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Short Notes Summary:</h2>
          <pre className="bg-gray-100 p-3 rounded max-h-64 overflow-y-scroll whitespace-pre-wrap">
            {summary}
          </pre>
        </div>
      )}
    </div>
  );
}
