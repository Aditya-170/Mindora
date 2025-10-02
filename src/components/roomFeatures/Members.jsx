"use client";

import { useEffect, useState } from "react";

export default function Members({ roomId }) {
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    if (roomId) fetchMembers();
  }, [roomId]);

  if (loading) {
    return <p className="text-yellow-400 text-center">Loading members...</p>;
  }

  return (
    <div className="p-4 bg-zinc-900 rounded-xl border border-yellow-500/20">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Members</h2>

      {/* Owner */}
      {owner && (
        <div className="flex items-center space-x-3 bg-zinc-800 p-3 rounded-lg mb-3">
          <img
            src={owner.profileImage || "/default-avatar.png"}
            alt={owner.name}
            className="w-10 h-10 rounded-full border border-yellow-400"
          />
          <div>
            <p className="text-yellow-300 font-semibold">{owner.name}</p>
            <p className="text-sm text-gray-400">{owner.email}</p>
          </div>
          <span className="ml-auto text-sm text-green-400">Owner</span>
        </div>
      )}

      {/* Members */}
      {members.length === 0 ? (
        <p className="text-gray-400">No members yet.</p>
      ) : (
        <ul className="space-y-3">
          {members.map((member) => (
            <li
              key={member.clerkId}
              className="flex items-center space-x-3 bg-zinc-800 p-3 rounded-lg"
            >
              <img
                src={member.profileImage || "/default-avatar.png"}
                alt={member.name}
                className="w-10 h-10 rounded-full border border-gray-500"
              />
              <div>
                <p className="text-yellow-300">{member.name}</p>
                <p className="text-sm text-gray-400">{member.email}</p>
              </div>
              <span className="ml-auto text-sm text-gray-400">Member</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
