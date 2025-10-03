// app/api/agora-token/route.js
import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const channelName = searchParams.get("channel");
    const uid = Number(searchParams.get("uid")) || 0;

    if (!channelName) {
      return NextResponse.json({ error: "Channel name required" }, { status: 400 });
    }

    const appID = process.env.NEXT_PUBLIC_VOICE_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appID || !appCertificate) {
      return NextResponse.json(
        { error: "Agora credentials missing in .env" },
        { status: 500 }
      );
    }

    const role = RtcRole.PUBLISHER;
    const expireTime = 60 * 60; // 1 hour
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpireTime
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
