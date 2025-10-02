"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

export default function QuizGenerator({ roomId }) {
    const { user } = useUser();
    const [pdfUrl, setPdfUrl] = useState("");
    const [notes, setNotes] = useState([]);

    const [form, setForm] = useState({
        topic: "",
        title: "",
        totalMarks: 20,
        difficulty: "Medium",
        timePerQuestion: 30, // in seconds
        negativeMarking: 1,  // custom value
    });
    const [topics, setTopics] = useState([]);
    const [loadingTopics, setLoadingTopics] = useState(true);

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    // Fetch topics from API on mount
    useEffect(() => {
        const fetchTopics = async () => {
            if (!roomId) return;
            try {
                const res = await fetch("/api/quiz/fetch-topics", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ roomId }),
                });
                const data = await res.json();
                if (data.success && data.notes.length) {
                    setNotes(data.notes); // <-- store notes
                    const uniqueTopics = [...new Set(data.notes.map(note => note.topic))];
                    setTopics(uniqueTopics);
                } else {
                    setNotes([]);
                    setTopics([]);
                }
            } catch (err) {
                console.error("Error fetching topics:", err);
                toast.error("Failed to fetch topics");
            } finally {
                setLoadingTopics(false);
            }
        };

        fetchTopics();
    }, [roomId]);


    const handleGenerate = async () => {
        if (!form.topic) return toast.error("Select a topic");
        if (!form.title.trim()) return toast.error("Enter a quiz title");
        // console.log("form topics", form.topic)
        const selectedNote = notes.find(n => n.topic === form.topic);
        // console.log("All notes topics:", notes.map(n => `"${n.topic}"`));
        // console.log("Form topic:", `"${form.topic}"`);
        // console.log("selectedNote", selectedNote);
        const pdfLink = selectedNote?.link || "";
        toast.info("Generating quiz... AI may take a few seconds!");

        try {
            const res = await fetch("/api/quiz/create-quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId,
                    pdfUrl: pdfLink,
                    createdBy: user.id, // Clerk userId
                    ...form,             // includes topic, title, difficulty, timePerQuestion, negativeMarking, totalMarks, numQuestions
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Quiz created successfully!");
                console.log("Created Quiz:", data.quiz);
            } else {
                toast.error(data.error || "Failed to create quiz");
                console.error("API Error:", data);
            }
        } catch (err) {
            console.error("Network Error:", err);
            toast.error("Failed to create quiz");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-yellow-100">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl h-[70vh] overflow-y-auto custom-scroll bg-zinc-800 border border-yellow-500/30 rounded-2xl p-8 shadow-xl shadow-yellow-500/10"
            >
                <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
                    ⚡ Generate AI Quiz
                </h2>

                {/* Topic Selector */}
                {/* Topic Selector */}
                <label className="block text-yellow-300 font-medium mb-2">Select Topic</label>
                <select
                    className="w-full mb-4 px-4 py-3 rounded-lg border border-yellow-500/30 bg-zinc-900 text-yellow-100 focus:outline-none focus:border-yellow-400 transition"
                    value={form.topic}
                    onChange={(e) => {
                        const selectedTopic = e.target.value;
                        handleChange("topic", selectedTopic);

                        // Find the note from notes state
                        const note = notes.find((n) => n.topic === selectedTopic);
                        if (note && note.link) {
                            setPdfUrl(note.link);
                        } else {
                            setPdfUrl("");
                        }

                        console.log("Selected topic PDF URL:", note?.link);
                    }}
                    disabled={loadingTopics || topics.length === 0}
                >
                    {/* Placeholder */}
                    <option value="" disabled hidden>
                        {loadingTopics
                            ? "Loading topics..."
                            : topics.length === 0
                                ? "No topics available"
                                : "-- Choose a Topic --"}
                    </option>

                    {topics.map((t, i) => (
                        <option key={i} value={t}>
                            {t}
                        </option>
                    ))}
                </select>



                {/* Quiz Title */}
                <label className="block text-yellow-300 font-medium mb-2">Quiz Title</label>
                <input
                    type="text"
                    placeholder="Enter quiz title"
                    className="w-full mb-4 px-4 py-3 rounded-lg border border-yellow-500/30 bg-zinc-900 text-yellow-100 placeholder-yellow-400 focus:outline-none focus:border-yellow-400 transition"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                />
                <label className="block text-yellow-300 font-medium mb-2">Number of Questions</label>
                <input
                    type="number"
                    min="1"
                    max="50"
                    className="w-full mb-4 px-4 py-3 rounded-lg border border-yellow-500/30 bg-zinc-900 text-yellow-100 focus:outline-none focus:border-yellow-400 transition"
                    value={form.numQuestions || 5}
                    onChange={(e) => handleChange("numQuestions", e.target.value)}
                />
                {/* Total Marks */}
                <label className="block text-yellow-300 font-medium mb-2">Total Marks</label>
                <input
                    type="number"
                    min="10"
                    max="200"
                    className="w-full mb-4 px-4 py-3 rounded-lg border border-yellow-500/30 bg-zinc-900 text-yellow-100 focus:outline-none focus:border-yellow-400 transition"
                    value={form.totalMarks}
                    onChange={(e) => handleChange("totalMarks", e.target.value)}
                />

                {/* Difficulty */}
                <label className="block text-yellow-300 font-medium mb-2">Difficulty</label>
                <select
                    className="w-full mb-4 px-4 py-3 rounded-lg border border-yellow-500/30 bg-zinc-900 text-yellow-100 focus:outline-none focus:border-yellow-400 transition"
                    value={form.difficulty}
                    onChange={(e) => handleChange("difficulty", e.target.value)}
                >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                {/* Time Per Question */}
                <label className="block text-yellow-300 font-medium mb-2">Time Per Question (seconds)</label>
                <input
                    type="number"
                    min="10"
                    max="300"
                    className="w-full mb-4 px-4 py-3 rounded-lg border border-yellow-500/30 bg-zinc-900 text-yellow-100 focus:outline-none focus:border-yellow-400 transition"
                    value={form.timePerQuestion}
                    onChange={(e) => handleChange("timePerQuestion", e.target.value)}
                />

                {/* Negative Marking */}
                <label className="block text-yellow-300 font-medium mb-2">Negative Marking (points to deduct)</label>
                <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-full mb-6 px-4 py-3 rounded-lg border border-yellow-500/30 bg-zinc-900 text-yellow-100 focus:outline-none focus:border-yellow-400 transition"
                    value={form.negativeMarking}
                    onChange={(e) => handleChange("negativeMarking", e.target.value)}
                />

                {/* Generate Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerate}
                    className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-xl shadow-lg hover:bg-yellow-400 transition"
                >
                    🚀 Generate Quiz with AI
                </motion.button>
            </motion.div>

            {/* Scrollbar style */}
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
