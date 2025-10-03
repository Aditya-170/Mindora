"use client";

import { useEffect, useState } from "react";

export default function VoiceChannel({ roomId, userId }) {
  const [client, setClient] = useState(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const initAgora = async () => {
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
      const c = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(c);
    };
    initAgora();
  }, []);

  const joinChannel = async () => {
    if (!client) return;
    const APP_ID = process.env.NEXT_PUBLIC_VOICE_APP_ID;
    const TOKEN = null;
    await client.join(APP_ID, roomId, TOKEN, userId);

    const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
    const localTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish([localTrack]);

    setJoined(true);

    client.on("user-published", async (remoteUser, mediaType) => {
      await client.subscribe(remoteUser, mediaType);
      if (mediaType === "audio") {
        remoteUser.audioTrack.play();
      }
    });
  };

  const leaveChannel = async () => {
    if (!client) return;
    await client.leave();
    setJoined(false);
  };

  return (
    <div>
      {joined ? (
        <button onClick={leaveChannel}>Leave Voice Call</button>
      ) : (
        <button onClick={joinChannel}>Join Voice Call</button>
      )}
    </div>
  );
}
