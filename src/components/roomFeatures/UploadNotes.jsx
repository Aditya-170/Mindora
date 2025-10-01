"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast, ToastContainer } from "react-toastify";
export default function UploadNotes({ roomId }) {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Only PDF files are allowed.");
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a PDF first", { style: { background: "#DC2626", color: "#fff" } });
    if (!topic.trim()) return toast.error("Please enter a topic", { style: { background: "#DC2626", color: "#fff" } });
    if (!user) return toast.error("You must be logged in", { style: { background: "#DC2626", color: "#fff" } });

    setLoading(true);

    try {
      //upload to supabase
      const res = await fetch("/api/upload-pdf-s3", {
        method: "POST",
        headers: {
          "Content-Type": file.type,
          "x-filename": file.name,
        },
        body: file,
      });

      const data = await res.json();
      // console.log("Supabase upload response:", data);

      if (!data.url) {
        toast.error("Upload error: " + (data.error || "No URL returned"), { style: { background: "#DC2626", color: "#fff" } });
        setLoading(false);
        return;
      }

      const pdfUrl = data.url;

      // now call the backend to upload the notes

      const saveRes = await fetch("/api/notes/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          topic,
          uploaderId: user.id,
          link: pdfUrl,
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.message || "Failed to save note");

      toast.success(`Note "${topic}" uploaded successfully!`, { style: { background: "#FACC15", color: "#000" } });

      fetch("/api/short-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, pdfUrl, roomId }),
      }).catch((err) => console.error("Short notes generation failed:", err));
      setFile(null);
      setTopic("");
      setError("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong", { style: { background: "#DC2626", color: "#fff" } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-yellow-100">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-zinc-800 border border-yellow-500/30 rounded-2xl p-8 shadow-xl shadow-yellow-500/10"
      >
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
          Upload Notes (PDF Only)
        </h2>

        {/* Topic Input */}
        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg border border-yellow-500/30 bg-zinc-900 text-yellow-100 placeholder-yellow-400 focus:outline-none focus:border-yellow-400 transition"
        />

        {/* File Input */}
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-yellow-500/40 rounded-xl p-8 cursor-pointer hover:bg-yellow-500/10 transition"
        >
          <Upload className="w-10 h-10 text-yellow-400 mb-3" />
          <span className="text-sm text-yellow-200">
            Click to select a PDF file
          </span>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* File Info */}
        {file && (
          <div className="mt-4 p-3 bg-zinc-900 border border-yellow-500/30 rounded-lg text-center">
            <p className="text-yellow-300 text-sm font-medium">
              Selected File: {file.name}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-red-400 font-medium">{error}</p>
        )}

        {/* Upload Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleUpload}
          className="mt-6 w-full bg-yellow-500 text-black font-semibold py-3 rounded-xl shadow-lg hover:bg-yellow-400 transition"
        >
          Upload
        </motion.button>
      </motion.div>
    </div>
  );
}
