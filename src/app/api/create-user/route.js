// src/app/api/create-user/route.js
import connectDB from "@/config/db";
import userModel from "@/models/userModel";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json(); // get request body
    const { clerkId, firstName, lastName, email, profileImage } = body;

    const existingUser = await userModel.findOne({ clerkId });

    if (!existingUser) {
      await userModel.create({
        clerkId,
        firstName,
        lastName,
        email,
        profileImage: profileImage || "",
        badges: [],
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
