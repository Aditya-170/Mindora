// /app/api/notes/process-short-notes/route.js
import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const { pdfUrl, topic, roomId } = body;

    if (!pdfUrl || !topic || !roomId) {
      return new Response(
        JSON.stringify({ message: "pdfUrl, topic, and roomId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1️⃣ Call Flask server to extract text
    const extractRes = await axios.post("http://localhost:5000/extract-pdf", { url: pdfUrl });
    if (!extractRes.data?.text) {
      return new Response(
        JSON.stringify({ message: "Failed to extract text from PDF" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const extractedText = extractRes.data.text;

    // 2️⃣ Call summary API (Gemini-based)
    const summaryRes = await axios.post("http://localhost:3000/api/extract-short-notes", { text: extractedText });
    if (!summaryRes.data?.finalSummary) {
      return new Response(
        JSON.stringify({ message: "Failed to generate short notes" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const shortNotes = summaryRes.data.finalSummary;

    // 3️⃣ Save to DB via existing short-notes/upload API
    try {
      await axios.post("http://localhost:3000/api/short-notes/upload", {
        roomId,
        topic,
        shortNotes,
      });
      // We don’t block on the response; if saving fails, frontend can handle
    } catch (saveErr) {
      console.error("Failed to save short notes:", saveErr.message || saveErr);
      // Optional: continue without failing the request
    }

    // 4️⃣ Return generated short notes to frontend
    return new Response(
      JSON.stringify({ topic, roomId, shortNotes }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Process short notes error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
