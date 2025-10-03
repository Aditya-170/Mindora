// app/api/rooms/[roomId]/start-voice/route.js
import { NextResponse } from "next/server";
import  connectDB  from "@/lib/db";
import roomModel from "@/models/roomModel";


export async function POST(req, { params }) {
  await connectDB();

  try {
    const { userId } = await req.json();

    const room = await roomModel.findById(params.id);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.voiceActive) {
      return NextResponse.json({ error: "Voice chat already active" }, { status: 400 });
    }

    room.voiceActive = true;
    room.voiceHost = userId;
    await room.save();

    return NextResponse.json({ message: "Voice chat started", room }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to start voice chat" }, { status: 500 });
  }
}
