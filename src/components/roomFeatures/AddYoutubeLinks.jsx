"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@clerk/nextjs";
import Spinner from "../Spinner";
export default function UploadLink({ roomId }) {
   const { user } = useUser();
  const [topic, setTopic] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!topic.trim() || !link.trim()) {
      toast.error("Please fill both fields before uploading.", {
        style: { background: "red", color: "white" },
      });
      return;
    }

    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w\-])+(\.[\w\-]+)+[/#?]?.*$/;
    if (!urlPattern.test(link)) {
      toast.error("Please enter a valid URL.", {
        style: { background: "red", color: "white" },
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/links/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          topic,
          uploaderId: user.id,
          url: link,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to upload link");

      toast.success("Link uploaded successfully!", {
        style: { background: "black", color: "yellow" },
      });

      setTopic("");
      setLink("");
    } catch (err) {
      toast.error(err.message || "Something went wrong!", {
        style: { background: "red", color: "white" },
      });
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
          Upload Reference Link
        </h2>

        {/* Topic Input */}
        <div className="mb-4">
          <label className="block text-sm text-yellow-300 mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic name"
            className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-yellow-500/30 text-yellow-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Link Input */}
        <div className="mb-4">
          <label className="block text-sm text-yellow-300 mb-1">Link</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-yellow-500/30 text-yellow-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Upload Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-xl shadow-lg hover:bg-yellow-400 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Link2 className="w-5 h-5" />
          {loading ? <Spinner/> : "Upload Link"}
        </motion.button>
      </motion.div>
    </div>
  );
}
