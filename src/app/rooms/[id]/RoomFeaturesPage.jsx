// RoomFeaturesPage.jsx (Client Component)
"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InviteMembers from "@/components/InviteMembers";

const sidebarOptions = [
  "Members",
  "Invite Members",
  "Upload Notes",
  "Short Notes",
  "Youtube Links",
  "Upload Image",
  "Open Whiteboard",
  "Uploaded Notes",
  "Create Quiz",
  "Leaderboard",
  "Meeting",
  "Chats"
];

export default function RoomFeaturesPage({ roomId }) {
  const [selected, setSelected] = useState(sidebarOptions[0]);
  const sidebarRef = useRef(null);
  const buttonRefs = useRef([]);

//   console.log("roomId:", roomId); // ✅ roomId is now correctly received as a prop

  const handleSelect = (option, index) => {
    setSelected(option);

    const button = buttonRefs.current[index];
    const sidebar = sidebarRef.current;
    if (button && sidebar) {
      const sidebarHeight = sidebar.clientHeight;
      const buttonTop = button.offsetTop;
      const buttonHeight = button.clientHeight;
      const scrollTop = buttonTop - sidebarHeight / 2 + buttonHeight / 2;
      sidebar.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-yellow-400">
      <Navbar />

      <div className="flex flex-1 gap-6 p-6 overflow-hidden">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className="w-64 flex flex-col h-[calc(100vh-96px)] bg-zinc-900 border-r border-yellow-500/20 p-4 rounded-xl"
        >
          <h2 className="text-lg text-center font-bold text-white mb-8">
            Options
          </h2>
          <div className="flex-1 flex flex-col overflow-y-auto pr-2 space-y-2">
            {sidebarOptions.map((option, i) => (
              <motion.button
                key={option}
                ref={(el) => (buttonRefs.current[i] = el)}
                onClick={() => handleSelect(option, i)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`w-full px-3 py-2 rounded-lg mt-2 font-medium transition-colors duration-200 text-left ${
                  selected === option
                    ? "bg-yellow-500 text-black"
                    : "hover:bg-yellow-500/10"
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col p-8 bg-zinc-950 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4 mb-6 border border-yellow-500/20">
            <img
              src="/globe.svg"
              alt={selected}
              className="w-12 h-12 object-cover rounded-full"
            />
            <h2 className="text-xl font-bold text-yellow-400">
              Room ID: {roomId}
            </h2>
            <span className="text-sm text-gray-400">By Owner</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col overflow-auto"
            >
              <div className="flex-1 bg-zinc-900 rounded-xl p-8 border border-yellow-500/20 shadow-lg shadow-yellow-500/10 overflow-auto">
                {selected === "Invite Members" ? (
                  <InviteMembers roomId={roomId} />
                ) : (
                  <p className="text-yellow-100/90 text-lg leading-relaxed">
                    This is the content area for{" "}
                    <span className="font-semibold">{selected}</span>. You can
                    render the full details or components for this feature here.
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer />
    </div>
  );
}
