"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import UserNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "@/components/Spinner";

export default function MyRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return; // Wait until Clerk is ready

    const fetchRooms = async () => {
      try {
        const res = await fetch(`/api/my-rooms?userId=${user.id}`);
        const data = await res.json();

        if (res.ok) {
          setRooms(data);
        } else {
          toast.error(data.error || "Failed to fetch rooms!", { style: { background: "red", color: "white" } });
        }
      } catch (err) {
        console.error("Error:", err);
        toast.error(err.message || "Failed to fetch rooms!", { style: { background: "red", color: "white" } });
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
    return <Spinner/>;
  }

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#111] p-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">My Rooms</h1>

        {rooms.length === 0 ? (
          <p className="text-gray-400">You haven’t created any rooms yet.</p>
        ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
  {rooms.map((room) => (
    <Link
      key={room._id}
      href={`/rooms/${room._id}`}
      className="bg-[#1a1a2e] rounded-lg p-3 shadow-md border border-yellow-500/20 hover:shadow-lg transition"
    >
      {room.image && (
        <div className="w-full h-32 overflow-hidden rounded-md mb-2 flex items-center justify-center bg-gray-800">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <h2 className="text-base font-semibold text-yellow-400">{room.name}</h2>
      <p className="text-xs text-gray-400">By {room.owner}</p>
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

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
