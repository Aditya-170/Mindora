"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

export default function UploadImage({ roomId }) {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("image/")) {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Only image files are allowed (jpg, png, etc).");
    }
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select an image file before uploading.");
    if (!topic.trim()) return setError("Please enter a topic for the image.");
    if (!user) return toast.error("You must be logged in to upload.");

    setLoading(true);
    setError("");

    try {
      // 1️⃣ Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);

      const cloudRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const cloudData = await cloudRes.json();
      if (cloudData.error) throw new Error(cloudData.error);

      const imageUrl = cloudData.secure_url;

      // 2️⃣ Save image info to backend
      const saveRes = await fetch("/api/images/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          topic,
          uploaderId: user.id,
          link: imageUrl,
        }),
      });

      const saveData = await saveRes.json();
      if (saveData.error) throw new Error(saveData.error);

      toast.success("Image uploaded successfully!", {
        style: { background: "black", color: "yellow" },
      });

      // Reset
      setFile(null);
      setTopic("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed", { style: { background: "red", color: "white" } });
    }

    setLoading(false);
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
          Upload Image
        </h2>

        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg border border-yellow-500/30 bg-zinc-900 text-yellow-100 placeholder-yellow-400 focus:outline-none focus:border-yellow-400 transition"
        />

        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-yellow-500/40 rounded-xl p-8 cursor-pointer hover:bg-yellow-500/10 transition"
        >
          <ImagePlus className="w-10 h-10 text-yellow-400 mb-3" />
          <span className="text-sm text-yellow-200">
            Click to select an image file
          </span>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div className="mt-4 h-20 flex items-center justify-center bg-zinc-900 border border-yellow-500/30 rounded-lg overflow-hidden">
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <p className="text-sm text-zinc-500 italic">No image selected</p>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-400 font-medium">{error}</p>}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 w-full bg-yellow-500 text-black font-semibold py-3 rounded-xl shadow-lg hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {loading ? <Spinner/> : "Upload"}
        </motion.button>
      </motion.div>
    </div>
  );
}
