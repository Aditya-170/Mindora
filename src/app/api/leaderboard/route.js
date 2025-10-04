import connectDB from "@/config/db";
import { RoomLeaderboard } from "@/models/leaderModel";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { roomId, quizId, clerkId, score } = body;

    if (!roomId || !quizId || !clerkId || score === undefined) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find room leaderboard
    let roomLeaderboard = await RoomLeaderboard.findOne({ roomId });

    if (!roomLeaderboard) {
      // ✅ New room created
      roomLeaderboard = new RoomLeaderboard({
        roomId,
        quizzes: [
          {
            quizId,
            users: [{ clerkId, totalScore: score }],
          },
        ],
      });
      // console.log("checking the first time entry" , roomLeaderboard);
    } else {
      // ✅ Room already exists → check for quiz
      let quiz = roomLeaderboard.quizzes.find((q) => q.quizId.toString() === quizId);
      // console.log("checl for quiz existing" , quiz);
      if (!quiz) {
        // ✅ First time this quiz is added
        roomLeaderboard.quizzes.push({
          quizId,
          users: [{ clerkId, totalScore: score }],
        });
        // console.log("checking if the user actually exist or not")
      } else {
        // ✅ Quiz exists → check for user
        let user = quiz.users.find((u) => u.clerkId === clerkId);
        // console.log("user check for first time" , user);
        if (!user) {
          // ✅ First attempt for this user
          quiz.users.push({ clerkId, totalScore: score });
          // console.log("checking if it is creating a new user or not")
        } else {
          // ✅ Update score (overwrite latest)
          user.totalScore = score;
          // console.log("consoling to check whether it is updating or not");
        }
      }
    }

    await roomLeaderboard.save();

    return new Response(
      JSON.stringify({
        message: "Score saved successfully",
        leaderboard: roomLeaderboard,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Save Score Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
