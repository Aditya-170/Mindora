"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function UploadAnnouncement({ roomId }) {
  const { user } = useUser(); // Get logged-in user
  const [form, setForm] = useState({
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("❌ You must be logged in to post announcements.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/announcements/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          userId: user.id, // Use Clerk userId
          topic: form.title,
          body: form.body,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Announcement uploaded successfully!");
        setForm({ title: "", body: "" });
      } else {
        setMessage(`❌ ${data.message || "Failed to upload announcement"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to upload announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center py-10 text-yellow-100">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-zinc-800 border border-yellow-500/30 rounded-2xl p-8 shadow-xl shadow-yellow-500/10 w-full max-w-3xl"
      >
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center flex items-center justify-center gap-2">
          <Megaphone className="w-6 h-6" /> Upload Announcement
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-yellow-300">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter announcement title"
              className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-yellow-500/30 text-yellow-100 placeholder-gray-400 focus:outline-none focus:border-yellow-400"
              required
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium mb-1 text-yellow-300">
              Body
            </label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              placeholder="Write the announcement details..."
              className="w-full h-32 px-4 py-2 rounded-lg bg-zinc-900 border border-yellow-500/30 text-yellow-100 placeholder-gray-400 focus:outline-none focus:border-yellow-400 resize-none overflow-y-auto"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {loading ? "Uploading..." : "Upload Announcement"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium">{message}</p>
        )}
      </motion.div>
    </div>
  );
}
