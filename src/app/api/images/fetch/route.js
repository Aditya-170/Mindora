import connectDB from "@/config/db";
import { RoomImages } from "@/models/imageModel";
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
    const room = await RoomImages.findOne({ roomId });

    if (!room) {
      return new Response(JSON.stringify({ message: "Room not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Map notes to include uploader details
    const imagesWithUploader = await Promise.all(
      room.images.map(async (img) => {
        const user = await userModel.findOne({ clerkId: img.uploaderId });
        return {
          topic: img.topic,
          link: img.link,
          date: img.date,
          uploader: user
            ? {
                name: user.firstName + " " + user.lastName,
                email: user.email,
                id: user.clerkId,
              }
            : null,
        };
      })
    );

    return new Response(JSON.stringify({ images: imagesWithUploader }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Fetch error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
