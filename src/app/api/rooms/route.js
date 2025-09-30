// app/api/rooms/route.js

import connectDB from "@/lib/db";
import roomModel from "@/models/roomModel";

export async function GET() {
  try {
    await connectDB();
    const rooms = await roomModel.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(rooms), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch rooms" }), { status: 500 });
  }
}
