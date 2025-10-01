import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import userModel from "@/models/userModel";


export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    const users = await userModel.find({ email: { $regex: query, $options: "i" } })
      .limit(5)
      .select("_id email");

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}
