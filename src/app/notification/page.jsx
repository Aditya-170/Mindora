"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import UserNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotificationsPage() {
    const { user } = useUser();
    const [invites, setInvites] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                // Fetch Invitations
                const inviteRes = await fetch(`/api/notifications/invites?userId=${user.id}`);
                const inviteData = await inviteRes.json();

                // Fetch Requests
                const requestRes = await fetch(`/api/notifications/requests?userId=${user.id}`);
                const requestData = await requestRes.json();

                if (inviteRes.ok) setInvites(inviteData);
                if (requestRes.ok) setRequests(requestData);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleInviteAction = async (inviteId, action) => {
        try {
            const res = await fetch(`/api/notifications/invites/${inviteId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, userId: user.id }),
            });

            if (res.ok) {
                setInvites((prev) => prev.filter((i) => i.inviteId !== inviteId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRequestAction = async (requestId, action) => {
        try {
            const res = await fetch(`/api/notifications/requests/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, userId: user.id }),
            });

            if (res.ok) {
                setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <UserNavbar />

            <main className="flex-1 bg-gradient-to-b from-[#0b1b3a] to-[#11254d] p-6 md:p-10">
                <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-8 text-center">
                    Notifications
                </h1>

                {loading ? (
                    <p className="text-center text-yellow-400 mt-10">Loading...</p>
                ) : (
                    <div className="flex flex-col gap-10">

                        {/* Invitations Section */}
                        <section>
                            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Room Invitations</h2>
                            {invites.length === 0 ? (
                                <p className="text-gray-300">No pending invitations.</p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {invites.map((invite) => (
                                        <div
                                            key={invite.inviteId}
                                            className="bg-[#1e2a4b] rounded-xl p-4 border border-yellow-500/20 flex items-center justify-between"
                                        >
                                            {/* Left */}
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

                                            {/* Right */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleInviteAction(invite.inviteId, "accept")}
                                                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-1 rounded-lg"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleInviteAction(invite.inviteId, "reject")}
                                                    className="bg-gray-700 hover:bg-red-500 text-white font-semibold px-4 py-1 rounded-lg"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Requests Section */}
                        <section>
                            <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Room Requests</h2>
                            {requests.length === 0 ? (
                                <p className="text-gray-300">No pending requests.</p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {requests.map((request) => (
                                        <div
                                            key={request.requestId}
                                            className="bg-[#1e2a4b] rounded-xl p-4 border border-yellow-500/20 flex items-center justify-between"
                                        >
                                            {/* Left */}
                                            <div className="flex items-center gap-4">
                                                {request.roomImage && (
                                                    <img
                                                        src={request.roomImage}
                                                        alt={request.roomName}
                                                        className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                                                    />
                                                )}
                                                <div>
                                                    <h2 className="text-lg font-semibold text-yellow-400">
                                                        {request.roomName}
                                                    </h2>
                                                    <p className="text-gray-300 text-sm">
                                                        Owner: {request.roomOwner}
                                                    </p>
                                                    <p className="text-gray-400 text-sm italic">
                                                        Requested by: {request.userName}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right */}
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleRequestAction(request.requestId, "accept")}
                                                    className="bg-green-400 hover:bg-green-500 text-black font-semibold px-4 py-1 rounded-lg"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRequestAction(request.requestId, "reject")}
                                                    className="bg-gray-700 hover:bg-red-500 text-white font-semibold px-4 py-1 rounded-lg"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
