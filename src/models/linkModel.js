import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  uploaderId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  url: { type: String, required: true },
});

const roomLinksSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  links: [linkSchema],
});

export const RoomLinks =
  mongoose.models.RoomLinks || mongoose.model("RoomLinks", roomLinksSchema);
