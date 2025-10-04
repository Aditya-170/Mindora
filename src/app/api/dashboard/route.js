import connectDB from "@/lib/db";
import roomModel from "@/models/roomModel";
import Request from "@/models/joinRequest";
import { NextResponse } from "next/server";
import invite from "@/models/invite";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // ✅ Total rooms created
    const createdRooms = await roomModel.find({ createdBy: userId });
    const totalCreated = createdRooms.length;

    // ✅ Total rooms joined (member but not owner)
    const joinedRooms = await roomModel.find({
      members: userId,
      createdBy: { $ne: userId },
    });
    const totalJoined = joinedRooms.length;

    // ✅ Total room join requests (sent by this user)
    const totalRequests = await Request.countDocuments({ senderId: userId });

    // ✅ Total invitations (received by this user)
    const totalInvitations = await invite.countDocuments({ receiverId: userId });

    // ✅ Rooms created per month
    const createdPerMonth = await roomModel.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // ✅ Rooms joined per month
    const joinedPerMonth = await roomModel.aggregate([
      { $match: { members: userId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    return NextResponse.json({
      totalCreated,
      totalJoined,
      totalRequests,
      totalInvitations,
      createdPerMonth,
      joinedPerMonth,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
