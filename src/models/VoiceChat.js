import mongoose from "mongoose";

const VoiceChatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: String }], // userIds
  voiceActive: { type: Boolean, default: false },
  voiceHost: { type: String, default: null }, // userId of the host
});

export default mongoose.models.VoiceChat || mongoose.model("VoiceChat", VoiceChatSchema);
