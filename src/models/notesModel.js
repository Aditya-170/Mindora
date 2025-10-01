import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  uploaderId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  link: { type: String, required: true },
});

const roomNotesSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  notes: [noteSchema],
});

export const RoomNotes = mongoose.models.RoomNotes || mongoose.model("RoomNotes", roomNotesSchema);
