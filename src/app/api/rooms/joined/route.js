import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/models/roomModel";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await Room.find({
      $or: [{ ownerId: userId }, { members: userId }],
    });

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("Error fetching joined rooms:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
