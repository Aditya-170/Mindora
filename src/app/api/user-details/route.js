// src/app/api/get-user/route.js
import connectDB from "@/config/db";
import userModel from "@/models/userModel";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { clerkId } = body;

    if (!clerkId) {
      return new Response(JSON.stringify({ error: "clerkId is required" }), { status: 400 });
    }

    const user = await userModel.findOne({ clerkId });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
