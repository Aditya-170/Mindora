// /app/api/notes/process-short-notes/route.js
import axios from "axios";

export async function POST(req) {
  try {
    console.log("step11");
    const body = await req.json();
    const { pdfUrl, topic, roomId } = body;
    // console.log(pdfUrl, topic, roomId);
    if (!pdfUrl || !topic || !roomId) {
      return new Response(
        JSON.stringify({ message: "pdfUrl, topic, and roomId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log("step1");
    // 1️⃣ Call Flask server to extract text
    const extractRes = await axios.post(`${process.env.FLASK_URL}/extract-pdf`, {
      url: pdfUrl,
    });
    if (!extractRes.data?.text) {
      return new Response(
        JSON.stringify({ message: "Failed to extract text from PDF" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const extractedText = extractRes.data.text;
    console.log("step2");
    // 2️⃣ Call summary API (Gemini-based)
    const summaryRes = await axios.post(
      `${process.env.NEXTJS_URL}/api/extract-short-notes`,
      { text: extractedText }
    );
    if (!summaryRes.data?.finalSummary) {
      return new Response(
        JSON.stringify({ message: "Failed to generate short notes" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const shortNotes = summaryRes.data.finalSummary;
    console.log("step3");
    // 3️⃣ Save to DB via existing short-notes/upload API
    try {
       await axios.post(`${process.env.NEXTJS_URL}/api/short-notes/upload`, {
        roomId,
        topic,
        shortNotes,
      });
      // We don’t block on the response; if saving fails, frontend can handle
    } catch (saveErr) {
      console.error("Failed to save short notes:", saveErr.message || saveErr);
      // Optional: continue without failing the request
    }
    console.log("step4");
    // 4️⃣ Return generated short notes to frontend
    return new Response(JSON.stringify({ topic, roomId, shortNotes }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Process short notes error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
