// /app/api/notes/create-room-quiz/route.js
import axios from "axios";
import { RoomQuizzes } from "@/models/quizModel";


// Utility to call Gemini
async function callGemini(prompt) {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { contents: [{ parts: [{ text: prompt }] }] },
    { headers: { "Content-Type": "application/json" } }
  );

  return res.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Utility to safely parse JSON from Gemini
function safeParseJSON(output) {
  try {
    return JSON.parse(output);
  } catch {
    const match = output.match(/\[.*\]/s);
    if (match) return JSON.parse(match[0]);
    const codeBlock = output.match(/```json([\s\S]*?)```/);
    if (codeBlock) return JSON.parse(codeBlock[1].trim());
    throw new Error("Invalid JSON from Gemini");
  }
}

// POST API
export async function POST(req) {
  try {
    const {
      pdfUrl,
      topic,
      title,
      difficulty = "Medium",
      timePerQuestion = 20,
      negativeMarking = 0,
      totalMarks = 100,
      numQuestions = 5,
      roomId,
      createdBy,
    } = await req.json();
    console.log("pdfurl" , pdfUrl);
    if (!pdfUrl || !topic || !title || !roomId || !createdBy) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1️⃣ Extract text from PDF
    const extractRes = await axios.post("http://localhost:5000/extract-pdf", {
      url: pdfUrl,
    });
    const text = extractRes.data?.text;
    if (!text) {
      return new Response(
        JSON.stringify({ error: "Failed to extract text from PDF" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2️⃣ Generate MCQs from Gemini
    const prompt = `
You are an expert educational assistant.

Task: Generate ${numQuestions} multiple-choice questions (MCQs) from the following text:

${text}

Instructions:
- Each question must have exactly 4 options.
- Indicate the correct option with its index (0-based).
- Questions should be of ${difficulty} difficulty.
- You may also add a few additional questions in your own words, but they must be strictly related to the above text.
- Provide output in JSON array format:
[
  {
    "question": "Question statement here",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": 0
  }
]
- Avoid explanations; only return JSON.
`;

    const geminiOutput = await callGemini(prompt);
    let questions = [];
    try {
      questions = safeParseJSON(geminiOutput);
    } catch (err) {
      console.error("Failed to parse Gemini output:", geminiOutput);
      return new Response(
        JSON.stringify({
          error: "Failed to generate questions. Invalid JSON from Gemini.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3️⃣ Prepare new quiz object
    const newQuiz = {
      title,
      topic,
      totalMarks,
      timePerQuestion,
      totalQuestions: questions.length,
      difficulty,
      negativeMarking,
      questions,
      createdBy,
      attemptedBy: [],
      createdAt: new Date(),
    };

    // 4️⃣ Insert into RoomQuizzes
    let roomQuiz = await RoomQuizzes.findOne({ roomId });
    if (!roomQuiz) {
      roomQuiz = new RoomQuizzes({ roomId, quizzes: [newQuiz] });
    } else {
      roomQuiz.quizzes.push(newQuiz);
    }
    await roomQuiz.save();

    return new Response(
      JSON.stringify({ message: "Quiz created", quiz: newQuiz }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Create quiz error:", err.message || err);
    return new Response(JSON.stringify({ error: "Failed to create quiz" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
