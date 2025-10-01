import connectDB from "@/config/db";
import { RoomNotes } from "@/models/notesModel";

export async function POST(req) {
  try {
    await connectDB();

    // Parse JSON body
    const body = await req.json();
    const { roomId, topic, uploaderId, link } = body;

    if (!roomId || !topic || !uploaderId || !link) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newNote = { topic, uploaderId, link, date: new Date() };

    let room = await RoomNotes.findOne({ roomId });
    if (room) {
      room.notes.push(newNote);
    } else {
      room = new RoomNotes({ roomId, notes: [newNote] });
    }

    await room.save();

    return new Response(JSON.stringify({ message: "Note uploaded successfully", room }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
