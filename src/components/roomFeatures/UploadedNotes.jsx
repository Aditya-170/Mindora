"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Eye, Download, ArrowLeft } from "lucide-react";

export default function UploadedNotes({ roomId }) {
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch notes from backend
  useEffect(() => {
    if (!roomId) return;

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/notes/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId }),
        });

        const data = await res.json();

        if (res.ok) {
          setNotes(data.notes || []);
        } else {
          setError(data.message || "Failed to fetch notes");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [roomId]);

  // VIEW MODE
  if (selectedNote) {
    return (
      <div className="flex-1 flex flex-col min-h-0 text-yellow-100">
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
              {selectedNote.topic || selectedNote.fileName}
            </h2>
            <a
              href={selectedNote.link || selectedNote.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition"
            >
              <Download className="w-4 h-4" /> Download
            </a>
          </div>

          <div className="flex-1 min-h-0 p-4">
            <iframe
              src={selectedNote.link || selectedNote.url}
              className="w-full h-full rounded-lg border border-yellow-500/20 min-h-0"
              title="PDF Viewer"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // LIST MODE
  return (
    <div className="flex-1 flex flex-col min-h-0 text-yellow-100">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col min-h-0 bg-zinc-800 border border-yellow-500/30 rounded-2xl p-6 shadow-xl shadow-yellow-500/10"
      >
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
          Uploaded Notes
        </h2>

        {loading && <p className="text-center text-yellow-200">Loading...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-zinc-700">
          {notes.map((note, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-yellow-500/20 shadow-md hover:shadow-yellow-500/10 transition"
            >
              {/* File Info */}
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-yellow-300 truncate">
                    {note.topic}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    Uploaded by {note.uploader?.name || "Unknown"} on{" "}
                    {new Date(note.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={() => setSelectedNote(note)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
                <a
                  href={note.link || note.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
