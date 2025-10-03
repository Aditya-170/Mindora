// app/api/rooms/[roomId]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import roomModel from "@/models/roomModel";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const room = await roomModel.findById(id).lean();
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room, { status: 200 });
  } catch (err) {
    console.error("Error fetching room:", err);
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 });
  }
}
