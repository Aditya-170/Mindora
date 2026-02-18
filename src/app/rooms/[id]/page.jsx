"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ChatWidget from "@/components/roomFeatures/Chats";
import Members from "@/components/roomFeatures/Members";
import UploadNotes from "@/components/roomFeatures/UploadNotes";
import InviteMembers from "@/components/roomFeatures/InviteMembers";
import VoiceChannel from "@/components/roomFeatures/VoiceChannel";
import UploadLink from "@/components/roomFeatures/AddYoutubeLinks";
import UploadImage from "@/components/roomFeatures/UploadImages";
import UploadedNotes from "@/components/roomFeatures/UploadedNotes";
import UploadedLinks from "@/components/roomFeatures/YoutubeLinks";
import UploadedImages from "@/components/roomFeatures/UploadedImages";
import ShortNotes from "@/components/roomFeatures/ShortNotes";
import QuizGenerator from "@/components/roomFeatures/GenerateQuiz";
import AttemptQuiz from "@/components/roomFeatures/AttemptQuiz";
import Whiteboard from "@/components/roomFeatures/Whiteboard";
import LeaderboardPageDummy from "@/components/roomFeatures/ShowLeaderboard";
import AnnouncementsPage from "@/components/roomFeatures/Announcements";
import UploadAnnouncement from "@/components/roomFeatures/AnnounceToRoom";

const sidebarOptions = [
  "Members",
  "Invite Members",
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
  "Voice Call",
  "Whiteboard",
  "Announce To Room",
  "Announcements",
];

export default function RoomFeaturesPage() {
  const [selected, setSelected] = useState(sidebarOptions[0]);
  const [roomData, setRoomData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const buttonRefs = useRef([]);
  const params = useParams();
  const id = params.id;
  const { user } = useUser();
  const userId = user ? user.id : null;
  const firstName = user?.firstName;

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${id}/detail`);
        const data = await res.json();
        if (!data.error) {
          setRoomData(data);
        }
      } catch (err) {
        console.error("Error fetching room:", err);
      }
    };
    fetchRoom();
  }, [id]);

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
    "Whiteboard": <Whiteboard roomId={id} />,
    "Announcements": <AnnouncementsPage roomId={id} />,
    "Announce To Room": <UploadAnnouncement roomId={id} />,
  };

  const handleSelect = (option, index) => {
    setSelected(option);
    setIsSidebarOpen(false); // close sidebar on mobile
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

      <div className="flex flex-1 gap-6 overflow-hidden p-6 relative">
        {/* Hamburger button (mobile only) */}
        <button
          className="md:hidden absolute top-4 left-4 z-30 p-2 rounded-md bg-yellow-500 text-black"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {/* Three lines (hamburger) */}
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </div>
        </button>

        {/* Sidebar */}
        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || (typeof window !== "undefined" && window.innerWidth >= 768)) && (
            <>
              {/* Backdrop */}
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black z-40"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              <motion.aside
                ref={sidebarRef}
                initial={{ x: -250, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -250, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-64 flex flex-col bg-zinc-900 border-r border-yellow-500/20 p-4 rounded-xl absolute md:static z-50 max-h-[calc(100vh-80px)] md:h-auto"
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
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className={`w-full px-3 py-2 rounded-lg mt-2 font-medium text-left transition-colors duration-200 ${selected === option
                          ? "bg-yellow-500 text-black"
                          : "hover:bg-yellow-500/10"
                        }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </motion.aside>

            </>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4 mb-4 border border-yellow-500/20">
            <img
              src={roomData?.image || "/globe.svg"}
              alt={roomData?.name || "Room"}
              className="w-12 h-12 object-cover rounded-full"
            />
            <h2 className="text-xl font-bold text-yellow-400">
              {roomData?.name || "Loading..."}
            </h2>
            <span className="text-sm text-gray-400">
              By {roomData?.owner || "Unknown"}
            </span>
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
                      This section{" "}
                      <span className="font-semibold">{selected}</span> is under
                      construction.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer />
      <ChatWidget roomId={id} userName={firstName} />
    </div>
  );
}
