"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import UploadNotes from "@/components/roomFeatures/UploadNotes";
import UploadLink from "@/components/roomFeatures/AddYoutubeLinks";
import UploadImage from "@/components/roomFeatures/UploadImages";
import UploadedNotes from "@/components/roomFeatures/UploadedNotes";
import UploadedLinks from "@/components/roomFeatures/YoutubeLinks";
import UploadedImages from "@/components/roomFeatures/UploadedImages";
import ShortNotes from "@/components/roomFeatures/ShortNotes";
import InviteMembers from "@/components/roomFeatures/InviteMembers";
import Members from "@/components/roomFeatures/Members";
import QuizGenerator from "@/components/roomFeatures/GenerateQuiz";
import AttemptQuiz from "@/components/roomFeatures/AttemptQuiz";
import LeaderboardPageDummy from "@/components/roomFeatures/ShowLeaderboard";
import Whiteboard from "@/components/roomFeatures/Whiteboard";
import { useUser } from "@clerk/nextjs";
import VoiceChannel from "@/components/roomFeatures/VoiceChannel";
const sidebarOptions = [
  "Members",
  "Invite Members",
  "Voice Call",
  "Upload Notes",
  "Upload Image",
  "Add Links",
  "Generate Quiz",
  "Uploaded Notes",
  "Uploaded Images",
  "Links",
  "Short Notes",
  "Attempt Quiz",
  "Leaderboard",
  "Announce To Room",
  "Announcements",
  "Whiteboard",
  "Meeting",
  "Chats",
];


export default function RoomFeaturesPage() {
  const [selected, setSelected] = useState(sidebarOptions[0]);
  const sidebarRef = useRef(null);
  const buttonRefs = useRef([]);
  const params = useParams();
  const id = params.id;
  const {user}=useUser();
  const userId = user ? user.id : null;
  // console.log("Room ID from URL:", id);

  const componentsMap = {
    "Members": <Members roomId={id} />,
    "Upload Notes": <UploadNotes roomId={id} />,
    "Invite Members": <InviteMembers roomId={id} />,
    "Voice Call": <VoiceChannel roomId={id} userId={userId} />,
    "Add Links": <UploadLink roomId={id} />,
    "Upload Image": <UploadImage roomId={id} />,
    "Uploaded Notes": <UploadedNotes roomId={id} />,
    "Links": <UploadedLinks roomId={id} />,
    "Uploaded Images": <UploadedImages roomId={id} />,
    "Short Notes": <ShortNotes roomId={id} />,
    "Generate Quiz": <QuizGenerator roomId={id} />,
    "Attempt Quiz": <AttemptQuiz roomId={id} />,
    "Leaderboard": <LeaderboardPageDummy roomId={id} />,
    "Whiteboard": <Whiteboard roomId={id} />
  };

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

      <div className="flex flex-1 gap-6 overflow-hidden p-6">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className="w-64 flex flex-col h-[calc(100vh-96px)] bg-zinc-900 border-r border-yellow-500/20 p-4 rounded-xl"
        >
          <h2 className="text-lg text-center font-bold text-white mb-8">Options</h2>
          <div className="flex-1 flex flex-col overflow-y-auto pr-2 space-y-2">
            {sidebarOptions.map((option, i) => (
              <motion.button
                key={option}
                ref={(el) => (buttonRefs.current[i] = el)}
                onClick={() => handleSelect(option, i)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className={`w-full px-3 py-2 rounded-lg mt-2 font-medium text-left transition-colors duration-200 ${selected === option ? "bg-yellow-500 text-black" : "hover:bg-yellow-500/10"
                  }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4 mb-4 border border-yellow-500/20">
            <img src="/globe.svg" alt={selected} className="w-12 h-12 object-cover rounded-full" />
            <h2 className="text-xl font-bold text-yellow-400">MPMC CLASS</h2>
            <span className="text-sm text-gray-400">By Jayendra Taklu</span>
          </div>

          {/* Animated Feature Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {componentsMap[selected] || (
                  <div className="flex-1 flex items-center justify-center text-yellow-100/90">
                    <p className="text-lg text-center">
                      This section <span className="font-semibold">{selected}</span> is under construction.
                    </p>
                  </div>
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
