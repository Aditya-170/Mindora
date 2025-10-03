// app/api/rooms/[roomId]/end-voice/route.js
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

// import Room from "@/models/Room";

export async function POST(req, { params }) {
  await connectDB();

  try {
    const room = await roomModel.findById(params.id);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    room.voiceActive = false;
    room.voiceHost = null;
    await room.save();

    return NextResponse.json({ message: "Voice chat ended", room }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to end voice chat" }, { status: 500 });
  }
}
