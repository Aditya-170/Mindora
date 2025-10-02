"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Doughnut, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useUser } from "@clerk/nextjs";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function AttemptQuiz({ roomId }) {
    const { user } = useUser();
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);
    const [scoreData, setScoreData] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    const [quizScores, setQuizScores] = useState({});
    const [viewingQuiz, setViewingQuiz] = useState(null);

    // -----------------
    // FETCH QUIZZES & SCORES
    // -----------------
    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!user?.id) return;

            try {
                const res = await fetch("/api/quiz/show-quiz", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ roomId }),
                });
                const data = await res.json();
                if (data.success) {
                    setQuizzes(data.quizzes);

                    const scorePromises = data.quizzes.map(async (quiz) => {
                        if (quiz.attemptedBy.includes(user.id)) {
                            const resScore = await fetch("/api/quiz/get-individual-score", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    roomId,
                                    quizId: quiz._id,
                                    clerkId: user.id,
                                }),
                            });
                            const scoreData = await resScore.json();
                            if (scoreData && typeof scoreData.score === "number") {
                                return { quizId: quiz._id, score: scoreData.score };
                            }
                        }
                        return null;
                    });

                    const results = await Promise.all(scorePromises);
                    const scores = {};
                    results.forEach((res) => {
                        if (res) scores[res.quizId] = res.score;
                    });
                    setQuizScores(scores);
                }
            } catch (err) {
                console.error("Error fetching quizzes:", err);
            }
        };

        fetchQuizzes();
    }, [roomId, user]);

    // -----------------
    // START QUIZ (initialize score = 0 + attempt status)
    // -----------------
    const startQuiz = async (quiz) => {
        try {
            // Set initial score = 0 in DB
            await fetch("/api/leaderboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId,
                    quizId: quiz._id,
                    clerkId: user.id,
                    score: 0,
                }),
            });

            // Mark user as attempted
            await fetch("/api/quiz/update-user-attempt-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId,
                    quizId: quiz._id,
                    clerkId: user.id,
                }),
            });
        } catch (err) {
            console.error("Error initializing quiz attempt:", err);
        }

        setSelectedQuiz(quiz);
        setSelectedOptions(Array(quiz.questions.length).fill(null));
        setCurrentQ(0);
        setShowSummary(false);
        setShowAnswers(false);
        setScoreData(0);
        setViewingQuiz(null);
    };

    // -----------------
    // QUIZ TIMER
    // -----------------
    useEffect(() => {
        if (!selectedQuiz || showSummary || showAnswers) return;

        const currentQuestion = selectedQuiz.questions[currentQ];
        setTimeLeft(selectedQuiz.timePerQuestion || 30);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleNext();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQ, selectedQuiz, showSummary, showAnswers]);

    // -----------------
    // QUIZ NAVIGATION
    // -----------------
    const handleNext = async () => {
        if (currentQ < selectedQuiz.questions.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            // Final submission
            const score = selectedQuiz.questions.reduce((acc, q, i) => {
                if (selectedOptions[i] === q.correct) {
                    return acc + selectedQuiz.totalMarks / selectedQuiz.totalQuestions;
                } else if (selectedOptions[i] !== null) {
                    return acc - (selectedQuiz.negativeMarking || 0);
                }
                return acc;
            }, 0);

            try {
                // Update final score in DB
                await fetch("/api/leaderboard", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        roomId,
                        quizId: selectedQuiz._id,
                        clerkId: user.id,
                        score: score,
                    }),
                });

                setScoreData(score);
                setShowSummary(true);
            } catch (err) {
                console.error("Error submitting quiz:", err);
            }
        }
    };

    const handleOptionSelect = (index) => {
        const updated = [...selectedOptions];
        updated[currentQ] = index;
        setSelectedOptions(updated);
    };

    const toggleAnswers = () => setShowAnswers(true);
    const backToChart = () => setShowAnswers(false);
    // Count correct, wrong, unattempted
    // Count correct, wrong, unattempted safely
    const correct = selectedQuiz?.questions?.reduce((acc, q, i) => {
        return acc + (selectedOptions[i] === q.correct ? 1 : 0);
    }, 0) ?? 0;

    const wrong = selectedQuiz?.questions?.reduce((acc, q, i) => {
        return acc + (selectedOptions[i] !== null && selectedOptions[i] !== q.correct ? 1 : 0);
    }, 0) ?? 0;

    const unattempted = selectedQuiz?.questions?.reduce((acc, q, i) => {
        return acc + (selectedOptions[i] === null ? 1 : 0);
    }, 0) ?? 0;

    const chartData = {
        labels: ["Correct", "Wrong", "Unattempted"],
        datasets: [
            {
                data: [correct, wrong, unattempted], // these are counts
                backgroundColor: ["#22c55e", "#ef4444", "#eab308"], // green, red, yellow
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "white",
                },
            },
            datalabels: {
                color: "white",
                font: {
                    weight: "bold",
                    size: 14,
                },
                formatter: (value, context) => {
                    return value; // show count directly
                },
            },
        },
    };


    // -----------------
    // QUIZ LIST
    // -----------------
    if (!selectedQuiz && !viewingQuiz) {
        return (
            <div className="p-6 text-yellow-100">
                <h2 className="text-2xl font-bold mb-6 text-yellow-400">Available Quizzes</h2>
                <div className="flex flex-col gap-4">
                    {quizzes.map((quiz) => {
                        const attempted = quiz.attemptedBy.includes(user?.id);
                        return (
                            <motion.div
                                key={quiz._id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-zinc-800 p-6 rounded-xl border border-yellow-500/30 shadow-md flex justify-between items-center"
                            >
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-semibold text-yellow-300">{quiz.title}</h3>
                                    <p className="text-sm text-yellow-200 mt-1">
                                        <span className="font-semibold">Topic:</span> {quiz.topic} |{" "}
                                        <span className="font-semibold">Difficulty:</span> {quiz.difficulty}
                                    </p>
                                    <p className="text-sm text-yellow-200 mt-1">
                                        <span className="font-semibold">Total Questions:</span> {quiz.totalQuestions} |{" "}
                                        <span className="font-semibold">Marks:</span> {quiz.totalMarks}
                                    </p>
                                </div>

                                <div className="ml-6 flex items-center gap-4">
                                    {attempted && quizScores[quiz._id] !== undefined && (
                                        <span className="text-green-400 font-semibold">
                                            Score: {quizScores[quiz._id]} / {quiz.totalMarks}
                                        </span>
                                    )}

                                    <button
                                        onClick={attempted ? () => setViewingQuiz(quiz) : () => startQuiz(quiz)}
                                        className={`px-6 py-2 rounded-lg font-semibold transition
                                            ${attempted ? "bg-blue-500 text-black hover:bg-blue-400" : "bg-yellow-500 text-black hover:bg-yellow-400"}`}
                                    >
                                        {attempted ? "View Questions" : "Attempt Quiz"}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // -----------------
    // ATTEMPT QUIZ UI
    // -----------------
    if (selectedQuiz) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-yellow-100">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-3xl bg-zinc-800 border border-yellow-500/30 rounded-2xl p-8 shadow-xl shadow-yellow-500/10"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-yellow-400">{selectedQuiz.title}</h2>
                            <p className="text-yellow-300 text-sm">
                                Topic: {selectedQuiz.topic} | Difficulty: {selectedQuiz.difficulty}
                            </p>
                        </div>
                    </div>

                    {!showSummary && !showAnswers ? (
                        <>
                            {/* Question display */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-semibold text-yellow-300 mb-4">
                                        Q{currentQ + 1}. {selectedQuiz.questions[currentQ].question}
                                    </h3>
                                    <span className="text-yellow-200 font-semibold">
                                        Time Left: {timeLeft}s
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {selectedQuiz.questions[currentQ].options.map((opt, i) => (
                                        <motion.button
                                            key={i}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => handleOptionSelect(i)}
                                            className={`text-left px-4 py-3 rounded-lg border transition
                                                ${selectedOptions[currentQ] === i
                                                    ? "bg-blue-500 text-black border-blue-400"
                                                    : "bg-zinc-900 border-yellow-500/30 text-yellow-100"}`}
                                        >
                                            {opt}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-semibold hover:bg-yellow-400 transition"
                                >
                                    {currentQ === selectedQuiz.questions.length - 1 ? "Submit" : "Next"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* SHOW SUMMARY / SCORE */}
                            <div className="flex flex-col items-center gap-6 mb-6">
                                <div className="w-64 h-64">
                                    <Pie data={chartData} options={chartOptions} />

                                </div>

                                <h3 className="text-2xl font-bold text-yellow-400">
                                    Your Score: {scoreData ?? 0} / {selectedQuiz?.totalMarks ?? 0}
                                </h3>

                                <button
                                    onClick={toggleAnswers}
                                    className="px-6 py-3 mt-2 bg-yellow-500 text-black rounded-xl font-semibold hover:bg-yellow-400 transition"
                                >
                                    View Questions & Answers
                                </button>
                            </div>

                            {showAnswers && (
                                <div className="max-h-[400px] overflow-y-auto custom-scroll flex flex-col gap-4">
                                    {selectedQuiz.questions.map((q, i) => (
                                        <div key={i}>
                                            <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                                                Q{i + 1}. {q.question}
                                            </h3>
                                            <div className="flex flex-col gap-2">
                                                {q.options.map((opt, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`px-4 py-2 rounded-lg border ${idx === q.correct
                                                            ? "bg-green-700 border-green-400 text-black"
                                                            : "bg-zinc-900 border-yellow-500/30 text-yellow-100"}`}
                                                    >
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex justify-center mt-4">
                                        <button
                                            onClick={backToChart}
                                            className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-semibold hover:bg-yellow-400 transition"
                                        >
                                            Back to Summary
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </div>
        );
    }

    // -----------------
    // VIEW ATTEMPTED QUIZ QUESTIONS & ANSWERS
    // -----------------
    if (viewingQuiz) {
        return (
            <div className="p-6 text-yellow-100 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">{viewingQuiz.title} - Questions & Answers</h2>
                <div className="max-w-4xl w-full bg-zinc-900 p-6 rounded-xl border border-yellow-500/30 flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                    {viewingQuiz.questions.map((q, i) => (
                        <div key={i}>
                            <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                                Q{i + 1}. {q.question}
                            </h3>
                            <div className="flex flex-col gap-2">
                                {q.options.map((opt, idx) => (
                                    <div
                                        key={idx}
                                        className={`px-4 py-2 rounded-lg border ${idx === q.correct
                                            ? "bg-green-700 border-green-400 text-black"
                                            : "bg-zinc-900 border-yellow-500/30 text-yellow-100"}`}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setViewingQuiz(null)}
                    className="mt-4 px-6 py-3 bg-yellow-500 text-black rounded-xl font-semibold hover:bg-yellow-400 transition"
                >
                    Close
                </button>
            </div>
        );
    }

    return null;
}
