// app/api/rooms/create/route.js
import connectDB from "@/lib/db";
import roomModel from "@/models/roomModel";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, owner, image, description, maxMembers,userId } = body;

    if (!name || !description || !maxMembers) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }


    const newRoom = await roomModel.create({
      name,
      owner,
      image,
      description,
      createdBy: userId,
      members: [userId],
      currentMembers: 1,
      maxMembers,
    });

    return new Response(JSON.stringify(newRoom), { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return new Response(JSON.stringify({ error: "Failed to create room" }), { status: 500 });
  }
}
