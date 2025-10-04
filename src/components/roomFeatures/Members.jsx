"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"; 
import Spinner from "../Spinner";

export default function Members({ roomId }) {
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/rooms/${roomId}/members`);
        const data = await res.json();
        if (res.ok) {
          setMembers(data.members || []);
          setOwner(data.owner);
        }
      } catch (err) {
        console.error("Error fetching members:", err);
        toast.error("Failed to fetch members!", {
          style: { background: "red", color: "white" },
        });
      } finally {
        setLoading(false);
      }
    };

    if (roomId && user) fetchMembers();
  }, [roomId, user]);

  const toggleMemberSelection = (clerkId) => {
    setSelectedMembers((prev) =>
      prev.includes(clerkId)
        ? prev.filter((id) => id !== clerkId)
        : [...prev, clerkId]
    );
  };

  const handleRemoveMembers = async () => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/remove-members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: selectedMembers }),
      });
      const data = await res.json();

      if (res.ok) {
        setMembers((prev) =>
          prev.filter((m) => !selectedMembers.includes(m.clerkId))
        );
        setSelectedMembers([]);
        setRemoveModalOpen(false);

        toast.success("Member(s) removed successfully!", {
          style: { background: "black", color: "yellow" },
        });
      } else {
        toast.error(data.error || "Failed to remove members!", {
          style: { background: "red", color: "white" },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!", {
        style: { background: "red", color: "white" },
      });
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4 bg-zinc-900 rounded-xl border border-yellow-500/20">
      <h2 className="text-xl font-bold text-yellow-400 mb-4 flex justify-between items-center">
        Members
        <div className="space-x-2">

          {owner?.clerkId === user?.id && (
            <button
              onClick={() => setRemoveModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Remove Member
            </button>
          )}
        </div>
      </h2>

      {/* Owner */}
{owner && (
  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 bg-zinc-800 p-3 rounded-lg mb-3">
    <img
      src={owner.profileImage || "/default-avatar.png"}
      alt={owner.name}
      className="w-10 h-10 rounded-full border border-yellow-400"
    />
    <div className="flex-1">
      <p className="text-yellow-300 font-semibold">{owner.name}</p>
      <p className="text-sm text-gray-400">{owner.email}</p>
    </div>
    <span className="text-sm text-green-400 sm:ml-auto">Owner</span>
  </div>
)}

{/* Members */}
<ul className="space-y-3">
  {members.map((member) => (
    <li
      key={member.clerkId}
      className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 bg-zinc-800 p-3 rounded-lg"
    >
      <img
        src={member.profileImage || "/default-avatar.png"}
        alt={member.name}
        className="w-10 h-10 rounded-full border border-gray-500"
      />
      <div className="flex-1">
        <p className="text-yellow-300">{member.name}</p>
        <p className="text-sm text-gray-400">{member.email}</p>
      </div>
      <span className="text-sm text-gray-400 sm:ml-auto">Member</span>
    </li>
  ))}
</ul>


      {/* Remove Members Modal */}
      {removeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl w-96">
            <h3 className="text-xl text-yellow-400 font-bold mb-4">Remove Members</h3>
            {members.length === 0 ? (
              <p className="text-gray-400">No members to remove.</p>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {members.map((member) => (
                  <li key={member.clerkId} className="flex items-center">
                    <input
                      type="checkbox"
                      disabled={owner?.clerkId === member.clerkId}
                      className="mr-2"
                      checked={selectedMembers.includes(member.clerkId)}
                      onChange={() => toggleMemberSelection(member.clerkId)}
                    />
                    <span
                      className={owner?.clerkId === member.clerkId ? "text-gray-500" : ""}
                    >
                      {member.name} ({member.email})
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setRemoveModalOpen(false)}
                className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveMembers}
                disabled={selectedMembers.length === 0}
                className={`px-3 py-1 rounded text-white ${
                  selectedMembers.length === 0
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
