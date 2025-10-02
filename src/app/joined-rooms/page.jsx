"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import UserNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function JoinedRoomPage() {
  const { user, isLoaded } = useUser();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchRooms = async () => {
      try {
        const res = await fetch(`/api/rooms/joined?userId=${user.id}`);
        const data = await res.json();

        if (res.ok) {
          setRooms(data);
          toast.success("Joined rooms loaded successfully!", {
            style: { background: "black", color: "yellow" },
          });
        } else {
          toast.error(data.error || "Failed to fetch joined rooms!", {
            style: { background: "red", color: "white" },
          });
          console.error("Error fetching joined rooms:", data.error);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch joined rooms!", {
          style: { background: "red", color: "white" },
        });
        console.error("Error fetching joined rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <p className="text-center mt-10">Loading user info...</p>;
  }

  if (loading) {
    return <p className="text-center mt-10">Loading joined rooms...</p>;
  }

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#111] p-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Joined Rooms</h1>

        {rooms.length === 0 ? (
          <p className="text-gray-400">🚀 You haven’t joined or created any room yet!</p>
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
                <p className="text-sm text-gray-400">
                  Owner: {room.createdBy === user.id ? "You" : room.owner}
                </p>
                <p className="text-gray-300 mt-1 text-sm">
                  {room.description || "No description provided"}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Members: {room.currentMembers}/{room.maxMembers}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
