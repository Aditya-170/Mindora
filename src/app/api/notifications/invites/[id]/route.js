// src/app/api/notifications/invites/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Invite from "@/models/invite";
import roomModel from "@/models/roomModel";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = params; // inviteId
    const body = await req.json();
    const { action, userId } = body;

    const invite = await Invite.findById(id);
    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.toUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (action === "accept") {
      invite.status = "accepted";

      // Find the room first
      const room = await roomModel.findById(invite.roomId);
      if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }

      // Add member only if not already present
      if (!room.members.includes(userId)) {
        room.members.push(userId);
        room.currentMembers = room.currentMembers + 1;
        await room.save();
      }
    } else if (action === "reject") {
      invite.status = "rejected";
    }

    await invite.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error updating invite:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
