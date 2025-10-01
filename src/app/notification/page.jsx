"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import UserNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotificationsPage() {
    const { user } = useUser();
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchInvites = async () => {
            try {
                const res = await fetch(`/api/notifications?userId=${user.id}`);
                const data = await res.json();
                if (res.ok) {
                    setInvites(data);
                } else {
                    console.error("Error fetching invites:", data.error);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInvites();
    }, [user]);

    const handleAction = async (inviteId, action) => {
        try {
            const res = await fetch(`/api/notifications/${inviteId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, userId: user.id }),
            });

            const data = await res.json();
            if (res.ok) {
                // Remove invite from list after handling
                setInvites((prev) => prev.filter((i) => i.inviteId !== inviteId));
            } else {
                console.error("Action error:", data.error);
            }
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <UserNavbar />

            {/* Main Content */}
            <main className="flex-1 bg-gradient-to-b from-[#0b1b3a] to-[#11254d] p-6 md:p-10">
                <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-8 text-center">
                    Notifications
                </h1>

                {loading ? (
                    <p className="text-center text-yellow-400 mt-10">Loading invites...</p>
                ) : invites.length === 0 ? (
                    <p className="text-center text-gray-300 mt-10">No pending invites.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {invites.map((invite) => (
                            <div
                                key={invite.inviteId}
                                className="bg-[#1e2a4b] rounded-xl p-4 border border-yellow-500/20 hover:shadow-lg hover:shadow-yellow-500/20 transition flex items-center justify-between"
                            >
                                {/* Left: Room info */}
                                <div className="flex items-center gap-4">
                                    {invite.roomImage && (
                                        <img
                                            src={invite.roomImage}
                                            alt={invite.roomName}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                                        />
                                    )}
                                    <div>
                                        <h2 className="text-lg font-semibold text-yellow-400">
                                            {invite.roomName}
                                        </h2>
                                        <p className="text-gray-300 text-sm">By {invite.roomOwner}</p>
                                    </div>
                                </div>

                                {/* Right: Accept / Reject buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAction(invite.inviteId, "accept")}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-1 rounded-lg transition"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleAction(invite.inviteId, "reject")}
                                        className="bg-gray-700 hover:bg-red-500 text-white font-semibold px-4 py-1 rounded-lg transition"
                                    >
                                        Reject
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
