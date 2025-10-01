"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function ShortNotes({ roomId }) {
  const [shortNotesList, setShortNotesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchShortNotes = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/short-notes/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId }),
        });

        const data = await res.json();
        setShortNotesList(data.shortNotesList || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch short notes");
      } finally {
        setLoading(false);
      }
    };

    fetchShortNotes();
  }, [roomId]);

  const handlePrint = (note) => {
    const printContents = `
      <h2>${note.topic}</h2>
      <ul>${note.shortNotes
        .split("\n")
        .map((line) => (line.trim() ? `<li>${line.trim()}</li>` : ""))
        .join("")}</ul>
      <p>Generated at: ${new Date(note.generatedAt).toLocaleString()}</p>
    `;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin w-10 h-10 text-purple-600" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-6">{error}</p>;
  }

  if (!shortNotesList.length) {
    return <p className="text-yellow-300 text-center mt-6">No short notes available.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-purple-50 dark:bg-purple-900 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-4">
        Short Notes
      </h1>

      <div className="space-y-4">
        {shortNotesList.map((note, idx) => (
          <div
            key={idx}
            className="bg-purple-100 dark:bg-purple-950 p-4 rounded-lg shadow-inner"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100">
                {note.topic}
              </h2>
              <Button
                size="sm"
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={() =>
                  setExpandedIndex(expandedIndex === idx ? null : idx)
                }
              >
                {expandedIndex === idx ? "Hide" : "View"}
              </Button>
            </div>

            {expandedIndex === idx && (
              <div className="mt-3">
                <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-200">
                  {note.shortNotes.split("\n").map((line, i) => {
                    const trimmed = line.trim();
                    return trimmed ? <li key={i}>{trimmed}</li> : null;
                  })}
                </ul>

                <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">
                  Generated at: {new Date(note.generatedAt).toLocaleString()}
                </p>

                <Button
                  size="sm"
                  className="mt-3 bg-yellow-500 text-black hover:bg-yellow-400"
                  onClick={() => handlePrint(note)}
                >
                  Print
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
