// models/RoomQuizzes.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true, validate: v => v.length === 4 },
  correct: { type: Number, required: true, min: 0, max: 3 },
}, { _id: false });

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  timePerQuestion: { type: Number, required: true },
  totalQuestions : {type :Number , required:true , default:5},
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  negativeMarking: { type: Number, default: 0 },
  questions: [questionSchema],
  createdBy: { type: String, required: true }, // Clerk userId
  attemptedBy: { type: [String], default: [] }, // Clerk userIds who attempted
  createdAt: { type: Date, default: Date.now },
}, { _id: true }); // Each quiz will have its own _id

const roomQuizzesSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  quizzes: [quizSchema],
});

export const RoomQuizzes = mongoose.models.RoomQuizzes || mongoose.model("RoomQuizzes", roomQuizzesSchema);
