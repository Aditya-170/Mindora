// /app/api/quiz/mark-attempted/route.js
import connectDB from "@/config/db";
import { RoomQuizzes } from "@/models/quizModel";

export async function POST(req) {
  try {
    await connectDB();

    const { roomId, quizId, clerkId } = await req.json();

    if (!roomId || !quizId || !clerkId) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const room = await RoomQuizzes.findOne({ roomId });
    if (!room) {
      return new Response(
        JSON.stringify({ error: "Room or quiz not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const quiz = room.quizzes.find((q) => q._id.toString() === quizId);
    if (!quiz) {
      return new Response(
        JSON.stringify({ error: "Quiz not found in this room" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Add clerkId to attemptedBy if not already present
    if (!quiz.attemptedBy.includes(clerkId)) {
      quiz.attemptedBy.push(clerkId);
      await room.save();
    }

    return new Response(
      JSON.stringify({ message: "User marked as attempted", attemptedBy: quiz.attemptedBy }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Mark attempted error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to mark quiz as attempted" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
