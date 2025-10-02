import mongoose from "mongoose";

const userScoreSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },   // Clerk userId
  totalScore: { type: Number, required: true }, // total score obtained
});

const quizLeaderboardSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "RoomQuizzes" }, 
  users: [userScoreSchema], // array of users with their scores
});

const roomLeaderboardSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true }, 
  quizzes: [quizLeaderboardSchema], // array of quizzes inside this room
});

export const RoomLeaderboard =
  mongoose.models.RoomLeaderboard ||
  mongoose.model("RoomLeaderboard", roomLeaderboardSchema);
