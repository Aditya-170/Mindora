// src/app/api/notifications/requests/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Request from "@/models/joinRequest";
import roomModel from "@/models/roomModel";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = params; // requestId
    const body = await req.json();
    const { action, userId } = body;

    const request = await Request.findById(id);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Ensure only owner can handle
    if (request.toOwnerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (action === "accept") {
      request.status = "accepted";

      // Add requesting user to room
      await roomModel.findByIdAndUpdate(request.roomId, {
        $addToSet: { members: request.fromUserId },
      });
    } else if (action === "reject") {
      request.status = "rejected";
    }

    await request.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error updating request:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
