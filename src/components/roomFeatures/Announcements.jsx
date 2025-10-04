"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import Spinner from "../Spinner";

export default function AnnouncementsPage({ roomId }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchAnnouncements();
  }, [roomId]);

  const fetchAnnouncements = async () => {
    if (!roomId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/announcements/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });

      const data = await res.json();
      if (res.ok) {
        setAnnouncements(data.announcements || []);
      } else {
        console.error(data.message || "Failed to fetch announcements");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = el;
      if (scrollTop + clientHeight >= scrollHeight - 100 && !loadingMore) {
        loadMore();
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [loadingMore]);

  const loadMore = () => {
    // For now, just simulate loading more (can implement pagination later)
    setLoadingMore(true);
    setTimeout(() => setLoadingMore(false), 800);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 text-yellow-100">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col min-h-0 bg-zinc-800 border border-yellow-500/30 rounded-2xl p-6 shadow-xl shadow-yellow-500/10"
      >
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
          Announcements
        </h2>

        {loading ? (
          <p className="text-center text-yellow-200 py-10">Loading announcements...</p>
        ) : (
          <div
            ref={containerRef}
            className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-zinc-700 max-h-[440px]"
          >
            {announcements.length === 0 && (
              <p className="text-center text-yellow-200 py-4">No announcements found</p>
            )}

            {announcements.map((a) => (
              <div
                key={a._id}
                className="flex flex-col gap-2 bg-zinc-900 p-4 rounded-xl border border-yellow-500/20 shadow-md hover:shadow-yellow-500/10 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                    <h3 className="font-semibold text-yellow-300">{a.topic}</h3>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-300">{a.body}</p>
                <p className="text-sm text-gray-400">
                  Announced by <b>{a.uploaderName}</b>
                </p>
              </div>
            ))}

            {loadingMore && (
              <>
              <Spinner />
              <p className="text-center py-4 text-yellow-200">Loading more…</p>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
