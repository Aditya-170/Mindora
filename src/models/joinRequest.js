// src/models/request.js
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  fromUserId: { type: String, required: true }, // User who requested
  toOwnerId: { type: String, required: true }, // Room owner
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Request || mongoose.model("Request", requestSchema);
