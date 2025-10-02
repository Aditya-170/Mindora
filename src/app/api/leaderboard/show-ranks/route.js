import connectDB from "@/config/db";
import { RoomLeaderboard } from "@/models/leaderModel";
import userModel from "@/models/userModel";

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

    // Find leaderboard for this room
    const roomLeaderboard = await RoomLeaderboard.findOne({ roomId });

    if (!roomLeaderboard) {
      return new Response(
        JSON.stringify({ message: "No leaderboard found for this room" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Flatten users across all quizzes and sum scores
    const userScores = {};

    roomLeaderboard.quizzes.forEach((quiz) => {
      quiz.users.forEach((user) => {
        if (!userScores[user.clerkId]) userScores[user.clerkId] = 0;
        userScores[user.clerkId] += user.totalScore;
      });
    });

    // Get all unique clerkIds
    const clerkIds = Object.keys(userScores);
    // console.log("clerkIds", clerkIds);
    // Fetch users from User model
    const users = await userModel
      .find({ clerkId: { $in: clerkIds } })
      .select("clerkId firstName lastName");
    // console.log(
    //   "in db users",
    //   users.map((u) => u.clerkId)
    // );
    // Map names to scores
    // Map names to scores
    // console.log("users", users);

    const leaderboard = clerkIds
      .map((clerkId) => {
        const user = users.find((u) => u.clerkId === clerkId);
        let name = "Unknown";
        if (user) {
          name = user.firstName + (user.lastName ? " " + user.lastName : "");
        }
        return {
          clerkId,
          name,
          totalScore: userScores[clerkId],
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore);

    return new Response(
      JSON.stringify({
        message: "Leaderboard retrieved",
        leaderboard,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Get Leaderboard Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
