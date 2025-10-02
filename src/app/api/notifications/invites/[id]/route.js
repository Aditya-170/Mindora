// src/app/api/notifications/invites/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Invite from "@/models/invite";
import roomModel from "@/models/roomModel";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params; // inviteId
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

      // Add user to room members
      await roomModel.findByIdAndUpdate(invite.roomId, {
        $addToSet: { members: userId },
      });
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
