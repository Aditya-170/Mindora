// /app/api/leaderboard/get-score/route.js
import connectDB from "@/config/db";
import { RoomLeaderboard } from "@/models/leaderModel";

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
    console.log("debug 1");
    // Find the leaderboard document for this room
    const roomLeaderboard = await RoomLeaderboard.findOne({ roomId });
    if (!roomLeaderboard) {
      return new Response(JSON.stringify({ error: "Room not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    // console.log("debug 2");
    // Find the specific quiz in this room
    // console.log("quizID", quizId);
    const quiz = roomLeaderboard.quizzes.find(
      (q) => q.quizId.toString() === quizId
    );
    // console.log("quiz after filtering", quiz);
    if (!quiz) {
      return new Response(
        JSON.stringify({ error: "Quiz not found in this room" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    // console.log("debug 3");
    // Find the user's score in this quiz
    // console.log("quiz", quiz);
    const userEntry = quiz.users.find((u) => u.clerkId === clerkId);
    if (!userEntry) {
      return new Response(
        JSON.stringify({ error: "Score not found for this user" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ message: "Score retrieved", score: userEntry.totalScore }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Get score error:", err);
    return new Response(JSON.stringify({ error: "Failed to retrieve score" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
