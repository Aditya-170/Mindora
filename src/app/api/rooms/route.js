import connectDB from "@/lib/db";
import roomModel from "@/models/roomModel";

export async function GET(req) {
  try {
    await connectDB();

    // Extract userId from query
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let query = {};

    if (userId) {
      // Exclude rooms where user is owner or already a member
      query = {
        owner: { $ne: userId },
        members: { $ne: userId },
      };
    }

    const rooms = await roomModel.find(query).sort({ createdAt: -1 });

    return new Response(JSON.stringify(rooms), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch rooms" }), { status: 500 });
  }
}
