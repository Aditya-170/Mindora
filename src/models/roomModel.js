// models/Room.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true }, // Clerk userId
    text: { type: String, default: "" },
    imageUrl: { type: String, default: "" }, // Cloudinary link
    pdfUrl: { type: String, default: "" }, // Supabase link
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Room name
    owner: { type: String, required: true },
    image: { type: String, default: "" }, // Room banner/icon
    description: { type: String, required: true, minlength: 10, maxlength: 200 },
    createdBy: { type: String, required: true }, // Clerk userId of room creator
    members: [{ type: String }], // Clerk userIds
    currentMembers: { type: Number, default: 1 }, // Room creator counts as 1
    maxMembers: { type: Number, required: true }, // Set by room owner

    // Messages & shared resources
    messages: [messageSchema],

    // 🔊 Voice chat fields
    voiceActive: { type: Boolean, default: false },
    voiceHost: { type: String, default: null }, // Clerk userId of host
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
