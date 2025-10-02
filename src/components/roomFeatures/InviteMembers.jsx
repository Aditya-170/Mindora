"use client"; 
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify"; // import toast

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
      toast.error("Search failed!",{
         style: { background: "red", color: "white" },
      }); // toast on error
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (email) => {
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, email, fromUserId: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Invitation sent!",{
           style: { background: "black", color: "yellow" },
        }); // success toast
      } else {
        toast.error(data.error || "Failed to invite.",{
          style: { background: "red", color: "white" },
        }); // error toast
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to invite.",{
          style: { background: "red", color: "white" },
      }); // error toast
    }
  };

  return (
    <div className="space-y-4 w-full relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by email..."
        className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-yellow-100 border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      {loading && <p className="text-sm text-gray-400 mt-1">Searching...</p>}

      {results.length > 0 && (
        <ul className="absolute top-full left-0 z-10 w-full max-h-60 overflow-y-auto mt-1 bg-zinc-900 rounded-lg border border-yellow-500 p-2">
          {results.map((user) => (
            <li
              key={user._id}
              className="flex justify-between items-center bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition"
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
      )}
    </div>
  );
}
