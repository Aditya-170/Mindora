// /app/api/notes/get-short-notes/route.js
import connectDB from "@/config/db";
import { RoomShortNotes } from "@/models/shortNotesModel";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { roomId } = body;

    if (!roomId) {
      return new Response(JSON.stringify({ message: "roomId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const room = await RoomShortNotes.findOne({ roomId });

    if (!room) {
      return new Response(
        JSON.stringify({
          message: "No short notes found for this room",
          shortNotesList: [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ shortNotesList: room.shortNotesList }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Fetch short notes error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
