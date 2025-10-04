"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Printer, ArrowLeft, FileText } from "lucide-react";
import Spinner from "../Spinner";

export default function ShortNotes({ roomId }) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch short notes
  useEffect(() => {
    if (!roomId) return;

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/short-notes/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId }),
        });
        const data = await res.json();
        setNotes(data.shortNotesList || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch short notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [roomId]);

  // Print handler
  const handlePrint = (note) => {
    const printContents = `
      <h2>${note.topic}</h2>
      ${note.shortNotes
        .split("\n")
        .map((line) => {
          const trimmed = line.trim();
          if (!trimmed) return "";
          if (trimmed.startsWith("**")) {
            return `<h3 style="font-size:18px; font-weight:bold; color:black; margin-top:10px;">${trimmed.replace(/\*\*/g, "")}</h3>`;
          } else if (trimmed.startsWith("*")) {
            return `<p style="color:orange; margin-left:20px;">• ${trimmed.replace(/^\*\s*/, "")}</p>`;
          } else {
            return `<p style="color:#555; margin-left:20px;">${trimmed}</p>`;
          }
        })
        .join("")}
      <p>Generated at: ${new Date(note.generatedAt).toLocaleString()}</p>
    `;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // VIEW MODE
  if (selectedNote) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col min-h-0 bg-zinc-900 border border-yellow-500/30 rounded-xl shadow-xl shadow-yellow-500/10"
        >
          <div className="flex items-center justify-between p-4 border-b border-yellow-500/20 bg-zinc-800 rounded-t-xl">
            <button
              onClick={() => setSelectedNote(null)}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h2 className="text-lg font-bold text-yellow-400 truncate max-w-[60%]">
              {selectedNote.topic}
            </h2>
            <button
              onClick={() => handlePrint(selectedNote)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>

          <div className="flex-1 min-h-0 p-4 overflow-y-auto max-h-[500px]">
            {selectedNote.shortNotes.split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("**")) {
                return (
                  <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2">
                    {trimmed.replace(/\*\*/g, "")}
                  </h3>
                );
              } else if (trimmed.startsWith("*")) {
                return (
                  <p key={i} className="flex items-start gap-2 text-yellow-300 ml-4">
                    <span className="font-bold text-yellow-500">*</span>{" "}
                    <span>{trimmed.replace(/^\*\s*/, "")}</span>
                  </p>
                );
              } else {
                return (
                  <p key={i} className="text-yellow-200 ml-4">
                    {trimmed}
                  </p>
                );
              }
            })}
            <p className="mt-2 text-sm text-yellow-400">
              Generated at: {new Date(selectedNote.generatedAt).toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // LIST MODE
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col min-h-0 bg-zinc-900 border border-yellow-500/30 rounded-xl shadow-xl shadow-yellow-500/10 p-4"
      >
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
          Short Notes
        </h2>

        {loading && <Spinner />}
        {error && <p className="text-center text-red-400">{error}</p>}

        <div className="flex-1 overflow-y-auto max-h-[500px] space-y-4">
          {notes.map((note, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-zinc-800 p-4 rounded-xl border border-yellow-500/20 shadow-md hover:shadow-yellow-500/10 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-yellow-300 truncate">{note.topic}</p>
                  <p className="text-sm text-gray-400 truncate">
                    Generated at: {new Date(note.generatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={() => setSelectedNote(note)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
                <button
                  onClick={() => handlePrint(note)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
