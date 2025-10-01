// src/app/api/notifications/requests/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
// import Request from "@/models/request";
import roomModel from "@/models/roomModel";
import joinRequest from "@/models/joinRequest";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // owner’s userId

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch requests where the logged-in user is the room owner
    const requests = await joinRequest.find({ toOwnerId: userId, status: "pending" });

    const result = await Promise.all(
      requests.map(async (request) => {
        const room = await roomModel.findById(request.roomId);
        return {
          requestId: request._id,
          roomId: request.roomId,
          roomName: room?.name,
          roomImage: room?.image,
          roomOwner: room?.owner,
          fromUserId: request.fromUserId,
          status: request.status,
        };
      })
    );

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error fetching requests:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
