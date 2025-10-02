import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Invite from "@/models/invite";
import userModel from "@/models/userModel";
import { sendEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    await connectDB();
    const { roomId, email, fromUserId } = await req.json();

    if (!roomId || !email || !fromUserId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const toUser = await userModel.findOne({ email });
    if (!toUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingInvite = await Invite.findOne({ roomId, toUserId: toUser.clerkId, status: "pending" });
    if (existingInvite) {
      return NextResponse.json({ error: "Invite already sent" }, { status: 400 });
    }

    const invite = await Invite.create({
      roomId,
      toUserId: toUser.clerkId,
      fromUserId,
      status: "pending",
    });

    // ✅ Send email notification
    await sendEmail({
      to: email,
      subject: "You’ve been invited to join a study room",
      text: `Hello, you’ve been invited to join a study room. Please check your notifications.`,
      html: `<p>You’ve been invited to join a study room 🎓</p>
             <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/notifications">View Invite</a></p>`,
    });

    return NextResponse.json(invite, { status: 200 });
  } catch (err) {
    console.error("Invite error:", err);
    return NextResponse.json({ error: "Failed to send invite" }, { status: 500 });
  }
}
