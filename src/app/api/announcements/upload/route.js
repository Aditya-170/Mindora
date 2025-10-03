import connectDB from "@/config/db";
import { RoomAnnouncements } from "@/models/announcementModel";

export async function POST(req) {
  try {
    await connectDB();

    // Parse JSON body
    const body = await req.json();
    const { roomId, userId, topic, body: announcementBody } = body;

    if (!roomId || !userId || !topic || !announcementBody) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create new announcement object
    const newAnnouncement = {
      userId,
      topic,
      body: announcementBody,
      createdAt: new Date(),
    };

    // Find the room
    let room = await RoomAnnouncements.findOne({ roomId });
    if (room) {
      // Append announcement if room exists
      room.announcements.push(newAnnouncement);
    } else {
      // Create new room with the announcement
      room = new RoomAnnouncements({
        roomId,
        announcements: [newAnnouncement],
      });
    }

    await room.save();

    return new Response(
      JSON.stringify({ message: "Announcement uploaded successfully", room }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
