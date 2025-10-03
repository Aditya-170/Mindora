"use client";

import { useEffect, useState } from "react";

export default function VoiceChannel({ roomId, userId }) {
  const [client, setClient] = useState(null);
  const [joined, setJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  // Initialize Agora client
  useEffect(() => {
    const initAgora = async () => {
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
      const c = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(c);
    };
    initAgora();
  }, []);

  // Poll room API to check voice status every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // console.log("roomId", roomId);
        const res = await fetch(`/api/rooms/${roomId}`);
        const data = await res.json();
        setVoiceActive(data.voiceActive);
      } catch (err) {
        console.error("Error fetching room data:", err);
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [roomId]);

  const startVoiceChat = async () => {
    try {
      // Call backend API to mark voice chat as active
      await fetch(`/api/rooms/${roomId}/start-voice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      setIsHost(true);
      setVoiceActive(true);
      joinChannel();
    } catch (err) {
      console.error("Error starting voice chat:", err);
    }
  };

  const joinChannel = async () => {
    if (!client) return;

    const APP_ID = process.env.NEXT_PUBLIC_VOICE_APP_ID;
    const channel = roomId || "defaultRoom";
    const uid = userId || Math.floor(Math.random() * 100000);

    // Fetch token from backend
    const res = await fetch(`/api/agora-token?channel=${channel}&uid=${uid}`);
    const { token } = await res.json();

    await client.join(APP_ID, channel, token, uid);

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

    // If host, mark voice chat as ended
    if (isHost) {
      try {
        await fetch(`/api/rooms/${roomId}/end-voice`, {
          method: "POST",
        });
      } catch (err) {
        console.error("Error ending voice chat:", err);
      }
    }

    setIsHost(false);
    setVoiceActive(false);
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      {!voiceActive ? (
        <button
          onClick={startVoiceChat}
          className="px-6 py-2 rounded-xl font-semibold 
                     bg-gradient-to-r from-yellow-400 to-yellow-500 
                     text-blue-900 shadow-md hover:scale-105 transition"
        >
          Start Voice Chat
        </button>
      ) : !joined ? (
        <button
          onClick={joinChannel}
          className="px-6 py-2 rounded-xl font-semibold 
                     bg-gradient-to-r from-blue-500 to-blue-600 
                     text-yellow-100 shadow-md hover:scale-105 transition"
        >
          Join Voice Chat
        </button>
      ) : (
        <button
          onClick={leaveChannel}
          className="px-6 py-2 rounded-xl font-semibold 
                     bg-gradient-to-r from-yellow-400 to-yellow-500 
                     text-blue-900 shadow-md hover:scale-105 transition"
        >
          Leave Voice Chat
        </button>
      )}
    </div>
  );
}
