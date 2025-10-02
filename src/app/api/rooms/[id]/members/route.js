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
    const ownerUser = await User.findOne({ clerkId: room.createdBy }).lean();
    const ownerClerkId = ownerUser?.clerkId || room.owner;

    // Fetch members excluding the owner
    const members = await User.find({
      clerkId: { $in: room.members.filter((m) => m !== ownerClerkId) },
    }).lean();

    return NextResponse.json(
      {
        owner: ownerUser
          ? {
              clerkId: ownerUser.clerkId,
              name: `${ownerUser.firstName} ${ownerUser.lastName || ""}`.trim(),
              email: ownerUser.email,
              profileImage: ownerUser.profileImage,
            }
          : { clerkId: room.owner, name: "Unknown User" },

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
