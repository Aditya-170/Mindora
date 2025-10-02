import connectDB from "@/config/db";
import { RoomNotes } from "@/models/notesModel";

export async function POST(req) {
  try {
    await connectDB();

    // Parse body
    const body = await req.json();
    const { roomId } = body;

    if (!roomId) {
      return new Response(
        JSON.stringify({ message: "roomId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const room = await RoomNotes.findOne({ roomId }).lean();

    if (!room || !room.notes.length) {
      return new Response(
        JSON.stringify({ message: "No notes found for this room" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, notes: room.notes }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Fetch error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
