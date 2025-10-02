import connectDB from "@/config/db";
import { RoomQuizzes } from "@/models/quizModel";
export async function POST(req) {
  try {
    await connectDB();

    // Parse request body
    const body = await req.json();
    const { roomId } = body;

    if (!roomId) {
      return new Response(
        JSON.stringify({ message: "roomId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch quizzes for the given room
    const room = await RoomQuizzes.findOne({ roomId }).lean();

    if (!room || !room.quizzes.length) {
      return new Response(
        JSON.stringify({ message: "No quizzes found for this room" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, quizzes: room.quizzes }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Fetch quizzes error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
