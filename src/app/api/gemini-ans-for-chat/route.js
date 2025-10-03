import axios from "axios";

async function callGemini(prompt) {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const answer = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return answer.trim();
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    return "Sorry, I couldn't fetch an answer.";
  }
}

export async function POST(req) {
  try {
    const { question } = await req.json();
    if (!question) {
      return new Response(
        JSON.stringify({ error: "No question provided" }),
        { status: 400 }
      );
    }

    const prompt = `
You are an expert assistant. Answer the following question clearly and concisely:
you should return the ans in max 10 lines. But you should always try to be short
Question:
${question}

Answer:
`;

    const answer = await callGemini(prompt);

    return new Response(
      JSON.stringify({ answer }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error in /api/ask:", err.message);
    return new Response(
      JSON.stringify({ error: "Failed to get answer" }),
      { status: 500 }
    );
  }
}
