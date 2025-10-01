"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import UserNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MyRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser(); 

  useEffect(() => {
    if (!isLoaded || !user) return; // ✅ wait until Clerk is ready
    // console.log("Fetching rooms for user:", user);
    const fetchRooms = async () => {
      try {
        const res = await fetch(`/api/my-rooms?userId=${user.id}`);
        const data = await res.json();
        if (res.ok) {
          setRooms(data);
        } else {
          console.error("Error fetching rooms:", data.error);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [isLoaded, user]); // ✅ run only when Clerk is ready

  if (!isLoaded) {
    return <p className="text-center mt-10">Loading user info...</p>; // ✅ safe fallback
  }

  if (loading) {
    return <p className="text-center mt-10">Loading your rooms...</p>;
  }

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#111] p-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">My Rooms</h1>

        {rooms.length === 0 ? (
          <p className="text-gray-400">You haven’t created any rooms yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Link
                key={room._id}
                href={`/rooms/${room._id}`}
                className="bg-[#1a1a2e] rounded-2xl p-5 shadow-lg border border-yellow-500/20 hover:shadow-xl transition"
              >
                {room.image && (
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-40 object-cover rounded-xl mb-3"
                  />
                )}
                <h2 className="text-xl font-semibold text-yellow-400">{room.name}</h2>
                <p className="text-sm text-gray-400">By {room.owner}</p>
                <p className="text-gray-300 mt-1 text-sm">{room.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Members: {room.currentMembers}/{room.maxMembers}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
