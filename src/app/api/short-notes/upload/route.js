// /app/api/notes/generate-short-notes/route.js
import connectDB from "@/config/db";
import { RoomShortNotes } from "@/models/shortNotesModel";

export async function POST(req) {
  try {
    await connectDB();

    // Parse JSON body
    const body = await req.json();
    const { roomId, topic, shortNotes } = body;

    if (!roomId || !topic || !shortNotes) {
      return new Response(
        JSON.stringify({ message: "roomId, topic, and shortNotes are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newShortNote = { topic, shortNotes, generatedAt: new Date() };

    let room = await RoomShortNotes.findOne({ roomId });
    if (room) {
      room.shortNotesList.push(newShortNote);
    } else {
      room = new RoomShortNotes({ roomId, shortNotesList: [newShortNote] });
    }

    await room.save();

    return new Response(
      JSON.stringify({ message: "Short notes saved successfully", room }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Short notes save error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
