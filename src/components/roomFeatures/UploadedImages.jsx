"use client";
import React, { useState, useEffect } from "react";
import { Eye, ArrowLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

export default function UploadedImages({ roomId }) {
  const { user } = useUser();
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch images from backend
  useEffect(() => {
    if (!roomId) return;

    const fetchImages = async () => {
      try {
        const res = await fetch("/api/images/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch images");

        setImages(
          data.images.map((img, index) => ({
            id: index + 1,
            topic: img.topic,
            uploadedBy: img.uploader?.name || "Unknown",
            date: new Date(img.date).toLocaleDateString(),
            url: img.link,
          }))
        );
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Error fetching images", {
          style: { background: "red", color: "white" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [roomId]);

  // VIEW MODE
  // VIEW MODE
  if (selectedImage) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-500/20 bg-zinc-800 rounded-t-xl">
          <button
            onClick={() => setSelectedImage(null)}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h2 className="text-lg font-bold text-yellow-400 truncate max-w-[60%]">
            {selectedImage.topic}
          </h2>
        </div>

        {/* Fixed-size image container */}
        <div className="flex-1 min-h-0 p-4 bg-zinc-900 rounded-b-xl flex justify-center items-center">
          <div className="w-full max-w-3xl h-[500px] bg-zinc-800 rounded-xl border border-yellow-500/20 overflow-hidden">
            <img
              src={selectedImage.url}
              alt={selectedImage.topic}
              className="w-full h-full object-cover bg-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-800 border-t border-yellow-500/20 flex justify-between rounded-b-xl text-yellow-200">
          <span>Uploaded by: {selectedImage.uploadedBy}</span>
          <span>Date: {selectedImage.date}</span>
        </div>
      </div>
    );
  }

  // LIST MODE
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b border-yellow-500/20 text-2xl font-bold text-yellow-400 text-center">
        Uploaded Images
      </div>

      {/* Scrollable container for images */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-zinc-700">
        {loading ? (
          <p className="text-center text-yellow-300">Loading images...</p>
        ) : images.length === 0 ? (
          <p className="text-center text-yellow-300">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="flex flex-col bg-zinc-900 rounded-xl border border-yellow-500/20 overflow-hidden shadow-md hover:shadow-yellow-500/10 transition"
              >
                <div className="relative">
                  <img
                    src={img.url}
                    alt={img.topic}
                    className="w-full h-48 object-cover bg-white"
                  />
                  <button
                    onClick={() => setSelectedImage(img)}
                    className="absolute top-2 right-2 bg-yellow-500 text-black p-1 rounded-full hover:bg-yellow-400 transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3 flex flex-col gap-1 text-yellow-200">
                  <p className="font-semibold text-yellow-300 truncate">{img.topic}</p>
                  <p className="text-sm truncate">Uploaded by {img.uploadedBy}</p>
                  <p className="text-xs text-gray-400">{img.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
