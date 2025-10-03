// app/api/dashboard/route.js
import connectDB from "@/lib/db";
import roomModel from "@/models/roomModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // ✅ Total created
    const createdRooms = await roomModel.find({ createdBy: userId });
    const totalCreated = createdRooms.length;

    // ✅ Total joined (member but not owner)
    const joinedRooms = await roomModel.find({
      members: userId,
      createdBy: { $ne: userId },
    });
    const totalJoined = joinedRooms.length;

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
    // Assuming you keep `joinedAt` for members (if not, fallback needed)
    const joinedPerMonth = await roomModel.aggregate([
      { $match: { members: userId } },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Approx using room's creation date
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    return NextResponse.json({
      totalCreated,
      totalJoined,
      createdPerMonth,
      joinedPerMonth,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
