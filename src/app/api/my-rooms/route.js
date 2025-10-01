import connectDB from "@/lib/db";
import roomModel from "@/models/roomModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); 
    // console.log("userId:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await roomModel.find({ createdBy: userId }).sort({ createdAt: -1 });

    return NextResponse.json(rooms, { status: 200 });
  } catch (err) {
    console.error("Error fetching my rooms:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
