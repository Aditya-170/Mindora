"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { io } from "socket.io-client";

export default function ChatWidget({ roomId, userName }) {
  const socketRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]); // NEW: online users
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Connect to socket when component mounts
  useEffect(() => {
    if (!roomId || !userName) return;

    socketRef.current = io("https://mindora-new-1.onrender.com");

    socketRef.current.emit("join-room", { roomId, userName });

    socketRef.current.on("receive-message", (msgData) => {
      setMessages((prev) => [...prev, msgData]);
    });

    socketRef.current.on("user-joined", ({ userName }) => {
      setMessages((prev) => [
        ...prev,
        { text: `${userName} joined the chat`, sender: "System", time: "" },
      ]);
    });

    // NEW: Listen for online users
    socketRef.current.on("online-users", (users) => {
      setOnlineUsers(users.map(u => u.userName));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, userName]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socketRef.current) return;

    const msgData = {
      sender: userName,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    socketRef.current.emit("send-message", { roomId, userName, message: input });

    setInput(""); // server will send back the message
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="flex flex-col w-[90vw] sm:w-[380px] max-h-[80vh] bg-zinc-900 border border-yellow-500/40 rounded-xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-yellow-500 text-black font-semibold text-lg">
              <span>Chat</span>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Online Users */}
            {onlineUsers.length > 0 && (
              <div className="px-4 py-2 bg-zinc-800 text-yellow-200 text-sm border-b border-yellow-500/30">
                Online: {onlineUsers.join(", ")}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3 rounded-lg break-words flex flex-col
    ${msg.sender === userName
                      ? "bg-black text-white self-end max-w-[90vw]" // responsive width
                      : msg.sender === "System"
                        ? "bg-yellow-300 text-black self-center max-w-[90vw]"
                        : "bg-zinc-700 text-yellow-100 self-start max-w-[90vw]"
                    }`}
                >
                  <span className="text-sm">{msg.text}</span>
                  {msg.sender !== "System" && (
                    <span className="text-[12px] text-blue-200 mt-1 self-end">
                      {msg.sender} @ {msg.time}
                    </span>
                  )}
                </motion.div>

              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input */}
            <div className="flex p-3 border-t border-yellow-500/30">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-3 rounded-lg bg-zinc-800 border border-yellow-500/30 text-yellow-100 focus:outline-none focus:border-yellow-400 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="ml-2 px-4 py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button + Animated Text */}
      <div className="relative flex flex-col items-center">
        <motion.button
          onClick={() => setOpen(!open)}
          className="w-16 h-16 rounded-full bg-yellow-500 text-black shadow-lg flex items-center justify-center hover:bg-yellow-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
        >
          <MessageCircle className="w-7 h-7" />
        </motion.button>
      </div>
    </div>
  );
}
