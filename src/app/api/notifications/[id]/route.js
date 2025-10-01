import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Invite from "@/models/invite";
import roomModel from "@/models/roomModel";
// import Room from "@/models/Room";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } =await params;
    const { action, userId } = await req.json(); // action = "accept" or "reject"
    console.log("id:", id, "Action:", action, "UserId:", userId);

    if (!id || !action || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Find invite
    const invite = await Invite.findById(id);
    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 400 });
    }

    // Prevent duplicate actions
    if (invite.status !== "pending") {
      return NextResponse.json({ error: "Invite already handled" }, { status: 400 });
    }

    if (action === "accept") {
      // Find the room
      const room = await roomModel.findById(invite.roomId);
      if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 400 });
      }

      // Check maxMembers
      if (room.currentMembers >= room.maxMembers) {
        return NextResponse.json({ error: "Room is full" }, { status: 400 });
      }

      // Add user if not already member
      if (!room.members.includes(userId)) {
        room.members.push(userId);
        room.currentMembers += 1;
        await room.save();
      }

      invite.status = "accepted";
      await invite.save();

      return NextResponse.json({ message: "Invite accepted", room }, { status: 200 });
    }

    if (action === "reject") {
      invite.status = "rejected";
      await invite.save();
      return NextResponse.json({ message: "Invite rejected" }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Error handling invite:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
