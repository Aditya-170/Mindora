import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/models/roomModel";
import Request from "@/models/joinRequest"; 

export async function POST(req) {
  try {
    await connectDB();
    const { roomId, fromUserId } = await req.json();

    if (!roomId || !fromUserId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Prevent duplicate requests
    const existing = await Request.findOne({ roomId, fromUserId, status: "pending" });
    if (existing) {
      return NextResponse.json({ error: "Request already sent" }, { status: 400 });
    }

    const newRequest = new Request({
      roomId,
      fromUserId,
      toOwnerId: room.createdBy, // Room owner
    });
    console.log("owner id:", room.createdBy);

    await newRequest.save();

    return NextResponse.json({ message: "Join request sent", request: newRequest }, { status: 201 });
  } catch (err) {
    console.error("Error creating join request:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
