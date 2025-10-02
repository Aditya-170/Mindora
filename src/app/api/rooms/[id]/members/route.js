import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/models/roomModel";
import User from "@/models/userModel";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; 

    const room = await Room.findById(id).lean();
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Fetch owner details
    const ownerUser = await User.findOne({ clerkId: room.owner }).lean();

    // Fetch members details
    const members = await User.find({ clerkId: { $in: room.members } }).lean();

    return NextResponse.json(
      {
        
        members: members.map((m) => ({
          clerkId: m.clerkId,
          name: `${m.firstName} ${m.lastName || ""}`.trim(),
          email: m.email,
          profileImage: m.profileImage,
        })),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching members:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
