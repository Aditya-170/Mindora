"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function InviteMembers({ roomId }) {
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/search-users?query=${value}`);
      const data = await res.json();
      if (res.ok) setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (email) => {
    try {
        console.log("Inviting", email, "to room", roomId, "from user", user.id);
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, email, fromUserId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Invitation sent!");
      } else {
        alert(data.error || "Failed to invite.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by email..."
        className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      {loading && <p className="text-sm text-gray-400">Searching...</p>}

      <ul className="space-y-2">
        {results.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center bg-zinc-900 px-4 py-2 rounded-lg border border-yellow-500/20"
          >
            <span className="text-yellow-100">{user.email}</span>
            <button
              onClick={() => handleInvite(user.email)}
              className="px-3 py-1 bg-yellow-500 text-black rounded-lg text-sm hover:bg-yellow-400 transition"
            >
              Invite
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
