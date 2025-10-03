import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  userId: { type: String, required: true },       // uploader's ID
  topic: { type: String, required: true },        // title / topic
  body: { type: String, required: true },         // content
  createdAt: { type: Date, default: Date.now },   // date + time
});

const roomAnnouncementsSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },  // room reference
  announcements: [announcementSchema],                     // multiple announcements per room
});

// Collection: RoomAnnouncements
export const RoomAnnouncements =
  mongoose.models.RoomAnnouncements ||
  mongoose.model("RoomAnnouncements", roomAnnouncementsSchema);
