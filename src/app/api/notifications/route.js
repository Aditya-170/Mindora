// src/app/api/invites/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Invite from "@/models/invite";
import roomModel from "@/models/roomModel";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch invites for this user where status is pending
    const invites = await Invite.find({ toUserId: userId, status: "pending" });

    // Include room details
    const result = await Promise.all(
      invites.map(async (invite) => {
        const room = await roomModel.findById(invite.roomId);
        return {
          inviteId: invite._id,
          roomId: invite.roomId,
          roomName: room?.name,
          roomImage: room?.image,
          roomOwner: room?.owner,
          fromUserId: invite.fromUserId,
          status: invite.status,
        };
      })
    );

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error fetching invites:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
