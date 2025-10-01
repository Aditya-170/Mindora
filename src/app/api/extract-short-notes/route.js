import axios from "axios";

// Utility: split text into chunks
function splitIntoChunks(text, chunkSize = 3000) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start += chunkSize;
  }
  return chunks;
}

// Utility: call Gemini with a text prompt
async function callGemini(prompt) {
  const geminiRes = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { contents: [{ parts: [{ text: prompt }] }] },
    { headers: { "Content-Type": "application/json" } }
  );

  const botText =
    geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Only use text part
  return botText.trim();
}

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text)
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
      });

    // 1️⃣ Split text into chunks
    const chunks = splitIntoChunks(text, 3000);

    // 2️⃣ Summarize each chunk
    const chunkSummaries = [];
    for (const chunk of chunks) {
      const prompt = `
You are an expert assistant creating short notes from a large text. 

Instructions for this chunk:
- Extract only **key points**, **important facts**, **formulas**, or **examples**.
- Use **bullet points or numbered lists**.
- Avoid introductions, filler sentences, or verbose explanations.
- Keep the notes concise, but preserve all important details for study.

Chunk text:
${chunk}
      
Provide the output as plain text with bullets or numbering.
      `;

      const summary = await callGemini(prompt);
      chunkSummaries.push(summary);
    }

    // 3️⃣ Combine all chunk summaries
    const combinedSummary = chunkSummaries.join("\n");

    // 4️⃣ Refine the final summary
    const finalPrompt = `
You are an expert assistant creating final short notes from combined summaries of a large text.

Instructions:
- Merge and organize all points from the combined summaries.
- Remove duplicates, redundant sentences, or trivial details.
- Structure notes clearly with bullets, numbering, or headings.
- Bold the headings 
- Keep the notes concise but detailed enough for studying.
- Do not write an introduction or conclusion.
- Aim to cover **all main topics**, even if the original text is very long.

Combined summaries:
${combinedSummary}

Provide the output as plain text.
    `;

    const finalSummary = await callGemini(finalPrompt);

    return new Response(
      JSON.stringify({
        finalSummary,
        chunkSummaries,
        numChunks: chunks.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(
      "Summarization Gemini API Error:",
      err.response?.data || err.message
    );
    return new Response(JSON.stringify({ error: "Failed to summarize text" }), {
      status: 500,
    });
  }
}
