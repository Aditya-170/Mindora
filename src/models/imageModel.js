import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  uploaderId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  link: { type: String, required: true }, // URL of the uploaded image
});

const roomImagesSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  images: [imageSchema],
});

export const RoomImages =
  mongoose.models.RoomImages || mongoose.model("RoomImages", roomImagesSchema);
