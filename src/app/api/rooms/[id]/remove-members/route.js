import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/models/roomModel";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } =await params;
    const { members: membersToRemove } = await req.json();

    if (!membersToRemove || !Array.isArray(membersToRemove) || membersToRemove.length === 0) {
      return NextResponse.json({ error: "No members selected" }, { status: 400 });
    }

    const room = await Room.findById(id);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

   

    // Remove selected members from the room
    room.members = room.members.filter((m) => !membersToRemove.includes(m));
    room.currentMembers = room.members.length ; 

    await room.save();

    return NextResponse.json({ message: "Members removed successfully", removed: membersToRemove }, { status: 200 });
  } catch (err) {
    console.error("Error removing members:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
