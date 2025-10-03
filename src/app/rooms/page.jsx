"use client";

import UserNavbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    image: "",
    description: "",
    maxMembers: 5,
  });
  const [uploading, setUploading] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    const fetchRooms = async () => {
      if (!user) return;

      try {
        const res = await fetch(`/api/rooms?userId=${user.id}`);
        const data = await res.json();

        setRooms(data.filter((room) => room.currentMembers < room.maxMembers));
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch rooms!", {
          style: { background: "red", color: "white" },
        });
      }
    };
    fetchRooms();
  }, [user]);

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
        toast.success("Image uploaded successfully!", {
          style: { background: "black", color: "yellow" },
        });
      } else {
        toast.error(data.error || "Image upload failed!", { style: { background: "red", color: "white" } });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Image upload failed!", { style: { background: "red", color: "white" } });
    } finally {
      setUploading(false);
    }
  };

  // Create new room
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setRooms((prev) => [data, ...prev]);
        setShowForm(false);
        setFormData({ name: "", owner: "", image: "", description: "", maxMembers: 5 });
        toast.success("Room created successfully!", { style: { background: "black", color: "yellow" } });
      } else {
        toast.error(data.error || "Error creating room!", { style: { background: "red", color: "white" } });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error creating room!", { style: { background: "red", color: "white" } });
    }
  };

  const handleJoinRequest = async (roomId) => {
    try {
      const res = await fetch("/api/join-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, fromUserId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Join request sent ✅", { style: { background: "black", color: "yellow" } });
      } else {
        toast.error(data.error || "Failed to send request!", { style: { background: "red", color: "white" } });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error sending join request!", { style: { background: "red", color: "white" } });
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#111] p-4 md:p-8">
        {/* Create Room Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0 sticky top-0 bg-[#0a0a1a] z-10 p-4 md:p-6 rounded-2xl border border-yellow-500/30">
          <h1 className="text-3xl font-bold text-yellow-400">Available Rooms</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            + Create Room
          </button>
        </div>

        {/* Create Room Form */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
            <div className="bg-[#1a1a2e] p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-yellow-500/30">
              <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-6">Create New Room</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Room Name"
                  className="w-full p-3 rounded bg-[#0a0a1a] text-white border border-yellow-400"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Owner Name"
                  className="w-full p-3 rounded bg-[#0a0a1a] text-white border border-yellow-400"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  required
                />
                {/* Image Upload */}
                <div>
                  <label className="text-gray-300 mb-1 block">Upload Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="w-full p-2 rounded bg-[#0a0a1a] text-white border border-yellow-400"
                  />
                  {uploading && <p className="text-sm text-gray-400 mt-1">Uploading image...</p>}
                  {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />}
                </div>
                <textarea
                  placeholder="Room Description (10-200 chars)"
                  className="w-full p-3 rounded bg-[#0a0a1a] text-white border border-yellow-400"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Max Members"
                  className="w-full p-3 rounded bg-[#0a0a1a] text-white border border-yellow-400"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                  min={2}
                  required
                />
                <div className="flex justify-between mt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700 transition">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rooms List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms?.map((room) => (
            <div key={room._id} className="bg-[#1a1a2e] rounded-2xl p-5 shadow-lg border border-yellow-500/20">
              {room.image && <img src={room.image} alt={room.name} className="w-full h-32 object-cover rounded-xl mb-3" />}
              <h2 className="text-xl text-yellow-400 font-semibold">{room.name}</h2>
              <p className="text-sm text-gray-400">By {room.owner}</p>
              <p className="text-gray-300 mt-1 text-sm">{room.description}</p>
              <p className="text-xs text-gray-400 mt-2">Members: {room.currentMembers}/{room.maxMembers}</p>
              <button
                onClick={() => handleJoinRequest(room._id)}
                className="mt-4 w-full py-2 rounded-lg font-semibold bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
              >
                Ask to Join
              </button>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}
