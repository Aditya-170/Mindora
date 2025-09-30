import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, unique: true, required: true }, 
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    profileImage: { type: String },

    // Predefined badge types
    badges: [
      {
        type: String,
        enum: [
          "Beginner",
          "Intermediate",
          "Advanced",
          "Quiz Master",
          "Course Completer",
          "Top Performer",
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
