import connectDB from "@/config/db";
import { RoomAnnouncements } from "@/models/announcementModel";
import userModel from "@/models/userModel";

export async function POST(req) {
  try {
    await connectDB();

    // Parse JSON body
    const body = await req.json();
    const { roomId } = body;

    if (!roomId) {
      return new Response(JSON.stringify({ message: "roomId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find the room
    const room = await RoomAnnouncements.findOne({ roomId });

    if (!room || !room.announcements.length) {
      return new Response(
        JSON.stringify({
          message: "No announcements found",
          announcements: [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sort announcements by createdAt descending
    const sortedAnnouncements = room.announcements.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    // Populate uploader's name using clerkId
    const announcementsWithUploader = await Promise.all(
      sortedAnnouncements.map(async (ann) => {
        const user = await userModel
          .findOne({ clerkId: ann.userId }) // <-- use clerkId here
          .select("firstName lastName");

        return {
          _id: ann._id,
          topic: ann.topic,
          body: ann.body,
          createdAt: ann.createdAt,
          userId: ann.userId,
          uploaderName: user ? `${user.firstName} ${user.lastName}` : "Unknown",
        };
      })
    );

    return new Response(
      JSON.stringify({ announcements: announcementsWithUploader }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Fetch announcements error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
