"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Users } from "lucide-react";
import Spinner from "../Spinner";

export default function LeaderboardPage({ roomId }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!roomId) return;

        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/leaderboard/show-ranks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ roomId }),
                });
                const data = await res.json();
                if (res.ok) {
                    setLeaderboard(data.leaderboard || []);
                } else {
                    setError(data.message || "Failed to fetch leaderboard");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch leaderboard");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [roomId]);

    const getBadge = (index) => {
        if (index === 0)
            return {
                icon: "🥇",
                bg: "bg-yellow-500",
                text: "text-black",
                shadow: "shadow-yellow-400/50",
                size: "w-28 h-28",
            };
        if (index === 1)
            return {
                icon: "🥈",
                bg: "bg-gray-400",
                text: "text-black",
                shadow: "shadow-gray-400/50",
                size: "w-24 h-24",
            };
        if (index === 2)
            return {
                icon: "🥉",
                bg: "bg-orange-400",
                text: "text-black",
                shadow: "shadow-orange-400/50",
                size: "w-20 h-20",
            };
        return null;
    };

    if (loading) {
        return (
             <Spinner/>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col items-center py-10 px-4 text-yellow-100">
            <h1 className="text-3xl md:text-4xl font-bold mb-10 flex items-center gap-2 text-yellow-400">
                <Crown className="w-8 h-8 text-yellow-300" />
                Room Leaderboard
            </h1>

            {/* Top 3 Podium */}
            
            <div className="flex justify-center items-end gap-6 mb-10 w-full max-w-3xl">
                {leaderboard.slice(0, 3).map((user, i) => {
                    const badge = getBadge(i);
                    const podiumOrder = [2, 1, 3]; // center 1st, left 2nd, right 3rd
                    return (
                        <motion.div
                            key={user.clerkId}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4 + i * 0.2 }}
                            className="flex flex-col items-center"
                            style={{ order: podiumOrder[i] }}
                        >
                            <div
                                className={`${badge.size} ${badge.bg} ${badge.text} ${badge.shadow} rounded-full flex items-center justify-center text-3xl font-bold`}
                            >
                                {badge.icon}
                            </div>
                            <p className="mt-3 text-lg font-semibold text-yellow-100 truncate max-w-[8rem] text-center">
                                {user.name}
                            </p>
                            <p className="text-sm text-yellow-300">{user.totalScore} pts</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Scrollable Remaining Users */}
            <div className="w-full max-w-xl bg-zinc-800 rounded-2xl shadow-xl overflow-hidden">
                <ul className="max-h-[400px] overflow-y-auto custom-scroll">
                    {leaderboard.slice(3).map((user, i) => (
                        <motion.li
                            key={user.clerkId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 + i * 0.05 }}
                            className="flex items-center justify-between px-6 py-4 border-b border-yellow-700 hover:bg-yellow-900 transition rounded-lg m-1"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-bold">{i + 4}</span>
                                <Users className="w-5 h-5 text-yellow-400" />
                                <span className="font-medium">{user.name}</span>
                            </div>
                            <span className="font-semibold">{user.totalScore} pts</span>
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* Custom Scrollbar */}
            <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #eab308;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #facc15;
        }
        .custom-scroll {
          scrollbar-color: #eab308 #27272a;
        }
      `}</style>
        </div>
    );
}
