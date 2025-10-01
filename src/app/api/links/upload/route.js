import connectDB from "@/config/db";
import { RoomLinks } from "@/models/linkModel";

export async function POST(req) {
  try {
    await connectDB();

    // Parse JSON body
    const body = await req.json();
    const { roomId, topic, uploaderId, url } = body;

    if (!roomId || !topic || !uploaderId || !url) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create new link object
    const newLink = { topic, uploaderId, url, date: new Date() };

    // Find the room
    let room = await RoomLinks.findOne({ roomId });
    if (room) {
      // Append link if room exists
      room.links.push(newLink);
    } else {
      // Create new room with the link
      room = new RoomLinks({ roomId, links: [newLink] });
    }

    await room.save();

    return new Response(
      JSON.stringify({ message: "Link uploaded successfully", room }),
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
