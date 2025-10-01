"use client";
import React, { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadedLinks({ roomId }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    const fetchLinks = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/links/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch links");

        setLinks(data.links || []);
      } catch (err) {
        toast.error(err.message || "Something went wrong!", {
          style: { background: "red", color: "white" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [roomId]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="p-4 border-b border-yellow-500/20 text-center text-2xl font-bold text-yellow-400">
        Uploaded Links
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-yellow-300 text-lg">
          Loading...
        </div>
      ) : links.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-yellow-300 text-lg">
          No links uploaded yet.
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-zinc-700">
          {links.map((link, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-yellow-500/20 shadow-md hover:shadow-yellow-500/10 transition"
            >
              {/* Info */}
              <div className="min-w-0">
                <p className="font-semibold text-yellow-300 truncate">{link.topic}</p>
                <p className="text-sm text-gray-400 truncate">
                  Uploaded by {link.uploader?.name || "Unknown"} on{" "}
                  {new Date(link.date).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition"
                >
                  <ExternalLink className="w-4 h-4" /> View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
