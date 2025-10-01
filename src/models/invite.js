// models/Invite.js
import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },        // Room from which invite comes
    toUserId: { type: String, required: true },      // Clerk user ID of the invited user
    fromUserId: { type: String, required: true },    // Who sent the invite (room creator or member)
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Invite || mongoose.model("Invite", inviteSchema);
