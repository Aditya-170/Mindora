import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/models/roomModel";
import Request from "@/models/joinRequest";
import userModel from "@/models/userModel";
import { sendEmail } from "@/lib/mailer";

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

    const existing = await Request.findOne({ roomId, fromUserId, status: "pending" });
    if (existing) {
      return NextResponse.json({ error: "Request already sent" }, { status: 400 });
    }

    const newRequest = new Request({
      roomId,
      fromUserId,
      toOwnerId: room.createdBy,
    });
    await newRequest.save();

    // ✅ Send email to owner
    const owner = await userModel.findOne({ clerkId: room.createdBy });
    if (owner?.email) {
      await sendEmail({
        to: owner.email,
        subject: "New join request for your study room",
        text: `A new user has requested to join your room: ${room.name}.`,
        html: `<p>A new user has requested to join <strong>${room.name}</strong>.</p>
               <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/notifications">View Requests</a></p>`,
      });
    }

    return NextResponse.json({ message: "Join request sent", request: newRequest }, { status: 201 });
  } catch (err) {
    console.error("Error creating join request:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
