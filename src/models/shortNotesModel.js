import mongoose from "mongoose";

const shortNoteSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  shortNotes: { type: String, default: "" }, // Generated short notes text
  generatedAt: { type: Date, default: Date.now },
});

const roomShortNotesSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  shortNotesList: [shortNoteSchema], // Array of short notes per topic
});

export const RoomShortNotes =
  mongoose.models.RoomShortNotes ||
  mongoose.model("RoomShortNotes", roomShortNotesSchema);
