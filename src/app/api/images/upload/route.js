import connectDB from "@/config/db";
import { RoomImages } from "@/models/imageModel";

export async function POST(req) {
  try {
    await connectDB();

    // Parse JSON body
    const body = await req.json();
    const { roomId, topic, uploaderId, link } = body;

    if (!roomId || !topic || !uploaderId || !link) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create new image object
    const newImage = { topic, uploaderId, link, date: new Date() };

    // Find the room
    let room = await RoomImages.findOne({ roomId });
    if (room) {
      // Append image if room exists
      room.images.push(newImage);
    } else {
      // Create new room with the image
      room = new RoomImages({ roomId, images: [newImage] });
    }

    await room.save();

    return new Response(
      JSON.stringify({ message: "Image uploaded successfully", room }),
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
